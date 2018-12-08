if (typeof scContentEditor !== 'undefined') {
    console.log(typeof jQuery === undefined);
    var script = document.createElement("script");
    script.className = 'sitecore-enhancer';
    script.src = "https://cdn.jsdelivr.net/gh/HoyerHub/sitecore/scExtensions.js";
    document.body.appendChild(script);
}