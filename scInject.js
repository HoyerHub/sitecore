if (typeof scContentEditor !== 'undefined') {
    console.log(typeof jQuery === undefined);
    var script = document.createElement("script");
    script.className = 'sitecore-enhancer';
    script.src = "https://rawgit.com/HoyerHub/sitecore/master/sitecore.js";
    document.body.appendChild(script);
}