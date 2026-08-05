import type {ReqOutput} from '@k03mad/ip2geo';
import chalk from 'chalk';
import clm from 'country-locale-map';

import type {CloudPingLocation} from '../api/cloud-ping.ts';

const {blue, gray, green, magenta, yellow} = chalk;
const SEPARATOR = ' :: ';

export const header = (msg: string): string =>
  magenta.bold.bgBlackBright(` ${msg}`.padEnd(25, ' '));

export const bar = (msg: string): string => yellow(msg);

export const info = (msg: string): string => gray(msg);

export const orgIsp = (msg: string): string => green(msg);

export const address = (msg: string): string => blue(msg);

export const formatIpInfo = ({
  ip,
  country,
  countryEmoji,
  city,
  region,
  connectionOrg,
  connectionIsp,
  connectionDomain,
}: ReqOutput = {}): string => {
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

  output += [...new Set([city, country, region])].filter(Boolean).join(SEPARATOR);

  return output;
};

export const formatLocationInfo = ({
  city,
  country,
  iata,
}: CloudPingLocation & {iata?: string}): string => {
  let output = '';

  if (iata) {
    output += `${orgIsp(iata)}\n`;
  }

  if (country) {
    const emoji = clm.getCountryByName(country)?.emoji;

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
