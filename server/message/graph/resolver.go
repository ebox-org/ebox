package graph

import "github.com/ebox-org/ebox/server/message/message_svc"

//go:generate go run github.com/99designs/gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	MessageSvc message_svc.MessageSvc
}
