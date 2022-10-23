package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/joho/godotenv"
)

var db = make(map[string]string)

type FInfo struct {
	FID string "json:fid"
}

func setupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	r := gin.Default()

	env := os.Getenv("env")

	if env == "dev" {
		loadErr := godotenv.Load()
		if loadErr != nil {
			log.Fatal("Error loading .env file")
		}
	}

	seaweedMaster := os.Getenv("SEAWEEDFS_MASTER")
	seaweedVolume := os.Getenv("SEAWEEDFS_VOLUME")

	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	r.POST("upload", func(c *gin.Context) {

		res, _ := http.Get(seaweedMaster + "/dir/assign")

		body, _ := ioutil.ReadAll(res.Body)

		fInfo := &FInfo{}
		json.Unmarshal(body, fInfo)

		c.Request.ParseMultipartForm(30 * 1024 * 1024)

		formFile, formFH, _ := c.Request.FormFile("file")

		fBytes, _ := ioutil.ReadAll(formFile)

		buf := new(bytes.Buffer)
		bw := multipart.NewWriter(buf) // body writer

		p1w, _ := bw.CreateFormFile("file", formFH.Filename)
		p1w.Write(fBytes)

		bw.Close()

		http.Post(seaweedVolume+"/"+fInfo.FID, bw.FormDataContentType(), buf)

		c.JSON(http.StatusOK, gin.H{
			"fid": fInfo.FID,
		})
	})

	r.GET("download/:fid", func(c *gin.Context) {
		res, err := http.Get(seaweedVolume + "/" + c.Param("fid"))

		if err != nil {
			c.Status(http.StatusNotFound)
			return
		}

		bytes, err := ioutil.ReadAll(res.Body)

		if err != nil {
			c.Status(http.StatusInternalServerError)
			return
		}

		c.Writer.Write(bytes)
		c.Status(http.StatusOK)

	})

	r.Use(cors.Default())

	return r
}

func main() {
	r := setupRouter()
	// Listen and Server in 0.0.0.0:4000
	r.Run(":4000")
}
