var apiKey = "7871e6fa09446cc72f87bdf9ee21b29a";
var savedSearches = [];

var searchHistory = function(cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    var searchPreviousEntries = ("<p>");
    searchPreviousEntries.addClass("previous-search");
    searchPreviousEntries.text(cityName);

    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("previous-search-container");

    searchEntryContainer.append(searchPreviousEntries);

    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainer);

    if (savedSearches.length > 0){
        var previousSavedSearches = localStorage.getItem("savedSearches");
        console.log(previousSavedSearches);
        savedSearches = JSON.parse(previousSavedSearches);
        console.log(savedSearches);
    }

    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    $("#search-input").val("");

};

var currentWeather = function(cityName) {
    console.log(cityName);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var cityLongitude = response.coord.lon;
        var cityLatitude = response.coord.lat;
    
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
        
        .then(function(response) {
            return response.json();
        })

        .then(function(response){
            searchHistoryList(cityName);


            .catch(function(err) {
                $("#search-input").val("");
    
                alert("City entered not valid. Please, try searching for a valid city.");
            };
            )
        });
        });
    };
    















$("#search-input").on("submit", function() {
    event.preventDefault();
    
    var cityName = $("#search-input").val();

    searchHistoryList(cityName);

});

