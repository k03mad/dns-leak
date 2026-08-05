#!/usr/bin/env node

import {tsImport} from 'tsx/esm/api';

await tsImport('./app/run.ts', import.meta.url);
