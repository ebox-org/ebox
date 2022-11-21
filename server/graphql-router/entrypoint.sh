#!/bin/sh

sleep 10s # TODO: remove this when we have a better way to wait for the configmap to be mounted

export APOLLO_ELV2_LICENSE=accept

/root/.rover/bin/rover -l info supergraph compose --config /router/config/supergraph-config.yaml > /router/supergraph.graphql

cat /router/supergraph.graphql

# /dist/router -c /router/config/config.yaml -s /router/supergraph.graphql --hot-reload
/router/router -c /router/config/config.yaml -s /router/supergraph.graphql --hot-reload
