import { Facts } from './facts';

export class Rule {
    get Name(): string {
        throw new Error('Unimplemented method');
    }
    get Description(): string {
        throw new Error('Unimplemented method');
    }
    condition(facts: Facts): boolean | Promise<boolean> {
        throw new Error('Unimplemented method');
    }
}