/**
 * This file is autoexported from build-tools, be sure to write changes there, otherwise they will be lost.
 */

import {expose} from './rollup-all-exports';
import * as exports from './rollup-all-exports';

Object.keys(exports).forEach(key => {
    expose(key, exports[key])
});

export default exports;
