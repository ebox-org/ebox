package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/ebox-org/ebox/server/node/graph/generated"
	"github.com/ebox-org/ebox/server/node/graph/model"
)

// FindNodeByNodeID is the resolver for the findNodeByNodeID field.
func (r *entityResolver) FindNodeByNodeID(ctx context.Context, nodeID string) (*model.Node, error) {
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

// Entity returns generated.EntityResolver implementation.
func (r *Resolver) Entity() generated.EntityResolver { return &entityResolver{r} }

type entityResolver struct{ *Resolver }
