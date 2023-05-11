import { useEffect } from "react";
import styles from "../styles/css/Ad1.module.css";

const Ad1 = (props) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log("ERROR" + err);
    }
  }, []);

  return <ins className={styles.ad} data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID} data-ad-slot="3355426429" data-ad-format="auto" data-full-width-responsive="true"></ins>;
};

export default Ad1;
