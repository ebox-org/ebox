package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/ebox-org/ebox/server/location/graph/generated"
	"github.com/ebox-org/ebox/server/location/graph/model"
)

// UpLocation is the resolver for the upLocation field.
func (r *mutationResolver) UpLocation(ctx context.Context, input model.LocationInput) (bool, error) {
	err := r.Svc.UpLocation(input.NodeID, input.Latitude, input.Longitude)

	if err != nil {
		return false, err
	}

	return true, nil
}

// FindNearbyNodes is the resolver for the findNearbyNodes field.
func (r *queryResolver) FindNearbyNodes(ctx context.Context, latitude float64, longitude float64) ([]*model.Nearby, error) {
	nodes, err := r.Svc.NearbyNodes(latitude, longitude)

	if err != nil {
		return nil, err
	}

	var re []*model.Nearby

	for _, n := range nodes {
		re = append(re, &model.Nearby{
			Node: &model.Node{
				NodeID: n.NodeID,
			},
			Distance: n.Distance,
		})
	}

	return re, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
