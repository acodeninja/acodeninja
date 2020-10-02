---
title: "information hiding"
date: 2016-06-02
draft: false
---

> object oriented
>
> information hiding done.
>
> closures: private methods

```javascript
class Person { 
  constructor(name, dob) {
    var dob = dob;
    this.name = name; 
 
    this.getBirthyear = () => new Date(dob).getFullYear(); 
  }
}

var person = new Person('thejsninja', '1985-12-04');

console.log(person.getBirthyear()); // 1985
```
