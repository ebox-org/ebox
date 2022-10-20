FROM alpine:3.16.2 as unzip

COPY ./server/graphql-router/bin.zip /rover/bin.zip

RUN apk add unzip

RUN unzip /rover/bin.zip -d /rover/bin

FROM ghcr.io/apollographql/router:v1.2.0 as final

COPY --from=unzip --chmod=765 /rover/bin /root/.rover/bin

VOLUME [ "/router/config" ]

WORKDIR /router

COPY --chmod=765 ./server/graphql-router/entrypoint.sh ./entrypoint.sh

COPY ./server/graphql-router/graphql ./graphql

ENTRYPOINT ["/router/entrypoint.sh"]

LABEL org.opencontainers.image.source="https://github.com/ebox-org/ebox"
