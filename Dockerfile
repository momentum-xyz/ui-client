FROM node:16-alpine AS build

WORKDIR /usr/src/app

# separate for docker layer caching
COPY package.json yarn.lock ./
RUN yarn install --immutable --immutable-cache --check-cache

COPY . .
RUN yarn build


FROM nginx:1.20.2-alpine as production-build
WORKDIR /opt/srv

ADD ./docker_assets/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/build /opt/srv

