package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID       int      `json:"user_id,omitempty"`
	Username     string   `json:"username"`
	Email        string   `json:"email,omitempty"`
	FullName     string   `json:"full_name,omitempty"`
	KodeFakultas string   `json:"kode_fakultas,omitempty"`
	Role         string   `json:"role"`
	BkdRole      string   `json:"bkd_role,omitempty"`
	ExecRole     string   `json:"executive_role,omitempty"`
	DsdmptRole   string   `json:"dsdmpt_role,omitempty"`
	Modules      []string `json:"modules,omitempty"`
	jwt.RegisteredClaims
}

func GenerateJWT(userID int, username, role, secret string) (string, error) {
	claims := Claims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func ValidateJWT(tokenString, secret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}
