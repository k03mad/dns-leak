import {request, requestCache} from '@k03mad/request';
import {customAlphabet} from 'nanoid';
import {lowercase, numbers} from 'nanoid-dictionary';

import {sleep} from '../helpers/promise.js';
import * as spinner from '../helpers/spinner.js';

/** */
export default class IPLeak {

    /**
     * @param {object} [opts]
     * @param {number} [opts.dnsRequestsCount] dns leak multi requests count with one session
     * @param {number} [opts.dnsRequestsWaitBeforeLastMs] dns leak multi requests wait before the last request (with all ips gathered)
     * @param {number} [opts.dnsSessionStringLength] dns leak session string length, only works with 40 characters for now
     * @param {number} [opts.dnsUniqStringLength] dns leak unique string length for subdomain
     * @param {number} [opts.ipRequestsCacheExpireMs] ip info requests cache ttl ms for same ip
     * @param {number} [opts.requestsRps] parallel requests rps
     */
    constructor({
        dnsRequestsCount = 30,
        dnsRequestsWaitBeforeLastMs = 2000,
        dnsSessionStringLength = 40,
        dnsUniqStringLength = 20,
        ipRequestsCacheExpireMs = 3_600_000,
        requestsRps = 2,
    } = {}) {
        this._dnsRequestsCount = dnsRequestsCount;
        this._dnsRequestsWaitBeforeLastMs = dnsRequestsWaitBeforeLastMs;
        this._dnsSessionStringLength = dnsSessionStringLength;
        this._dnsUniqStringLength = dnsUniqStringLength;
        this._ipRequestsCacheExpireMs = ipRequestsCacheExpireMs;
        this._requestsRps = requestsRps;
    }

    /** */
    static get endpoints() {
        return {

            /** @param {string} ip */
            ip: ip => `https://ipleak.net/json/${ip}`,

            /**
             * @param {string} session
             * @param {string} uniq
             */
            dns: (session, uniq) => `https://${session}-${uniq}.ipleak.net/dnsdetection/`,
        };
    }

    /** */
    get _dnsSessionString() {
        return customAlphabet(lowercase + numbers, this._dnsSessionStringLength)();
    }

    /** */
    get _dnsUniqString() {
        return customAlphabet(lowercase + numbers, this._dnsUniqStringLength)();
    }

    /**
     * @param {object} [opts]
     * @param {string} [opts.ip]
     * @returns {Promise<object>}
     */
    async getIpInfo({ip = ''} = {}) {
        const ipEndpoint = IPLeak.endpoints.ip(ip);

        const {body} = await requestCache(ipEndpoint, {}, {
            expire: this._ipRequestsCacheExpireMs,
            rps: this._requestsRps,
        });

        return body;
    }

    /**
     * @param {object} [opts]
     * @param {string} [opts.session]
     * @param {string} [opts.uniqString]
     * @returns {Promise<object>}
     */
    async getDnsInfoOnce({session = this._dnsSessionString, uniqString = this._dnsUniqString} = {}) {
        const dnsEndpoint = IPLeak.endpoints.dns(session, uniqString);

        const {body} = await request(dnsEndpoint, {}, {
            queueBy: session,
            rps: this._requestsRps,
        });

        return body;
    }

    /**
     * @param {object} [opts]
     * @param {string} [opts.session]
     * @param {boolean} [opts.isSpinnerEnabled]
     * @returns {Promise<object>}
     */
    async getDnsInfoMulti({isSpinnerEnabled, session = this._dnsSessionString} = {}) {
        const spinnerName = 'DNS info';
        const arrayFromLen = Array.from({length: this._dnsRequestsCount - 1});

        spinner.start(spinnerName, isSpinnerEnabled);

        await Promise.all(arrayFromLen.map(async () => {
            await this.getDnsInfoOnce({session});
            spinner.count(spinnerName, this._dnsRequestsCount);
        }));

        await sleep(this._dnsRequestsWaitBeforeLastMs);
        const info = await this.getDnsInfoOnce({session});

        spinner.stop(spinnerName);
        return info;
    }

}
