import chalk from 'chalk';
import clm from 'country-locale-map';

const {blue, gray, green, magenta, yellow} = chalk;
const SEPARATOR = ' :: ';

/**
 * @param {string} msg
 */
export const header = msg => magenta.bold.bgBlackBright(` ${msg}`.padEnd(25, ' '));

/**
 * @param {string} msg
 */
export const bar = msg => yellow(msg);

/**
 * @param {string} msg
 */
export const info = msg => gray(msg);

/**
 * @param {string} msg
 */
export const orgIsp = msg => green(msg);

/**
 * @param {string} msg
 */
export const address = msg => blue(msg);

/**
 * @param {object} [ipInfo]
 * @param {string} [ipInfo.ip]
 * @param {string} [ipInfo.country]
 * @param {string} [ipInfo.countryEmoji]
 * @param {string} [ipInfo.city]
 * @param {string} [ipInfo.region]
 * @param {string} [ipInfo.connectionOrg]
 * @param {string} [ipInfo.connectionIsp]
 * @param {string} [ipInfo.connectionDomain]
 */
export const formatIpInfo = ({
    ip,
    country,
    countryEmoji,
    city,
    region,
    connectionOrg,
    connectionIsp,
    connectionDomain,
} = {}) => {
    let output = '';

    if (ip) {
        output += `${address(ip)}\n`;
    }

    if (connectionOrg) {
        output += `${orgIsp(connectionOrg)} `;
    }

    if (connectionIsp && !connectionOrg?.includes(connectionIsp)) {
        if (connectionOrg) {
            output += orgIsp('/ ');
        }

        output += `${orgIsp(connectionIsp)} `;
    }

    if (connectionDomain) {
        output += info(`(${connectionDomain})`);
    }

    output += '\n';

    if (countryEmoji) {
        output += `${countryEmoji}  `;
    }

    output += [
        ...new Set([
            country,
            region,
            city,
        ]),
    ].filter(Boolean).join(SEPARATOR);

    return output;
};

/**
 * @param {object} [opts]
 * @param {string} [opts.iata]
 * @param {string} [opts.city]
 * @param {string} [opts.country]
 */
export const formatLocationInfo = ({city, country, iata}) => {
    let output = '';

    if (iata) {
        output += `${orgIsp(iata)}\n`;
    }

    if (country) {
        const {emoji} = clm.getCountryByName(country);

        if (emoji) {
            output += `${emoji}  `;
        }

        output += country;
    }

    if (city) {
        output += SEPARATOR + city;
    }

    return output;
};
