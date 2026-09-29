import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'weborite_data.json');

// Initialize JSON database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  const initialData = [
    { id: 1, name: 'Amsterdam Loodgieter Service', business_name: 'Amsterdam Loodgieter Service', website: 'amsterdamloodgieter.nl', website_url: 'amsterdamloodgieter.nl', vertical: 'HVAC & Plumbing', status: 'Ready', phone: '+31 20 555 0192', email: 'info@amsterdamloodgieter.nl', created_at: new Date().toISOString() },
    { id: 2, name: 'QuickFix Heating & HVAC', business_name: 'QuickFix Heating & HVAC', website: 'quickfixhvac.nl', website_url: 'quickfixhvac.nl', vertical: 'HVAC & Plumbing', status: 'Ready', phone: '+31 20 555 4321', email: 'support@quickfixhvac.nl', created_at: new Date().toISOString() },
    { id: 3, name: 'De Thermomeester', business_name: 'De Thermomeester', website: 'dethermomeester.nl', website_url: 'dethermomeester.nl', vertical: 'HVAC & Plumbing', status: 'Ready', phone: '+31 20 555 9876', email: 'contact@dethermomeester.nl', created_at: new Date().toISOString() }
  ];
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

export function getLeads() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export function saveLead(lead: any) {
  const leads = getLeads();
  const newId = Date.now();
  const newLead = {
    id: newId,
    name: lead.name || lead.business_name || '',
    business_name: lead.business_name || lead.name || '',
    website: lead.website || lead.website_url || '',
    website_url: lead.website_url || lead.website || '',
    vertical: lead.vertical || 'HVAC & Plumbing',
    status: lead.status || 'Ready',
    phone: lead.phone || '',
    email: lead.email || '',
    created_at: new Date().toISOString()
  };
  leads.push(newLead);
  fs.writeFileSync(DB_FILE, JSON.stringify(leads, null, 2));
  
  return {
    lastInsertRowid: newId,
    ...newLead
  };
}

export default {
  prepare: (query: string) => {
    return {
      all: () => getLeads(),
      run: (...params: any[]) => {
        let leadData: any = {};
        if (typeof params[0] === 'object' && params[0] !== null) {
          leadData = params[0];
        } else {
          leadData = {
            name: params[0],
            business_name: params[0],
            website: params[1],
            website_url: params[1],
            vertical: params[2],
            status: params[3] || 'Ready',
            phone: params[4],
            email: params[5]
          };
        }
        return saveLead(leadData);
      }
    };
  },
  exec: () => {}
};