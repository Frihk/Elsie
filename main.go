package main

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type smtpConfig struct {
	Host string
	Port int
	User string
	Pass string
	From string
	To   []string
}

func main() {
	cfg, err := loadSMTPConfig()
	if err != nil {
		log.Fatalf("smtp config error: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/contact", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			http.ServeFile(w, r, "Enquire.html")
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		if err := r.ParseForm(); err != nil {
			http.Error(w, "invalid form", http.StatusBadRequest)
			return
		}

		email := strings.TrimSpace(r.FormValue("email"))
		supportType := strings.TrimSpace(r.FormValue("type"))
		message := strings.TrimSpace(r.FormValue("message"))

		if email == "" || supportType == "" || message == "" {
			http.Error(w, "missing required fields", http.StatusBadRequest)
			return
		}
		if _, err := mail.ParseAddress(email); err != nil {
			http.Error(w, "invalid email address", http.StatusBadRequest)
			return
		}
		if containsLink(message) {
			http.Error(w, "links are not allowed", http.StatusBadRequest)
			return
		}

		subject := fmt.Sprintf("New consultation request from %s", email)
		body := buildEmailBody(email, supportType, message)

		if err := sendEmail(cfg, subject, body, "", email); err != nil {
			log.Printf("send email failed: %v", err)
			http.Error(w, "failed to send message", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("Message sent. Thank you."))
	})

	mux.Handle("/", http.FileServer(http.Dir(".")))

	addr := ":8080"
	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}

func loadSMTPConfig() (smtpConfig, error) {
	host := strings.TrimSpace(os.Getenv("SMTP_HOST"))
	portStr := strings.TrimSpace(os.Getenv("SMTP_PORT"))
	user := strings.TrimSpace(os.Getenv("SMTP_USER"))
	pass := strings.TrimSpace(os.Getenv("SMTP_PASS"))
	from := strings.TrimSpace(os.Getenv("SMTP_FROM"))
	toRaw := strings.TrimSpace(os.Getenv("SMTP_TO"))

	if host == "" || portStr == "" {
		return smtpConfig{}, fmt.Errorf("SMTP_HOST and SMTP_PORT are required")
	}

	port, err := strconv.Atoi(portStr)
	if err != nil {
		return smtpConfig{}, fmt.Errorf("invalid SMTP_PORT: %w", err)
	}

	if from == "" {
		from = user
	}
	if from == "" {
		return smtpConfig{}, fmt.Errorf("SMTP_FROM or SMTP_USER is required")
	}

	if toRaw == "" {
		toRaw = from
	}
	toList := splitEmails(toRaw)
	if len(toList) == 0 {
		return smtpConfig{}, fmt.Errorf("SMTP_TO is required")
	}

	return smtpConfig{
		Host: host,
		Port: port,
		User: user,
		Pass: pass,
		From: from,
		To:   toList,
	}, nil
}

func splitEmails(raw string) []string {
	parts := strings.Split(raw, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		v := strings.TrimSpace(p)
		if v != "" {
			out = append(out, v)
		}
	}
	return out
}

func buildEmailBody(email, supportType, message string) string {
	return fmt.Sprintf(
		"New consultation request\n\nEmail: %s\nService: %s\n\nMessage:\n%s\n",
		email,
		supportType,
		message,
	)
}

var linkPattern = regexp.MustCompile(`(?i)\b(?:https?://|www\.)\S+`)

func containsLink(input string) bool {
	return linkPattern.MatchString(input)
}

func sendEmail(cfg smtpConfig, subject, body, senderName, senderEmail string) error {
	addr := fmt.Sprintf("%s:%d", cfg.Host, cfg.Port)

	client, err := smtp.Dial(addr)
	if err != nil {
		return err
	}
	defer client.Close()

	if ok, _ := client.Extension("STARTTLS"); ok {
		tlsConfig := &tls.Config{ServerName: cfg.Host}
		if err := client.StartTLS(tlsConfig); err != nil {
			return err
		}
	}

	if cfg.User != "" && cfg.Pass != "" {
		if ok, _ := client.Extension("AUTH"); ok {
			auth := smtp.PlainAuth("", cfg.User, cfg.Pass, cfg.Host)
			if err := client.Auth(auth); err != nil {
				return err
			}
		}
	}

	if err := client.Mail(cfg.From); err != nil {
		return err
	}
	for _, to := range cfg.To {
		if err := client.Rcpt(to); err != nil {
			return err
		}
	}

	w, err := client.Data()
	if err != nil {
		return err
	}
	defer w.Close()

	headers := []string{
		fmt.Sprintf("From: %s", formatFromHeader(senderName, senderEmail)),
		fmt.Sprintf("To: %s", strings.Join(cfg.To, ", ")),
		fmt.Sprintf("Subject: %s", subject),
		fmt.Sprintf("Reply-To: %s", senderEmail),
		"MIME-Version: 1.0",
		"Content-Type: text/plain; charset=utf-8",
	}
	msg := strings.Join(headers, "\r\n") + "\r\n\r\n" + body

	_, err = w.Write([]byte(msg))
	return err
}

func formatFromHeader(senderName, senderEmail string) string {
	if senderName == "" {
		return senderEmail
	}
	return mail.Address{Name: senderName, Address: senderEmail}.String()
}
