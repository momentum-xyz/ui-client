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
COPY packages/core3d/package.json ./packages/core3d/

COPY packages/plugin_miro/package.json ./packages/plugin_miro/
COPY packages/plugin_google_drive/package.json ./packages/plugin_google_drive/
COPY packages/plugin_video/package.json ./packages/plugin_video/
COPY packages/app/package.json ./packages/app/

RUN --mount=type=secret,id=npm,target=/root/.npmrc,required=true \
    yarn install --frozen-lockfile


# Monorepo shared deps
FROM build-deps as base-build
COPY . .
RUN yarn build:deps


# App builder
ARG BUILD_VERSION
FROM base-build as app-build
ARG BUILD_VERSION
RUN yarn workspace @momentum-xyz/ui-client install --check-files
ENV REACT_APP_VERSION=${BUILD_VERSION}
RUN yarn workspace @momentum-xyz/ui-client build


# Plugin builder
ARG PLUGIN=miro
FROM base-build as plugin-build
ARG PLUGIN
RUN yarn workspace plugin_${PLUGIN} install --check-files
RUN yarn workspace plugin_${PLUGIN} build


# Base runtime
FROM nginx:1.25.2-alpine as base-runtime
WORKDIR /opt/srv

ADD ./docker_assets/nginx.conf /etc/nginx/nginx.conf


# Plugin runtime
FROM base-runtime as plugin-runtime
ARG PLUGIN

COPY --from=plugin-build --link /src/packages/plugin_${PLUGIN}/build /opt/srv


# App runtime, keep it last as the default image
FROM base-runtime as app-runtime
COPY --from=app-build --link /src/packages/app/build /opt/srv
ARG BUILD_VERSION
LABEL org.opencontainers.image.source=https://github.com/momentum-xyz/ui-client
LABEL org.opencontainers.image.description="Web UI of Odyssey Momentum"
LABEL org.opencontainers.image.licenses=GPL-3.0
LABEL maintainer="Odyssey Maintainers"
LABEL version="$BUILD_VERSION"

