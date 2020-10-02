---
title: "warning users about insecure passwords"
date: 2018-03-19
draft: false
keywords:
    - laravel
    - user-friendly
    - security
    - password security
---

## laravel pwned passwords validator
This small guide expects you to have my pwned passwords validator for laravel
5.6. It's painless to install and set up:

```shell script
$ composer require acodeninja/laravel-pwned-passwords-validator
```

Once installed, Laravel's package discovery will take care of loading the
package for use in your application. Read more about using the 
[validator](/posts/2018-03-15-laravel-pwned-passwords-validator/).

## checking passwords and warning users on login
To check if a password is secure each time a user logs in you can use the
validator. To do this, you use the validator and redirect with errors if the
login password fails to pass.

Simply put, add the following to your application's login controller, in a
default application this is at `app/Http/Controllers/Auth/LoginController.php`.

```php
/**
 * @param Request $request
 * @param User $user
 * @return $this|\Illuminate\Http\RedirectResponse
 */
public function authenticated(Request $request, User $user)
{
    $validator = Validator::make($request->all(), [
        'password' => 'required|pwned_password_strict',
    ]);

    $redirect = redirect()->intended($this->redirectPath());

    return $validator->fails() ?
    	$redirect->withErrors($validator->errors()) :
    	null;
}
```


You can then display the errors as normal on the page your application redirects
to, normally this would be `resources/views/home.blade.php`.

```blade
@if ($errors->any())
    <div class="alert alert-danger">         
        <ul>
        @foreach ($errors->all() as $error)
            <li>{{ $error }}</li>
        @endforeach
        </ul>
    </div>
@endif
```

Or you can make it look a little nicer and display it above other messages with

```blade
@if ($errors->has('password'))     
    <div class="alert alert-danger">         
        {{ $errors->first('password') }}    
    </div>
@endif
```
