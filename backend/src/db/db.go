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
	freq := map[string]int{}
	for _, l := range letters {
		freq[l]++
	}

	query := "SELECT word FROM words WHERE length(word) BETWEEN 4 AND 7"
	args := []interface{}{}
	
	i := 1
	for l, c := range freq {
		query += fmt.Sprintf(" AND (length(word) - length(replace(lower(word), $%d::text, ''))) >= $%d", i, i+1)
		args = append(args, l, c)
		i += 2
	}

	rows, err := DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if rows.Next() == false {
		return []string{}, nil
	}

	words := []string{}
	for rows.Next() {
		var word string
		if err := rows.Scan(&word); err != nil {
			return nil, err
		}
		words = append(words, word)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	return words, nil
}

func CheckWord(word string) (bool, error) {
	var exists bool
	err := DB.QueryRow("SELECT EXISTS(SELECT 1 FROM words WHERE word=$1)", word).Scan(&exists)
	return exists, err
}