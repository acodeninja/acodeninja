---
title: "Composer Fatal Error or Killed"
date: 2019-04-18
draft: true
---

Depending on your use case, you'll probably come across one of these errors at
some point while using composer.

composer update
(out)PHP Fatal error: Allowed memory size of XXXXXX bytes exhausted

Or the wonderfully informative.

composer update
(out)Killed

You can go and edit your php.ini, start composer with php -d memory_limit=-1
composer [command], or go with the nice and easy way for one off updates.

COMPOSER_MEMORY_LIMIT=-1 composer update
(out)[composer runs, assuming you have enough RAM]
