package handlers

import (
  "encoding/json"
  "net/http"

  "github.com/go-chi/chi/v5"
  "github.com/madn-optimo/backend/db"
)

type PurchaseOrder struct {
  ID                int    `json:"id"`
  Supplier          string `json:"supplier"`
  Quantity          int    `json:"quantity"`
  OrderDate         string `json:"order_date"`         // YYYY-MM-DD
  EstimatedDelivery string `json:"estimated_delivery"` // YYYY-MM-DD
}

// GET /purchase-orders
func GetPOs(w http.ResponseWriter, r *http.Request) {
  conn := db.Connect()
  rows, err := conn.Query(`
    SELECT id, supplier, quantity, order_date, estimated_delivery
      FROM purchase_orders
     ORDER BY order_date DESC
  `)
  if err != nil {
    http.Error(w, err.Error(), 500)
    return
  }
  defer rows.Close()

  var list []PurchaseOrder
  for rows.Next() {
    var po PurchaseOrder
    rows.Scan(&po.ID, &po.Supplier, &po.Quantity, &po.OrderDate, &po.EstimatedDelivery)
    list = append(list, po)
  }
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(list)
}

// POST /purchase-orders
func CreatePO(w http.ResponseWriter, r *http.Request) {
  var po PurchaseOrder
  if err := json.NewDecoder(r.Body).Decode(&po); err != nil {
    http.Error(w, err.Error(), 400)
    return
  }
  conn := db.Connect()
  err := conn.QueryRow(`
    INSERT INTO purchase_orders (supplier, quantity, order_date, estimated_delivery)
    VALUES ($1, $2, $3, $4) RETURNING id
  `, po.Supplier, po.Quantity, po.OrderDate, po.EstimatedDelivery).Scan(&po.ID)
  if err != nil {
    http.Error(w, err.Error(), 500)
    return
  }
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(201)
  json.NewEncoder(w).Encode(po)
}

// DELETE /purchase-orders/{id}
func DeletePO(w http.ResponseWriter, r *http.Request) {
  id := chi.URLParam(r, "id")
  conn := db.Connect()
  _, err := conn.Exec(`DELETE FROM purchase_orders WHERE id = $1`, id)
  if err != nil {
    http.Error(w, err.Error(), 500)
    return
  }
  w.WriteHeader(204)
}
