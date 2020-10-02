---
title: "frozen objects"
date: 2016-06-03
draft: false
---

> objects are frozen,
>
> never to be extended
>
> or altered again

```javascript 
class Ninja {
  constructor() {
    this.dead = false;
    Object.freeze(this);
  }
}

var shinobi = new Ninja();

shinobi.dead = true;

console.log(shinobi); // Ninja { dead: false }
```
