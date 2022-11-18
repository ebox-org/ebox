FROM alpine:3.16 as Unzipper

COPY ./server/graphql-router/bin.zip /rover/bin.zip

RUN apk add unzip

WORKDIR /rover

RUN unzip bin.zip

# FROM ghcr.io/apollographql/router:v1.2.0 as Final
FROM ghcr.io/ndthanhdev/apollo-router-arm64:v1.0.0 as Final

LABEL org.opencontainers.image.source="https://github.com/ebox-org/ebox"

COPY --from=Unzipper --chmod=765 /rover/bin /root/.rover/bin

VOLUME [ "/router/config" ]

WORKDIR /router

COPY ./server/graphql-router/graphql ./graphql

COPY --chmod=765 ./server/graphql-router/entrypoint.sh ./entrypoint.sh

ENTRYPOINT ["/router/entrypoint.sh"]
