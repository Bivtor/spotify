import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/css/Home.module.css'
import Center from '../components/Center'

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Disnify</title>
        <meta name="description" content="I am groot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center />

      <main />
    </div >
  )
}

export default Home;
