import React, { useState } from 'react';
import { Lead } from '../utils/api';
import { Plus, ArrowUpRight, Send, CheckCircle2 } from 'lucide-react';

interface LeadsPipelineViewProps {
  leads: Lead[];
}

export const LeadsPipelineView: React.FC<LeadsPipelineViewProps> = ({ leads }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [vertical, setVertical] = useState('HVAC & Plumbing');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [sendingEmailId, setSendingEmailId] = useState<number | null>(null);
  const [emailSuccessId, setEmailSuccessId] = useState<number | null>(null);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, website, vertical, phone, email }),
      });
      const data = await response.json();
      if (data.success) {
        setName('');
        setWebsite('');
        setPhone('');
        setEmail('');
        setIsModalOpen(false);
        window.location.reload();
      } else {
        alert('Napakyas sa pag-save sa lead sa database.');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('May nahitabong sipyat sa koneksyon sa server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailMockup = async (lead: Lead) => {
    if (lead.id === undefined) {
      alert('Kini nga lead walay valid ID!');
      return;
    }

    if (!lead.email) {
      alert('Kini nga lead walay nakabutang nga email address!');
      return;
    }

    const leadId: number = lead.id;
    setSendingEmailId(leadId);
    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: lead.email,
          clientName: lead.name || lead.business_name || 'Valued Client',
          mockupUrl: `https://${lead.website || lead.website_url || 'weboritesolutions.com'}`
        }),
      });
      const result = await response.json();
      if (result.success) {
        setEmailSuccessId(leadId);
        setTimeout(() => setEmailSuccessId(null), 4000);
      } else {
        alert('Napakyas sa pagpadala sa email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('May nahitabong sipyat sa koneksyon sa server.');
    } finally {
      setSendingEmailId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lead Pipeline & Tracking</h1>
          <p className="text-sm text-gray-500">Manage and monitor all prospect submissions and active mockups.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lead</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-medium">
                <th className="pb-3">Business Name</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">Vertical</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => {
                const currentId = lead.id ?? 0;
                return (
                  <tr key={currentId} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 font-medium text-gray-800">
                      <div className="flex items-center space-x-2">
                        <span>{lead.name || lead.business_name}</span>
                        <a href={`https://${lead.website || lead.website_url}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-emerald-600">
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </div>
                      <span className="text-xs text-gray-400">{lead.website || lead.website_url}</span>
                    </td>
                    <td className="py-3 text-gray-600 text-xs">{lead.email || 'Wala\'y email'}</td>
                    <td className="py-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">{lead.vertical}</span>
                    </td>
                    <td className="py-3">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {lead.status || 'Ready'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {emailSuccessId === currentId ? (
                        <span className="inline-flex items-center text-emerald-600 text-xs font-semibold space-x-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Na-send na!</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendEmailMockup(lead)}
                          disabled={sendingEmailId === currentId}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ml-auto disabled:opacity-50"
                        >
                          <Send className="h-3 w-3" />
                          <span>{sendingEmailId === currentId ? 'Nag-send...' : 'Send Mockup'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800">Add New Company Lead</h2>
            <form onSubmit={handleAddLead} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">BUSINESS NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amsterdam Roofing"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CLIENT EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. client@amsterdamroofing.nl"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">WEBSITE URL</label>
                <input
                  type="text"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. amsterdamroofing.nl"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">VERTICAL / INDUSTRY</label>
                <input
                  type="text"
                  value={vertical}
                  onChange={(e) => setVertical(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">PHONE NUMBER</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+31 20 555 1234"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Nag-save...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};