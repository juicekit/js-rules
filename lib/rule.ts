import { Facts } from "./facts";

export abstract class Rule {
    constructor() {
    }

    abstract get Name(): string;
    abstract get Description(): string;


    abstract condition(facts: Facts): boolean | Promise<boolean>;
}