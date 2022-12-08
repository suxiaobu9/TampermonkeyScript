// ==UserScript==
// @name         twitch auto get bonus
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  twitch auto get bonus
// @author       Ari Su
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  setInterval(function () {
    let btn = document.querySelector(
      "aside section div[class^=ScTransitionBase] button[class^=ScCoreButton][class*=ScCoreButtonSuccess]"
    );

    if (btn) {
      btn.click();
    }
  }, 5000);
})();
