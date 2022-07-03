import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { CurrentUser } from '../src/components/CurrentUser';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hitchlog</title>
        <meta name="description" content="Log your hitchhiking experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className='w-full bg-gray-200 h-96' id="map"></div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>

        <h1 className={styles.title}>
          Welcome to <Link href="/">Hitchlog</Link>
        </h1>
        <CurrentUser />
      </main>
    </>
  );
};

export default Home;
