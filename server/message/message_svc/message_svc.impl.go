package message_svc

import (
	"fmt"
	"os"

	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type MessageSvcImpl struct {
	db *gorm.DB
}

func (impl *MessageSvcImpl) Init() (void, err error) {

	var (
		DB_HOST = os.Getenv("DB_HOST")
		DB_PORT = os.Getenv("DB_PORT")
		DB_USER = os.Getenv("DB_USER")
		DB_PASS = os.Getenv("DB_PASSWORD")
		DB_NAME = os.Getenv("DB_NAME")
	)

	dsn := fmt.Sprintf("host=%s  port=%s user=%s password=%s dbname=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh", DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME)

	_db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	impl.db = _db

	if err != nil {
		panic(err)
	}

	impl.db.AutoMigrate(&MessageModel{})

	return
}

func (impl *MessageSvcImpl) SendMessage(input MessageInput) (*MessageModel, error) {
	var msg MessageModel

	msg.MessageID = uuid.New().String()
	msg.FromID = input.FromID
	msg.ToID = input.ToID
	msg.MessageType = input.MessageType
	msg.Content = input.Content

	result := impl.db.Save(&msg)

	if result.Error != nil {
		return nil, result.Error
	}

	return &msg, nil
}

func (impl *MessageSvcImpl) GetMessages(toID string) ([]MessageModel, error) {
	var msgs []MessageModel

	result := impl.db.Where(`to_id = ?`, toID).Or(`from_id`, toID).Order(`id DESC`).Limit(50).Find(&msgs)

	if result.Error != nil {
		return nil, result.Error
	}

	return msgs, nil
}
