import {request} from '@k03mad/request';
import chalk from 'chalk';

const {green, red, yellow} = chalk;

/** */
export default class Wander {

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
    static get endpoints() {
        return {

            /** */
            sigfail: () => 'https://sigfail.rsa2048-sha256.ippacket.stream/noerror.png',
        };
    }

    /**
     * @returns {Promise<object>}
     */
    async checkDNSSEC() {
        const testEndpoint = Wander.endpoints.sigfail();

        try {
            await request(testEndpoint, {}, {
                rps: this._requestsRps,
            });

            return {name: 'OFF', code: 0, color: red};
        } catch (err) {
            if (err.code === 'ESERVFAIL') {
                return {name: 'ON', code: 1, color: green};
            }

            return {name: 'unknown', code: -1, color: yellow};
        }
    }

}
