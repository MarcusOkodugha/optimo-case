
package handlers

import (
    "encoding/json"
    "net/http"
    "github.com/madn-optimo/backend/db"
	"database/sql" 
	"github.com/lib/pq" 
	"strings"  
)

type Sale struct {
    Month string `json:"month"`
    Sales int    `json:"sales"` // ← NEW: fixed JSON tag to "sales"
}

// func GetSalesHandler(w http.ResponseWriter, r *http.Request) {
//     conn := db.Connect() // ← NEW: renamed variable for clarity (optional)
    
//     // ← NEW: revised SQL—GROUP/ORDER by date_trunc, alias SUM(amount) as sales
//     rows, err := conn.Query(`
//         SELECT
//           to_char(date_trunc('month', sale_date), 'Mon YYYY') AS month,
//           SUM(amount)                           AS sales
//         FROM sales
//         GROUP BY date_trunc('month', sale_date)
//         ORDER BY date_trunc('month', sale_date)
//     `)
//     if err != nil {
//         http.Error(w, err.Error(), 500)
//         return
//     }
//     defer rows.Close()

//     var results []Sale
//     for rows.Next() {
//         var s Sale
//         if err := rows.Scan(&s.Month, &s.Sales); err != nil {
//             http.Error(w, err.Error(), 500)
//             return
//         }
//         results = append(results, s)
//     }

//     w.Header().Set("Content-Type", "application/json")
//     json.NewEncoder(w).Encode(results)
// }

func GetSalesHandler(w http.ResponseWriter, r *http.Request) {
    conn := db.Connect()

    // ← NEW: read the filter param
    prodQuery := r.URL.Query().Get("products")

    // build base SQL
    baseSQL := `
      SELECT 
        to_char(date_trunc('month', sale_date), 'Mon YYYY') AS month,
        SUM(amount) AS sales
      FROM sales
    `

    var (
        rows *sql.Rows
        err  error
    )

    if prodQuery != "" {
        // ← NEW: split and use parameterized ANY
        products := strings.Split(prodQuery, ",")
        baseSQL += `
          WHERE product = ANY($1)
          GROUP BY date_trunc('month', sale_date)
          ORDER BY date_trunc('month', sale_date)
        `
        rows, err = conn.Query(baseSQL, pq.Array(products))
    } else {
        baseSQL += `
          GROUP BY date_trunc('month', sale_date)
          ORDER BY date_trunc('month', sale_date)
        `
        rows, err = conn.Query(baseSQL)
    }

    if err != nil {
        http.Error(w, err.Error(), 500)
        return
    }
    defer rows.Close()

    var results []Sale
    for rows.Next() {
        var s Sale
        if err := rows.Scan(&s.Month, &s.Sales); err != nil {
            http.Error(w, err.Error(), 500)
            return
        }
        results = append(results, s)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(results)
}