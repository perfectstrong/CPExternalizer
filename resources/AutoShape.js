(function(a) {
    a.Feedback = function(d, c, b, e, f) {
        this.lastFrame = this.startFrame = this.currentFrame = 0;
        this.itemName = d;
        this.endAction = c;
        this.parentSlide = a.movie.stage.currentSlide;
        this.element = document.getElementById(d);
        this.item = a.D[d];
        this.type = a.FeedbackType.OTHER;
        if (void 0 != e) switch (e) {
            case a.FeedbackType.SUCCESS:
            case a.FeedbackType.FAILURE:
            case a.FeedbackType.HINT:
                this.type = e
        }
        this.actionObj = f;
        a.FeedbackType.SUCCESS == this.type && this.actionObj && (this.actionObj.actionInProgress = !0);
        this.item && (this.transIn =
            this.item.trin, this.effectObj = this.item.ef);
        this.transIn || (this.transIn = 0);
        this.drawingBoard = null;
        this.element && this.element.drawingBoard && (this.element.drawingBoard.style.opacity = 0, this.drawingBoard = this.element.drawingBoard);
        this.item && (this.transOut = this.item.trout);
        this.transOut || (this.transOut = 0);
        this.pause = b;
        this.onMouse = !1;
        this.item && (this.item.to && this.item.from) && (this.lastFrame = this.item.to - this.item.from);
        this.item && void 0 != this.item.du && (this.lastFrame = this.item.du);
        this.createCSSAnimationRule()
    };
    a.Feedback.prototype = {
        update: function() {
            this.currentFrame++;
            this.currentFrame > this.lastFrame && (a.movie.stage.RemoveFeedback(this), this.hide(), this.endAction && a.movie.executeAction(this.endAction));
            if (this.effectObj) {
                var d = this.effectObj["ef" + this.effectObj.id];
                if (d && d.length)
                    for (var c = 0; c < d.length; ++c) {
                        var b = d[c],
                            e = this.currentFrame;
                        if (b.sf - 1 > e || b.sf - 1 + b.du <= e) b.ci = -1;
                        else {
                            for (var f, e = e - (b.sf - 1), g = 0; g < b.kf.length - 1; ++g)
                                if (b.kf[g].f <= e && b.kf[g + 1].f > e) {
                                    b.ci = g;
                                    break
                                }
                            f = b.kf[b.ci];
                            var i = b.io,
                                l = b.fo,
                                h =
                                b.kf[b.ci + 1],
                                j = e - f.f,
                                k = 0 > b.ease ? -b.ease / 100 + 1 : 1 - b.ease / 200,
                                g = f.x + (h.x - f.x) * Math.pow(j / (h.f - f.f), k);
                            f = f.y + (h.y - f.y) * Math.pow(j / (h.f - f.f), k);
                            b = (i + (l - i) * e / b.du) / 100;
                            b = 0 > b ? 0 : b;
                            b = 1 < b ? 1 : b;
                            this.element.style.left = this.element.bounds.minX + g + "px";
                            this.element.style.top = this.element.bounds.minY + f + "px";
                            this.element.drawingBoard && (this.element.drawingBoard.style.left = this.element.drawingBoard.bounds.minX + g + "px", this.element.drawingBoard.style.top = this.element.drawingBoard.bounds.minY + f + "px", this.element.drawingBoard.style.opacity =
                                b + "")
                        }
                    }
            }
            if (this.drawingBoard)
                if (d = a.canUseWebkitAnimations() && a.FeedbackType.HINT != this.type, c = this.currentFrame, b = this.lastFrame - this.currentFrame, c < this.transIn) d || (this.drawingBoard.style.opacity = a.device != a.DESKTOP ? 1 : c / this.transIn);
                else if (d || (this.drawingBoard.style.opacity = a.device != a.DESKTOP ? 1 : c > this.lastFrame - this.transOut ? b / this.transOut : 1), this.onMouse) this.currentFrame = this.lastFrame - this.transOut - 1
        },
        onRollover: function() {
            this.onMouse = !0;
            this.currentFrame = 0;
            this.show()
        },
        onRollout: function() {
            this.onMouse = !1;
            this.currentFrame = this.lastFrame - this.transOut
        },
        createCSSAnimationRule: function() {
            function d() {
                var a = document.styleSheets[0];
                if (a && !a.cssRules) return !1;
                for (var c = 0; c < a.cssRules.length; ++c)
                    if (a.cssRules[c].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && a.cssRules[c].name == b) return !0;
                return !1
            }
            var c = a.D[this.itemName];
            if (c && a.canUseWebkitAnimations() && a.FeedbackType.HINT != this.type) {
                var b = this.itemName + "_rule";
                if (d()) a.verbose && a.log("rule exists");
                else {
                    var e = "";
                    if (0 != c.trin && void 0 != c.trin) var f = Math.round(1E4 *
                            c.trin / c.du) / 100,
                        e = e + (" { 0% { opacity:0; } " + f + "% { opacity:1; } ");
                    else e += " { 0% { opacity:1; } ";
                    0 != c.trout && void 0 != c.trout ? (c = Math.round(1E4 * (c.du - c.trout) / c.du) / 100, e += " " + c + "% { opacity:1; }  100% { opacity:0; } }") : e += " 100% { opacity:1; } }";
                    c = document.styleSheets[0];
                    a.verbose && a.log(b + ", " + e);
                    c.insertRule("@-webkit-keyframes " + b + e)
                }
                this.webkitAnimationRule = b
            }
        },
        show: function() {
            var d = a.D[this.itemName];
            if (d && (this.drawingBoard && (a.canUseWebkitAnimations() && a.FeedbackType.HINT != this.type ?
                    (a.verbose && a.log("Using Webkit animation"), this.drawingBoard.style.webkitAnimationName = this.webkitAnimationRule, this.drawingBoard.style.webkitAnimationDuration = d.du / a.movie.fps + "s") : this.drawingBoard.style.opacity = a.device != a.DESKTOP ? 1 : 0), void 0 != this.parentSlide && this.parentSlide == a.movie.stage.currentSlide)) {
                this.pause && !a.movie.paused && a.movie.pause(a.ReasonForPause.FEEDBACK_ITEM);
                var c = a.FeedbackCloseReason.OTHER;
                switch (this.type) {
                    case a.FeedbackType.SUCCESS:
                        c = a.FeedbackCloseReason.SHOW_SUCCESS;
                        break;
                    case a.FeedbackType.FAILURE:
                        c = a.FeedbackCloseReason.SHOW_FAILURE;
                        break;
                    case a.FeedbackType.HINT:
                        c = a.FeedbackCloseReason.SHOW_HINT
                }
                a.movie.stage.RemoveFeedbacks(c);
                a.movie.stage.AddFeedback(this);
                a.moveDivElemToTop(this.element);
                d = document.getElementById(d.mdi);
                void 0 != d && a.moveRewrapElemToTop(d.parentNode);
                a.show(this.itemName)
            }
        },
        hide: function() {
            a.FeedbackType.SUCCESS == this.type && this.actionObj && (this.actionObj.actionInProgress = !1);
            a.hide(this.itemName);
            this.drawingBoard && (this.drawingBoard.style.opacity =
                1)
        },
        canHide: function(d) {
            return a.FeedbackType.HINT == this.type || a.FeedbackType.OTHER == this.type || a.FeedbackCloseReason.SLIDE_CHANGE == d || a.FeedbackCloseReason.OTHER == d ? !0 : a.FeedbackCloseReason.SHOW_HINT == d || a.FeedbackType.SUCCESS == this.type ? !1 : !0
        }
    }
})(window.cp);
(function(a) {
    a.Line = function(k, o) {
        a.Line.baseConstructor.call(this, k);
        this.baseItemBoundingRect = null;
        var c = this.currentState;
        if (void 0 != this._parentObj) {
            this._canvasObj = a.D[this._parentObj.mdi];
            if (this._parentObj.hasOwnProperty("stc") && c < this._parentObj.stc.length && 0 <= c) {
                var b = a.D[this._parentObj.stc[c]];
                b && (this._canvasObj = a.D[b.mdi])
            }
            this.prevCanvasObj = this._canvasObj
        }
        this._visible = this.getAttribute("visible");
        this._data = a.D[this.element.id];
        this._parentDivName = this.getAttribute("dn");
        this.actualParent =
            b = document.getElementById(this.parentDivName);
        this.canvasID = k.id;
        this._canvasObj = a.D[this.canvasID];
        var e = this.data.b;
        this._bounds = {
            minX: e[0],
            minY: e[1],
            maxX: e[2],
            maxY: e[3]
        };
        e = this.data.vb;
        this._vbounds = {
            minX: e[0],
            minY: e[1],
            maxX: e[2],
            maxY: e[3],
            width: e[2] - e[0],
            height: e[3] - e[1]
        };
        b && (b.drawingBoard = this.element.parentElement, b.bounds = this.bounds, b.drawingBoard.bounds = this.vbounds);
        this.args = o;
        this.isDrawn = !1;
        this._sh = this.getAttribute("sh");
        this._re = this.getAttribute("re");
        a.responsive && (this._responsiveCSS =
            this.getAttribute("css"));
        !1 == this.cloneOfBaseStateItem && -1 != this.baseStateItemID && (this.playEffectsOnStart = !0);
        a.setInitialVisibility(this);
        if (this._data.hasOwnProperty("stc")) {
            b = this._data.stc;
            for (e = 0; e < b.length; ++e) e != c && a._hideData(b[e])
        }
    };
    a.inherits(a.Line, a.DisplayObject);
    Object.defineProperties(a.Line.prototype, {
        canvasObj: {
            get: function() {
                return this._canvasObj
            },
            set: function(k) {
                this.prevCanvasObj = this._canvasObj;
                this._data = this._canvasObj = k;
                this.prevCanvasObj.dn !== this._canvasObj.dn && (this._tr =
                    this._re = this._sh = this._vbounds = this._bounds = this._responsiveCSS = null, this.isDrawn = !1, k = this.canvasSwitchReason, this.drawIfNeeded(!0, k ? k : a.ReasonForDrawing.kItemStateChanged))
            }
        },
        data: {
            get: function() {
                return this._canvasObj
            },
            set: function(a) {
                this._data = a
            }
        },
        bounds: {
            get: function() {
                if (this._vbounds) {
                    var a = this.canvasObj.b;
                    this._vbounds = {
                        minX: a[0],
                        minY: a[1],
                        maxX: a[2],
                        maxY: a[3]
                    }
                }
                return this._vbounds
            },
            set: function(a) {
                this._bounds = a
            }
        },
        vbounds: {
            get: function() {
                if (!this._vbounds) {
                    var a = this.canvasObj.vb;
                    a && (this._vbounds = {
                        minX: a[0],
                        minY: a[1],
                        maxX: a[2],
                        maxY: a[3]
                    })
                }
                return this._vbounds
            },
            set: function(a) {
                this._vbounds = a
            }
        },
        tr: {
            get: function() {
                this._tr || (this._tr = this.canvasObj.tr);
                return this._tr
            },
            set: function(a) {
                this._tr = a
            }
        },
        sh: {
            get: function() {
                this._sh || (this._sh = this.canvasObj.sh);
                return this._sh
            },
            set: function(a) {
                this._sh = a
            }
        },
        re: {
            get: function() {
                this._re || (this._re = this.canvasObj.re);
                return this._re
            },
            set: function(a) {
                this._re = a
            }
        },
        responsiveCSS: {
            get: function() {
                this._responsiveCSS || (this._responsiveCSS = this.canvasObj.css);
                return this._responsiveCSS
            },
            set: function(a) {
                this._responsiveCSS = a
            }
        },
        parentDivName: {
            get: function() {
                return this._parentDivName
            },
            set: function(a) {
                this._parentDivName = a
            }
        }
    });
    a.Line.prototype.start = function(a, o) {
        this.drawIfNeeded(a, o);
        if (!this.effectIsStarted || a) this.areDimensionsCalculated = !1, this.updateEffects(this.hasEffect), this.effectIsStarted = !0
    };
    a.Line.prototype.reset = function() {
        delete a.ropMap[this.element.id];
        this.isDrawn = !1;
        this.element.width = "0";
        this.element.height = "0";
        this.element.style.width =
            "0px";
        this.element.style.height = "0px";
        this.element.left = "0";
        this.element.top = "0";
        this.element.style.left = "0px";
        this.element.style.top = "0px";
        this.effectIsStarted = !1
    };
    a.Line.prototype.getLinkOffsets = function(k, o, c) {
        void 0 === o && (o = !1);
        void 0 === c && (c = a.ReasonForDrawing.kRegularDraw);
        var b = {
            l: 0,
            t: 0,
            r: 0,
            b: 0,
            hOff: {}
        };
        b.hOff.offset = 0;
        b.hOff.poleVal = {
            init: 0,
            curr: 0
        };
        b.vOff = {};
        b.vOff.offset = 0;
        b.vOff.poleVal = {
            init: 0,
            curr: 0
        };
        var e = a.GetBoundingClientRectForElem(a("div_Slide"), o),
            m = a("project").clientWidth,
            g = a("project").clientHeight,
            d = !1,
            p = !1,
            f = void 0,
            l = void 0;
        if (k.lhID || k.lvID) f = a.getDisplayObjByCP_UID(k.lhID), l = k.lhID == k.lvID ? f : a.getDisplayObjByCP_UID(k.lvID), f && (d = f.isStarted && f.isDrawnComplete), l && (p = l.isStarted && l.isDrawnComplete);
        if (d && -1 != k.lhID) {
            var h = f.actualParent;
            if (h) {
                var i = a.GetBoundingClientRectForBaseItem(f, o, c),
                    d = i ? i : a.GetBoundingClientRectForElem(h, o);
                !i && h.tr && (i = f.actualParent.style.transform || f.actualParent.style.msTransform || f.actualParent.style.MozTransform || f.actualParent.style.WebkitTransform || f.actualParent.style.OTransform,
                    a.applyTransform(f.actualParent, ""), d = a.GetBoundingClientRectForElem(h, o), a.applyTransform(f.actualParent, i));
                if (d && (h = k.lhV, -1 != h.indexOf("H%") ? (h = h.split("H%")[0], h = a.getRoundedValue(h * g / 100) + "px") : -1 != h.indexOf("%") && (h = h.split("%")[0], h = a.getRoundedValue(h * m / 100) + "px"), d = d[a.rLinkEdges[k.lhEID]], d -= e.left, b.hOff.poleVal.curr = d, "auto" != k.l && "" != k.l && (b.hOff.offset = parseFloat(h)), "auto" != k.r && "" != k.r)) b.hOff.offset = -parseFloat(h);
                f = a.createTempElemAndGetBoundingRect(f.currentCSS, void 0, !1);
                b.hOff.poleVal.init =
                    f[a.rLinkEdges[k.lhEID]] - e.left
            }
        } else b.hOff = void 0;
        if (p && -1 != k.lvID) {
            if (h = l.actualParent) {
                d = (i = a.GetBoundingClientRectForBaseItem(l, o, c)) ? i : a.GetBoundingClientRectForElem(h, o);
                !i && h.tr && (i = l.actualParent.style.transform || l.actualParent.style.msTransform || l.actualParent.style.MozTransform || l.actualParent.style.WebkitTransform || l.actualParent.style.OTransform, a.applyTransform(l.actualParent, ""), d = a.GetBoundingClientRectForElem(h, o), a.applyTransform(l.actualParent, i));
                if (d && (h = k.lvV, -1 != h.indexOf("H%") ?
                        (h = h.split("H%")[0], h = a.getRoundedValue(h * m / 100) + "px") : -1 != h.indexOf("%") && (h = h.split("%")[0], h = a.getRoundedValue(h * g / 100) + "px"), d = d[a.rLinkEdges[k.lvEID]], d -= e.top, b.vOff.poleVal.curr = d, "auto" != k.t && "" != k.t && (b.vOff.offset = parseFloat(h)), "auto" != k.b && "" != k.b)) b.vOff.offset = -parseFloat(h);
                f = a.createTempElemAndGetBoundingRect(l.currentCSS, void 0, !1);
                b.vOff.poleVal.init = f[a.rLinkEdges[k.lvEID]] - e.top
            }
        } else b.vOff = void 0;
        return b
    };
    a.Line.prototype.drawForResponsive = function(k, o) {
        if (!this.responsiveCSS) return !1;
        if (this.isDrawn && !k) return a.initializeVisibilityForGroupedItem(this), !0;
        if (!this.data) return !1;
        var c = a.getResponsiveCSS(this.responsiveCSS);
        a.getCSSFromLayouter(c, this);
        var b = !1,
            b = this.sh && !this.sh.i,
            e = void 0 != this.tr;
        if (this.isDrawn && this.currentCSS == c && !b && !e && (!k || o == a.ReasonForDrawing.kMoviePaused)) return !0;
        this.currentCSS = c;
        this.parentDivName = b = this.getAttribute("dn");
        var m = c,
            g = o === a.ReasonForDrawing.kItemStateChanged || o === a.ReasonForDrawing.kGettingBoundingRectInBaseState || o === a.ReasonForDrawing.kLinkedToItemAppeared,
            b = this.getLinkOffsets(c, g, o);
        a.applyResponsiveStyles(this.element.parentElement, m, !0, g, void 0, o);
        a.applyResponsiveStyles(this.actualParent, c, !0, g, void 0, o);
        var d = a.GetBoundingClientRectForElem(a.movie.stage.mainSlideDiv, g);
        this.parentElementClientBoundingRect = a.GetBoundingClientRectForElem(this.element.parentElement, g);
        var e = this.parentElementClientBoundingRect.left - d.left,
            p = this.parentElementClientBoundingRect.top - d.top;
        this.actualParentClientBoundingRect = a.GetBoundingClientRectForElem(this.actualParent,
            g);
        var f = this.actualParent,
            l = 0,
            h = 0,
            g = a("div_Slide").clientWidth,
            d = a("div_Slide").clientHeight,
            l = g > this.element.parentElement.clientWidth ? g : this.element.parentElement.clientWidth,
            h = d > this.element.parentElement.clientHeight ? d : this.element.parentElement.clientHeight,
            m = a.createResponsiveStyleObj(c, void 0, "0px", "0px", "0px", "0px", l + "px", h + "px", void 0),
            m = this.canvas = a.createResponsiveCanvas(m, l, h, this.element);
        this.element.style.marginLeft = -e + "px";
        this.element.style.marginTop = -p + "px";
        this.element.parentElement.style.webkitBoxReflect =
            this.re ? "below " + this.re.d + "px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(" + (1 - this.re.s / 100) + ", transparent), to(rgba(255, 255, 255, " + (1 - this.re.p / 100) + ")))" : "unset";
        a.movie.stage.addToParentChildMap(f.id, this.element.id);
        this.element.originalParent = f;
        e = m.gc;
        e.clearRect(0, 0, this.element.getBoundingClientRect().width, this.element.getBoundingClientRect().height);
        a.DESKTOP == a.device && (a.MSIE == a.browser || a.MSEDGE == a.browser || a.FIREFOX == a.browser) && e.beginPath();
        e.save();
        this.sh && !this.sh.i && (e.shadowOffsetX = this.sh.d * Math.cos(Math.PI * this.sh.a / 180), e.shadowOffsetY = this.sh.d * Math.sin(Math.PI * this.sh.a / 180), e.shadowBlur = this.sh.b, e.shadowColor = a.ConvertRGBToRGBA(this.sh.c, this.sh.o));
        var i = c.l,
            n = c.t,
            f = c.w,
            l = c.h,
            h = a.getResponsiveCSS(this.data);
        if (-1 != f.indexOf("H%")) var j = f.split("H%")[0],
            f = a.getRoundedValue(j * d / 100);
        else -1 != f.indexOf("%") ? (j = f.split("%")[0], f = a.getRoundedValue(j * g / 100)) : f = f.split("px")[0]; - 1 != l.indexOf("H%") ? (j = l.split("H%")[0], l = a.getRoundedValue(j *
            g / 100)) : -1 != l.indexOf("%") ? (j = l.split("%")[0], l = a.getRoundedValue(j * d / 100)) : l = l.split("px")[0];
        f = parseFloat(f);
        l = parseFloat(l);
        m = c.cah;
        p = c.cav;
        m ? i = (g - f) / 2 : "auto" != c.l ? -1 != i.indexOf("H%") ? (j = i.split("H%")[0], i = a.getRoundedValue(j * d / 100)) : -1 != i.indexOf("%") ? (j = i.split("%")[0], i = a.getRoundedValue(j * g / 100)) : i = i.split("px")[0] : (i = c.r, -1 != i.indexOf("H%") ? (j = i.split("H%")[0], i = a.getRoundedValue(j * d / 100)) : -1 != i.indexOf("%") ? (j = i.split("%")[0], i = a.getRoundedValue(j * g / 100)) : i = i.split("px")[0], i = parseFloat(i),
            i = g - (i + f));
        p ? n = (d - l) / 2 : "auto" != c.t ? -1 != n.indexOf("H%") ? (j = n.split("H%")[0], n = a.getRoundedValue(j * g / 100)) : -1 != n.indexOf("%") ? (j = n.split("%")[0], n = a.getRoundedValue(j * d / 100)) : n = n.split("px")[0] : (n = c.b, -1 != n.indexOf("H%") ? (j = n.split("H%")[0], n = a.getRoundedValue(j * g / 100)) : -1 != n.indexOf("%") ? (j = n.split("%")[0], n = a.getRoundedValue(j * d / 100)) : n = n.split("px")[0], n = parseFloat(n), n = d - (n + l));
        var i = parseFloat(i),
            n = parseFloat(n),
            q = j = d = g = 0;
        "false" != h.rpX1IsLeft ? (g = i, d = i + f) : (g = i + f, d = i);
        "false" != h.rpY1IsTop ? (j = n,
            q = n + l) : (j = n + l, q = n);
        f = lRightPoint = lTopPoint = lBottomPoint = 0;
        g > d ? (f = d, lRightPoint = g) : (f = g, lRightPoint = d);
        j > q ? (lTopPoint = q, lBottomPoint = j) : (lTopPoint = j, lBottomPoint = q);
        b.hOff && !m && (m = 0, "" != c.l && "auto" != c.l ? (m = f, f = b.hOff.poleVal.curr + b.hOff.offset, lRightPoint += f - m) : "" != c.r && "auto" != c.r && (m = lRightPoint, lRightPoint = b.hOff.poleVal.curr + b.hOff.offset, f += lRightPoint - m));
        b.vOff && !p && (p = 0, "" != c.t && "auto" != c.t ? (p = lTopPoint, lTopPoint = b.vOff.poleVal.curr + b.vOff.offset, lBottomPoint += lTopPoint - p) : "" != c.b && "auto" !=
            c.b && (p = lBottomPoint, lBottomPoint = b.vOff.poleVal.curr + b.vOff.offset, lTopPoint += lBottomPoint - p));
        g > d ? (d = f, g = lRightPoint) : (g = f, d = lRightPoint);
        j > q ? (q = lTopPoint, j = lBottomPoint) : (j = lTopPoint, q = lBottomPoint);
        c = this.canvasObj.sw;
        5 > c && (c = 5);
        e.lineWidth = this.canvasObj.sw;
        e.strokeStyle = this.canvasObj.sc;
        e.moveTo(g, j);
        0 == this.canvasObj.ss ? e.lineTo(d, q) : a.drawDashedLine(e, g, j, d, q, this.canvasObj.ss);
        e.stroke();
        a.drawLineCapStyle(e, g, j, d, q, this.canvasObj.sc, c, this.canvasObj.sst, 0);
        a.drawLineCapStyle(e, g, j, d, q,
            this.canvasObj.sc, c, this.canvasObj.est, 1);
        e.restore();
        this.isDrawn = !0;
        this.drawComplete(o);
        a.isVisible(this) || a._hide(this.parentDivName);
        a.isVisible(this) && this.playEffectsOnStart && (b = this.parentDivName, (c = a.D[b].selfAnimationScript) && eval(c), this.playEffectsOnStart = !1);
        return !0
    };
    a.Line.prototype.drawIfNeeded = function(k, o) {
        if ((!a.responsive || !this.drawForResponsive(k, o)) && !this.isDrawn) {
            var c = this.bounds,
                b = this.vbounds,
                e = this.canvasObj.sw;
            5 > e && (e = 5);
            var m = c.minX,
                g = c.minY,
                d = c.maxX - c.minX,
                p = c.maxY -
                c.minY,
                c = this.actualParent;
            c.style.left = m + "px";
            c.style.top = g + "px";
            c.style.width = d + "px";
            c.style.height = p + "px";
            m = 0 < b.minX ? 0 : b.minX;
            g = 0 < b.minY ? 0 : b.minY;
            p = a.D.project.h > b.maxY ? a.D.project.h : b.maxY;
            d = (a.D.project.w > b.maxX ? a.D.project.w : b.maxX) - m;
            b = this.canvas = a.createCanvas(0, 0, d, p - g, this.element);
            this.element.style.display = "block";
            this.element.style.position = "absolute";
            this.element.parentElement.style.left = this.vbounds.minX + "px";
            this.element.parentElement.style.top = this.vbounds.minY + "px";
            this.element.parentElement.style.width =
                this.vbounds.maxX - this.vbounds.minX + "px";
            this.element.parentElement.style.height = this.vbounds.maxY - this.vbounds.minY + "px";
            this.element.style.marginLeft = m - this.vbounds.minX + "px";
            this.element.style.marginTop = g - this.vbounds.minY + "px";
            this.element.parentElement.style.webkitBoxReflect = this.re ? "below " + this.re.d + "px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(" + (1 - this.re.s / 100) + ", transparent), to(rgba(255, 255, 255, " + (1 - this.re.p / 100) + ")))" : "unset";
            a.movie.stage.addToParentChildMap(c.id,
                this.element.id);
            this.element.originalParent = c;
            b = b.gc;
            b.save();
            b.translate(0 > m ? -m : 0, 0 > g ? -g : 0);
            this.sh && !this.sh.i && (b.shadowOffsetX = this.sh.d * Math.cos(Math.PI * this.sh.a / 180), b.shadowOffsetY = this.sh.d * Math.sin(Math.PI * this.sh.a / 180), b.shadowBlur = this.sh.b, b.shadowColor = a.ConvertRGBToRGBA(this.sh.c, this.sh.o));
            m = this.canvasObj.x1;
            g = this.canvasObj.y1;
            d = this.canvasObj.x2;
            c = this.canvasObj.y2;
            b.lineWidth = this.canvasObj.sw;
            b.strokeStyle = this.canvasObj.sc;
            b.moveTo(m, g);
            0 == this.canvasObj.ss ? b.lineTo(d, c) :
                a.drawDashedLine(b, m, g, d, c, this.canvasObj.ss);
            b.stroke();
            a.drawLineCapStyle(b, m, g, d, c, this.canvasObj.sc, e, this.canvasObj.sst, 0);
            a.drawLineCapStyle(b, m, g, d, c, this.canvasObj.sc, e, this.canvasObj.est, 1);
            b.restore();
            this.isDrawn = !0;
            a.isVisible(this) || a._hide(this.parentDivName);
            a.isVisible(this) && this.playEffectsOnStart && ((e = a.D[this.parentDivName].selfAnimationScript) && eval(e), this.playEffectsOnStart = !1)
        }
    }
})(window.cp);
(function(a) {
    a.DrawingItem = function(g, d, c) {
        function e(a) {
            k.changeStateOnMouseEvents && k.changeStateOnMouseEvents("mouseover", a)
        }

        function j(a) {
            k.changeStateOnMouseEvents && k.changeStateOnMouseEvents("mouseout", a)
        }

        function l(a) {
            k.changeStateOnMouseEvents && k.changeStateOnMouseEvents("mousedown", a)
        }

        function i(a) {
            k.changeStateOnMouseEvents && k.changeStateOnMouseEvents("mouseup", a)
        }

        function f(a, c, g, d) {
            return function(e) {
                if (!(k.parentObj && void 0 != k.parentObj.enabled) || k.parentObj.enabled) d && d(), g && k.mouseState ==
                    a || (k.mouseState = a, c(e))
            }
        }
        var k = this;
        this.mouseState = a.mouseStateOut;
        a.DrawingItem.baseConstructor.call(this, g);
        this.baseItemBoundingRect = null;
        this.visible = this.getAttribute("visible");
        this.parentId = a.D[d].dn;
        this._parentObj = a.D[this.parentId];
        this._canvasObj = null;
        void 0 != this._parentObj && (this._canvasObj = a.D[this._parentObj.mdi]);
        this.parentDivName = this.getAttribute("dn");
        this.actualParent = d = document.getElementById(this.parentDivName);
        g = this.currentState;
        if (void 0 != this._parentObj) {
            if (this._parentObj.hasOwnProperty("stc") &&
                g < this._parentObj.stc.length && 0 <= g) {
                var m = a.D[this._parentObj.stc[g]];
                m && (this._canvasObj = a.D[m.mdi])
            }
            this.prevCanvasObj = this._canvasObj
        }
        this._parentObj = a.D[this._canvasObj.dn];
        this._transIn = this._parentObj.trin;
        this._canvasObj && (this.type = this._canvasObj.t, m = this._canvasObj.b, this._bounds = {
                minX: m[0],
                minY: m[1],
                maxX: m[2],
                maxY: m[3],
                width: m[2] - m[0],
                height: m[3] - m[1]
            }, this.args = c, c = this.canvasObj.vb, this._vbounds = {
                minX: c[0],
                minY: c[1],
                maxX: c[2],
                maxY: c[3],
                width: c[2] - c[0],
                height: c[3] - c[1]
            }, this._sh = this._canvasObj.sh,
            this._re = this._canvasObj.re, this._tr = this._canvasObj.tr, this._currImage = this._canvasObj.ip);
        d && (d.drawingBoard = this.element.parentElement, d.bounds = this._bounds, d.drawingBoard.bounds = this._vbounds);
        this._parentObj && a.doesSupportStates(this._parentObj.type) && d && (a.device == a.IDEVICE || a.device == a.ANDROID ? (d.ontouchstart = f(a.mouseStateTouchStart, l), d.ontouchend = f(a.mouseStateTouchEnd, i)) : (d.onmouseover = f(a.mouseStateOver, e, !1, d.onmouseover), d.onmouseout = f(a.mouseStateOut, j, !1, d.onmouseout), d.onmousedown =
            f(a.mouseStateDown, l), d.onmouseup = f(a.mouseStateUp, i)));
        this.shouldShowRollOver = !0;
        this.isDrawn = !1;
        a.responsive && (this._responsiveCSS = this.getAttribute("css"));
        !1 == this.cloneOfBaseStateItem && -1 != this.baseStateItemID && (this.playEffectsOnStart = !0);
        a.setInitialVisibility(this);
        if (this._parentObj.hasOwnProperty("stc")) {
            c = this._parentObj.stc;
            for (d = 0; d < c.length; ++d) d != g && a._hideData(c[d])
        }
    };
    a.inherits(a.DrawingItem, a.DisplayObject);
    Object.defineProperties(a.DrawingItem.prototype, {
        canvasObj: {
            get: function() {
                return this._canvasObj
            },
            set: function(g) {
                this.prevCanvasObj = this._canvasObj;
                this._canvasObj = g;
                this.prevCanvasObj.dn !== this._canvasObj.dn && (this._parentObj = this._tr = this._re = this._sh = this._vbounds = this._bounds = this._responsiveCSS = null, this.isDrawn = !1, g = this.canvasSwitchReason, this.drawIfNeeded(!0, g ? g : a.ReasonForDrawing.kItemStateChanged), a.responsive || a.updateVarText(this.actualParent, !0, !0))
            }
        },
        parentObj: {
            get: function() {
                this._parentObj || (this._parentObj = a.D[this.canvasObj.dn]);
                return this._parentObj
            },
            set: function(a) {
                this._parentObj =
                    a
            }
        },
        transIn: {
            get: function() {
                this._transIn || (this._transIn = a.D[this.canvasObj.dn].trin);
                return this._transIn
            },
            set: function(a) {
                this._transIn = a
            }
        },
        currImage: {
            get: function() {
                this._currImage || (this._currImage = this.canvasObj.ip);
                return this._currImage
            },
            set: function(a) {
                this._currImage = a
            }
        },
        bounds: {
            get: function() {
                if (!this._bounds) {
                    var a = this.canvasObj.b;
                    this._bounds = {
                        minX: a[0],
                        minY: a[1],
                        maxX: a[2],
                        maxY: a[3],
                        width: a[2] - a[0],
                        height: a[3] - a[1]
                    }
                }
                return this._bounds
            },
            set: function(a) {
                this._bounds = a
            }
        },
        vbounds: {
            get: function() {
                if (!this._vbounds) {
                    var a =
                        this.canvasObj.vb;
                    this._vbounds = {
                        minX: a[0],
                        minY: a[1],
                        maxX: a[2],
                        maxY: a[3],
                        width: a[2] - a[0],
                        height: a[3] - a[1]
                    }
                }
                return this._vbounds
            },
            set: function(a) {
                this._vbounds = a
            }
        },
        sh: {
            get: function() {
                this._sh || (this._sh = this.canvasObj.sh);
                return this._sh
            },
            set: function(a) {
                this._sh = a
            }
        },
        re: {
            get: function() {
                this._re || (this._re = this.canvasObj.re);
                return this._re
            },
            set: function(a) {
                this._re = a
            }
        },
        tr: {
            get: function() {
                this._tr || (this._tr = this.canvasObj.tr);
                return this._tr
            },
            set: function(a) {
                this._tr = a
            }
        },
        responsiveCSS: {
            get: function() {
                this._responsiveCSS ||
                    (this._responsiveCSS = this.canvasObj.css);
                return this._responsiveCSS
            },
            set: function(a) {
                this._responsiveCSS = a
            }
        }
    });
    a.DrawingItem.prototype.start = function(a, d) {
        this.drawIfNeeded(a, d);
        if (!this.effectIsStarted || a) this.areDimensionsCalculated = !1, this.updateEffects(this.hasEffect), this.effectIsStarted = !0
    };
    a.DrawingItem.prototype.reset = function() {
        delete a.ropMap[this.element.id];
        this.isDrawn = !1;
        this.element.width = "0";
        this.element.height = "0";
        this.element.style.width = "0px";
        this.element.style.height = "0px";
        this.element.left =
            "0";
        this.element.top = "0";
        this.element.style.left = "0px";
        this.element.style.top = "0px";
        this.effectIsStarted = !1
    };
    a.DrawingItem.prototype.drawForResponsive = function(g, d) {
        if (!this.responsiveCSS) return !1;
        if (this.isDrawn && !g) return a.initializeVisibilityForGroupedItem(this), !0;
        var c = a.getResponsiveCSS(this.responsiveCSS);
        a.getCSSFromLayouter(c, this);
        var e = !1,
            e = this.sh && !this.sh.i;
        if (!this.isDrawn || !(this.currentCSS == c && g && d == a.ReasonForDrawing.kMoviePaused)) {
            var j = d === a.ReasonForDrawing.kItemStateChanged ||
                d === a.ReasonForDrawing.kGettingBoundingRectInBaseState || d === a.ReasonForDrawing.kLinkedToItemAppeared;
            this.currentCSS = c;
            if (this.canvasObj && this.type) {
                var l = this.canvasObj,
                    i = this.parentObj,
                    f = c,
                    k = this.actualParent.style.transform || this.actualParent.style.msTransform || this.actualParent.style.MozTransform || this.actualParent.style.WebkitTransform || this.actualParent.style.OTransform,
                    m = this.element.parentElement.style.transform || this.element.parentElement.style.msTransform || this.element.parentElement.style.MozTransform ||
                    this.element.parentElement.style.WebkitTransform || this.element.parentElement.style.OTransform;
                a.applyTransform(this.actualParent, "");
                a.applyTransform(this.element.parentElement, "");
                a.applyResponsiveStyles(this.actualParent, c, !0, j, void 0, d);
                if (i.rpvt && i.autoGrow && (d == a.ReasonForDrawing.kTextGrow || d == a.ReasonForDrawing.kMouseEvent)) {
                    var p = i.minItemHeight;
                    if (!p) {
                        p = i.variableText;
                        void 0 == p && (p = i.rpvt[a.ResponsiveProjWidth].vt);
                        var o = this.actualParent.clientWidth,
                            q = i.offsets;
                        q && (o -= q[0] + q[2]);
                        o -= (i.rplm ?
                            i.rplm[a.ResponsiveProjWidth] : 0) + (i.rprm ? i.rprm[a.ResponsiveProjWidth] : 0);
                        p = a.createTempTextElemAndGetBoundingRect(o, i, p, j).height
                    }
                    this.actualParent.clientHeight < p && (this.actualParent.style.height = p + "px");
                    a.createResponsiveStyleObj(c, c.p, c.l, c.t, c.r, c.b, this.actualParent.clientWidth + "px", this.actualParent.clientHeight + "px", c.crop)
                }
                this.actualParent.offsetHeight = this.actualParent.offsetHeight;
                this.actualParentClientBoundingRect = a.GetBoundingClientRectForElem(this.actualParent, j);
                q = a.GetBoundingClientRectForElem(a.movie.stage.mainSlideDiv,
                    j);
                this.HFactor = this.WFactor = 1;
                this.WFactor = parseInt(100 * this.actualParent.clientWidth / this.bounds.width) / 100;
                this.HFactor = parseInt(100 * this.actualParent.clientHeight / this.bounds.height) / 100;
                p = 0;
                this.tr && (p = a.getAngleFromRotateStr(this.tr));
                if (!this.m_centrePoint || d == a.ReasonForDrawing.kOrientationChangeOrResize || d == a.ReasonForDrawing.kLinkedToItemAppeared) this.m_centrePoint = a.getCenterForRotation(this.actualParent);
                o = a.getBoundsForRotatedItem1(this.actualParentClientBoundingRect.left - q.left, this.actualParentClientBoundingRect.top -
                    q.top, this.actualParentClientBoundingRect.width, this.actualParentClientBoundingRect.height, this.m_centrePoint, p, this.strokeWidth);
                f = t = r = b = void 0;
                "auto" != c.l && (f = o.l);
                "auto" != c.t && (t = o.t);
                "auto" != c.r && (r = o.r);
                "auto" != c.b && (b = o.b);
                f = a.createResponsiveStyleObj(c, c.p, f, t, r, b, o.w, o.h, c.crop);
                a.applyResponsiveStyles(this.element.parentElement, f);
                this.parentElementClientBoundingRect = a.GetBoundingClientRectForElem(this.element.parentElement, j);
                o = j = 0;
                this.m_centrePoint && (j = this.m_centrePoint.X - (this.actualParentClientBoundingRect.left -
                    q.left), o = this.m_centrePoint.Y - (this.actualParentClientBoundingRect.top - q.top));
                if (i.rpvt) {
                    var f = this.actualParent.id + "_vTxtHandlerHolder",
                        n = a(f);
                    n || (n = a.newElem("div"), n.id = f, n.style.display = "block", n.style.position = "absolute", n.style.width = this.actualParent.clientWidth + "px", n.style.height = this.actualParent.clientHeight + "px", n.style.visibility = "hidden", this.actualParent.appendChild(n));
                    n.style.left = "0px";
                    n.style.top = "0px";
                    n.style.width = this.actualParent.clientWidth + "px";
                    n.style.height = this.actualParent.clientHeight +
                        "px";
                    n = this.actualParent.id + "_vTxtHolder";
                    f = a(n);
                    f || (f = a.newElem("div"), f.id = n, f.style.display = "block", f.style.position = "absolute", this.element.parentElement.appendChild(f), f.style.width = this.actualParent.clientWidth + "px", f.style.height = this.actualParent.clientHeight + "px");
                    a.applyTransform(f, "rotate(0)");
                    n = this.actualParentClientBoundingRect.top - this.parentElementClientBoundingRect.top + this.actualParent.clientHeight / 2;
                    f.style.left = this.actualParentClientBoundingRect.left - this.parentElementClientBoundingRect.left +
                        this.actualParent.clientWidth / 2 - this.actualParent.clientWidth / 2 + "px";
                    f.style.top = n - this.actualParent.clientHeight / 2 + "px";
                    f.style.width = this.actualParent.clientWidth + "px";
                    f.style.height = this.actualParent.clientHeight + "px";
                    (d == a.ReasonForDrawing.kOrientationChangeOrResize || d == a.ReasonForDrawing.kItemStateChanged) && a.updateVarText(this.actualParent, !0, !0);
                    this.tr ? (f.style.left = (this.element.parentElement.clientWidth - f.clientWidth) / 2 + "px", f.style.top = (this.element.parentElement.clientHeight - f.clientHeight) /
                        2 + "px", n = "center center", f.style["-ms-transform-origin"] = n, f.style["-moz-transform-origin"] = n, f.style["-webkit-transform-origin"] = n, f.style["-o-transform-origin"] = n, f.style["transform-origin"] = n, a.applyTransform(f, this.tr)) : a.applyTransform(f, "none")
                }
                a.applyTransform(this.actualParent, k);
                a.applyTransform(this.element.parentElement, m);
                var m = this.actualParent,
                    s = k = 0;
                e ? (k = a("div_Slide").clientWidth, s = a("div_Slide").clientHeight) : (k = this.element.parentElement.clientWidth, s = this.element.parentElement.clientHeight);
                f = a.createResponsiveStyleObj(c, void 0, "0px", "0px", "0px", "0px", k + "px", s + "px", void 0);
                n = this.parentElementClientBoundingRect.left - q.left;
                q = this.parentElementClientBoundingRect.top - q.top;
                f = this.canvas = a.createResponsiveCanvas(f, k, s, this.element);
                this.isParentOfTypeSlide || (e ? (this.element.style.marginLeft = (0 > n ? 1 : -1) * n + "px", this.element.style.marginTop = (0 > q ? 1 : -1) * q + "px") : (this.element.style.marginLeft = "0px", this.element.style.marginTop = "0px"));
                this.element.parentElement.style.webkitBoxReflect = this.re ?
                    "below " + this.re.d + "px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(" + (1 - this.re.s / 100) + ", transparent), to(rgba(255, 255, 255, " + (1 - this.re.p / 100) + ")))" : "unset";
                a.movie.stage.addToParentChildMap(m.id, this.element.id);
                this.element.originalParent = m;
                k = f.gc;
                k.crop = c.crop ? c.crop : void 0;
                k.save();
                e && (k.setTransform(1, 0, 0, 1, 0 > n ? -n : 0, 0 > q ? -q : 0), k.translate(n, q), k.shadowOffsetX = this.sh.d * Math.cos(Math.PI * this.sh.a / 180), k.shadowOffsetY = this.sh.d * Math.sin(Math.PI * this.sh.a / 180),
                    k.shadowBlur = this.sh.b, c = this.sh.o, 1 == c && (c = 0.999), k.shadowColor = a.ConvertRGBToRGBA(this.sh.c, c));
                this.element.style.display = "block";
                this.element.style.position = "absolute";
                k = f.gc;
                k.save();
                this.tr ? (n = j ? 100 * j / m.clientWidth + "%" : "center", n += " ", n = o ? n + (100 * o / m.clientHeight + "%") : n + "center", m.style["-ms-transform-origin"] = n, m.style["-moz-transform-origin"] = n, m.style["-webkit-transform-origin"] = n, m.style["-o-transform-origin"] = n, m.style["transform-origin"] = n, a.applyTransform(m, this.tr), m.tr = this.tr) : (m.tr =
                    void 0, a.applyTransform(m, "none"));
                m.rotateAngle = p;
                c = this.element.parentElement.clientWidth / 2;
                e = this.element.parentElement.clientHeight / 2;
                c = this.actualParentClientBoundingRect.left - this.parentElementClientBoundingRect.left + j;
                e = this.actualParentClientBoundingRect.top - this.parentElementClientBoundingRect.top + o;
                k.translate(c, e);
                0 != p ? k.rotate(Math.PI * p / 180) : k.rotate(0.02 * Math.PI / 180);
                k.translate(-j, -o);
                c = 0;
                void 0 != l.ss && (c = l.ss);
                if ((l = this.draw(k, c)) && void 0 != this.normalImage)(c = a.movie.im.images[this.normalImage]) &&
                    c.nativeImage.complete ? (this.sh && !this.sh.i && (k.shadowOffsetX = 0, k.shadowOffsetY = 0, k.shadowBlur = 0, k.shadowColor = "rgba(0,0,0,0)"), k.drawImage(c.nativeImage, -c.nativeImage.width / 2, -c.nativeImage.height / 2, c.nativeImage.width, c.nativeImage.height)) : l = !1;
                k.restore();
                this.transIn && d == a.ReasonForDrawing.kRegularDraw && (this.element.parentElement.style.opacity = 0);
                a.handleQuizzingItemsInReviewMode(this.element, i, this.parentDivName);
                this.isDrawn = l;
                !0 == this.isDrawn && this.drawComplete(d);
                a.isVisible(this) || a._hide(this.parentDivName);
                a.isVisible(this) && this.playEffectsOnStart && ((i = this.parentObj.selfAnimationScript) && eval(i), this.playEffectsOnStart = !1);
                return !0
            }
        }
    };
    a.DrawingItem.prototype.drawIfNeeded = function(g, d) {
        if ((!a.responsive || !this.drawForResponsive(g, d)) && !this.isDrawn && this.canvasObj && this.type && this.canvasObj.b) {
            this.HFactor = this.WFactor = 1;
            var c = this.bounds,
                e = this.vbounds,
                j = this.parentObj,
                l = c.minX,
                i = c.minY,
                f = c.maxX - c.minX,
                k = c.maxY - c.minY,
                m = this.actualParent;
            m.style.left = l + "px";
            m.style.top = i + "px";
            m.style.width = f + "px";
            m.style.height = k + "px";
            var k = !1,
                k = this.re || this.sh && !this.sh.i,
                l = 0 < e.minX && k ? 0 : e.minX,
                i = 0 < e.minY && k ? 0 : e.minY,
                p = k && a.D.project.h > e.maxY ? a.D.project.h : e.maxY,
                f = (k && a.D.project.w > e.maxX ? a.D.project.w : e.maxX) - l,
                f = this.canvas = a.createCanvas(0, 0, f, p - i, this.element);
            this.element.style.display = "block";
            this.element.style.position = "absolute";
            this.element.parentElement.style.left = this.vbounds.minX + "px";
            this.element.parentElement.style.top = this.vbounds.minY + "px";
            this.element.parentElement.style.width = this.vbounds.maxX -
                this.vbounds.minX + "px";
            this.element.parentElement.style.height = this.vbounds.maxY - this.vbounds.minY + "px";
            this.element.style.marginLeft = l - this.vbounds.minX + "px";
            this.element.style.marginTop = i - this.vbounds.minY + "px";
            this.element.parentElement.style.webkitBoxReflect = this.re ? "below " + this.re.d + "px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(" + (1 - this.re.s / 100) + ", transparent), to(rgba(255, 255, 255, " + (1 - this.re.p / 100) + ")))" : "unset";
            a.movie.stage.addToParentChildMap(m.id,
                this.element.id);
            this.element.originalParent = m;
            e = f.gc;
            e.save();
            k ? e.setTransform(1, 0, 0, 1, 0 > l ? -l : 0, 0 > i ? -i : 0) : e.translate(-this.vbounds.minX, -this.vbounds.minY);
            this.sh && !this.sh.i && (e.shadowOffsetX = this.sh.d * Math.cos(Math.PI * this.sh.a / 180), e.shadowOffsetY = this.sh.d * Math.sin(Math.PI * this.sh.a / 180), e.shadowBlur = this.sh.b, e.shadowColor = a.ConvertRGBToRGBA(this.sh.c, this.sh.o));
            this.element.style.display = "block";
            this.element.style.position = "absolute";
            e = f.gc;
            e.save();
            l = 0;
            this.tr && (l = a.getAngleFromRotateStr(this.tr));
            m.rotateAngle = l;
            if (this.sh || 0 != l) e.translate((c.minX + c.maxX) / 2, (c.minY + c.maxY) / 2), 0 != l ? e.rotate(Math.PI * l / 180) : e.rotate(0.02 * Math.PI / 180), e.translate(-(c.minX + c.maxX) / 2, -(c.minY + c.maxY) / 2);
            m = 0;
            void 0 != this.canvasObj.ss && (m = this.canvasObj.ss);
            if ((m = this.draw(e, m)) && void 0 != this.currImage)(l = a.movie.im.images[this.currImage]) && l.nativeImage.complete ? (e.translate((c.minX + c.maxX) / 2, (c.minY + c.maxY) / 2), e.drawImage(l.nativeImage, -l.nativeImage.width / 2, -l.nativeImage.height / 2, l.nativeImage.width, l.nativeImage.height)) :
                m = !1;
            a.handleQuizzingItemsInReviewMode(this.element, j, this.parentDivName);
            e.restore();
            this.transIn && (this.element.parentElement.style.opacity = 0);
            this.isDrawn = m;
            !0 == this.isDrawn && this.drawComplete(d);
            a.isVisible(this) && this.playEffectsOnStart && ((c = this.parentObj.selfAnimationScript) && eval(c), this.playEffectsOnStart = !1)
        }
    };
    a.DrawingItem.prototype.draw = function(g, d) {
        switch (this.type) {
            case a.kCPOTOvalItem:
                this.drawOval(g, 0);
                break;
            case a.kCPOTAnswerArea:
            case a.kCPOTMatchingQuestionArea:
            case a.kCPOTMatchingAnswerArea:
            case a.kCPOTStageQuestionText:
            case a.kCPOTStageQuestionTitle:
            case a.kCPOTRectangleItem:
            case a.kCPOTLikertQuestionArea:
            case a.kCPOTLikertTotalGroupArea:
            case a.kCPOTScorableButtonItem:
            case a.kCPOTTextEntryButtonItem:
            case a.kCPOTRetakeButton:
            case a.kCPOTStageQuestionNextButton:
            case a.kCPOTStageQuestionClearButton:
            case a.kCPOTStageQuestionBackButton:
            case a.kCPOTStageQuestionReviewModeNextButton:
            case a.kCPOTStageQuestionReviewModeBackButton:
            case a.kCPOTStageQuestionSubmitButton:
            case a.kCPOTScoringReviewButton:
            case a.kCPOTScoringContinueButton:
            case a.kCPOTSubmitAllButton:
            case a.kCPOTResetButton:
            case a.kCPOTUndoButton:
            case a.kCPOTDDSubmitButton:
                this.drawRectangle(g,
                    0);
                break;
            case a.kCPOTPolygon:
                this.drawPolygon(g, 0);
                break;
            default:
                return !0
        }
        var c = 1;
        void 0 != this.canvasObj.fa && (c = this.canvasObj.fa / 100);
        var e = g.globalAlpha;
        g.globalAlpha = c;
        a.responsive && a.D[this.parentDivName].shouldShowDisabledState && (g.globalAlpha = 0.5);
        c = this.setFill(g);
        g.globalAlpha = e;
        if (0 != d && 0 < this.canvasObj.sw) switch (this.type) {
            case a.kCPOTOvalItem:
                this.drawOval(g, d);
                break;
            case a.kCPOTAnswerArea:
            case a.kCPOTMatchingQuestionArea:
            case a.kCPOTMatchingAnswerArea:
            case a.kCPOTStageQuestionText:
            case a.kCPOTStageQuestionTitle:
            case a.kCPOTRectangleItem:
            case a.kCPOTLikertQuestionArea:
            case a.kCPOTLikertTotalGroupArea:
            case a.kCPOTScorableButtonItem:
            case a.kCPOTTextEntryButtonItem:
            case a.kCPOTRetakeButton:
            case a.kCPOTStageQuestionNextButton:
            case a.kCPOTStageQuestionClearButton:
            case a.kCPOTStageQuestionBackButton:
            case a.kCPOTStageQuestionReviewModeNextButton:
            case a.kCPOTStageQuestionReviewModeBackButton:
            case a.kCPOTStageQuestionSubmitButton:
            case a.kCPOTScoringReviewButton:
            case a.kCPOTScoringContinueButton:
            case a.kCPOTSubmitAllButton:
            case a.kCPOTResetButton:
            case a.kCPOTUndoButton:
            case a.kCPOTDDSubmitButton:
                this.drawRectangle(g,
                    d);
                break;
            case a.kCPOTPolygon:
                this.drawPolygon(g, d);
                break;
            default:
                return !0
        }
        0 < this.canvasObj.sw && (g.lineWidth = this.canvasObj.sw, g.strokeStyle = this.canvasObj.sc, g.stroke());
        return c
    };
    a.DrawingItem.prototype.getTranslationValuesForTiletype = function() {
        var g = this.canvasObj;
        if (g) {
            var d = g.imgf;
            if (d) {
                var c = d.img.tiletype,
                    e = 0,
                    j = 0,
                    l = d.b[2] - d.b[0],
                    i = d.b[3] - d.b[1],
                    f = d.img.w,
                    d = d.img.h;
                a.responsive && (l = Math.floor(l * this.WFactor) + g.sw, i = Math.floor(i * this.HFactor) + g.sw);
                switch (c) {
                    case "t":
                        e = (l - f) / 2;
                        break;
                    case "tr":
                        e =
                            l - f;
                        break;
                    case "l":
                        j = (i - d) / 2;
                        break;
                    case "c":
                        e = (l - f) / 2;
                        j = (i - d) / 2;
                        break;
                    case "r":
                        e = l - imageWidthimageWidth;
                        j = (i - d) / 2;
                        break;
                    case "bl":
                        j = i - d;
                        break;
                    case "b":
                        e = (l - f) / 2;
                        j = i - d;
                        break;
                    case "br":
                        e = l - f, j = i - d
                }
                0 < e && (e = e % f - f);
                0 < j && (j = j % d - d);
                a.responsive || (e += g.b[0], j += g.b[1]);
                return {
                    x: e,
                    y: j
                }
            }
        }
    };
    a.DrawingItem.prototype.setFill = function(g) {
        var d = null,
            c = "",
            c = null,
            e = [],
            j = 0,
            l = 0,
            i = 0,
            f = 1,
            c = c = null,
            i = !0,
            k = 0,
            m = 0,
            e = k = 1,
            p = m = !1,
            o = g.canvas;
        if (0 == o.width || 0 == o.height) return !0;
        if (this.canvasObj.gf) {
            if (c = a.getGradientFill(this.canvasObj.gf,
                    g)) g.fillStyle = c
        } else if (this.canvasObj.imgf) {
            i = !1;
            d = this.canvasObj.imgf;
            if (void 0 == d.img || void 0 == d.img.ip) return !1;
            c = d.img.ip;
            if ((c = a.movie.im.images[c]) && c.nativeImage.complete) {
                i = d.s;
                if (f = d.t) d = this.getTranslationValuesForTiletype(), m = !0, g.translate(d.x, d.y), c = g.createPattern(c.nativeImage, "repeat"), g.fillStyle = c;
                else if (i) void 0 != this.canvasObj.b && 4 == this.canvasObj.b.length && (e = this.canvasObj.b, k = e[2] - e[0], h = e[3] - e[1], a.responsive && (k *= this.WFactor, h *= this.HFactor), k /= d.img.w, e = h / d.img.h, g.scale(k,
                    e), c = g.createPattern(c.nativeImage, "no-repeat"), g.fillStyle = c);
                else {
                    i = document.createElement("canvas");
                    f = i.getContext("2d");
                    o = g.canvas;
                    i.left = o.left;
                    i.right = o.right;
                    i.top = o.top;
                    i.bottom = o.bottom;
                    i.width = o.width;
                    i.height = o.height;
                    var o = c.nativeImage.width,
                        q = c.nativeImage.height,
                        j = d.b[2] - d.b[0],
                        l = d.b[3] - d.b[1];
                    a.responsive ? (j = Math.floor(j * this.WFactor) + this.canvasObj.sw, l = Math.floor(l * this.HFactor) + this.canvasObj.sw, j = -(o - j) / 2, l = -(q - l) / 2, f.translate(j, l)) : (m = (l - imageHeight) / 2, f.translate((j - o) / 2, m),
                        j = this.canvasObj.b[0], l = this.canvasObj.b[1], m = !0, g.translate(j, l));
                    d = f.globalAlpha;
                    f.globalAlpha = 0;
                    f.fillStyle = "#FFFFFF";
                    f.fill();
                    f.globalAlpha = d;
                    c = f.createPattern(c.nativeImage, "no-repeat");
                    f.fillStyle = c;
                    f.fillRect(0, 0, o, q);
                    c = g.createPattern(i, "no-repeat");
                    g.fillStyle = c
                }
                i = !0
            }
        } else this.canvasObj.bc ? g.fillStyle = this.canvasObj.bc : this.currImage && (p = !0, i = !1);
        i && g.fill();
        (1 != k || 1 != e) && g.scale(1 / k, 1 / e);
        m && g.translate(-j, -l);
        return i || p
    };
    a.DrawingItem.prototype.drawRectangle = function(g, d) {
        var c = 0,
            e = [],
            j = 0,
            l = 0,
            i = 0,
            f = i = 0,
            k = 0,
            e = 0;
        void 0 == this.canvasObj.b || 4 != this.canvasObj.b.length || ((e = this.canvasObj.b, j = e[2] - e[0], l = e[3] - e[1], i = j, l < j && (i = l), void 0 != this.canvasObj.cr && (c = this.canvasObj.cr, c = i * c / 100), i = e[0], f = e[1], k = e[2], e = e[3], a.responsive && (k = Math.round(this.WFactor * (k - i)), e = Math.round(this.HFactor * (e - f)), i = Math.round(this.WFactor * (i - i)), f = Math.round(this.HFactor * (f - f)), l = e - f, j = k - i), 0 != d) ? a.drawDashedRectangle(g, i, f, j, l, c, d) : (g.beginPath(), a.moveTo(g, i, e - c, d), a.lineTo(g, i, f + c, d), 0 < c && a.bezierCurveTo(g,
            i, f + c, i, f, i + c, f, d), a.lineTo(g, i + c, f, d), a.lineTo(g, k - c, f, d), 0 < c && a.bezierCurveTo(g, k - c, f, k, f, k, f + c, d), a.lineTo(g, k, f + c, d), a.lineTo(g, k, e - c, d), 0 < c && a.bezierCurveTo(g, k, e - c, k, e, k - c, e, d), a.lineTo(g, k - c, e, d), a.lineTo(g, i + c, e, d), 0 < c && a.bezierCurveTo(g, i + c, e, i, e, i, e - c, d), g.closePath()))
    };
    a.DrawingItem.prototype.drawOval = function(g, d) {
        var c = [],
            e = c = 0,
            j = 0,
            l = 0,
            i = 0,
            f = 0,
            k = 0,
            m = 0;
        void 0 == this.canvasObj.b || 4 != this.canvasObj.b.length || ((c = this.canvasObj.b, j = c[0], l = c[1], i = c[2], f = c[3], a.responsive && (j *= this.WFactor,
            l *= this.HFactor, i *= this.WFactor, f *= this.HFactor), c = (i - j) / 2, e = (f - l) / 2, k = 0.55285 * c, m = 0.55285 * e, 0 != d) ? a.drawDashedOval(g, (j + i) / 2, (l + f) / 2, c, e, d) : (g.beginPath(), a.moveTo(g, i, l + e, d), a.bezierCurveTo(g, i, l + e + m, j + c + k, f, j + c, f, d), a.bezierCurveTo(g, j + c - k, f, j, l + e + m, j, l + e, d), a.bezierCurveTo(g, j, l + e - m, j + c - k, l, j + c, l, d), a.bezierCurveTo(g, j + c + k, l, i, l + e - m, i, l + e, d), g.closePath()))
    };
    a.DrawingItem.prototype.drawPolygon = function(g, d) {
        var c = null,
            e = this.canvasObj.pta,
            j = 0;
        if (!(void 0 == e || 2 > e.length))
            if (0 != d) a.drawDashedPolyLine(g,
                e, d, this.WFactor, this.HFactor);
            else {
                g.beginPath();
                c = e[0];
                a.moveTo(g, this.WFactor * c.x, this.HFactor * c.y, d);
                for (j = 1; j < e.length; ++j) c = e[j], a.lineTo(g, this.WFactor * c.x, this.HFactor * c.y, d);
                g.closePath()
            }
    };
    a.DrawingItem.prototype.changeStateOnMouseEvents = function(g, d) {
        var c = null; - 1 == this.baseStateItemID ? c = this : this.cloneOfBaseStateItem && (c = a.getDisplayObjByCP_UID(this.baseStateItemID));
        c && void 0 !== c.HandleMouseEventOnStateItems && c.HandleMouseEventOnStateItems(g, this.parentStateType, d)
    };
    a.DrawingItem.prototype.HandleMouseEventOnStateItems =
        function(g, d, c) {
            var e = !1,
                j = a.D[this.parentDivName];
            j && (e = a.isValidItemForStateOptimization({
                n: this.parentDivName,
                t: j.type
            }));
            if ((e || this.parentStateType == a.kSTTNormal) && (!(j && void 0 != j.enabled) || j.enabled)) {
                var j = a.kSTTNone,
                    l = "";
                if (0 <= this.currentState && this.currentState < this.states.length) {
                    var i = this.states[this.currentState];
                    i && (j = i.stt, l = i.stn)
                }
                i = !(a.device == a.IDEVICE || a.device == a.ANDROID) || "mouseup" != g;
                if (!(!e && i && j != d)) {
                    var d = !1,
                        f = "",
                        k = !1;
                    if ("mouseover" == g) {
                        if ((j == a.kSTTNormal || j == a.kSTTCustom ||
                                j == a.kSTTVisited) && this.shouldShowRollOver)
                            if (d = !0, f = a.getLocalisedStateName("kCPRolloverState"), this.stateAtStartOfMouseEvents = l, a.BringBaseItemToFrontWithinState(this, a.getLocalisedStateName("kCPRolloverState")), a.device === a.DESKTOP && (g = a.GetMouseOverManager())) {
                                var m = this;
                                g.addMouseOverItem(this, function() {
                                    m.ForceMouseOut()
                                })
                            }
                    } else if ("mouseout" == g) {
                        if (j == a.kSTTRollOver || j == a.kSTTDown) d = !0, f = this.stateAtStartOfMouseEvents, a.device === a.DESKTOP && (g = a.GetMouseOverManager()) && g.removeMouseOverItem(this);
                        if (j == a.kSTTNormal || j == a.kSTTCustom || j == a.kSTTVisited) a.browser == a.CHROME && this.ignoreMouseOutEventOnNormal ? this.ignoreMouseOutEventOnNormal = !1 : this.shouldShowRollOver = !0
                    } else if ("mousedown" == g) {
                        if (j == a.kSTTNormal || j == a.kSTTRollOver || j == a.kSTTCustom || j == a.kSTTVisited)
                            if (d = !0, f = a.getLocalisedStateName("kCPDownState"), this.bShouldListenForMouseUpOnDownState = !0, j == a.kSTTNormal || j == a.kSTTCustom || j == a.kSTTVisited) this.stateAtStartOfMouseEvents = l, this.ignoreMouseOutEventOnNormal = !0
                    } else if ("mouseup" == g &&
                        (!i || j == a.kSTTDown)) d = !0, f = this.stateAtStartOfMouseEvents, this.shouldShowRollOver = !1, this.bShouldListenForMouseUpOnDownState && (k = !0);
                    d && (f !== a.getLocalisedStateName("kCPRolloverState") && a.ResetItemZIndicesWithinState(this, a.getLocalisedStateName("kCPRolloverState")), a.changeState(this.actualParent.id, f, !1));
                    k && !e && (!a.IsGestureSupportedDevice() && (a.shouldRelaxBrowserCheck(this.parentObj.type) || a.CHROME != a.browser && a.MSIE != a.browser || a.m_isLMSPreview)) && a.dispatchClickEvent(this.actualParent, c, {
                        asPartOfStateChange: !0
                    })
                }
            }
        };
    a.AnswerArea = function(g, d) {
        a.AnswerArea.baseConstructor.call(this, g, d);
        this.canvasElem = this.element
    };
    a.inherits(a.AnswerArea, a.DrawingItem);
    a.RectWithText = function(g, d) {
        a.RectWithText.baseConstructor.call(this, g, d);
        this.canvasElem = this.element;
        this.currImage = this.getAttribute("ip")
    };
    a.inherits(a.RectWithText, a.DrawingItem)
})(window.cp);
cp.AutoShape = function(c, a, d) {
    function f(a, c, d) {
        e.AutoShapeState = 2;
        e.changeStateOnMouseEvents && e.changeStateOnMouseEvents("mousedown", d)
    }

    function i(a, d, c) {
        e.AutoShapeState = 0;
        e.changeStateOnMouseEvents && e.changeStateOnMouseEvents("mouseup", c)
    }

    function g(a, c, d) {
        i(a);
        e.parentData && (e.parentData.dep && 0 < e.parentData.dep.length) && (cp.verbose && cp.log("hiding hint"), e.hintVisible = !1, cp.hideHint(e.parentData.dep[0], a));
        e.changeStateOnMouseEvents && e.changeStateOnMouseEvents("mouseout", d)
    }

    function j(a, d, c) {
        e.AutoShapeState =
            1;
        e.isDrawn = !1;
        e.setVBounds();
        e.changeStateOnMouseEvents && e.changeStateOnMouseEvents("mouseover", c);
        (1 == cp("div_Slide").scaleFactor || !cp.responsive) && e.drawIfNeeded(!0, cp.ReasonForDrawing.kMouseEvent)
    }

    function l(a, c, d) {
        c ? (e.parentData && e.parentData.handCursor && (e.actualParent.style.cursor = "pointer"), !e.hintVisible && (e.parentData && e.parentData.dep && 0 < e.parentData.dep.length) && (cp.verbose && cp.log("showing hint"), e.hintVisible = !0, cp.showHint(e.parentData.dep[0], a)), 0 == e.AutoShapeState && j(a, c, d)) : (e.actualParent.style.cursor =
            "default", e.parentData && (e.parentData.dep && 0 < e.parentData.dep.length) && (cp.log("hiding hint"), e.hintVisible = !1, cp.hideHint(e.parentData.dep[0], a)), 0 != e.AutoShapeState && g(a, c, d))
    }

    function k(a, c, d, f) {
        return function(a) {
            if (void 0 != a && !cp.disableInteractions) {
                var g = a.type.toLowerCase(),
                    i = 0 != e.canvasObj.ss || e.is_inside_canvas(a);
                if ("mousemove" != g) e.clicked = "mousedown" == a.type.toLowerCase();
                else {
                    if (e.clicked || s.x == a.clientX && s.y == a.clientY) return;
                    s.x = a.clientX;
                    s.y = a.clientY
                }
                if (("mousemove" == a.type.toLowerCase() ||
                        "mousedown" == a.type.toLowerCase() || "mouseover" == a.type.toLowerCase() || "touch" == a.type.toLowerCase() || "touchstart" == a.type.toLowerCase()) && !i) d && (cp.device == cp.DESKTOP && "mousemove" == a.type.toLowerCase()) && d(c, i, a);
                else if (g = e, e.cloneOfBaseStateItem && (g = cp.getDisplayObjByCP_UID(e.baseStateItemID)), !g || !(g.parentData && void 0 != g.parentData.enabled) || g.parentData.enabled) f && f(), d && d(c, i, a)
            }
        }
    }
    var e = this;
    this.tMatrixMultiplyPoint = function(a, d, c) {
        return [d * a[0] + c * a[2] + a[4], d * a[1] + c * a[3] + a[5]]
    };
    this.tInvertMatrix =
        function(a) {
            var d = 1 / (a[0] * a[3] - a[1] * a[2]);
            return [a[3] * d, -a[1] * d, -a[2] * d, a[0] * d, d * (a[2] * a[5] - a[3] * a[4]), d * (a[1] * a[4] - a[0] * a[5])]
        };
    this.is_inside_canvas = function(a, d) {
        if (void 0 == a) return !1;
        var c;
        if (!e.element) return !1;
        if ((c = e.canvasObj) && c.svg || c && c.ss && 0 != c.ss) return !0;
        var g = c = void 0,
            f = void 0,
            i = void 0,
            j = void 0;
        if (d && (e.sh && !e.sh.i || e.re))(c = e.element.style.transform) && (e.element.style.transform = ""), (g = e.element.style.WebkitTransform) && (e.element.style.WebkitTransform = ""), (f = e.element.style.MozTransform) &&
            (e.element.style.MozTransform = ""), (i = e.element.style.msTransform) && (e.element.style.msTransform = ""), (j = e.element.style.OTransform) && (e.element.style.OTransform = "");
        var l = e.element.parentElement.getBoundingClientRect(),
            k = e.element.getBoundingClientRect();
        cp("div_Slide").getBoundingClientRect();
        var m = cp.getScaledPosition(getPageX(a), getPageY(a)),
            n = l.left - cp.movie.offset,
            q = l.top - cp.movie.topOffset,
            s = k.left - cp.movie.offset,
            v = k.top - cp.movie.topOffset,
            u = parseFloat(e.element.style.marginLeft),
            w = parseFloat(e.element.style.marginTop),
            u = !isNaN(u) ? u : 0,
            w = !isNaN(w) ? w : 0,
            A = e.element.getContext("2d");
        if (A) {
            if (cp.responsive) z = m.X - window.pageXOffset - k.left, k = m.Y - window.pageYOffset - k.top, z /= cp("div_Slide").scaleFactor, k /= cp("div_Slide").scaleFactor;
            else {
                var z = m.X - window.pageXOffset / cp.movie.m_scaleFactor - (0 > u ? s : n) / cp.movie.m_scaleFactor,
                    k = m.Y - window.pageYOffset / cp.movie.m_scaleFactor - (0 > w ? v : q) / cp.movie.m_scaleFactor;
                cp.shouldScale && (cp.loadedModules.toc && (!cp.toc.movieProperties.tocProperties.overlay && 1 == cp.toc.movieProperties.tocProperties.position) &&
                    (z += cp.toc.movieProperties.tocProperties.width), cp.loadedModules.playbar && !cp.PB.MP.PBP.overlay && (0 == cp.PB.MP.PBP.position ? z += cp.PB.playBarHeight : 1 == cp.PB.MP.PBP.position && (k += cp.PB.playBarHeight)));
                z *= parseFloat(e.element.parentElement.style.width) / l.width * cp.movie.m_scaleFactor;
                k *= parseFloat(e.element.parentElement.style.height) / l.height * cp.movie.m_scaleFactor;
                cp.verbose && (cp.log("lParentOffsetL : " + n + "," + q), cp.log("lElemL : " + s + "," + v), cp.log("lElemMarginL : " + u + w), cp.log("X : " + z + "," + k))
            }
            if (d &&
                (e.sh && !e.sh.i || e.re)) c && (e.element.style.transform = c), g && (e.element.style.WebkitTransform = g), f && (e.element.style.MozTransform = f), i && (e.element.style.msTransform = i), j && (e.element.style.OTransform = j);
            return c = A.isPointInPath(z, k)
        }
        return !1
    };
    this.setVBounds = function() {
        var a = e.canvasObj,
            c = 0;
        a.sw > e.canvasObj.sw && (c = a.sw - e.canvasObj.sw);
        cp.responsive && (c = 0);
        a = e.canvasObj.vbwr;
        e._wrvBounds = {
            minX: a[0] - 2 * c,
            minY: a[1] - 2 * c,
            maxX: a[2] + 2 * c,
            maxY: a[3] + 2 * c,
            width: a[2] - a[0] + 4 * c,
            height: a[3] - a[1] + 4 * c
        };
        a = e.canvasObj.vb;
        e._vbounds = {
            minX: a[0] - 2 * c,
            minY: a[1] - 2 * c,
            maxX: a[2] + 2 * c,
            maxY: a[3] + 2 * c,
            width: a[2] - a[0] + 4 * c,
            height: a[3] - a[1] + 4 * c
        }
    };
    var s = {};
    cp.AutoShape.baseConstructor.call(this, c);
    this.baseItemBoundingRect = null;
    this.visible = this.getAttribute("visible");
    this.parentId = cp.D[a].dn;
    this._parentObj = cp.D[this.parentId];
    this.prevCanvasObj = this._canvasObj = null;
    c = this.currentState;
    if (void 0 != this._parentObj) {
        this._canvasObj = cp.D[this._parentObj.mdi];
        if (this._parentObj.hasOwnProperty("stc") && (c < this._parentObj.stc.length && 0 <=
                c) && (a = cp.D[this._parentObj.stc[c]])) this._canvasObj = cp.D[a.mdi];
        this.prevCanvasObj = this._canvasObj
    }
    this._transIn = this._parentObj.trin;
    this.parentDivName = this.getAttribute("dn");
    this._parentData = cp.D[this.parentDivName];
    this._parentData.isCanvasClicked = this.is_inside_canvas;
    this._parentData.canvasPainterObject = this;
    this.actualParent = a = document.getElementById(this.parentDivName);
    1 !== this._parentData.uab && cp.removeAccessibilityOutline(this.actualParent);
    if (this._canvasObj) {
        var m = this._canvasObj.b;
        this._bounds = {
            minX: m[0],
            minY: m[1],
            maxX: m[2],
            maxY: m[3],
            width: m[2] - m[0],
            height: m[3] - m[1]
        };
        this.args = d;
        this.setVBounds();
        this._sh = this._canvasObj.sh;
        this._re = this._canvasObj.re;
        this._tr = this._canvasObj.tr;
        this._normalImage = this._canvasObj.ip;
        this.prevState = this.AutoShapeState = 0
    }
    a && (a.drawingBoard = this.element.parentElement, a.bounds = this._bounds, a.drawingBoard.bounds = this._vbounds);
    if (a && void 0 != this._parentData.pa && this._bounds) {
        -1 != this._parentData.pa && this._parentData.immo && (cp.movie.stage.currentSlide && (this._parentData.pa =
            cp.movie.stage.currentSlide.to - 1), this.setAttribute("clickedOnce", !1));
        var q = this._bounds.maxX - this._bounds.minX,
            n = this._bounds.maxY - this._bounds.minY,
            m = d = 1,
            u = 0,
            w = 0;
        10 < q && (d = (q - 4) / q);
        10 < n && (m = (n - 4) / n);
        if (1 > d && 1 > m) {
            var u = !1,
                u = cp.responsive ? this.sh && !this.sh.i : this.sh && !this.sh.i || this.re,
                v = (u && cp.D.project.w > this._vbounds.maxX ? cp.D.project.w : this._vbounds.maxX) - (0 < this._vbounds.minX && u ? 0 : this._vbounds.minX),
                w = (u && cp.D.project.h > this._vbounds.maxY ? cp.D.project.h : this._vbounds.maxY) - (0 < this._vbounds.minY &&
                    u ? 0 : this._vbounds.minY),
                n = (this._vbounds.maxX + this._vbounds.minX) / 2,
                q = (this._vbounds.maxY + this._vbounds.minY) / 2,
                v = v / 2 - (v / 2 - n) * d,
                w = w / 2 - (w / 2 - q) * m;
            u ? (u = v - n, w -= q) : w = u = 0;
            this.oldMouseOver = a.onmouseover;
            this.oldMouseOut = a.onmouseout;
            this.dataObjForMouseStates = {
                sx: d,
                sy: m,
                tx: -u,
                ty: -w,
                p: a,
                old_tr: this.tr
            };
            d = window.event || Event;
            cp.device == cp.IDEVICE || cp.device == cp.ANDROID ? (this.ontouchstartHandler = k(d, this.element, f), this.ontouchendHandler = k(d, this.element, i), a.ontouchstart = k(d, this.element, f), a.ontouchend =
                k(d, this.element, i)) : (a.onmouseover = k(d, this.element, j, a.onmouseover), a.onmousemove = k(d, this.element, l, a.onmousemove), a.onmouseout = k(d, this.element, g, a.onmouseout), a.onmousedown = k(d, this.element, f), a.onmouseup = k(d, this.element, i), this.onmouseoverHandler = a.onmouseover, this.onmousemoveHandler = a.onmousemove, this.onmouseoutHandler = a.onmouseout, this.onmousedownHandler = a.onmousedown, this.onmouseupHandler = a.onmouseup);
            this.shouldShowRollOver = !0;
            this.setUpClickHandler()
        }
    }
    this.isDrawn = !1;
    cp.responsive && (this._responsiveCSS =
        this._canvasObj.css);
    !1 == this.cloneOfBaseStateItem && -1 != this.baseStateItemID && (this.playEffectsOnStart = !0);
    cp.setInitialVisibility(this);
    if (this._parentData.hasOwnProperty("stc")) {
        a = this._parentData.stc;
        for (d = 0; d < a.length; ++d) d != c && cp._hideData(a[d])
    }
};
cp.inherits(cp.AutoShape, cp.DisplayObject);
Object.defineProperties(cp.AutoShape.prototype, {
    canvasObj: {
        get: function() {
            return this._canvasObj
        },
        set: function(c) {
            this.prevCanvasObj = this._canvasObj;
            this._canvasObj = c;
            this.prevCanvasObj.dn !== this._canvasObj.dn && (this._transIn = this._parentObj = this._normalImage = this._tr = this._re = this._sh = this._wrvBounds = this._vbounds = this._bounds = this._responsiveCSS = this._parentData = null, this.isDrawn = !1, c = this.canvasSwitchReason, this._canvasObj.visible = !0, this.drawIfNeeded(!0, c ? c : cp.ReasonForDrawing.kItemStateChanged),
                cp.updateVarText(this.actualParent, !0, !0))
        }
    },
    parentData: {
        get: function() {
            this._parentData || (this._parentData = cp.D[this.canvasObj.dn]);
            return this._parentData
        },
        set: function(c) {
            this._parentData = c
        }
    },
    responsiveCSS: {
        get: function() {
            this._responsiveCSS || (this._responsiveCSS = this.canvasObj.css);
            return this._responsiveCSS
        },
        set: function(c) {
            this._responsiveCSS = c
        }
    },
    bounds: {
        get: function() {
            if (!this._bounds) {
                var c = this.canvasObj.b;
                this._bounds = {
                    minX: c[0],
                    minY: c[1],
                    maxX: c[2],
                    maxY: c[3],
                    width: c[2] - c[0],
                    height: c[3] -
                        c[1]
                }
            }
            return this._bounds
        },
        set: function(c) {
            this._bounds = c
        }
    },
    vbounds: {
        get: function() {
            if (!this._vbounds) {
                var c = 0;
                this.prevCanvasObj.sw > this.canvasObj.sw && (c = this.prevCanvasObj.sw - this.canvasObj.sw);
                cp.responsive && (c = 0);
                var a = this.canvasObj.vb;
                this._vbounds = {
                    minX: a[0] - 2 * c,
                    minY: a[1] - 2 * c,
                    maxX: a[2] + 2 * c,
                    maxY: a[3] + 2 * c,
                    width: a[2] - a[0] + 4 * c,
                    height: a[3] - a[1] + 4 * c
                }
            }
            return this._vbounds
        },
        set: function(c) {
            this._vbounds = c
        }
    },
    wrvBounds: {
        get: function() {
            if (!this._wrvBounds) {
                var c = 0;
                this.prevCanvasObj.sw > this.canvasObj.sw &&
                    (c = this.prevCanvasObj.sw - this.canvasObj.sw);
                cp.responsive && (c = 0);
                var a = this.canvasObj.vbwr;
                this._wrvBounds = {
                    minX: a[0] - 2 * c,
                    minY: a[1] - 2 * c,
                    maxX: a[2] + 2 * c,
                    maxY: a[3] + 2 * c,
                    width: a[2] - a[0] + 4 * c,
                    height: a[3] - a[1] + 4 * c
                }
            }
            return this._wrvBounds
        },
        set: function(c) {
            this._wrvBounds = c
        }
    },
    sh: {
        get: function() {
            this._sh || (this._sh = this.canvasObj.sh);
            return this._sh
        },
        set: function(c) {
            this._sh = c
        }
    },
    re: {
        get: function() {
            this._re || (this._re = this.canvasObj.re);
            return this._re
        },
        set: function(c) {
            this._re = c
        }
    },
    tr: {
        get: function() {
            this._tr ||
                (this._tr = this.canvasObj.tr);
            return this._tr
        },
        set: function(c) {
            this._tr = c
        }
    },
    normalImage: {
        get: function() {
            this._normalImage || (this._normalImage = this.canvasObj.ip);
            return this._normalImage
        },
        set: function(c) {
            this._normalImage = c
        }
    },
    parentObj: {
        get: function() {
            this._parentObj || (this._parentObj = cp.D[this.canvasObj.dn]);
            return this._parentObj
        },
        set: function(c) {
            this._parentObj = c
        }
    },
    transIn: {
        get: function() {
            this._transIn || (this._transIn = this.parentObj.trin);
            return this._transIn
        },
        set: function(c) {
            this._transIn = c
        }
    }
});
cp.AutoShape.prototype.start = function(c, a) {
    this.drawIfNeeded(c, a);
    if (!this.effectIsStarted || c) this.areDimensionsCalculated = !1, this.updateEffects(this.hasEffect), this.effectIsStarted = !0
};
cp.AutoShape.prototype.reset = function() {
    delete cp.ropMap[this.element.id];
    this.isDrawn = !1;
    this.element.width = "0";
    this.element.height = "0";
    this.element.style.width = "0px";
    this.element.style.height = "0px";
    this.element.left = "0";
    this.element.top = "0";
    this.element.style.left = "0px";
    this.element.style.top = "0px";
    this.removeMouseHandlers(!0);
    this.effectIsStarted = !1;
    this.parentData.canvasPainterObject = null;
    this.parentData.isCanvasClicked = null
};
cp.AutoShape.prototype.getCurrentCanvasObj = function() {
    if (this.canvasObj && this.canvasObj.b && this.canvasObj.p0) return this.canvasObj
};
cp.AutoShape.prototype.addMouseHandlers = function() {
    cp.device == cp.IDEVICE || cp.device == cp.ANDROID ? (cp.registerGestureEvent(this.actualParent, cp.GESTURE_EVENT_TYPES.TOUCH, this.ontouchstartHandler), cp.registerGestureEvent(this.actualParent, cp.GESTURE_EVENT_TYPES.RELEASE, this.ontouchendHandler)) : (this.actualParent.onmouseover = this.onmouseoverHandler, this.actualParent.onmousemove = this.onmousemoveHandler, this.actualParent.onmouseout = this.onmouseoutHandler, this.actualParent.onmousedown = this.onmousedownHandler,
        this.actualParent.onmouseup = this.onmouseupHandler)
};
cp.AutoShape.prototype.removeMouseHandlers = function(c) {
    if (this.actualParent)
        if (this.actualParent.onclick = null, cp.device == cp.IDEVICE || cp.device == cp.ANDROID) cp.removeGestureEvent(this.actualParent, cp.GESTURE_EVENT_TYPES.TOUCH, this.ontouchstartHandler), cp.removeGestureEvent(this.actualParent, cp.GESTURE_EVENT_TYPES.RELEASE, this.ontouchendHandler), c && (this.ontouchendHandler = this.ontouchstartHandler = null);
        else if (this.actualParent.onmouseout = null, this.actualParent.onmousedown = null, this.actualParent.onmouseup =
        null, this.actualParent.onmouseover = null, this.oldMouseOver && (this.actualParent.onmouseover = this.oldMouseOver), this.oldMouseOut) this.actualParent.onmouseout = this.oldMouseOut;
    c && (this.oldMouseOut = this.oldMouseOver = null)
};
cp.AutoShape.prototype.setUpClickHandler = function() {
    var c = this,
        a = !1,
        d = !1,
        a = !1,
        f = cp.movie.stage.currentSlide;
    if (this.actualParent && f) {
        if ((a = "Question Slide" == f.st) && f.qs)(f = cp.D[f.qs]) && "Hotspot" == f.qtp && (d = !0);
        (a = a && !d) && !this.actualParent.onclick ? cp.registerGestureEvent(this.actualParent, cp.GESTURE_EVENT_TYPES.TAP, function(a) {
            return function(d) {
                c.is_inside_canvas(d) && cp.clickSuccessHandler(a)
            }
        }(this.parentData)) : (this.actualParent.onclick = null, cp.removeGestureEvent(this.actualParent, cp.GESTURE_EVENT_TYPES.TAP))
    }
    this.needsOwnHandler =
        a
};

