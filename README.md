# @bisonai/sbt-js

## Authentication

[Login to AWS codeartifact](https://www.notion.so/krustuniverse/AWS-Code-Artifact-50a3a3864116485f91f2c61d98b1ad9f) before publishing.

```shell
aws codeartifact login \
    --tool npm \
    --repository bisonai \
    --domain bisonai
```

## Prerequisites

Generate mnemonic.

```shell
npx mnemonics
```

Create `.env` from `.env.example`

```shell
cp .env.example .env
```

to run on baobab fill in generated mnemonic to `MNEMONIC0` and `MNEMONIC1` environment variable.

## Installation

```shell
yarn install
```

## Build

```shell
yarn build
```

## Test

```shell
yarn test
```
