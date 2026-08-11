package main

import "time"

type News struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	ImageURL    string    `json:"image_url"`
	PublishedAt time.Time `json:"published_at"`
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
