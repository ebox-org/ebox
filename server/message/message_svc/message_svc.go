package message_svc

import (
	"gorm.io/gorm"
)

type MessageModel struct {
	gorm.Model
	MessageID   string `gorm:"primaryKey"`
	FromID      string
	ToID        string
	MessageType string
	Content     string
}

type MessageInput struct {
	FromID      string
	ToID        string
	MessageType string
	Content     string
}

type MessageSvc interface {
	SendMessage(input MessageInput) (*MessageModel, error)

	GetMessages(toID string) ([]MessageModel, error)
}
