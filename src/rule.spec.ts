import { expect } from 'chai';
import { Facts } from './facts';
import { Rule } from './rule';

describe('Rule', () => {
    let facts = new Facts();

    beforeEach(() => {
        facts.set('number', '');
    });

    it('should throw an exception for unimplemented methods', () => {
        const rule = new Rule();

        expect(() => {
            const name = rule.Name;
        }).to.throw('Unimplemented method');
        expect(() => {
            const name = rule.Description;
        }).to.throw('Unimplemented method');
        expect(() => {
            rule.condition(new Facts());
        }).to.throw('Unimplemented method');
    });

    describe('rule implementation', () => {
        class CustomRule extends Rule {
            get Name() {
                return 'CustomRule';
            }

            get Description() {
                return 'Rule Detailed Description';
            }

            condition(facts: Facts): boolean {
                return true;
            }
        }

        const rule = new CustomRule();

        it('should return rule name', () => {
            expect(() => {
                expect(rule.Name).to.equal('CustomRule')
            }).to.not.throw();
        });

        it('should return rule description', () => {
            expect(() => {
                expect(rule.Description).to.equal('Rule Detailed Description')
            }).to.not.throw();
        });

        describe('synchronous', () => {
            class SyncEvenRule extends Rule {
                get Name() {
                    return '';
                }

                get Description() {
                    return '';
                }

                condition(facts: Facts) {
                    return facts.get('number') % 2 === 0;
                }
            }

            const even = new SyncEvenRule();

            it('should pass validation (even)', () => {
                facts.set('number', 8);
                expect(even.condition(facts)).to.be.true;
            })

            it('should fail validation (odd)', () => {
                facts.set('number', 3);
                expect(even.condition(facts)).to.be.false;
            })
        });

        describe('asynchronous', () => {
            class AsyncEvenRule extends Rule {
                get Name() {
                    return '';
                }

                get Description() {
                    return '';
                }

                condition(facts: Facts): Promise<boolean> {
                    const isEven = facts.get('number') % 2 === 0;

                    return isEven ? Promise.resolve(true) : Promise.reject(isEven);
                }
            }

            const even = new AsyncEvenRule();

            it('should pass validation (even)', (done) => {
                facts.set('number', 8);
                even.condition(facts).then(() => {
                    done();
                }).catch(() => {
                    done(new Error('number is odd'));
                });
            })

            it('should fail validation (odd)', (done) => {
                facts.set('number', 3);
                even.condition(facts).then(() => {
                    done(new Error('number is even'));
                }).catch(() => {
                    done();
                });
            })
        });
    });
    
});