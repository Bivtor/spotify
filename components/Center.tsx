import Image from "next/image";
import styles from "../styles/css/Center.module.css";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";

export default function Center() {
  const [showResults, setShowResults] = useState<boolean>(false)
  const [genres, setGenres] = useState<string[]>([])

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
  }, [session, spotifyApi, showResults]);

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

      let alltrackgenres: string[] = []
      for (let i = 0; i < trackInfo.length; i++) {
        for (let j = 0; j < trackInfo[i].genres.length; j++) {
          alltrackgenres.push(trackInfo[i].genres[j])
        }
      }
      setGenres(alltrackgenres)

      let count = alltrackgenres.reduce((counts, num) => {
        counts[num] = (counts[num] || 0) + 1;
        return counts;
      }, {});

      console.log(counts);

      alltrackgenres.sort(function (p0, p1) {
        return counts[p1] - counts[p0];
      });

      console.log(alltrackgenres);
    }

  }, [tracks]);

  function calculateEmoji() {
    //TODO create dictionary that maps the top genre in each top song category, and rank the dictionary

    //TODO get top 3 and do a get request from prisma, pulling Description + image from the top 3 categories --> diplay that info

    //TODO make it pretty
  }

  // TODO create css fade in and fade out transitions into seeing results

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

      {!showResults ? <div className={styles.titlediv}>
        <h1 className={styles.title}>What Emoji is Your Spotify?</h1>
        <h2 className={styles.findoutbtn} onClick={() => setShowResults(s => !s)}>
          Find Out
        </h2>
      </div> : null}

      {showResults ? <h1>RESULTS</h1> : null}
      {showResults ? <div className={styles.tracklist}>
        {genres.map((track, index) => (
          <p key={track + index} className={styles.track}> {track}</p>
        ))}
      </div> : null}
    </div >
  );
}
