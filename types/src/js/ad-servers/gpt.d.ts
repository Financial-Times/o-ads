export namespace DEFAULT_LAZY_LOAD {
    const fetchMarginPercent: number;
    const renderMarginPercent: number;
    const mobileScaling: number;
}
declare namespace _default {
    export { init };
    export { setup };
    export { updateCorrelator };
    export { updatePageTargeting };
    export { clearPageTargeting };
    export { clearPageTargetingForKey };
    export { hasGPTLoaded };
    export { loadGPT };
    export { debug };
}
export default _default;
declare function init(): void;
declare function setup(gptConfig: any): boolean;
/**
 * The correlator is a random number added to ad calls.
 * It is used by the ad server to determine which impressions where served to the same page
 * Updating is used to tell the ad server to treat subsequent ad calls as being on a new page
 */
declare function updateCorrelator(): void;
declare function updatePageTargeting(override: any): void;
declare function clearPageTargeting(): void;
/**
 * Removes page targeting for a specified key from GPT ad calls
 */
declare function clearPageTargetingForKey(key: any): void;
declare function hasGPTLoaded(): boolean;
declare function loadGPT(): void;
declare function debug(): void;
