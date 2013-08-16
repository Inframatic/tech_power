google.load("feeds", "1");
var numOfFeeds = 30;
var hacker = true;
var previousPullHacker = null;
var previousPullReddit = null;
var isNewFeed= function(topEntry, source){
  if (topEntry ===  previousPullHacker || topEntry === previousPullReddit){
    return false;
  }
  if (source == "#hacker") {
    previousPullHacker = topEntry;
  }
  else{
    previousPullReddit = topEntry
  }
  return true;
}

var sites = [
  { 
    url: "http://www.reddit.com/r/technology/.rss",
    container: "#reddit",
    limit: 25
  },
  {
    url: "https://news.ycombinator.com/rss",
    container: "#hacker",
    limit: 25
  },
  { 
    url: "http://feeds.feedburner.com/BothSidesOfTheTable?format=xml",
    container: "#blog1",
    limit: 5
  },
  { 
    url: "http://www.cep.ca/cep_feed",
    container: "#blog2",
    limit: 5
  }
];
var containerId;
var updateFeed = function() {
  $.each(sites, function(j,site) {
    console.log("update for: " + site.url);
    var feed = new google.feeds.Feed(site.url);
    feed.setNumEntries(site.limit);
    feed.load(function(result) {
      if (!result.error) {
        var divId = site.container;
        if (isNewFeed(result.feed.entries[0].title, divId)){
          var container = $(divId + " ul");
          container.empty();
          for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            if (site.container == "#hacker"){
              var timeAgo = "";
            }
            else {
              var timeAgo = $.timeago(new Date(entry.publishedDate));
            }
            var header = "<a target='_blank' href='" + entry.link + "'>" + (i+1) + ": " + entry.title + "</a>";
            var li =  "<li>" +  header + "</li>" + " \n<span>" + timeAgo + "</span>";
            $(container).append(li);
          }
        }
      }
      else {
        alert("something went wrong. Refresh the page please.");
      }
    });
  });
}
$(document).ready(function(){
  var minute = 6000
  var delay = minute*5;
  google.setOnLoadCallback(updateFeed);
  setInterval(updateFeed, delay);
})
