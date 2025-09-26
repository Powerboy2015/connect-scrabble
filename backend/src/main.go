package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"zochi.com/m/v2/db"
	"zochi.com/m/v2/multiplayer"
	gameManager "zochi.com/m/v2/multiplayer/connManager"
)

type WordRequest struct {
	Letters []string `json:"letters"`
}

type Word struct {
	Word string `json:"word"`
}

type CheckWordRequest struct {
	Found bool `json:"found"`
}

type WordResponse struct {
	Words []string `json:"words"`
}

var manager = gameManager.Manager

func findWordHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req WordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if len(req.Letters) == 0 {
		http.Error(w, "Missing letters parameter", http.StatusBadRequest)
		return
	}

	if len(req.Letters) > 7 || len(req.Letters) < 4 {
		http.Error(w, "incorrect amount of letters.", http.StatusBadRequest)
		return
	}

	words, err := db.GetWords(req.Letters)
	if err != nil {
		http.Error(w, "Failed to retrieve words", http.StatusNoContent)
		return
	}

	// If an empty array is returned, send a 204 No Content response
	if len(words) == 0 {
		http.Error(w, "No words found", http.StatusNoContent)
		return
	}

	response := WordResponse{Words: words}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func checkWordHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req Word
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if req.Word == "" {
		http.Error(w, "Missing word parameter", http.StatusBadRequest)
		return
	}

	found, err := db.CheckWord(req.Word)
	if err != nil {
		http.Error(w, "Failed to check word", http.StatusInternalServerError)
		return
	}

	response := CheckWordRequest{Found: found}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func withCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		h(w, r)
	}
}

func main() {

	fmt.Println(manager)
	// closes application when db connection fails
	if !db.Connect() {
		log.Fatal("Database connection failed")
		return
	}
	// Routes
	http.HandleFunc("/api/v1/findWord", withCORS(findWordHandler))
	http.HandleFunc("/api/v1/checkWord", withCORS(checkWordHandler))
	http.HandleFunc("/online", withCORS(multiplayer.Connect))

	// Start server
	fmt.Println("Backend is running on port 8081")
	http.ListenAndServe(":8081", nil)
}
