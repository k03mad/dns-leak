import {requestCache} from '@k03mad/request';

/** */
export default class IPWhois {

    /**
     * @param {object} [opts]
     * @param {number} [opts.ipRequestsCacheExpireSec] ip info requests cache ttl ms for same ip
     * @param {number} [opts.requestsRps] parallel requests rps
     */
    constructor({
        ipRequestsCacheExpireSec = 3600,
        requestsRps = 2,
    } = {}) {
        this._ipRequestsCacheExpireSec = ipRequestsCacheExpireSec;
        this._requestsRps = requestsRps;
    }

    /** */
    static get endpoints() {
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
        const ipEndpoint = IPWhois.endpoints.ip(ip);

        const {body} = await requestCache(ipEndpoint, {}, {
            expire: this._ipRequestsCacheExpireSec,
            rps: this._requestsRps,
        });

        return body;
    }

}
