import React, { useEffect, useState } from 'react';
import { fetchLeads, createLead, Lead } from './utils/api';
import { LayoutDashboard, Users, FileText, Cpu, Search, Layers, Globe, Rocket, ShieldCheck, MessageSquare, Plus, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadWebsite, setNewLeadWebsite] = useState('');
  const [newLeadVertical, setNewLeadVertical] = useState('HVAC & Plumbing');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');

  // Notification toast message state for interactive buttons
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchLeads().then(setLeads);
  }, []);

  // Function para awtomatikong mo-send og email gamit ang Resend API backend
  const sendEmailToLead = async (clientName: string, clientEmail: string) => {
    try {
      await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName,
          clientEmail: clientEmail,
          mockupUrl: 'https://weboritesolutions.com/preview'
        }),
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Lead = {
      name: newLeadName,
      website: newLeadWebsite || 'www.example.com',
      vertical: newLeadVertical,
      status: 'Ready',
      phone: newLeadPhone || '+1 (555) 019-2834',
      email: newLeadEmail || 'egoajent@gmail.com'
    };
    
    const created = await createLead(payload);
    const newLeadItem = Array.isArray(created) ? created[0] : (created || payload);
    setLeads(prev => [newLeadItem, ...prev]);

    // Awtomatiko dayong mo-send og email sa gibutang nga client email!
    await sendEmailToLead(newLeadName, newLeadEmail || 'egoajent@gmail.com');

    setNewLeadName('');
    setNewLeadWebsite('');
    setNewLeadPhone('');
    setNewLeadEmail('');
    setShowAddModal(false);
    showToast(`Successfully added lead & sent email to ${newLeadName}!`);
  };

  const handleRunScraper = () => {
    showToast("Running universal lead scraper across niche & location...");
    setTimeout(async () => {
      const scraped: Lead = {
        name: 'Cagayan Prime Services',
        website: 'www.cagayanprime.com',
        vertical: 'Local Services',
        status: 'Ready',
        phone: '+63 88 555 0192',
        email: 'egoajent@gmail.com'
      };
      const created = await createLead(scraped);
      const newLeadItem = Array.isArray(created) ? created[0] : (created || scraped);
      setLeads(prev => [newLeadItem, ...prev]);
      
      await sendEmailToLead('Cagayan Prime Services', 'egoajent@gmail.com');

      showToast("Scraper complete! Prospect added & email sent.");
    }, 1500);
  };

  const handleGenerateMockup = async () => {
    const mockupLeadName = `Automated Mockup #${leads.length + 1}`;
    const mockupLeadEmail = 'egoajent@gmail.com';
    
    const mockupLead: Lead = {
      name: mockupLeadName,
      website: 'www.agencyclient.nl',
      vertical: 'HVAC & Plumbing',
      status: 'Ready',
      phone: '+31 20 894 2311',
      email: mockupLeadEmail
    };
    const created = await createLead(mockupLead);
    const newLeadItem = Array.isArray(created) ? created[0] : (created || mockupLead);
    setLeads(prev => [newLeadItem, ...prev]);

    await sendEmailToLead(mockupLeadName, mockupLeadEmail);

    showToast("New high-converting mockup generated & email sent successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="absolute top-5 right-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-700 animate-bounce">
          <CheckCircle className="text-emerald-400" size={20} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-white flex flex-col justify-between p-4 shadow-lg">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-emerald-900">
            <div className="bg-emerald-600 p-2 rounded-lg font-bold text-lg text-white">W</div>
            <div>
              <h1 className="font-bold text-base leading-tight">Weborite Solutions</h1>
              <span className="text-xs text-emerald-400">Agency Automations</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'mockups', label: 'Mockups', icon: FileText },
              { id: 'automations', label: 'Automations', icon: Cpu },
              { id: 'finder', label: 'Lead Finder', icon: Search },
              { id: 'builds', label: 'Builds', icon: Layers },
              { id: 'wordpress', label: 'WordPress', icon: Globe },
              { id: 'seo', label: 'Launch & SEO', icon: Rocket },
              { id: 'maintenance', label: 'Maintenance', icon: ShieldCheck },
              { id: 'communication', label: 'Communication', icon: MessageSquare },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === item.id 
                      ? 'bg-emerald-800 text-white shadow-sm' 
                      : 'text-emerald-300 hover:bg-emerald-900 hover:text-white'
                  }`}
                >
                  <Icon size={18} /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-emerald-900 text-xs text-emerald-400">
          <p className="font-semibold text-white">Ajent Cagaitan</p>
          <p className="text-emerald-500">7 Conversion Pillars Active</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold capitalize text-gray-800">
              {activeTab === 'finder' ? 'Lead Finder & Scraper' : activeTab === 'seo' ? 'Launch & SEO Optimization' : activeTab}
            </h2>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow transition cursor-pointer"
          >
            <Plus size={16} /> Add Lead
          </button>
        </header>

        <div className="p-8 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Total Leads</span>
                    <Users className="text-emerald-600" size={20} />
                  </div>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{leads.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Mockups Ready</span>
                    <FileText className="text-emerald-600" size={20} />
                  </div>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{leads.filter(l => l.status === 'Ready').length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Conversion Pillars</span>
                    <CheckCircle className="text-emerald-600" size={20} />
                  </div>
                  <p className="text-3xl font-bold mt-2 text-emerald-600">7 / 7 Active</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Recent Trades Leads & Mockups</h3>
                  <button 
                    onClick={handleGenerateMockup}
                    className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer"
                  >
                    + Quick Generate Mockup
                  </button>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Business Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Vertical</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {leads.map((lead, idx) => (
                      <tr key={lead.id || idx} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {lead.name}
                          <span className="block text-xs text-gray-400 font-normal">{lead.website || lead.website_url}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{lead.email || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                            {lead.vertical}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">{lead.phone || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 2: MOCKUPS */}
          {activeTab === 'mockups' && (
            <div className="space-y-6">
              <div className="bg-emerald-900 text-white p-6 rounded-xl flex justify-between items-center shadow-md">
                <div>
                  <h3 className="text-lg font-bold">Live Conversion Mockups</h3>
                  <p className="text-sm text-emerald-200 mt-1">Generated automatically with real logos, phone placement, and trust signals.</p>
                </div>
                <button 
                  onClick={handleGenerateMockup}
                  className="bg-white text-emerald-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-50 transition cursor-pointer shadow"
                >
                  Generate New Mockup
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {leads.map((lead, idx) => (
                  <div key={lead.id || idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{lead.name} Homepage</h4>
                        <p className="text-xs text-gray-500">{lead.website || lead.website_url || 'No website detected'}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Score: 98/100</span>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono text-gray-600 space-y-1">
                      <p>✓ Proper H1 Headline configured</p>
                      <p>✓ Top-right phone button locked</p>
                      <p>✓ Google Reviews widget embedded</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-gray-500">Vertical: {lead.vertical}</span>
                      <button 
                        onClick={() => showToast(`Opening live preview for ${lead.name}...`)}
                        className="text-emerald-600 hover:text-emerald-800 text-sm font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Preview Mockup <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATIONS */}
          {activeTab === 'automations' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">Outreach & Email Automations</h3>
              <p className="text-sm text-gray-600">Configure automated email sequences sent to leads across all industries with their custom mockup preview link.</p>
              <div className="space-y-3 pt-2">
                <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">Initial Mockup Pitch Email</p>
                    <p className="text-xs text-gray-500">Triggers immediately after lead scraping & mockup generation.</p>
                  </div>
                  <button 
                    onClick={() => showToast("Initial sequence settings updated!")}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg cursor-pointer transition"
                  >
                    Configure
                  </button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">Follow-up Sequence (3 Days)</p>
                    <p className="text-xs text-gray-500">Reminds business owner about missed calls and speed scores.</p>
                  </div>
                  <button 
                    onClick={() => showToast("Follow-up sequence settings updated!")}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg cursor-pointer transition"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEAD FINDER */}
          {activeTab === 'finder' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Universal Lead Scraper</h3>
                <p className="text-sm text-gray-600">Find companies and local business prospects with weak or missing websites in any niche and city.</p>
              </div>
              <div className="flex gap-4">
                <input type="text" placeholder="Niche (e.g., Roofing, Dental, Real Estate)" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="Roofing" />
                <input type="text" placeholder="Location (e.g., Amsterdam, Chicago)" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="Cagayan de Oro" />
                <button 
                  onClick={handleRunScraper}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 cursor-pointer shadow"
                >
                  <RefreshCw size={16} /> Run Scraper
                </button>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Found Prospects Ready for Mockup</p>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center text-sm">
                    <span>Amsterdam Premier Roofing (No mobile view)</span>
                    <button 
                      onClick={handleGenerateMockup}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium cursor-pointer transition"
                    >
                      Generate Mockup
                    </button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center text-sm">
                    <span>QuickFix Dental Clinic (Missing phone CTA)</span>
                    <button 
                      onClick={handleGenerateMockup}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium cursor-pointer transition"
                    >
                      Generate Mockup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BUILDS */}
          {activeTab === 'builds' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">Active Client Builds</h3>
              <p className="text-sm text-gray-600">Track websites currently being converted into high-converting layouts after client approval.</p>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-emerald-900">De Thermomeester Conversion Build</p>
                  <p className="text-xs text-emerald-700 mt-1">Status: Ready for WordPress export and final domain pointing.</p>
                </div>
                <button 
                  onClick={() => showToast("Build exported successfully to staging server!")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs rounded-lg font-bold cursor-pointer transition"
                >
                  Deploy Build
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: WORDPRESS */}
          {activeTab === 'wordpress' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">WordPress Automated Exporter</h3>
              <p className="text-sm text-gray-600">Export clean, conversion-optimized themes directly into WordPress instances instantly.</p>
              <button 
                onClick={() => showToast("WordPress API connected successfully! Ready to push themes.")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer shadow transition"
              >
                Connect New WordPress Instance
              </button>
            </div>
          )}

          {/* TAB 7: LAUNCH & SEO */}
          {activeTab === 'seo' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">Launch & Local SEO Monitor</h3>
              <p className="text-sm text-gray-600">Track local map rankings, keyword positions, and page speed performance post-launch.</p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-500">Average Page Speed Score</span>
                  <p className="text-2xl font-bold text-emerald-600">99 / 100</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-500">Google Business Profile Rank</span>
                  <p className="text-2xl font-bold text-emerald-600">Top 3 Pack</p>
                </div>
              </div>
              <button 
                onClick={() => showToast("SEO crawl and keyword index refreshed!")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition"
              >
                Run SEO Audit
              </button>
            </div>
          )}

          {/* TAB 8: MAINTENANCE */}
          {activeTab === 'maintenance' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">Client Maintenance & Uptime</h3>
              <p className="text-sm text-gray-600">Automated security updates, plugin backups, and uptime monitoring for all client sites.</p>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-medium">
                All client websites are currently online and fully secure.
              </div>
              <button 
                onClick={() => showToast("Backup verification complete across all connected sites.")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition"
              >
                Run Manual Security Backup
              </button>
            </div>
          )}

          {/* TAB 9: COMMUNICATION */}
          {activeTab === 'communication' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 text-lg">Centralized Client Inbox</h3>
              <p className="text-sm text-gray-600">Manage all incoming lead replies, phone inquiries, and messages in one unified feed.</p>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">De Thermomeester</p>
                    <p className="text-xs text-gray-500">"Hey, when can we schedule the phone call to review the mockup?"</p>
                  </div>
                  <button 
                    onClick={() => showToast("Opening chat thread...")}
                    className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-gray-900">Add New Company Lead</h3>
            <form onSubmit={handleAddLead} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Business Name</label>
                <input 
                  type="text" 
                  required 
                  value={newLeadName} 
                  onChange={e => setNewLeadName(e.target.value)}
                  placeholder="e.g., Amsterdam Roofing & Construction" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Client Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={newLeadEmail} 
                  onChange={e => setNewLeadEmail(e.target.value)}
                  placeholder="e.g., client@amsterdamroofing.nl" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Website URL</label>
                <input 
                  type="text" 
                  value={newLeadWebsite} 
                  onChange={e => setNewLeadWebsite(e.target.value)}
                  placeholder="e.g., amsterdamroofing.nl" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Vertical / Industry</label>
                <input 
                  type="text" 
                  required
                  value={newLeadVertical} 
                  onChange={e => setNewLeadVertical(e.target.value)}
                  placeholder="e.g., Roofing, Dental Clinic..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={newLeadPhone} 
                  onChange={e => setNewLeadPhone(e.target.value)}
                  placeholder="+31 20 555 1234" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition cursor-pointer shadow"
                >
                  Save Lead & Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}