package redis

import (
	"context"

	"github.com/redis/go-redis/v9"
)

var (
	Rdb *redis.Client
	ctx = context.Background()
)

func Connect() string {
	return "yes"
}