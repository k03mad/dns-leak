import {request} from '@k03mad/request';

/** */
export default class NextDNS {

    /**
     * @param {object} [opts]
     * @param {number} [opts.requestsRps] parallel requests rps
     */
    constructor({
        requestsRps = 2,
    } = {}) {
        this._requestsRps = requestsRps;
    }

    /** */
    get _endpoints() {
        return {

            /** */
            test: () => 'https://test.nextdns.io/',
        };
    }

    /**
     * @returns {Promise<object>}
     */
    async getTest() {
        const testEndpoint = this._endpoints.test();

        const {body} = await request(testEndpoint, {}, {
            rps: this._requestsRps,
        });

        return body;
    }

}
