import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image';
import styles from '../styles/css/Center.module.css'

export default function Center() {
    const { data: session, status } = useSession();
    return (
        <div className={styles.center}>
            <div className={styles.smallheader}>
                <h2 className={styles.disnify}>Disnify</h2>
                <h2> {session?.user.name}</h2>
                <button onClick={() => signOut()} className={styles.button}>
                    <p>Logout</p>
                </button>
            </div>


            {/* <Image src={session?.user.address} /> */}

        </div>
    )
}
// export default Analyis;
