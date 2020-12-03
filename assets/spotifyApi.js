$(document).ready(function () {
  //spotify api
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const baseURL = "https://accounts.spotify.com/authorize";
  const clientId = "?client_id=60c69366ae1e45d1adbfb0614a57e993";
  const responseType = "&response_type=token";
  const redirectUri = "https:%2F%2nsnyder1992.github.io%2spotifyApi";
  const scope = "&scope=user-read-private%20user-read-email";
  const state = "&state=123";
  const spotifyApi = $("#spotify");

  spotifyApi.click(() => getSpotifyData());

  async function getSpotifyData() {
    await fetch(
      proxyUrl + baseURL + clientId + responseType + redirectUri + scope + state
    ).then((res) => console.log(res));
  }
});
