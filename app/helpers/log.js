import chalk from 'chalk';

const {bgBlackBright, magenta} = chalk;

/**
 * @param {any} msg
 */
// eslint-disable-next-line no-console
export const log = (...msg) => console.log(...msg);

/**
 * @param {any} header
 */
export const logHeader = header => log(`\n${bgBlackBright(magenta(` ${header} `))}\n`);
