# syntax=docker/dockerfile:1.4
# Multistage docker build
ARG NODE_VERSION=18

FROM node:${NODE_VERSION}-alpine AS build-deps

WORKDIR /src

# separate package copy for docker layer caching
COPY package.json yarn.lock ./

COPY packages/core/package.json ./packages/core/
COPY packages/ui-kit/package.json ./packages/ui-kit/
COPY packages/sdk/package.json ./packages/sdk/

COPY packages/plugin_miro/package.json ./packages/plugin_miro/
COPY packages/app/package.json ./packages/app/

RUN yarn install --immutable --immutable-cache --check-cache


# Monorepo shared deps
FROM build-deps as base-build
COPY . .
RUN yarn build:deps


# App builder
FROM base-build as app-build
RUN yarn workspace @momentum-xyz/ui-client install
RUN yarn workspace @momentum-xyz/ui-client build


# Plugin builder
ARG PLUGIN=miro
FROM base-build as plugin-build
ARG PLUGIN
RUN yarn workspace plugin_${PLUGIN} install
RUN yarn workspace plugin_${PLUGIN} build


# Base runtime
FROM nginx:1.22.0-alpine as base-runtime
WORKDIR /opt/srv

ADD ./docker_assets/nginx.conf /etc/nginx/nginx.conf


# Plugin runtime
FROM base-runtime as plugin-runtime
ARG PLUGIN

COPY --from=plugin-build --link /src/packages/plugin_${PLUGIN}/build /opt/srv


# App runtime, keep it last as the default image
FROM base-runtime as app-runtime

COPY --from=app-build --link /src/packages/app/build /opt/srv
