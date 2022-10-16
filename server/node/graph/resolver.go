package graph

//go:generate go run github.com/99designs/gqlgen generate

import (
	node_svc "github.com/ebox-org/ebox/server/node/node_svc"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	NodeSvc node_svc.NodeSvc
}
