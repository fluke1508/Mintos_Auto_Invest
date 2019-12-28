// ==UserScript==
// @name         Mintos Auto
// @namespace    https://www.mintos.com/
// @version      0.2
// @description  Apply Mintos Auto Invest setting of currently active field to all loan originators
// @author       fluke
// @match        *://www.mintos.com/en/auto-invest/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  var flt_id_suf = "-diversityRate";
  var chg_event = new Event("change");
  var inp_event = new Event("input");

  document.addEventListener("keydown",
    function (zEvent) {
      if (zEvent.ctrlKey && zEvent.shiftKey && (zEvent.code === "KeyY" || zEvent.code === "KeyZ")) {
        var act = document.activeElement;
        var val = act.value;
        var apply_flt_id_suf = (act.id.substring(act.id.length-flt_id_suf.length) === flt_id_suf);
        var elements = document.getElementsByClassName(act.className);
        if ( (typeof(act.id) !== "string") ||
             (act.id === "")
           ){
          alert("Active element has no ID");
        }
        else if (typeof(val) == "undefined") {
          alert("Active element '"+act.id+"' has no value");
        }
        else if (elements.length <= 1) {
          alert("Found no matches for active element '"+act.id+"', class '"+act.className+"'");
        }
        else {
          for (var i=0; i<elements.length; i=i+1){
            if ( (typeof(elements[i].id) === "string") &&
                 ( (!apply_flt_id_suf) ||
                   (elements[i].id.substring(elements[i].id.length-flt_id_suf.length) === flt_id_suf)
                 )
               ){
                elements[i].composing = !0;
                elements[i].value = val;
                elements[i].dispatchEvent(inp_event);
                elements[i].dispatchEvent(chg_event);
            }
          }
        }
      }
    }
  );
})();