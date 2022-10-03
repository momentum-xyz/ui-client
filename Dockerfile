FROM node:18-alpine AS build

WORKDIR /usr/src/app

# separate for docker layer caching
COPY package.json yarn.lock ./
COPY packages/app/package.json ./packages/app/
COPY packages/ui-kit/package.json ./packages/ui-kit/
COPY packages/core/package.json ./packages/core/
RUN yarn install --immutable --immutable-cache --check-cache

COPY . .
RUN yarn build:depsAndApp


FROM nginx:1.22.0-alpine as production-build
WORKDIR /opt/srv

ADD ./docker_assets/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/packages/app/build /opt/srv

