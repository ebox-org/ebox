package node_svc

import (
	"gorm.io/gorm"
)

type NodeModel struct {
	gorm.Model
	NodeID string `gorm:"primaryKey"`
	Name   string
}

type NodeSvc interface {
	NewNode(name string) (*NodeModel, error)

	UpNode(nodeID, name string) (*NodeModel, error)

	GetNode(nodeId string) (*NodeModel, error)
}
