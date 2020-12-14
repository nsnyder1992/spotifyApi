$(document).ready(function () {
  //spotify api button
  const spotifyApi = $("#spotify");

  //spotify constants
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const clientId = "60c69366ae1e45d1adbfb0614a57e993";
  const redirectUri = "https://nsnyder1992.github.io/spotifyApi/";
  const scopes = ["user-top-read"];
  const baseUrl = "https://api.spotify.com/v1/";

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
  let artistsSongs = [];
  let topSongs = [];

  //click functions
  spotifyApi.click(() => getSpotifyData());

  function checkAuth() {
    // If there is no token, redirect to Spotify authorization
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      "%20"
    )}&response_type=token&show_dialog=true`;
  }

  function getSpotifyData() {
    getTopArtists();
    getTopTracks();
  }

  async function getTopArtists() {
    if (!_token) checkAuth();

    // Make a call using the token
    let topNum = 5;
    await fetch(baseUrl + `me/top/artists?limit=${topNum}`, {
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

  async function getTopTracks() {
    if (!_token) checkAuth();

    // Make a call using the token
    let topNum = 10;
    await fetch(baseUrl + `me/top/tracks?limit=${topNum}`, {
      headers: {
        Authorization: `Bearer ${_token}`,
      },
    })
      .then(async (res) => await res.json())
      .then((json) => {
        displayTopTracks(json);
      })
      .catch((err) => console.log(err));
  }

  async function getArtistTracks(id) {
    let countryCode = "US";

    if (!_token) checkAuth();

    // Make a call using the token
    await fetch(baseUrl + `artists/${id}/top-tracks?country=${countryCode}`, {
      headers: {
        Authorization: `Bearer ${_token}`,
      },
    })
      .then(async (res) => await res.json())
      .then((json) => {
        console.log(json);
        artistsSongs.push(json);
        displayTopTracks(json);
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
      //add to artists array
      artists.push(artist);

      //get artists top songs
      console.log(artist);
      getArtistTracks(artist.id);

      //create html elements
      let artContent = document.createElement("div");
      let a = document.createElement("a");
      let img = document.createElement("img");
      let name = document.createElement("h6");

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
      // artContent.appendChild(img);
      artContent.appendChild(name);
      scrollable.appendChild(artContent);
    });

    //insert content at insert point
    content.appendChild(scrollable);
    container.appendChild(content);
    $("#spotify-insert").append(container);
  }

  function displayTopTracks(songs) {
    console.log(songs);
    let container = document.createElement("div");

    //create table
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tr1 = document.createElement("tr");
    let tbody = document.createElement("tbody");

    //create columns
    let songId = document.createElement("th");
    let songTitle = document.createElement("th");
    let songAlbum = document.createElement("th");
    let songArtist = document.createElement("th");

    //add classes
    container.className = "container";
    table.className = "table-responsive table-dark table-striped";
    thead.className = "thead-dark table-head";
    songId.className = "first-col";

    //set scopes
    songId.scope = "col";
    songTitle.scope = "col";
    songAlbum.scope = "col";
    songArtist.scope = "col";

    //set text
    songId.innerText = "#";
    songTitle.innerText = "Title";
    songAlbum.innerText = "Album";
    songArtist.innerText = "Artist";

    //append children
    tr1.appendChild(songId);
    tr1.appendChild(songTitle);
    tr1.appendChild(songArtist);
    tr1.appendChild(songAlbum);
    thead.appendChild(tr1);
    table.appendChild(thead);

    items = songs.items instanceof undefined ? songs.items : songs.tracks;

    for (i in items) {
      //add to top songs array
      topSongs.push(items[i]);

      //create rows
      let songTr = document.createElement("tr");
      let id = document.createElement("th");
      let title = document.createElement("th");
      let album = document.createElement("th");
      let artist = document.createElement("th");

      //scope
      id.scope = "row";

      //classes
      id.className = "first-col";
      songTr.className = "table-row";

      //set text
      id.innerText = i + 1;
      title.innerText = items[i].name;
      album.innerText = items[i].album.name;
      artist.innerText = items[i].artists[0].name;

      //build table
      songTr.appendChild(id);
      songTr.appendChild(title);
      songTr.appendChild(artist);
      songTr.appendChild(album);
      tbody.appendChild(songTr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
    $("#spotify-tables").append(container);
  }
});
