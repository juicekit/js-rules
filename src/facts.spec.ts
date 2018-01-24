import { expect } from 'chai';
import { Facts } from './facts';

describe('Facts', () => {
    it('should have 0 facts by default', () => {
        const facts = new Facts();

        expect(facts.all()).to.be.empty;
    });

    it('should have 1 facts after calling set once', () => {
        const facts = new Facts();

        facts.set('one', 1);

        expect(facts.get('one')).to.equal(1);
        expect(facts.all()).to.have.all.keys('one');
    });

    it('should update facts after it has been set already', () => {
        const facts = new Facts();

        facts.set('one', 1);
        expect(facts.get('one')).to.equal(1);

        facts.set('one', 9);
        expect(facts.get('one')).to.equal(9);
    });

    it('should get all facts entered', () => {
        const facts = new Facts();

        facts.set('one', 1);
        facts.set('hello', 'world');
        facts.set('country', 'usa');

        const allFacts = facts.all();

        expect(allFacts).to.have.property('one');
        expect(allFacts).to.have.property('hello');
        expect(allFacts).to.have.property('country');

        expect(facts.get('one')).to.equal(1);
        expect(facts.get('hello')).to.equal('world');
        expect(facts.get('country')).to.equal('usa');
    });
    
});