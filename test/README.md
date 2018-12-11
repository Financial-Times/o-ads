# Testing

There are currently 3 different type of tests in o-ads.

## Unit Tests

These run on karma and QUnit. You can run them with `npm run test-unit`

## Cypress Tests

Browser tests using Cypress.io to check ad requests and end to end behaviour.

### Local

Cypress.io has a really nice UI, which is the preferred method for running these tests when you're developing. It watches the test files and re-runs in the background on any changes to test files. You can open this with `npm run test-cy:open`. From the UI, you can select which tests to run.

Alternatively, you can run these in a terminal with `npm run test-cy:run`.

### CI

Cypress tests also run in CI, with the the run command above: `npm run test-cy:run`. This runs the Electron browser packaged with Cypress. See their [docs](https://docs.cypress.io/guides/guides/command-line.html) for more info.

As part of the CI process, Cypress also records videos of every run and automatically takes screenshots of any failing tests. These are stored as artifacts in CircleCI, and you can access them in the `Artifacts` tab on the test job of the o-ads workflow.


## Nightwatch Tests

These are slowly being depracated. To run these, you'll need to

1. Make sure you have a .env file with the following keys `BROWSERSTACK_USER`, `BROWSERSTACK_KEY` and `BROWSERSTACK_LOCAL`. You can get these from vault or someone from next team.
2. `npm run demo-server` in your terminal. This will compile and launch the demos on http://localhost:3002. This is needed for the next step to work
3. `npm run test-browser` will run a local browserstack tunnel and run the tests




