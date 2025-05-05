package main

import (
	"log"
	"net/http"
	"github.com/go-chi/chi/v5"
	"github.com/madn-optimo/backend/handlers"
	"github.com/go-chi/cors"
	"github.com/madn-optimo/backend/db"


)

func main() {
	db.Connect()          
	r := chi.NewRouter()

	
	r.Use(cors.New(cors.Options{
		   AllowedOrigins:   []string{"*"},
		   AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		   AllowedHeaders:   []string{"*"},
		}).Handler)


	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Server running OK"))
	})
	
	r.Get("/purchase-orders", handlers.GetPOs)
	r.Post("/purchase-orders", handlers.CreatePO)
	r.Delete("/purchase-orders/{id}", handlers.DeletePO)

	r.Get("/sales", handlers.GetSalesHandler)

	log.Print("Server starting on port 8080")
	http.ListenAndServe(":8080", r)
}