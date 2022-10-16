package location_svc

import (
	"fmt"
	"math"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type LocationSvcImpl struct {
	db       *gorm.DB
	lifeTime int64
}

func (impl *LocationSvcImpl) Init() (void, err error) {

	var (
		DB_HOST = os.Getenv("DB_HOST")
		DB_PORT = os.Getenv("DB_PORT")
		DB_USER = os.Getenv("DB_USER")
		DB_PASS = os.Getenv("DB_PASSWORD")
		DB_NAME = os.Getenv("DB_NAME")
	)

	impl.lifeTime = 5 * 60

	dsn := fmt.Sprintf("host=%s  port=%s user=%s password=%s dbname=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh", DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME)

	_db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	impl.db = _db

	if err != nil {
		panic(err)
	}

	impl.db.AutoMigrate(&LocationModel{})

	return
}

func (impl *LocationSvcImpl) UpLocation(nodeID string, latitude float64, longitude float64) error {

	location := &LocationModel{
		NodeID:    nodeID,
		Latitude:  latitude,
		Longitude: longitude,
		LastSeen:  time.Now().Unix(),
	}

	tx := impl.db.Save(location)

	if tx.Error != nil {
		return tx.Error
	}

	return nil
}

const maxLen = 999999 //0.05

func maxLongDiff(lat float64) float64 {
	return float64(40075) * math.Cos(lat) / 360 * maxLen
}

const latLen = 111.32

const maxDiffLat = maxLen / latLen

// func maxDiff(lat, long float64) (float64, float64) {
// 	return maxDiffLat, maxLongDiff(lat)
// }

func maxDiff(lat, long float64) (float64, float64) {
	return 90, 180
}

func distance(lat1 float64, lng1 float64, lat2 float64, lng2 float64, unit ...string) float64 {
	radlat1 := float64(math.Pi * lat1 / 180)
	radlat2 := float64(math.Pi * lat2 / 180)

	theta := float64(lng1 - lng2)
	radtheta := float64(math.Pi * theta / 180)

	dist := math.Sin(radlat1)*math.Sin(radlat2) + math.Cos(radlat1)*math.Cos(radlat2)*math.Cos(radtheta)
	if dist > 1 {
		dist = 1
	}

	dist = math.Acos(dist)
	dist = dist * 180 / math.Pi
	dist = dist * 60 * 1.1515

	if len(unit) > 0 {
		if unit[0] == "K" {
			dist = dist * 1.609344
		} else if unit[0] == "N" {
			dist = dist * 0.8684
		}
	}

	return dist
}

func (impl *LocationSvcImpl) NearbyNodes(lat, long float64) ([]Nearby, error) {

	mdLat, mdLong := maxDiff(lat, long)

	minLat, minLong := lat-mdLat, long-mdLong

	maxLat, maxLong := lat+mdLat, long+mdLong

	minLastSeen := time.Now().Unix() - impl.lifeTime

	var locations []LocationModel

	sub := impl.db.Table("location_models").Group("node_id").Select("max(id) as id").Having("max(last_seen) > ?", minLastSeen)

	tx := impl.db.Where(`latitude >= ?`, minLat).Where(`longitude >= ?`, minLong).Where(`latitude <= ?`, maxLat).Where(`longitude <= ?`, maxLong).Where("id in (?)", sub).Order("id DESC").Limit(50).Find(&locations)

	if tx.Error != nil {
		return nil, tx.Error
	}
	var re []Nearby

	for _, location := range locations {

		dis := distance(lat, long, location.Latitude, location.Longitude, "K")

		re = append(re, Nearby{
			NodeID:   location.NodeID,
			Distance: dis,
		})
	}

	return re, nil
}
