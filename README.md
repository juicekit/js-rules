# JuiceKit Rules
[![Build Status](https://travis-ci.org/juicekit/js-rules.svg?branch=master)](https://travis-ci.org/juicekit/js-rules)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f72d0b5d5a8c49c8bf2f6ec31f12b8df)](https://www.codacy.com/app/yoel/js-rules?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=juicekit/js-rules&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/f72d0b5d5a8c49c8bf2f6ec31f12b8df)](https://www.codacy.com/app/yoel/js-rules?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=juicekit/js-rules&amp;utm_campaign=Badge_Coverage)

JuiceKit Rules is a Javascript rule engine implementation

## Installation

`npm install @juicekit/rules`


### Example Usage

#### Adult Validation

```
const adultRules = new Rules();
adultRules.register({
    Name: 'Adult',
    Description: '',
    condition: (facts) => {
        return facts.get('age') >= 18;
    }
});


const person = new Facts();
person.set('age', 18);

adultRules.verify(person).subscribe((rule) => {
    // rule being validated
}, (rule) => {
    // failed rule
}, () => {
    // completed successfully
});
```

#### Adult Female Validation

```
const adultFemaleRules = new Rules();
adultFemaleRules.register({
    Name: 'Adult',
    Description: '',
    condition: (facts) => {
        return facts.get('age') >= 18;
    }
});
adultFemaleRules.register({
    Name: 'Female',
    Description: '',
    condition: (facts) => {
        return facts.get('gender') === 'F' || facts.get('gender') === 'Female';
    }
});


const person = new Facts();
person.set('age', 18);
person.set('gender', 'F');

adultFemaleRules.verify(person).subscribe((rule) => {
    // rule being validated
}, (rule) => {
    // failed rule
}, () => {
    // completed successfully
});
```
