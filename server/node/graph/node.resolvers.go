package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/ebox-org/ebox/server/node/graph/generated"
	"github.com/ebox-org/ebox/server/node/graph/model"
)

// UpNode is the resolver for the upNode field.
func (r *mutationResolver) UpNode(ctx context.Context, node model.NodeInput) (*model.Node, error) {
	if node.NodeID == nil {
		data, err := r.NodeSvc.NewNode(node.Name)

		if err != nil {
			return nil, err
		}

		re := &model.Node{
			NodeID: data.NodeID,
			Name:   data.Name,
		}

		return re, err
	}

	data, err := r.NodeSvc.UpNode(*node.NodeID, node.Name)

	if err != nil {
		return nil, err
	}

	re := &model.Node{
		NodeID: data.NodeID,
		Name:   data.Name,
	}

	return re, err
}

// Node is the resolver for the node field.
func (r *queryResolver) Node(ctx context.Context, nodeID string) (*model.Node, error) {
	data, err := r.NodeSvc.GetNode(nodeID)

	if err != nil {
		return nil, err
	}

	re := &model.Node{
		NodeID: data.NodeID,
		Name:   data.Name,
	}

	return re, err
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
