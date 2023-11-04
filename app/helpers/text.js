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
export const org = msg => green(msg);

/**
 * @param {string} msg
 */
export const address = msg => blue(msg);

/**
 * @param {object} [ipInfo]
 * @param {object} [ipInfo.connection]
 * @param {object} [ipInfo.flag]
 * @param {string} [ipInfo.city]
 * @param {string} [ipInfo.country]
 * @param {string} [ipInfo.ip]
 * @param {string} [ipInfo.region]
 */
export const formatIpInfo = ({
    city,
    connection,
    country,
    flag,
    ip,
    region,
} = {}) => {
    let output = '';

    if (ip) {
        output += `${address(ip)}\n`;
    }

    if (connection?.org) {
        output += `${org(connection.org)} `;
    }

    if (connection?.isp && !connection?.org?.includes(connection?.isp)) {
        if (connection?.org) {
            output += org('/ ');
        }

        output += `${org(connection.isp)} `;
    }

    if (connection?.domain) {
        output += info(`(${connection.domain})`);
    }

    output += '\n';

    if (flag?.emoji) {
        output += `${flag.emoji}  `;
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
        output += `${org(iata)}\n`;
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
