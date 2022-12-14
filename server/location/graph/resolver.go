package graph

//go:generate go run github.com/99designs/gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.
import (
	"github.com/ebox-org/ebox/server/location/location_svc"
)

type Resolver struct {
	Svc location_svc.LocationSvc
}
