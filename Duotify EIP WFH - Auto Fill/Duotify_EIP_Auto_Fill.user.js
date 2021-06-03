// ==UserScript==
// @name            Duotify_EIP_Auto_Fill
// @version         1.414
// @description     自動勾
// @author          Ari Su
// @match           https://duotify-eip.azurewebsites.net/staff/work-from-home/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @require         http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function () {
  "use strict";

  let allMember = [];
  const timer = setInterval(chkSPA, 500);

  function chkSPA() {
    if (document.location.pathname !== "/staff/work-from-home/create") return;
    allMember = $(".mat-checkbox-layout");
    if (allMember.length <= 1) return;
    clearInterval(timer);

    injectionBtn();

    selectMember();

    addClickEvent();

    fillTemplate();
  }

  function injectionBtn() {
    const saveBtn = `<button id="saveTemplateBtn" class="mat-focus-indicator mat-raised-button mat-button-base mat-primary" style="margin-right:20px">
  記憶範本
</button>`;
    const clearBtn = `<button id="clearTemplateBtn" class="mat-focus-indicator mat-raised-button mat-button-base mat-primary">
  清除範本
</button>`;
    $(".ng-untouched mat-toolbar").prepend(clearBtn);
    $(".ng-untouched mat-toolbar").prepend(saveBtn);

    $("#saveTemplateBtn").on("click", function () {
      GM_setTemplate($(".mat-form-field-infix textarea").val());
    });

    $("#clearTemplateBtn").on("click", function () {
      GM_clearTemplate();
    });
  }

  function selectMember() {
    let member = GM_readMember();
    $.each(allMember, function (idx, ele) {
      if (!member.includes($(ele).find(".mat-checkbox-label")[0].innerText))
        return;
      $(ele).click();
    });
  }

  function addClickEvent() {
    $.each(allMember, function (idx, ele) {
      $(ele).on("click", function () {
        let $this = $(this);
        let member = GM_readMember();
        const name = $this.find(".mat-checkbox-label")[0].innerText;
        const checked = !$this.find("input")[0].checked;

        if (checked) {
          member.push(name);
        } else {
          const index = member.indexOf(name);
          if (index !== -1) member.splice(index, 1);
        }
        GM_setMember(member);
        console.log(GM_readMember());
      });
    });
  }

  function fillTemplate() {
    const a = /今天\(\d{4}\/\d{2}\/\d{2}\)申請在家上班。/;
    const b =
      /工作時段為\s*\S{1,4}:\S{1,4}\s*~\s*\S{1,4}:\S{1,4}\s*共計\s*\S{1,4}\s*小時/;
    let template = GM_readTemplate();
    const date = $("#mat-input-0").val();

    let now = new Date(),
      work8hour = new Date();
    work8hour.setHours(now.getHours() + 9);

    let sHour = now.getHours(),
      eHour = work8hour.getHours(),
      minute = (Math.floor(now.getMinutes() / 15) + 1) * 15;

    if (minute === 60) {
      sHour++;
      eHour++;
      minute = 0;
    }

    template = template.replace(a, `今天(${date})申請在家上班。`);
    template = template.replace(
      b,
      `工作時段為 ${sHour}:${minute} ~ ${eHour}:${minute} 共計 8 小時`
    );
    $(".mat-form-field-infix textarea").val(template);

    $("#mat-input-1").val(8);

    const dateDDL = $("mat-select");
    $.each(dateDDL, function (idx, ele) {
      $(ele).click();
      const allMatOptions = $("mat-option");
      //因為下拉選單點開後options會一直累積，所以要加減
      let optionTarget = allMatOptions.length;
      switch (idx) {
        case 0:
          optionTarget = optionTarget - 15 + sHour - 8;
          break;
        case 2:
          optionTarget = optionTarget - 15 + eHour - 8;
          break;
        case 1:
        case 3:
          optionTarget = optionTarget - 4 + minute / 15;
          break;
        default:
          break;
      }
      allMatOptions[optionTarget].click();
    });
  }

  function GM_readMember() {
    return GM_getValue("member") || [];
  }

  function GM_setMember(member) {
    GM_setValue("member", member);
  }

  function GM_readTemplate() {
    return GM_getValue("template") || "";
  }

  function GM_setTemplate(template) {
    GM_setValue("template", template);
  }

  function GM_clearTemplate() {
    GM_deleteValue("template");
    $(".mat-form-field-infix textarea").val("");
  }
})();
