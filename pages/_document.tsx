import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend&family=Open+Sans:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Main />
      <body>
        <NextScript />
        <Script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"
          strategy="afterInteractive"
        ></Script>
      </body>
    </Html>
  );
}
