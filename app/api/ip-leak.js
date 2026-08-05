import {customAlphabet} from 'nanoid';
import {lowercase, numbers} from 'nanoid-dictionary';
import pMap from 'p-map';

import {sleep} from '../helpers/promise.js';
import * as spinner from '../helpers/spinner.js';

export default class IPLeak {
    /**
     * @param {object} [opts]
     * @param {number} [opts.dnsRequestsCount] Dns leak multi requests count with one session
     * @param {number} [opts.dnsRequestsWaitBeforeLastMs] Dns leak multi requests wait before the
     *   last request (with all ips gathered)
     * @param {number} [opts.dnsSessionStringLength] Dns leak session string length, only works with
     *   40 characters for now
     * @param {number} [opts.dnsUniqStringLength] Dns leak unique string length for subdomain
     * @param {number} [opts.requestsRps] Parallel DNS requests concurrency
     */
    constructor({
        dnsRequestsCount = 30,
        dnsRequestsWaitBeforeLastMs = 2000,
        dnsSessionStringLength = 40,
        dnsUniqStringLength = 20,
        requestsRps = 2,
    } = {}) {
        this._dnsRequestsCount = dnsRequestsCount;
        this._dnsRequestsWaitBeforeLastMs = dnsRequestsWaitBeforeLastMs;
        this._dnsSessionStringLength = dnsSessionStringLength;
        this._dnsUniqStringLength = dnsUniqStringLength;
        this._requestsRps = requestsRps;
    }

    static get endpoints() {
        return {
            /**
             * @param {string} session
             * @param {string} uniq
             */
            dns: (session, uniq) => `https://${session}-${uniq}.ipleak.net/dnsdetection/`,

            /** @param {string} ip */
            ip: ip => `https://ipleak.net/json/${ip}`,
        };
    }

    get _dnsSessionString() {
        return customAlphabet(lowercase + numbers, this._dnsSessionStringLength)();
    }

    get _dnsUniqString() {
        return customAlphabet(lowercase + numbers, this._dnsUniqStringLength)();
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

        await pMap(
            arrayFromLen,
            async () => {
                await this.getDnsInfoOnce({session});
                spinner.count(spinnerName, this._dnsRequestsCount);
            },
            {concurrency: this._requestsRps},
        );

        await sleep(this._dnsRequestsWaitBeforeLastMs);
        const info = await this.getDnsInfoOnce({session});

        spinner.stop(spinnerName);
        return info;
    }

    /**
     * @param {object} [opts]
     * @param {string} [opts.session]
     * @param {string} [opts.uniqString]
     * @returns {Promise<object>}
     */
    async getDnsInfoOnce({
        session = this._dnsSessionString,
        uniqString = this._dnsUniqString,
    } = {}) {
        const dnsEndpoint = IPLeak.endpoints.dns(session, uniqString);

        const response = await fetch(dnsEndpoint);
        return response.json();
    }

    /**
     * @param {object} [opts]
     * @param {string} [opts.ip]
     * @returns {Promise<object>}
     */
    async getIpInfo({ip = ''} = {}) {
        const ipEndpoint = IPLeak.endpoints.ip(ip);

        const response = await fetch(ipEndpoint);
        return response.json();
    }
}
