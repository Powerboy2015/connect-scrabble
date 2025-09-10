package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"example.com/m/v2/db"
)

type WordRequest struct {
	Letters []string `json:"letters"`
}

type WordResponse struct {
	Words []string `json:"words"`
}

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

	words, err := db.GetWords(req.Letters)
	if err != nil {
		http.Error(w, "Failed to retrieve words", http.StatusInternalServerError)
		return
	}

	response := WordResponse{Words: words}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	// closes application when db connection fails
	if !db.Connect() {
		log.Fatal("Database connection failed")
		return
	}
	// Routes
	http.HandleFunc("/api/v1/findWord", findWordHandler)




	// Start server
	fmt.Println("Backend is running on port 8081")
	http.ListenAndServe(":8081", nil)
}
