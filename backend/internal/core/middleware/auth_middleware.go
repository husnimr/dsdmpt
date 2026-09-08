package middleware

import (
	"strings"

	"dsdmpt-backend/pkg/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.ErrorResponse(c, 401, "Authorization header required")
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			utils.ErrorResponse(c, 401, "Invalid authorization format")
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims, err := utils.ValidateJWT(tokenString, secret)
		if err != nil {
			utils.ErrorResponse(c, 401, "Invalid or expired token")
			c.Abort()
			return
		}

		// Validasi Hak Akses: Superadmin, Role DSDMPT Admin, atau Modul "dsdmpt"
		hasAccess := false
		if claims.Role == "superadmin" || claims.DsdmptRole == "admin" {
			hasAccess = true
		} else {
			for _, m := range claims.Modules {
				if m == "dsdmpt" {
					hasAccess = true
					break
				}
			}
		}

		if !hasAccess {
			utils.ErrorResponse(c, 403, "Anda tidak memiliki hak akses ke sistem DSDMPT")
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("email", claims.Email)
		c.Set("full_name", claims.FullName)
		c.Set("role", claims.Role)
		c.Set("dsdmpt_role", claims.DsdmptRole)
		c.Set("modules", claims.Modules)

		c.Next()
	}
}
