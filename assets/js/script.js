// Global variables
var apiKey = "7871e6fa09446cc72f87bdf9ee21b29a";
var savedSearches = [];

// Creates a list of the previously searched cities
var searchHistory = function (cityName) {
  $('.past-search:contains("' + cityName + '")').remove();

  var searchPreviousEntries = $("<p>");
  searchPreviousEntries.addClass("previous-search");
  searchPreviousEntries.text(cityName);

  var searchEntryContainer = $("<div>");
  searchEntryContainer.addClass("previous-search-container");

  searchEntryContainer.append(searchPreviousEntries);

  var searchHistoryContainerEl = $("#search-history-container");
  searchHistoryContainerEl.append(searchEntryContainer);

  if (savedSearches.length > 0) {
    var previousSavedSearches = localStorage.getItem("savedSearches");
    console.log(previousSavedSearches);
    savedSearches = JSON.parse(previousSavedSearches);
    console.log(savedSearches);
  }

  // Saves a city to the saved searches
  savedSearches.push(cityName);
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

  // Clears search input
  $("#search-input").val("");
};

// Loads search history into the search history container
var loadSearchHistory = function () {
  var savedSearchHistory = localStorage.getItem("savedSearches");

  if (!savedSearchHistory) {
    return false;
  }
  savedSearchHistory = JSON.parse(savedSearchHistory);

  for (var i = 0; i < savedSearchHistory.length; i++) {
    searchHistory(savedSearchHistory[i]);
  }
};

// Uses the Open Weather API to get data
var currentWeatherArea = function (cityName) {
  console.log(cityName);
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      var cityLongitude = response.coord.lon;
      var cityLatitude = response.coord.lat;

      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
      )
        .then(function (response) {
          return response.json();
        })

        .then(function (response) {
          searchHistory(cityName);

          var currentWeatherContainer = $("#current-weather-container");
          currentWeatherContainer.addClass("current-weather-container");

          // Adds city name, date, weather icon to the current weather section.
          var currentTitle = $("#current-title");
          var currentDay = moment().format("M/D/YYYY");
          currentTitle.text(`${cityName} (${currentDay})`);
          var currentIcon = $("#current-weather-icon");
          currentIcon.addClass("current-weather-icon");
          var currentIconCode = response.current.weather[0].icon;
          currentIcon.attr(
            "src",
            `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`
          );

          // Add temp to the page
          var currentTemperature = $("#current-temperature");
          currentTemperature.text(
            "Temperature: " + response.current.temp + " \u00B0F"
          );
          // Adds humidity to the page
          var currentHumidity = $("#current-humidity");
          currentHumidity.text("Humidity: " + response.current.humidity + "%");
          // Adds current wind speed
          var currentWindSpeed = $("#current-wind-speed");
          currentWindSpeed.text(
            "Wind Speed: " + response.current.wind_speed + " MPH"
          );
          // Adds UV index
          var currentUvIndex = $("#current-uv-index");
          currentUvIndex.text("UV Index: ");
          var currentNumber = $("#current-number");
          currentNumber.text(response.current.uvi);
          // Adds the background color based on UV index
          if (response.current.uvi <= 2) {
            currentNumber.addClass("favorable");
          } else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
            currentNumber.addClass("moderate");
          } else {
            currentNumber.addClass("severe");
          }
        });
    })
    .catch(function (err) {
      $("#search-input").val("");
      alert("City entered not valid. Please, try searching for a valid city.");
    });
};

// Uses the Open Weather API to get data for five day forecast
var fiveDayForecastSection = function (cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      var cityLon = response.coord.lon;
      var cityLat = response.coord.lat;

      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          console.log(response);

          // Adds 5 day forecast title
          var futureForecastTitle = $("#future-forecast-title");
          futureForecastTitle.text("5-Day Forecast:");

          // Gets data from response and sets up each day of 5 day forecast
          for (var i = 1; i <= 5; i++) {
            var futureCard = $(".future-card");
            futureCard.addClass("future-card-details");

            // Adds date to 5 day forecast
            var futureDate = $("#future-date-" + i);
            date = moment().add(i, "d").format("M/D/YYYY");
            futureDate.text(date);

            // Adds icon to 5 day forecast
            var futureIcon = $("#future-icon-" + i);
            futureIcon.addClass("future-icon");
            var futureIconCode = response.daily[i].weather[0].icon;
            futureIcon.attr(
              "src",
              `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`
            );

            // Adds temp to 5 day forecast
            var futureTemp = $("#future-temp-" + i);
            futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

            // Adds humidity to 5 day forecast
            var futureHumidity = $("#future-humidity-" + i);
            futureHumidity.text(
              "Humidity: " + response.daily[i].humidity + "%"
            );
          }
        });
    });
};

// Called when the search form is submitted
$("#search-form").on("submit", function () {
  event.preventDefault();

  // Gets the name of city searched
  var cityName = $("#search-input").val();

  if (cityName === "" || cityName == null) {
    alert("Please enter name of city.");
    event.preventDefault();
  } else {
    currentWeatherArea(cityName);
    fiveDayForecastSection(cityName);
  }
});

// Called when a search history entry is clicked
$("#search-history-container").on("click", "p", function () {
  var previousCityName = $(this).text();
  currentWeatherArea(previousCityName);
  fiveDayForecastSection(previousCityName);

  var previousCityClicked = $(this);
  previousCityClicked.remove();
});

loadSearchHistory();
