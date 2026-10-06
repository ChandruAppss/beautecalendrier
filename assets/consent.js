/* =========================================================
   BeautéCalendrier — cookie consent + Meta Pixel
   The pixel is only loaded after the visitor clicks "Accepter".
   The choice is stored for 6 months (CNIL recommendation).
   ========================================================= */
(function () {
  "use strict";

  var META_PIXEL_ID = "1736135640944955";
  var STORAGE_KEY = "bc_consent";
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182; // ~6 months
  var PRIVACY_URL = "confidentialite.html";

  function readChoice() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && (saved.v === "granted" || saved.v === "denied") && Date.now() - saved.t < MAX_AGE) return saved.v;
    } catch (e) { /* storage unavailable: ask again */ }
    return null;
  }

  function saveChoice(value) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: value, t: Date.now() })); } catch (e) { /* ignore */ }
  }

  /* ---------- Meta Pixel (official snippet, loaded on consent only) ---------- */
  function loadMetaPixel() {
    if (window.fbq) { window.fbq("consent", "grant"); return; }
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function revokeMetaPixel() {
    if (window.fbq) window.fbq("consent", "revoke");
  }

  /* ---------- banner ---------- */
  var banner;

  function buildBanner() {
    banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-labelledby", "cookie-title");
    banner.setAttribute("aria-describedby", "cookie-text");
    banner.innerHTML =
      '<div class="cookie-inner">' +
        '<div class="cookie-copy">' +
          '<p class="cookie-title" id="cookie-title">Votre vie privée</p>' +
          '<p class="cookie-text" id="cookie-text">Avec votre accord, nous utilisons le pixel Meta (Facebook) pour mesurer l’audience du site et l’efficacité de nos publicités. ' +
          'Vous pouvez accepter ou refuser, et modifier votre choix à tout moment via « Gérer les cookies » en bas de page. ' +
          '<a href="' + PRIVACY_URL + '">En savoir plus</a></p>' +
        '</div>' +
        '<div class="cookie-actions">' +
          '<button type="button" class="cookie-btn" data-consent="denied">Refuser</button>' +
          '<button type="button" class="cookie-btn" data-consent="granted">Accepter</button>' +
        '</div>' +
      '</div>';
    banner.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      var value = btn.getAttribute("data-consent");
      saveChoice(value);
      if (value === "granted") loadMetaPixel(); else revokeMetaPixel();
      hideBanner();
    });
    document.body.appendChild(banner);
  }

  function showBanner() {
    if (!banner) buildBanner();
    banner.hidden = false;
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
  }

  function init() {
    var choice = readChoice();
    if (choice === "granted") loadMetaPixel();
    else if (choice === null) showBanner();

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-cookie-settings]")) { e.preventDefault(); showBanner(); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
