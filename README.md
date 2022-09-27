# @bisonai/sbt-js

## Authentication

[Login to AWS codeartifact](https://www.notion.so/krustuniverse/AWS-Code-Artifact-50a3a3864116485f91f2c61d98b1ad9f) before publishing.

```shell
aws codeartifact login \
    --tool npm \
    --repository bisonai \
    --domain bisonai
```

## Installation

```shell
yarn install
```

## Build

```shell
yarn build
```

## Publish

```shell
cd dist && yarn publish
```
