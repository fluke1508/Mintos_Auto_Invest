// ==UserScript==
// @name         Mintos Auto
// @namespace    https://www.mintos.com/
// @version      0.4
// @description  Apply Mintos Auto Invest setting of currently active field to all loan originators
// @author       fluke
// @match        *://www.mintos.com/*/auto-invest/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  var flt_id_suf = "-diversityRate";
  var chg_event = new Event("change");
  var inp_event = new Event("input");

  document.addEventListener("keydown",
    function (event) {
      if (event.ctrlKey && event.shiftKey && (event.code === "KeyY" || event.code === "KeyZ")) {
        var i;
        var elements;
        var act = document.activeElement;

        // checkboxes
        var sel;
        elements = document.querySelectorAll( ":hover" );
        for (i=elements.length-1; i>=0; i=i-1){
          if ( (typeof(elements[i].type) === "string") &&
               (elements[i].type.toLowerCase() === "checkbox")
             ){
            sel = elements[i];
            break;
          }
        }
        if (typeof(sel) !== "undefined") {
          if (act.tagName.toLowerCase() === "input") {
            alert("Too many suitable fields: Active element is INPUT and mouse over checkbox");
          }
          else {
            var id_re_esc = sel.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var id_re = new RegExp(id_re_esc.replace(new RegExp("(.+\\[)([0-9]+)(\\\\].*)"),
                                                     "$1([0-9]+)$3"
                                                    ));
            elements = document.getElementsByTagName("input");
            for (i=0; i<elements.length; i=i+1){
              if ( (elements[i].type.toLowerCase() === "checkbox") &&
                  (id_re.test(elements[i].id))
                 ){
                elements[i].checked = sel.checked;
                elements[i].dispatchEvent(inp_event);
                elements[i].dispatchEvent(chg_event);
              }
            }
          }
          return;
        }

        // text and date fields
        var val = act.value;
        var apply_flt_id_suf = (act.id.substring(act.id.length-flt_id_suf.length) === flt_id_suf);
        elements = document.getElementsByClassName(act.className);
        if ( (typeof(act.id) !== "string") ||
             (act.id === "")
           ){
          alert("No suitable field: Active element has no ID");
        }
        else if (typeof(val) === "undefined") {
          alert("No suitable field: Active element '"+act.id+"' has no value");
        }
        else if (elements.length <= 1) {
          alert("No suitable field: Found no matches for active element '"+act.id+"', class '"+act.className+"'");
        }
        else {
          for (i=0; i<elements.length; i=i+1){
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
    },
    false
  );
})();