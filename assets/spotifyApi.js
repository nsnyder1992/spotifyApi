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
  let artistsSongs = {};
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
    //fetch functions go here
    getTopArtists();
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
      .then((json) => displayArtists(json))
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
        artistsSongs[id] = json;
      })
      .catch((err) => console.log(err));
  }

  function displayArtists(json) {
    //delete current elements
    $("#spotify-insert").empty();

    //create html elements
    let container = document.createElement("div");
    let header = document.createElement("h4");
    let content = document.createElement("div");
    let scrollable = document.createElement("div");

    //add classes
    container.className = "container";
    header.className = "text-white";
    content.className = "text-center";
    scrollable.className = "scrollable-artists spotify-content";

    //set text
    header.innerText = "Your Top Artists";

    //append children
    container.appendChild(header);

    //loop through each artist and display content
    json.items.map((artist) => {
      //add to artists array
      artists.push(artist);

      //get artists top songs
      getArtistTracks(artist.id);

      //create html elements
      let artContent = document.createElement("div");
      let img = document.createElement("img");
      let name = document.createElement("h6");

      //add classes
      artContent.className = "artist-content";
      artContent.id = artist.id;
      name.className = "artist-name";
      img.className = "artist-image";

      //add content
      name.innerText = artist.name;
      img.src = artist.images[2].url;
      artContent.id = artist.id;

      //create layout of spotify-content
      artContent.appendChild(img);
      artContent.appendChild(name);
      scrollable.appendChild(artContent);

      //add event handler
      $(document).on("click", `#${artist.id}`, () => {
        displayArtistContent(artist, artist.id);
      });
    });

    //insert content at insert point
    content.appendChild(scrollable);
    container.appendChild(content);
    $("#spotify-insert").append(container);
    $(".spotify-content").addClass("show");
  }

  //wrapper function to display songs of certain artists
  function displayArtistContent(artist, artistId) {
    displayTopTracks(artist, artistsSongs[artistId], true);
  }

  function displayTopTracks(artist, songs, tracks = false) {
    //delete current elements
    $("#spotify-tables").empty();

    //create html elements
    let container = document.createElement("div");
    let tableHeader = document.createElement("h4");
    let hr = document.createElement("hr");

    //add classes
    container.className = "container";
    tableHeader.className = "text-white";
    hr.className = "my-4";

    //add ids
    hr.id = "divider";

    //add text
    tableHeader.innerText = `${artist.name}'s Top Tracks:`;

    //append children
    $("#spotify-tables").append(hr);
    $("#spotify-tables").append(tableHeader);

    //create table
    let [table, tbody] = createTable();
    tbody = tracks
      ? createRows(songs.tracks, tbody)
      : createRows(songs.items, tbody);

    //add elements to the page
    table.appendChild(tbody);
    container.appendChild(table);
    $("#spotify-tables").append(container);
  }

  function createTable() {
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
    table.className = "table-responsive-md table-dark table-hover";
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

    return [table, tbody];
  }

  function createRows(items, tbody) {
    for (i in items) {
      //add to top songs array
      topSongs.push(items[i]);

      //create rows
      let row = document.createElement("tr");
      let id = document.createElement("th");
      let title = document.createElement("th");
      let album = document.createElement("th");
      let artist = document.createElement("th");

      //scope
      id.scope = "row";

      //classes
      id.className = "first-col";
      row.className = "table-row";

      //set text
      id.innerText = parseInt(i) + 1;
      title.innerText = items[i].name;
      album.innerText = items[i].album.name;
      artist.innerText = items[i].artists[0].name;

      //build table
      row.appendChild(id);
      row.appendChild(title);
      row.appendChild(artist);
      row.appendChild(album);
      tbody.appendChild(row);
    }

    return tbody;
  }

  function setButtonText() {
    const spotifyBtn = document.getElementById("spotify");

    _token
      ? (spotifyBtn.textContent = "Try it out!")
      : (spotifyBtn.textContent = "Authorize");
  }

  window.addEventListener("load", setButtonText);
});
