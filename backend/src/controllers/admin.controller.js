import fs from 'fs/promises';
import path from 'path';

const contentPath = path.resolve(process.cwd(), 'backend', 'data', 'content.json');

export function getAdminSummary(_req, res) {
  res.json({
    data: {
      projects: 3,
      services: 6,
      messages: 0,
    },
  });
}

export async function getContent(_req, res, next) {
  try {
    const raw = await fs.readFile(contentPath, 'utf-8');
    const content = JSON.parse(raw);
    res.json({ data: content });
  } catch (err) {
    next(err);
  }
}

export async function updateContent(req, res, next) {
  try {
    const newContent = req.body;
    await fs.writeFile(contentPath, JSON.stringify(newContent, null, 2), 'utf-8');
    res.json({ data: newContent });
  } catch (err) {
    next(err);
  }
}
