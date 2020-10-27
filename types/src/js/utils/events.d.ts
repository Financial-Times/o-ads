export function buildPerfmarkSuffix(eventDetailsObj: any): string;
/**
* Broadscasts an o-ads event
* @param {string} name The name of the event
* @param {object} data The data to send as event detail
* @param {HTMLElement} target The element to attach the event listener to
*/
export function broadcast(eventName: any, data: object, target: HTMLElement): void;
/**
* Sets an event listener for an oAds event
* @param {string} name The name of the event
* @param {function} callback The function to execute on the event
* @param {HTMLElement} target The element to attach the event listener to
*/
export function on(name: string, callback: Function, target: HTMLElement): void;
/**
* Removes an event listener for an oAds event
* @param {string} name The name of the event
* @param {function} callback The function on the event to be removed
* @param {HTMLElement} target The element the event listener is attached to
*/
export function off(name: string, callback: Function, target: HTMLElement): void;
/**
* Sets a one time event listener for an oAds event
* @param {string} name The name of the event
* @param {function} callback The function to execute on the event
* @param {HTMLElement} target The element to attach the event listener to
*/
export function once(name: string, callback: Function, target: HTMLElement): void;
export function perfMark(name: any): void;
