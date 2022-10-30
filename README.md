# @bisonai/sbt-js

This repository is a Typescript interface for [@bisonai/sbt-contracts](https://github.com/bisonai/sbt-contracts).

## Installation

```
yarn install
```

## Testing

Tests defined in `test/sbt.ts` can be used for testing on the local or live network.
All settings related to tests are loaded from the `.env` file.
Copy the `.env.example` to the `.env` file, follow included instructions and fill in the required settings.

### Local network

When testing on a local network, we recommend using [Ganache](https://trufflesuite.com/ganache/).
Our test scripts include accounts that come with Ganache when launched with the command `ganache -d`.
After launching Ganache, you can run tests with `yarn test`.

### Live network

Before testing on a live network you will need to create two accounts and fund the first one with tokens.
The name of the network has to be assigned to the `TEST_NETWOK` environment variable located in the `.env` file.
The accounts can be generated with the `npx menmonics` command.
After you generate mnemonics for both accounts, copy them to the `.env` file and assign them to the `MNEMONIC0` and `MNEMONIC1` environment variables.
If you are testing on Klaytn test net called `Baobab`, you will need to fund your account first (only account related to `MNEMONIC0`).
We recommend using [Klaytn Baobab Faucet](https://baobab.wallet.klaytn.foundation/faucet).
Eventually, you can launch test scenarios using the `yarn test` command.

## Publish to registry

```
yarn clean
yarn build
yarn pub
```

## TODO

- [ ] update sbt-contracts dependency
- [ ] prepare public repository
