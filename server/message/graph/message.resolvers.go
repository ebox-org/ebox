package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/ebox-org/ebox/server/message/graph/generated"
	"github.com/ebox-org/ebox/server/message/graph/model"
	"github.com/ebox-org/ebox/server/message/message_svc"
)

// SendMessage is the resolver for the sendMessage field.
func (r *mutationResolver) SendMessage(ctx context.Context, message model.MessageInput) (*model.Message, error) {
	dbMessage, err := r.MessageSvc.SendMessage(message_svc.MessageInput{
		FromID:      message.FromID,
		ToID:        message.ToID,
		MessageType: message.MessageType,
		Content:     message.Content,
	})

	if err != nil {
		return nil, err
	}

	return &model.Message{
		MessageID:   dbMessage.MessageID,
		FromID:      dbMessage.FromID,
		ToID:        dbMessage.ToID,
		MessageType: dbMessage.MessageType,
		Content:     dbMessage.Content,
	}, nil
}

// GetMessage is the resolver for the getMessage field.
func (r *queryResolver) GetMessage(ctx context.Context, toID string) ([]*model.Message, error) {
	dbMessages, err := r.MessageSvc.GetMessages(toID)

	if err != nil {
		return nil, err
	}

	messages := make([]*model.Message, len(dbMessages))

	for i, dbMessage := range dbMessages {
		messages[i] = &model.Message{
			MessageID:   dbMessage.MessageID,
			FromID:      dbMessage.FromID,
			ToID:        dbMessage.ToID,
			MessageType: dbMessage.MessageType,
			Content:     dbMessage.Content,
		}
	}

	return messages, nil
}

// MessageReceived is the resolver for the messageReceived field.
func (r *subscriptionResolver) MessageReceived(ctx context.Context, toID string) (<-chan *model.Message, error) {
	panic(fmt.Errorf("not implemented: MessageReceived - messageReceived"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
