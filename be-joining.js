// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {toParts} from 'trans-render/lib/brace.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/be-joining/types' */;
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
        propInfo: {
            xpAsAttr: {}
        },
        compacts:{
            when_xpAsAttr_changes_invoke_hydrate: 0,
        }
    };

    /**
     * @type {string}
     */
    #base;

    /**
     * @type {MutationObserver | undefined}
     */
    #mutationObserver;

    /**
     * 
     * @param {Element} el 
     * @param {EnhancementInfo} enhancementInfo 
     */
    async attach(el, enhancementInfo){
        this.#base = /** @type {string} */ (enhancementInfo.mountCnfg.base);
        await super.attach(el, enhancementInfo);
        
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async hydrate(self){
        const { enhancedElement } = self;
        this.#mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    const attrName = mutation.attributeName;
                    if(attrName !== null){
                        this.#processAttr(attrName, self);
                    }
                    
                }
            }
        });
        const attrs = enhancedElement.getAttributeNames();
        for (const attrName of attrs) {
            this.#processAttr(attrName, self);
        }
        this.#mutationObserver.observe(enhancedElement, {
            attributes: true, 
        });
        return /** @type {PAP} */ ({})
    }

    /**
     * 
     * @param {string} attrName
     * @param {BAP} self 
     */
    #processAttr(attrName, self) {
        const baseLen = this.#base.length;
        if(attrName.length !== baseLen && attrName.startsWith(this.#base)){
            const {enhancedElement} = self;
            const targetAttr = attrName.substring(baseLen + 1);
            const interpolationExpr = enhancedElement.getAttribute(attrName);
            if(interpolationExpr === null){
                throw 300;
            }
            const attrMgr = new AttrManager(interpolationExpr, targetAttr, self);
        }
    }
}

/** @implements {EventListenerObject} */
class AttrManager{

    /**
     * 
     * @param {string} interpolationExpr
     * @param {string} targetAttr
     * @param {BAP} self 
     */
    constructor(interpolationExpr, targetAttr, self){
        const parts = toParts(interpolationExpr);
        const xpAsAttr = self.xpAsAttr || 'xp-as';
        const {enhancedElement} = self;
        for(const part of parts){
            if(Array.isArray(part)){
                const [NameOfProp] = part;
                const cssQry = `[${xpAsAttr}-${NameOfProp}]`;
                const sourceEl = enhancedElement.closest(cssQry);
                console.log({cssQry, sourceEl});
            }
        }
        console.log({parts});
    }
    /**
     * 
     * @param {Event} e 
     */
    handleEvent(e){

    }
}

await BeJoining.bootUp();
export {BeJoining};