import {request, requestCache} from '@k03mad/request';
import {customAlphabet} from 'nanoid';
import {lowercase, numbers} from 'nanoid-dictionary';

/** */
export default class IPLeak {

    /**
     * @param {number} [ipRequestsRps]
     * @param {number} [ipRequestsCacheExpireMs]
     * @param {number} [dnsRequestsCount]
     * @param {number} [dnsRequestsRps]
     * @param {number} [dnsSessionStringLength]
     * @param {number} [dnsUniqStringLength]
     */
    constructor(
        ipRequestsRps = 2,
        ipRequestsCacheExpireMs = 3_600_000,
        dnsRequestsCount = 30,
        dnsRequestsRps = 2,
        dnsSessionStringLength = 40,
        dnsUniqStringLength = 20,
    ) {
        this._ipRequestsRps = ipRequestsRps;
        this._ipRequestsCacheExpireMs = ipRequestsCacheExpireMs;
        this._dnsRequestsCount = dnsRequestsCount;
        this._dnsRequestsRps = dnsRequestsRps;
        this._dnsUniqStringLength = dnsUniqStringLength;
        this._dnsSessionStringLength = dnsSessionStringLength;
    }

    /** */
    get _endpoints() {
        return {
            info: (ip = '') => `https://ipleak.net/json/${ip}`,
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
     * @param {string} ip
     * @returns {Promise<object>}
     */
    async getIpInfo(ip) {
        const ipEndpoint = this._endpoints.info(ip);

        const {body} = await requestCache(ipEndpoint, {}, {
            expire: this._ipRequestsCacheExpireMs,
            rps: this._ipRequestsRps,
        });

        return body;
    }

    /**
     * @param {string} [session]
     * @param {string} [uniqString]
     * @returns {Promise<object>}
     */
    async getDnsInfoOnce(session = this._dnsSessionString, uniqString = this._dnsUniqString) {
        const dnsEndpoint = this._endpoints.dns(session, uniqString);

        const {body} = await request(dnsEndpoint, {}, {queueBy: session, rps: this._dnsRequestsRps});
        return body;
    }

    /**
     * @param {string} [session]
     * @returns {Promise<object>}
     */
    async getDnsInfoMulti(session = this._dnsSessionString) {
        const arrayFromLen = Array.from({length: this._dnsRequestsCount});
        await Promise.all(arrayFromLen.map(() => this.getDnsInfoOnce(session)));

        const info = await this.getDnsInfoOnce(session);
        return info;
    }

}
