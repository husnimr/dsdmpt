package utils

import "github.com/gin-gonic/gin"

// Response format standar balikannya API kita bro
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// SuccessResponse buat kirim respon sukses
func SuccessResponse(c *gin.Context, code int, message string, data interface{}) {
	c.JSON(code, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// ErrorResponse buat kirim respon error, tanpa data ya
func ErrorResponse(c *gin.Context, code int, message string) {
	c.JSON(code, Response{
		Success: false,
		Message: message,
	})
}
