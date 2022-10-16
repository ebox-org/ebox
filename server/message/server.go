package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/ebox-org/ebox/server/message/graph"
	"github.com/ebox-org/ebox/server/message/graph/generated"
	"github.com/ebox-org/ebox/server/message/message_svc"
	"github.com/joho/godotenv"
)

const defaultPort = "4000"

func main() {

	env := os.Getenv("env")

	if env == "dev" {
		loadErr := godotenv.Load()
		if loadErr != nil {
			log.Fatal("Error loading .env file")
		}
	}

	port := os.Getenv("PORT")

	if port == "" {
		port = defaultPort
	}

	svc := message_svc.MessageSvcImpl{}

	svc.Init()

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{
		MessageSvc: &svc,
	}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
