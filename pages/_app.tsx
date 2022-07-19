import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from '../src/utils/firebase';
import Layout from '../src/components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FirebaseAppProvider>
  );
}

export default MyApp;
