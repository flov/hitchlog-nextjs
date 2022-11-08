import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../src/components/Layout';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../src/components/contexts/AuthContext';
import ToastsProvider from '../src/components/contexts/ToastContext';

function MyApp({ Component, pageProps }: AppProps) {
  const logrocket = process.env.NEXT_PUBLIC_LOG_ROCKET;
  logrocket && LogRocket.init(logrocket as string);
  return (
    <AuthProvider>
      <ThemeProvider attribute="class">
        <ToastsProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ToastsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
