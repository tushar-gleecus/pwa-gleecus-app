'use client';
import React from 'react';

type UploadFile = {
  file: File;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  url?: string;
};

interface CardProps {
  onUpload: (files: File[]) => void;
  uploads: UploadFile[];
  onClear?: () => void;
}

const Card: React.FC<CardProps> = ({ onUpload, uploads, onClear }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onUpload(files);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-slate-950 text-white p-6 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-semibold mb-2">Upload Files</h2>
        <p className="text-slate-400 mb-6">Click below to choose files</p>

        <div className="text-center mb-6">
          <input
            type="file"
            ref={inputRef}
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-2 rounded-lg font-medium text-white hover:opacity-90 transition"
          >
            Choose Files
          </button>
        </div>

        {uploads.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {uploads.map((u, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{u.file.name}</p>
                      <p className="text-xs text-slate-400">
                        {(u.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <div>
                      {u.status === 'uploading' && (
                        <span className="text-cyan-400">{u.progress}%</span>
                      )}
                      {u.status === 'done' && (
                        <span className="text-emerald-400">✅ Done</span>
                      )}
                      {u.status === 'error' && (
                        <span className="text-red-400">❌ Error</span>
                      )}
                    </div>
                  </div>
                  {u.status === 'uploading' && (
                    <div className="mt-2 h-1 w-full bg-slate-800 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full"
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => inputRef.current?.click()}
                className="bg-cyan-700 px-4 py-2 rounded-xl text-white hover:bg-cyan-600"
              >
                Upload More
              </button>
              <button
                onClick={onClear}
                className="bg-slate-800 px-4 py-2 rounded-xl text-white hover:bg-slate-700"
              >
                Clear All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
