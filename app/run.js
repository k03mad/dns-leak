#!/usr/bin/env node

import {CloudPing, IPLeak, IPWhois, NextDNS, Wander} from './api/_index.js';
import {log} from './helpers/log.js';
import * as spinner from './helpers/spinner.js';
import {formatIpInfo, formatLocationInfo, header} from './helpers/text.js';

const LeakApi = new IPLeak();
const NextApi = new NextDNS();
const WhoisApi = new IPWhois();
const CloudPingApi = new CloudPing();
const WanderApi = new Wander();

const [leak, next, whois, location, dnssec] = await Promise.allSettled([
    LeakApi.getDnsInfoMulti({isSpinnerEnabled: true}),
    NextApi.getTest(),
    WhoisApi.getIpInfo(),
    CloudPingApi.getCurrentLocation(),
    WanderApi.checkDNSSEC(),
]);

const spinnerName = 'IP info';
spinner.start(spinnerName, true);

const dnsIps = [
    ...new Set([
        ...Object.keys(leak.value?.ip || []),
        next.value?.resolver || '',
    ]),
].filter(Boolean);

const dnsIpsInfo = await Promise.all(dnsIps.map(async ip => {
    try {
        const data = await WhoisApi.getIpInfo({ip});
        spinner.count(spinnerName, dnsIps.length);
        return data;
    } catch {}
}));

const dnsIpsInfoFormatted = dnsIpsInfo
    .filter(Boolean)
    .sort((a, b) => a?.ip?.localeCompare(b?.ip))
    .flatMap(data => formatIpInfo(data));

const output = [];

if (whois.value) {
    output.push(
        header('IP'),
        formatIpInfo(whois.value),
    );
}

if (dnsIpsInfoFormatted.length > 0) {
    output.push(
        header('DNS'),
        ...dnsIpsInfoFormatted,
    );
}

if (next.value?.ecs) {
    try {
        const data = await WhoisApi.getIpInfo({ip: next.value.ecs.replace(/\/.+/, '')});
        data.ip += ` (${next.value.ecs})`;

        output.push(
            header('DNS ECS'),
            formatIpInfo(data),
        );
    } catch {}
}

if (dnssec.value?.name) {
    output.push(
        header('DNSSEC'),
        dnssec.value.color(dnssec.value.name),
    );
}

if (location.value) {
    output.push(
        header('CLOUDFRONT CDN'),
        formatLocationInfo(location.value),
    );
}

spinner.stop(spinnerName);
log(`\n${output.join('\n\n')}`);
