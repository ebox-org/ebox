// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type Node struct {
	NodeID string `json:"nodeID"`
	Name   string `json:"name"`
}

func (Node) IsEntity() {}

type NodeInput struct {
	Name   string  `json:"name"`
	NodeID *string `json:"nodeId"`
}
