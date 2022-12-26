FROM alpine:3.16 as Unzipper

ADD ./server/graphql-router/rover-v0.10.0-aarch64-unknown-linux-gnu.tar.gz /unzip/rover
ADD ./server/graphql-router/supergraph-v2.2.1-aarch64-unknown-linux-gnu.tar.gz /unzip/supergraph

RUN mv /unzip/rover/dist /rover
RUN mv /unzip/supergraph/dist/supergraph /rover/supergraph

# FROM ghcr.io/apollographql/router:v1.2.0 as Final
FROM ghcr.io/ndthanhdev/apollo-router-arm64:v1.1.0 as Final

LABEL org.opencontainers.image.source="https://github.com/ebox-org/ebox"

COPY --from=Unzipper --chmod=765 /rover /root/.rover

VOLUME [ "/router/config" ]

WORKDIR /router

COPY ./server/graphql-router/graphql ./graphql

COPY --chmod=765 ./server/graphql-router/entrypoint.sh ./entrypoint.sh

ENTRYPOINT ["/router/entrypoint.sh"]
