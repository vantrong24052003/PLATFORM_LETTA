# syntax=docker/dockerfile:1
# check=error=true

ARG RUBY_VERSION=3.3.9
FROM docker.io/library/ruby:$RUBY_VERSION-bookworm AS base

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      curl \
      libjemalloc2 \
      libpq-dev \
      postgresql-client \
      git \
      node-gyp \
      pkg-config \
      python-is-python3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

RUN npm install -g yarn

ENV BUNDLE_PATH=".bundle" \
    BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3

FROM base AS build

COPY .ruby-version Gemfile Gemfile.lock ./
RUN bundle install

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

FROM base

ENV TZ="Asia/Ho_Chi_Minh" \
    RUBY_YJIT_ENABLE=1 \
    RUBYOPT="-W:deprecated --yjit-exec-mem-size=128"

COPY --from=build /rails /rails

RUN mkdir -p tmp/pids log storage

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
