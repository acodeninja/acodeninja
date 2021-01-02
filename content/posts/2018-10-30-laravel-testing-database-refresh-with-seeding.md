---
title: "laravel testing: database reset with seeding"
date: 2018-10-30
draft: false
keywords:
    - laravel
    - testing
    - database seeding
    - test case
    - acceptance testing
aliases:
    - /laravel-testing-database-refresh-with-seeding/
---

Testing a [Laravel](https://laravel.com/docs/5.7/testing) application has a low
barrier to entry compared to [other](https://symfony.com/doc/current/testing.html)
[PHP](https://www.codeigniter.com/user_guide/libraries/unit_testing.html) 
[frameworks](https://book.cakephp.org/3.0/en/development/testing.html). What 
happens when you want to nuke the database between tests? I thought I'd share a 
solution here.

## feature testing
One of the great features Laravel provides is the ability to 
[refresh](https://laravel.com/docs/5.7/database-testing#resetting-the-database-after-each-test) 
your database after each test. This has been really useful, but I needed to
test verbs like `DELETE` and a simple `php artisan migrate:fresh`  isn't all 
that useful when you have seeds that add information to your database that your 
tests rely on.

The class `Illuminate\Foundation\Testing\RefreshDatabase`  has a method used to
action the refresh refreshTestDatabase  which just calls out to `artisan` for 
the `migrate:fresh` command. Step in my nice little override:
 
```php
// tests/ResetsDatabase.php
<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel; 
use Illuminate\Foundation\Testing\RefreshDatabase; 
use Illuminate\Foundation\Testing\RefreshDatabaseState;

trait ResetsDatabase {
    use RefreshDatabase;
    
    protected function refreshTestDatabase()
    {
        if (! RefreshDatabaseState::$migrated) {
            $this->artisan('migrate:fresh', $this->shouldDropViews() ? [
                '--drop-views' => true,
            ] : []);

            $this->artisan('db:seed', []);
            $this->artisan('db:seed', [
                '--class' => 'TestDatabaseSeeder',
            ]);

            $this->app[Kernel::class]->setArtisan(null);

            RefreshDatabaseState::$migrated = true;
        }

        $this->beginDatabaseTransaction();
    }
}
```

You can use this in your tests the same way you would the RefreshDatabase 
class. But instead of just refreshing the database, you will get db:seed for
free along with any test seeds you want to run.
```php
// tests/Feature/UserApiTest.php
<?php

namespace Tests\Feature;

use Tests\ResetsDatabase; 
use Tests\TestCase;

class UserApiTest extends TestCase {
    use ResetsDatabase;
}
```

## what about dusk?
The same can be achieved in dusk [https://laravel.com/docs/5.7/dusk]  with a
similar change in the DatabaseMigrations  trait provided for resetting the
database.

```php
// tests/ResetsDatabaseInDusk.php
<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel; 
use Illuminate\Foundation\Testing\DatabaseMigrations; 
use Illuminate\Foundation\Testing\RefreshDatabaseState;

trait ResetsDatabaseInDusk {
    use DatabaseMigrations;
    
    protected function runDatabaseMigrations()
    {
        $this->artisan('migrate:fresh', [
            '--drop-views' => true,
        ]);

        $this->artisan('db:seed', []);
        $this->artisan('db:seed', [
            '--class' => 'TestDatabaseSeeder',
        ]);

        $this->app[Kernel::class]->setArtisan(null);

        $this->beforeApplicationDestroyed(function () {
            $this->artisan('migrate:rollback');

            RefreshDatabaseState::$migrated = false;
        });
    }
}
```

This will do the same as the previous trait but for your Browser tests.
