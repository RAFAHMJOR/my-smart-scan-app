// pages/_app.tsx
import '../styles/globals.css';           // مسار نسبي إلى CSS
import type { AppProps } from 'next/app'; // نوع الخصائص

// ✨ لا تغيّر اسم الدالة أو التصدير الافتراضي
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
