FROM node:16-alpine AS build

WORKDIR /usr/src/app
COPY public ./public
# RUN mkdir /usr/src/app/build
# COPY ./env.sh /usr/src/app/build/env.sh
# COPY ./.env.base /usr/src/app/build/env.base
COPY tsconfig.json package.json yarn.lock craco.config.js tailwind.config.js ./
RUN yarn install
COPY src ./src
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
