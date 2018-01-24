import { Rule } from "./rule";
import { Facts } from "./facts";
import { FastRunner } from "@juicekit/fastrunner";

export class Rules {
    private rules: Rule[] = [];

    register(rule: Rule) {
        this.rules.push(rule);
    }

    verify(facts: Facts): Promise<Facts> {
        let runner = new FastRunner(this.rules);

        return runner.execute((rule) => {
            const conditionEvaluation = rule.condition(facts);
            if (conditionEvaluation instanceof Promise) {
                return conditionEvaluation.catch(() => {
                    return Promise.reject(rule);
                });
            }

            if (conditionEvaluation) {
                return Promise.resolve();
            }
            
            return Promise.reject(rule);
        }).then(() => {
            return facts;
        });
    }

    all(): Rule[] {
        return this.rules;
    }
}