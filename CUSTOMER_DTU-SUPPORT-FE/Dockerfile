# syntax=docker/dockerfile:1
# check=error=true

ARG NODE_VERSION=20
FROM docker.io/library/node:$NODE_VERSION-alpine AS base

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

ENV YARN_CACHE_FOLDER=/tmp/.yarn-cache

FROM base AS build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM base

ENV TZ="Asia/Ho_Chi_Minh"

COPY --from=build /app/.output ./

EXPOSE 3000

CMD ["node", "server/index.mjs"]
