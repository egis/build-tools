// loads relative to the current page URL
System.config({
    "defaultJSExtensions": true
});
var d0 = new Date().getTime();
Promise.all([
    System.import('../dist/index')
]).then(function(values) {
    console.log('loaded in', new Date().getTime() - d0)
});
