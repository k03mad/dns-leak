#!/usr/bin/env node
import {CloudPing, IPLeak, IPWhois, NextDNS} from './api/_index.js';
import {log} from './helpers/log.js';
import * as spinner from './helpers/spinner.js';
import {formatIpInfo, formatLocationInfo, header} from './helpers/text.js';

const LeakApi = new IPLeak();
const NextApi = new NextDNS();
const WhoisApi = new IPWhois();
const CloudPingApi = new CloudPing();

const [leak, next, whois, location] = await Promise.all([
    LeakApi.getDnsInfoMulti({isSpinnerEnabled: true}),
    NextApi.getTest(),
    WhoisApi.getIpInfo(),
    CloudPingApi.getCurrentLocation(),
]);

const spinnerName = 'IP info';
spinner.start(spinnerName, true);

const dnsIps = [...new Set([...Object.keys(leak.ip), next.resolver])];

const dnsData = await Promise.all(dnsIps.map(async ip => {
    const data = await WhoisApi.getIpInfo({ip});
    spinner.count(spinnerName, dnsIps.length);
    return data;
}));

spinner.stop(spinnerName);

log(
    '',
    header('IP'),
    '',
    formatIpInfo(whois),
    '',
    header('DNS'),
    '',
    ...dnsData
        .sort((a, b) => a?.ip?.localeCompare(b?.ip))
        .flatMap(data => [formatIpInfo(data), '']),
);

if (next.ecs) {
    const data = await WhoisApi.getIpInfo({ip: next.ecs.replace(/\/.+/, '')});
    data.ip += ` (${next.ecs})`;

    log(
        header('DNS ECS'),
        '',
        formatIpInfo(data),
        '',
    );
}

log(
    header('CLOUDFRONT CDN'),
    '',
    formatLocationInfo(location),
);
