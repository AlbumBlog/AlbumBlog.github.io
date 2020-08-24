// my magic functions

function sendMail() {
  aMail = document.getElementById("mailMe");
  aValue = aMail.getAttribute("value");
  aMail.setAttribute("href", "mailto:"+atob(aValue));
}
