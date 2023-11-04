import {request} from '@k03mad/request';

/** */
export default class CloudPing {

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
            edge: () => 'https://edge.feitsui.com/',

            /** */
            locations: () => 'https://www.cloudping.cloud/cloudfront-edge-locations.json',
        };
    }

    /**
     * @returns {Promise<string>}
     */
    async getCurrentIataCode() {
        const testEndpoint = this._endpoints.edge();

        const {headers} = await request(testEndpoint, {}, {
            rps: this._requestsRps,
        });

        return headers['x-amz-cf-pop'];
    }

    /**
     * @returns {Promise<object>}
     */
    async getAllLocations() {
        const locationsEndpoint = this._endpoints.locations();

        const {body} = await request(locationsEndpoint, {}, {
            rps: this._requestsRps,
        });

        return body.nodes;
    }

    /**
     * @returns {Promise<object>}
     */
    async getCurrentLocation() {
        const [iata, locations] = await Promise.all([
            this.getCurrentIataCode(),
            this.getAllLocations(),
        ]);

        return {...locations[iata.replace(/\d.+/, '')], iata};
    }

}
