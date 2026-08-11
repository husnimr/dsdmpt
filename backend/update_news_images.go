package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

func main() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://postgres:postgres123@localhost:5432/dsdmpt?sslmode=disable"
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, connStr)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(ctx)

	// Fetch all news items
	rows, err := conn.Query(ctx, "SELECT id FROM news ORDER BY id")
	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}
	defer rows.Close()

	var ids []int
	for rows.Next() {
		var id int
		if err := rows.Scan(&id); err != nil {
			log.Fatalf("Scan failed: %v", err)
		}
		ids = append(ids, id)
	}

	// Update image URLs in rotation
	for i, id := range ids {
		imgIdx := (i % 5) + 1
		imgURL := fmt.Sprintf("/uploads/news_%d.png", imgIdx)
		_, err := conn.Exec(ctx, "UPDATE news SET image_url = $1 WHERE id = $2", imgURL, id)
		if err != nil {
			log.Printf("Failed to update news id %d: %v", id, err)
		} else {
			fmt.Printf("Updated news id %d to use %s\n", id, imgURL)
		}
	}

	fmt.Println("Successfully updated all news images in database!")
}
