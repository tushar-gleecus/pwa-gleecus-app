'use client';

import { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';

type Submission = {
  id: number;
  created_at: string;
  text: string;
  image_url: string;
  synced: boolean;
};

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setSubmissions(data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-grow flex justify-center items-center py-12">
        <div className="bg-[#020617] p-6 rounded-xl w-full max-w-6xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Submission History</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left p-2">Uploaded Date</th>
                <th className="text-left p-2">Speech Text</th>
                <th className="text-left p-2">Image</th>
                <th className="text-left p-2">Sync</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-slate-700">
                  <td className="p-2">{new Date(s.created_at).toLocaleString()}</td>
                  <td className="p-2">{s.text || '—'}</td>
                  <td className="p-2">
                    <img src={s.image_url} alt="submission" className="h-16 rounded shadow" />
                  </td>
                  <td className="p-2 text-green-500">{s.synced ? 'Synced' : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="text-center text-white py-4 bg-black">
        .
      </footer>
    </div>
  );
}
