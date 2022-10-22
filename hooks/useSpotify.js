import { useEffect } from "react";
import { signIn, useSession } from "next-auth./react";
import SpotifyApi from "../lib/spotify";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }

      SpotifyApi.setAccessToken(session.user.accesToken);
    }
  }, [session]);

  return SpotifyApi;
}
export default useSpotify;
