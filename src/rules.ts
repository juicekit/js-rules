import { Rule } from './rule';
import { Facts } from './facts';
import { FastRunner } from '@juicekit/fastrunner';
import { Observable } from 'rxjs/Observable';

export class Rules {
    private rules: Rule[] = [];

    register(rule: Rule) {
        this.rules.push(rule);
    }

    verify(facts: Facts): Observable<Rule> {
        let runner = new FastRunner(this.rules);

        return runner.execute((rule) => {
            return rule.condition(facts);
        });
    }

    all(): Rule[] {
        return this.rules;
    }
}