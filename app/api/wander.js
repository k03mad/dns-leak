import chalk from 'chalk';

const {green, red, yellow} = chalk;

export default class Wander {
    static get endpoints() {
        return {
            sigfail: () => 'https://sigfail.rsa2048-sha256.ippacket.stream/noerror.png',
        };
    }

    /** @returns {Promise<object>} */
    async checkDNSSEC() {
        const testEndpoint = Wander.endpoints.sigfail();

        try {
            await fetch(testEndpoint);

            return {code: 0, color: red, name: 'OFF'};
        } catch (err) {
            if (err.code === 'ESERVFAIL' || err.cause?.code === 'ESERVFAIL') {
                return {code: 1, color: green, name: 'ON'};
            }

            return {code: -1, color: yellow, name: 'unknown'};
        }
    }
}
