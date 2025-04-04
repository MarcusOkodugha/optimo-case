package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Server running OK"))
	})
	log.Print("Server starting on port 8080")
	http.ListenAndServe(":8080", r)
}
