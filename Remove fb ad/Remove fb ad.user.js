// ==UserScript==
// @name         Remove fb ad
// @version      1
// @description
// @author       Ari Su
// @match        https://www.facebook.com/
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  setInterval(function () {
    $('[data-pagelet="RightRail"]').remove();
    var donate = $.grep(
      document.querySelectorAll("b.b6zbclly"),
      function (ele, idx) {
        return ele.innerText === "贊助";
      }
    );
    donate.push(
      $.grep(document.querySelectorAll("span.d2edcug0"), function (ele, idx) {
        return ele.innerText === "為你推薦";
      })
    );

    $.each(donate, function (idx, ele) {
      var parent = $(ele).parents("[data-pagelet^=FeedUnit]");
      if (parent.length !== 0) {
        parent[0].remove();
        return;
      }
    });
  }, 100);
})();
