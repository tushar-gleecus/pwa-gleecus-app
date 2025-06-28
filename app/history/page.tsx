'use client';
import { useEffect, useState } from 'react';

export default function History() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('entries') || '[]');
    setEntries(stored);
  }, []);

  return (
    <div className="history-container">
      <h2>Submission History</h2>

      <table className="history-table">
        <thead>
          <tr>
            <th>Uploaded Date</th>
            <th>Speech Text</th>
            <th>Image</th>
            <th>Sync</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry: any, index: number) => (
            <tr key={entry.id}>
              <td>{new Date(entry.created_at).toLocaleString()}</td>
              <td>{entry.text}</td>
              <td>
                {entry.img?.preview ? (
                  <img
                    src={entry.img.preview}
                    alt={`Entry ${index + 1}`}
                    width="60"
                    height="50"
                    style={{ borderRadius: 4 }}
                  />
                ) : '—'}
              </td>
              <td>{entry.sync === 'Synced' ? '✅ Synced' : '❌ Not Synced'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
