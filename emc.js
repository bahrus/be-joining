// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP,  AP} from './ts-refs/be-joining/types' */;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-joining',
    map:  {
        '0.0': {
            mapsTo: 'xpAsAttr',
            instanceOf: 'String',
        }
    },
    enhPropKey: 'beJoining',
    importEnh: async () => {
        const { BeJoining } = 
        /** @type {{new(): IEnhancement<Element>}} */ 
        /** @type {any} */
        (await import('./be-joining.js'));
        return BeJoining;;
    },
}

const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);