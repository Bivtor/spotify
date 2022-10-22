import { getProviders, signIn } from "next-auth/react";
import styles from "../styles/css/Login.module.css";
import Image from "next/image";
import SPImage from "../public/images/SPImage.png";

function login({ providers }) {
  return (
    <div className={styles.login}>
      <div className={styles.logo}>
        <Image src={SPImage} width={200} height={200} />
      </div>

      {Object.values(providers).map((provider) => (
        <div key={provider.name} className={styles.provider}>
          <button
            className={styles.button}
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
