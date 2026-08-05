import type {ReqOutput} from '@k03mad/ip2geo';
import {customAlphabet} from 'nanoid';
import {lowercase, numbers} from 'nanoid-dictionary';
import pMap from 'p-map';

import {sleep} from '../helpers/promise.ts';
import * as spinner from '../helpers/spinner.ts';

interface DnsInfo {
  ip?: Record<string, unknown>;
}

interface IPLeakOptions {
  dnsRequestsCount?: number;
  dnsRequestsWaitBeforeLastMs?: number;
  dnsSessionStringLength?: number;
  dnsUniqStringLength?: number;
  requestsRps?: number;
}

interface DnsInfoMultiOptions {
  isSpinnerEnabled?: boolean;
  session?: string;
}

interface DnsInfoOnceOptions {
  session?: string;
  uniqString?: string;
}

export default class IPLeak {
  private readonly dnsRequestsCount: number;
  private readonly dnsRequestsWaitBeforeLastMs: number;
  private readonly dnsSessionStringLength: number;
  private readonly dnsUniqStringLength: number;
  private readonly requestsRps: number;

  public constructor({
    dnsRequestsCount = 30,
    dnsRequestsWaitBeforeLastMs = 2000,
    dnsSessionStringLength = 40,
    dnsUniqStringLength = 20,
    requestsRps = 2,
  }: IPLeakOptions = {}) {
    this.dnsRequestsCount = dnsRequestsCount;
    this.dnsRequestsWaitBeforeLastMs = dnsRequestsWaitBeforeLastMs;
    this.dnsSessionStringLength = dnsSessionStringLength;
    this.dnsUniqStringLength = dnsUniqStringLength;
    this.requestsRps = requestsRps;
  }

  public static get endpoints(): {
    dns: (session: string, uniq: string) => string;
    ip: (ip: string) => string;
  } {
    return {
      dns: (session: string, uniq: string): string =>
        `https://${session}-${uniq}.ipleak.net/dnsdetection/`,
      ip: (ip: string): string => `https://ipleak.net/json/${ip}`,
    };
  }

  private get dnsSessionString(): string {
    return customAlphabet(lowercase + numbers, this.dnsSessionStringLength)();
  }

  private get dnsUniqString(): string {
    return customAlphabet(lowercase + numbers, this.dnsUniqStringLength)();
  }

  public async getDnsInfoMulti({
    isSpinnerEnabled,
    session = this.dnsSessionString,
  }: DnsInfoMultiOptions = {}): Promise<DnsInfo> {
    const spinnerName = 'DNS info';
    const arrayFromLen = Array.from({length: this.dnsRequestsCount - 1});

    spinner.start(spinnerName, isSpinnerEnabled);

    await pMap(
      arrayFromLen,
      async () => {
        await this.getDnsInfoOnce({session});
        spinner.count(spinnerName, this.dnsRequestsCount);
      },
      {concurrency: this.requestsRps},
    );

    await sleep(this.dnsRequestsWaitBeforeLastMs);
    const info = await this.getDnsInfoOnce({session});

    spinner.stop(spinnerName);
    return info;
  }

  public async getDnsInfoOnce({
    session = this.dnsSessionString,
    uniqString = this.dnsUniqString,
  }: DnsInfoOnceOptions = {}): Promise<DnsInfo> {
    const dnsEndpoint = IPLeak.endpoints.dns(session, uniqString);

    const response = await fetch(dnsEndpoint);
    return (await response.json()) as DnsInfo;
  }

  public async getIpInfo({ip = ''}: {ip?: string} = {}): Promise<ReqOutput> {
    const ipEndpoint = IPLeak.endpoints.ip(ip);

    const response = await fetch(ipEndpoint);
    return (await response.json()) as ReqOutput;
  }
}
