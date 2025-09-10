package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var(
	DB *sql.DB
	// ctx = context.Background()
)

func Connect() bool {
	// Postgres connection string
	connStr := "host=sql-database port=5432 user=user password=password dbname=scrabble-words-db sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
		return false
	}
	DB = db
	return true
}

func GetWords(letters []string) ([]string, error) {
	query := "SELECT word FROM words WHERE LENGTH(word) BETWEEN 4 AND 7 AND ("
	args := []interface{}{}
	for i, letter := range letters {
		if i > 0 {
			query += " AND "
		}
		query += fmt.Sprintf("word LIKE $%d", i+1)
		args = append(args, "%"+letter+"%")
	}
	query += ")"

	rows, err := DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	fmt.Println("Words matching letters:", letters)
	words := []string{}
	for rows.Next() {
		var word string
		if err := rows.Scan(&word); err != nil {
			return nil, err
		}
		words = append(words, word)
		fmt.Println(word)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	return words, nil
}