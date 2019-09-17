let yid;
const apiKey = "AIzaSyAGXMpHkC4iTZs4uRtYEyLla2Xs6fRmqV8";
const searchURL = "https://www.googleapis.com/youtube/v3/search";

/*----------------------GET GAME LIST FROM API----------------------------*/
function searchPage(g) {
  fetch("https://api.rawg.io/api/games?page_size=10&search=" + g)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => alert("Something went wrong. Try again later."));
}

/*----------------------GET GAME INFO FROM API  ----------------------------*/
function gameDetails(gameName) {
  fetch("https://api.rawg.io/api/games/" + gameName)
    .then(response => response.json())
    .then(responseJson1 => getYouTubeVideos(responseJson1))
    .catch(error => error => alert("Something went wrong. Try again later."));
}

/*----------------------GAME LIST PAGE ----------------------------*/
function displayResults(responseJson) {
  $(".gameInfo").empty();
  $("#search-results").empty();

  $(".main-games").addClass("hidden");
  // iterate through the items array
  if (responseJson.count > 0) {
    for (let i = 0; i < responseJson.results.length; i++) {
      console.log(responseJson.results[i].name);
      $("#search-results").append(
        `<li>
            <img class="results-image" src='${responseJson.results[i].background_image}'>
          <h3 id="${i}" class="result-heading">${responseJson.results[i].name} <i class="fas fa-caret-right"></i></h3>
          </li>`
      );
    }
  } else {
    $("#js-error-message")
      .append(`<h2><i class="fas fa-skull-crossbones"></i></h2>
                                    <p> 404  GAME NOT FOUND !</p>`);
  }
  $("#searchResults").removeClass("hidden");
  gameId(responseJson);
}

/*----------------------GAME INFORMATION PAGE ----------------------------*/
function displayGame(data, responseJson1) {
  $("#searchResults").addClass("hidden");
  let youtubeId = data.items[0].id.videoId;

  $(".gameInfo").html(
    `
    <h2>${responseJson1.name}</h2>
    <iframe  class="ytvideo"
     src="https://www.youtube.com/embed/${youtubeId}">
     </iframe>
    <p class="details">RELEASED : <span >${responseJson1.released}</span></p>
    <p class="details">METACRITIC RATING : <span>${responseJson1.metacritic}</span></p>
    <p class="rating">RATING ${responseJson1.rating}/5</p>
    <div class="desc">
    <p>THE GAME</p>
    </div>
    <div class="description">
      ${responseJson1.description}
    </div>
    <h5 class="details">PLATFORMS/STORE</h5>
    `
  );
  for (let j = 0; j < responseJson1.stores.length; j++) {
    if (responseJson1.stores[j].store.id == 1) {
      $(".gameInfo").append(
        `<a href="${responseJson1.stores[j].url}" class="platform" target="_blank"><i class="fab fa-windows"></i></<a>`
      );
    } else if (responseJson1.stores[j].store.id == 2) {
      $(".gameInfo").append(
        `<a href="${responseJson1.stores[j].url}" class="platform" target="_blank"><i class="fab fa-xbox"></i></<a>`
      );
    } else if (responseJson1.stores[j].store.id == 3) {
      $(".gameInfo").append(
        `<a href="${responseJson1.stores[j].url}" class="platform" target="_blank"><i class="fab fa-playstation"></i></<a>`
      );
    }
  }
}

/*----------------------GET GAME ID----------------------------*/
function gameId(responseJson) {
  $("#search-results").on("click", "h3", function(e) {
    event.preventDefault();
    let a = $(this).attr("id");
    gameDetails(responseJson.results[a].slug);
  });
}

/*----------------------GET YOUTUBE VIDEO ----------------------------*/
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function getYouTubeVideos(responseJson1) {
  let query = `${responseJson1.name} Trailer`;
  const maxResults = 1;
  const params = {
    key: apiKey,
    q: query,
    part: "snippet",
    maxResults
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;
  fetch(url)
    .then(response => response.json())
    .then(data => displayGame(data, responseJson1))
    .catch(error => {
      $("#js-error-message").text(`Something went wrong: ${error.message}`);
    });
}

/*----------------------SEARCH A GAME----------------------------*/
function searchSubmit() {
  $(".searchButton").click(function() {
    event.preventDefault();

    const game = $("#searchValue").val();
    searchPage(game);
  });
}

/*----------------------HAMBURGER MENU ----------------------------*/

function hamburgerMenu() {
  $(".container-2 ").click(function() {
    this.classList.toggle("change");
    $(".topnav").toggleClass("show-nav", 500);
  });
}

/*----------------------STARTING PAGE ----------------------------*/
function mainPage() {
  $(".main-image img").on("click", function() {
    $(".main-games").addClass("hidden");
  });

  $(".1 img").on("click", function() {
    gameDetails("red-dead-redemption-2");
  });

  $(".2 img").on("click", function() {
    gameDetails("shadow-of-the-tomb-raider");
  });

  $(".3 img").on("click", function() {
    gameDetails("shadows-die-twice");
  });

  $(".4 img").on("click", function() {
    gameDetails("forza-horizon-4");
  });
  $(".5 img").on("click", function() {
    gameDetails("fortnite");
  });
  $(".6 img").on("click", function() {
    gameDetails("assassins-creed-odyssey");
  });
}

/*----------------NAVIGATING THROUGH THE APP ---------------------*/
function docNavigation() {
  $("#myBtn").on("click", function(e) {
    e.preventDefault();

    $("body, html").animate(
      {
        scrollTop: $("header").offset().top
      },
      1000
    );
  });
  $(".doc-nav").on("click", function(e) {
    e.preventDefault();

    $("body, html").animate(
      {
        scrollTop: $($(this).attr("href")).offset().top
      },
      1000
    );
  });

  $(".gohome").on("click", function(e) {
    e.preventDefault();

    $(".gameInfo").empty();
    $("#searchResults").empty();
    $(".main-games").removeClass("hidden");
  });

  $("h1").on("click", function(e) {
    e.preventDefault();
    $(".gameInfo").empty();
    $("#searchResults").empty();
    $(".main-games").removeClass("hidden");
  });
}

/*------FUNCTIONS-------*/

$(function() {
  console.log("App loaded! Waiting for submit!");
  mainPage();
  searchSubmit();
  hamburgerMenu();
  docNavigation();
});
