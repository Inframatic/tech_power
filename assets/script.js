google.load("feeds", "1");
var numOfFeeds = 30;
var hacker = true;
var previousPullHacker = null;
var previousPullReddit = null;
var isNewFeed= function(entries, source){
  if (entries ===  previousPullHacker || entries === previousPullReddit){
    return false;
  }
  if (source == "#hacker") {
    previousPullHacker = entries;
  }
  else{
    previousPullReddit = entries
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
        if (isNewFeed(result.feed.entries, divId)){
          var container = $(divId + " ol");
          container.empty();
          for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            if (site.container == "#hacker"){
              var aside = entry.content;
            }
            else if (site.container == "#reddit") {
              var hrefPattern = /href="([^"]+)"/g;
              var commentsPattern = /\[(\d+ comments)\]/;
              var authorPattern = /(by .+<\/a>) <br/
              var text = entry.content;
              var hrefs = [];
              while(hreftmp = hrefPattern.exec(text)) {
                hrefs.push(hreftmp);
              }
              var commentsText = commentsPattern.exec(text);
              if (!commentsText){
                commentsText = []
                commentsText[0] = "[0 comments]"
              }
              var commentsLink = "<a target='_blank' href='" + hrefs[2][1] + "'>" +  commentsText[0] + "</a>"
              var authorLink = authorPattern.exec(text)[1];
              var sourceLink = hrefs[1][1];
              var aside =commentsLink  + " " + authorLink +  $.timeago(new Date(entry.publishedDate)) ;
              entry.link = sourceLink ;
            }
            else {
               var aside = $.timeago(new Date(entry.publishedDate))
            }
            var header = "<a target='_blank' href='" + entry.link + "'>" + entry.title + "</a>";
            var li =  "<li>" +  header + "<aside>" + aside + "</aside>" + "</li>" ;
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
  var delay = minute*10;
  google.setOnLoadCallback(updateFeed);
  setInterval(updateFeed, delay);
})
