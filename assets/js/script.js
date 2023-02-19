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
        savedSearches = JSON.parse(previousSavedSearches);
    }

    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    $("#search-input").val("");

};

$("#search-input").on("submit", function() {
    event.preventDefault();
    
    var cityName = $("#search-input").val();

    searchHistoryList(cityName);

});

