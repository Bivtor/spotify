import React from "react";
import Image from "next/image";
import styles from "../styles/css/Center.module.css";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";
import Typed, { TypedOptions } from 'typed.js';
import Ad1 from '../components/Ad1'

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


  async function DBAdd(name: string, id: number, text: string) {
    await fetch('/api/insertName', {
      method: "POST",
      body: JSON.stringify({ "name": name, "id": id, "text": text })
    })
  }

  async function getDataGPT() {
    const results = await fetch('/api/openai', {
      method: "POST",
      body: JSON.stringify(genres)
    })
    const data = await results.json()
      .catch(error => {
        console.error('There was a problem fetching the data:', error);
      })
    return data
  }

  async function checkDB(username: String) {
    //check if we have your spotify username in the DB
    const response = await fetch('/api/checkName', {
      method: "POST",
      body: JSON.stringify(session?.user.name)
    })
    const data = await response.json()
    return data
  }

  async function GPTAnalysis() {
    console.log("pushed")

    // handle TS name exception:
    let incomingname = session?.user.name
    if (session?.user.name == undefined) {
      // this will always fail (probably) so we will fall into the gpt case 
      incomingname = "123u4892e792487829473"
    }

    const result = await checkDB(incomingname!)
    console.log(result)
    // if we return FOUND (result[0] is true) then display the data from the previous analysis
    let analysisData = ""
    if (result.found) {
      console.log("found name")
      // Set the analysis to what we found
      setAnalysis(result.text)
    } else {
      console.log("did not find name in db ")
      // fetch analysis data from chatgpt (genres are the only input which are global here)
      analysisData = await getDataGPT()
      console.log(analysisData)
      // add analysis to databse
      await DBAdd(incomingname!, 12345, analysisData)
      // set analysis
      setAnalysis(analysisData)
    }

    // Finally show the results that we recieved from db or gpt
    setShowResults(true)
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
      {/* Ad Section */}
      {/* <Ad1></Ad1> */}

    </div >
  );
}

