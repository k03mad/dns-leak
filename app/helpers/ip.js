/* eslint-disable camelcase */

import chalk from 'chalk';
import clm from 'country-locale-map';

const {blue, green} = chalk;

/**
 * @param {object} [ipInfo]
 * @param {string} [ipInfo.city_name]
 * @param {string} [ipInfo.country_code]
 * @param {string} [ipInfo.country_name]
 * @param {string} [ipInfo.ip]
 * @param {string} [ipInfo.isp_name]
 * @param {string} [ipInfo.region_name]
 */
export const formatIpInfo = ({city_name, country_code, country_name, ip, isp_name, region_name} = {}) => {
    let output = '';

    if (ip) {
        output += `${blue(ip)} `;
    }

    if (isp_name) {
        output += green(isp_name);
    }

    output += '\n';

    if (country_code) {
        const {emoji} = clm.getCountryByAlpha2(country_code);

        if (emoji) {
            output += `${emoji}  `;
        }
    }

    output += [
        ...new Set([
            country_name,
            region_name,
            city_name,
        ]),
    ].filter(Boolean).join(' :: ');

    return output;
};
