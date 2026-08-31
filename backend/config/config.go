package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	JWTSecret  string
	Port       string
}

func LoadConfig() *Config {
	wd, _ := os.Getwd()
	envPath := filepath.Join(wd, ".env")

	if err := godotenv.Load(envPath); err != nil {
		log.Printf("Warning: Gagal load .env dari %s: %v", envPath, err)
	}

	return &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "postgres123"),
		DBName:     getEnv("DB_NAME", "dsdmpt"),
		JWTSecret:  getEnv("JWT_SECRET", "rahasia_super_aman_dsdmpt_2026_!@#"),
		Port:       getEnv("PORT", "8081"),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
