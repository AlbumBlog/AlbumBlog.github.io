// my magic functions

function sendMail() {
  aMail = document.getElementById("mailMe");
  aValue = aMail.getAttribute("value");
  aMail.setAttribute("href", "mailto:"+atob(aValue));
}

function isLocal() {
  if (["localhost", "127.0.0.1"].indexOf(window.location.hostname) != -1) {
    return true;
  } else {
    return false;
  }
}
