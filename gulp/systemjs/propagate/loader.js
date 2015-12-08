var EgisUILoadPromise = (function () {
    "use strict";

    System.config({
        "defaultJSExtensions": true
    });
    var d0 = new Date().getTime();
    var p = System.import('http://localhost:8101/dist/index');
    p.then(function() {
        console.log('loaded in', new Date().getTime() - d0);
    });
    return p;
})();
