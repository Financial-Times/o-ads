/**
 * @typedef {{ [key: string]: string[] }} FilterDict
 */
/**
 * Remove unwanted params from nested query strings
 *
 * @param   {string}   nestedParams the URIencoded nested params
 * @param   {string[]} keysToStrip  the parameters to remove
 *
 * @return  {string}               [return description]
 */
export function filterNestedParams(nestedParams: string, keysToStrip: string[]): string;
/**
 * Purge a URL of sensitive data in query strings
 *
 * Given the URL
 * ```url
 * https://www.ft.com/search?q=goog&cust_params=a%3D1%26b%3D2%26c%3D3%26d%3D4
 * ```
 * Supplying an object in the form
 * ```
 * {
 *   root: ['q', 'kw'],
 *   cust_params: ['a', 'c']
 * }
 * ```
 * will remove `q` from the main query string and `a`, `c` from the nested params
 * under `cust_params`:
 * ```url
 * https://www.ft.com/search?cust_params=b=2%26d%3D4
 * ```
 *
 * @param   {Object}  params
 * @param   {string | Location}  params.href     The base URL or `window.location`
 * @param   {FilterDict}         params.filters  The dictionary of params to be removed
 *
 * @return  {string}              A URL that has been stripped of the supplied params
 */
export function stripUrlParams({ href, filters }: {
    href: string | Location;
    filters: FilterDict;
}): string;
export const SEARCH_PARAMS: string[];
export type FilterDict = {
    [key: string]: string[];
};
