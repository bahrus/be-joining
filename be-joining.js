// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {toParts} from 'trans-render/lib/brace.js';
import {emc} from 'xp-as/emc.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP, Factor} from './ts-refs/be-joining/types' */;
/** @import {EnhancementInfo} from './ts-refs/trans-render/be/types' */
/** @import {AllProps as XPAsAllProps} from './ts-refs/xp-as/types'; */
/** @import {Parts} from './ts-refs/trans-render/froop/types' */

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
     * @type {{[key: string]: AttrManager}}
     */
    #attrManagers = {};

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
            this.#attrManagers[targetAttr] = attrMgr; // Store the manager for this target attribute
        }
    }

    /**
     * 
     * @param {Element} el 
     */
    async detach(el){
        super.detach(el);
        if(this.#mutationObserver){
            this.#mutationObserver.disconnect();
            this.#mutationObserver = undefined;
        }

        for(const key in this.#attrManagers){
            const attrMgr = this.#attrManagers[key];
            if(attrMgr){
                // Disconnect the event listeners
                attrMgr.disconnect();
            }
        }
    }
}

/** @implements {EventListenerObject} */
class AttrManager{


    #abortController = new AbortController();

    /**
     * @type {string}
     */
    #targetAttr;

    /**
     * @type {string}
     */
    #interpolationExpr;

    /**
     * @type {Parts}
     */
    #interpolationParts;

    /**
     * @type {BAP | undefined}
     */
    #self

    /**
     * @type {{[key: string] : Factor}}
     */
    #factors = {};

    /**
     * 
     * @param {string} interpolationExpr
     * @param {string} targetAttr
     * @param {BAP} self 
     */
    constructor(interpolationExpr, targetAttr, self){
        this.#targetAttr = targetAttr;
        this.#interpolationExpr = interpolationExpr;
        this.#self = self;
        this.#hydrate() 
    }

    async #hydrate(){
        const parts = toParts(this.#interpolationExpr);
        this.#interpolationParts = parts;
        const self = this.#self;
        if(!self){
            // This should not happen but just in case, we return early if self is not defined
            console.error('Self is undefined in AttrManager during hydration');
            return;
        }
        const xpAsAttr = self.xpAsAttr || 'xp-as';
        const {enhancedElement} = self;
        for(const part of parts){
            if(Array.isArray(part)){
                const [NameOfProp] = part;
                const cssQry = `[${xpAsAttr}-${NameOfProp}]`;
                const sourceEl = /** @type {any>} */ (enhancedElement.closest(cssQry));
                if(sourceEl === null) throw 404;
                /**
                 * @type {XPAsAllProps}
                 */
                const xpAs = await  sourceEl.beEnhanced.whenAttached(emc);
                this.#factors[NameOfProp] = {
                    NameOfProp,
                    xpAs,
                };
                console.log({cssQry, sourceEl, props: xpAs.props});
            }
        }
        for(const factorKey in this.#factors){
            const factor = this.#factors[factorKey];
            const {NameOfProp, xpAs} = factor;
            xpAs.props.addEventListener(NameOfProp, this, {signal: this.#abortController.signal}); // Listen for changes on the property of the source element
        }
        this.#interpolate();

        // Now we have all the factors, we can compute the value for the target attribute.
    }

    #interpolate(){
        const tbd = [];
        for(const part of this.#interpolationParts){
            if(Array.isArray(part)){
                // This is a reference to another attribute
                const [NameOfProp] = part;
                tbd.push(this.#factors[NameOfProp].xpAs.props[NameOfProp]);
            }else{
                tbd.push(part);
            }
        }
        const joinedString = tbd.join('');
        this.#self?.enhancedElement.setAttribute(this.#targetAttr, joinedString);
    }
    /**
     * 
     * @param {Event} e 
     */
    handleEvent(e){
        this.#interpolate();
    }

    disconnect(){
        this.#self = undefined;
        this.#abortController.abort(); // This will cancel any ongoing events or listeners
    }
}



await BeJoining.bootUp();
export {BeJoining};