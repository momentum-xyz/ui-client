FROM node:16-alpine AS build

WORKDIR /usr/src/app

# separate for docker layer caching
COPY package.json yarn.lock ./
RUN yarn install --immutable --immutable-cache --check-cache

COPY . .
RUN yarn build


FROM nginx:alpine as production-build
WORKDIR /usr/share/nginx/html

ADD ./docker_assets/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY scripts/env.sh .
COPY ./.env.base .

EXPOSE 80

CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && exec nginx -g \"daemon off;\""]
