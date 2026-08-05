export default class CloudPing {
    /** @returns {Promise<object>} */
    async getAllLocations() {
        const locationsEndpoint = CloudPing.endpoints.locations();

        const response = await fetch(locationsEndpoint);
        const body = await response.json();

        return body.nodes;
    }

    /** @returns {Promise<string>} */
    async getCurrentIataCode() {
        const testEndpoint = CloudPing.endpoints.edge();

        const response = await fetch(testEndpoint);
        return response.headers.get('x-amz-cf-pop');
    }

    /** @returns {Promise<object>} */
    async getCurrentLocation() {
        const [iata, locations] = await Promise.all([
            this.getCurrentIataCode(),
            this.getAllLocations(),
        ]);

        return {...locations[iata.replace(/\d.+/, '')], iata};
    }

    static get endpoints() {
        return {
            edge: () => 'https://edge.feitsui.com/',

            locations: () => 'https://www.cloudping.cloud/cloudfront-edge-locations.json',
        };
    }
}
