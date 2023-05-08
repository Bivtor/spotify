import React from "react";
import Image from "next/image";
import styles from "../styles/css/Center.module.css";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";
import Typed, { TypedOptions } from 'typed.js';

export default function Center() {
  const [showResults, setShowResults] = useState<boolean>(false)
  const [genres, setGenres] = useState<string[]>([])
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [trackInfo, setTrackInfo] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const [analysis, setAnalysis] = useState<string>("");

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyTopTracks({ limit: 5 }).then((data) => {
        setTracks(data.body.items)
      })
    }
  }, [session, spotifyApi]);

  function TypingEffect() {
    const typedRef = React.useRef(null);

    useEffect(() => {
      const typedOptions: TypedOptions = {
        strings: [analysis],
        typeSpeed: 30,
        backSpeed: 30,
        loop: false,
      };

      const typed = new Typed(typedRef.current, typedOptions);
      return () => {
        typed.destroy();
      };
    }, [analysis]);

    return (
      <span className={styles.analysisText} ref={typedRef}></span>
    );
  }

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
    }

  }, [tracks, showResults]);

  async function GPTAnalysis() {
    setShowResults(!showResults)
    await fetch('/api/openai', {
      method: "POST",
      body: JSON.stringify(genres)
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(data => {
        setAnalysis(data)
      })
      .catch(error => {
        console.error('There was a problem fetching the data:', error);
      })

    //TODO create dictionary that maps the top genre in each top song category, and rank the dictionary

    //TODO get top 3 and do a get request from prisma, pulling Description + image from the top 3 categories --> diplay that info
  }
  return (
    <div className={styles.center}>
      <div className={styles.smallheader}>

        <h2> {session?.user.name}</h2>
        <h2 className={styles.disnify}>Spotify</h2>
        <h2 onClick={() => signOut()} className={styles.button}>
          Logout
        </h2>

        <div className={styles.profileimage}>
          <img src={session?.user.image}></img>
        </div>
      </div>
      <div className={styles.titleBox}>
        <h1 className={styles.title}>What does your Spotify say about you?</h1>
        <button className={styles.findoutbtn} onClick={GPTAnalysis}>
          Find Out
        </button>
      </div>
      <div className={styles.analysisBox}>
        <TypingEffect />
      </div>
    </div >
  );
}

