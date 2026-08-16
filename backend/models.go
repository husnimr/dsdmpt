package main

import "time"

type News struct {
	ID           int       `json:"id"`
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	ImageURL     string    `json:"image_url"`
	PublishedAt  time.Time `json:"published_at"`
	Author       string    `json:"author"`
	Slug         string    `json:"slug"`
	Status       string    `json:"status"` // 'published' atau 'draft'
	Images       string    `json:"images"` // JSON array string of images
	ThumbnailIdx int       `json:"thumbnail_idx"`
}

type Subdirectorate struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Icon        string `json:"icon"`
	Description string `json:"description"`
}

type Setting struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"-"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

type ProgramKerja struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	IconName    string `json:"icon_name"`
}

