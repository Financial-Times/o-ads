export default Slot;
/**
 * The Slot class.
 * @class
 * @constructor
 */
declare function Slot(container: any, screensize: any, initLazyLoading: any): boolean;
declare class Slot {
    /**
     * The Slot class.
     * @class
     * @constructor
     */
    constructor(container: any, screensize: any, initLazyLoading: any);
    container: any;
    screensize: any;
    outer: any;
    inner: any;
    server: string;
    defer: boolean;
    targeting: any;
    sizes: any;
    center: any;
    label: any;
    outOfPage: any;
    disableSwipeDefault: any;
    companion: boolean;
    collapseEmpty: any;
    lazyLoad: any;
    lazyLoadObserver: any;
    parseAttributeConfig(): void;
    getAttributes(): Slot;
    attributes: {};
    initLazyLoad(): Slot;
    render(): void;
    initResponsive(): Slot;
    maximise(size: any): void;
    setName(): Slot;
    name: any;
    collapse(): Slot;
    addClass(className: any): Slot;
    setFormatLoaded(format: any): Slot;
    uncollapse(): Slot;
    clear(): Slot;
    destroy(): Slot;
    submitImpression(): Slot;
    fire(name: any, data: any): Slot;
    addContainer(node: any, attrs: any): any;
    hasValidSize(screensize: any): boolean;
    centerContainer(): Slot;
    labelContainer(): Slot;
    formats: any;
}
