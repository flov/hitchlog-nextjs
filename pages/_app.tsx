import React from 'react';

import LogRocket from 'logrocket';
import { ThemeProvider } from 'next-themes';
import { CustomFlowbiteTheme, Flowbite } from 'flowbite-react';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/components/contexts/AuthContext';
import LoginModalProvider from '@/components/contexts/LoginModal';
import ToastsProvider from '@/components/contexts/ToastContext';
import GoogleAnalyticsSetup from '@/utils/GoogleAnalyticsSetup';
import { theme } from '@/flowbite/theme';

function MyApp({ Component, pageProps }: AppProps) {
  // Log rocket set up
  const logrocket = process.env.NEXT_PUBLIC_LOG_ROCKET;
  logrocket && LogRocket.init(logrocket as string);

  return (
    <AuthProvider>
      <ThemeProvider attribute="class">
        <Flowbite theme={{ theme }}>
          <ToastsProvider>
            <LoginModalProvider>
              <Layout>
                <GoogleAnalyticsSetup />
                {/** @ts-ignore */}
                <Component {...pageProps} />
              </Layout>
            </LoginModalProvider>
          </ToastsProvider>
        </Flowbite>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
