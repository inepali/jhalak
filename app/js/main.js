/*
 * Jhalak launcher for Samsung TVs (Tizen).
 *
 * Runs once at app start, then hands the whole window to the display site:
 *   1. Turns the TV screensaver off so the menu stays on screen.
 *   2. Checks the site is reachable (a cold start with no network would
 *      otherwise land on the TV's own error page with no way back).
 *   3. Navigates to /cast. The site pairs, caches media and plays its own
 *      background music from there.
 *
 * Written in ES5 so it runs on older Tizen TVs (2.3 / 2015 models).
 */
(function () {
    'use strict';

    var DISPLAY_URL = 'https://jhalak.app/cast';
    var PING_URL = 'https://jhalak.app/favicon.ico';
    var PING_TIMEOUT_MS = 8000;
    var RETRY_MIN_MS = 5000;
    var RETRY_MAX_MS = 60000;
    var KEY_RETURN = 10009;

    var statusEl = document.getElementById('status');
    var hintEl = document.getElementById('hint');
    var retryDelay = RETRY_MIN_MS;
    var retryTimer = null;
    var checking = false;

    function log(msg) {
        if (window.console) console.log('[Jhalak] ' + msg);
    }

    function keepScreenOn() {
        try {
            if (window.webapis && webapis.appcommon) {
                webapis.appcommon.setScreenSaver(
                    webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_OFF,
                    function () { log('screensaver off'); },
                    function (e) { log('screensaver error: ' + (e && e.message)); }
                );
            }
        } catch (e) {
            log('screensaver unavailable: ' + e.message);
        }
    }

    function exitApp() {
        try {
            if (window.tizen && tizen.application) {
                tizen.application.getCurrentApplication().exit();
            }
        } catch (e) {
            log('exit failed: ' + e.message);
        }
    }

    function showOffline() {
        statusEl.textContent = 'Can’t reach Jhalak';
        hintEl.hidden = false;
    }

    function showLoading() {
        statusEl.textContent = 'Loading menu…';
        hintEl.hidden = true;
    }

    /* Loads a small image from the site: works cross-origin without CORS,
       and on every Tizen version (no fetch on older TVs). */
    function ping(onOk, onFail) {
        var img = new Image();
        var done = false;
        var timer = setTimeout(function () { finish(false); }, PING_TIMEOUT_MS);

        function finish(ok) {
            if (done) return;
            done = true;
            clearTimeout(timer);
            img.onload = img.onerror = null;
            if (ok) onOk(); else onFail();
        }

        img.onload = function () { finish(true); };
        img.onerror = function () { finish(false); };
        img.src = PING_URL + '?t=' + new Date().getTime();
    }

    function scheduleRetry() {
        clearTimeout(retryTimer);
        log('site unreachable, retrying in ' + retryDelay / 1000 + 's');
        retryTimer = setTimeout(tryLaunch, retryDelay);
        retryDelay = Math.min(retryDelay * 2, RETRY_MAX_MS);
    }

    function tryLaunch() {
        if (checking) return;
        checking = true;
        clearTimeout(retryTimer);
        ping(function () {
            log('opening ' + DISPLAY_URL);
            // replace(): the launcher isn't kept in history, so Back on the
            // menu doesn't return to this screen.
            window.location.replace(DISPLAY_URL);
        }, function () {
            checking = false;
            showOffline();
            scheduleRetry();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === KEY_RETURN) exitApp();
    });

    window.addEventListener('online', function () {
        retryDelay = RETRY_MIN_MS;
        showLoading();
        tryLaunch();
    });

    keepScreenOn();
    tryLaunch();
}());
