import chalk from 'chalk';

const {bgBlackBright, blue, gray, green, magenta, yellow} = chalk;

/**
 * @param {any} msg
 */
export const header = msg => bgBlackBright(magenta(` ${msg} `));

/**
 * @param {any} msg
 */
export const bar = msg => yellow(msg);

/**
 * @param {object} [ipInfo]
 * @param {string} [ipInfo.city]
 * @param {string} [ipInfo.country]
 * @param {string} [ipInfo.ip]
 * @param {string} [ipInfo.region]
 * @param {object} [ipInfo.flag]
 * @param {object} [ipInfo.connection]
 */
export const formatIpInfo = ({city, connection, country, flag, ip, region} = {}) => {
    let output = '';

    if (ip) {
        output += `${blue(ip)}\n`;
    }

    if (connection?.org) {
        output += `${green(connection.org)} `;
    }

    if (connection?.isp && !connection?.org?.includes(connection?.isp)) {
        if (connection?.org) {
            output += green('/ ');
        }

        output += `${green(connection.isp)} `;
    }

    if (connection?.domain) {
        output += gray(`(${connection.domain})`);
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
    ].filter(Boolean).join(' :: ');

    return output;
};
