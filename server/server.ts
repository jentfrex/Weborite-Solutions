import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import db from './db.ts';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Pag-set up sa Nodemailer gamit ang imong Gmail account ug App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aos2naksum416@gmail.com',
    pass: 'oolz alcv kisp twfv'
  }
});

// Get all leads
app.get('/api/leads', (req, res) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Add a lead
app.post('/api/leads', (req, res) => {
  try {
    const { name, website, vertical, phone, email } = req.body;
    const stmt = db.prepare(`
      INSERT INTO leads (name, website, vertical, phone, email) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, website, vertical, phone, email);
    res.json({ id: info.lastInsertRowid, success: true, name, website, vertical, phone, email, status: 'Ready' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Email Sending gamit ang Nodemailer ug Live Vercel Production Preview URL
app.post('/api/send-email', async (req, res) => {
  try {
    const { clientEmail, clientName, vertical, mockupUrl } = req.body;

    const encodedName = encodeURIComponent(clientName || 'Valued Client');
    const encodedBusiness = encodeURIComponent(vertical || 'Business');
    
    // Gigamit na nato ang imong tinuod ug buhi nga live Vercel domain aron walay error sa kliyente
    const finalMockupUrl = mockupUrl || `https://weborite-solutions.vercel.app/preview?name=${encodedName}&business=${encodedBusiness}`;

    const mailOptions = {
      from: '"Weborite Solutions" <aos2naksum416@gmail.com>',
      to: clientEmail || 'aos2naksum416@gmail.com',
      subject: `Eksklusibong Website Mockup para sa ${clientName || 'imong negosyo'}`,
      html: `
        <div style="background-color: #f1f5f9; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <!-- Header with Gradient & Glow Effect -->
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 35px 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; color: #ffffff;">Weborite Solutions</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #38bdf8; font-weight: 500;">High-Performance Digital Agency Platform</p>
            </div>

            <!-- Body Content -->
            <div style="padding: 40px 30px; color: #334155; line-height: 1.7;">
              <h2 style="margin-top: 0; font-size: 22px; color: #0f172a; font-weight: 600;">Kumusta ${clientName || 'Tag-iya'}!</h2>
              <p style="margin-bottom: 20px; font-size: 15px; color: #475569;">Namatikdan namo ang imong negosyo sa industriya nga <strong style="color: #0f172a;">${vertical || 'General'}</strong> ug naghimo kami og usa ka <strong style="color: #0f172a;">moderno, paspas, ug high-converting nga website mockup</strong> nga espesyal nga gidisenyo para sa pagpalambo sa imong online presence.</p>
              
              <!-- Call to Action Box with Elegant Styling -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <p style="margin: 0 0 15px 0; font-weight: 600; color: #0f172a; font-size: 16px;">Andam na ang Imong Live Preview:</p>
                <a href="${finalMockupUrl}" target="_blank" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 15px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);">Ablihi ang Imong Web Mockup</a>
              </div>

              <p style="margin-bottom: 20px; font-size: 15px; color: #475569;">Kung ganahan ka sa disenyo ug gusto nimo kining i-deploy sa imong kaugalingong domain aron magsugod na og dawat sa mga kliyente, i-reply lang kini nga email o kontaka kami diretso.</p>
              
              <p style="margin-bottom: 0; color: #64748b; font-size: 14px;">Labing pagtahod,<br><strong style="color: #0f172a; font-size: 15px;">Ang Team sa Weborite Solutions</strong></p>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0;">© 2026 Weborite Solutions. Tanang katungod gigahin.</p>
            </div>

          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, info });
  } catch (error) {
    console.error('Error sending email with Nodemailer:', error);
    res.status(500).json({ success: false, error: 'Failed to send email via Gmail' });
  }
});

// API Endpoint para sa Lead Scraper
app.post('/api/scrape-leads', async (req, res) => {
  try {
    const { niche, location } = req.body;
    
    const newScrapedLead = {
      name: `${location || 'Local'} ${niche || 'Business'} Pros`,
      website: `www.${(niche || 'business').toLowerCase().replace(/\s+/g, '')}${(location || 'city').toLowerCase().replace(/\s+/g, '')}.com`,
      vertical: niche || 'General',
      status: 'Ready',
      phone: '+63 917 555 0192',
      email: `contact@${(niche || 'business').toLowerCase().replace(/\s+/g, '')}.com`
    };

    const stmt = db.prepare(`
      INSERT INTO leads (name, website, vertical, phone, email) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(newScrapedLead.name, newScrapedLead.website, newScrapedLead.vertical, newScrapedLead.phone, newScrapedLead.email);

    res.json({ success: true, lead: { id: info.lastInsertRowid, ...newScrapedLead } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Scraper failed to fetch results' });
  }
});

app.listen(PORT, () => {
  console.log(`Weborite backend running on port ${PORT}`);
});