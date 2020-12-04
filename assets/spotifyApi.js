$(document).ready(function () {
  //spotify api button
  const spotifyApi = $("#spotify");

  //spotify constants
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const clientId = "60c69366ae1e45d1adbfb0614a57e993";
  const redirectUri = "https://nsnyder1992.github.io/spotifyApi/";
  const scopes = ["user-top-read"];

  // Get the hash of the url
  const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
  window.location.hash = "";

  // Set token
  let _token = hash.access_token;

  //variables
  let artists = [];

  //set button text
  !_token
    ? (spotifyApi.innerText = "Authorize")
    : (spotifyApi.innerText = "Try it out!");

  //click functions
  spotifyApi.click(() => getSpotifyData());

  function checkAuth() {
    // If there is no token, redirect to Spotify authorization
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      "%20"
    )}&response_type=token&show_dialog=true`;
  }

  async function getSpotifyData() {
    if (!_token) checkAuth();

    // Make a call using the token
    let topNum = 5;
    await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${topNum}`, {
      headers: {
        Authorization: `Bearer ${_token}`,
      },
    })
      .then(async (res) => await res.json())
      .then((json) => {
        console.log(json);
        displayArtists(json);
      })
      .catch((err) => console.log(err));
  }

  function displayArtists(json) {
    let container = document.createElement("div");
    let content = document.createElement("div");
    let scrollable = document.createElement("div");

    //add bootstrap classes
    container.className = "container";
    content.className = "text-center";
    scrollable.className = "scrollable-artists spotify-content";

    json.items.map((artist) => {
      let artContent = document.createElement("div");
      let a = document.createElement("a");
      let img = document.createElement("img");
      let name = document.createElement("h6");

      //add to artists array
      artists.push(artist);

      //add classes
      artContent.className = "artist-content";
      a.className = "artist-link";
      name.className = "artist-name";
      img.className = "artist-image";

      //add content
      a.href = artist.external_urls.spotify;
      a.target = "blank";
      name.innerText = artist.name;
      img.src = artist.images[2].url;
      artContent.id = artist.id;

      //create layout of spotify-content
      a.appendChild(img);
      artContent.appendChild(a);
      artContent.appendChild(name);
      scrollable.appendChild(artContent);
    });

    //insert content at insert point
    content.appendChild(scrollable);
    container.appendChild(content);
    $("#spotify-insert").append(container);
  }
});
