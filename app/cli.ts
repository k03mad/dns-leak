import {ip2geo, type ReqOutput} from '@k03mad/ip2geo';

import {CloudPing, IPLeak, NextDNS, Wander} from './api/_index.ts';
import {formatIpInfo, formatLocationInfo, header} from './helpers/text.ts';

const getValue = <T>(result: PromiseSettledResult<T>): T | undefined =>
  result.status === 'fulfilled' ? result.value : undefined;

const LeakApi = new IPLeak();
const NextApi = new NextDNS();
const CloudPingApi = new CloudPing();
const WanderApi = new Wander();

const [leakResult, nextResult, geoipResult, locationResult, dnssecResult] =
  await Promise.allSettled([
    LeakApi.getDnsInfoMulti({isSpinnerEnabled: true}),
    NextApi.getTest(),
    ip2geo(),
    CloudPingApi.getCurrentLocation(),
    WanderApi.checkDNSSEC(),
  ]);

const leak = getValue(leakResult);
const next = getValue(nextResult);
const geoip = getValue(geoipResult);
const location = getValue(locationResult);
const dnssec = getValue(dnssecResult);

const dnsIps = [...new Set([next?.resolver ?? '', ...Object.keys(leak?.ip ?? {})])].filter(Boolean);

const dnsIpsInfo = await Promise.all(
  dnsIps.map(async ip => {
    try {
      return await ip2geo({ip});
    } catch {
      return null;
    }
  }),
);

const dnsIpsInfoFormatted = dnsIpsInfo
  .filter((data): data is ReqOutput => data !== null)
  .toSorted((a, b) => a.ip?.localeCompare(b.ip ?? '') ?? 0)
  .flatMap(data => formatIpInfo(data));

const output: string[] = [];

if (geoip) {
  output.push(header('IP'), formatIpInfo(geoip));
}

if (dnsIpsInfoFormatted.length > 0) {
  output.push(header('DNS'), ...dnsIpsInfoFormatted);
}

if (next?.ecs) {
  try {
    const data = await ip2geo({ip: next.ecs.replace(/\/.+/, '')});
    data.ip = `${data.ip ?? ''} (${next.ecs})`;

    output.push(header('DNS ECS'), formatIpInfo(data));
  } catch {}
}

if (dnssec) {
  output.push(header('DNSSEC'), dnssec.color(dnssec.name));
}

if (location) {
  output.push(header('CLOUDFRONT CDN'), formatLocationInfo(location));
}

console.log(`\n${output.join('\n\n')}`);
