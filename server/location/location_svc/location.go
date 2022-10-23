package location_svc

import (
	"gorm.io/gorm"
)

type LocationModel struct {
	gorm.Model
	NodeID    string `gorm:"primaryKey"`
	Latitude  float64
	Longitude float64
	LastSeen  int64 `gorm:"index"`
}

type Nearby struct {
	NodeID   string
	Distance float64
}

type LocationSvc interface {
	UpLocation(nodeID string, latitude, longitude float64) error

	NearbyNodes(lat, long float64) ([]Nearby, error)
}
