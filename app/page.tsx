'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../utils/supabaseClient';

type UploadFile = {
  file: File;
  url?: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
};

export default function Home() {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const router = useRouter();

  const handleUpload = async (files: File[]) => {
    const newUploads: UploadFile[] = files.map((file) => ({
      file,
      progress: 0,
      status: 'uploading',
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    for (let i = 0; i < newUploads.length; i++) {
      const filePath = `${Date.now()}_${newUploads[i].file.name}`;
      const { error } = await supabase.storage.from('images').upload(filePath, newUploads[i].file);

      if (error) {
        newUploads[i].status = 'error';
      } else {
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        newUploads[i].status = 'done';
        newUploads[i].url = data.publicUrl;
        newUploads[i].progress = 100;
      }

      setUploads((prev) => [...prev]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleUpload(files);
    }
  };

  const handleDelete = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setUploads([]);
  };

  const handleSubmit = async () => {
    const successful = uploads.filter((u) => u.status === 'done');
    if (successful.length === 0) return;

    await Promise.all(successful.map((upload) =>
      supabase.from('submissions').insert({
        text: '',
        image_url: upload.url!,
        synced: true,
        created_at: new Date().toISOString(),
      })
    ));

    setUploads([]);
    router.push('/history');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-[#020617] p-8 rounded-xl shadow-lg w-full max-w-xl">
          <h2 className="text-xl font-bold mb-2">Upload Images</h2>
          <p className="text-sm text-slate-300 mb-4">Select and preview files before submitting</p>

          <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-input" />
          <label htmlFor="file-input" className="bg-sky-500 px-4 py-2 rounded-md text-white font-semibold cursor-pointer block w-fit mx-auto">
            Choose Files
          </label>

          {uploads.length > 0 && (
            <div className="mt-6 space-y-4">
              {uploads.map((upload, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <img src={upload.url || URL.createObjectURL(upload.file)} alt="" className="w-12 h-12 rounded object-cover" />
                    <div>
                      <p className="text-sm font-medium">{upload.file.name}</p>
                      <p className="text-xs text-slate-400">{(upload.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {upload.status === 'done' && <span className="text-green-400 text-sm">✔</span>}
                    <button onClick={() => handleDelete(idx)} className="text-red-400 text-sm hover:underline">Remove</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <button onClick={handleClear} className="text-sm text-slate-300 hover:text-white">Clear All</button>
                <button onClick={handleSubmit} className="button">
                  Submit
                  <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
                    <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="text-center text-white py-4 bg-black">
        © 2025 My PWA App
      </footer>
    </div>
  );
}
