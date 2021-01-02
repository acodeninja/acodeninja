---
title: "html5 document ready"
date: 2016-06-08
draft: false
aliases:
    - /html5-document-ready/
---

> DOMContentLoaded,
> 
> document ready or not?
>
> jQuery: overhead.

```javascript 
document.addEventListener("DOMContentLoaded", function(event) {
  console.log('document load time: ' + event.timeStamp); 
});
```
