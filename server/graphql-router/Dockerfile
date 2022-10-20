FROM alpine:latest as unzipper

COPY ./server/graphql-router/bin.zip /rover/bin.zip

RUN apk add unzip wget curl

RUN mkdir -p /rover/bin

RUN unzip /rover/bin.zip -d /rover/bin

FROM ghcr.io/apollographql/router:v1.2.0 as final

LABEL org.opencontainers.image.source="https://github.com/ebox-org/ebox"

COPY --from=unzipper --chmod=765 /rover/bin /root/.rover/bin

VOLUME [ "/router/config" ]

WORKDIR /router

COPY --chmod=765 ./server/graphql-router/entrypoint.sh ./entrypoint.sh

COPY ./server/graphql-router/graphql ./graphql

ENTRYPOINT ["/router/entrypoint.sh"]

