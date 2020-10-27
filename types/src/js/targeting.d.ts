declare var _default: Targeting;
export default _default;
declare function Targeting(): void;
declare class Targeting {
    get(): {};
    add(obj: any): void;
    remove(key: any): void;
    clear(): void;
    getVersion(): {
        OADS_VERSION: any;
    };
    socialFlow(): {
        socialflow: string;
    };
    getSocialReferrer(): {};
    searchTerm(): {
        kw: any;
    };
    timestamp(): {
        ts: string;
    };
    responsive(): {
        res: any;
    } | {
        res?: undefined;
    };
    debug(): void;
}
