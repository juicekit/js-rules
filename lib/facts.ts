export interface Properties<Value> {
    [id: string]: Value;
}

export class Facts {
    private facts: Properties<any> = {}

    constructor() {}

    set(fact: string, value: any) {
        this.facts[fact] = value;
    }

    get(fact: string) {
        return this.facts[fact];
    }

    all(): Properties<any> {
        return this.facts;
    }
}