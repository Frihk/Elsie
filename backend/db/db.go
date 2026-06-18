package db

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

type DB struct {
	conn *sql.DB
}

type Block struct {
	ID         int64  `json:"id"`
	Page       string `json:"page"`
	BlockType  string `json:"block_type"`
	OrderIndex int    `json:"order_index"`
	Data       string `json:"data"`
	UpdatedAt  string `json:"updated_at"`
}

func Init(path string) (*DB, error) {
	if dir := filepath.Dir(path); dir != "." {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return nil, fmt.Errorf("create database directory: %w", err)
		}
	}

	conn, err := sql.Open("sqlite3", path)
	if err != nil {
		return nil, fmt.Errorf("open sqlite: %w", err)
	}

	store := &DB{conn: conn}
	if err := store.migrate(); err != nil {
		conn.Close()
		return nil, err
	}
	if err := store.seed(); err != nil {
		conn.Close()
		return nil, err
	}

	return store, nil
}

func (db *DB) Close() error {
	return db.conn.Close()
}

func (db *DB) Settings() (map[string]string, error) {
	rows, err := db.conn.Query(`SELECT key, value FROM settings ORDER BY key`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	settings := map[string]string{}
	for rows.Next() {
		var key, value string
		if err := rows.Scan(&key, &value); err != nil {
			return nil, err
		}
		settings[key] = value
	}
	return settings, rows.Err()
}

func (db *DB) UpsertSetting(key, value string) error {
	_, err := db.conn.Exec(
		`INSERT INTO settings (key, value) VALUES (?, ?)
		 ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
		key,
		value,
	)
	return err
}

func (db *DB) Content(page string) (map[string]string, error) {
	rows, err := db.conn.Query(`SELECT field_key, value FROM content WHERE page = ? ORDER BY id`, page)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	content := map[string]string{}
	for rows.Next() {
		var key, value string
		if err := rows.Scan(&key, &value); err != nil {
			return nil, err
		}
		content[key] = value
	}
	return content, rows.Err()
}

func (db *DB) UpsertContent(page, key, value string) error {
	_, err := db.conn.Exec(
		`INSERT INTO content (page, field_key, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
		 ON CONFLICT(page, field_key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
		page,
		key,
		value,
	)
	return err
}

func (db *DB) Blocks(page, blockType string) ([]Block, error) {
	rows, err := db.conn.Query(
		`SELECT id, page, block_type, order_index, data, updated_at
		 FROM repeatable_blocks
		 WHERE page = ? AND block_type = ?
		 ORDER BY order_index, id`,
		page,
		blockType,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	blocks := []Block{}
	for rows.Next() {
		var block Block
		if err := rows.Scan(&block.ID, &block.Page, &block.BlockType, &block.OrderIndex, &block.Data, &block.UpdatedAt); err != nil {
			return nil, err
		}
		blocks = append(blocks, block)
	}
	return blocks, rows.Err()
}

func (db *DB) UpsertBlock(id int64, page, blockType string, orderIndex int, data string) (int64, error) {
	if id > 0 {
		_, err := db.conn.Exec(
			`UPDATE repeatable_blocks
			 SET page = ?, block_type = ?, order_index = ?, data = ?, updated_at = CURRENT_TIMESTAMP
			 WHERE id = ?`,
			page,
			blockType,
			orderIndex,
			data,
			id,
		)
		return id, err
	}

	result, err := db.conn.Exec(
		`INSERT INTO repeatable_blocks (page, block_type, order_index, data, updated_at)
		 VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
		page,
		blockType,
		orderIndex,
		data,
	)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func (db *DB) DeleteBlock(id int64) error {
	_, err := db.conn.Exec(`DELETE FROM repeatable_blocks WHERE id = ?`, id)
	return err
}

func (db *DB) migrate() error {
	migrations := []string{
		`CREATE TABLE IF NOT EXISTS content (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			page TEXT NOT NULL,
			field_key TEXT NOT NULL,
			value TEXT NOT NULL,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(page, field_key)
		);`,
		`CREATE TABLE IF NOT EXISTS settings (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS repeatable_blocks (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			page TEXT NOT NULL,
			block_type TEXT NOT NULL,
			order_index INTEGER DEFAULT 0,
			data TEXT NOT NULL,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);`,
	}

	for _, migration := range migrations {
		if _, err := db.conn.Exec(migration); err != nil {
			return fmt.Errorf("run migration: %w", err)
		}
	}

	return nil
}

func (db *DB) seed() error {
	var count int
	if err := db.conn.QueryRow(`SELECT COUNT(*) FROM settings`).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	for key, value := range defaultSettings {
		if err := db.UpsertSetting(key, value); err != nil {
			return err
		}
	}
	for page, fields := range defaultContent {
		for key, value := range fields {
			if err := db.UpsertContent(page, key, value); err != nil {
				return err
			}
		}
	}
	for _, block := range defaultBlocks {
		data, err := json.Marshal(block.Data)
		if err != nil {
			return err
		}
		if _, err := db.UpsertBlock(0, block.Page, block.BlockType, block.OrderIndex, string(data)); err != nil {
			return err
		}
	}

	return nil
}

func jsonString(value any) string {
	data, _ := json.Marshal(value)
	return string(data)
}

var defaultSettings = map[string]string{
	"color_bg":      "#F5EDE8",
	"color_primary": "#4A0E0E",
	"color_accent":  "#6B1A1A",
	"font_heading":  "Cormorant Garamond",
	"font_body":     "Cormorant Garamond",
	"nav_home":      "HOME",
	"nav_projects":  "PROJECTS",
	"nav_services":  "SERVICES",
	"nav_about":     "ABOUT",
	"nav_contact":   "CONTACT",
}

var defaultContent = map[string]map[string]string{
	"home": {
		"brand_name":     "EIRA",
		"brand_subtitle": "EXECUTIVE OPERATIONS",
		"hero_tagline":   "EIRA EXECUTIVE OPERATION",
		"hero_headline":  "Reliable and Strategic Partner to HNW Founders & C-Suite/executives",
		"hero_body":      "We work with founders and executives managing complexity across entities, borders, and time zones - those who've outgrown traditional assistance and need someone who makes decisions, not just takes them.",
		"hero_cta_label": "Book a Discovery Call",
		"hero_cta_link":  "#contact",
		"hero_image":     "/portrait.jpg",
	},
	"projects": {
		"projects_headline":      "RESULTS DELIVERED TO CLIENT",
		"projects_cta_label":     "Explore Results",
		"projects_bullets":       jsonString([]string{"From Executive Operations Management", "Multi-Entity Calendar Coordination", "Global Travel & Logistics", "Executive Communication Management", "Cross-Border Operations", "Board & Investor Relations", "Strategic Project Management", "Executive Operations Consulting"}),
		"projects_image":         "/projects_portrait.jpg",
		"testimonials_heading":   "Testimonials from clients",
		"testimonials_subtext_1": "Built on trust.",
		"testimonials_subtext_2": "Measured in outcomes.",
	},
	"services": {
		"services_label":        "CORE SERVICES",
		"services_headline":     "Executive Support Designed for Productivity",
		"services_body":         "Reliable, discreet, and proactive support that keeps executive operations clear, organized, and moving without delays.",
		"how_we_work_heading":   "How we work",
		"core_services_heading": "Core services",
	},
	"about": {
		"about_label":         "ABOUT",
		"about_image":         "/about_portrait.jpg",
		"about_photo_caption": "CEO AND FOUNDER OF EIRA EXECUTIVE OPERATION",
		"about_bio":           "Eira Executive Operations is a boutique executive operations firm founded by Elsie Njoroge for leaders who need discretion, structure, and strategic follow-through. The firm partners with founders, executives, and high-net-worth operators whose work moves across companies, borders, calendars, and confidential priorities.",
		"efficiency_heading":  "Efficiency with discretion.",
		"efficiency_body":     "Our work combines structure, communication, and precision so every operational detail has a clear owner, a trusted process, and a calm path forward.",
		"why_choose_heading":  "Why Choose Eira",
	},
	"contact": {
		"contact_card_heading": "Contact",
		"contact_email":        "founder@eiraexecutiveops.com",
		"contact_location":     "San Francisco Bay Area / Remote",
		"contact_email_me_url": "mailto:founder@eiraexecutiveops.com",
		"contact_linkedin_url": "#",
		"field_label_name":     "FULL NAME",
		"field_label_email":    "EMAIL",
		"field_label_support":  "SUPPORT NEEDED",
		"field_label_message":  "MESSAGE",
		"submit_label":         "Send Message",
		"footer_text":          "© 2026 Eira Executive Operations",
		"support_options":      jsonString([]string{"Executive Operations", "Calendar Management", "Travel & Logistics", "Communication Management", "Cross-Border Operations", "Board & Investor Relations", "Other"}),
	},
}

var defaultBlocks = []struct {
	Page       string
	BlockType  string
	OrderIndex int
	Data       map[string]string
}{
	{"projects", "testimonial", 0, map[string]string{"title": "Testimonial 1 - Tech Founder & CEO", "quote": "Before Eira, I was carrying too many operational decisions myself. The shift was immediate: cleaner priorities, faster communication, and a partner who could anticipate the next decision before it landed on my desk.", "attribution": "- Co-Founder & CEO, Technology Company, San Francisco, CA"}},
	{"projects", "testimonial", 1, map[string]string{"title": "Testimonial 2 - Finance & Investment Executive", "quote": "I manage portfolios, board conversations, and constant travel. Eira brought a level of structure and discretion that made my weeks feel controlled again without adding more meetings.", "attribution": "- Managing Director, Private Equity Firm, New York, NY"}},
	{"projects", "testimonial", 2, map[string]string{"title": "Testimonial 3 - HNW Entrepreneur & Investor", "quote": "I've worked with executive assistants before, but this is different. Eira understands the commercial context behind the task and protects my time like a strategic asset.", "attribution": "- Serial Entrepreneur & Angel Investor, Miami, FL"}},
	{"services", "step", 0, map[string]string{"title": "Audit the operating rhythm", "description": "We begin by understanding calendars, communication flows, travel patterns, decision bottlenecks, and the standards required around confidentiality."}},
	{"services", "step", 1, map[string]string{"title": "Build the executive system", "description": "We create practical structures for priorities, inboxes, scheduling, follow-up, documents, and recurring operational decisions."}},
	{"services", "step", 2, map[string]string{"title": "Run the details proactively", "description": "We manage the moving parts, flag risks early, and keep people aligned across teams, entities, vendors, and time zones."}},
	{"services", "step", 3, map[string]string{"title": "Refine for scale", "description": "We continuously tighten workflows so support remains calm, discreet, and effective as complexity grows."}},
	{"services", "service", 0, map[string]string{"number": "01", "name": "Executive Operations Management", "description": "A trusted operating partner for priorities, follow-through, decision preparation, and daily executive rhythm."}},
	{"services", "service", 1, map[string]string{"number": "02", "name": "Multi-Entity Calendar Coordination", "description": "Sophisticated scheduling across companies, households, advisors, boards, investors, and global time zones."}},
	{"services", "service", 2, map[string]string{"number": "03", "name": "Global Travel & Logistics", "description": "High-touch itinerary planning, vendor coordination, contingencies, and private movement details."}},
	{"services", "service", 3, map[string]string{"number": "04", "name": "Executive Communication Management", "description": "Inbox triage, response drafting, stakeholder follow-up, briefing notes, and communication hygiene."}},
	{"services", "service", 4, map[string]string{"number": "05", "name": "Cross-Border Operations", "description": "Operational coordination across jurisdictions, advisors, entities, documents, and location-specific requirements."}},
	{"services", "service", 5, map[string]string{"number": "06", "name": "Board & Investor Relations", "description": "Preparation and coordination for board meetings, investor updates, stakeholder materials, and sensitive follow-up."}},
	{"services", "service", 6, map[string]string{"number": "07", "name": "Strategic Project Management", "description": "Driving special projects from idea to completion with clear owners, timelines, updates, and decisions."}},
	{"services", "service", 7, map[string]string{"number": "08", "name": "Executive Operations Consulting", "description": "Advisory support to design executive workflows, hiring profiles, systems, and operating standards."}},
	{"about", "why_choose", 0, map[string]string{"title": "Strategic judgment", "description": "Eira understands the reason behind the request, not just the task itself, so support is decisive and context-aware."}},
	{"about", "why_choose", 1, map[string]string{"title": "Discretion by design", "description": "Every workflow is built around privacy, trust, and careful handling of sensitive personal and business information."}},
	{"about", "why_choose", 2, map[string]string{"title": "Calm execution", "description": "Complexity is translated into ordered next steps, clear communication, and reliable completion without unnecessary noise."}},
	{"about", "why_choose", 3, map[string]string{"title": "Global operating fluency", "description": "Support adapts to shifting locations, teams, time zones, entities, and high-stakes executive priorities."}},
}
