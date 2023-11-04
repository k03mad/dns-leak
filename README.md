# DNS leak test

Using API/tools:\
— [ipleak.net](https://airvpn.org/forums/topic/14737-api)\
— [ipwhois.io](https://ipwhois.io/documentation)\
— [cloudping.cloud](https://www.cloudping.cloud/cdn)\
— [nextdns.io](https://test.nextdns.io/)

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
import {CloudPing, IPLeak, IPWhois, NextDNS} from '@k03mad/dns-leak';
```

Details at [./app/api](/app/api) folder
