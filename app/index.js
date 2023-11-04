#!/usr/bin/env node

import IPLeak from './api/IPLeak.js';
import {formatIpInfo} from './helpers/ip.js';
import {log, logHeader} from './helpers/log.js';

const api = new IPLeak();

const currentIpInfo = await api.getIpInfo();

logHeader('IP');
log(formatIpInfo(currentIpInfo));

const dnsInfo = await api.getDnsInfoMulti();
const dnsIps = [...new Set(Object.keys(dnsInfo.ip))];

logHeader('DNS');

const dnsData = await Promise.all(dnsIps.map(ip => api.getIpInfo(ip)));

dnsData
    .sort((a, b) => a?.ip?.localeCompare(b?.ip))
    .forEach(data => log(formatIpInfo(data), '\n'));
