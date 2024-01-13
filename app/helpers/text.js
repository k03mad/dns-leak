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
 * @param {string} [ipInfo.city]
 * @param {string} [ipInfo.country]
 * @param {string} [ipInfo.emoji]
 * @param {string} [ipInfo.ip]
 * @param {string} [ipInfo.isp]
 * @param {string} [ipInfo.ispDomain]
 * @param {string} [ipInfo.org]
 * @param {string} [ipInfo.region]
 */
export const formatIpInfo = ({
    city,
    country,
    emoji,
    ip,
    isp,
    ispDomain,
    org,
    region,
} = {}) => {
    let output = '';

    if (ip) {
        output += `${address(ip)}\n`;
    }

    if (org) {
        output += `${orgIsp(org)} `;
    }

    if (isp && !org?.includes(isp)) {
        if (org) {
            output += orgIsp('/ ');
        }

        output += `${orgIsp(isp)} `;
    }

    if (ispDomain) {
        output += info(`(${ispDomain})`);
    }

    output += '\n';

    if (emoji) {
        output += `${emoji}  `;
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
