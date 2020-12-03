$(document).ready(function () {
  //spotify api
  const baseURL = "https://accounts.spotify.com/authorize";
  const clientId = "?client_id=60c69366ae1e45d1adbfb0614a57e993";
  const responseType = "&response_type=token";
  const redirectUri = "https://nsnyder1992.github.io/spotifyApi/";
  const spotifyApi = $("#spotify");

  spotifyApi.click(() => getSpotifyData());

  async function getSpotifyData() {
    await fetch(baseURL + clientId + responseType + redirectUri).then((res) =>
      console.log(res)
    );
  }
});
