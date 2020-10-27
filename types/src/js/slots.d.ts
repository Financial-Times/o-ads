declare var _default: Slots;
export default _default;
/**
 * The Slots instance tracks all ad slots on the page
 * configures global page events used by a slot and
 * provides utlity methods that act on all slots
 * @constructor
 */
declare function Slots(): void;
declare class Slots {
    collapse(names: any): any;
    uncollapse(names: any): any;
    refresh(names: any): any;
    clear(names: any): any;
    destroy(names: any): any;
    submitImpression(name: any): any;
    initSlot(container: any): any;
    initRefresh(): Slots;
    refreshCount: number;
    initRendered(): Slots;
    initResponsive(): Slots;
    initPostMessage(): void;
    flushLazyLoading(): void;
    lazyLoadingObservers: any;
    initLazyLoading(slotConfig: any): any;
    forEach(fn: any): Slots;
    init(): void;
    debug(): void;
}
