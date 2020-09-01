var body = document.getElementsByTagName("body")[0];

body.onload = (function() {
  aComments = document.querySelectorAll("a#disqus_comments");
  for (i=0; i<aComments.length; i++) {
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
  disqusSpan = a.childNodes[0];
  count = disqusSpan.textContent;
  if (count == "") {return;}
  href = a.getAttribute("href");
  if (href.indexOf("/en/") == -1) {
    switch(count) {
      case "0":
        text = "Ancora nessun commento, sigh"; break; 
      case "1":
        text = "Wow, qualcuno ha commentato!"; break;
      default:
        text = `Addirittura ${count} commenti!`;
    }
  } else {
    switch(count) {
      case "0":
        text = "No comment yet, sigh"; break; 
      case "1":
        text = "Wow, there is a comment here!"; break;
      default:
        text = `Even ${count} comments!`;
    }
  }
  a.textContent = text;
}
