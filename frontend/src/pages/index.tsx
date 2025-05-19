// frontend/src/pages/index.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Layout from '../components/Layout'; // استيراد مكون Layout
import { Input } from '@shadcn/ui/input';
import { Button } from '@shadcn/ui/button';
import { Card } from '@shadcn/ui/card';
import { Skeleton } from '@shadcn/ui/skeleton';
import { toast, Toaster } from 'sonner';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('يرجى اختيار ملف أولاً');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/analyze-image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(`خطأ في الرفع: ${res.statusText}`);

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
      toast.success('تم التحليل بنجاح');
    } catch (err: any) {
      toast.error(`خطأ: ${err.message}`);
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-6 text-center">Smart Scan&nbsp;- رفع الملف وتحليل النص</h1>

      <Card className="p-6 max-w-lg mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <Input
            type="file"
            onChange={handleFileChange}
            className="sm:flex-1"
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? <Skeleton className="h-6 w-20" /> : 'إرسال'}
          </Button>
        </form>

        {result && (
          <pre className="mt-6 p-4 bg-gray-100 rounded whitespace-pre-wrap text-sm">{result}</pre>
        )}
      </Card>
    </Layout>
  );
};

export default Home;
