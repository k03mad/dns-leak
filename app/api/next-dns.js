export default class NextDNS {
    static get endpoints() {
        return {
            test: () => 'https://test.nextdns.io/',
        };
    }

    /** @returns {Promise<object>} */
    async getTest() {
        const testEndpoint = NextDNS.endpoints.test();

        const response = await fetch(testEndpoint);
        return response.json();
    }
}
