#!/bin/sh

sleep 10s # TODO: remove this when we have a better way to wait for the configmap to be mounted

export APOLLO_ELV2_LICENSE=accept


cd /router

/root/.rover/rover -l info supergraph compose --config ./config/supergraph-config.yaml > ./supergraph.graphql

cat ./supergraph.graphql

# /dist/router -c /router/config/config.yaml -s /router/supergraph.graphql --hot-reload
/router/router -c /router/config/config.yaml -s /router/supergraph.graphql --hot-reload
