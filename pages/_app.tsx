import React from 'react';

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../src/components/Layout';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../src/components/contexts/AuthContext';
import ToastsProvider from '../src/components/contexts/ToastContext';
import LogRocket from 'logrocket';
import GoogleAnalyticsSetup from '../src/utils/GoogleAnalyticsSetup';
import LoginModalProvider from '../src/components/contexts/LoginModal';

function MyApp({ Component, pageProps }: AppProps) {
  // Log rocket set up
  const logrocket = process.env.NEXT_PUBLIC_LOG_ROCKET;
  logrocket && LogRocket.init(logrocket as string);

  return (
    <AuthProvider>
      <ThemeProvider attribute="class">
        <ToastsProvider>
          <LoginModalProvider>
            <Layout>
              <GoogleAnalyticsSetup />
              <Component {...pageProps} />
            </Layout>
          </LoginModalProvider>
        </ToastsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
