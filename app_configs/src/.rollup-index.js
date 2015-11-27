import {expose} from './.rollup-lib-exports';
import * as exports from './.rollup-lib-exports';

Object.keys(exports).forEach(key => {
    expose(key, exports[key])
});

export default exports;
