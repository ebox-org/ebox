FROM ghcr.io/ebox-org/apollo-router-arm64:v1.1.0

COPY --chmod=765 ./bin /root/.rover/bin

VOLUME [ "/router/config" ]

WORKDIR /router

COPY --chmod=765 ./entrypoint.sh ./entrypoint.sh
COPY ./graphql ./graphql

ENTRYPOINT ["/router/entrypoint.sh"]

LABEL org.opencontainers.image.source="https://github.com/ebox-org/ebox"
