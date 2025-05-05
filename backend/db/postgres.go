package db

import (
  "database/sql"
  _ "github.com/lib/pq"
  "fmt"
  "log"
  "os"
)

func Connect() *sql.DB {
  dsn := fmt.Sprintf(
    "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
    os.Getenv("DB_HOST"),
    os.Getenv("DB_USER"),
    os.Getenv("DB_PASSWORD"),
    os.Getenv("DB_NAME"),
    os.Getenv("DB_PORT"),
  )
  db, err := sql.Open("postgres", dsn)
  if err != nil {
    log.Fatal(err)
  }
  if err := db.Ping(); err != nil {
    log.Fatal(err)
  }
  return db
}
