import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../src/components/Layout';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../src/components/contexts/AuthContext';
import ToastsProvider from '../src/components/contexts/ToastContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../src/utils/gtag';
import Script from 'next/script';
import LogRocket from 'logrocket';

function MyApp({ Component, pageProps }: AppProps) {
  // Log rocket set up
  const logrocket = process.env.NEXT_PUBLIC_LOG_ROCKET;
  logrocket && LogRocket.init(logrocket as string);

  // Google analytics set up
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <AuthProvider>
      <ThemeProvider attribute="class">
        <ToastsProvider>
          <Layout>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
              page_path: window.location.pathname,
            });
          `,
              }}
            />

            <Component {...pageProps} />
          </Layout>
        </ToastsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
