package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/ebox-org/ebox/server/message/graph/generated"
	"github.com/ebox-org/ebox/server/message/graph/model"
)

// FindMessageByMessageID is the resolver for the findMessageByMessageID field.
func (r *entityResolver) FindMessageByMessageID(ctx context.Context, messageID string) (*model.Message, error) {
	panic(fmt.Errorf("not implemented: FindMessageByMessageID - findMessageByMessageID"))
}

// Entity returns generated.EntityResolver implementation.
func (r *Resolver) Entity() generated.EntityResolver { return &entityResolver{r} }

type entityResolver struct{ *Resolver }
