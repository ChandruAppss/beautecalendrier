/* =========================================================
   BeautéCalendrier — cookie consent + Meta Pixel + Google Analytics 4
   Both trackers are only loaded after the visitor clicks "Accepter".
   The choice is stored for 6 months (CNIL recommendation).
   ========================================================= */
(function () {
  "use strict";

  // Meta Pixel IDs: every event (PageView, ProductButtonClick) is sent to all of them.
  var META_PIXEL_IDS = ["1249675337357067"];
  var GA_MEASUREMENT_ID = ""; // GA4 ID, e.g. "G-XXXXXXXXXX" (empty = Google Analytics disabled)
  // Bump the key whenever the list of trackers changes, so everyone is asked again.
  var STORAGE_KEY = GA_MEASUREMENT_ID ? "bc_consent_v2" : "bc_consent";
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
    META_PIXEL_IDS.forEach(function (id) { window.fbq("init", id); });
    window.fbq("track", "PageView");
  }

  function revokeMetaPixel() {
    if (window.fbq) window.fbq("consent", "revoke");
  }

  /* ---------- Google Analytics 4 (gtag.js, loaded on consent only) ---------- */
  function loadGoogleAnalytics() {
    if (!GA_MEASUREMENT_ID) return;
    window["ga-disable-" + GA_MEASUREMENT_ID] = false;
    if (window.gtag) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
  }

  function revokeGoogleAnalytics() {
    if (GA_MEASUREMENT_ID) window["ga-disable-" + GA_MEASUREMENT_ID] = true;
  }

  function grantAll() { loadMetaPixel(); loadGoogleAnalytics(); }
  function revokeAll() { revokeMetaPixel(); revokeGoogleAnalytics(); }

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
          '<p class="cookie-text" id="cookie-text">Avec votre accord, nous utilisons ' +
          (GA_MEASUREMENT_ID ? 'Google Analytics et le pixel Meta (Facebook)' : 'le pixel Meta (Facebook)') +
          ' pour mesurer l’audience du site et l’efficacité de nos publicités. ' +
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
      if (value === "granted") grantAll(); else revokeAll();
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
    if (choice === "granted") grantAll();
    else if (choice === null) showBanner();

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-cookie-settings]")) { e.preventDefault(); showBanner(); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
