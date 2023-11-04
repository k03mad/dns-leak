import ora from 'ora';

import {bar, info} from './text.js';

export const spinner = {};

/**
 * @param {string} name
 * @param {boolean} active
 */
export const start = (name, active) => {
    if (active) {
        spinner[name] = {
            instance: ora().start(),
            counter: 0,
        };

        return spinner[name].instance;
    }

    spinner[name] = {instance: {stop: () => ''}};
};

/**
 * @param {string} name
 * @param {string} msg
 */
export const text = (name, msg) => {
    spinner[name].instance.text = `${info(name)} ${bar(msg)}`;
};

/**
 * @param {string} name
 * @param {number} total
 */
export const count = (name, total) => {
    spinner[name].counter++;

    const len = `${String(spinner[name].counter).padStart(String(total).length, '0')}/${total}`;
    const percent = `${String((spinner[name].counter * 100 / total).toFixed(0)).padStart(2, '0')}%`;
    text(name, `${len} [${percent}]`);
};

/**
 * @param {string} name
 */
export const stop = name => {
    spinner[name].instance.stop();
};
