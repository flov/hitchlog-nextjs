import LogRocket from 'logrocket';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';
import React from 'react';

import Layout from '../src/components/Layout';
import { AuthProvider } from '../src/components/contexts/AuthContext';
import LoginModalProvider from '../src/components/contexts/LoginModal';
import ToastsProvider from '../src/components/contexts/ToastContext';
import GoogleAnalyticsSetup from '../src/utils/GoogleAnalyticsSetup';

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
              {/** @ts-ignore */}
              <Component {...pageProps} />
            </Layout>
          </LoginModalProvider>
        </ToastsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
