'use client';
import { useState } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
  var webkitSpeechRecognition: any;
  var SpeechRecognition: any;
}

export default function Home() {
  const [text, setText] = useState('');
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  let recognition: any = null;

  const startSpeech = () => {
    const SC = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SC) return alert('Speech not supported');
    recognition = new SC();
    recognition.lang = 'en-US';
    recognition.onresult = (e: any) => {
      setText((t) => t + e.results[0][0].transcript + ' ');
    };
    recognition.start();
  };

  const onImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImgPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = () => {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    const entry = {
      id: Date.now(),
      text,
      img: imgPreview ? { preview: imgPreview } : null,
    };
    localStorage.setItem('entries', JSON.stringify([entry, ...entries]));
    window.location.href = '/history';
  };

  return (
    <div className="form-container">
      <h2>Enter Details</h2>

      <label htmlFor="speechTextArea" className="label">Speech Input</label>
      <textarea
        id="speechTextArea"
        value={text}
        readOnly
        rows={4}
        placeholder="Your speech..."
        className="input-box"
      />

      <div className="button-center">
        <button onClick={startSpeech} className="btn primary">🎤 Start Recording</button>
      </div>

      <label htmlFor="imageUpload" className="label">Upload an image</label>
      <input id="imageUpload" type="file" accept="image/*" onChange={onImage} />
      {imgPreview && (
        <img
          src={imgPreview}
          alt="preview"
          className="thumbnail"
          width="150"
          height="120"
        />
      )}

      <div className="button-center">
        <button onClick={onSubmit} className="btn secondary">Submit</button>
      </div>
    </div>
  );
}
