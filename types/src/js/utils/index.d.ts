export function extend(...args: any[]): any;
export function inSample(sampleSize: any): boolean;
export function isArray(obj: object): boolean;
export function isString(obj: object): boolean;
export function isFunction(obj: object): boolean;
export function isStorage(obj: object): boolean;
export function isObject(obj: object): boolean;
export function isWindow(obj: object): boolean;
export function isPlainObject(obj: object): boolean;
export function isNonEmptyString(str: object): boolean;
export function isElement(element: any): any;
export function hash(str: string, delimiter: string | any, pairing: string): object;
export function attach(scriptUrl: string, async: boolean, callback: Function, errorcb: Function, autoRemove: any): HTMLElement;
export function getReferrer(): string;
export function dehyphenise(string: string): string;
export function parseAttributeName(attribute: any): string;
export function getLocation(): string;
export function getQueryString(): string;
export function getQueryParamByName(name: any, url: any): string | null;
export function getTimestamp(): string;
export function iframeToSlotName(iframeWindow: any): string | boolean;
export function buildObjectFromArray(targetObject: any): any;
export function cookie(name: any): string;
export function getVersion(): any;
declare namespace _default {
    export { on };
    export { off };
    export { once };
    export { broadcast };
    export { messenger };
    export { responsive };
    export { log };
    export { isArray };
    export { isString };
    export { isFunction };
    export { isStorage };
    export { isObject };
    export { isWindow };
    export { isPlainObject };
    export { isNonEmptyString };
    export { isElement };
    export { extend };
    export { hash };
    export { attach };
    export { getReferrer };
    export { dehyphenise };
    export { parseAttributeName };
    export { getLocation };
    export { getQueryString };
    export { getQueryParamByName };
    export { getTimestamp };
    export { iframeToSlotName };
    export { buildObjectFromArray };
    export { cookie };
    export { getVersion };
    export { setupMetrics };
    export { clearPerfMarks };
    export { markPageChange };
    export { inSample };
    export { perfMark };
    export { buildPerfmarkSuffix };
}
export default _default;
import { on } from "./events";
import { off } from "./events";
import { once } from "./events";
import { broadcast } from "./events";
import messenger from "./messenger";
import responsive from "./responsive";
import log from "./log";
import { setupMetrics } from "./metrics";
import { clearPerfMarks } from "./metrics";
import { markPageChange } from "./metrics";
import { perfMark } from "./events";
import { buildPerfmarkSuffix } from "./events";
