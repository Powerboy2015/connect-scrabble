package encryption

import "strings"

type User struct {
	Username string
	Password string
}

func simpleDecrypt(cipher string, key int) string {
	result := []rune{}
	shift := key % 256

	for _, ch := range cipher {
		newChar := (int(ch) - shift + 256) % 256
		result = append(result, rune(newChar))
	}

	return string(result)
}

func DecodeUser(_user string) User {
	decodedUser := simpleDecrypt(_user, 16298085)
	splittedUser := strings.Split(decodedUser, "|")
	return User{
		Username: splittedUser[0],
		Password: splittedUser[1],
	}
}
