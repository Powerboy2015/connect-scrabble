package encryption

import (
	"fmt"
	"strings"
)

type User struct {
	Username string
	Password string
}

// simpleDecrypt decrypts text encrypted with the JavaScript simpleEncrypt function
// This version works with the updated JavaScript encryption that uses printable ASCII
func simpleDecrypt(cipher string, key int) string {
	// Use the same shift as JavaScript (values 1-127)
	shift := key%126 + 1

	// Buffer to hold the decrypted bytes
	var result []byte

	// Decrypt each character
	for _, ch := range cipher {
		// Same math as JavaScript, working in the printable ASCII range (32-126)
		base := 32      // ASCII space character
		rangeSize := 95 // 127-32, printable ASCII range

		// Calculate the original byte
		originalByte := ((int(ch)-base-shift)%rangeSize+rangeSize)%rangeSize + base
		result = append(result, byte(originalByte))
	}

	// The result is now proper UTF-8
	decoded := string(result)
	fmt.Println("decoded user: ", decoded)
	return decoded
}

func DecodeUser(_user string) User {
	fmt.Println("user to decode: ", _user)
	decodedUser := simpleDecrypt(_user, 16298085)

	// Safety check for empty string
	if decodedUser == "" {
		fmt.Println("Warning: Empty decoded result")
		return User{Username: "", Password: ""}
	}

	splittedUser := strings.Split(decodedUser, "|")

	// Make sure we have both parts
	if len(splittedUser) < 2 {
		fmt.Println("Warning: Missing separator in decoded string:", decodedUser)
		return User{Username: "", Password: ""}
	}

	return User{
		Username: splittedUser[0],
		Password: splittedUser[1],
	}
}
