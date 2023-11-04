#!/usr/bin/env node

import IPLeak from './api/IPLeak.js';
import {log} from './helpers/log.js';
import * as spinner from './helpers/spinner.js';
import {formatIpInfo, header} from './helpers/text.js';

const api = new IPLeak();

const currentIpInfo = await api.getIpInfo();

log(
    '',
    header('IP'),
    '',
    formatIpInfo(currentIpInfo),
    '',
    header('DNS'),
    '',
);

const dnsInfo = await api.getDnsInfoMulti({isSpinnerEnabled: true});
const dnsIps = [...new Set(Object.keys(dnsInfo.ip))];

spinner.start(currentIpInfo.ip, true);

const dnsData = await Promise.all(dnsIps.map(async ip => {
    const data = await api.getIpInfo({ip});
    spinner.count(currentIpInfo.ip, dnsIps.length);
    return data;
}));

spinner.stop(currentIpInfo.ip);

dnsData
    .sort((a, b) => a?.ip?.localeCompare(b?.ip))
    .forEach(data => log(formatIpInfo(data), ''));
