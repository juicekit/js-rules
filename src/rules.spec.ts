import { expect } from 'chai';
import { Facts } from './facts';
import { Rules } from './rules';
import { spy } from 'sinon';

describe('Rules', () => {
    it('should pass if there are no rules', (done) => {
        const norules = new Rules();
        norules.verify(new Facts()).subscribe(() => {
            done(new Error('has rules'))
        }, (error) => {
            done(error);
        }, () => {
            done();
        });
    });

    it('should return all rules (0 rules)', () => {
        const norules = new Rules();
        expect(norules.all()).to.be.length(0);
    });

    it('should return all rules (2 rules)', () => {
        const rules = new Rules();
        rules.register({
            Name: 'Rule1',
            Description: '',
            condition: (facts: Facts) => {
                return true;
            }
        });
        rules.register({
            Name: 'Rule2',
            Description: '',
            condition: (facts: Facts) => {
                return true;
            }
        });
        const allRules = rules.all();

        expect(allRules).to.be.length(2);
        expect(allRules[0]).to.have.property('Name', 'Rule1');
        expect(allRules[1]).to.have.property('Name', 'Rule2');
    });

    describe('synchronous', () => {
        const adultRule = {
            Name: 'Over18',
            Description: '',
            condition: (facts: Facts) => {
                return facts.get('age') >= 18;
            }
        };

        const maleRule = {
            Name: 'Male',
            Description: '',
            condition: (facts: Facts) => {
                return facts.get('gender') === 'Male';
            }
        };

        it('should pass if all rules (1 rule) have been met', (done) => {
            const adult = new Rules();
            adult.register(adultRule);

            const john = new Facts();
            john.set('firstName', 'John');
            john.set('lastName', 'Doe');
            john.set('gender', 'Male');
            john.set('age', 26);

            const ruleCallback = spy();

            adult.verify(john).subscribe(ruleCallback, error => done(error), () => {
                expect(ruleCallback.callCount).to.equal(1);
                done();
            });
        });

        it('should not pass if a rule is not met', (done) => {
            const adult = new Rules();
            adult.register(adultRule);

            const john = new Facts();
            john.set('firstName', 'John');
            john.set('lastName', 'Doe');
            john.set('gender', 'Male');
            john.set('age', 16);

            adult.verify(john).subscribe(() => {
                done(new Error('is an adult'));
            }, (error) => {
                expect(error.Name).to.equal('Over18');
                done();
            });
        });

        it('should pass if all rules (2 rules) have been met', (done) => {
            const adult = new Rules();
            adult.register(adultRule);
            adult.register(maleRule);

            const john = new Facts();
            john.set('firstName', 'John');
            john.set('lastName', 'Doe');
            john.set('gender', 'Male');
            john.set('age', 26);


            const ruleCallback = spy();

            adult.verify(john).subscribe(ruleCallback, (error) => {
                done(error)
            }, () => {
                expect(ruleCallback.callCount).to.equal(2);
                done();
            });
        });

        it('should pass if all rules (6 rules) have been met', (done) => {
            const adult = new Rules();
            adult.register(adultRule);
            adult.register(maleRule);
            adult.register({
                Name: 'FirstNameLongerThan2Chars',
                Description: '',
                condition: (facts: Facts) => {
                    return facts.get('firstName').length > 2;
                }
            });
            adult.register({
                Name: 'LastNameLongerThan2Chars',
                Description: '',
                condition: (facts: Facts) => {
                    return facts.get('lastName').length > 2;
                }
            });
            adult.register({
                Name: 'OlderThan20',
                Description: '',
                condition: (facts: Facts) => {
                    return facts.get('age') > 20;
                }
            });
            adult.register({
                Name: 'IsJohn',
                Description: '',
                condition: (facts: Facts) => {
                    return facts.get('firstName') === 'John';
                }
            });

            const john = new Facts();
            john.set('firstName', 'John');
            john.set('lastName', 'Doe');
            john.set('gender', 'Male');
            john.set('age', 26);

            const ruleCallback = spy();

            adult.verify(john).subscribe(ruleCallback, error => done(error), () => {
                expect(ruleCallback.callCount).to.equal(6)
                done();
            });
        });

        it('should not pass if at least 1 rule (out of 6 rules) has been met', (done) => {
            const adult = new Rules();
            adult.register(adultRule);
            adult.register(maleRule);
            adult.register({
                Name: 'FirstNameLongerThan2Chars',
                Description: '',
                condition: (facts: Facts) => {
                    return facts.get('firstName').length > 2;
                }
            });
            adult.register({
                Name: 'LastNameLongerThan2Chars',
                Description: '',
                condition: (facts: Facts) => {
                    return facts.get('lastName').length > 2;
                }
            });
            adult.register({
                Name: 'OlderThan20',
                Description: '',
                condition: (facts: Facts) => {
                    return facts.get('age') > 20;
                }
            });
            adult.register({
                Name: 'IsJohn',
                Description: '',
                condition: (facts: Facts) => {
                    return facts.get('firstName') === 'John';
                }
            });

            const john = new Facts();
            john.set('firstName', 'Al');
            john.set('lastName', 'Doe');
            john.set('gender', 'Male');
            john.set('age', 26);

            adult.verify(john).subscribe(() => {
                done(new Error('user info is valid'));
            }, (rule) => {
                expect(rule.Name).to.equal('FirstNameLongerThan2Chars');
                done();
            });
        });
    });


    describe('asynchronous', () => {
        const adultRule = {
            Name: 'Over18',
            Description: '',
            condition: (facts: Facts): Promise<any> => {
                return new Promise((resolve, reject) => {
                    if (facts.get('age') >= 18) {
                        return resolve();
                    }

                    return reject(facts);
                });
            }
        };

        const maleRule = {
            Name: 'Male',
            Description: '',
            condition: (facts: Facts): Promise<any> => {
                return new Promise((resolve, reject) => {
                    if (facts.get('gender') === 'Male') {
                        return resolve();
                    }

                    return reject(facts);
                });
            }
        };

        it('should pass if all rules (1 rule) have been met', (done) => {
            const adult = new Rules();
            adult.register(adultRule);

            const john = new Facts();
            john.set('firstName', 'John');
            john.set('lastName', 'Doe');
            john.set('gender', 'Male');
            john.set('age', 26);


            const ruleCallback = spy();

            adult.verify(john).subscribe(ruleCallback, error => done(error), () => {
                expect(ruleCallback.callCount).to.equal(1);
                done();
            });
        });

        it('should not pass if a rule is not met', (done) => {
            const adult = new Rules();
            adult.register(adultRule);

            const john = new Facts();
            john.set('firstName', 'John');
            john.set('lastName', 'Doe');
            john.set('gender', 'Male');
            john.set('age', 16);

            adult.verify(john).subscribe(() => {
                done(new Error('is an adult'));
            },(rule) => {
                expect(rule.Name).to.equal('Over18')
                done();
            });
        });

        it('should pass if all rules (2 rules) have been met', (done) => {
            const adult = new Rules();
            adult.register(adultRule);
            adult.register(maleRule);

            const john = new Facts();
            john.set('firstName', 'John');
            john.set('lastName', 'Doe');
            john.set('gender', 'Male');
            john.set('age', 26);

            const ruleCallback = spy();

            adult.verify(john).subscribe(ruleCallback, error => done(error), () => {
                expect(ruleCallback.callCount).to.equal(2);
                done();
            });
        });

        it('should pass if all rules (6 rules) have been met', (done) => {
            const adult = new Rules();
            adult.register(adultRule);
            adult.register(maleRule);
            adult.register({
                Name: 'FirstNameLongerThan2Chars',
                Description: '',
                condition: (facts: Facts): Promise<any> => {
                    return new Promise((resolve, reject) => {
                        if (facts.get('firstName').length > 2) {
                            return resolve();
                        }
    
                        return reject(facts);
                    });
                }
            });
            adult.register({
                Name: 'LastNameLongerThan2Chars',
                Description: '',
                condition: (facts: Facts): Promise<any> => {
                    return new Promise((resolve, reject) => {
                        if (facts.get('lastName').length > 2) {
                            return resolve();
                        }
    
                        return reject(facts);
                    });
                }
            });
            adult.register({
                Name: 'OlderThan20',
                Description: '',
                condition: (facts: Facts) => {
                    return new Promise((resolve, reject) => {
                        if (facts.get('age') > 20) {
                            return resolve();
                        }
    
                        return reject(facts);
                    });
                }
                
            });
            adult.register({
                Name: 'IsJohn',
                Description: '',
                condition: (facts: Facts) => {
                    return new Promise((resolve, reject) => {
                        if (facts.get('firstName') === 'John') {
                            return resolve();
                        }
    
                        return reject(facts);
                    });
                }
            });

            const john = new Facts();
            john.set('firstName', 'John');
            john.set('lastName', 'Doe');
            john.set('gender', 'Male');
            john.set('age', 26);

            const ruleCallback = spy();

            adult.verify(john).subscribe(ruleCallback, error => done(error), () => {
                expect(ruleCallback.callCount).to.equal(6);
                done();
            });
        });

        it('should not pass if at least 1 rule (out of 6 rules) has been met', (done) => {
            const adult = new Rules();
            adult.register(adultRule);
            adult.register(maleRule);
            adult.register({
                Name: 'FirstNameLongerThan2Chars',
                Description: '',
                condition: (facts: Facts): Promise<any> => {
                    return new Promise((resolve, reject) => {
                        if (facts.get('firstName').length > 2) {
                            return resolve();
                        }
    
                        return reject(facts);
                    });
                }
            });
            adult.register({
                Name: 'LastNameLongerThan2Chars',
                Description: '',
                condition: (facts: Facts): Promise<any> => {
                    return new Promise((resolve, reject) => {
                        if (facts.get('lastName').length > 2) {
                            return resolve();
                        }
    
                        return reject(facts);
                    });
                }
            });
            adult.register({
                Name: 'OlderThan20',
                Description: '',
                condition: (facts: Facts) => {
                    return new Promise((resolve, reject) => {
                        if (facts.get('age') > 20) {
                            return resolve();
                        }
    
                        return reject(facts);
                    });
                }
                
            });
            adult.register({
                Name: 'IsJohn',
                Description: '',
                condition: (facts: Facts) => {
                    return new Promise((resolve, reject) => {
                        if (facts.get('firstName') === 'John') {
                            return resolve();
                        }
    
                        return reject(facts);
                    });
                }
            });

            const john = new Facts();
            john.set('firstName', 'Al');
            john.set('lastName', 'Doe');
            john.set('gender', 'Male');
            john.set('age', 26);

            const ruleCallback = spy();

            adult.verify(john).subscribe(ruleCallback, (rule) => {
                expect(rule.Name).to.equal('FirstNameLongerThan2Chars');
                done();
            }, () => {
                done(new Error('completed without errors'));
            });
        });
    });
});