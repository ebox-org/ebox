FROM node as builder

WORKDIR /src

COPY ./client/daemon ./daemon
COPY ./client/web-app ./web-app

WORKDIR /src/daemon

RUN yarn install
RUN yarn build

WORKDIR /src/web-app

RUN yarn install
RUN yarn build

FROM nginx as final

COPY --from=builder /src/web-app/dist /usr/share/nginx/html

LABEL org.opencontainers.image.source="https://github.com/ebox-org/ebox"
