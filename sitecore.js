var script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.9/ace.js";
document.body.appendChild(script);

var nodeToCheck = null,
    currentInterval = null;

jQuery('a.scContentTreeNodeNormal').click(function () {
    if (currentInterval != null) {
        console.log("Clearing old loader");
        clearInterval(waitForLoad);
    }
    nodeToCheck = this;
    currentInterval = setInterval(waitForLoad, 300);
    console.log("Waiting for Node");
});

function waitForLoad() {
    console.log("Still waiting for Node");
    if (!jQuery(nodeToCheck).hasClass('scContentTreeNodeActive')) return;
    onLoad();
}

function onLoad() {
    clearInterval(currentInterval);
    console.log("Node is active");
    jQuery('textarea').each(function () {
        var label = jQuery(this).parent().parent().find(".scEditorFieldLabel");
        if (label.find('.scEditorFieldLabel').length > 0) console.log(label.find('.scEditorFieldLabel').text());
        else console.log(label.text());
    });
}

var hide = function () {
    $('.scMenuPanelItem > table > tbody > tr > td > div > div:nth-child(2)').each(function () {
        var text = $(this).text();
        var num = text.replace(/\D+$/g, "");
        if (num == "0") {
            $(this).parent().parent().parent().parent().parent().parent().hide();
        }
    });
};

(function () {
    'use strict';
    setInterval(function () {
        if ($('div#Languages.scScrollbox').length) {
            if (!$('#Nick').length) {
                $('div#Languages.scScrollbox').parent().prepend('<div style="height: 36px;" class="scMenuPanelItem" id="Nick" onmouseover="javascript:return scForm.rollOver(this,event)" onfocus="javascript:return scForm.rollOver(this,event)" onmouseout="javascript:return scForm.rollOver(this,event)" onblur="javascript:return scForm.rollOver(this,event)"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td valign="top" style="padding: 0px 4px"><img style="margin:0px 4px 0px 4px;" src="/sitecore/images/blank.gif" border="0" alt="" width="32px" height="32px"></td><td width="100%" valign="top"><div style="padding:2px 4px 2px 0px;"><div style="padding:0px 0px 4px 0px;" nowrap="true"><b>Only Show Languages with Versions</b></div><div nowrap="true" style="color:#666666;"></div></div></td></tr></tbody></table></div>');
                $('#Nick').click(function () { hide(); });
            }
        }
    }, 500);
})();

console.log(jQuery('a.scContentTreeNodeNormal').length);
console.log($('a.scContentTreeNodeNormal').length);
console.log('SiteCore Improvements has loaded');

