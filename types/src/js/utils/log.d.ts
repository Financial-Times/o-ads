/**
 * Utility methods for logging.
 * @author Origami Advertising, origami.advertising@ft.com
 * @module utils/log
 * @see utils
 */
/**
 * Safe logger for the browser
 * @exports utils/log
 * @param {string} type Sets the type of log message log, warn, error or info, if not set to one of these values log will be used
 * @param {any} args the arguments to be passed to console[type]
 */
export default function log(...args: any[]): void;
export function isOn(type: string): any;
export function warn(...args: any[]): void;
export function error(...args: any[]): void;
export function info(...args: any[]): void;
export function start(group: string): void;
export function end(): void;
export function table(data: any, columns: any): void;
export function attributeTable(object: any, columns: any): void;
