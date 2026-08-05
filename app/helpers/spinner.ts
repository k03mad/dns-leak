import ora from 'ora';

import {bar, info} from './text.ts';

type Ora = ReturnType<typeof ora>;

interface SpinnerEntry {
  counter: number;
  instance: Ora;
}

export const spinner: Record<string, SpinnerEntry | undefined> = {};

const getSpinner = (name: string): SpinnerEntry => {
  const instance = spinner[name];

  if (!instance) {
    throw new Error(`Spinner not found: ${name}`);
  }

  return instance;
};

export const start = (name: string, active = false): Ora => {
  const instance = ora({isSilent: !active}).start();

  spinner[name] = {counter: 0, instance};
  return instance;
};

export const text = (name: string, msg: string): void => {
  getSpinner(name).instance.text = `${info(name)} ${bar(msg)}`;
};

export const count = (name: string, total: number): void => {
  const currentSpinner = getSpinner(name);
  currentSpinner.counter++;

  const len = `${String(currentSpinner.counter).padStart(String(total).length, '0')}/${total}`;
  const percent = `${String(((currentSpinner.counter * 100) / total).toFixed(0)).padStart(2, '0')}%`;
  text(name, `${len} [${percent}]`);
};

export const stop = (name: string): void => {
  getSpinner(name).instance.stop();
};
