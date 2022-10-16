FROM node as builder

WORKDIR /web-app

COPY ./ ./

RUN yarn install
RUN yarn build

FROM nginx as final

COPY --from=builder /web-app/dist /usr/share/nginx/html

LABEL org.opencontainers.image.source="https://github.com/ebox-org/ebox"