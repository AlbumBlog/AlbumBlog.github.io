// original credits to https://gist.github.com/cmod/5410eae147e4318164258742dd053993
var fuse; // holds our search engine
var firstRun = true; // allow us to delay loading json data unless search activated
var list = document.getElementById('searchResults'); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById('searchInput'); // input box for search
var resultsAvailable = false; // Did we get any search results?

// replace original keyboard shortcut mechanism,
// calling loadSearch() when input box has focus
maininput.onfocus = function() {
  if (firstRun) {
    loadSearch(); // loads our json data and builds fuse.js search index
    firstRun = false; // let's never do this again
  }
}

// The main keyboard event listener running the show
document.addEventListener('keydown', function(event) {
  // DOWN (40) arrow
  if (event.keyCode == 40) {
    if (resultsAvailable) {
      event.preventDefault(); // stop window from scrolling
      if (document.activeElement == maininput) { first.focus(); } // if the currently focused element is the main input --> focus the first <li>
      else if ( document.activeElement == last ) { last.focus(); } // if we're at the bottom, stay there
      else { document.activeElement.parentElement.nextSibling.firstElementChild.focus(); } // otherwise select the next search result
    }
  }

  // UP (38) arrow
  if (event.keyCode == 38) {
    if (resultsAvailable) {
      event.preventDefault(); // stop window from scrolling
      if (document.activeElement == maininput) { maininput.focus(); } // If we're in the input box, do nothing
      else if ( document.activeElement == first) { maininput.focus(); } // If we're at the first item, go to input box
      else { document.activeElement.parentElement.previousSibling.firstElementChild.focus(); } // Otherwise, select the search result above the current active one
    }
  }
});


// execute search as each character is typed
maininput.oninput = function(e) { 
  executeSearch(this.value);
}

// fetch some json without jquery
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send(); 
}

// load our search index, only executed once
// on first call of search box
function loadSearch() { 
  fetchJSONFile('/en/index.json', function(data){
    var options = { // fuse.js options; check fuse.js website for details
      isCaseSensitive: false,
      shouldSort: true,
      tokenize: true,
      ignoreLocation: true,
      ignoreFieldNorm: true,
      threshold: 0.4, // for more words, 0.1 is better otherwise
      minMatchCharLength: 2,
      keys: ["lang", "title", "description", "content", "tags", "categories", "section", "permalink"]
    };
    fuse = new Fuse(data, options); // build the index from the json file
  });
}

// using the index we loaded, run 
// a search query (for "term") every time a letter is typed
// in the search box
function executeSearch(term) {
  let results = fuse.search(term);
  let permalinks = results.map(function(e){return e.item.permalink;});
  // results without duplicates
  results = results.filter(function(e, i, a){return i == permalinks.indexOf(e.item.permalink);});
  let searchitems = ''; // our results bucket
  if (results.length === 0) { // no results based on what was typed into the input box
    resultsAvailable = false;
    searchitems = '';
  } else { // build our html 
    for (let item in results.slice(0,3)) {
      searchitems = searchitems+'<li><a href="' + results[item].item.permalink + '" tabindex="0">' + '<span class="title">' + results[item].item.title + ' <em>' + results[item].item.description + '</em></span><br/> (da "<span class="sc">'+ results[item].item.section +'</span>", ' + results[item].item.date + ')</a></li>';
    }
    resultsAvailable = true;
  }
  document.getElementById("searchResults").innerHTML = searchitems;
  if (results.length > 0) {
    first = list.firstChild.firstElementChild; // first result container — used for checking against keyboard up/down location
    last = list.lastChild.firstElementChild; // last result container — used for checking against keyboard up/down location
  }
}
