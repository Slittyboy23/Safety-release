const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public — submit a form
router.post('/', (req, res) => {
  const { participants, property_name, parent_name, address, phone, signature, date_signed } = req.body;

  if (!parent_name || !signature || !participants) {
    return res.status(400).json({ error: 'Name, participants, and signature are required' });
  }

  const result = db.prepare(`
    INSERT INTO submissions (participants, property_name, parent_name, address, phone, signature, date_signed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    typeof participants === 'string' ? participants : JSON.stringify(participants),
    property_name || null,
    parent_name,
    address || null,
    phone || null,
    signature,
    date_signed
  );

  res.json({ success: true, id: result.lastInsertRowid });
});

// Admin — list all submissions
router.get('/', authMiddleware, (req, res) => {
  const { search, page = 1 } = req.query;
  const limit = 25;
  const offset = (page - 1) * limit;

  let where = '';
  let params = [];
  if (search) {
    where = 'WHERE parent_name LIKE ? OR phone LIKE ? OR property_name LIKE ?';
    const term = `%${search}%`;
    params = [term, term, term];
  }

  const total = db.prepare(`SELECT COUNT(*) as count FROM submissions ${where}`).get(...params).count;
  const rows = db.prepare(`SELECT * FROM submissions ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);

  res.json({ submissions: rows, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// Admin — single submission
router.get('/:id', authMiddleware, (req, res) => {
  const row = db.prepare('SELECT * FROM submissions WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// Admin — delete submission
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM submissions WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
