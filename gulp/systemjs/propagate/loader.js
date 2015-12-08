// loads relative to the current page URL
System.config({
    "defaultJSExtensions": true
});
var d0 = new Date().getTime();
System.import('../dist/index').then(function(m) {
    console.log('loaded in', new Date().getTime() - d0);
    window.bundle.loaded();
});
