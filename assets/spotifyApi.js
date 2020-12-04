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

  //click functions
  spotifyApi.click(() => getSpotifyData());

  // $("a").click((e) => {
  //   if (e.target.className == "artist-link") {
  //     e.preventDefault();
  //     redirectArtist(e);
  //   }
  // });

  async function getSpotifyData() {
    // If there is no token, redirect to Spotify authorization
    if (!_token) {
      window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
        "%20"
      )}&response_type=token&show_dialog=true`;
    }

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
    let row = document.createElement("div");

    //add bootstrap classes
    container.className = "container";
    row.className = "row text-center";

    json.items.map((artist) => {
      let col = document.createElement("div");
      let a = document.createElement("a");
      let img = document.createElement("img");
      let name = document.createElement("h6");

      //add to artists array
      artists.push(artist);

      //add classes
      col.className = "col spotify-content";
      a.className = "artist-link";
      name.className = "artist-name";
      img.className = "artist-image";

      //add content
      a.href = artist.external_urls.spotify;
      a.target = "blank";
      name.innerText = artist.name;
      img.src = artist.images[2].url;
      col.id = artist.id;

      //create layout of spotify-content
      a.appendChild(img);
      col.appendChild(a);
      col.appendChild(name);
      row.appendChild(col);
    });

    //insert content at insert point
    container.appendChild(row);
    $("#spotify-insert").append(container);
  }

  // function redirectArtist(e) {
  //   console.log(e);
  //   const tab = window.open("about:blank");
  //   for (artist of artists) {
  //     if (artist.id == e.target.id) {
  //       fetch("");
  //     }
  //   }
  // }
});
