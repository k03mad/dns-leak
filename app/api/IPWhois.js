import {requestCache} from '@k03mad/request';

/** */
export default class IPWhois {

    /**
     * @param {object} [opts]
     * @param {number} [opts.ipRequestsCacheExpireMs] ip info requests cache ttl ms for same ip
     * @param {number} [opts.ipRequestsRps] ip info requests rps
     */
    constructor({
        ipRequestsCacheExpireMs = 3_600_000,
        ipRequestsRps = 2,
    } = {}) {
        this._ipRequestsCacheExpireMs = ipRequestsCacheExpireMs;
        this._ipRequestsRps = ipRequestsRps;
    }

    /** */
    get _endpoints() {
        return {

            /** @param {string} ip */
            ip: ip => `https://ipwho.is/${ip}`,
        };
    }

    /**
     * @param {object} [opts]
     * @param {string} [opts.ip]
     * @returns {Promise<object>}
     */
    async getIpInfo({ip = ''} = {}) {
        const ipEndpoint = this._endpoints.ip(ip);

        const {body} = await requestCache(ipEndpoint, {}, {
            expire: this._ipRequestsCacheExpireMs,
            rps: this._ipRequestsRps,
        });

        return body;
    }

}
