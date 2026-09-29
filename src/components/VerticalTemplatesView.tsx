import React from 'react';

export const VerticalTemplatesView: React.FC = () => {
  const verticals = [
    { name: 'Airco Installer', desc: 'HVAC repair and installation lead template', count: 12 },
    { name: 'Builder', desc: 'Construction and contracting high-conversion template', count: 19 },
    { name: 'Kebab Shop', desc: 'Local fast-food ordering template', count: 8 },
    { name: 'Local Eatery', desc: 'Restaurant reservation & menu template', count: 14 },
    { name: 'Medical Assistance', desc: 'Clinic booking and healthcare template', count: 7 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Niche Verticals & Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {verticals.map((v) => (
          <div key={v.name} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-800 text-lg">{v.name}</h3>
            <p className="text-sm text-gray-500">{v.desc}</p>
            <div className="pt-2 flex justify-between items-center text-xs font-medium text-emerald-600">
              <span>{v.count} Active Mockups</span>
              <button className="bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};