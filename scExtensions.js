var script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.9/ace.js";
document.body.appendChild(script);

var nodeToCheck = null,
    currentInterval = null;


scContentEditor.prototype.onTreeNodeClick = function (sender, id) {
    sender = $(sender);
    setTimeout(function () {
        scForm.disableRequests = true;
        if (navigator.userAgent.indexOf('Trident') > 0) {
            var focusKeeper = top.document.getElementById('scIEFocusKeeper');
            if (focusKeeper) focusKeeper.focus();
        }
        scForm.postRequest("", "", "", "LoadItem(\"" + id + "\")");
        $(sender.id).focus();
    }, 1);
    console.log(sender);
    return false;
}