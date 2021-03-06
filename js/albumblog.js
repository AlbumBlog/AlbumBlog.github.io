// get <body> of page
var body = document.getElementsByTagName("body")[0];
var badgeButtonClicked = false;
var randomPostsLoaded = false;
var randomPosts = []; // our URL array

// define the function to run after loading
body.onload = (function() {
  // get all <a> tags with id="disqus_comments"
  aComments = document.querySelectorAll("a#disqus_comments");
  // and pass them to function for setting their text
  aComments.forEach(setCommentCounterText);
  // set buttons and hide script annotations in theater posts
  if (window.location.href.indexOf("/sipario/20") != -1) {
    setScriptButtons();
    setScriptPage();
  }
});

// my magic functions

function sendMail(a) {
  aValue = a.getAttribute("data-value");
  a.setAttribute("href", "mailto:"+atob(aValue));
}

function isLocal() {
  if (["localhost", "127.0.0.1"].indexOf(window.location.hostname) != -1) {
    return true;
  } else {
    return false;
  }
}

function setCommentCounterText(a) {
  // get hidden Disqus <span>
  disqusSpan = a.childNodes[0];
  // get its text, hopefully set by Disqus in the meantime
  count = disqusSpan.textContent;
  // if something went wrong, return (leaving the <a> i18n default label)
  if (count == "") {return;}
  // get real URL of comment counter link
  href = a.getAttribute("href");
  // check for specific non-default language(s)
  if (href.indexOf("/en/") != -1) {
    // and set the new label accordingly
    switch(count) {
      case "0":
        text = "No comment yet, sigh"; break; 
      case "1":
        text = "Wow, there is a comment here!"; break;
      default:
        text = `Even ${count} comments!`;
    }
  } else { // default language (Italian, for me)
    switch(count) {
      case "0":
        text = "Ancora nessun commento, sigh"; break; 
      case "1":
        text = "Wow, qualcuno ha commentato!"; break;
      default:
        text = `Addirittura ${count} commenti!`;
    }
  }
  // set new <a> label
  a.textContent = text;
}

function discourageText() {
  button = document.getElementById("badge-button");
  panel = document.getElementById("badge-panel");
  if (badgeButtonClicked) {
    button.style.visibility = "hidden";
    panel.style.backgroundColor = "black";
    panel.style.color = "black";
    panel.textContent = "";
  } else {
    newText = panel.getAttribute("data-value");
    panel.textContent = newText;
    panel.style.backgroundColor = "white";
    panel.style.color = "green";
    panel.setAttribute("role", "alert");
    badgeButtonClicked = true;
  }
}

function hideElement(element) {
	element.style.display = "none";
}

function showElement(element) {
	element.style.display = "initial";
}

function setScriptButtons() {
  buttonP = document.querySelectorAll("p.show-hide-container");
  buttonP.forEach(function(p) {
    p.innerHTML = '<button class="show-hide-button" label1="Mostra annotazioni" label2="Nascondi annotazioni" status="visible" onclick="setScriptPage()">Nascondi annotazioni</button>';
  });
}

function setScriptPage() {
  scriptButtons = document.querySelectorAll("button.show-hide-button");
  scriptAnnotations = document.querySelectorAll("strong.theater-script");
  status = scriptButtons[0].getAttribute("status");
  if (status == "visible") {
    scriptButtons.forEach(function(button) {
      button.setAttribute("status", "hidden");
      button.textContent = button.getAttribute("label1");
    });
    scriptAnnotations.forEach(hideElement);
  } else {
    scriptButtons.forEach(function(button) {
      button.setAttribute("status", "visible");
      button.textContent = button.getAttribute("label2");
    });
    scriptAnnotations.forEach(showElement);
  }
}

// fetch some json without jquery
function loadJSON(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
      }
    }
  };
  httpRequest.open("GET", path);
  httpRequest.send();
}

function pushRandomPosts(data) {
  data.forEach(item => randomPosts.push(item));
}

function randomPost() {
  if (!randomPostsLoaded) {
    loadJSON("/en/index.json", function(posts) {
      var permalinks = []
      posts.forEach(post => permalinks.push(post.permalink));
    });
  }
//  choice = randomPosts.pop(0); //randomPosts.length*Math.random()|0];
  alert(randomPosts.length);
}
