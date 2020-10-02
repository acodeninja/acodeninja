---
title: "object.create, applying prototypes"
date: 2016-06-07
draft: false
---

> prototyping chaining,
> 
> object extension for all the
>
> modern programmers

```javascript 
var Ninja = function () {};
Ninja.prototype.throw = function (item) {
  console.log('Throwing ' + item);
};

var Shinobi = function () {}; 
Shinobi.prototype = Object.create(Ninja.prototype);

var shinobi = new Shinobi; 

shinobi.throw('knife'); // Throwing knife
```
