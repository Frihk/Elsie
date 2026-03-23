const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const REQUIRED_ENV = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
    console.warn(`Missing required env vars: ${missingEnv.join(', ')}`);
}

const SUPPORT_OPTIONS = new Set([
    'Executive Support',
    'Calendar Management',
    'Travel & Event Coordination',
    'Project Support'
]);

const LIMITS = {
    fullName: 80,
    email: 120,
    support: 80,
    message: 2000
};

app.use(express.json({ limit: '25kb' }));
app.use(express.urlencoded({ extended: false, limit: '25kb' }));
app.use(express.static(path.join(__dirname, '..')));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' }
});

app.use('/api/contact', limiter);

function sanitizeField(value, { preserveNewlines = false } = {}) {
    if (typeof value !== 'string') {
        return '';
    }
    const cleaned = sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
    if (preserveNewlines) {
        return cleaned.replace(/\r\n/g, '\n').trim();
    }
    return cleaned.replace(/\s+/g, ' ').trim();
}

function detectUrls(text) {
    if (!text) return [];
    const matches = text.match(/(https?:\/\/|www\.)[^\s]+/gi);
    return matches || [];
}

function defangUrls(text) {
    if (!text) return text;
    return text
        .replace(/https:\/\//gi, 'hxxps://')
        .replace(/http:\/\//gi, 'hxxp://')
        .replace(/www\./gi, 'www[.]');
}

function exceedsLimit(value, limit) {
    return value.length > limit;
}

app.post('/api/contact', async (req, res) => {
    if (missingEnv.length > 0) {
        return res.status(503).json({ message: 'Email service is not configured.' });
    }

    const rawName = req.body?.fullName ?? '';
    const rawEmail = req.body?.email ?? '';
    const rawSupport = req.body?.support ?? '';
    const rawMessage = req.body?.message ?? '';

    const fullName = sanitizeField(rawName);
    const email = sanitizeField(rawEmail);
    const support = sanitizeField(rawSupport);
    const message = sanitizeField(rawMessage, { preserveNewlines: true });

    if (!fullName || !email || !support || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (exceedsLimit(fullName, LIMITS.fullName) || exceedsLimit(email, LIMITS.email) || exceedsLimit(support, LIMITS.support) || exceedsLimit(message, LIMITS.message)) {
        return res.status(400).json({ message: 'Input exceeds allowed length.' });
    }

    if (!validator.isEmail(email, { allow_utf8_local_part: false })) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (!SUPPORT_OPTIONS.has(support)) {
        return res.status(400).json({ message: 'Please select a valid support option.' });
    }

    const urlMatches = detectUrls(message);
    const defangedMessage = defangUrls(message);
    const defangedUrls = urlMatches.map((url) => defangUrls(url));

    if (rawMessage !== message || urlMatches.length > 0) {
        console.warn('Suspicious input detected', {
            hasHtmlStripped: rawMessage !== message,
            urlCount: urlMatches.length
        });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailText = [
        'New contact form submission',
        '',
        `Full Name: ${fullName}`,
        `User Email: ${email}`,
        `Selected Support Option: ${support}`,
        '',
        'Message:',
        defangedMessage,
        '',
        `Suspicious URLs detected: ${urlMatches.length > 0 ? 'YES' : 'NO'}`,
        urlMatches.length > 0 ? `URLs (defanged):\n${defangedUrls.join('\n')}` : ''
    ].filter(Boolean).join('\n');

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.CONTACT_TO || 'founder@eiraexecutiveops.com',
            replyTo: email,
            subject: `New Contact Form Message - ${support}`,
            text: mailText
        });

        return res.status(200).json({ message: 'Thanks! Your message has been sent.' });
    } catch (error) {
        console.error('Email send failed:', error.message);
        return res.status(500).json({ message: 'Unable to send your message right now.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
