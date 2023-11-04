# DNS leak test

Based on: [ipleak.net](https://ipleak.net/) / [API](https://airvpn.org/forums/topic/14737-api/)

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
import IPLeak from '@k03mad/dns-leak';

// default params (details at the link below)
const api = new IPLeak();

// get current external ip info
await api.getIpInfo();
// get other ip info
await api.getIpInfo({ip: '8.8.8.8'});

// dns leak check with one request (one request — fewer dns ips)
await api.getDnsInfoOnce();
// dns leak check with multi requests
await api.getDnsInfoMulti();
```

[Options and parameters with their default values](/app/api/IPLeak.js#L8)