function getTransformDataForMouseStates(c, a) {
    if (cp.responsive) {
        var d = c.getBoundingClientRect(),
            f = c.parentElement.getBoundingClientRect(),
            i = a.actualParent.getBoundingClientRect(),
            g = cp("div_Slide").getBoundingClientRect(),
            j = i.width,
            l = i.height,
            k = i = 1,
            e = 0,
            s = 0;
        10 < j && (i = (j - 4) / j);
        10 < l && (k = (l - 4) / l);
        1 > i && 1 > k && (j = cp.project.clientWidth, l = cp.project.clientHeight, e = !1, e = a.sh && !a.sh.i, j = (e && j > d.right - g.left ? j : d.right - g.left) - (0 < d.left - g.left && e ? 0 : d.left - g.left), d = (e && l > d.bottom - g.top ? l : d.bottom - g.top) - (0 < d.top - g.top &&
            e ? 0 : d.top - g.top), l = f.left - g.left + f.width / 2, f = f.top - g.top + f.height / 2, e ? (e = j / 2 - (j / 2 - l) * i - l, s = d / 2 - (d / 2 - f) * k - f) : s = e = 0);
        return {
            sx: i,
            sy: k,
            tx: -e,
            ty: -s,
            p: a.actualParent,
            old_tr: a.tr
        }
    }
}
cp.AutoShape.prototype.shrinkShapeButtonInAllStates = function() {
    for (var c = cp.GetBaseItemsInAllStates(this, !0), a = 0; a < c.length; a++) {
        var d = c[a];
        d && d.shrinkShapeButton()
    }
};
cp.AutoShape.prototype.expandShapeButtonInAllStates = function() {
    for (var c = cp.GetBaseItemsInAllStates(this, !0), a = 0; a < c.length; a++) {
        var d = c[a];
        d && d.expandShapeButton()
    }
};
cp.AutoShape.prototype.shrinkShapeButton = function() {
    if (this.dataObjForMouseStates) {
        var c = {
            sx: this.dataObjForMouseStates.sx,
            sy: this.dataObjForMouseStates.sy,
            tx: this.dataObjForMouseStates.tx,
            ty: this.dataObjForMouseStates.ty,
            p: this.dataObjForMouseStates.p,
            old_tr: this.dataObjForMouseStates.old_tr
        };
        cp.responsive && (c = getTransformDataForMouseStates(this.element, this));
        c = "translate(" + c.tx / cp("div_Slide").scaleFactor + "px," + c.ty / cp("div_Slide").scaleFactor + "px) scalex(" + c.sx + ") scaley(" + c.sy + ")";
        cp.applyTransform(this.element,
            c);
        this.setVBounds();
        (1 == cp("div_Slide").scaleFactor || !cp.responsive) && this.drawIfNeeded(!0, cp.ReasonForDrawing.kMouseEvent)
    }
};
cp.AutoShape.prototype.expandShapeButton = function() {
    this.dataObjForMouseStates && (cp.applyTransform(this.element, ""), this.setVBounds(), (1 == cp("div_Slide").scaleFactor || !cp.responsive) && this.drawIfNeeded(!0, cp.ReasonForDrawing.kMouseEvent))
};
cp.AutoShape.prototype.restOfProjectDoOnNewSlide = function() {
    this.addMouseHandlers();
    this.setUpClickHandler()
};
cp.AutoShape.prototype.drawForResponsive = function(c, a) {
    if (!this.responsiveCSS) return !1;
    if (this.isDrawn && !c) return cp.initializeVisibilityForGroupedItem(this), !0;
    var d = cp.getResponsiveCSS(this.responsiveCSS);
    cp.getCSSFromLayouter(d, this);
    var f = !1,
        f = this.sh && !this.sh.i,
        i = void 0 != this.tr;
    if (this.currentCSS == d && c && this.isDrawn && a == cp.ReasonForDrawing.kMoviePaused) return cp.verbose && cp.log("Returning because this.isDrawn : " + this.isDrawn), !0;
    var g = a === cp.ReasonForDrawing.kItemStateChanged || a === cp.ReasonForDrawing.kGettingBoundingRectInBaseState ||
        a === cp.ReasonForDrawing.kLinkedToItemAppeared;
    this.currentCSS = d;
    var j = this.canvasObj,
        l = this.prevCanvasObj,
        k = d,
        e = this.actualParent.style.transform || this.actualParent.style.msTransform || this.actualParent.style.MozTransform || this.actualParent.style.WebkitTransform || this.actualParent.style.OTransform,
        s = this.element.parentElement.style.transform || this.element.parentElement.style.msTransform || this.element.parentElement.style.MozTransform || this.element.parentElement.style.WebkitTransform || this.element.parentElement.style.OTransform;
    cp.applyTransform(this.actualParent, "");
    cp.applyTransform(this.element.parentElement, "");
    cp.applyResponsiveStyles(this.actualParent, d, !0, g, void 0, a);
    var m = this.parentData;
    if (m.rpvt && m.autoGrow && (a == cp.ReasonForDrawing.kTextGrow || a == cp.ReasonForDrawing.kLinkedToItemAppeared || a == cp.ReasonForDrawing.kMouseEvent || a == cp.ReasonForDrawing.kMoviePaused) && !cp.isPartOfFlex(this)) {
        var q = m.minItemHeight;
        q && this.actualParent.clientHeight < q && (this.actualParent.style.height = q + "px");
        cp.createResponsiveStyleObj(d,
            d.p, d.l, d.t, d.r, d.b, this.actualParent.clientWidth + "px", this.actualParent.clientHeight + "px", d.crop)
    }
    m.minItemHeight = this.actualParent.clientHeight;
    this.actualParent.offsetHeight = this.actualParent.offsetHeight;
    this.actualParentClientBoundingRect = cp.GetBoundingClientRectForElem(this.actualParent, g);
    var n = cp.GetBoundingClientRectForElem(cp.movie.stage.mainSlideDiv, g);
    this.HFactor = this.WFactor = 1;
    this.WFactor = Math.round(1E4 * this.actualParent.clientWidth / this.bounds.width) / 1E4;
    this.HFactor = Math.round(1E4 *
        this.actualParent.clientHeight / this.bounds.height) / 1E4;
    var u, w, v, y, q = this.wrvBounds.minY - this.bounds.minY;
    u = (this.wrvBounds.minX - this.bounds.minX) * this.WFactor;
    w = q * this.HFactor;
    v = this.wrvBounds.width * this.WFactor;
    y = this.wrvBounds.height * this.HFactor;
    k = cp.createResponsiveStyleObj(d, d.p, this.actualParentClientBoundingRect.left - n.left + u - j.sw / 2 + "px", this.actualParentClientBoundingRect.top - n.top + w - j.sw / 2 + "px", "0px", "0px", v + j.sw + "px", y + j.sw + "px", d.crop);
    cp.applyResponsiveStyles(this.element.parentElement,
        k);
    this.parentElementClientBoundingRect = cp.GetBoundingClientRectForElem(this.element.parentElement, g);
    q = 0;
    if (this.tr) {
        q = cp.getAngleFromRotateStr(this.tr);
        this.actualParent.offsetHeight = this.actualParent.offsetHeight;
        if (!this.m_centrePoint || a == cp.ReasonForDrawing.kOrientationChangeOrResize || a == cp.ReasonForDrawing.kLinkedToItemAppeared || a == cp.ReasonForDrawing.kItemStateChanged || a == cp.ReasonForDrawing.kGettingBoundingRectInBaseState) this.m_centrePoint = cp.getCenterForRotation(this.actualParent, a == cp.ReasonForDrawing.kItemStateChanged);
        this.actualParentClientBoundingRect = cp.GetBoundingClientRectForElem(this.actualParent, g);
        var x = cp.getBoundsForRotatedItem1(this.parentElementClientBoundingRect.left - n.left, this.parentElementClientBoundingRect.top - n.top, this.parentElementClientBoundingRect.width, this.parentElementClientBoundingRect.height, this.m_centrePoint, q, j.sw),
            p = t = r = b = void 0;
        "auto" != d.l && (p = x.l);
        "auto" != d.t && (t = x.t);
        "auto" != d.r && (r = x.r);
        "auto" != d.b && (b = x.b);
        k = cp.createResponsiveStyleObj(k, d.p, p, t, r, b, x.w, x.h, d.crop);
        cp.applyResponsiveStyles(this.element.parentElement,
            k)
    }
    this.parentElementClientBoundingRect = cp.GetBoundingClientRectForElem(this.element.parentElement, g);
    x = g = 0;
    this.m_centrePoint && (g = this.m_centrePoint.X - (this.actualParentClientBoundingRect.left - n.left), x = this.m_centrePoint.Y - (this.actualParentClientBoundingRect.top - n.top));
    if (m.rpvt) {
        var k = this.actualParent.clientWidth,
            m = this.actualParent.clientHeight,
            p = this.actualParent.id + "_vTxtHandlerHolder",
            o = cp(p);
        o || (o = cp.newElem("div"), o.id = p, o.style.display = "block", o.style.position = "absolute", o.style.visibility =
            "hidden", this.actualParent.appendChild(o));
        o.style.left = "0px";
        o.style.top = "0px";
        o.style.width = k + "px";
        o.style.height = m + "px";
        o = this.actualParent.id + "_vTxtHolder";
        p = cp(o);
        p || (p = cp.newElem("div"), p.id = o, p.style.display = "block", p.style.position = "absolute", p.style.zIndex = 1, this.element.parentElement.appendChild(p));
        p.style.left = this.actualParentClientBoundingRect.left - this.parentElementClientBoundingRect.left + "px";
        p.style.top = this.actualParentClientBoundingRect.top - this.parentElementClientBoundingRect.top +
            "px";
        p.style.width = k + "px";
        p.style.height = m + "px";
        (a == cp.ReasonForDrawing.kOrientationChangeOrResize || a == cp.ReasonForDrawing.kItemStateChanged || a == cp.ReasonForDrawing.kGettingBoundingRectInBaseState) && cp.updateVarText(this.actualParent, !0, !0);
        if (this.tr) o = "center center", o = (g ? 100 * g / k + "%" : "center") + " ", o = x ? o + (100 * x / m + "%") : o + "center", p.style["-ms-transform-origin"] = o, p.style["-moz-transform-origin"] = o, p.style["-webkit-transform-origin"] = o, p.style["-o-transform-origin"] = o, p.style["transform-origin"] = o,
            cp.applyTransform(p, this.tr);
        else if ((a === cp.ReasonForDrawing.kItemStateChanged || a === cp.ReasonForDrawing.kGettingBoundingRectInBaseState) && l && l.tr) o = "initial", p.style["-ms-transform-origin"] = o, p.style["-moz-transform-origin"] = o, p.style["-webkit-transform-origin"] = o, p.style["-o-transform-origin"] = o, p.style["transform-origin"] = o, k = p.style.transform || p.style.msTransform || p.style.MozTransform || p.style.WebkitTransform || p.style.OTransform, k = k.replace(l.tr, ""), cp.applyTransform(p, k)
    }
    cp.applyTransform(this.actualParent,
        e);
    cp.applyTransform(this.element.parentElement, s);
    e = this.actualParent;
    m = s = 0;
    s = v + 2 * j.sw;
    m = y + 2 * j.sw;
    f ? (v = this.element.parentElement.clientWidth, y = this.element.parentElement.clientHeight, k = cp("div_Slide").clientWidth, p = cp("div_Slide").clientHeight, s = s > k ? s : k, m = m > p ? m : p, s = s > v ? s : v, m = m > y ? m : y) : (s = Math.ceil(parseFloat(this.element.parentElement.style.width)), m = Math.ceil(parseFloat(this.element.parentElement.style.height)));
    k = cp.createResponsiveStyleObj(d, void 0, "0px", "0px", "0px", "0px", s + "px", m + "px", void 0);
    v = this.parentElementClientBoundingRect.left - n.left;
    y = this.parentElementClientBoundingRect.top - n.top;
    s = this.canvas = cp.createResponsiveCanvas(k, s, m, this.element);
    this.isParentOfTypeSlide || (f ? (this.element.style.marginLeft = (0 > v ? 0 : -1) * v + "px", this.element.style.marginTop = (0 > y ? 0 : -1) * y + "px") : (this.element.style.marginLeft = "0px", this.element.style.marginTop = "0px"));
    if (this.re) this.element.parentElement.style.webkitBoxReflect = "below " + this.re.d + "px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(" +
        (1 - this.re.s / 100) + ", transparent), to(rgba(255, 255, 255, " + (1 - this.re.p / 100) + ")))";
    else if ((a === cp.ReasonForDrawing.kItemStateChanged || a == cp.ReasonForDrawing.kGettingBoundingRectInBaseState) && l && l.re) this.element.parentElement.style.webkitBoxReflect = "unset";
    cp.movie.stage.addToParentChildMap(e.id, this.element.id);
    this.element.originalParent = e;
    n = s.gc;
    n.crop = d.crop ? d.crop : void 0;
    n.save();
    f ? (n.setTransform(1, 0, 0, 1, 0 > v ? -v : 0, 0 > y ? -y : 0), n.translate(v, y), n.shadowOffsetX = this.sh.d * Math.cos(cp.PIBy180 * this.sh.a),
        n.shadowOffsetY = this.sh.d * Math.sin(cp.PIBy180 * this.sh.a), n.shadowBlur = this.sh.b, d = this.sh.o, 1 == d && (d = 0.999), n.shadowColor = cp.ConvertRGBToRGBA(this.sh.c, d)) : i || (n.translate(-u, -w), n.translate(j.sw / 2, j.sw / 2));
    this.element.style.display = "block";
    this.element.style.position = "absolute";
    n = s.gc;
    n.save();
    if (this.tr) o = g ? 100 * g / e.clientWidth + "%" : "center", o += " ", o = x ? o + (100 * x / e.clientHeight + "%") : o + "center", e.style["-ms-transform-origin"] = o, e.style["-moz-transform-origin"] = o, e.style["-webkit-transform-origin"] =
        o, e.style["-o-transform-origin"] = o, e.style["transform-origin"] = o, cp.applyTransform(e, this.tr), e.tr = this.tr;
    else if ((a === cp.ReasonForDrawing.kItemStateChanged || a == cp.ReasonForDrawing.kGettingBoundingRectInBaseState) && l && l.tr) k = e.style.transform || e.style.msTransform || e.style.MozTransform || e.style.WebkitTransform || e.style.OTransform, k = k.replace(l.tr, ""), cp.applyTransform(e, k), e.tr = void 0;
    e.rotateAngle = q;
    if (f || i) f = this.element.parentElement.clientWidth / 2, i = this.element.parentElement.clientHeight / 2, f =
        this.actualParentClientBoundingRect.left - this.parentElementClientBoundingRect.left + g, i = this.actualParentClientBoundingRect.top - this.parentElementClientBoundingRect.top + x, n.translate(f, i), 0 != q ? n.rotate(cp.PIBy180 * q) : n.rotate(0.02 * cp.PIBy180), n.translate(-g, -x);
    n.clearRect(0, 0, this.element.getBoundingClientRect().width, this.element.getBoundingClientRect().height);
    cp.DESKTOP == cp.device && (cp.MSIE == cp.browser || cp.MSEDGE == cp.browser || cp.FIREFOX == cp.browser) && n.beginPath();
    f = 0;
    void 0 != j.ss && (f = j.ss);
    i = 1;
    void 0 != j.fa && (i = j.fa / 100);
    void 0 != this.normalImage && 1 != i && (j = cp.movie.im.images[this.normalImage]) && j.nativeImage.complete && n.drawImage(j.nativeImage, -j.nativeImage.width / 2, -j.nativeImage.height / 2, j.nativeImage.width, j.nativeImage.height);
    if ((f = this.draw(n, f)) && void 0 != this.normalImage)(j = cp.movie.im.images[this.normalImage]) && j.nativeImage.complete ? (this.sh && !this.sh.i && (n.shadowOffsetX = 0, n.shadowOffsetY = 0, n.shadowBlur = 0, n.shadowColor = "rgba(0,0,0,0)"), n.drawImage(j.nativeImage, -j.nativeImage.width /
        2, -j.nativeImage.height / 2, j.nativeImage.width, j.nativeImage.height)) : f = !1;
    n.restore();
    this.transIn && a == cp.ReasonForDrawing.kRegularDraw && (this.element.parentElement.style.opacity = 0);
    this.isDrawn = f;
    !0 == this.isDrawn && this.drawComplete(a);
    void 0 != this.parentData.enabled && !this.parentData.enabled && this.removeMouseHandlers();
    cp.isVisible(this) || cp._hide(this.parentDivName);
    cp.isVisible(this) && this.playEffectsOnStart && ((j = this.parentData.selfAnimationScript) && eval(j), this.playEffectsOnStart = !1);
    return !0
};
cp.AutoShape.prototype.drawIfNeeded = function(c, a) {
    if ((!cp.responsive || !this.drawForResponsive(c, a)) && !this.isDrawn) {
        this.HFactor = this.WFactor = 1;
        var d = this.canvasObj,
            f = this.bounds,
            i = d.sw;
        void 0 == i && (i = 1);
        1 != i && void 0 == this.vbounds && (this.vbounds.minX += 3 * i / 2, this.vbounds.minY += 3 * i / 2, this.vbounds.maxX -= 3 * i / 2, this.vbounds.maxY -= 3 * i / 2);
        var g = this.vbounds,
            j = f.minX,
            l = f.minY,
            k = f.maxX - f.minX,
            e = f.maxY - f.minY,
            i = this.actualParent;
        i.style.left = j + "px";
        i.style.top = l + "px";
        i.style.width = k + "px";
        i.style.height = e + "px";
        var e = !1,
            e = this.re || this.sh && !this.sh.i,
            j = 0 < g.minX && e ? 0 : g.minX,
            l = 0 < g.minY && e ? 0 : g.minY,
            s = e && cp.D.project.h > g.maxY ? cp.D.project.h : g.maxY,
            k = (e && cp.D.project.w > g.maxX ? cp.D.project.w : g.maxX) - j,
            g = this.canvas = cp.createCanvas(0, 0, k, s - l, this.element);
        this.element.style.display = "block";
        this.element.style.position = "absolute";
        this.element.parentElement.style.left = this.vbounds.minX + "px";
        this.element.parentElement.style.top = this.vbounds.minY + "px";
        this.element.parentElement.style.width = this.vbounds.maxX - this.vbounds.minX +
            "px";
        this.element.parentElement.style.height = this.vbounds.maxY - this.vbounds.minY + "px";
        this.element.style.marginLeft = j - this.vbounds.minX + "px";
        this.element.style.marginTop = l - this.vbounds.minY + "px";
        this.element.parentElement.style.webkitBoxReflect = this.re ? "below " + this.re.d + "px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(" + (1 - this.re.s / 100) + ", transparent), to(rgba(255, 255, 255, " + (1 - this.re.p / 100) + ")))" : "unset";
        cp.movie.stage.addToParentChildMap(i.id, this.element.id);
        this.element.originalParent = i;
        g = g.gc;
        g.clearRect(0, 0, this.element.getBoundingClientRect().width, this.element.getBoundingClientRect().height);
        cp.DESKTOP == cp.device && (cp.MSIE == cp.browser || cp.FIREFOX == cp.browser || cp.MSEDGE == cp.browser) && g.beginPath();
        g.save();
        e ? g.setTransform(1, 0, 0, 1, 0 > j ? -j : 0, 0 > l ? -l : 0) : g.translate(-this.vbounds.minX, -this.vbounds.minY);
        this.sh && !this.sh.i && (g.shadowOffsetX = this.sh.d * Math.cos(cp.PIBy180 * this.sh.a), g.shadowOffsetY = this.sh.d * Math.sin(cp.PIBy180 * this.sh.a), g.shadowBlur =
            this.sh.b, j = this.sh.o, 1 == j && (j = 0.999), g.shadowColor = cp.ConvertRGBToRGBA(this.sh.c, j));
        this.element.style.display = "block";
        this.element.style.position = "absolute";
        j = 0;
        this.tr && (cp.applyTransform(i, this.tr), i.tr = this.tr, j = cp.getAngleFromRotateStr(this.tr));
        i.rotateAngle = j;
        if (this.sh || 0 != j) g.translate((f.minX + f.maxX) / 2, (f.minY + f.maxY) / 2), 0 != j ? g.rotate(cp.PIBy180 * j) : g.rotate(0.02 * cp.PIBy180), g.translate(-(f.minX + f.maxX) / 2, -(f.minY + f.maxY) / 2);
        i = 0;
        void 0 != d.ss && (i = d.ss);
        j = 1;
        void 0 != d.fa && (j = d.fa / 100);
        if (void 0 !=
            this.normalImage && 1 != j && (d = cp.movie.im.images[this.normalImage]) && d.nativeImage.complete) g.translate((f.minX + f.maxX) / 2, (f.minY + f.maxY) / 2), g.drawImage(d.nativeImage, -d.nativeImage.width / 2, -d.nativeImage.height / 2, d.nativeImage.width, d.nativeImage.height), g.translate(-(f.minX + f.maxX) / 2, -(f.minY + f.maxY) / 2);
        if ((i = this.draw(g, i)) && void 0 != this.normalImage)(d = cp.movie.im.images[this.normalImage]) && d.nativeImage.complete ? (this.sh && !this.sh.i && (g.shadowOffsetX = 0, g.shadowOffsetY = 0, g.shadowBlur = 0, g.shadowColor =
            "rgba(0,0,0,0)"), g.translate((f.minX + f.maxX) / 2, (f.minY + f.maxY) / 2), g.drawImage(d.nativeImage, -d.nativeImage.width / 2, -d.nativeImage.height / 2, d.nativeImage.width, d.nativeImage.height)) : i = !1;
        g.restore();
        this.transIn && a == cp.ReasonForDrawing.kRegularDraw && (this.element.parentElement.style.opacity = 0);
        this.isDrawn = i;
        !0 == this.isDrawn && this.drawComplete(a);
        void 0 != this.parentData.enabled && !this.parentData.enabled && this.removeMouseHandlers();
        cp.isVisible(this) || cp._hide(this.parentDivName);
        cp.isVisible(this) &&
            this.playEffectsOnStart && ((f = this.parentData.selfAnimationScript) && eval(f), this.playEffectsOnStart = !1)
    }
};
cp.AutoShape.prototype.draw = function(c, a) {
    if (this.canvasObj.svg) return this.drawSVGShape(c), !0;
    var d = !1;
    this.drawFillBoundary(c, !0);
    var f = this.canvasObj;
    if (f) {
        d = 1;
        void 0 != f.fa && (d = f.fa / 100);
        var i = c.globalAlpha;
        0 != a && 0 < f.sw && (c.globalAlpha = d, this.setFill(c), c.globalAlpha = i, this.drawBoundary(c, a));
        c.globalAlpha = d;
        d = this.setFill(c);
        c.globalAlpha = i;
        0 == a && 0 < f.sw && this.drawFillBoundary(c, !1);
        0 < f.sw && (c.lineWidth = f.sw, c.strokeStyle = f.sc, c.stroke());
        0 != f.sw && (c.shadowOffsetX = 0, c.shadowOffsetY = 0, c.shadowBlur =
            0, c.shadowColor = "rgba(0,0,0,0)", c.stroke());
        return d
    }
};
cp.AutoShape.prototype.drawSVGShape = function(c) {
    var a = null,
        d = this.canvasObj.p0,
        f = 0,
        i = 1,
        g = 1;
    if (d)
        for (f = 0; f < d.length; ++f)
            if (a = d[f], !(0 >= a.length)) switch (a[0]) {
                case cp.kBeginPath:
                    this.canvasObj.svg && c.beginPath();
                    break;
                case cp.kMoveTo:
                    c.moveTo(a[1] * this.WFactor, a[2] * this.HFactor);
                    break;
                case cp.kLineTo:
                    c.lineTo(a[1] * this.WFactor, a[2] * this.HFactor);
                    break;
                case cp.kBezierTo:
                    c.bezierCurveTo(a[1] * this.WFactor, a[2] * this.HFactor, a[3] * this.WFactor, a[4] * this.HFactor, a[5] * this.WFactor, a[6] * this.HFactor);
                    break;
                case cp.kClosePath:
                    c.closePath();
                    break;
                case cp.kPathFillData:
                    if (this.canvasObj.svg)
                        if (a = a[1], a.indexOf("gf")) a = eval("{" + a + "}"), c.fillStyle = a;
                        else {
                            var j = {},
                                a = a.substr(3);
                            j.gf = eval("(" + a + ")");
                            if (j.gf && (a = cp.getGradientFill(j.gf, c, this.WFactor, this.HFactor))) c.fillStyle = a
                        }
                    break;
                case cp.kPathFillAlpha:
                    i = a[1];
                    break;
                case cp.KPathStrokeColor:
                    c.strokeStyle = "#" + a[1];
                    break;
                case cp.KPathStrokeWidth:
                    a = a[1];
                    j = c.globalAlpha;
                    c.globalAlpha = i;
                    c.fill();
                    a && (c.lineWidth = a, c.globalAlpha = g, c.stroke());
                    c.globalAlpha = j;
                    break;
                case cp.KPathStrokeAlpha:
                    g = a[1]
            }
};
cp.AutoShape.prototype.drawFillBoundary = function(c, a) {
    var d = null,
        f = this.canvasObj.p0,
        i = 0;
    if (f)
        for (i = 0; i < f.length; ++i)
            if (d = f[i], !(0 >= d.length)) switch (d[0]) {
                case cp.kMoveTo:
                    c.moveTo(d[1] * this.WFactor, d[2] * this.HFactor);
                    break;
                case cp.kLineTo:
                    c.lineTo(d[1] * this.WFactor, d[2] * this.HFactor);
                    break;
                case cp.kBezierTo:
                    c.bezierCurveTo(d[1] * this.WFactor, d[2] * this.HFactor, d[3] * this.WFactor, d[4] * this.HFactor, d[5] * this.WFactor, d[6] * this.HFactor);
                    break;
                case cp.kClosePath:
                    c.closePath();
                    break;
                case cp.kNotClosed:
                    if (!a) break;
                case cp.kNoStroke:
                    i < f.length - 1 && (d = f[++i][0], cp.kBeginPath != d && --i);
                    for (; i < f.length - 1;)
                        if (d = f[++i][0], cp.kNotClosed == d || cp.kNoStroke == d || cp.kBeginPath == d) {
                            --i;
                            break
                        }
            }
};
cp.AutoShape.prototype.drawBoundary = function(c, a) {
    var d = null,
        f = this.canvasObj.p0,
        i = 0,
        g = 0,
        j = 0;
    if (f) {
        var l = new cp.dashStruct,
            k = cp.getPattern(a, 7, 3);
        c.beginPath();
        for (j = 0; j < f.length; ++j)
            if (d = f[j], !(0 >= d.length)) switch (d[0]) {
                case cp.kMoveTo:
                    c.moveTo(d[1] * this.WFactor, d[2] * this.HFactor);
                    i = d[1] * this.WFactor;
                    g = d[2] * this.HFactor;
                    l = new cp.dashStruct;
                    break;
                case cp.kLineTo:
                    cp.drawDashedLineImpl(c, k, l, i, g, d[1] * this.WFactor, d[2] * this.HFactor);
                    i = d[1] * this.WFactor;
                    g = d[2] * this.HFactor;
                    break;
                case cp.kBezierTo:
                    cp.drawDashedBezierCurve(c,
                        k, l, i, g, d[1] * this.WFactor, d[2] * this.HFactor, d[3] * this.WFactor, d[4] * this.HFactor, d[5] * this.WFactor, d[6] * this.HFactor);
                    i = d[5] * this.WFactor;
                    g = d[6] * this.HFactor;
                    break;
                case cp.kClosePath:
                    l = new cp.dashStruct
            }
    }
};
cp.AutoShape.prototype.getTranslationValuesForTiletype = function() {
    var c = this.canvasObj;
    if (c) {
        var a = c.imgf;
        if (a) {
            var d = a.img.tiletype,
                f = 0,
                i = 0,
                g = a.b[2] - a.b[0],
                j = a.b[3] - a.b[1],
                l = a.img.w,
                a = a.img.h;
            cp.responsive && (g = Math.floor(g * this.WFactor) + c.sw, j = Math.floor(j * this.HFactor) + c.sw);
            switch (d) {
                case "t":
                    f = (g - l) / 2;
                    break;
                case "tr":
                    f = g - l;
                    break;
                case "l":
                    i = (j - a) / 2;
                    break;
                case "c":
                    f = (g - l) / 2;
                    i = (j - a) / 2;
                    break;
                case "r":
                    f = g - l;
                    i = (j - a) / 2;
                    break;
                case "bl":
                    i = j - a;
                    break;
                case "b":
                    f = (g - l) / 2;
                    i = j - a;
                    break;
                case "br":
                    f = g - l, i = j - a
            }
            0 <
                f && (f = f % l - l);
            0 < i && (i = i % a - a);
            cp.responsive || (f += c.b[0], i += c.b[1]);
            return {
                x: f,
                y: i
            }
        }
    }
};
cp.AutoShape.prototype.setFill = function(c) {
    var a = null,
        d = "",
        d = null,
        f = [],
        i = 0,
        g = 0,
        j = 0,
        l = 1,
        d = d = null,
        j = !0,
        k = 0,
        f = k = 1,
        e = !1,
        s = !1,
        m = this.canvasObj;
    if (m) {
        var q = c.canvas;
        if (0 == q.width || 0 == q.height) return !0;
        if (m.gf) {
            if (d = cp.getGradientFill(m.gf, c, this.WFactor, this.HFactor)) c.fillStyle = d
        } else if (m.imgf) {
            j = !1;
            a = m.imgf;
            if (void 0 == a.img || void 0 == a.img.ip) return !1;
            d = a.img.ip;
            if ((d = cp.movie.im.images[d]) && d.nativeImage.complete) {
                j = a.s;
                if (l = a.t) g = this.getTranslationValuesForTiletype(), e = !0, i = g.x, g = g.y, c.translate(i,
                    g), d = c.createPattern(d.nativeImage, "repeat"), c.fillStyle = d;
                else if (j) void 0 != this.canvasObj.b && 4 == this.canvasObj.b.length && (cp.responsive ? (i = Math.floor(i * this.WFactor) + m.sw, g = Math.floor(g * this.HFactor) + m.sw) : (i += this.canvasObj.b[0], g += this.canvasObj.b[1]), f = this.canvasObj.b, k = f[2] - f[0], h = f[3] - f[1], cp.responsive && (k *= this.WFactor, h *= this.HFactor), k /= a.img.w, f = h / a.img.h, c.translate(i, g), e = !0, c.scale(k, f), d = c.createPattern(d.nativeImage, "no-repeat"), c.fillStyle = d);
                else {
                    j = document.createElement("canvas");
                    l = j.getContext("2d");
                    q = c.canvas;
                    j.left = q.left;
                    j.right = q.right;
                    j.top = q.top;
                    j.bottom = q.bottom;
                    j.width = q.width;
                    j.height = q.height;
                    var q = d.nativeImage.width,
                        n = d.nativeImage.height,
                        i = a.b[2] - a.b[0],
                        g = a.b[3] - a.b[1];
                    cp.responsive ? (i = Math.floor(i * this.WFactor) + m.sw, g = Math.floor(g * this.HFactor) + m.sw, i = -(q - i) / 2, g = -(n - g) / 2, l.translate(i, g)) : (l.translate((i - q) / 2, (g - n) / 2), i = this.canvasObj.b[0], g = this.canvasObj.b[1], e = !0, c.translate(i, g));
                    a = l.globalAlpha;
                    l.globalAlpha = 0;
                    l.globalAlpha = a;
                    d = l.createPattern(d.nativeImage,
                        "no-repeat");
                    l.fillStyle = d;
                    l.fillRect(0, 0, q, n);
                    d = c.createPattern(j, "no-repeat");
                    c.fillStyle = d
                }
                j = !0
            }
        } else m.bc ? c.fillStyle = m.bc : this.normalImage && (s = !0, j = !1);
        j && c.fill();
        (1 != k || 1 != f) && c.scale(1 / k, 1 / f);
        e && c.translate(-i, -g);
        return j || s
    }
};
cp.AutoShape.prototype.changeStateOnMouseEvents = function(c, a) {
    var d = null; - 1 == this.baseStateItemID ? d = this : this.cloneOfBaseStateItem && (d = cp.getDisplayObjByCP_UID(this.baseStateItemID));
    d && void 0 !== d.HandleMouseEventOnStateItems && d.HandleMouseEventOnStateItems(c, this.parentStateType, a)
};
cp.AutoShape.prototype.HandleMouseEventOnStateItems = function(c, a, d) {
    var f = cp.D[this.parentDivName];
    if (!(f && void 0 != f.enabled) || f.enabled) {
        var a = cp.kSTTNone,
            i = "";
        if (0 <= this.currentState && this.currentState < this.states.length) {
            var g = this.states[this.currentState];
            g && (a = g.stt, i = g.stn)
        }
        var j = !(cp.device == cp.IDEVICE || cp.device == cp.ANDROID) || "mouseup" != c,
            g = !1,
            l = "",
            k = !1,
            e = !1;
        f && (e = cp.isValidItemForStateOptimization({
            n: this.parentDivName,
            t: f.type
        }));
        if ("mouseover" == c) {
            if ((a == cp.kSTTNormal || a == cp.kSTTCustom ||
                    a == cp.kSTTVisited) && this.shouldShowRollOver)
                if (g = !0, l = cp.getLocalisedStateName("kCPRolloverState"), this.stateAtStartOfMouseEvents = i, cp.BringBaseItemToFrontWithinState(this, cp.getLocalisedStateName("kCPRolloverState")), cp.device === cp.DESKTOP && (c = cp.GetMouseOverManager())) {
                    var s = this;
                    c.addMouseOverItem(this, function() {
                        s.ForceMouseOut()
                    })
                }
        } else if ("mouseout" == c) {
            if (a == cp.kSTTRollOver || a == cp.kSTTDown) g = !0, l = this.stateAtStartOfMouseEvents, cp.device === cp.DESKTOP && (c = cp.GetMouseOverManager()) && c.removeMouseOverItem(this);
            if (a == cp.kSTTNormal || a == cp.kSTTCustom || a == cp.kSTTVisited) cp.browser == cp.CHROME && this.ignoreMouseOutEventOnNormal ? this.ignoreMouseOutEventOnNormal = !1 : this.shouldShowRollOver = !0
        } else if ("mousedown" == c) {
            if (a == cp.kSTTNormal || a == cp.kSTTRollOver || a == cp.kSTTCustom || a == cp.kSTTVisited)
                if (g = !0, l = cp.getLocalisedStateName("kCPDownState"), this.bShouldListenForMouseUpOnDownState = !0, a == cp.kSTTNormal || a == cp.kSTTCustom || a == cp.kSTTVisited) this.stateAtStartOfMouseEvents = i, this.ignoreMouseOutEventOnNormal = !0;
            this.shrinkShapeButtonInAllStates()
        } else if ("mouseup" ==
            c) {
            if (!j || a == cp.kSTTDown) a == cp.kSTTDown && (g = !0, l = this.stateAtStartOfMouseEvents), this.shouldShowRollOver = !1, this.bShouldListenForMouseUpOnDownState && (k = !0);
            this.expandShapeButtonInAllStates()
        }
        g && (l !== cp.getLocalisedStateName("kCPRolloverState") && cp.ResetItemZIndicesWithinState(this, cp.getLocalisedStateName("kCPRolloverState")), cp.changeState(this.actualParent.id, l, !1));
        k && !e && (!cp.IsGestureSupportedDevice() && !cp.disableInteractions && (this.needsOwnHandler || cp.shouldRelaxBrowserCheck(this.parentData.type) ||
            cp.CHROME != cp.browser && cp.MSIE != cp.browser || cp.m_isLMSPreview)) && cp.dispatchClickEvent(this.actualParent, d, {
            asPartOfStateChange: !0
        })
    }
};