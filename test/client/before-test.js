(function () {
    // NOTE: Prohibit Hammerhead from processing testing environment resources.
    // There are only testing environment resources on the page when this script is being executed. So, we can add
    // the hammerhead class to all script and link elements on the page.
    $('script').addClass('script-hammerhead-shadow-ui');
    $('link').addClass('ui-stylesheet-hammerhead-shadow-ui');

    var INTERNAL_PROPS = Hammerhead.get('../processing/dom/internal-properties');
    var originLocation = Hammerhead.get('./utils/origin-location');
    var jsProcessor    = Hammerhead.jsProcessor;

    originLocation.forceLocation('http://localhost/sessionId/https://example.com');

    window.initIframeTestHandler = function (e) {
        if (e.iframe.id.indexOf('test') !== -1) {
            e.iframe.contentWindow.eval.call(e.iframe.contentWindow, [
                'Hammerhead.start({',
                '    referer : "http://localhost/sessionId/https://example.com",',
                '    serviceMsgUrl : "/service-msg/100",',
                '    sessionId : "sessionId"',
                '});'
            ].join(''));
        }
    };

    Hammerhead.start({ sessionId: 'sessionId' });

    window.overrideDomMeth = window[INTERNAL_PROPS.overrideDomMethodName];

    window[INTERNAL_PROPS.overrideDomMethodName] = function (el) {
        if (el)
            window.overrideDomMeth(el);
    };

    window.processScript = window[jsProcessor.PROCESS_SCRIPT_METH_NAME];
    window.getProperty   = window[jsProcessor.GET_PROPERTY_METH_NAME];
    window.setProperty   = window[jsProcessor.SET_PROPERTY_METH_NAME];
    window.callMethod    = window[jsProcessor.CALL_METHOD_METH_NAME];
    window.getLocation   = window[jsProcessor.GET_LOCATION_METH_NAME];

    var globals = window.QUnitGlobals;

    window.getCrossDomainPageUrl = function (filePath) {
        return window.QUnitGlobals.crossDomainHostname + globals.getResourceUrl(filePath);
    };

    QUnit.config.testTimeout = 30000;
})();