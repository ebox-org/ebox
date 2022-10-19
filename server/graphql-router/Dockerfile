FROM ghcr.io/apollographql/router:v1.2.0

COPY --chmod=765 ./server/graphql-router/bin /root/.rover/bin

VOLUME [ "/router/config" ]

WORKDIR /router

COPY --chmod=765 ./server/graphql-router/entrypoint.sh ./entrypoint.sh
COPY ./server/graphql-router/graphql ./graphql

ENTRYPOINT ["/router/entrypoint.sh"]

LABEL org.opencontainers.image.source="https://github.com/ebox-org/ebox"
