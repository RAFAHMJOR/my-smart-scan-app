// frontend/pages/index.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus('يرجى اختيار ملف أولاً');
      return;
    }
    setStatus('تحميل...');

    const formData = new FormData();
    formData.append('file', file);

    // frontend/pages/index.tsx
    const apiBase = process.env.NEXT_PUBLIC_API_URL;   // <─ يأتي من .env.local أثناء build

    try {
      const response = await fetch(`${apiBase}/analyze-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`خطأ في الرفع: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2)); // عرض النتيجة بشكل منسق
      setStatus('نجاح');
    } catch (error: any) {
      setStatus(`خطأ: ${error.message}`);
      setResult('');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-6">Smart Scan - رفع الملف وتحليل النص</h1>
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          إرسال
        </button>
      </form>
      <div className="mt-5">
        <strong className="block mb-1">حالة:</strong> <span>{status}</span>
      </div>
      <div className="mt-5 bg-gray-100 p-4 rounded whitespace-pre-wrap">
        <strong className="block mb-2">النتائج:</strong>
        <pre className="text-sm">{result}</pre>
      </div>
    </div>
  );
};

export default Home;
