$(document).ready(function () {
  //spotify api button
  const spotifyApi = $("#spotify");

  const authEndpoint = "https://accounts.spotify.com/authorize";

  // Replace with your app's client ID, redirect URI and desired scopes
  // const proxyUrl = "https://cors-anywhere.herokuapp.com/";
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
  spotifyApi.click(() => getSpotifyData());

  // Set token
  let _token = hash.access_token;

  function getSpotifyData() {
    // If there is no token, redirect to Spotify authorization
    if (!_token) {
      window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
        "%20"
      )}&response_type=token&show_dialog=true`;
    } else {
      console.log(_token);
    }

    // Make a call using the token
    fetch("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        "Authorization": `Bearer ${_token}`
      }
    }).then(res => res.json())
      .then(json => {
        console.log(json);
        json.items.map(artist => {
          let item = $("<li>" + artist.name + "</li>");
         item.appendTo($("#spotify-insert"));
        })
      })
      .catch(err => console.log(err))
  //   $.ajax({
  //     url: "https://api.spotify.com/v1/me/top/artists",
  //     type: "GET",
  //     beforeSend: function (xhr) {
  //       xhr.setRequestHeader("Authorization", "Bearer " + _token);
  //     },
  //     success: function (data) {
  //       console.log(data);
  //       // Do something with the returned data
  //       data.items.map(function (artist) {
  //         let item = $("<li>" + artist.name + "</li>");
  //         item.appendTo($("#spotify-insert"));
  //       });
  //     },
  //   });
  // }
});
