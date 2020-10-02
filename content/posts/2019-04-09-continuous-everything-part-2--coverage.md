---
title: "continuous everything part 2: coverage"
date: 2019-04-09
draft: true
---

Continuing from part 1
[https://medium.com/lets-learn-how-to/continuous-everything-part-1-testing-bbaab938e41a] 
 here I cover how to ensure that not only do your tests pass but that they
actually test all of your code. I am working from a GitHub repo
[https://github.com/lets-learn-how-to/test-react-apps-with-jest]  created in
part 1 of this series.

Now we have our repo set up to be tested on Travis CI, we should also check that
any tests we write cover as much of the codebase as possible. To achieve this
we’ll use codeclimate quality [https://codeclimate.com/quality/]. Travis
integrates with this service nicely and configuration is well documented
[https://docs.codeclimate.com/docs/travis-ci-test-coverage].

Stay with us as there are a number of changes that need to be made.

package.json

Add the jest property to your package.json.

# package.json excerpt
"jest": {
  "collectCoverageFrom": [
    "src/**/*.{js,jsx}",
    "!src/index.js",
    "!src/serviceWorker.js"
  ],
  "coverageReporters": [
    "lcov"
  ]
}

This will ensure that we only take into account our source files when assessing
code coverage, ignoring the index.js and serviceWorker.js files provided by
create-react-app. We also ensure the coverage output is done through lcov
[https://github.com/linux-test-project/lcov], which codeclimate needs to process
and produce a report.

.travis.yml

We now need to tell Travis to send our coverage information to codeclimate when
it has finished running the test script. To do this, we make some changes to
the .travis.yml file.

# .travis.yml
language: node_js
node_js:
  - "11.13.0"
before_script:
  - curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
  - chmod +x ./cc-test-reporter
  - ./cc-test-reporter before-build
script:
  - yarn test --coverage
after_script:
  - ./cc-test-reporter after-build --exit-code $TRAVIS_TEST_RESULT

will it blend?

Now we have these changes in place, let’s push them up and check that our
changes are tested, and test coverage is sent to codeclimate.

Our tests run, and our coverage report is generated as we expect. But oh no, it
looks like sending the coverage report to codeclimate failed. We need to add an
environment variable “CC_TEST_REPORTER_ID” to Travis’s build settings for this
to work. Go to codeclimate and you’ll find the information needed in the
repository settings page.

Copy the test reporter id, and go to the repository settings page on Travis CI.

Add the test reporter id to the repository settings as pictured. By default, it
will not display in the build log, so no need to worry about the log being
public. Now we can restart the last build to test our code coverage report is
sent properly.

Success! We now have full testing and code coverage reporting in place.

GitHub commit
[https://github.com/lets-learn-how-to/test-react-apps-with-jest/commit/1cb0685655e4cac6fd41a717ca73807bf9412457]
