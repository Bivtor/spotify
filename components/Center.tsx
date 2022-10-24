import Image from "next/image";
import styles from "../styles/css/Center.module.css";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";

export default function Center() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [trackInfo, setTrackInfo] = useState<SpotifyApi.ArtistObjectFull[]>([]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyTopTracks({ limit: 50 }).then((data) => {
        setTracks(data.body.items)
      })
    }
  }, [session, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      // get all the tracks ids
      let trackIds: string[] = []
      for (let i = 0; i < tracks.length; i++) {
        trackIds.push(tracks[i].artists[0].id)
      }

      spotifyApi.getArtists(trackIds).then((data) => {
        setTrackInfo(data.body.artists)
      })
    }
  }, [tracks]);


  return (
    <div className={styles.center}>
      <div className={styles.smallheader}>

        <h2> {session?.user.name}</h2>
        <h2 className={styles.disnify}>Disnify</h2>
        <h2 onClick={() => signOut()} className={styles.button}>
          Logout
        </h2>

        <div className={styles.profileimage}>
          <img src={session?.user.image}></img>
        </div>
      </div>



      <div className={styles.tracklist}>
        {trackInfo.map((track, index) => (
          <p key={track.name + index} className={styles.track}> {track.name} <br />{track.genres.join(", ")}</p>
        ))}
      </div>

      {/* <Image src={session?.user.picture} /> */}
    </div >
  );
}
// export default Analyis;
