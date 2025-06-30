'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

type UploadFile = {
  file: File;
  url?: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
};

export default function Home() {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      alert('Back online. Attempting to sync.');
      handleSubmit();
    };
    const handleOffline = () => {
      setIsOnline(false);
      alert('You are offline. Uploads will sync once you reconnect.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
      setUploads([...newUploads]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleUpload(files);
    }
  };

  const saveToIndexedDB = async (upload: UploadFile) => {
    const db = await openDB();
    const tx = db.transaction('uploads', 'readwrite');
    const store = tx.objectStore('uploads');
    await store.put({
      id: uuidv4(),
      url: upload.url,
      created_at: new Date().toISOString(),
    });
  };

  const openDB = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('upload-store', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('uploads', { keyPath: 'id' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const handleSubmit = async () => {
    const successful = uploads.filter((u) => u.status === 'done');
    if (successful.length === 0) return;

    if (!isOnline) {
      for (const upload of successful) {
        await saveToIndexedDB(upload);
      }
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const reg = await navigator.serviceWorker.ready;
        // @ts-expect-error: sync is not yet in TS types
        await reg.sync?.register('sync-uploads');
        alert('Offline: Uploads will sync once back online.');
      }
      return;
    }

    try {
      await Promise.all(
        successful.map((upload) =>
          supabase.from('submissions').insert({
            text: '',
            image_url: upload.url!,
            synced: true,
            created_at: new Date().toISOString(),
          })
        )
      );
      setUploads([]);
      router.push('/history');
    } catch (error) {
      console.log(error);
      setUploads((prev) =>
        prev.map((upload) =>
          upload.status === 'done' ? { ...upload, synced: false } : upload
        )
      );
      alert('Submission failed. Will retry when online.');
    }
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
                    <button onClick={() => setUploads(uploads.filter((_, i) => i !== idx))} className="text-red-400 text-sm hover:underline">Remove</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <button onClick={() => setUploads([])} className="text-sm text-slate-300 hover:text-white">Clear All</button>
                <button onClick={handleSubmit} className="button" disabled={!isOnline}>
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
    </div>
  );
}
