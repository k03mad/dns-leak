interface NextDnsInfo {
  ecs?: string;
  resolver?: string;
}

export default class NextDNS {
  public static get endpoints(): {test: () => string} {
    return {
      test: (): string => 'https://test.nextdns.io/',
    };
  }

  public async getTest(): Promise<NextDnsInfo> {
    const testEndpoint = NextDNS.endpoints.test();

    const response = await fetch(testEndpoint);
    return (await response.json()) as NextDnsInfo;
  }
}
