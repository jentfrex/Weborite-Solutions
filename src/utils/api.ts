export interface Lead {
  id?: number;
  name?: string;
  business_name?: string;
  website?: string;
  website_url?: string;
  vertical: string;
  status: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

export async function fetchLeads(): Promise<Lead[]> {
  try {
    const res = await fetch('http://localhost:5000/api/leads');
    if (!res.ok) return [];
    return await res.json();
  } catch {
    // Fallback mock data if server isn't running yet
    return [
      { id: 1, name: 'De Thermomeester', website: 'dethermomeester.com', vertical: 'Loodgieter', status: 'Ready', phone: '+31 20 123 4567' },
      { id: 2, name: 'RioVent CV Ketel', website: 'riovent.nl', vertical: 'Loodgieter', status: 'Needs review', phone: '+31 10 987 6543' },
      { id: 3, name: 'Loodgieterstad Rotterdam', website: 'loodgieterstad.nl', vertical: 'Loodgieter', status: 'Paused', phone: '+31 15 555 1234' }
    ];
  }
}

export async function createLead(lead: Lead) {
  try {
    const res = await fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    return await res.json();
  } catch (error) {
    console.error('Error creating lead:', error);
    return { success: false };
  }
}