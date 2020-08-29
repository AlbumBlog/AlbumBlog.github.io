var body = document.getElementsByTagName("body")[0];

body.onload = (function() {
  aComments = document.querySelectorAll("a#disqus_comments");
  for(i=0; i<aComments.length; i++) {
    setCommentCounterText(aComments[i]);
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
  disqusSpan = a.childNodes[1];
  count = disqusSpan.innerHTML;
  href = a.getAttribute("href");
  text = "";
  if (count && href.indexOf("/en/") == -1) {
    switch(count) {
      case "0":
        text = "Ancora nessun commento, sigh"; break; 
      case "1":
        text = "Wow, qualcuno ha commentato!"; break;
      default:
        text = `Addirittura ${count} commenti!`;
    }
  } else if (count) {
    switch(count) {
      case "0":
        text = "No comment yet, sigh"; break; 
      case "1":
        text = "Wow, there is a comment here!"; break;
      default:
        text = `Even ${count} comments!`;
    }
  } else {
    text = disqusSpan.getAttribute("data-value");
  }
  a.textContent = text;
}
