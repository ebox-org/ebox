package node_svc

import (
	"errors"
	"fmt"
	"os"

	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type NodeSvcImpl struct {
	db *gorm.DB
}

func (impl *NodeSvcImpl) Init() (void, err error) {

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

	impl.db.AutoMigrate(&NodeModel{})

	return
}

func (impl *NodeSvcImpl) NewNode(Name string) (*NodeModel, error) {
	var node NodeModel

	node.Name = Name
	node.NodeID = uuid.New().String()

	result := impl.db.Save(&node)

	if result.Error != nil {
		return nil, result.Error
	}

	return &node, nil
}

func (impl *NodeSvcImpl) UpNode(nodeId, name string) (*NodeModel, error) {
	var node NodeModel

	result := impl.db.Where(`node_id = ?`, nodeId).First(&node)

	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		// not found
		return nil, errors.New("not found")
	}

	node.Name = name

	result = impl.db.Save(&node)

	if result.Error != nil {
		return nil, result.Error
	}

	return &node, nil
}

func (impl *NodeSvcImpl) GetNode(NodeID string) (*NodeModel, error) {
	var node NodeModel

	result := impl.db.Where(`node_id = ?`, NodeID).First(&node)

	if result.Error != nil {
		return nil, result.Error
	}

	return &node, nil
}
