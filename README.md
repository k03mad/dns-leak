# DNS leak test

Based on:\
— [ipleak.net](https://ipleak.net) ([API](https://airvpn.org/forums/topic/14737-api))\
— [ipwhois.io](https://ipwhois.io) ([API](https://ipwhois.io/documentation))

## Global

```bash
npm i @k03mad/dns-leak -g

dns-leak
```

## API

```bash
npm i @k03mad/dns-leak
```

```js
import {IPLeak, IPWhois} from '@k03mad/dns-leak';

// default params (details at the ./app/api folder)
const LeakApi = new IPLeak();
const WhoisApi = new IPWhois();

// get current external ip info
await WhoisApi.getIpInfo();
await LeakApi.getIpInfo();
// get other ip info
await WhoisApi.getIpInfo({ip: '8.8.8.8'});
await LeakApi.getIpInfo({ip: '8.8.8.8'});

// dns leak check with one request (one request — fewer dns ips)
await LeakApi.getDnsInfoOnce();
// dns leak check with multi requests
await LeakApi.getDnsInfoMulti();
```
