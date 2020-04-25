// String filters
export class ExactStringMatchFilter {
    readonly str: string;

    constructor(str: string) {
        this.str = str;
    }
}

export class PrefixStringMatchFilter {
    readonly prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }
}

export class NoFilter {
}