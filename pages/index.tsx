import Head from "next/head";
import styles from "../styles/css/Home.module.css";
import Center from "../components/Center";
import { NextPage } from "next";
import Script from "next/script";


const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>What Does Your Music Taste Say About You?</title>
        <meta name="Spotify Analysis" content="What Does Your Music Taste Say About You?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="Adsense-id" async
        onError={(e) => { console.error("Script failed to load", e); }}
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3215856112166546"
        crossOrigin="anonymous">
      </Script>
      <Center />
      <main />
    </div>
  );
};

export default Home;
