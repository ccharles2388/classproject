// Your web app's Firebase configuration

var firebaseConfig = {
  apiKey: "AIzaSyBC9EdzFuCmH14viAgGa7joQBxcr2H_a1c",
  authDomain: "the-wild-music-experience.firebaseapp.com",
  databaseURL: "https://the-wild-music-experience.firebaseio.com",
  projectId: "the-wild-music-experience",
  storageBucket: "",
  messagingSenderId: "885036588462",
  appId: "1:885036588462:web:b52fe4c987259292e67c3f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


/*
Extra feature ideas:

- Show lyrics on page rather than in the console
- Repeat snippet
- Red font color for "couldn't load snippet" text

- Predefined searches (random, etc.)

- Save lyrics
- Export lyrics

- Save search (buttons appear when page loads)
- Delete saved searches
*/


$(document).ready(function () {
  // Initialize Parllax when page loads
  $('.parallax').parallax();
});


$("#submit").on("click", function () {
  // Submit button
  event.preventDefault();
  if (!$("#search").val() || !$("#number-of-results").val()) {
    // If one (or both) of the text boxes are blank
    return;
  }
  $("#test").empty();
  var search = $("#search").val();
  var numberOfResults = $("#number-of-results").val();
  var images;

  // Giphy
  var queryURLgiphy =
    "https://api.giphy.com/v1/gifs/search?api_key=x6F3pfxkqKMEhu2U8AOt2RK4zj0mgfdT" +
    "&q=" + search +
    "&limit=" + numberOfResults;
  $.ajax({
    url: queryURLgiphy,
    method: "GET",
  })
    .then(function (responseImgs) {
      images = responseImgs;
    })

  // Musixmatch
  var queryURLmusix =
    "https://cors-anywhere.herokuapp.com/" +
    "https://api.musixmatch.com/ws/1.1/track.search?" +
    "q_lyrics=" + search +
    "&page_size=" + numberOfResults +
    "&apikey=9d4d23cdf5a7b47ec3b154fdd098501f";
  $.ajax({
    url: queryURLmusix,
    method: "GET",
  })
    .then(function (response1) {
      // response1 and data1 are used for this query
      // response2 and data2 are used for the snippet query
      var data1 = JSON.parse(response1);
      for (i = 0; i < numberOfResults; i++) {
        let image = $("<img>");
        let trackID, trackName, trackArtist;
        // let is used since var doesn't work here
        try {
          // Attempt to get query results
          image.attr("src", images.data[i].images.fixed_height.url);
          trackID = data1.message.body.track_list[i].track.track_id;
          trackName = data1.message.body.track_list[i].track.track_name;
          trackArtist = data1.message.body.track_list[i].track.artist_name;
        }
        catch (err) {
          $("#test").append("Search failed. Try entering something else.")
          return;
        }

        // Separate query for track.snippet.get method
        var queryURLsnippet =
          "https://cors-anywhere.herokuapp.com/" +
          "https://api.musixmatch.com/ws/1.1/track.snippet.get?" +
          "track_id=" + trackID +
          "&apikey=9d4d23cdf5a7b47ec3b154fdd098501f";
        $.ajax({
          url: queryURLsnippet,
          method: "GET",
        })
          .then(function (response2) {
            data2 = JSON.parse(response2);
            var trackSnippet = data2.message.body.snippet.snippet_body;
            if (trackSnippet === "" || trackSnippet == null) {
              // Snippet couldn't load
              trackSnippet = "[Couldn't load snippet]"
            }
            else {
              console.log(trackSnippet);
            }
            $("#test").append("<br>")
            $("#test").append(image)
            $("#test").append("<br><b>" + trackSnippet + "</b><br>" + "\"" + trackName + "\"" + "<br>" + trackArtist + "<br>");
          });
      }
    });
});


$("#clear").on("click", function () {
  // Clear button
  console.clear();
  $("#test").empty();
});