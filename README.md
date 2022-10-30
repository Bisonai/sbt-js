# @bisonai/sbt-js

This repository is a Typescript interface for [@bisonai/sbt-contracts](https://github.com/bisonai/sbt-contracts).

## Installation

```
yarn install
```

## Testing

Tests defined in `test/sbt.ts` can be used for testing on local or live network.
All settings related to tests are loaded from `.env` file.
Copy `.env.example` to `.env` file, follow included instructions and fill in required settings.

### Local network

When testing on local network, we recommend to use [Ganache](https://trufflesuite.com/ganache/).
Our test scripts include accounts that come with Ganache when launched with command `ganache -d`.
After launching Ganache, you can run tests with `yarn test`.

### Live network

Before testing on live network you will need to create two accounta and fund the first one with tokens.
The name of network has to be assigned to `TEST_NETWOK` environment variable located in `.env` file.
The accounts can generated with `npx menmonics` command.
After you generate menmonics for both accounts, copy them to `.env` file and assign them to `MNEMONIC0` and `MNEMONIC1` environment variables.
If you are testing on Klaytn test net called `Baobab`, you will need to fund your account first (only account related with `MNEMONIC0`).
We recommend using [Klaytn Baobab Faucet](https://baobab.wallet.klaytn.foundation/faucet).
Eventually, you can launch test scenarios using `yarn test` command.

## Publish to registry

```
yarn clean
yarn build
yarn pub
```

## TODO

- [ ] update sbt-contracts dependency
- [ ] prepare public repository
