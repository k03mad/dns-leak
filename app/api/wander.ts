import chalk from 'chalk';

interface DnssecInfo {
  code: -1 | 0 | 1;
  color: (text: string) => string;
  name: 'OFF' | 'ON' | 'unknown';
}

const {green, red, yellow} = chalk;

export default class Wander {
  public static get endpoints(): {sigfail: () => string} {
    return {
      sigfail: (): string => 'https://sigfail.rsa2048-sha256.ippacket.stream/noerror.png',
    };
  }

  public async checkDNSSEC(): Promise<DnssecInfo> {
    const testEndpoint = Wander.endpoints.sigfail();

    try {
      await fetch(testEndpoint);

      return {code: 0, color: red, name: 'OFF'};
    } catch (err) {
      const error = err as {cause?: {code?: unknown}; code?: unknown};

      if (error.code === 'ESERVFAIL' || error.cause?.code === 'ESERVFAIL') {
        return {code: 1, color: green, name: 'ON'};
      }

      return {code: -1, color: yellow, name: 'unknown'};
    }
  }
}
