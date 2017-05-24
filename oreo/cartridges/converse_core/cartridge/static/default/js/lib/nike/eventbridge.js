/*
 * ========================================================
 * EventBridge implementation for Flash Builder.
 * This implementation was copied&pasted from Nike Store Flash Builder impl.
 * ========================================================
 */
if (!window.EventBridge) {
    var EventBridge = new function() {
        if (!document.getElementById) {
            return
        }
        var b = "external";
        this.setChannel = function(e) {
            b = e
        };
        this.getChannel = function() {
            return b
        };
        var c = "normal";
        this.setMode = function(e) {
            c = e
        };
        this.getMode = function() {
            return c
        };
        this.getFlash = function(e) {
            if (navigator.appName.indexOf("Microsoft") != -1) {
                return window[e]
            } else {
                return document[e]
            }
        };
        var a = {};
        this.dispatchEvent = function(q) {
            var m = "dispatchEvent ";
            var o = q.type;
            if (!a[o]) {
                return

            }
            for ( var h in a[o]) {
                for ( var g = 0, f = a[o][h].length; g < f; g++) {
                    var n = a[o][h][g].target;
                    var e = a[o][h][g].func;
                    var p= q;
                    this.debug("TYPE : " + e + " - TARGET : " + h + " ARGS : " + p);
                    n[e](p);
                }
            }
        };
        this.addListener = function(e, h, f) {
            a[e] = a[e] || {};
            a[e][h] = a[e][h] || [];
            var g = "addListener : ";
            this.debug(g + "TYPE : " + e + " - TARGET : " + h + " FUNCTION : "
                    + f);
            a[e][h].push({
                target : this.getFlash(h) || h,
                func : f
            })
        };
        this.registerListener = this.addListener;
        this.removeListener = function(h, m, j) {
            var k = "removeListener ";
            this.debug(k + "TYPE : " + h + " - TARGET : " + m + " FUNCTION : "
                    + j);
            var f = this.getFlash(m) || m;
            for ( var g = 0, e = a[h][m].length; g < e; g++) {
                if (a[h][m][g].target.id == m && a[h][m][g].func == j) {
                    a[h][m].splice(g, 1)
                }
            }
        };
        this.hasListener = function(h, n, k) {
            var f = this.getFlash(n) || n;
            if (k) {
                for ( var g = 0, e = a[h][n].length; g < e; g++) {
                    var m = a[h][n][g];
                    if ((m.target.id == f.id || m.target == n) && m.func == k) {
                        this.debug("hasListener TYPE : " + h + " TARGET : " + n
                                + " FUNCTION : " + k);
                        return true
                    }
                }
                this.debug("hasListener false");
                return false
            } else {
                var j = !!a[h][n];
                this.debug("hasListener : " + j);
                return j
            }
        };
        this.removeAllListeners = function() {
            a = {}
	
        };
        this.debug = function(e) {
            console.debug(e);
        }

    }

}