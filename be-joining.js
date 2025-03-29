// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-joining/types' */;
/** @import {EnhancementInfo} from './ts-refs/trans-render/be/types' */


/**
 * @implements {Actions}
 * 
 */
class BeJoining extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement>}
     */
    static config = {
        propDefaults: {
            xpAsAttr: 'xp-as',
        },
    };
}

await BeJoining.bootUp();
export {BeJoining};