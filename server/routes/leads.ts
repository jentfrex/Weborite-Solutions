import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// Get all leads
router.get('/', (req: Request, res: Response) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Add a new lead
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, business_name, website, website_url, vertical, phone, email } = req.body;
    const finalBusinessName = business_name || name;
    const finalWebsiteUrl = website_url || website;

    if (!finalBusinessName || !finalWebsiteUrl || !vertical) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Gitul-id nato dinhi ang db.prepare nga may sulod na nga saktong INSERT query
    const info = db.prepare(`
      INSERT INTO leads (name, business_name, website, website_url, vertical, status, phone, email) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      finalBusinessName,
      finalBusinessName,
      finalWebsiteUrl,
      finalWebsiteUrl,
      vertical,
      'Ready',
      phone || '',
      email || ''
    );

    res.json({ 
      success: true,
      id: info.lastInsertRowid, 
      business_name: finalBusinessName, 
      name: finalBusinessName,
      website_url: finalWebsiteUrl, 
      website: finalWebsiteUrl,
      vertical, 
      status: 'Ready',
      phone: phone || '',
      email: email || ''
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

export default router;