---
title: "continuous everything part 1: testing"
date: 2019-04-09
draft: true
---

All projects need a well-defined workflow to take them from feature to
implementation and on to a built and deployed piece of work. In this series, I
will go over that process with a simple react application.

You’ll find a git repository that you can follow along with here
[https://github.com/lets-learn-how-to/test-react-apps-with-jest]. I will
document each action taken in the repo along with a commit history that makes
sense.

In this part, I will set up Travis CI to test a freshly made react application.

create-react-app
Let’s get the project up and running quickly with the create-react-app command.
If you are unfamiliar with this command, take a look at this git repo
[https://github.com/facebook/create-react-app]. This command will leave us with
a reasonable default directory structure that hides a killer webpack
configuration and does a lot of the heavy lifting for us.

$ npx create-react-app test-react-apps-with-jest

$ tree -I node_modules
.
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   └── serviceWorker.js
└── yarn.lock

2 directories, 13 files

GitHub commit
[https://github.com/lets-learn-how-to/test-react-apps-with-jest/commit/fe45d8d3787d71f44d5cf7e8bc14c0e2326d09b9]

continuous testing
It is imperative that we test any bug fixes, new features, or any alterations to
the application. To facilitate this we can use the free service Travis CI
[https://travis-ci.org/].

To set up this service you will need to register an account, luckily this can be
done with your GitHub account. Once you sign up, you’ll need to activate the
repo you want Travis to test.

Now you have the repo set up on travis-ci.org [https://travis-ci.org]  we just
need to create a .travis.yml file to tell Travis how to test the codebase.

# .travis.yml
language: node_js
node_js:
  - "11.13.0"

Pushing up the changes results in our first Travis build. Well done us!

GitHub commit
[https://github.com/lets-learn-how-to/test-react-apps-with-jest/commit/fa240ab3609ca6b71fbf96000370129ce933998b]

Part 2: coverage
[https://medium.com/lets-learn-how-to/continuous-everything-part-2-coverage-27e734893add]
