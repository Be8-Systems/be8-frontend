/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2 =
        window.ShadowRoot &&
        (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
        'adoptedStyleSheets' in Document.prototype &&
        'replace' in CSSStyleSheet.prototype,
    e$4 = Symbol(),
    n$4 = new WeakMap();
class s$4 {
    constructor(t, n, s) {
        if (((this._$cssResult$ = !0), s !== e$4))
            throw Error(
                'CSSResult is not constructable. Use `unsafeCSS` or `css` instead.'
            );
        (this.cssText = t), (this.t = n);
    }
    get styleSheet() {
        let e = this.o;
        const s = this.t;
        if (t$2 && void 0 === e) {
            const t = void 0 !== s && 1 === s.length;
            t && (e = n$4.get(s)),
                void 0 === e &&
                    ((this.o = e = new CSSStyleSheet()).replaceSync(
                        this.cssText
                    ),
                    t && n$4.set(s, e));
        }
        return e;
    }
    toString() {
        return this.cssText;
    }
}
const o$4 = (t) => new s$4('string' == typeof t ? t : t + '', void 0, e$4),
    i$2 = (e, n) => {
        t$2
            ? (e.adoptedStyleSheets = n.map((t) =>
                  t instanceof CSSStyleSheet ? t : t.styleSheet
              ))
            : n.forEach((t) => {
                  const n = document.createElement('style'),
                      s = window.litNonce;
                  void 0 !== s && n.setAttribute('nonce', s),
                      (n.textContent = t.cssText),
                      e.appendChild(n);
              });
    },
    S$3 = t$2
        ? (t) => t
        : (t) =>
              t instanceof CSSStyleSheet
                  ? ((t) => {
                        let e = '';
                        for (const n of t.cssRules) e += n.cssText;
                        return o$4(e);
                    })(t)
                  : t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var s$3;
const e$3 = window.trustedTypes,
    r$2 = e$3 ? e$3.emptyScript : '',
    h$1 = window.reactiveElementPolyfillSupport,
    o$3 = {
        toAttribute(t, i) {
            switch (i) {
                case Boolean:
                    t = t ? r$2 : null;
                    break;
                case Object:
                case Array:
                    t = null == t ? t : JSON.stringify(t);
            }
            return t;
        },
        fromAttribute(t, i) {
            let s = t;
            switch (i) {
                case Boolean:
                    s = null !== t;
                    break;
                case Number:
                    s = null === t ? null : Number(t);
                    break;
                case Object:
                case Array:
                    try {
                        s = JSON.parse(t);
                    } catch (t) {
                        s = null;
                    }
            }
            return s;
        },
    },
    n$3 = (t, i) => i !== t && (i == i || t == t),
    l$3 = {
        attribute: !0,
        type: String,
        converter: o$3,
        reflect: !1,
        hasChanged: n$3,
    };
class a$1 extends HTMLElement {
    constructor() {
        super(),
            (this._$Ei = new Map()),
            (this.isUpdatePending = !1),
            (this.hasUpdated = !1),
            (this._$El = null),
            this.u();
    }
    static addInitializer(t) {
        var i;
        (null !== (i = this.h) && void 0 !== i) || (this.h = []),
            this.h.push(t);
    }
    static get observedAttributes() {
        this.finalize();
        const t = [];
        return (
            this.elementProperties.forEach((i, s) => {
                const e = this._$Ep(s, i);
                void 0 !== e && (this._$Ev.set(e, s), t.push(e));
            }),
            t
        );
    }
    static createProperty(t, i = l$3) {
        if (
            (i.state && (i.attribute = !1),
            this.finalize(),
            this.elementProperties.set(t, i),
            !i.noAccessor && !this.prototype.hasOwnProperty(t))
        ) {
            const s = 'symbol' == typeof t ? Symbol() : '__' + t,
                e = this.getPropertyDescriptor(t, s, i);
            void 0 !== e && Object.defineProperty(this.prototype, t, e);
        }
    }
    static getPropertyDescriptor(t, i, s) {
        return {
            get() {
                return this[i];
            },
            set(e) {
                const r = this[t];
                (this[i] = e), this.requestUpdate(t, r, s);
            },
            configurable: !0,
            enumerable: !0,
        };
    }
    static getPropertyOptions(t) {
        return this.elementProperties.get(t) || l$3;
    }
    static finalize() {
        if (this.hasOwnProperty('finalized')) return !1;
        this.finalized = !0;
        const t = Object.getPrototypeOf(this);
        if (
            (t.finalize(),
            (this.elementProperties = new Map(t.elementProperties)),
            (this._$Ev = new Map()),
            this.hasOwnProperty('properties'))
        ) {
            const t = this.properties,
                i = [
                    ...Object.getOwnPropertyNames(t),
                    ...Object.getOwnPropertySymbols(t),
                ];
            for (const s of i) this.createProperty(s, t[s]);
        }
        return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
    }
    static finalizeStyles(i) {
        const s = [];
        if (Array.isArray(i)) {
            const e = new Set(i.flat(1 / 0).reverse());
            for (const i of e) s.unshift(S$3(i));
        } else void 0 !== i && s.push(S$3(i));
        return s;
    }
    static _$Ep(t, i) {
        const s = i.attribute;
        return !1 === s
            ? void 0
            : 'string' == typeof s
            ? s
            : 'string' == typeof t
            ? t.toLowerCase()
            : void 0;
    }
    u() {
        var t;
        (this._$E_ = new Promise((t) => (this.enableUpdating = t))),
            (this._$AL = new Map()),
            this._$Eg(),
            this.requestUpdate(),
            null === (t = this.constructor.h) ||
                void 0 === t ||
                t.forEach((t) => t(this));
    }
    addController(t) {
        var i, s;
        (null !== (i = this._$ES) && void 0 !== i ? i : (this._$ES = [])).push(
            t
        ),
            void 0 !== this.renderRoot &&
                this.isConnected &&
                (null === (s = t.hostConnected) || void 0 === s || s.call(t));
    }
    removeController(t) {
        var i;
        null === (i = this._$ES) ||
            void 0 === i ||
            i.splice(this._$ES.indexOf(t) >>> 0, 1);
    }
    _$Eg() {
        this.constructor.elementProperties.forEach((t, i) => {
            this.hasOwnProperty(i) &&
                (this._$Ei.set(i, this[i]), delete this[i]);
        });
    }
    createRenderRoot() {
        var t;
        const s =
            null !== (t = this.shadowRoot) && void 0 !== t
                ? t
                : this.attachShadow(this.constructor.shadowRootOptions);
        return i$2(s, this.constructor.elementStyles), s;
    }
    connectedCallback() {
        var t;
        void 0 === this.renderRoot &&
            (this.renderRoot = this.createRenderRoot()),
            this.enableUpdating(!0),
            null === (t = this._$ES) ||
                void 0 === t ||
                t.forEach((t) => {
                    var i;
                    return null === (i = t.hostConnected) || void 0 === i
                        ? void 0
                        : i.call(t);
                });
    }
    enableUpdating(t) {}
    disconnectedCallback() {
        var t;
        null === (t = this._$ES) ||
            void 0 === t ||
            t.forEach((t) => {
                var i;
                return null === (i = t.hostDisconnected) || void 0 === i
                    ? void 0
                    : i.call(t);
            });
    }
    attributeChangedCallback(t, i, s) {
        this._$AK(t, s);
    }
    _$EO(t, i, s = l$3) {
        var e, r;
        const h = this.constructor._$Ep(t, s);
        if (void 0 !== h && !0 === s.reflect) {
            const n = (
                null !==
                    (r =
                        null === (e = s.converter) || void 0 === e
                            ? void 0
                            : e.toAttribute) && void 0 !== r
                    ? r
                    : o$3.toAttribute
            )(i, s.type);
            (this._$El = t),
                null == n ? this.removeAttribute(h) : this.setAttribute(h, n),
                (this._$El = null);
        }
    }
    _$AK(t, i) {
        var s, e;
        const r = this.constructor,
            h = r._$Ev.get(t);
        if (void 0 !== h && this._$El !== h) {
            const t = r.getPropertyOptions(h),
                n = t.converter,
                l =
                    null !==
                        (e =
                            null !==
                                (s = null == n ? void 0 : n.fromAttribute) &&
                            void 0 !== s
                                ? s
                                : 'function' == typeof n
                                ? n
                                : null) && void 0 !== e
                        ? e
                        : o$3.fromAttribute;
            (this._$El = h), (this[h] = l(i, t.type)), (this._$El = null);
        }
    }
    requestUpdate(t, i, s) {
        let e = !0;
        void 0 !== t &&
            ((
                (s = s || this.constructor.getPropertyOptions(t)).hasChanged ||
                n$3
            )(this[t], i)
                ? (this._$AL.has(t) || this._$AL.set(t, i),
                  !0 === s.reflect &&
                      this._$El !== t &&
                      (void 0 === this._$EC && (this._$EC = new Map()),
                      this._$EC.set(t, s)))
                : (e = !1)),
            !this.isUpdatePending && e && (this._$E_ = this._$Ej());
    }
    async _$Ej() {
        this.isUpdatePending = !0;
        try {
            await this._$E_;
        } catch (t) {
            Promise.reject(t);
        }
        const t = this.scheduleUpdate();
        return null != t && (await t), !this.isUpdatePending;
    }
    scheduleUpdate() {
        return this.performUpdate();
    }
    performUpdate() {
        var t;
        if (!this.isUpdatePending) return;
        this.hasUpdated,
            this._$Ei &&
                (this._$Ei.forEach((t, i) => (this[i] = t)),
                (this._$Ei = void 0));
        let i = !1;
        const s = this._$AL;
        try {
            (i = this.shouldUpdate(s)),
                i
                    ? (this.willUpdate(s),
                      null === (t = this._$ES) ||
                          void 0 === t ||
                          t.forEach((t) => {
                              var i;
                              return null === (i = t.hostUpdate) || void 0 === i
                                  ? void 0
                                  : i.call(t);
                          }),
                      this.update(s))
                    : this._$Ek();
        } catch (t) {
            throw ((i = !1), this._$Ek(), t);
        }
        i && this._$AE(s);
    }
    willUpdate(t) {}
    _$AE(t) {
        var i;
        null === (i = this._$ES) ||
            void 0 === i ||
            i.forEach((t) => {
                var i;
                return null === (i = t.hostUpdated) || void 0 === i
                    ? void 0
                    : i.call(t);
            }),
            this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
            this.updated(t);
    }
    _$Ek() {
        (this._$AL = new Map()), (this.isUpdatePending = !1);
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this._$E_;
    }
    shouldUpdate(t) {
        return !0;
    }
    update(t) {
        void 0 !== this._$EC &&
            (this._$EC.forEach((t, i) => this._$EO(i, this[i], t)),
            (this._$EC = void 0)),
            this._$Ek();
    }
    updated(t) {}
    firstUpdated(t) {}
}
(a$1.finalized = !0),
    (a$1.elementProperties = new Map()),
    (a$1.elementStyles = []),
    (a$1.shadowRootOptions = { mode: 'open' }),
    null == h$1 || h$1({ ReactiveElement: a$1 }),
    (null !== (s$3 = globalThis.reactiveElementVersions) && void 0 !== s$3
        ? s$3
        : (globalThis.reactiveElementVersions = [])
    ).push('1.3.4');

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$1;
const i$1 = globalThis.trustedTypes,
    s$2 = i$1 ? i$1.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
    e$2 = `lit$${(Math.random() + '').slice(9)}$`,
    o$2 = '?' + e$2,
    n$2 = `<${o$2}>`,
    l$2 = document,
    h = (t = '') => l$2.createComment(t),
    r$1 = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
    d$1 = Array.isArray,
    u$2 = (t) =>
        d$1(t) ||
        'function' == typeof (null == t ? void 0 : t[Symbol.iterator]),
    c$2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    v = /-->/g,
    a = />/g,
    f$1 = RegExp(
        '>|[ \t\n\f\r](?:([^\\s"\'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r"\'`<>=]|("|\')|))|$)',
        'g'
    ),
    _ = /'/g,
    g = /"/g,
    m$1 = /^(?:script|style|textarea|title)$/i,
    p$1 =
        (t) =>
        (i, ...s) => ({ _$litType$: t, strings: i, values: s }),
    $ = p$1(1),
    b = Symbol.for('lit-noChange'),
    w = Symbol.for('lit-nothing'),
    x$1 = new WeakMap(),
    T$2 = (t, i, s) => {
        var e, o;
        const n =
            null !== (e = null == s ? void 0 : s.renderBefore) && void 0 !== e
                ? e
                : i;
        let l = n._$litPart$;
        if (void 0 === l) {
            const t =
                null !== (o = null == s ? void 0 : s.renderBefore) &&
                void 0 !== o
                    ? o
                    : null;
            n._$litPart$ = l = new N(
                i.insertBefore(h(), t),
                t,
                void 0,
                null != s ? s : {}
            );
        }
        return l._$AI(t), l;
    },
    A = l$2.createTreeWalker(l$2, 129, null, !1),
    E = (t, i) => {
        const o = t.length - 1,
            l = [];
        let h,
            r = 2 === i ? '<svg>' : '',
            d = c$2;
        for (let i = 0; i < o; i++) {
            const s = t[i];
            let o,
                u,
                p = -1,
                $ = 0;
            for (
                ;
                $ < s.length &&
                ((d.lastIndex = $), (u = d.exec(s)), null !== u);

            )
                ($ = d.lastIndex),
                    d === c$2
                        ? '!--' === u[1]
                            ? (d = v)
                            : void 0 !== u[1]
                            ? (d = a)
                            : void 0 !== u[2]
                            ? (m$1.test(u[2]) && (h = RegExp('</' + u[2], 'g')),
                              (d = f$1))
                            : void 0 !== u[3] && (d = f$1)
                        : d === f$1
                        ? '>' === u[0]
                            ? ((d = null != h ? h : c$2), (p = -1))
                            : void 0 === u[1]
                            ? (p = -2)
                            : ((p = d.lastIndex - u[2].length),
                              (o = u[1]),
                              (d =
                                  void 0 === u[3] ? f$1 : '"' === u[3] ? g : _))
                        : d === g || d === _
                        ? (d = f$1)
                        : d === v || d === a
                        ? (d = c$2)
                        : ((d = f$1), (h = void 0));
            const y = d === f$1 && t[i + 1].startsWith('/>') ? ' ' : '';
            r +=
                d === c$2
                    ? s + n$2
                    : p >= 0
                    ? (l.push(o),
                      s.slice(0, p) + '$lit$' + s.slice(p) + e$2 + y)
                    : s + e$2 + (-2 === p ? (l.push(void 0), i) : y);
        }
        const u = r + (t[o] || '<?>') + (2 === i ? '</svg>' : '');
        if (!Array.isArray(t) || !t.hasOwnProperty('raw'))
            throw Error('invalid template strings array');
        return [void 0 !== s$2 ? s$2.createHTML(u) : u, l];
    };
class C {
    constructor({ strings: t, _$litType$: s }, n) {
        let l;
        this.parts = [];
        let r = 0,
            d = 0;
        const u = t.length - 1,
            c = this.parts,
            [v, a] = E(t, s);
        if (
            ((this.el = C.createElement(v, n)),
            (A.currentNode = this.el.content),
            2 === s)
        ) {
            const t = this.el.content,
                i = t.firstChild;
            i.remove(), t.append(...i.childNodes);
        }
        for (; null !== (l = A.nextNode()) && c.length < u; ) {
            if (1 === l.nodeType) {
                if (l.hasAttributes()) {
                    const t = [];
                    for (const i of l.getAttributeNames())
                        if (i.endsWith('$lit$') || i.startsWith(e$2)) {
                            const s = a[d++];
                            if ((t.push(i), void 0 !== s)) {
                                const t = l
                                        .getAttribute(s.toLowerCase() + '$lit$')
                                        .split(e$2),
                                    i = /([.?@])?(.*)/.exec(s);
                                c.push({
                                    type: 1,
                                    index: r,
                                    name: i[2],
                                    strings: t,
                                    ctor:
                                        '.' === i[1]
                                            ? M
                                            : '?' === i[1]
                                            ? k
                                            : '@' === i[1]
                                            ? H$1
                                            : S$2,
                                });
                            } else c.push({ type: 6, index: r });
                        }
                    for (const i of t) l.removeAttribute(i);
                }
                if (m$1.test(l.tagName)) {
                    const t = l.textContent.split(e$2),
                        s = t.length - 1;
                    if (s > 0) {
                        l.textContent = i$1 ? i$1.emptyScript : '';
                        for (let i = 0; i < s; i++)
                            l.append(t[i], h()),
                                A.nextNode(),
                                c.push({ type: 2, index: ++r });
                        l.append(t[s], h());
                    }
                }
            } else if (8 === l.nodeType)
                if (l.data === o$2) c.push({ type: 2, index: r });
                else {
                    let t = -1;
                    for (; -1 !== (t = l.data.indexOf(e$2, t + 1)); )
                        c.push({ type: 7, index: r }), (t += e$2.length - 1);
                }
            r++;
        }
    }
    static createElement(t, i) {
        const s = l$2.createElement('template');
        return (s.innerHTML = t), s;
    }
}
function P(t, i, s = t, e) {
    var o, n, l, h;
    if (i === b) return i;
    let d =
        void 0 !== e
            ? null === (o = s._$Cl) || void 0 === o
                ? void 0
                : o[e]
            : s._$Cu;
    const u = r$1(i) ? void 0 : i._$litDirective$;
    return (
        (null == d ? void 0 : d.constructor) !== u &&
            (null === (n = null == d ? void 0 : d._$AO) ||
                void 0 === n ||
                n.call(d, !1),
            void 0 === u ? (d = void 0) : ((d = new u(t)), d._$AT(t, s, e)),
            void 0 !== e
                ? ((null !== (l = (h = s)._$Cl) && void 0 !== l
                      ? l
                      : (h._$Cl = []))[e] = d)
                : (s._$Cu = d)),
        void 0 !== d && (i = P(t, d._$AS(t, i.values), d, e)),
        i
    );
}
class V {
    constructor(t, i) {
        (this.v = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = i);
    }
    get parentNode() {
        return this._$AM.parentNode;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    p(t) {
        var i;
        const {
                el: { content: s },
                parts: e,
            } = this._$AD,
            o = (
                null !== (i = null == t ? void 0 : t.creationScope) &&
                void 0 !== i
                    ? i
                    : l$2
            ).importNode(s, !0);
        A.currentNode = o;
        let n = A.nextNode(),
            h = 0,
            r = 0,
            d = e[0];
        for (; void 0 !== d; ) {
            if (h === d.index) {
                let i;
                2 === d.type
                    ? (i = new N(n, n.nextSibling, this, t))
                    : 1 === d.type
                    ? (i = new d.ctor(n, d.name, d.strings, this, t))
                    : 6 === d.type && (i = new I(n, this, t)),
                    this.v.push(i),
                    (d = e[++r]);
            }
            h !== (null == d ? void 0 : d.index) && ((n = A.nextNode()), h++);
        }
        return o;
    }
    m(t) {
        let i = 0;
        for (const s of this.v)
            void 0 !== s &&
                (void 0 !== s.strings
                    ? (s._$AI(t, s, i), (i += s.strings.length - 2))
                    : s._$AI(t[i])),
                i++;
    }
}
class N {
    constructor(t, i, s, e) {
        var o;
        (this.type = 2),
            (this._$AH = w),
            (this._$AN = void 0),
            (this._$AA = t),
            (this._$AB = i),
            (this._$AM = s),
            (this.options = e),
            (this._$C_ =
                null === (o = null == e ? void 0 : e.isConnected) ||
                void 0 === o ||
                o);
    }
    get _$AU() {
        var t, i;
        return null !==
            (i = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) &&
            void 0 !== i
            ? i
            : this._$C_;
    }
    get parentNode() {
        let t = this._$AA.parentNode;
        const i = this._$AM;
        return void 0 !== i && 11 === t.nodeType && (t = i.parentNode), t;
    }
    get startNode() {
        return this._$AA;
    }
    get endNode() {
        return this._$AB;
    }
    _$AI(t, i = this) {
        (t = P(this, t, i)),
            r$1(t)
                ? t === w || null == t || '' === t
                    ? (this._$AH !== w && this._$AR(), (this._$AH = w))
                    : t !== this._$AH && t !== b && this.T(t)
                : void 0 !== t._$litType$
                ? this.$(t)
                : void 0 !== t.nodeType
                ? this.k(t)
                : u$2(t)
                ? this.S(t)
                : this.T(t);
    }
    j(t, i = this._$AB) {
        return this._$AA.parentNode.insertBefore(t, i);
    }
    k(t) {
        this._$AH !== t && (this._$AR(), (this._$AH = this.j(t)));
    }
    T(t) {
        this._$AH !== w && r$1(this._$AH)
            ? (this._$AA.nextSibling.data = t)
            : this.k(l$2.createTextNode(t)),
            (this._$AH = t);
    }
    $(t) {
        var i;
        const { values: s, _$litType$: e } = t,
            o =
                'number' == typeof e
                    ? this._$AC(t)
                    : (void 0 === e.el &&
                          (e.el = C.createElement(e.h, this.options)),
                      e);
        if ((null === (i = this._$AH) || void 0 === i ? void 0 : i._$AD) === o)
            this._$AH.m(s);
        else {
            const t = new V(o, this),
                i = t.p(this.options);
            t.m(s), this.k(i), (this._$AH = t);
        }
    }
    _$AC(t) {
        let i = x$1.get(t.strings);
        return void 0 === i && x$1.set(t.strings, (i = new C(t))), i;
    }
    S(t) {
        d$1(this._$AH) || ((this._$AH = []), this._$AR());
        const i = this._$AH;
        let s,
            e = 0;
        for (const o of t)
            e === i.length
                ? i.push(
                      (s = new N(this.j(h()), this.j(h()), this, this.options))
                  )
                : (s = i[e]),
                s._$AI(o),
                e++;
        e < i.length && (this._$AR(s && s._$AB.nextSibling, e), (i.length = e));
    }
    _$AR(t = this._$AA.nextSibling, i) {
        var s;
        for (
            null === (s = this._$AP) || void 0 === s || s.call(this, !1, !0, i);
            t && t !== this._$AB;

        ) {
            const i = t.nextSibling;
            t.remove(), (t = i);
        }
    }
    setConnected(t) {
        var i;
        void 0 === this._$AM &&
            ((this._$C_ = t),
            null === (i = this._$AP) || void 0 === i || i.call(this, t));
    }
}
class S$2 {
    constructor(t, i, s, e, o) {
        (this.type = 1),
            (this._$AH = w),
            (this._$AN = void 0),
            (this.element = t),
            (this.name = i),
            (this._$AM = e),
            (this.options = o),
            s.length > 2 || '' !== s[0] || '' !== s[1]
                ? ((this._$AH = Array(s.length - 1).fill(new String())),
                  (this.strings = s))
                : (this._$AH = w);
    }
    get tagName() {
        return this.element.tagName;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t, i = this, s, e) {
        const o = this.strings;
        let n = !1;
        if (void 0 === o)
            (t = P(this, t, i, 0)),
                (n = !r$1(t) || (t !== this._$AH && t !== b)),
                n && (this._$AH = t);
        else {
            const e = t;
            let l, h;
            for (t = o[0], l = 0; l < o.length - 1; l++)
                (h = P(this, e[s + l], i, l)),
                    h === b && (h = this._$AH[l]),
                    n || (n = !r$1(h) || h !== this._$AH[l]),
                    h === w
                        ? (t = w)
                        : t !== w && (t += (null != h ? h : '') + o[l + 1]),
                    (this._$AH[l] = h);
        }
        n && !e && this.P(t);
    }
    P(t) {
        t === w
            ? this.element.removeAttribute(this.name)
            : this.element.setAttribute(this.name, null != t ? t : '');
    }
}
class M extends S$2 {
    constructor() {
        super(...arguments), (this.type = 3);
    }
    P(t) {
        this.element[this.name] = t === w ? void 0 : t;
    }
}
const R = i$1 ? i$1.emptyScript : '';
class k extends S$2 {
    constructor() {
        super(...arguments), (this.type = 4);
    }
    P(t) {
        t && t !== w
            ? this.element.setAttribute(this.name, R)
            : this.element.removeAttribute(this.name);
    }
}
class H$1 extends S$2 {
    constructor(t, i, s, e, o) {
        super(t, i, s, e, o), (this.type = 5);
    }
    _$AI(t, i = this) {
        var s;
        if ((t = null !== (s = P(this, t, i, 0)) && void 0 !== s ? s : w) === b)
            return;
        const e = this._$AH,
            o =
                (t === w && e !== w) ||
                t.capture !== e.capture ||
                t.once !== e.once ||
                t.passive !== e.passive,
            n = t !== w && (e === w || o);
        o && this.element.removeEventListener(this.name, this, e),
            n && this.element.addEventListener(this.name, this, t),
            (this._$AH = t);
    }
    handleEvent(t) {
        var i, s;
        'function' == typeof this._$AH
            ? this._$AH.call(
                  null !==
                      (s =
                          null === (i = this.options) || void 0 === i
                              ? void 0
                              : i.host) && void 0 !== s
                      ? s
                      : this.element,
                  t
              )
            : this._$AH.handleEvent(t);
    }
}
class I {
    constructor(t, i, s) {
        (this.element = t),
            (this.type = 6),
            (this._$AN = void 0),
            (this._$AM = i),
            (this.options = s);
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t) {
        P(this, t);
    }
}
const L = {
        A: '$lit$',
        C: e$2,
        M: o$2,
        L: 1,
        R: E,
        V,
        D: u$2,
        I: P,
        H: N,
        N: S$2,
        U: k,
        B: H$1,
        F: M,
        W: I,
    },
    z = window.litHtmlPolyfillSupport;
null == z || z(C, N),
    (null !== (t$1 = globalThis.litHtmlVersions) && void 0 !== t$1
        ? t$1
        : (globalThis.litHtmlVersions = [])
    ).push('2.2.7');

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var l$1, o$1;
class s$1 extends a$1 {
    constructor() {
        super(...arguments),
            (this.renderOptions = { host: this }),
            (this._$Do = void 0);
    }
    createRenderRoot() {
        var t, e;
        const i = super.createRenderRoot();
        return (
            (null !== (t = (e = this.renderOptions).renderBefore) &&
                void 0 !== t) ||
                (e.renderBefore = i.firstChild),
            i
        );
    }
    update(t) {
        const i = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
            super.update(t),
            (this._$Do = T$2(i, this.renderRoot, this.renderOptions));
    }
    connectedCallback() {
        var t;
        super.connectedCallback(),
            null === (t = this._$Do) || void 0 === t || t.setConnected(!0);
    }
    disconnectedCallback() {
        var t;
        super.disconnectedCallback(),
            null === (t = this._$Do) || void 0 === t || t.setConnected(!1);
    }
    render() {
        return b;
    }
}
(s$1.finalized = !0),
    (s$1._$litElement$ = !0),
    null === (l$1 = globalThis.litElementHydrateSupport) ||
        void 0 === l$1 ||
        l$1.call(globalThis, { LitElement: s$1 });
const n$1 = globalThis.litElementPolyfillSupport;
null == n$1 || n$1({ LitElement: s$1 });
(null !== (o$1 = globalThis.litElementVersions) && void 0 !== o$1
    ? o$1
    : (globalThis.litElementVersions = [])
).push('3.2.2');

class Toast extends s$1 {
    static properties = {
        notification: { type: Object },
    };

    #isOpen = false;
    #icons = {
        success: 'check',
        error: 'times',
        warning: 'triangle-exclamation',
    };
    #openTime = 5000;
    #progress = {};
    #timer1;
    #timer2;

    constructor() {
        super();

        this.notification = {
            type: 'success',
            text: 'Your changes has been saved',
        };
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    open() {
        if (this.#isOpen) {
            this.#progress.style.animation = 'none';
            this.#progress.style.width = '100%';
            this.#progress.style.animation = null;

            this.#progress.classList.remove('active');
            this.classList.remove('active');
            clearTimeout(this.#timer1);
            clearTimeout(this.#timer2);
        }

        this.classList.add('active');
        this.#progress.classList.add('active');

        this.#isOpen = true;
        this.#timer1 = setTimeout(() => {
            this.classList.remove('active');
            this.isOpen = false;
        }, this.#openTime);
        this.#timer2 = setTimeout(
            () => this.#progress.classList.remove('active'),
            this.#openTime + 300
        );
    }

    close() {
        this.classList.remove('active');
        clearTimeout(this.#timer1);
        clearTimeout(this.#timer2);

        setTimeout(() => this.#progress.classList.remove('active'), 300);

        this.#timer1 = null;
        this.#timer2 = null;
        this.#isOpen = false;
    }

    firstUpdated() {
        this.#progress = this.querySelector('.progress');
    }

    render() {
        const icon = this.#icons[this.notification.type];

        return $`<div class="toast-content"><i class="fas fa-solid fa-${icon} ${
            this.notification.type
        }"></i><div class="toast-message"><span class="text text-1">${this.notification.type.toUpperCase()}</span> <span class="text text-2">${
            this.notification.text
        }</span></div></div><i @click="${
            this.close
        }" class="fa-solid fa-xmark close hover-font"></i><div class="progress active ${
            this.notification.type
        }"></div>`;
    }
}

customElements.define('toast-notification', Toast);

class Modal extends s$1 {
    #hasClose = true;

    constructor(hasClose = true) {
        super();

        this.#hasClose = hasClose;
        this.classList = 'hide modal';
        this.setAttribute('data-open', 'false');
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    toggle() {
        const isOpen = this.getAttribute('data-open') === 'true';

        if (isOpen) {
            return this.close();
        }

        return this.open();
    }

    open() {
        const isOpen = this.getAttribute('data-open') === 'true';
        const innerModal = this.querySelector('.inner-modal');

        if (isOpen) {
            return;
        }

        requestAnimationFrame(() => {
            this.classList.remove('hide');
            innerModal.style = 'animation: fadeUpAnimation 0.3s !important;';
            return this.setAttribute('data-open', 'true');
        });
    }

    close() {
        const isClosed = this.getAttribute('data-open') === 'false';
        const innerModal = this.querySelector('.inner-modal');

        if (isClosed) {
            return;
        }

        innerModal.style = 'animation: fadeDownAnimation 0.3s !important;';
        setTimeout(() => {
            innerModal.style = '';
            this.classList.add('hide');
            return this.setAttribute('data-open', 'false');
        }, 275);
    }

    set({ HTML }) {
        this.querySelector('.modal-content').innerHTML = HTML;
    }

    setAndOpen(options) {
        this.set(options);
        this.open();
    }

    render(content = '', sideContent = '') {
        const close = this.#hasClose
            ? $`<small @click="${this.close}" class="close-modal unselectable">close</small>`
            : $``;
        return $`<div class="inner-modal">${close}<div class="modal-content">${content}</div><div class="modal-side">${sideContent}</div></div>`;
    }
}

customElements.define('modal-window', Modal);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = {
        ATTRIBUTE: 1,
        CHILD: 2,
        PROPERTY: 3,
        BOOLEAN_ATTRIBUTE: 4,
        EVENT: 5,
        ELEMENT: 6,
    },
    e$1 =
        (t) =>
        (...e) => ({ _$litDirective$: t, values: e });
class i {
    constructor(t) {}
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AT(t, e, i) {
        (this._$Ct = t), (this._$AM = e), (this._$Ci = i);
    }
    _$AS(t, e) {
        return this.update(t, e);
    }
    update(t, e) {
        return this.render(...e);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class e extends i {
    constructor(i) {
        if ((super(i), (this.it = w), i.type !== t.CHILD))
            throw Error(
                this.constructor.directiveName +
                    '() can only be used in child bindings'
            );
    }
    render(r) {
        if (r === w || null == r) return (this._t = void 0), (this.it = r);
        if (r === b) return r;
        if ('string' != typeof r)
            throw Error(
                this.constructor.directiveName +
                    '() called with a non-string value'
            );
        if (r === this.it) return this._t;
        this.it = r;
        const s = [r];
        return (
            (s.raw = s),
            (this._t = {
                _$litType$: this.constructor.resultType,
                strings: s,
                values: [],
            })
        );
    }
}
(e.directiveName = 'unsafeHTML'), (e.resultType = 1);
const o = e$1(e);

const isPhone =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
const isDesktop = !isPhone;
const domCache = {
    app: {},
    menus: {},
    threads: {},
    settings: {},
    user: {},
    navi: {},
    header: {},
    bottomNavi: {},
    toast: {},
};

var LANG = Object.freeze({
    THREADSTITLE: 'Chats',
    INVITELINK:
        'We copied your <a class="highlight-color" href="{{link}}">invite link</a> to your clipboard. Go ahead and share it.',
    PANICTEXT:
        'Enter your Be8 id <i class="highlight-color">#{{id}}</i>&nbsp;&nbsp;to destroy your account and everything associated with it. Attention there is no way to restore your data!',
    CONVERSATION: 'Enter a Be8 id to start a 1on1 chatting.',
    UNLOCKSETUPTEXT:
        'You have to remind your unlock code otherwise there is no way to access your account again! Enter your destroy code to destroy your acc! There is no way to recover destroyed accs',
    LEAVEGROUPADMIN:
        'When you leave this group, the group and every message gets destroyed, no way to recover any data.',
    LEAVEGROUPMEMBER: 'Do you want to leave the group?',
    MESSAGEREMOVED: 'The message was removed',
    MEMBERNOTEXISTING:
        'This member does not exist or turned off group features.',
});

var ME = {
    id: '0',
    nickname: 'User Name',
    expire: 'Mon Jan 01 2222 00:00:00 GMT+0000 (Coordinated Universal Time)',
    type: 'user',
    status: 'Status Mockup',
    endless: false,
    codes: false,
};

/* eslint-disable no-use-before-define */

/**
 * Base class for inheritance.
 */
class Base {
    /**
     * Extends this object and runs the init method.
     * Arguments to create() will be passed to init().
     *
     * @return {Object} The new object.
     *
     * @static
     *
     * @example
     *
     *     var instance = MyType.create();
     */
    static create(...args) {
        return new this(...args);
    }

    /**
     * Copies properties into this object.
     *
     * @param {Object} properties The properties to mix in.
     *
     * @example
     *
     *     MyType.mixIn({
     *         field: 'value'
     *     });
     */
    mixIn(properties) {
        return Object.assign(this, properties);
    }

    /**
     * Creates a copy of this object.
     *
     * @return {Object} The clone.
     *
     * @example
     *
     *     var clone = instance.clone();
     */
    clone() {
        const clone = new this.constructor();
        Object.assign(clone, this);
        return clone;
    }
}

/**
 * An array of 32-bit words.
 *
 * @property {Array} words The array of 32-bit words.
 * @property {number} sigBytes The number of significant bytes in this word array.
 */
class WordArray extends Base {
    /**
     * Initializes a newly created word array.
     *
     * @param {Array} words (Optional) An array of 32-bit words.
     * @param {number} sigBytes (Optional) The number of significant bytes in the words.
     *
     * @example
     *
     *     var wordArray = CryptoJS.lib.WordArray.create();
     *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
     *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
     */
    constructor(words = [], sigBytes = words.length * 4) {
        super();

        let typedArray = words;
        // Convert buffers to uint8
        if (typedArray instanceof ArrayBuffer) {
            typedArray = new Uint8Array(typedArray);
        }

        // Convert other array views to uint8
        if (
            typedArray instanceof Int8Array ||
            typedArray instanceof Uint8ClampedArray ||
            typedArray instanceof Int16Array ||
            typedArray instanceof Uint16Array ||
            typedArray instanceof Int32Array ||
            typedArray instanceof Uint32Array ||
            typedArray instanceof Float32Array ||
            typedArray instanceof Float64Array
        ) {
            typedArray = new Uint8Array(
                typedArray.buffer,
                typedArray.byteOffset,
                typedArray.byteLength
            );
        }

        // Handle Uint8Array
        if (typedArray instanceof Uint8Array) {
            // Shortcut
            const typedArrayByteLength = typedArray.byteLength;

            // Extract bytes
            const _words = [];
            for (let i = 0; i < typedArrayByteLength; i += 1) {
                _words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
            }

            // Initialize this word array
            this.words = _words;
            this.sigBytes = typedArrayByteLength;
        } else {
            // Else call normal init
            this.words = words;
            this.sigBytes = sigBytes;
        }
    }

    /**
     * Creates a word array filled with random bytes.
     *
     * @param {number} nBytes The number of random bytes to generate.
     *
     * @return {WordArray} The random word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.lib.WordArray.random(16);
     */
    static random(nBytes) {
        const words = [];

        const r = (m_w) => {
            let _m_w = m_w;
            let _m_z = 0x3ade68b1;
            const mask = 0xffffffff;

            return () => {
                _m_z = (0x9069 * (_m_z & 0xffff) + (_m_z >> 0x10)) & mask;
                _m_w = (0x4650 * (_m_w & 0xffff) + (_m_w >> 0x10)) & mask;
                let result = ((_m_z << 0x10) + _m_w) & mask;
                result /= 0x100000000;
                result += 0.5;
                return result * (Math.random() > 0.5 ? 1 : -1);
            };
        };

        for (let i = 0, rcache; i < nBytes; i += 4) {
            const _r = r((rcache || Math.random()) * 0x100000000);

            rcache = _r() * 0x3ade67b7;
            words.push((_r() * 0x100000000) | 0);
        }

        return new WordArray(words, nBytes);
    }

    /**
     * Converts this word array to a string.
     *
     * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
     *
     * @return {string} The stringified word array.
     *
     * @example
     *
     *     var string = wordArray + '';
     *     var string = wordArray.toString();
     *     var string = wordArray.toString(CryptoJS.enc.Utf8);
     */
    toString(encoder = Hex) {
        return encoder.stringify(this);
    }

    /**
     * Concatenates a word array to this word array.
     *
     * @param {WordArray} wordArray The word array to append.
     *
     * @return {WordArray} This word array.
     *
     * @example
     *
     *     wordArray1.concat(wordArray2);
     */
    concat(wordArray) {
        // Shortcuts
        const thisWords = this.words;
        const thatWords = wordArray.words;
        const thisSigBytes = this.sigBytes;
        const thatSigBytes = wordArray.sigBytes;

        // Clamp excess bits
        this.clamp();

        // Concat
        if (thisSigBytes % 4) {
            // Copy one byte at a time
            for (let i = 0; i < thatSigBytes; i += 1) {
                const thatByte =
                    (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                thisWords[(thisSigBytes + i) >>> 2] |=
                    thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
            }
        } else {
            // Copy one word at a time
            for (let i = 0; i < thatSigBytes; i += 4) {
                thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
            }
        }
        this.sigBytes += thatSigBytes;

        // Chainable
        return this;
    }

    /**
     * Removes insignificant bits.
     *
     * @example
     *
     *     wordArray.clamp();
     */
    clamp() {
        // Shortcuts
        const { words, sigBytes } = this;

        // Clamp
        words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
        words.length = Math.ceil(sigBytes / 4);
    }

    /**
     * Creates a copy of this word array.
     *
     * @return {WordArray} The clone.
     *
     * @example
     *
     *     var clone = wordArray.clone();
     */
    clone() {
        const clone = super.clone.call(this);
        clone.words = this.words.slice(0);

        return clone;
    }
}

/**
 * Hex encoding strategy.
 */
const Hex = {
    /**
     * Converts a word array to a hex string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The hex string.
     *
     * @static
     *
     * @example
     *
     *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
     */
    stringify(wordArray) {
        // Shortcuts
        const { words, sigBytes } = wordArray;

        // Convert
        const hexChars = [];
        for (let i = 0; i < sigBytes; i += 1) {
            const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            hexChars.push((bite >>> 4).toString(16));
            hexChars.push((bite & 0x0f).toString(16));
        }

        return hexChars.join('');
    },

    /**
     * Converts a hex string to a word array.
     *
     * @param {string} hexStr The hex string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
     */
    parse(hexStr) {
        // Shortcut
        const hexStrLength = hexStr.length;

        // Convert
        const words = [];
        for (let i = 0; i < hexStrLength; i += 2) {
            words[i >>> 3] |=
                parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
        }

        return new WordArray(words, hexStrLength / 2);
    },
};

/**
 * Latin1 encoding strategy.
 */
const Latin1 = {
    /**
     * Converts a word array to a Latin1 string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The Latin1 string.
     *
     * @static
     *
     * @example
     *
     *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
     */
    stringify(wordArray) {
        // Shortcuts
        const { words, sigBytes } = wordArray;

        // Convert
        const latin1Chars = [];
        for (let i = 0; i < sigBytes; i += 1) {
            const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            latin1Chars.push(String.fromCharCode(bite));
        }

        return latin1Chars.join('');
    },

    /**
     * Converts a Latin1 string to a word array.
     *
     * @param {string} latin1Str The Latin1 string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
     */
    parse(latin1Str) {
        // Shortcut
        const latin1StrLength = latin1Str.length;

        // Convert
        const words = [];
        for (let i = 0; i < latin1StrLength; i += 1) {
            words[i >>> 2] |=
                (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
        }

        return new WordArray(words, latin1StrLength);
    },
};

/**
 * UTF-8 encoding strategy.
 */
const Utf8 = {
    /**
     * Converts a word array to a UTF-8 string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The UTF-8 string.
     *
     * @static
     *
     * @example
     *
     *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
     */
    stringify(wordArray) {
        try {
            return decodeURIComponent(escape(Latin1.stringify(wordArray)));
        } catch (e) {
            throw new Error('Malformed UTF-8 data');
        }
    },

    /**
     * Converts a UTF-8 string to a word array.
     *
     * @param {string} utf8Str The UTF-8 string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
     */
    parse(utf8Str) {
        return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
    },
};

/**
 * Abstract buffered block algorithm template.
 *
 * The property blockSize must be implemented in a concrete subtype.
 *
 * @property {number} _minBufferSize
 *
 *     The number of blocks that should be kept unprocessed in the buffer. Default: 0
 */
class BufferedBlockAlgorithm extends Base {
    constructor() {
        super();
        this._minBufferSize = 0;
    }

    /**
     * Resets this block algorithm's data buffer to its initial state.
     *
     * @example
     *
     *     bufferedBlockAlgorithm.reset();
     */
    reset() {
        // Initial values
        this._data = new WordArray();
        this._nDataBytes = 0;
    }

    /**
     * Adds new data to this block algorithm's buffer.
     *
     * @param {WordArray|string} data
     *
     *     The data to append. Strings are converted to a WordArray using UTF-8.
     *
     * @example
     *
     *     bufferedBlockAlgorithm._append('data');
     *     bufferedBlockAlgorithm._append(wordArray);
     */
    _append(data) {
        let m_data = data;

        // Convert string to WordArray, else assume WordArray already
        if (typeof m_data === 'string') {
            m_data = Utf8.parse(m_data);
        }

        // Append
        this._data.concat(m_data);
        this._nDataBytes += m_data.sigBytes;
    }

    /**
     * Processes available data blocks.
     *
     * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
     *
     * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
     *
     * @return {WordArray} The processed data.
     *
     * @example
     *
     *     var processedData = bufferedBlockAlgorithm._process();
     *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
     */
    _process(doFlush) {
        let processedWords;

        // Shortcuts
        const { _data: data, blockSize } = this;
        const dataWords = data.words;
        const dataSigBytes = data.sigBytes;
        const blockSizeBytes = blockSize * 4;

        // Count blocks ready
        let nBlocksReady = dataSigBytes / blockSizeBytes;
        if (doFlush) {
            // Round up to include partial blocks
            nBlocksReady = Math.ceil(nBlocksReady);
        } else {
            // Round down to include only full blocks,
            // less the number of blocks that must remain in the buffer
            nBlocksReady = Math.max(
                (nBlocksReady | 0) - this._minBufferSize,
                0
            );
        }

        // Count words ready
        const nWordsReady = nBlocksReady * blockSize;

        // Count bytes ready
        const nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

        // Process blocks
        if (nWordsReady) {
            for (let offset = 0; offset < nWordsReady; offset += blockSize) {
                // Perform concrete-algorithm logic
                this._doProcessBlock(dataWords, offset);
            }

            // Remove processed words
            processedWords = dataWords.splice(0, nWordsReady);
            data.sigBytes -= nBytesReady;
        }

        // Return processed words
        return new WordArray(processedWords, nBytesReady);
    }

    /**
     * Creates a copy of this object.
     *
     * @return {Object} The clone.
     *
     * @example
     *
     *     var clone = bufferedBlockAlgorithm.clone();
     */
    clone() {
        const clone = super.clone.call(this);
        clone._data = this._data.clone();

        return clone;
    }
}

/**
 * Abstract hasher template.
 *
 * @property {number} blockSize
 *
 *     The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
 */
class Hasher extends BufferedBlockAlgorithm {
    constructor(cfg) {
        super();

        this.blockSize = 512 / 32;

        /**
         * Configuration options.
         */
        this.cfg = Object.assign(new Base(), cfg);

        // Set initial values
        this.reset();
    }

    /**
     * Creates a shortcut function to a hasher's object interface.
     *
     * @param {Hasher} SubHasher The hasher to create a helper for.
     *
     * @return {Function} The shortcut function.
     *
     * @static
     *
     * @example
     *
     *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
     */
    static _createHelper(SubHasher) {
        return (message, cfg) => new SubHasher(cfg).finalize(message);
    }

    /**
     * Creates a shortcut function to the HMAC's object interface.
     *
     * @param {Hasher} SubHasher The hasher to use in this HMAC helper.
     *
     * @return {Function} The shortcut function.
     *
     * @static
     *
     * @example
     *
     *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
     */
    static _createHmacHelper(SubHasher) {
        return (message, key) => new HMAC(SubHasher, key).finalize(message);
    }

    /**
     * Resets this hasher to its initial state.
     *
     * @example
     *
     *     hasher.reset();
     */
    reset() {
        // Reset data buffer
        super.reset.call(this);

        // Perform concrete-hasher logic
        this._doReset();
    }

    /**
     * Updates this hasher with a message.
     *
     * @param {WordArray|string} messageUpdate The message to append.
     *
     * @return {Hasher} This hasher.
     *
     * @example
     *
     *     hasher.update('message');
     *     hasher.update(wordArray);
     */
    update(messageUpdate) {
        // Append
        this._append(messageUpdate);

        // Update the hash
        this._process();

        // Chainable
        return this;
    }

    /**
     * Finalizes the hash computation.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * @param {WordArray|string} messageUpdate (Optional) A final message update.
     *
     * @return {WordArray} The hash.
     *
     * @example
     *
     *     var hash = hasher.finalize();
     *     var hash = hasher.finalize('message');
     *     var hash = hasher.finalize(wordArray);
     */
    finalize(messageUpdate) {
        // Final message update
        if (messageUpdate) {
            this._append(messageUpdate);
        }

        // Perform concrete-hasher logic
        const hash = this._doFinalize();

        return hash;
    }
}

/**
 * HMAC algorithm.
 */
class HMAC extends Base {
    /**
     * Initializes a newly created HMAC.
     *
     * @param {Hasher} SubHasher The hash algorithm to use.
     * @param {WordArray|string} key The secret key.
     *
     * @example
     *
     *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
     */
    constructor(SubHasher, key) {
        super();

        const hasher = new SubHasher();
        this._hasher = hasher;

        // Convert string to WordArray, else assume WordArray already
        let _key = key;
        if (typeof _key === 'string') {
            _key = Utf8.parse(_key);
        }

        // Shortcuts
        const hasherBlockSize = hasher.blockSize;
        const hasherBlockSizeBytes = hasherBlockSize * 4;

        // Allow arbitrary length keys
        if (_key.sigBytes > hasherBlockSizeBytes) {
            _key = hasher.finalize(key);
        }

        // Clamp excess bits
        _key.clamp();

        // Clone key for inner and outer pads
        const oKey = _key.clone();
        this._oKey = oKey;
        const iKey = _key.clone();
        this._iKey = iKey;

        // Shortcuts
        const oKeyWords = oKey.words;
        const iKeyWords = iKey.words;

        // XOR keys with pad constants
        for (let i = 0; i < hasherBlockSize; i += 1) {
            oKeyWords[i] ^= 0x5c5c5c5c;
            iKeyWords[i] ^= 0x36363636;
        }
        oKey.sigBytes = hasherBlockSizeBytes;
        iKey.sigBytes = hasherBlockSizeBytes;

        // Set initial values
        this.reset();
    }

    /**
     * Resets this HMAC to its initial state.
     *
     * @example
     *
     *     hmacHasher.reset();
     */
    reset() {
        // Shortcut
        const hasher = this._hasher;

        // Reset
        hasher.reset();
        hasher.update(this._iKey);
    }

    /**
     * Updates this HMAC with a message.
     *
     * @param {WordArray|string} messageUpdate The message to append.
     *
     * @return {HMAC} This HMAC instance.
     *
     * @example
     *
     *     hmacHasher.update('message');
     *     hmacHasher.update(wordArray);
     */
    update(messageUpdate) {
        this._hasher.update(messageUpdate);

        // Chainable
        return this;
    }

    /**
     * Finalizes the HMAC computation.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * @param {WordArray|string} messageUpdate (Optional) A final message update.
     *
     * @return {WordArray} The HMAC.
     *
     * @example
     *
     *     var hmac = hmacHasher.finalize();
     *     var hmac = hmacHasher.finalize('message');
     *     var hmac = hmacHasher.finalize(wordArray);
     */
    finalize(messageUpdate) {
        // Shortcut
        const hasher = this._hasher;

        // Compute HMAC
        const innerHash = hasher.finalize(messageUpdate);
        hasher.reset();
        const hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

        return hmac;
    }
}

const X32WordArray = WordArray;

/**
 * A 64-bit word.
 */
class X64Word extends Base {
    /**
     * Initializes a newly created 64-bit word.
     *
     * @param {number} high The high 32 bits.
     * @param {number} low The low 32 bits.
     *
     * @example
     *
     *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
     */
    constructor(high, low) {
        super();

        this.high = high;
        this.low = low;
    }
}

/**
 * An array of 64-bit words.
 *
 * @property {Array} words The array of CryptoJS.x64.Word objects.
 * @property {number} sigBytes The number of significant bytes in this word array.
 */
class X64WordArray extends Base {
    /**
     * Initializes a newly created word array.
     *
     * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
     * @param {number} sigBytes (Optional) The number of significant bytes in the words.
     *
     * @example
     *
     *     var wordArray = CryptoJS.x64.WordArray.create();
     *
     *     var wordArray = CryptoJS.x64.WordArray.create([
     *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
     *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
     *     ]);
     *
     *     var wordArray = CryptoJS.x64.WordArray.create([
     *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
     *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
     *     ], 10);
     */
    constructor(words = [], sigBytes = words.length * 8) {
        super();

        this.words = words;
        this.sigBytes = sigBytes;
    }

    /**
     * Converts this 64-bit word array to a 32-bit word array.
     *
     * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
     *
     * @example
     *
     *     var x32WordArray = x64WordArray.toX32();
     */
    toX32() {
        // Shortcuts
        const x64Words = this.words;
        const x64WordsLength = x64Words.length;

        // Convert
        const x32Words = [];
        for (let i = 0; i < x64WordsLength; i += 1) {
            const x64Word = x64Words[i];
            x32Words.push(x64Word.high);
            x32Words.push(x64Word.low);
        }

        return X32WordArray.create(x32Words, this.sigBytes);
    }

    /**
     * Creates a copy of this word array.
     *
     * @return {X64WordArray} The clone.
     *
     * @example
     *
     *     var clone = x64WordArray.clone();
     */
    clone() {
        const clone = super.clone.call(this);

        // Clone "words" array
        clone.words = this.words.slice(0);
        const { words } = clone;

        // Clone each X64Word object
        const wordsLength = words.length;
        for (let i = 0; i < wordsLength; i += 1) {
            words[i] = words[i].clone();
        }

        return clone;
    }
}

const parseLoop = (base64Str, base64StrLength, reverseMap) => {
    const words = [];
    let nBytes = 0;
    for (let i = 0; i < base64StrLength; i += 1) {
        if (i % 4) {
            const bits1 =
                reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
            const bits2 =
                reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
            const bitsCombined = bits1 | bits2;
            words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
            nBytes += 1;
        }
    }
    return WordArray.create(words, nBytes);
};

/**
 * Base64 encoding strategy.
 */
const Base64 = {
    /**
     * Converts a word array to a Base64 string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The Base64 string.
     *
     * @static
     *
     * @example
     *
     *     const base64String = CryptoJS.enc.Base64.stringify(wordArray);
     */
    stringify(wordArray) {
        // Shortcuts
        const { words, sigBytes } = wordArray;
        const map = this._map;

        // Clamp excess bits
        wordArray.clamp();

        // Convert
        const base64Chars = [];
        for (let i = 0; i < sigBytes; i += 3) {
            const byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            const byte2 =
                (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
            const byte3 =
                (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

            const triplet = (byte1 << 16) | (byte2 << 8) | byte3;

            for (let j = 0; j < 4 && i + j * 0.75 < sigBytes; j += 1) {
                base64Chars.push(
                    map.charAt((triplet >>> (6 * (3 - j))) & 0x3f)
                );
            }
        }

        // Add padding
        const paddingChar = map.charAt(64);
        if (paddingChar) {
            while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
            }
        }

        return base64Chars.join('');
    },

    /**
     * Converts a Base64 string to a word array.
     *
     * @param {string} base64Str The Base64 string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     const wordArray = CryptoJS.enc.Base64.parse(base64String);
     */
    parse(base64Str) {
        // Shortcuts
        let base64StrLength = base64Str.length;
        const map = this._map;
        let reverseMap = this._reverseMap;

        if (!reverseMap) {
            this._reverseMap = [];
            reverseMap = this._reverseMap;
            for (let j = 0; j < map.length; j += 1) {
                reverseMap[map.charCodeAt(j)] = j;
            }
        }

        // Ignore padding
        const paddingChar = map.charAt(64);
        if (paddingChar) {
            const paddingIndex = base64Str.indexOf(paddingChar);
            if (paddingIndex !== -1) {
                base64StrLength = paddingIndex;
            }
        }

        // Convert
        return parseLoop(base64Str, base64StrLength, reverseMap);
    },

    _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
};

// Constants table
const T$1 = [];

// Compute constants
for (let i = 0; i < 64; i += 1) {
    T$1[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
}

const FF = (a, b, c, d, x, s, t) => {
    const n = a + ((b & c) | (~b & d)) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

const GG = (a, b, c, d, x, s, t) => {
    const n = a + ((b & d) | (c & ~d)) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

const HH = (a, b, c, d, x, s, t) => {
    const n = a + (b ^ c ^ d) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

const II = (a, b, c, d, x, s, t) => {
    const n = a + (c ^ (b | ~d)) + x + t;
    return ((n << s) | (n >>> (32 - s))) + b;
};

/**
 * MD5 hash algorithm.
 */
class MD5Algo extends Hasher {
    _doReset() {
        this._hash = new WordArray([
            0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476,
        ]);
    }

    _doProcessBlock(M, offset) {
        const _M = M;

        // Swap endian
        for (let i = 0; i < 16; i += 1) {
            // Shortcuts
            const offset_i = offset + i;
            const M_offset_i = M[offset_i];

            _M[offset_i] =
                (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00);
        }

        // Shortcuts
        const H = this._hash.words;

        const M_offset_0 = _M[offset + 0];
        const M_offset_1 = _M[offset + 1];
        const M_offset_2 = _M[offset + 2];
        const M_offset_3 = _M[offset + 3];
        const M_offset_4 = _M[offset + 4];
        const M_offset_5 = _M[offset + 5];
        const M_offset_6 = _M[offset + 6];
        const M_offset_7 = _M[offset + 7];
        const M_offset_8 = _M[offset + 8];
        const M_offset_9 = _M[offset + 9];
        const M_offset_10 = _M[offset + 10];
        const M_offset_11 = _M[offset + 11];
        const M_offset_12 = _M[offset + 12];
        const M_offset_13 = _M[offset + 13];
        const M_offset_14 = _M[offset + 14];
        const M_offset_15 = _M[offset + 15];

        // Working varialbes
        let a = H[0];
        let b = H[1];
        let c = H[2];
        let d = H[3];

        // Computation
        a = FF(a, b, c, d, M_offset_0, 7, T$1[0]);
        d = FF(d, a, b, c, M_offset_1, 12, T$1[1]);
        c = FF(c, d, a, b, M_offset_2, 17, T$1[2]);
        b = FF(b, c, d, a, M_offset_3, 22, T$1[3]);
        a = FF(a, b, c, d, M_offset_4, 7, T$1[4]);
        d = FF(d, a, b, c, M_offset_5, 12, T$1[5]);
        c = FF(c, d, a, b, M_offset_6, 17, T$1[6]);
        b = FF(b, c, d, a, M_offset_7, 22, T$1[7]);
        a = FF(a, b, c, d, M_offset_8, 7, T$1[8]);
        d = FF(d, a, b, c, M_offset_9, 12, T$1[9]);
        c = FF(c, d, a, b, M_offset_10, 17, T$1[10]);
        b = FF(b, c, d, a, M_offset_11, 22, T$1[11]);
        a = FF(a, b, c, d, M_offset_12, 7, T$1[12]);
        d = FF(d, a, b, c, M_offset_13, 12, T$1[13]);
        c = FF(c, d, a, b, M_offset_14, 17, T$1[14]);
        b = FF(b, c, d, a, M_offset_15, 22, T$1[15]);

        a = GG(a, b, c, d, M_offset_1, 5, T$1[16]);
        d = GG(d, a, b, c, M_offset_6, 9, T$1[17]);
        c = GG(c, d, a, b, M_offset_11, 14, T$1[18]);
        b = GG(b, c, d, a, M_offset_0, 20, T$1[19]);
        a = GG(a, b, c, d, M_offset_5, 5, T$1[20]);
        d = GG(d, a, b, c, M_offset_10, 9, T$1[21]);
        c = GG(c, d, a, b, M_offset_15, 14, T$1[22]);
        b = GG(b, c, d, a, M_offset_4, 20, T$1[23]);
        a = GG(a, b, c, d, M_offset_9, 5, T$1[24]);
        d = GG(d, a, b, c, M_offset_14, 9, T$1[25]);
        c = GG(c, d, a, b, M_offset_3, 14, T$1[26]);
        b = GG(b, c, d, a, M_offset_8, 20, T$1[27]);
        a = GG(a, b, c, d, M_offset_13, 5, T$1[28]);
        d = GG(d, a, b, c, M_offset_2, 9, T$1[29]);
        c = GG(c, d, a, b, M_offset_7, 14, T$1[30]);
        b = GG(b, c, d, a, M_offset_12, 20, T$1[31]);

        a = HH(a, b, c, d, M_offset_5, 4, T$1[32]);
        d = HH(d, a, b, c, M_offset_8, 11, T$1[33]);
        c = HH(c, d, a, b, M_offset_11, 16, T$1[34]);
        b = HH(b, c, d, a, M_offset_14, 23, T$1[35]);
        a = HH(a, b, c, d, M_offset_1, 4, T$1[36]);
        d = HH(d, a, b, c, M_offset_4, 11, T$1[37]);
        c = HH(c, d, a, b, M_offset_7, 16, T$1[38]);
        b = HH(b, c, d, a, M_offset_10, 23, T$1[39]);
        a = HH(a, b, c, d, M_offset_13, 4, T$1[40]);
        d = HH(d, a, b, c, M_offset_0, 11, T$1[41]);
        c = HH(c, d, a, b, M_offset_3, 16, T$1[42]);
        b = HH(b, c, d, a, M_offset_6, 23, T$1[43]);
        a = HH(a, b, c, d, M_offset_9, 4, T$1[44]);
        d = HH(d, a, b, c, M_offset_12, 11, T$1[45]);
        c = HH(c, d, a, b, M_offset_15, 16, T$1[46]);
        b = HH(b, c, d, a, M_offset_2, 23, T$1[47]);

        a = II(a, b, c, d, M_offset_0, 6, T$1[48]);
        d = II(d, a, b, c, M_offset_7, 10, T$1[49]);
        c = II(c, d, a, b, M_offset_14, 15, T$1[50]);
        b = II(b, c, d, a, M_offset_5, 21, T$1[51]);
        a = II(a, b, c, d, M_offset_12, 6, T$1[52]);
        d = II(d, a, b, c, M_offset_3, 10, T$1[53]);
        c = II(c, d, a, b, M_offset_10, 15, T$1[54]);
        b = II(b, c, d, a, M_offset_1, 21, T$1[55]);
        a = II(a, b, c, d, M_offset_8, 6, T$1[56]);
        d = II(d, a, b, c, M_offset_15, 10, T$1[57]);
        c = II(c, d, a, b, M_offset_6, 15, T$1[58]);
        b = II(b, c, d, a, M_offset_13, 21, T$1[59]);
        a = II(a, b, c, d, M_offset_4, 6, T$1[60]);
        d = II(d, a, b, c, M_offset_11, 10, T$1[61]);
        c = II(c, d, a, b, M_offset_2, 15, T$1[62]);
        b = II(b, c, d, a, M_offset_9, 21, T$1[63]);

        // Intermediate hash value
        H[0] = (H[0] + a) | 0;
        H[1] = (H[1] + b) | 0;
        H[2] = (H[2] + c) | 0;
        H[3] = (H[3] + d) | 0;
    }
    /* eslint-ensable no-param-reassign */

    _doFinalize() {
        // Shortcuts
        const data = this._data;
        const dataWords = data.words;

        const nBitsTotal = this._nDataBytes * 8;
        const nBitsLeft = data.sigBytes * 8;

        // Add padding
        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));

        const nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
        const nBitsTotalL = nBitsTotal;
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] =
            (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
            (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00);
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] =
            (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
            (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00);

        data.sigBytes = (dataWords.length + 1) * 4;

        // Hash final blocks
        this._process();

        // Shortcuts
        const hash = this._hash;
        const H = hash.words;

        // Swap endian
        for (let i = 0; i < 4; i += 1) {
            // Shortcut
            const H_i = H[i];

            H[i] =
                (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
        }

        // Return final computed hash
        return hash;
    }

    clone() {
        const clone = super.clone.call(this);
        clone._hash = this._hash.clone();

        return clone;
    }
}

/**
 * Shortcut function to the hasher's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 *
 * @return {WordArray} The hash.
 *
 * @static
 *
 * @example
 *
 *     var hash = CryptoJS.MD5('message');
 *     var hash = CryptoJS.MD5(wordArray);
 */
const MD5 = Hasher._createHelper(MD5Algo);

/**
 * Shortcut function to the HMAC's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 * @param {WordArray|string} key The secret key.
 *
 * @return {WordArray} The HMAC.
 *
 * @static
 *
 * @example
 *
 *     var hmac = CryptoJS.HmacMD5(message, key);
 */
const HmacMD5 = Hasher._createHmacHelper(MD5Algo);

/**
 * This key derivation function is meant to conform with EVP_BytesToKey.
 * www.openssl.org/docs/crypto/EVP_BytesToKey.html
 */
class EvpKDFAlgo extends Base {
    /**
     * Initializes a newly created key derivation function.
     *
     * @param {Object} cfg (Optional) The configuration options to use for the derivation.
     *
     * @example
     *
     *     const kdf = CryptoJS.algo.EvpKDF.create();
     *     const kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
     *     const kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
     */
    constructor(cfg) {
        super();

        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        this.cfg = Object.assign(
            new Base(),
            {
                keySize: 128 / 32,
                hasher: MD5Algo,
                iterations: 1,
            },
            cfg
        );
    }

    /**
     * Derives a key from a password.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     *
     * @return {WordArray} The derived key.
     *
     * @example
     *
     *     const key = kdf.compute(password, salt);
     */
    compute(password, salt) {
        let block;

        // Shortcut
        const { cfg } = this;

        // Init hasher
        const hasher = cfg.hasher.create();

        // Initial values
        const derivedKey = WordArray.create();

        // Shortcuts
        const derivedKeyWords = derivedKey.words;
        const { keySize, iterations } = cfg;

        // Generate key
        while (derivedKeyWords.length < keySize) {
            if (block) {
                hasher.update(block);
            }
            block = hasher.update(password).finalize(salt);
            hasher.reset();

            // Iterations
            for (let i = 1; i < iterations; i += 1) {
                block = hasher.finalize(block);
                hasher.reset();
            }

            derivedKey.concat(block);
        }
        derivedKey.sigBytes = keySize * 4;

        return derivedKey;
    }
}

/**
 * Derives a key from a password.
 *
 * @param {WordArray|string} password The password.
 * @param {WordArray|string} salt A salt.
 * @param {Object} cfg (Optional) The configuration options to use for this computation.
 *
 * @return {WordArray} The derived key.
 *
 * @static
 *
 * @example
 *
 *     var key = CryptoJS.EvpKDF(password, salt);
 *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
 *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
 */
const EvpKDF = (password, salt, cfg) =>
    EvpKDFAlgo.create(cfg).compute(password, salt);

/* eslint-disable no-use-before-define */

/**
 * Abstract base cipher template.
 *
 * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
 * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
 * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
 * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
 */
class Cipher extends BufferedBlockAlgorithm {
    /**
     * Initializes a newly created cipher.
     *
     * @param {number} xformMode Either the encryption or decryption transormation mode constant.
     * @param {WordArray} key The key.
     * @param {Object} cfg (Optional) The configuration options to use for this operation.
     *
     * @example
     *
     *     const cipher = CryptoJS.algo.AES.create(
     *       CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray }
     *     );
     */
    constructor(xformMode, key, cfg) {
        super();

        /**
         * Configuration options.
         *
         * @property {WordArray} iv The IV to use for this operation.
         */
        this.cfg = Object.assign(new Base(), cfg);

        // Store transform mode and key
        this._xformMode = xformMode;
        this._key = key;

        // Set initial values
        this.reset();
    }

    /**
     * Creates this cipher in encryption mode.
     *
     * @param {WordArray} key The key.
     * @param {Object} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {Cipher} A cipher instance.
     *
     * @static
     *
     * @example
     *
     *     const cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
     */
    static createEncryptor(key, cfg) {
        return this.create(this._ENC_XFORM_MODE, key, cfg);
    }

    /**
     * Creates this cipher in decryption mode.
     *
     * @param {WordArray} key The key.
     * @param {Object} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {Cipher} A cipher instance.
     *
     * @static
     *
     * @example
     *
     *     const cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
     */
    static createDecryptor(key, cfg) {
        return this.create(this._DEC_XFORM_MODE, key, cfg);
    }

    /**
     * Creates shortcut functions to a cipher's object interface.
     *
     * @param {Cipher} cipher The cipher to create a helper for.
     *
     * @return {Object} An object with encrypt and decrypt shortcut functions.
     *
     * @static
     *
     * @example
     *
     *     const AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
     */
    static _createHelper(SubCipher) {
        const selectCipherStrategy = (key) => {
            if (typeof key === 'string') {
                return PasswordBasedCipher;
            }
            return SerializableCipher;
        };

        return {
            encrypt(message, key, cfg) {
                return selectCipherStrategy(key).encrypt(
                    SubCipher,
                    message,
                    key,
                    cfg
                );
            },

            decrypt(ciphertext, key, cfg) {
                return selectCipherStrategy(key).decrypt(
                    SubCipher,
                    ciphertext,
                    key,
                    cfg
                );
            },
        };
    }

    /**
     * Resets this cipher to its initial state.
     *
     * @example
     *
     *     cipher.reset();
     */
    reset() {
        // Reset data buffer
        super.reset.call(this);

        // Perform concrete-cipher logic
        this._doReset();
    }

    /**
     * Adds data to be encrypted or decrypted.
     *
     * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
     *
     * @return {WordArray} The data after processing.
     *
     * @example
     *
     *     const encrypted = cipher.process('data');
     *     const encrypted = cipher.process(wordArray);
     */
    process(dataUpdate) {
        // Append
        this._append(dataUpdate);

        // Process available blocks
        return this._process();
    }

    /**
     * Finalizes the encryption or decryption process.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
     *
     * @return {WordArray} The data after final processing.
     *
     * @example
     *
     *     const encrypted = cipher.finalize();
     *     const encrypted = cipher.finalize('data');
     *     const encrypted = cipher.finalize(wordArray);
     */
    finalize(dataUpdate) {
        // Final data update
        if (dataUpdate) {
            this._append(dataUpdate);
        }

        // Perform concrete-cipher logic
        const finalProcessedData = this._doFinalize();

        return finalProcessedData;
    }
}
Cipher._ENC_XFORM_MODE = 1;
Cipher._DEC_XFORM_MODE = 2;
Cipher.keySize = 128 / 32;
Cipher.ivSize = 128 / 32;

/**
 * Abstract base stream cipher template.
 *
 * @property {number} blockSize
 *
 *     The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
 */
class StreamCipher extends Cipher {
    constructor(...args) {
        super(...args);

        this.blockSize = 1;
    }

    _doFinalize() {
        // Process partial blocks
        const finalProcessedBlocks = this._process(!!'flush');

        return finalProcessedBlocks;
    }
}

/**
 * Abstract base block cipher mode template.
 */
class BlockCipherMode extends Base {
    /**
     * Initializes a newly created mode.
     *
     * @param {Cipher} cipher A block cipher instance.
     * @param {Array} iv The IV words.
     *
     * @example
     *
     *     const mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
     */
    constructor(cipher, iv) {
        super();

        this._cipher = cipher;
        this._iv = iv;
    }

    /**
     * Creates this mode for encryption.
     *
     * @param {Cipher} cipher A block cipher instance.
     * @param {Array} iv The IV words.
     *
     * @static
     *
     * @example
     *
     *     const mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
     */
    static createEncryptor(cipher, iv) {
        return this.Encryptor.create(cipher, iv);
    }

    /**
     * Creates this mode for decryption.
     *
     * @param {Cipher} cipher A block cipher instance.
     * @param {Array} iv The IV words.
     *
     * @static
     *
     * @example
     *
     *     const mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
     */
    static createDecryptor(cipher, iv) {
        return this.Decryptor.create(cipher, iv);
    }
}

function xorBlock(words, offset, blockSize) {
    const _words = words;
    let block;

    // Shortcut
    const iv = this._iv;

    // Choose mixing block
    if (iv) {
        block = iv;

        // Remove IV for subsequent blocks
        this._iv = undefined;
    } else {
        block = this._prevBlock;
    }

    // XOR blocks
    for (let i = 0; i < blockSize; i += 1) {
        _words[offset + i] ^= block[i];
    }
}

/**
 * Cipher Block Chaining mode.
 */

/**
 * Abstract base CBC mode.
 */
class CBC extends BlockCipherMode {}
/**
 * CBC encryptor.
 */
CBC.Encryptor = class extends CBC {
    /**
     * Processes the data block at offset.
     *
     * @param {Array} words The data words to operate on.
     * @param {number} offset The offset where the block starts.
     *
     * @example
     *
     *     mode.processBlock(data.words, offset);
     */
    processBlock(words, offset) {
        // Shortcuts
        const cipher = this._cipher;
        const { blockSize } = cipher;

        // XOR and encrypt
        xorBlock.call(this, words, offset, blockSize);
        cipher.encryptBlock(words, offset);

        // Remember this block to use with next block
        this._prevBlock = words.slice(offset, offset + blockSize);
    }
};
/**
 * CBC decryptor.
 */
CBC.Decryptor = class extends CBC {
    /**
     * Processes the data block at offset.
     *
     * @param {Array} words The data words to operate on.
     * @param {number} offset The offset where the block starts.
     *
     * @example
     *
     *     mode.processBlock(data.words, offset);
     */
    processBlock(words, offset) {
        // Shortcuts
        const cipher = this._cipher;
        const { blockSize } = cipher;

        // Remember this block to use with next block
        const thisBlock = words.slice(offset, offset + blockSize);

        // Decrypt and XOR
        cipher.decryptBlock(words, offset);
        xorBlock.call(this, words, offset, blockSize);

        // This block becomes the previous block
        this._prevBlock = thisBlock;
    }
};

/**
 * PKCS #5/7 padding strategy.
 */
const Pkcs7 = {
    /**
     * Pads data using the algorithm defined in PKCS #5/7.
     *
     * @param {WordArray} data The data to pad.
     * @param {number} blockSize The multiple that the data should be padded to.
     *
     * @static
     *
     * @example
     *
     *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
     */
    pad(data, blockSize) {
        // Shortcut
        const blockSizeBytes = blockSize * 4;

        // Count padding bytes
        const nPaddingBytes = blockSizeBytes - (data.sigBytes % blockSizeBytes);

        // Create padding word
        const paddingWord =
            (nPaddingBytes << 24) |
            (nPaddingBytes << 16) |
            (nPaddingBytes << 8) |
            nPaddingBytes;

        // Create padding
        const paddingWords = [];
        for (let i = 0; i < nPaddingBytes; i += 4) {
            paddingWords.push(paddingWord);
        }
        const padding = WordArray.create(paddingWords, nPaddingBytes);

        // Add padding
        data.concat(padding);
    },

    /**
     * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
     *
     * @param {WordArray} data The data to unpad.
     *
     * @static
     *
     * @example
     *
     *     CryptoJS.pad.Pkcs7.unpad(wordArray);
     */
    unpad(data) {
        const _data = data;

        // Get number of padding bytes from last byte
        const nPaddingBytes = _data.words[(_data.sigBytes - 1) >>> 2] & 0xff;

        // Remove padding
        _data.sigBytes -= nPaddingBytes;
    },
};

/**
 * Abstract base block cipher template.
 *
 * @property {number} blockSize
 *
 *    The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
 */
class BlockCipher extends Cipher {
    constructor(xformMode, key, cfg) {
        /**
         * Configuration options.
         *
         * @property {Mode} mode The block mode to use. Default: CBC
         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
         */
        super(
            xformMode,
            key,
            Object.assign(
                {
                    mode: CBC,
                    padding: Pkcs7,
                },
                cfg
            )
        );

        this.blockSize = 128 / 32;
    }

    reset() {
        let modeCreator;

        // Reset cipher
        super.reset.call(this);

        // Shortcuts
        const { cfg } = this;
        const { iv, mode } = cfg;

        // Reset block mode
        if (this._xformMode === this.constructor._ENC_XFORM_MODE) {
            modeCreator = mode.createEncryptor;
        } /* if (this._xformMode == this._DEC_XFORM_MODE) */ else {
            modeCreator = mode.createDecryptor;
            // Keep at least one block in the buffer for unpadding
            this._minBufferSize = 1;
        }

        this._mode = modeCreator.call(mode, this, iv && iv.words);
        this._mode.__creator = modeCreator;
    }

    _doProcessBlock(words, offset) {
        this._mode.processBlock(words, offset);
    }

    _doFinalize() {
        let finalProcessedBlocks;

        // Shortcut
        const { padding } = this.cfg;

        // Finalize
        if (this._xformMode === this.constructor._ENC_XFORM_MODE) {
            // Pad data
            padding.pad(this._data, this.blockSize);

            // Process final blocks
            finalProcessedBlocks = this._process(!!'flush');
        } /* if (this._xformMode == this._DEC_XFORM_MODE) */ else {
            // Process final blocks
            finalProcessedBlocks = this._process(!!'flush');

            // Unpad data
            padding.unpad(finalProcessedBlocks);
        }

        return finalProcessedBlocks;
    }
}

/**
 * A collection of cipher parameters.
 *
 * @property {WordArray} ciphertext The raw ciphertext.
 * @property {WordArray} key The key to this ciphertext.
 * @property {WordArray} iv The IV used in the ciphering operation.
 * @property {WordArray} salt The salt used with a key derivation function.
 * @property {Cipher} algorithm The cipher algorithm.
 * @property {Mode} mode The block mode used in the ciphering operation.
 * @property {Padding} padding The padding scheme used in the ciphering operation.
 * @property {number} blockSize The block size of the cipher.
 * @property {Format} formatter
 *    The default formatting strategy to convert this cipher params object to a string.
 */
class CipherParams extends Base {
    /**
     * Initializes a newly created cipher params object.
     *
     * @param {Object} cipherParams An object with any of the possible cipher parameters.
     *
     * @example
     *
     *     var cipherParams = CryptoJS.lib.CipherParams.create({
     *         ciphertext: ciphertextWordArray,
     *         key: keyWordArray,
     *         iv: ivWordArray,
     *         salt: saltWordArray,
     *         algorithm: CryptoJS.algo.AES,
     *         mode: CryptoJS.mode.CBC,
     *         padding: CryptoJS.pad.PKCS7,
     *         blockSize: 4,
     *         formatter: CryptoJS.format.OpenSSL
     *     });
     */
    constructor(cipherParams) {
        super();

        this.mixIn(cipherParams);
    }

    /**
     * Converts this cipher params object to a string.
     *
     * @param {Format} formatter (Optional) The formatting strategy to use.
     *
     * @return {string} The stringified cipher params.
     *
     * @throws Error If neither the formatter nor the default formatter is set.
     *
     * @example
     *
     *     var string = cipherParams + '';
     *     var string = cipherParams.toString();
     *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
     */
    toString(formatter) {
        return (formatter || this.formatter).stringify(this);
    }
}

/**
 * OpenSSL formatting strategy.
 */
const OpenSSLFormatter = {
    /**
     * Converts a cipher params object to an OpenSSL-compatible string.
     *
     * @param {CipherParams} cipherParams The cipher params object.
     *
     * @return {string} The OpenSSL-compatible string.
     *
     * @static
     *
     * @example
     *
     *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
     */
    stringify(cipherParams) {
        let wordArray;

        // Shortcuts
        const { ciphertext, salt } = cipherParams;

        // Format
        if (salt) {
            wordArray = WordArray.create([0x53616c74, 0x65645f5f])
                .concat(salt)
                .concat(ciphertext);
        } else {
            wordArray = ciphertext;
        }

        return wordArray.toString(Base64);
    },

    /**
     * Converts an OpenSSL-compatible string to a cipher params object.
     *
     * @param {string} openSSLStr The OpenSSL-compatible string.
     *
     * @return {CipherParams} The cipher params object.
     *
     * @static
     *
     * @example
     *
     *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
     */
    parse(openSSLStr) {
        let salt;

        // Parse base64
        const ciphertext = Base64.parse(openSSLStr);

        // Shortcut
        const ciphertextWords = ciphertext.words;

        // Test for salt
        if (
            ciphertextWords[0] === 0x53616c74 &&
            ciphertextWords[1] === 0x65645f5f
        ) {
            // Extract salt
            salt = WordArray.create(ciphertextWords.slice(2, 4));

            // Remove salt from ciphertext
            ciphertextWords.splice(0, 4);
            ciphertext.sigBytes -= 16;
        }

        return CipherParams.create({ ciphertext, salt });
    },
};

/**
 * A cipher wrapper that returns ciphertext as a serializable cipher params object.
 */
class SerializableCipher extends Base {
    /**
     * Encrypts a message.
     *
     * @param {Cipher} cipher The cipher algorithm to use.
     * @param {WordArray|string} message The message to encrypt.
     * @param {WordArray} key The key.
     * @param {Object} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {CipherParams} A cipher params object.
     *
     * @static
     *
     * @example
     *
     *     var ciphertextParams = CryptoJS.lib.SerializableCipher
     *       .encrypt(CryptoJS.algo.AES, message, key);
     *     var ciphertextParams = CryptoJS.lib.SerializableCipher
     *       .encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
     *     var ciphertextParams = CryptoJS.lib.SerializableCipher
     *       .encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
     */
    static encrypt(cipher, message, key, cfg) {
        // Apply config defaults
        const _cfg = Object.assign(new Base(), this.cfg, cfg);

        // Encrypt
        const encryptor = cipher.createEncryptor(key, _cfg);
        const ciphertext = encryptor.finalize(message);

        // Shortcut
        const cipherCfg = encryptor.cfg;

        // Create and return serializable cipher params
        return CipherParams.create({
            ciphertext,
            key,
            iv: cipherCfg.iv,
            algorithm: cipher,
            mode: cipherCfg.mode,
            padding: cipherCfg.padding,
            blockSize: encryptor.blockSize,
            formatter: _cfg.format,
        });
    }

    /**
     * Decrypts serialized ciphertext.
     *
     * @param {Cipher} cipher The cipher algorithm to use.
     * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
     * @param {WordArray} key The key.
     * @param {Object} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {WordArray} The plaintext.
     *
     * @static
     *
     * @example
     *
     *     var plaintext = CryptoJS.lib.SerializableCipher
     *       .decrypt(CryptoJS.algo.AES, formattedCiphertext, key,
     *         { iv: iv, format: CryptoJS.format.OpenSSL });
     *     var plaintext = CryptoJS.lib.SerializableCipher
     *       .decrypt(CryptoJS.algo.AES, ciphertextParams, key,
     *         { iv: iv, format: CryptoJS.format.OpenSSL });
     */
    static decrypt(cipher, ciphertext, key, cfg) {
        let _ciphertext = ciphertext;

        // Apply config defaults
        const _cfg = Object.assign(new Base(), this.cfg, cfg);

        // Convert string to CipherParams
        _ciphertext = this._parse(_ciphertext, _cfg.format);

        // Decrypt
        const plaintext = cipher
            .createDecryptor(key, _cfg)
            .finalize(_ciphertext.ciphertext);

        return plaintext;
    }

    /**
     * Converts serialized ciphertext to CipherParams,
     * else assumed CipherParams already and returns ciphertext unchanged.
     *
     * @param {CipherParams|string} ciphertext The ciphertext.
     * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
     *
     * @return {CipherParams} The unserialized ciphertext.
     *
     * @static
     *
     * @example
     *
     *     var ciphertextParams = CryptoJS.lib.SerializableCipher
     *       ._parse(ciphertextStringOrParams, format);
     */
    static _parse(ciphertext, format) {
        if (typeof ciphertext === 'string') {
            return format.parse(ciphertext, this);
        }
        return ciphertext;
    }
}
/**
 * Configuration options.
 *
 * @property {Formatter} format
 *
 *    The formatting strategy to convert cipher param objects to and from a string.
 *    Default: OpenSSL
 */
SerializableCipher.cfg = Object.assign(new Base(), {
    format: OpenSSLFormatter,
});

/**
 * OpenSSL key derivation function.
 */
const OpenSSLKdf = {
    /**
     * Derives a key and IV from a password.
     *
     * @param {string} password The password to derive from.
     * @param {number} keySize The size in words of the key to generate.
     * @param {number} ivSize The size in words of the IV to generate.
     * @param {WordArray|string} salt
     *     (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
     *
     * @return {CipherParams} A cipher params object with the key, IV, and salt.
     *
     * @static
     *
     * @example
     *
     *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
     *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
     */
    execute(password, keySize, ivSize, salt) {
        let _salt = salt;

        // Generate random salt
        if (!_salt) {
            _salt = WordArray.random(64 / 8);
        }

        // Derive key and IV
        const key = EvpKDFAlgo.create({ keySize: keySize + ivSize }).compute(
            password,
            _salt
        );

        // Separate key and IV
        const iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
        key.sigBytes = keySize * 4;

        // Return params
        return CipherParams.create({ key, iv, salt: _salt });
    },
};

/**
 * A serializable cipher wrapper that derives the key from a password,
 * and returns ciphertext as a serializable cipher params object.
 */
class PasswordBasedCipher extends SerializableCipher {
    /**
     * Encrypts a message using a password.
     *
     * @param {Cipher} cipher The cipher algorithm to use.
     * @param {WordArray|string} message The message to encrypt.
     * @param {string} password The password.
     * @param {Object} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {CipherParams} A cipher params object.
     *
     * @static
     *
     * @example
     *
     *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher
     *       .encrypt(CryptoJS.algo.AES, message, 'password');
     *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher
     *       .encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
     */
    static encrypt(cipher, message, password, cfg) {
        // Apply config defaults
        const _cfg = Object.assign(new Base(), this.cfg, cfg);

        // Derive key and other params
        const derivedParams = _cfg.kdf.execute(
            password,
            cipher.keySize,
            cipher.ivSize
        );

        // Add IV to config
        _cfg.iv = derivedParams.iv;

        // Encrypt
        const ciphertext = SerializableCipher.encrypt.call(
            this,
            cipher,
            message,
            derivedParams.key,
            _cfg
        );

        // Mix in derived params
        ciphertext.mixIn(derivedParams);

        return ciphertext;
    }

    /**
     * Decrypts serialized ciphertext using a password.
     *
     * @param {Cipher} cipher The cipher algorithm to use.
     * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
     * @param {string} password The password.
     * @param {Object} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {WordArray} The plaintext.
     *
     * @static
     *
     * @example
     *
     *     var plaintext = CryptoJS.lib.PasswordBasedCipher
     *       .decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password',
     *         { format: CryptoJS.format.OpenSSL });
     *     var plaintext = CryptoJS.lib.PasswordBasedCipher
     *       .decrypt(CryptoJS.algo.AES, ciphertextParams, 'password',
     *         { format: CryptoJS.format.OpenSSL });
     */
    static decrypt(cipher, ciphertext, password, cfg) {
        let _ciphertext = ciphertext;

        // Apply config defaults
        const _cfg = Object.assign(new Base(), this.cfg, cfg);

        // Convert string to CipherParams
        _ciphertext = this._parse(_ciphertext, _cfg.format);

        // Derive key and other params
        const derivedParams = _cfg.kdf.execute(
            password,
            cipher.keySize,
            cipher.ivSize,
            _ciphertext.salt
        );

        // Add IV to config
        _cfg.iv = derivedParams.iv;

        // Decrypt
        const plaintext = SerializableCipher.decrypt.call(
            this,
            cipher,
            _ciphertext,
            derivedParams.key,
            _cfg
        );

        return plaintext;
    }
}
/**
 * Configuration options.
 *
 * @property {KDF} kdf
 *     The key derivation function to use to generate a key and IV from a password.
 *     Default: OpenSSL
 */
PasswordBasedCipher.cfg = Object.assign(SerializableCipher.cfg, {
    kdf: OpenSSLKdf,
});

const swapEndian = (word) =>
    ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);

/**
 * UTF-16 BE encoding strategy.
 */
const Utf16BE = {
    /**
     * Converts a word array to a UTF-16 BE string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The UTF-16 BE string.
     *
     * @static
     *
     * @example
     *
     *     const utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
     */
    stringify(wordArray) {
        // Shortcuts
        const { words, sigBytes } = wordArray;

        // Convert
        const utf16Chars = [];
        for (let i = 0; i < sigBytes; i += 2) {
            const codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
            utf16Chars.push(String.fromCharCode(codePoint));
        }

        return utf16Chars.join('');
    },

    /**
     * Converts a UTF-16 BE string to a word array.
     *
     * @param {string} utf16Str The UTF-16 BE string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     const wordArray = CryptoJS.enc.Utf16.parse(utf16String);
     */
    parse(utf16Str) {
        // Shortcut
        const utf16StrLength = utf16Str.length;

        // Convert
        const words = [];
        for (let i = 0; i < utf16StrLength; i += 1) {
            words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
        }

        return WordArray.create(words, utf16StrLength * 2);
    },
};
const Utf16 = Utf16BE;

/**
 * UTF-16 LE encoding strategy.
 */
const Utf16LE = {
    /**
     * Converts a word array to a UTF-16 LE string.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {string} The UTF-16 LE string.
     *
     * @static
     *
     * @example
     *
     *     const utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
     */
    stringify(wordArray) {
        // Shortcuts
        const { words, sigBytes } = wordArray;

        // Convert
        const utf16Chars = [];
        for (let i = 0; i < sigBytes; i += 2) {
            const codePoint = swapEndian(
                (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff
            );
            utf16Chars.push(String.fromCharCode(codePoint));
        }

        return utf16Chars.join('');
    },

    /**
     * Converts a UTF-16 LE string to a word array.
     *
     * @param {string} utf16Str The UTF-16 LE string.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     const wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
     */
    parse(utf16Str) {
        // Shortcut
        const utf16StrLength = utf16Str.length;

        // Convert
        const words = [];
        for (let i = 0; i < utf16StrLength; i += 1) {
            words[i >>> 1] |= swapEndian(
                utf16Str.charCodeAt(i) << (16 - (i % 2) * 16)
            );
        }

        return WordArray.create(words, utf16StrLength * 2);
    },
};

// Reusable object
const W$2 = [];

/**
 * SHA-1 hash algorithm.
 */
class SHA1Algo extends Hasher {
    _doReset() {
        this._hash = new WordArray([
            0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0,
        ]);
    }

    _doProcessBlock(M, offset) {
        // Shortcut
        const H = this._hash.words;

        // Working variables
        let a = H[0];
        let b = H[1];
        let c = H[2];
        let d = H[3];
        let e = H[4];

        // Computation
        for (let i = 0; i < 80; i += 1) {
            if (i < 16) {
                W$2[i] = M[offset + i] | 0;
            } else {
                const n = W$2[i - 3] ^ W$2[i - 8] ^ W$2[i - 14] ^ W$2[i - 16];
                W$2[i] = (n << 1) | (n >>> 31);
            }

            let t = ((a << 5) | (a >>> 27)) + e + W$2[i];
            if (i < 20) {
                t += ((b & c) | (~b & d)) + 0x5a827999;
            } else if (i < 40) {
                t += (b ^ c ^ d) + 0x6ed9eba1;
            } else if (i < 60) {
                t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
            } /* if (i < 80) */ else {
                t += (b ^ c ^ d) - 0x359d3e2a;
            }

            e = d;
            d = c;
            c = (b << 30) | (b >>> 2);
            b = a;
            a = t;
        }

        // Intermediate hash value
        H[0] = (H[0] + a) | 0;
        H[1] = (H[1] + b) | 0;
        H[2] = (H[2] + c) | 0;
        H[3] = (H[3] + d) | 0;
        H[4] = (H[4] + e) | 0;
    }

    _doFinalize() {
        // Shortcuts
        const data = this._data;
        const dataWords = data.words;

        const nBitsTotal = this._nDataBytes * 8;
        const nBitsLeft = data.sigBytes * 8;

        // Add padding
        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(
            nBitsTotal / 0x100000000
        );
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
        data.sigBytes = dataWords.length * 4;

        // Hash final blocks
        this._process();

        // Return final computed hash
        return this._hash;
    }

    clone() {
        const clone = super.clone.call(this);
        clone._hash = this._hash.clone();

        return clone;
    }
}

/**
 * Shortcut function to the hasher's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 *
 * @return {WordArray} The hash.
 *
 * @static
 *
 * @example
 *
 *     var hash = CryptoJS.SHA1('message');
 *     var hash = CryptoJS.SHA1(wordArray);
 */
const SHA1 = Hasher._createHelper(SHA1Algo);

/**
 * Shortcut function to the HMAC's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 * @param {WordArray|string} key The secret key.
 *
 * @return {WordArray} The HMAC.
 *
 * @static
 *
 * @example
 *
 *     var hmac = CryptoJS.HmacSHA1(message, key);
 */
const HmacSHA1 = Hasher._createHmacHelper(SHA1Algo);

// Initialization and round constants tables
const H = [];
const K$1 = [];

// Compute constants
const isPrime = (n) => {
    const sqrtN = Math.sqrt(n);
    for (let factor = 2; factor <= sqrtN; factor += 1) {
        if (!(n % factor)) {
            return false;
        }
    }

    return true;
};

const getFractionalBits = (n) => ((n - (n | 0)) * 0x100000000) | 0;

let n = 2;
let nPrime = 0;
while (nPrime < 64) {
    if (isPrime(n)) {
        if (nPrime < 8) {
            H[nPrime] = getFractionalBits(n ** (1 / 2));
        }
        K$1[nPrime] = getFractionalBits(n ** (1 / 3));

        nPrime += 1;
    }

    n += 1;
}

// Reusable object
const W$1 = [];

/**
 * SHA-256 hash algorithm.
 */
class SHA256Algo extends Hasher {
    _doReset() {
        this._hash = new WordArray(H.slice(0));
    }

    _doProcessBlock(M, offset) {
        // Shortcut
        const _H = this._hash.words;

        // Working variables
        let a = _H[0];
        let b = _H[1];
        let c = _H[2];
        let d = _H[3];
        let e = _H[4];
        let f = _H[5];
        let g = _H[6];
        let h = _H[7];

        // Computation
        for (let i = 0; i < 64; i += 1) {
            if (i < 16) {
                W$1[i] = M[offset + i] | 0;
            } else {
                const gamma0x = W$1[i - 15];
                const gamma0 =
                    ((gamma0x << 25) | (gamma0x >>> 7)) ^
                    ((gamma0x << 14) | (gamma0x >>> 18)) ^
                    (gamma0x >>> 3);

                const gamma1x = W$1[i - 2];
                const gamma1 =
                    ((gamma1x << 15) | (gamma1x >>> 17)) ^
                    ((gamma1x << 13) | (gamma1x >>> 19)) ^
                    (gamma1x >>> 10);

                W$1[i] = gamma0 + W$1[i - 7] + gamma1 + W$1[i - 16];
            }

            const ch = (e & f) ^ (~e & g);
            const maj = (a & b) ^ (a & c) ^ (b & c);

            const sigma0 =
                ((a << 30) | (a >>> 2)) ^
                ((a << 19) | (a >>> 13)) ^
                ((a << 10) | (a >>> 22));
            const sigma1 =
                ((e << 26) | (e >>> 6)) ^
                ((e << 21) | (e >>> 11)) ^
                ((e << 7) | (e >>> 25));

            const t1 = h + sigma1 + ch + K$1[i] + W$1[i];
            const t2 = sigma0 + maj;

            h = g;
            g = f;
            f = e;
            e = (d + t1) | 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) | 0;
        }

        // Intermediate hash value
        _H[0] = (_H[0] + a) | 0;
        _H[1] = (_H[1] + b) | 0;
        _H[2] = (_H[2] + c) | 0;
        _H[3] = (_H[3] + d) | 0;
        _H[4] = (_H[4] + e) | 0;
        _H[5] = (_H[5] + f) | 0;
        _H[6] = (_H[6] + g) | 0;
        _H[7] = (_H[7] + h) | 0;
    }

    _doFinalize() {
        // Shortcuts
        const data = this._data;
        const dataWords = data.words;

        const nBitsTotal = this._nDataBytes * 8;
        const nBitsLeft = data.sigBytes * 8;

        // Add padding
        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(
            nBitsTotal / 0x100000000
        );
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
        data.sigBytes = dataWords.length * 4;

        // Hash final blocks
        this._process();

        // Return final computed hash
        return this._hash;
    }

    clone() {
        const clone = super.clone.call(this);
        clone._hash = this._hash.clone();

        return clone;
    }
}

/**
 * Shortcut function to the hasher's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 *
 * @return {WordArray} The hash.
 *
 * @static
 *
 * @example
 *
 *     var hash = CryptoJS.SHA256('message');
 *     var hash = CryptoJS.SHA256(wordArray);
 */
const SHA256 = Hasher._createHelper(SHA256Algo);

/**
 * Shortcut function to the HMAC's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 * @param {WordArray|string} key The secret key.
 *
 * @return {WordArray} The HMAC.
 *
 * @static
 *
 * @example
 *
 *     var hmac = CryptoJS.HmacSHA256(message, key);
 */
const HmacSHA256 = Hasher._createHmacHelper(SHA256Algo);

/**
 * SHA-224 hash algorithm.
 */
class SHA224Algo extends SHA256Algo {
    _doReset() {
        this._hash = new WordArray([
            0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31,
            0x68581511, 0x64f98fa7, 0xbefa4fa4,
        ]);
    }

    _doFinalize() {
        const hash = super._doFinalize.call(this);

        hash.sigBytes -= 4;

        return hash;
    }
}

/**
 * Shortcut function to the hasher's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 *
 * @return {WordArray} The hash.
 *
 * @static
 *
 * @example
 *
 *     var hash = CryptoJS.SHA224('message');
 *     var hash = CryptoJS.SHA224(wordArray);
 */
const SHA224 = SHA256Algo._createHelper(SHA224Algo);

/**
 * Shortcut function to the HMAC's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 * @param {WordArray|string} key The secret key.
 *
 * @return {WordArray} The HMAC.
 *
 * @static
 *
 * @example
 *
 *     var hmac = CryptoJS.HmacSHA224(message, key);
 */
const HmacSHA224 = SHA256Algo._createHmacHelper(SHA224Algo);

// Constants
const K = [
    new X64Word(0x428a2f98, 0xd728ae22),
    new X64Word(0x71374491, 0x23ef65cd),
    new X64Word(0xb5c0fbcf, 0xec4d3b2f),
    new X64Word(0xe9b5dba5, 0x8189dbbc),
    new X64Word(0x3956c25b, 0xf348b538),
    new X64Word(0x59f111f1, 0xb605d019),
    new X64Word(0x923f82a4, 0xaf194f9b),
    new X64Word(0xab1c5ed5, 0xda6d8118),
    new X64Word(0xd807aa98, 0xa3030242),
    new X64Word(0x12835b01, 0x45706fbe),
    new X64Word(0x243185be, 0x4ee4b28c),
    new X64Word(0x550c7dc3, 0xd5ffb4e2),
    new X64Word(0x72be5d74, 0xf27b896f),
    new X64Word(0x80deb1fe, 0x3b1696b1),
    new X64Word(0x9bdc06a7, 0x25c71235),
    new X64Word(0xc19bf174, 0xcf692694),
    new X64Word(0xe49b69c1, 0x9ef14ad2),
    new X64Word(0xefbe4786, 0x384f25e3),
    new X64Word(0x0fc19dc6, 0x8b8cd5b5),
    new X64Word(0x240ca1cc, 0x77ac9c65),
    new X64Word(0x2de92c6f, 0x592b0275),
    new X64Word(0x4a7484aa, 0x6ea6e483),
    new X64Word(0x5cb0a9dc, 0xbd41fbd4),
    new X64Word(0x76f988da, 0x831153b5),
    new X64Word(0x983e5152, 0xee66dfab),
    new X64Word(0xa831c66d, 0x2db43210),
    new X64Word(0xb00327c8, 0x98fb213f),
    new X64Word(0xbf597fc7, 0xbeef0ee4),
    new X64Word(0xc6e00bf3, 0x3da88fc2),
    new X64Word(0xd5a79147, 0x930aa725),
    new X64Word(0x06ca6351, 0xe003826f),
    new X64Word(0x14292967, 0x0a0e6e70),
    new X64Word(0x27b70a85, 0x46d22ffc),
    new X64Word(0x2e1b2138, 0x5c26c926),
    new X64Word(0x4d2c6dfc, 0x5ac42aed),
    new X64Word(0x53380d13, 0x9d95b3df),
    new X64Word(0x650a7354, 0x8baf63de),
    new X64Word(0x766a0abb, 0x3c77b2a8),
    new X64Word(0x81c2c92e, 0x47edaee6),
    new X64Word(0x92722c85, 0x1482353b),
    new X64Word(0xa2bfe8a1, 0x4cf10364),
    new X64Word(0xa81a664b, 0xbc423001),
    new X64Word(0xc24b8b70, 0xd0f89791),
    new X64Word(0xc76c51a3, 0x0654be30),
    new X64Word(0xd192e819, 0xd6ef5218),
    new X64Word(0xd6990624, 0x5565a910),
    new X64Word(0xf40e3585, 0x5771202a),
    new X64Word(0x106aa070, 0x32bbd1b8),
    new X64Word(0x19a4c116, 0xb8d2d0c8),
    new X64Word(0x1e376c08, 0x5141ab53),
    new X64Word(0x2748774c, 0xdf8eeb99),
    new X64Word(0x34b0bcb5, 0xe19b48a8),
    new X64Word(0x391c0cb3, 0xc5c95a63),
    new X64Word(0x4ed8aa4a, 0xe3418acb),
    new X64Word(0x5b9cca4f, 0x7763e373),
    new X64Word(0x682e6ff3, 0xd6b2b8a3),
    new X64Word(0x748f82ee, 0x5defb2fc),
    new X64Word(0x78a5636f, 0x43172f60),
    new X64Word(0x84c87814, 0xa1f0ab72),
    new X64Word(0x8cc70208, 0x1a6439ec),
    new X64Word(0x90befffa, 0x23631e28),
    new X64Word(0xa4506ceb, 0xde82bde9),
    new X64Word(0xbef9a3f7, 0xb2c67915),
    new X64Word(0xc67178f2, 0xe372532b),
    new X64Word(0xca273ece, 0xea26619c),
    new X64Word(0xd186b8c7, 0x21c0c207),
    new X64Word(0xeada7dd6, 0xcde0eb1e),
    new X64Word(0xf57d4f7f, 0xee6ed178),
    new X64Word(0x06f067aa, 0x72176fba),
    new X64Word(0x0a637dc5, 0xa2c898a6),
    new X64Word(0x113f9804, 0xbef90dae),
    new X64Word(0x1b710b35, 0x131c471b),
    new X64Word(0x28db77f5, 0x23047d84),
    new X64Word(0x32caab7b, 0x40c72493),
    new X64Word(0x3c9ebe0a, 0x15c9bebc),
    new X64Word(0x431d67c4, 0x9c100d4c),
    new X64Word(0x4cc5d4be, 0xcb3e42b6),
    new X64Word(0x597f299c, 0xfc657e2a),
    new X64Word(0x5fcb6fab, 0x3ad6faec),
    new X64Word(0x6c44198c, 0x4a475817),
];

// Reusable objects
const W = [];
for (let i = 0; i < 80; i += 1) {
    W[i] = new X64Word();
}

/**
 * SHA-512 hash algorithm.
 */
class SHA512Algo extends Hasher {
    constructor() {
        super();

        this.blockSize = 1024 / 32;
    }

    _doReset() {
        this._hash = new X64WordArray([
            new X64Word(0x6a09e667, 0xf3bcc908),
            new X64Word(0xbb67ae85, 0x84caa73b),
            new X64Word(0x3c6ef372, 0xfe94f82b),
            new X64Word(0xa54ff53a, 0x5f1d36f1),
            new X64Word(0x510e527f, 0xade682d1),
            new X64Word(0x9b05688c, 0x2b3e6c1f),
            new X64Word(0x1f83d9ab, 0xfb41bd6b),
            new X64Word(0x5be0cd19, 0x137e2179),
        ]);
    }

    _doProcessBlock(M, offset) {
        // Shortcuts
        const H = this._hash.words;

        const H0 = H[0];
        const H1 = H[1];
        const H2 = H[2];
        const H3 = H[3];
        const H4 = H[4];
        const H5 = H[5];
        const H6 = H[6];
        const H7 = H[7];

        const H0h = H0.high;
        let H0l = H0.low;
        const H1h = H1.high;
        let H1l = H1.low;
        const H2h = H2.high;
        let H2l = H2.low;
        const H3h = H3.high;
        let H3l = H3.low;
        const H4h = H4.high;
        let H4l = H4.low;
        const H5h = H5.high;
        let H5l = H5.low;
        const H6h = H6.high;
        let H6l = H6.low;
        const H7h = H7.high;
        let H7l = H7.low;

        // Working variables
        let ah = H0h;
        let al = H0l;
        let bh = H1h;
        let bl = H1l;
        let ch = H2h;
        let cl = H2l;
        let dh = H3h;
        let dl = H3l;
        let eh = H4h;
        let el = H4l;
        let fh = H5h;
        let fl = H5l;
        let gh = H6h;
        let gl = H6l;
        let hh = H7h;
        let hl = H7l;

        // Rounds
        for (let i = 0; i < 80; i += 1) {
            let Wil;
            let Wih;

            // Shortcut
            const Wi = W[i];

            // Extend message
            if (i < 16) {
                Wi.high = M[offset + i * 2] | 0;
                Wih = Wi.high;
                Wi.low = M[offset + i * 2 + 1] | 0;
                Wil = Wi.low;
            } else {
                // Gamma0
                const gamma0x = W[i - 15];
                const gamma0xh = gamma0x.high;
                const gamma0xl = gamma0x.low;
                const gamma0h =
                    ((gamma0xh >>> 1) | (gamma0xl << 31)) ^
                    ((gamma0xh >>> 8) | (gamma0xl << 24)) ^
                    (gamma0xh >>> 7);
                const gamma0l =
                    ((gamma0xl >>> 1) | (gamma0xh << 31)) ^
                    ((gamma0xl >>> 8) | (gamma0xh << 24)) ^
                    ((gamma0xl >>> 7) | (gamma0xh << 25));

                // Gamma1
                const gamma1x = W[i - 2];
                const gamma1xh = gamma1x.high;
                const gamma1xl = gamma1x.low;
                const gamma1h =
                    ((gamma1xh >>> 19) | (gamma1xl << 13)) ^
                    ((gamma1xh << 3) | (gamma1xl >>> 29)) ^
                    (gamma1xh >>> 6);
                const gamma1l =
                    ((gamma1xl >>> 19) | (gamma1xh << 13)) ^
                    ((gamma1xl << 3) | (gamma1xh >>> 29)) ^
                    ((gamma1xl >>> 6) | (gamma1xh << 26));

                // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
                const Wi7 = W[i - 7];
                const Wi7h = Wi7.high;
                const Wi7l = Wi7.low;

                const Wi16 = W[i - 16];
                const Wi16h = Wi16.high;
                const Wi16l = Wi16.low;

                Wil = gamma0l + Wi7l;
                Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                Wil += gamma1l;
                Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                Wil += Wi16l;
                Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);

                Wi.high = Wih;
                Wi.low = Wil;
            }

            const chh = (eh & fh) ^ (~eh & gh);
            const chl = (el & fl) ^ (~el & gl);
            const majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
            const majl = (al & bl) ^ (al & cl) ^ (bl & cl);

            const sigma0h =
                ((ah >>> 28) | (al << 4)) ^
                ((ah << 30) | (al >>> 2)) ^
                ((ah << 25) | (al >>> 7));
            const sigma0l =
                ((al >>> 28) | (ah << 4)) ^
                ((al << 30) | (ah >>> 2)) ^
                ((al << 25) | (ah >>> 7));
            const sigma1h =
                ((eh >>> 14) | (el << 18)) ^
                ((eh >>> 18) | (el << 14)) ^
                ((eh << 23) | (el >>> 9));
            const sigma1l =
                ((el >>> 14) | (eh << 18)) ^
                ((el >>> 18) | (eh << 14)) ^
                ((el << 23) | (eh >>> 9));

            // t1 = h + sigma1 + ch + K[i] + W[i]
            const Ki = K[i];
            const Kih = Ki.high;
            const Kil = Ki.low;

            let t1l = hl + sigma1l;
            let t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
            t1l += chl;
            t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
            t1l += Kil;
            t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
            t1l += Wil;
            t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);

            // t2 = sigma0 + maj
            const t2l = sigma0l + majl;
            const t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);

            // Update working variables
            hh = gh;
            hl = gl;
            gh = fh;
            gl = fl;
            fh = eh;
            fl = el;
            el = (dl + t1l) | 0;
            eh = (dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0)) | 0;
            dh = ch;
            dl = cl;
            ch = bh;
            cl = bl;
            bh = ah;
            bl = al;
            al = (t1l + t2l) | 0;
            ah = (t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0)) | 0;
        }

        // Intermediate hash value
        H0.low = H0l + al;
        H0l = H0.low;
        H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
        H1.low = H1l + bl;
        H1l = H1.low;
        H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
        H2.low = H2l + cl;
        H2l = H2.low;
        H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
        H3.low = H3l + dl;
        H3l = H3.low;
        H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
        H4.low = H4l + el;
        H4l = H4.low;
        H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
        H5.low = H5l + fl;
        H5l = H5.low;
        H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
        H6.low = H6l + gl;
        H6l = H6.low;
        H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
        H7.low = H7l + hl;
        H7l = H7.low;
        H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
    }

    _doFinalize() {
        // Shortcuts
        const data = this._data;
        const dataWords = data.words;

        const nBitsTotal = this._nDataBytes * 8;
        const nBitsLeft = data.sigBytes * 8;

        // Add padding
        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
        dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(
            nBitsTotal / 0x100000000
        );
        dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
        data.sigBytes = dataWords.length * 4;

        // Hash final blocks
        this._process();

        // Convert hash to 32-bit word array before returning
        const hash = this._hash.toX32();

        // Return final computed hash
        return hash;
    }

    clone() {
        const clone = super.clone.call(this);
        clone._hash = this._hash.clone();

        return clone;
    }
}

/**
 * Shortcut function to the hasher's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 *
 * @return {WordArray} The hash.
 *
 * @static
 *
 * @example
 *
 *     var hash = CryptoJS.SHA512('message');
 *     var hash = CryptoJS.SHA512(wordArray);
 */
const SHA512 = Hasher._createHelper(SHA512Algo);

/**
 * Shortcut function to the HMAC's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 * @param {WordArray|string} key The secret key.
 *
 * @return {WordArray} The HMAC.
 *
 * @static
 *
 * @example
 *
 *     var hmac = CryptoJS.HmacSHA512(message, key);
 */
const HmacSHA512 = Hasher._createHmacHelper(SHA512Algo);

/**
 * SHA-384 hash algorithm.
 */
class SHA384Algo extends SHA512Algo {
    _doReset() {
        this._hash = new X64WordArray([
            new X64Word(0xcbbb9d5d, 0xc1059ed8),
            new X64Word(0x629a292a, 0x367cd507),
            new X64Word(0x9159015a, 0x3070dd17),
            new X64Word(0x152fecd8, 0xf70e5939),
            new X64Word(0x67332667, 0xffc00b31),
            new X64Word(0x8eb44a87, 0x68581511),
            new X64Word(0xdb0c2e0d, 0x64f98fa7),
            new X64Word(0x47b5481d, 0xbefa4fa4),
        ]);
    }

    _doFinalize() {
        const hash = super._doFinalize.call(this);

        hash.sigBytes -= 16;

        return hash;
    }
}

/**
 * Shortcut function to the hasher's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 *
 * @return {WordArray} The hash.
 *
 * @static
 *
 * @example
 *
 *     var hash = CryptoJS.SHA384('message');
 *     var hash = CryptoJS.SHA384(wordArray);
 */
const SHA384 = SHA512Algo._createHelper(SHA384Algo);

/**
 * Shortcut function to the HMAC's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 * @param {WordArray|string} key The secret key.
 *
 * @return {WordArray} The HMAC.
 *
 * @static
 *
 * @example
 *
 *     var hmac = CryptoJS.HmacSHA384(message, key);
 */
const HmacSHA384 = SHA512Algo._createHmacHelper(SHA384Algo);

// Constants tables
const RHO_OFFSETS = [];
const PI_INDEXES = [];
const ROUND_CONSTANTS = [];

// Compute Constants
// Compute rho offset constants
let _x = 1;
let _y = 0;
for (let t = 0; t < 24; t += 1) {
    RHO_OFFSETS[_x + 5 * _y] = (((t + 1) * (t + 2)) / 2) % 64;

    const newX = _y % 5;
    const newY = (2 * _x + 3 * _y) % 5;
    _x = newX;
    _y = newY;
}

// Compute pi index constants
for (let x = 0; x < 5; x += 1) {
    for (let y = 0; y < 5; y += 1) {
        PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
    }
}

// Compute round constants
let LFSR = 0x01;
for (let i = 0; i < 24; i += 1) {
    let roundConstantMsw = 0;
    let roundConstantLsw = 0;

    for (let j = 0; j < 7; j += 1) {
        if (LFSR & 0x01) {
            const bitPosition = (1 << j) - 1;
            if (bitPosition < 32) {
                roundConstantLsw ^= 1 << bitPosition;
            } /* if (bitPosition >= 32) */ else {
                roundConstantMsw ^= 1 << (bitPosition - 32);
            }
        }

        // Compute next LFSR
        if (LFSR & 0x80) {
            // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
            LFSR = (LFSR << 1) ^ 0x71;
        } else {
            LFSR <<= 1;
        }
    }

    ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
}

// Reusable objects for temporary values
const T = [];
for (let i = 0; i < 25; i += 1) {
    T[i] = X64Word.create();
}

/**
 * SHA-3 hash algorithm.
 */
class SHA3Algo extends Hasher {
    constructor(cfg) {
        /**
         * Configuration options.
         *
         * @property {number} outputLength
         *   The desired number of bits in the output hash.
         *   Only values permitted are: 224, 256, 384, 512.
         *   Default: 512
         */
        super(Object.assign({ outputLength: 512 }, cfg));
    }

    _doReset() {
        this._state = [];
        const state = this._state;
        for (let i = 0; i < 25; i += 1) {
            state[i] = new X64Word();
        }

        this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
    }

    _doProcessBlock(M, offset) {
        // Shortcuts
        const state = this._state;
        const nBlockSizeLanes = this.blockSize / 2;

        // Absorb
        for (let i = 0; i < nBlockSizeLanes; i += 1) {
            // Shortcuts
            let M2i = M[offset + 2 * i];
            let M2i1 = M[offset + 2 * i + 1];

            // Swap endian
            M2i =
                (((M2i << 8) | (M2i >>> 24)) & 0x00ff00ff) |
                (((M2i << 24) | (M2i >>> 8)) & 0xff00ff00);
            M2i1 =
                (((M2i1 << 8) | (M2i1 >>> 24)) & 0x00ff00ff) |
                (((M2i1 << 24) | (M2i1 >>> 8)) & 0xff00ff00);

            // Absorb message into state
            const lane = state[i];
            lane.high ^= M2i1;
            lane.low ^= M2i;
        }

        // Rounds
        for (let round = 0; round < 24; round += 1) {
            // Theta
            for (let x = 0; x < 5; x += 1) {
                // Mix column lanes
                let tMsw = 0;
                let tLsw = 0;
                for (let y = 0; y < 5; y += 1) {
                    const lane = state[x + 5 * y];
                    tMsw ^= lane.high;
                    tLsw ^= lane.low;
                }

                // Temporary values
                const Tx = T[x];
                Tx.high = tMsw;
                Tx.low = tLsw;
            }
            for (let x = 0; x < 5; x += 1) {
                // Shortcuts
                const Tx4 = T[(x + 4) % 5];
                const Tx1 = T[(x + 1) % 5];
                const Tx1Msw = Tx1.high;
                const Tx1Lsw = Tx1.low;

                // Mix surrounding columns
                const tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
                const tLsw = Tx4.low ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
                for (let y = 0; y < 5; y += 1) {
                    const lane = state[x + 5 * y];
                    lane.high ^= tMsw;
                    lane.low ^= tLsw;
                }
            }

            // Rho Pi
            for (let laneIndex = 1; laneIndex < 25; laneIndex += 1) {
                let tMsw;
                let tLsw;

                // Shortcuts
                const lane = state[laneIndex];
                const laneMsw = lane.high;
                const laneLsw = lane.low;
                const rhoOffset = RHO_OFFSETS[laneIndex];

                // Rotate lanes
                if (rhoOffset < 32) {
                    tMsw =
                        (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
                    tLsw =
                        (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
                } /* if (rhoOffset >= 32) */ else {
                    tMsw =
                        (laneLsw << (rhoOffset - 32)) |
                        (laneMsw >>> (64 - rhoOffset));
                    tLsw =
                        (laneMsw << (rhoOffset - 32)) |
                        (laneLsw >>> (64 - rhoOffset));
                }

                // Transpose lanes
                const TPiLane = T[PI_INDEXES[laneIndex]];
                TPiLane.high = tMsw;
                TPiLane.low = tLsw;
            }

            // Rho pi at x = y = 0
            const T0 = T[0];
            const state0 = state[0];
            T0.high = state0.high;
            T0.low = state0.low;

            // Chi
            for (let x = 0; x < 5; x += 1) {
                for (let y = 0; y < 5; y += 1) {
                    // Shortcuts
                    const laneIndex = x + 5 * y;
                    const lane = state[laneIndex];
                    const TLane = T[laneIndex];
                    const Tx1Lane = T[((x + 1) % 5) + 5 * y];
                    const Tx2Lane = T[((x + 2) % 5) + 5 * y];

                    // Mix rows
                    lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
                    lane.low = TLane.low ^ (~Tx1Lane.low & Tx2Lane.low);
                }
            }

            // Iota
            const lane = state[0];
            const roundConstant = ROUND_CONSTANTS[round];
            lane.high ^= roundConstant.high;
            lane.low ^= roundConstant.low;
        }
    }

    _doFinalize() {
        // Shortcuts
        const data = this._data;
        const dataWords = data.words;
        const nBitsLeft = data.sigBytes * 8;
        const blockSizeBits = this.blockSize * 32;

        // Add padding
        dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - (nBitsLeft % 32));
        dataWords[
            ((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>>
                5) -
                1
        ] |= 0x80;
        data.sigBytes = dataWords.length * 4;

        // Hash final blocks
        this._process();

        // Shortcuts
        const state = this._state;
        const outputLengthBytes = this.cfg.outputLength / 8;
        const outputLengthLanes = outputLengthBytes / 8;

        // Squeeze
        const hashWords = [];
        for (let i = 0; i < outputLengthLanes; i += 1) {
            // Shortcuts
            const lane = state[i];
            let laneMsw = lane.high;
            let laneLsw = lane.low;

            // Swap endian
            laneMsw =
                (((laneMsw << 8) | (laneMsw >>> 24)) & 0x00ff00ff) |
                (((laneMsw << 24) | (laneMsw >>> 8)) & 0xff00ff00);
            laneLsw =
                (((laneLsw << 8) | (laneLsw >>> 24)) & 0x00ff00ff) |
                (((laneLsw << 24) | (laneLsw >>> 8)) & 0xff00ff00);

            // Squeeze state to retrieve hash
            hashWords.push(laneLsw);
            hashWords.push(laneMsw);
        }

        // Return final computed hash
        return new WordArray(hashWords, outputLengthBytes);
    }

    clone() {
        const clone = super.clone.call(this);

        clone._state = this._state.slice(0);
        const state = clone._state;
        for (let i = 0; i < 25; i += 1) {
            state[i] = state[i].clone();
        }

        return clone;
    }
}

/**
 * Shortcut function to the hasher's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 *
 * @return {WordArray} The hash.
 *
 * @static
 *
 * @example
 *
 *     var hash = CryptoJS.SHA3('message');
 *     var hash = CryptoJS.SHA3(wordArray);
 */
const SHA3 = Hasher._createHelper(SHA3Algo);

/**
 * Shortcut function to the HMAC's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 * @param {WordArray|string} key The secret key.
 *
 * @return {WordArray} The HMAC.
 *
 * @static
 *
 * @example
 *
 *     var hmac = CryptoJS.HmacSHA3(message, key);
 */
const HmacSHA3 = Hasher._createHmacHelper(SHA3Algo);

/** @preserve
(c) 2012 by Cédric Mesnil. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted
provided that the following conditions are met:

    - Redistributions of source code must retain the above copyright notice, this list of
    conditions and the following disclaimer.
    - Redistributions in binary form must reproduce the above copyright notice, this list
    of conditions and the following disclaimer in the documentation and/or other materials
    provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Constants table
const _zl = WordArray.create([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6,
    15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13,
    11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9,
    7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
]);
const _zr = WordArray.create([
    5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5,
    10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10,
    0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10,
    4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
]);
const _sl = WordArray.create([
    11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9,
    7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13,
    6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9,
    15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
]);
const _sr = WordArray.create([
    8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8,
    9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14,
    13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5,
    12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
]);

const _hl = WordArray.create([
    0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e,
]);
const _hr = WordArray.create([
    0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000,
]);

const f1 = (x, y, z) => x ^ y ^ z;

const f2 = (x, y, z) => (x & y) | (~x & z);

const f3 = (x, y, z) => (x | ~y) ^ z;

const f4 = (x, y, z) => (x & z) | (y & ~z);

const f5 = (x, y, z) => x ^ (y | ~z);

const rotl = (x, n) => (x << n) | (x >>> (32 - n));

/**
 * RIPEMD160 hash algorithm.
 */
class RIPEMD160Algo extends Hasher {
    _doReset() {
        this._hash = WordArray.create([
            0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0,
        ]);
    }

    _doProcessBlock(M, offset) {
        const _M = M;

        // Swap endian
        for (let i = 0; i < 16; i += 1) {
            // Shortcuts
            const offset_i = offset + i;
            const M_offset_i = _M[offset_i];

            // Swap
            _M[offset_i] =
                (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00);
        }
        // Shortcut
        const H = this._hash.words;
        const hl = _hl.words;
        const hr = _hr.words;
        const zl = _zl.words;
        const zr = _zr.words;
        const sl = _sl.words;
        const sr = _sr.words;

        // Working variables
        let al = H[0];
        let bl = H[1];
        let cl = H[2];
        let dl = H[3];
        let el = H[4];
        let ar = H[0];
        let br = H[1];
        let cr = H[2];
        let dr = H[3];
        let er = H[4];

        // Computation
        let t;
        for (let i = 0; i < 80; i += 1) {
            t = (al + _M[offset + zl[i]]) | 0;
            if (i < 16) {
                t += f1(bl, cl, dl) + hl[0];
            } else if (i < 32) {
                t += f2(bl, cl, dl) + hl[1];
            } else if (i < 48) {
                t += f3(bl, cl, dl) + hl[2];
            } else if (i < 64) {
                t += f4(bl, cl, dl) + hl[3];
            } else {
                // if (i<80) {
                t += f5(bl, cl, dl) + hl[4];
            }
            t |= 0;
            t = rotl(t, sl[i]);
            t = (t + el) | 0;
            al = el;
            el = dl;
            dl = rotl(cl, 10);
            cl = bl;
            bl = t;

            t = (ar + _M[offset + zr[i]]) | 0;
            if (i < 16) {
                t += f5(br, cr, dr) + hr[0];
            } else if (i < 32) {
                t += f4(br, cr, dr) + hr[1];
            } else if (i < 48) {
                t += f3(br, cr, dr) + hr[2];
            } else if (i < 64) {
                t += f2(br, cr, dr) + hr[3];
            } else {
                // if (i<80) {
                t += f1(br, cr, dr) + hr[4];
            }
            t |= 0;
            t = rotl(t, sr[i]);
            t = (t + er) | 0;
            ar = er;
            er = dr;
            dr = rotl(cr, 10);
            cr = br;
            br = t;
        }
        // Intermediate hash value
        t = (H[1] + cl + dr) | 0;
        H[1] = (H[2] + dl + er) | 0;
        H[2] = (H[3] + el + ar) | 0;
        H[3] = (H[4] + al + br) | 0;
        H[4] = (H[0] + bl + cr) | 0;
        H[0] = t;
    }

    _doFinalize() {
        // Shortcuts
        const data = this._data;
        const dataWords = data.words;

        const nBitsTotal = this._nDataBytes * 8;
        const nBitsLeft = data.sigBytes * 8;

        // Add padding
        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] =
            (((nBitsTotal << 8) | (nBitsTotal >>> 24)) & 0x00ff00ff) |
            (((nBitsTotal << 24) | (nBitsTotal >>> 8)) & 0xff00ff00);
        data.sigBytes = (dataWords.length + 1) * 4;

        // Hash final blocks
        this._process();

        // Shortcuts
        const hash = this._hash;
        const H = hash.words;

        // Swap endian
        for (let i = 0; i < 5; i += 1) {
            // Shortcut
            const H_i = H[i];

            // Swap
            H[i] =
                (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
        }

        // Return final computed hash
        return hash;
    }

    clone() {
        const clone = super.clone.call(this);
        clone._hash = this._hash.clone();

        return clone;
    }
}

/**
 * Shortcut function to the hasher's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 *
 * @return {WordArray} The hash.
 *
 * @static
 *
 * @example
 *
 *     var hash = CryptoJS.RIPEMD160('message');
 *     var hash = CryptoJS.RIPEMD160(wordArray);
 */
const RIPEMD160 = Hasher._createHelper(RIPEMD160Algo);

/**
 * Shortcut function to the HMAC's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 * @param {WordArray|string} key The secret key.
 *
 * @return {WordArray} The HMAC.
 *
 * @static
 *
 * @example
 *
 *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
 */
const HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160Algo);

/**
 * Password-Based Key Derivation Function 2 algorithm.
 */
class PBKDF2Algo extends Base {
    /**
     * Initializes a newly created key derivation function.
     *
     * @param {Object} cfg (Optional) The configuration options to use for the derivation.
     *
     * @example
     *
     *     const kdf = CryptoJS.algo.PBKDF2.create();
     *     const kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
     *     const kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
     */
    constructor(cfg) {
        super();

        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hasher to use. Default: SHA1
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        this.cfg = Object.assign(
            new Base(),
            {
                keySize: 128 / 32,
                hasher: SHA1Algo,
                iterations: 1,
            },
            cfg
        );
    }

    /**
     * Computes the Password-Based Key Derivation Function 2.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     *
     * @return {WordArray} The derived key.
     *
     * @example
     *
     *     const key = kdf.compute(password, salt);
     */
    compute(password, salt) {
        // Shortcut
        const { cfg } = this;

        // Init HMAC
        const hmac = HMAC.create(cfg.hasher, password);

        // Initial values
        const derivedKey = WordArray.create();
        const blockIndex = WordArray.create([0x00000001]);

        // Shortcuts
        const derivedKeyWords = derivedKey.words;
        const blockIndexWords = blockIndex.words;
        const { keySize, iterations } = cfg;

        // Generate key
        while (derivedKeyWords.length < keySize) {
            const block = hmac.update(salt).finalize(blockIndex);
            hmac.reset();

            // Shortcuts
            const blockWords = block.words;
            const blockWordsLength = blockWords.length;

            // Iterations
            let intermediate = block;
            for (let i = 1; i < iterations; i += 1) {
                intermediate = hmac.finalize(intermediate);
                hmac.reset();

                // Shortcut
                const intermediateWords = intermediate.words;

                // XOR intermediate with block
                for (let j = 0; j < blockWordsLength; j += 1) {
                    blockWords[j] ^= intermediateWords[j];
                }
            }

            derivedKey.concat(block);
            blockIndexWords[0] += 1;
        }
        derivedKey.sigBytes = keySize * 4;

        return derivedKey;
    }
}

/**
 * Computes the Password-Based Key Derivation Function 2.
 *
 * @param {WordArray|string} password The password.
 * @param {WordArray|string} salt A salt.
 * @param {Object} cfg (Optional) The configuration options to use for this computation.
 *
 * @return {WordArray} The derived key.
 *
 * @static
 *
 * @example
 *
 *     var key = CryptoJS.PBKDF2(password, salt);
 *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
 *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
 */
const PBKDF2 = (password, salt, cfg) =>
    PBKDF2Algo.create(cfg).compute(password, salt);

// Lookup tables
const _SBOX = [];
const INV_SBOX = [];
const _SUB_MIX_0 = [];
const _SUB_MIX_1 = [];
const _SUB_MIX_2 = [];
const _SUB_MIX_3 = [];
const INV_SUB_MIX_0 = [];
const INV_SUB_MIX_1 = [];
const INV_SUB_MIX_2 = [];
const INV_SUB_MIX_3 = [];

// Compute lookup tables

// Compute double table
const d = [];
for (let i = 0; i < 256; i += 1) {
    if (i < 128) {
        d[i] = i << 1;
    } else {
        d[i] = (i << 1) ^ 0x11b;
    }
}

// Walk GF(2^8)
let x = 0;
let xi = 0;
for (let i = 0; i < 256; i += 1) {
    // Compute sbox
    let sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
    _SBOX[x] = sx;
    INV_SBOX[sx] = x;

    // Compute multiplication
    const x2 = d[x];
    const x4 = d[x2];
    const x8 = d[x4];

    // Compute sub bytes, mix columns tables
    let t = (d[sx] * 0x101) ^ (sx * 0x1010100);
    _SUB_MIX_0[x] = (t << 24) | (t >>> 8);
    _SUB_MIX_1[x] = (t << 16) | (t >>> 16);
    _SUB_MIX_2[x] = (t << 8) | (t >>> 24);
    _SUB_MIX_3[x] = t;

    // Compute inv sub bytes, inv mix columns tables
    t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
    INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
    INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
    INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
    INV_SUB_MIX_3[sx] = t;

    // Compute next counter
    if (!x) {
        xi = 1;
        x = xi;
    } else {
        x = x2 ^ d[d[d[x8 ^ x2]]];
        xi ^= d[d[xi]];
    }
}

// Precomputed Rcon lookup
const RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

/**
 * AES block cipher algorithm.
 */
class AESAlgo extends BlockCipher {
    _doReset() {
        let t;

        // Skip reset of nRounds has been set before and key did not change
        if (this._nRounds && this._keyPriorReset === this._key) {
            return;
        }

        // Shortcuts
        this._keyPriorReset = this._key;
        const key = this._keyPriorReset;
        const keyWords = key.words;
        const keySize = key.sigBytes / 4;

        // Compute number of rounds
        this._nRounds = keySize + 6;
        const nRounds = this._nRounds;

        // Compute number of key schedule rows
        const ksRows = (nRounds + 1) * 4;

        // Compute key schedule
        this._keySchedule = [];
        const keySchedule = this._keySchedule;
        for (let ksRow = 0; ksRow < ksRows; ksRow += 1) {
            if (ksRow < keySize) {
                keySchedule[ksRow] = keyWords[ksRow];
            } else {
                t = keySchedule[ksRow - 1];

                if (!(ksRow % keySize)) {
                    // Rot word
                    t = (t << 8) | (t >>> 24);

                    // Sub word
                    t =
                        (_SBOX[t >>> 24] << 24) |
                        (_SBOX[(t >>> 16) & 0xff] << 16) |
                        (_SBOX[(t >>> 8) & 0xff] << 8) |
                        _SBOX[t & 0xff];

                    // Mix Rcon
                    t ^= RCON[(ksRow / keySize) | 0] << 24;
                } else if (keySize > 6 && ksRow % keySize === 4) {
                    // Sub word
                    t =
                        (_SBOX[t >>> 24] << 24) |
                        (_SBOX[(t >>> 16) & 0xff] << 16) |
                        (_SBOX[(t >>> 8) & 0xff] << 8) |
                        _SBOX[t & 0xff];
                }

                keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
            }
        }

        // Compute inv key schedule
        this._invKeySchedule = [];
        const invKeySchedule = this._invKeySchedule;
        for (let invKsRow = 0; invKsRow < ksRows; invKsRow += 1) {
            const ksRow = ksRows - invKsRow;

            if (invKsRow % 4) {
                t = keySchedule[ksRow];
            } else {
                t = keySchedule[ksRow - 4];
            }

            if (invKsRow < 4 || ksRow <= 4) {
                invKeySchedule[invKsRow] = t;
            } else {
                invKeySchedule[invKsRow] =
                    INV_SUB_MIX_0[_SBOX[t >>> 24]] ^
                    INV_SUB_MIX_1[_SBOX[(t >>> 16) & 0xff]] ^
                    INV_SUB_MIX_2[_SBOX[(t >>> 8) & 0xff]] ^
                    INV_SUB_MIX_3[_SBOX[t & 0xff]];
            }
        }
    }

    encryptBlock(M, offset) {
        this._doCryptBlock(
            M,
            offset,
            this._keySchedule,
            _SUB_MIX_0,
            _SUB_MIX_1,
            _SUB_MIX_2,
            _SUB_MIX_3,
            _SBOX
        );
    }

    decryptBlock(M, offset) {
        const _M = M;

        // Swap 2nd and 4th rows
        let t = _M[offset + 1];
        _M[offset + 1] = _M[offset + 3];
        _M[offset + 3] = t;

        this._doCryptBlock(
            _M,
            offset,
            this._invKeySchedule,
            INV_SUB_MIX_0,
            INV_SUB_MIX_1,
            INV_SUB_MIX_2,
            INV_SUB_MIX_3,
            INV_SBOX
        );

        // Inv swap 2nd and 4th rows
        t = _M[offset + 1];
        _M[offset + 1] = _M[offset + 3];
        _M[offset + 3] = t;
    }

    _doCryptBlock(
        M,
        offset,
        keySchedule,
        SUB_MIX_0,
        SUB_MIX_1,
        SUB_MIX_2,
        SUB_MIX_3,
        SBOX
    ) {
        const _M = M;

        // Shortcut
        const nRounds = this._nRounds;

        // Get input, add round key
        let s0 = _M[offset] ^ keySchedule[0];
        let s1 = _M[offset + 1] ^ keySchedule[1];
        let s2 = _M[offset + 2] ^ keySchedule[2];
        let s3 = _M[offset + 3] ^ keySchedule[3];

        // Key schedule row counter
        let ksRow = 4;

        // Rounds
        for (let round = 1; round < nRounds; round += 1) {
            // Shift rows, sub bytes, mix columns, add round key
            const t0 =
                SUB_MIX_0[s0 >>> 24] ^
                SUB_MIX_1[(s1 >>> 16) & 0xff] ^
                SUB_MIX_2[(s2 >>> 8) & 0xff] ^
                SUB_MIX_3[s3 & 0xff] ^
                keySchedule[ksRow];
            ksRow += 1;
            const t1 =
                SUB_MIX_0[s1 >>> 24] ^
                SUB_MIX_1[(s2 >>> 16) & 0xff] ^
                SUB_MIX_2[(s3 >>> 8) & 0xff] ^
                SUB_MIX_3[s0 & 0xff] ^
                keySchedule[ksRow];
            ksRow += 1;
            const t2 =
                SUB_MIX_0[s2 >>> 24] ^
                SUB_MIX_1[(s3 >>> 16) & 0xff] ^
                SUB_MIX_2[(s0 >>> 8) & 0xff] ^
                SUB_MIX_3[s1 & 0xff] ^
                keySchedule[ksRow];
            ksRow += 1;
            const t3 =
                SUB_MIX_0[s3 >>> 24] ^
                SUB_MIX_1[(s0 >>> 16) & 0xff] ^
                SUB_MIX_2[(s1 >>> 8) & 0xff] ^
                SUB_MIX_3[s2 & 0xff] ^
                keySchedule[ksRow];
            ksRow += 1;

            // Update state
            s0 = t0;
            s1 = t1;
            s2 = t2;
            s3 = t3;
        }

        // Shift rows, sub bytes, add round key
        const t0 =
            ((SBOX[s0 >>> 24] << 24) |
                (SBOX[(s1 >>> 16) & 0xff] << 16) |
                (SBOX[(s2 >>> 8) & 0xff] << 8) |
                SBOX[s3 & 0xff]) ^
            keySchedule[ksRow];
        ksRow += 1;
        const t1 =
            ((SBOX[s1 >>> 24] << 24) |
                (SBOX[(s2 >>> 16) & 0xff] << 16) |
                (SBOX[(s3 >>> 8) & 0xff] << 8) |
                SBOX[s0 & 0xff]) ^
            keySchedule[ksRow];
        ksRow += 1;
        const t2 =
            ((SBOX[s2 >>> 24] << 24) |
                (SBOX[(s3 >>> 16) & 0xff] << 16) |
                (SBOX[(s0 >>> 8) & 0xff] << 8) |
                SBOX[s1 & 0xff]) ^
            keySchedule[ksRow];
        ksRow += 1;
        const t3 =
            ((SBOX[s3 >>> 24] << 24) |
                (SBOX[(s0 >>> 16) & 0xff] << 16) |
                (SBOX[(s1 >>> 8) & 0xff] << 8) |
                SBOX[s2 & 0xff]) ^
            keySchedule[ksRow];
        ksRow += 1;

        // Set output
        _M[offset] = t0;
        _M[offset + 1] = t1;
        _M[offset + 2] = t2;
        _M[offset + 3] = t3;
    }
}
AESAlgo.keySize = 256 / 32;

/**
 * Shortcut functions to the cipher's object interface.
 *
 * @example
 *
 *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
 *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
 */
const AES = BlockCipher._createHelper(AESAlgo);

// Permuted Choice 1 constants
const PC1 = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35,
    27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46,
    38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4,
];

// Permuted Choice 2 constants
const PC2 = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27,
    20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56,
    34, 53, 46, 42, 50, 36, 29, 32,
];

// Cumulative bit shift constants
const BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

// SBOXes and round permutation constants
const SBOX_P = [
    {
        0x0: 0x808200,
        0x10000000: 0x8000,
        0x20000000: 0x808002,
        0x30000000: 0x2,
        0x40000000: 0x200,
        0x50000000: 0x808202,
        0x60000000: 0x800202,
        0x70000000: 0x800000,
        0x80000000: 0x202,
        0x90000000: 0x800200,
        0xa0000000: 0x8200,
        0xb0000000: 0x808000,
        0xc0000000: 0x8002,
        0xd0000000: 0x800002,
        0xe0000000: 0x0,
        0xf0000000: 0x8202,
        0x8000000: 0x0,
        0x18000000: 0x808202,
        0x28000000: 0x8202,
        0x38000000: 0x8000,
        0x48000000: 0x808200,
        0x58000000: 0x200,
        0x68000000: 0x808002,
        0x78000000: 0x2,
        0x88000000: 0x800200,
        0x98000000: 0x8200,
        0xa8000000: 0x808000,
        0xb8000000: 0x800202,
        0xc8000000: 0x800002,
        0xd8000000: 0x8002,
        0xe8000000: 0x202,
        0xf8000000: 0x800000,
        0x1: 0x8000,
        0x10000001: 0x2,
        0x20000001: 0x808200,
        0x30000001: 0x800000,
        0x40000001: 0x808002,
        0x50000001: 0x8200,
        0x60000001: 0x200,
        0x70000001: 0x800202,
        0x80000001: 0x808202,
        0x90000001: 0x808000,
        0xa0000001: 0x800002,
        0xb0000001: 0x8202,
        0xc0000001: 0x202,
        0xd0000001: 0x800200,
        0xe0000001: 0x8002,
        0xf0000001: 0x0,
        0x8000001: 0x808202,
        0x18000001: 0x808000,
        0x28000001: 0x800000,
        0x38000001: 0x200,
        0x48000001: 0x8000,
        0x58000001: 0x800002,
        0x68000001: 0x2,
        0x78000001: 0x8202,
        0x88000001: 0x8002,
        0x98000001: 0x800202,
        0xa8000001: 0x202,
        0xb8000001: 0x808200,
        0xc8000001: 0x800200,
        0xd8000001: 0x0,
        0xe8000001: 0x8200,
        0xf8000001: 0x808002,
    },
    {
        0x0: 0x40084010,
        0x1000000: 0x4000,
        0x2000000: 0x80000,
        0x3000000: 0x40080010,
        0x4000000: 0x40000010,
        0x5000000: 0x40084000,
        0x6000000: 0x40004000,
        0x7000000: 0x10,
        0x8000000: 0x84000,
        0x9000000: 0x40004010,
        0xa000000: 0x40000000,
        0xb000000: 0x84010,
        0xc000000: 0x80010,
        0xd000000: 0x0,
        0xe000000: 0x4010,
        0xf000000: 0x40080000,
        0x800000: 0x40004000,
        0x1800000: 0x84010,
        0x2800000: 0x10,
        0x3800000: 0x40004010,
        0x4800000: 0x40084010,
        0x5800000: 0x40000000,
        0x6800000: 0x80000,
        0x7800000: 0x40080010,
        0x8800000: 0x80010,
        0x9800000: 0x0,
        0xa800000: 0x4000,
        0xb800000: 0x40080000,
        0xc800000: 0x40000010,
        0xd800000: 0x84000,
        0xe800000: 0x40084000,
        0xf800000: 0x4010,
        0x10000000: 0x0,
        0x11000000: 0x40080010,
        0x12000000: 0x40004010,
        0x13000000: 0x40084000,
        0x14000000: 0x40080000,
        0x15000000: 0x10,
        0x16000000: 0x84010,
        0x17000000: 0x4000,
        0x18000000: 0x4010,
        0x19000000: 0x80000,
        0x1a000000: 0x80010,
        0x1b000000: 0x40000010,
        0x1c000000: 0x84000,
        0x1d000000: 0x40004000,
        0x1e000000: 0x40000000,
        0x1f000000: 0x40084010,
        0x10800000: 0x84010,
        0x11800000: 0x80000,
        0x12800000: 0x40080000,
        0x13800000: 0x4000,
        0x14800000: 0x40004000,
        0x15800000: 0x40084010,
        0x16800000: 0x10,
        0x17800000: 0x40000000,
        0x18800000: 0x40084000,
        0x19800000: 0x40000010,
        0x1a800000: 0x40004010,
        0x1b800000: 0x80010,
        0x1c800000: 0x0,
        0x1d800000: 0x4010,
        0x1e800000: 0x40080010,
        0x1f800000: 0x84000,
    },
    {
        0x0: 0x104,
        0x100000: 0x0,
        0x200000: 0x4000100,
        0x300000: 0x10104,
        0x400000: 0x10004,
        0x500000: 0x4000004,
        0x600000: 0x4010104,
        0x700000: 0x4010000,
        0x800000: 0x4000000,
        0x900000: 0x4010100,
        0xa00000: 0x10100,
        0xb00000: 0x4010004,
        0xc00000: 0x4000104,
        0xd00000: 0x10000,
        0xe00000: 0x4,
        0xf00000: 0x100,
        0x80000: 0x4010100,
        0x180000: 0x4010004,
        0x280000: 0x0,
        0x380000: 0x4000100,
        0x480000: 0x4000004,
        0x580000: 0x10000,
        0x680000: 0x10004,
        0x780000: 0x104,
        0x880000: 0x4,
        0x980000: 0x100,
        0xa80000: 0x4010000,
        0xb80000: 0x10104,
        0xc80000: 0x10100,
        0xd80000: 0x4000104,
        0xe80000: 0x4010104,
        0xf80000: 0x4000000,
        0x1000000: 0x4010100,
        0x1100000: 0x10004,
        0x1200000: 0x10000,
        0x1300000: 0x4000100,
        0x1400000: 0x100,
        0x1500000: 0x4010104,
        0x1600000: 0x4000004,
        0x1700000: 0x0,
        0x1800000: 0x4000104,
        0x1900000: 0x4000000,
        0x1a00000: 0x4,
        0x1b00000: 0x10100,
        0x1c00000: 0x4010000,
        0x1d00000: 0x104,
        0x1e00000: 0x10104,
        0x1f00000: 0x4010004,
        0x1080000: 0x4000000,
        0x1180000: 0x104,
        0x1280000: 0x4010100,
        0x1380000: 0x0,
        0x1480000: 0x10004,
        0x1580000: 0x4000100,
        0x1680000: 0x100,
        0x1780000: 0x4010004,
        0x1880000: 0x10000,
        0x1980000: 0x4010104,
        0x1a80000: 0x10104,
        0x1b80000: 0x4000004,
        0x1c80000: 0x4000104,
        0x1d80000: 0x4010000,
        0x1e80000: 0x4,
        0x1f80000: 0x10100,
    },
    {
        0x0: 0x80401000,
        0x10000: 0x80001040,
        0x20000: 0x401040,
        0x30000: 0x80400000,
        0x40000: 0x0,
        0x50000: 0x401000,
        0x60000: 0x80000040,
        0x70000: 0x400040,
        0x80000: 0x80000000,
        0x90000: 0x400000,
        0xa0000: 0x40,
        0xb0000: 0x80001000,
        0xc0000: 0x80400040,
        0xd0000: 0x1040,
        0xe0000: 0x1000,
        0xf0000: 0x80401040,
        0x8000: 0x80001040,
        0x18000: 0x40,
        0x28000: 0x80400040,
        0x38000: 0x80001000,
        0x48000: 0x401000,
        0x58000: 0x80401040,
        0x68000: 0x0,
        0x78000: 0x80400000,
        0x88000: 0x1000,
        0x98000: 0x80401000,
        0xa8000: 0x400000,
        0xb8000: 0x1040,
        0xc8000: 0x80000000,
        0xd8000: 0x400040,
        0xe8000: 0x401040,
        0xf8000: 0x80000040,
        0x100000: 0x400040,
        0x110000: 0x401000,
        0x120000: 0x80000040,
        0x130000: 0x0,
        0x140000: 0x1040,
        0x150000: 0x80400040,
        0x160000: 0x80401000,
        0x170000: 0x80001040,
        0x180000: 0x80401040,
        0x190000: 0x80000000,
        0x1a0000: 0x80400000,
        0x1b0000: 0x401040,
        0x1c0000: 0x80001000,
        0x1d0000: 0x400000,
        0x1e0000: 0x40,
        0x1f0000: 0x1000,
        0x108000: 0x80400000,
        0x118000: 0x80401040,
        0x128000: 0x0,
        0x138000: 0x401000,
        0x148000: 0x400040,
        0x158000: 0x80000000,
        0x168000: 0x80001040,
        0x178000: 0x40,
        0x188000: 0x80000040,
        0x198000: 0x1000,
        0x1a8000: 0x80001000,
        0x1b8000: 0x80400040,
        0x1c8000: 0x1040,
        0x1d8000: 0x80401000,
        0x1e8000: 0x400000,
        0x1f8000: 0x401040,
    },
    {
        0x0: 0x80,
        0x1000: 0x1040000,
        0x2000: 0x40000,
        0x3000: 0x20000000,
        0x4000: 0x20040080,
        0x5000: 0x1000080,
        0x6000: 0x21000080,
        0x7000: 0x40080,
        0x8000: 0x1000000,
        0x9000: 0x20040000,
        0xa000: 0x20000080,
        0xb000: 0x21040080,
        0xc000: 0x21040000,
        0xd000: 0x0,
        0xe000: 0x1040080,
        0xf000: 0x21000000,
        0x800: 0x1040080,
        0x1800: 0x21000080,
        0x2800: 0x80,
        0x3800: 0x1040000,
        0x4800: 0x40000,
        0x5800: 0x20040080,
        0x6800: 0x21040000,
        0x7800: 0x20000000,
        0x8800: 0x20040000,
        0x9800: 0x0,
        0xa800: 0x21040080,
        0xb800: 0x1000080,
        0xc800: 0x20000080,
        0xd800: 0x21000000,
        0xe800: 0x1000000,
        0xf800: 0x40080,
        0x10000: 0x40000,
        0x11000: 0x80,
        0x12000: 0x20000000,
        0x13000: 0x21000080,
        0x14000: 0x1000080,
        0x15000: 0x21040000,
        0x16000: 0x20040080,
        0x17000: 0x1000000,
        0x18000: 0x21040080,
        0x19000: 0x21000000,
        0x1a000: 0x1040000,
        0x1b000: 0x20040000,
        0x1c000: 0x40080,
        0x1d000: 0x20000080,
        0x1e000: 0x0,
        0x1f000: 0x1040080,
        0x10800: 0x21000080,
        0x11800: 0x1000000,
        0x12800: 0x1040000,
        0x13800: 0x20040080,
        0x14800: 0x20000000,
        0x15800: 0x1040080,
        0x16800: 0x80,
        0x17800: 0x21040000,
        0x18800: 0x40080,
        0x19800: 0x21040080,
        0x1a800: 0x0,
        0x1b800: 0x21000000,
        0x1c800: 0x1000080,
        0x1d800: 0x40000,
        0x1e800: 0x20040000,
        0x1f800: 0x20000080,
    },
    {
        0x0: 0x10000008,
        0x100: 0x2000,
        0x200: 0x10200000,
        0x300: 0x10202008,
        0x400: 0x10002000,
        0x500: 0x200000,
        0x600: 0x200008,
        0x700: 0x10000000,
        0x800: 0x0,
        0x900: 0x10002008,
        0xa00: 0x202000,
        0xb00: 0x8,
        0xc00: 0x10200008,
        0xd00: 0x202008,
        0xe00: 0x2008,
        0xf00: 0x10202000,
        0x80: 0x10200000,
        0x180: 0x10202008,
        0x280: 0x8,
        0x380: 0x200000,
        0x480: 0x202008,
        0x580: 0x10000008,
        0x680: 0x10002000,
        0x780: 0x2008,
        0x880: 0x200008,
        0x980: 0x2000,
        0xa80: 0x10002008,
        0xb80: 0x10200008,
        0xc80: 0x0,
        0xd80: 0x10202000,
        0xe80: 0x202000,
        0xf80: 0x10000000,
        0x1000: 0x10002000,
        0x1100: 0x10200008,
        0x1200: 0x10202008,
        0x1300: 0x2008,
        0x1400: 0x200000,
        0x1500: 0x10000000,
        0x1600: 0x10000008,
        0x1700: 0x202000,
        0x1800: 0x202008,
        0x1900: 0x0,
        0x1a00: 0x8,
        0x1b00: 0x10200000,
        0x1c00: 0x2000,
        0x1d00: 0x10002008,
        0x1e00: 0x10202000,
        0x1f00: 0x200008,
        0x1080: 0x8,
        0x1180: 0x202000,
        0x1280: 0x200000,
        0x1380: 0x10000008,
        0x1480: 0x10002000,
        0x1580: 0x2008,
        0x1680: 0x10202008,
        0x1780: 0x10200000,
        0x1880: 0x10202000,
        0x1980: 0x10200008,
        0x1a80: 0x2000,
        0x1b80: 0x202008,
        0x1c80: 0x200008,
        0x1d80: 0x0,
        0x1e80: 0x10000000,
        0x1f80: 0x10002008,
    },
    {
        0x0: 0x100000,
        0x10: 0x2000401,
        0x20: 0x400,
        0x30: 0x100401,
        0x40: 0x2100401,
        0x50: 0x0,
        0x60: 0x1,
        0x70: 0x2100001,
        0x80: 0x2000400,
        0x90: 0x100001,
        0xa0: 0x2000001,
        0xb0: 0x2100400,
        0xc0: 0x2100000,
        0xd0: 0x401,
        0xe0: 0x100400,
        0xf0: 0x2000000,
        0x8: 0x2100001,
        0x18: 0x0,
        0x28: 0x2000401,
        0x38: 0x2100400,
        0x48: 0x100000,
        0x58: 0x2000001,
        0x68: 0x2000000,
        0x78: 0x401,
        0x88: 0x100401,
        0x98: 0x2000400,
        0xa8: 0x2100000,
        0xb8: 0x100001,
        0xc8: 0x400,
        0xd8: 0x2100401,
        0xe8: 0x1,
        0xf8: 0x100400,
        0x100: 0x2000000,
        0x110: 0x100000,
        0x120: 0x2000401,
        0x130: 0x2100001,
        0x140: 0x100001,
        0x150: 0x2000400,
        0x160: 0x2100400,
        0x170: 0x100401,
        0x180: 0x401,
        0x190: 0x2100401,
        0x1a0: 0x100400,
        0x1b0: 0x1,
        0x1c0: 0x0,
        0x1d0: 0x2100000,
        0x1e0: 0x2000001,
        0x1f0: 0x400,
        0x108: 0x100400,
        0x118: 0x2000401,
        0x128: 0x2100001,
        0x138: 0x1,
        0x148: 0x2000000,
        0x158: 0x100000,
        0x168: 0x401,
        0x178: 0x2100400,
        0x188: 0x2000001,
        0x198: 0x2100000,
        0x1a8: 0x0,
        0x1b8: 0x2100401,
        0x1c8: 0x100401,
        0x1d8: 0x400,
        0x1e8: 0x2000400,
        0x1f8: 0x100001,
    },
    {
        0x0: 0x8000820,
        0x1: 0x20000,
        0x2: 0x8000000,
        0x3: 0x20,
        0x4: 0x20020,
        0x5: 0x8020820,
        0x6: 0x8020800,
        0x7: 0x800,
        0x8: 0x8020000,
        0x9: 0x8000800,
        0xa: 0x20800,
        0xb: 0x8020020,
        0xc: 0x820,
        0xd: 0x0,
        0xe: 0x8000020,
        0xf: 0x20820,
        0x80000000: 0x800,
        0x80000001: 0x8020820,
        0x80000002: 0x8000820,
        0x80000003: 0x8000000,
        0x80000004: 0x8020000,
        0x80000005: 0x20800,
        0x80000006: 0x20820,
        0x80000007: 0x20,
        0x80000008: 0x8000020,
        0x80000009: 0x820,
        0x8000000a: 0x20020,
        0x8000000b: 0x8020800,
        0x8000000c: 0x0,
        0x8000000d: 0x8020020,
        0x8000000e: 0x8000800,
        0x8000000f: 0x20000,
        0x10: 0x20820,
        0x11: 0x8020800,
        0x12: 0x20,
        0x13: 0x800,
        0x14: 0x8000800,
        0x15: 0x8000020,
        0x16: 0x8020020,
        0x17: 0x20000,
        0x18: 0x0,
        0x19: 0x20020,
        0x1a: 0x8020000,
        0x1b: 0x8000820,
        0x1c: 0x8020820,
        0x1d: 0x20800,
        0x1e: 0x820,
        0x1f: 0x8000000,
        0x80000010: 0x20000,
        0x80000011: 0x800,
        0x80000012: 0x8020020,
        0x80000013: 0x20820,
        0x80000014: 0x20,
        0x80000015: 0x8020000,
        0x80000016: 0x8000000,
        0x80000017: 0x8000820,
        0x80000018: 0x8020820,
        0x80000019: 0x8000020,
        0x8000001a: 0x8000800,
        0x8000001b: 0x0,
        0x8000001c: 0x20800,
        0x8000001d: 0x820,
        0x8000001e: 0x20020,
        0x8000001f: 0x8020800,
    },
];

// Masks that select the SBOX input
const SBOX_MASK = [
    0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000, 0x0001f800, 0x00001f80,
    0x000001f8, 0x8000001f,
];

// Swap bits across the left and right words
function exchangeLR(offset, mask) {
    const t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
    this._rBlock ^= t;
    this._lBlock ^= t << offset;
}

function exchangeRL(offset, mask) {
    const t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
    this._lBlock ^= t;
    this._rBlock ^= t << offset;
}

/**
 * DES block cipher algorithm.
 */
class DESAlgo extends BlockCipher {
    _doReset() {
        // Shortcuts
        const key = this._key;
        const keyWords = key.words;

        // Select 56 bits according to PC1
        const keyBits = [];
        for (let i = 0; i < 56; i += 1) {
            const keyBitPos = PC1[i] - 1;
            keyBits[i] =
                (keyWords[keyBitPos >>> 5] >>> (31 - (keyBitPos % 32))) & 1;
        }

        // Assemble 16 subkeys
        this._subKeys = [];
        const subKeys = this._subKeys;
        for (let nSubKey = 0; nSubKey < 16; nSubKey += 1) {
            // Create subkey
            subKeys[nSubKey] = [];
            const subKey = subKeys[nSubKey];

            // Shortcut
            const bitShift = BIT_SHIFTS[nSubKey];

            // Select 48 bits according to PC2
            for (let i = 0; i < 24; i += 1) {
                // Select from the left 28 key bits
                subKey[(i / 6) | 0] |=
                    keyBits[(PC2[i] - 1 + bitShift) % 28] << (31 - (i % 6));

                // Select from the right 28 key bits
                subKey[4 + ((i / 6) | 0)] |=
                    keyBits[28 + ((PC2[i + 24] - 1 + bitShift) % 28)] <<
                    (31 - (i % 6));
            }

            // Since each subkey is applied to an expanded 32-bit input,
            // the subkey can be broken into 8 values scaled to 32-bits,
            // which allows the key to be used without expansion
            subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
            for (let i = 1; i < 7; i += 1) {
                subKey[i] >>>= (i - 1) * 4 + 3;
            }
            subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
        }

        // Compute inverse subkeys
        this._invSubKeys = [];
        const invSubKeys = this._invSubKeys;
        for (let i = 0; i < 16; i += 1) {
            invSubKeys[i] = subKeys[15 - i];
        }
    }

    encryptBlock(M, offset) {
        this._doCryptBlock(M, offset, this._subKeys);
    }

    decryptBlock(M, offset) {
        this._doCryptBlock(M, offset, this._invSubKeys);
    }

    _doCryptBlock(M, offset, subKeys) {
        const _M = M;

        // Get input
        this._lBlock = M[offset];
        this._rBlock = M[offset + 1];

        // Initial permutation
        exchangeLR.call(this, 4, 0x0f0f0f0f);
        exchangeLR.call(this, 16, 0x0000ffff);
        exchangeRL.call(this, 2, 0x33333333);
        exchangeRL.call(this, 8, 0x00ff00ff);
        exchangeLR.call(this, 1, 0x55555555);

        // Rounds
        for (let round = 0; round < 16; round += 1) {
            // Shortcuts
            const subKey = subKeys[round];
            const lBlock = this._lBlock;
            const rBlock = this._rBlock;

            // Feistel function
            let f = 0;
            for (let i = 0; i < 8; i += 1) {
                f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
            }
            this._lBlock = rBlock;
            this._rBlock = lBlock ^ f;
        }

        // Undo swap from last round
        const t = this._lBlock;
        this._lBlock = this._rBlock;
        this._rBlock = t;

        // Final permutation
        exchangeLR.call(this, 1, 0x55555555);
        exchangeRL.call(this, 8, 0x00ff00ff);
        exchangeRL.call(this, 2, 0x33333333);
        exchangeLR.call(this, 16, 0x0000ffff);
        exchangeLR.call(this, 4, 0x0f0f0f0f);

        // Set output
        _M[offset] = this._lBlock;
        _M[offset + 1] = this._rBlock;
    }
}
DESAlgo.keySize = 64 / 32;
DESAlgo.ivSize = 64 / 32;
DESAlgo.blockSize = 64 / 32;

/**
 * Shortcut functions to the cipher's object interface.
 *
 * @example
 *
 *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
 *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
 */
const DES = BlockCipher._createHelper(DESAlgo);

/**
 * Triple-DES block cipher algorithm.
 */
class TripleDESAlgo extends BlockCipher {
    _doReset() {
        // Shortcuts
        const key = this._key;
        const keyWords = key.words;
        // Make sure the key length is valid (64, 128 or >= 192 bit)
        if (
            keyWords.length !== 2 &&
            keyWords.length !== 4 &&
            keyWords.length < 6
        ) {
            throw new Error(
                'Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.'
            );
        }

        // Extend the key according to the keying options defined in 3DES standard
        const key1 = keyWords.slice(0, 2);
        const key2 =
            keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
        const key3 =
            keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);

        // Create DES instances
        this._des1 = DESAlgo.createEncryptor(WordArray.create(key1));
        this._des2 = DESAlgo.createEncryptor(WordArray.create(key2));
        this._des3 = DESAlgo.createEncryptor(WordArray.create(key3));
    }

    encryptBlock(M, offset) {
        this._des1.encryptBlock(M, offset);
        this._des2.decryptBlock(M, offset);
        this._des3.encryptBlock(M, offset);
    }

    decryptBlock(M, offset) {
        this._des3.decryptBlock(M, offset);
        this._des2.encryptBlock(M, offset);
        this._des1.decryptBlock(M, offset);
    }
}
TripleDESAlgo.keySize = 192 / 32;
TripleDESAlgo.ivSize = 64 / 32;
TripleDESAlgo.blockSize = 64 / 32;

/**
 * Shortcut functions to the cipher's object interface.
 *
 * @example
 *
 *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
 *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
 */
const TripleDES = BlockCipher._createHelper(TripleDESAlgo);

// Reusable objects
const S$1 = [];
const C_$1 = [];
const G$1 = [];

function nextState$1() {
    // Shortcuts
    const X = this._X;
    const C = this._C;

    // Save old counter values
    for (let i = 0; i < 8; i += 1) {
        C_$1[i] = C[i];
    }

    // Calculate new counter values
    C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
    C[1] = (C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_$1[0] >>> 0 ? 1 : 0)) | 0;
    C[2] = (C[2] + 0x34d34d34 + (C[1] >>> 0 < C_$1[1] >>> 0 ? 1 : 0)) | 0;
    C[3] = (C[3] + 0x4d34d34d + (C[2] >>> 0 < C_$1[2] >>> 0 ? 1 : 0)) | 0;
    C[4] = (C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_$1[3] >>> 0 ? 1 : 0)) | 0;
    C[5] = (C[5] + 0x34d34d34 + (C[4] >>> 0 < C_$1[4] >>> 0 ? 1 : 0)) | 0;
    C[6] = (C[6] + 0x4d34d34d + (C[5] >>> 0 < C_$1[5] >>> 0 ? 1 : 0)) | 0;
    C[7] = (C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_$1[6] >>> 0 ? 1 : 0)) | 0;
    this._b = C[7] >>> 0 < C_$1[7] >>> 0 ? 1 : 0;

    // Calculate the g-values
    for (let i = 0; i < 8; i += 1) {
        const gx = X[i] + C[i];

        // Construct high and low argument for squaring
        const ga = gx & 0xffff;
        const gb = gx >>> 16;

        // Calculate high and low result of squaring
        const gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
        const gl =
            (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

        // High XOR low
        G$1[i] = gh ^ gl;
    }

    // Calculate new state values
    X[0] =
        (G$1[0] +
            ((G$1[7] << 16) | (G$1[7] >>> 16)) +
            ((G$1[6] << 16) | (G$1[6] >>> 16))) |
        0;
    X[1] = (G$1[1] + ((G$1[0] << 8) | (G$1[0] >>> 24)) + G$1[7]) | 0;
    X[2] =
        (G$1[2] +
            ((G$1[1] << 16) | (G$1[1] >>> 16)) +
            ((G$1[0] << 16) | (G$1[0] >>> 16))) |
        0;
    X[3] = (G$1[3] + ((G$1[2] << 8) | (G$1[2] >>> 24)) + G$1[1]) | 0;
    X[4] =
        (G$1[4] +
            ((G$1[3] << 16) | (G$1[3] >>> 16)) +
            ((G$1[2] << 16) | (G$1[2] >>> 16))) |
        0;
    X[5] = (G$1[5] + ((G$1[4] << 8) | (G$1[4] >>> 24)) + G$1[3]) | 0;
    X[6] =
        (G$1[6] +
            ((G$1[5] << 16) | (G$1[5] >>> 16)) +
            ((G$1[4] << 16) | (G$1[4] >>> 16))) |
        0;
    X[7] = (G$1[7] + ((G$1[6] << 8) | (G$1[6] >>> 24)) + G$1[5]) | 0;
}

/**
 * Rabbit stream cipher algorithm
 */
class RabbitAlgo extends StreamCipher {
    constructor(...args) {
        super(...args);

        this.blockSize = 128 / 32;
        this.ivSize = 64 / 32;
    }

    _doReset() {
        // Shortcuts
        const K = this._key.words;
        const { iv } = this.cfg;

        // Swap endian
        for (let i = 0; i < 4; i += 1) {
            K[i] =
                (((K[i] << 8) | (K[i] >>> 24)) & 0x00ff00ff) |
                (((K[i] << 24) | (K[i] >>> 8)) & 0xff00ff00);
        }

        // Generate initial state values
        this._X = [
            K[0],
            (K[3] << 16) | (K[2] >>> 16),
            K[1],
            (K[0] << 16) | (K[3] >>> 16),
            K[2],
            (K[1] << 16) | (K[0] >>> 16),
            K[3],
            (K[2] << 16) | (K[1] >>> 16),
        ];
        const X = this._X;

        // Generate initial counter values
        this._C = [
            (K[2] << 16) | (K[2] >>> 16),
            (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
            (K[3] << 16) | (K[3] >>> 16),
            (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
            (K[0] << 16) | (K[0] >>> 16),
            (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
            (K[1] << 16) | (K[1] >>> 16),
            (K[3] & 0xffff0000) | (K[0] & 0x0000ffff),
        ];
        const C = this._C;

        // Carry bit
        this._b = 0;

        // Iterate the system four times
        for (let i = 0; i < 4; i += 1) {
            nextState$1.call(this);
        }

        // Modify the counters
        for (let i = 0; i < 8; i += 1) {
            C[i] ^= X[(i + 4) & 7];
        }

        // IV setup
        if (iv) {
            // Shortcuts
            const IV = iv.words;
            const IV_0 = IV[0];
            const IV_1 = IV[1];

            // Generate four subvectors
            const i0 =
                (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) |
                (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
            const i2 =
                (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) |
                (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
            const i1 = (i0 >>> 16) | (i2 & 0xffff0000);
            const i3 = (i2 << 16) | (i0 & 0x0000ffff);

            // Modify counter values
            C[0] ^= i0;
            C[1] ^= i1;
            C[2] ^= i2;
            C[3] ^= i3;
            C[4] ^= i0;
            C[5] ^= i1;
            C[6] ^= i2;
            C[7] ^= i3;

            // Iterate the system four times
            for (let i = 0; i < 4; i += 1) {
                nextState$1.call(this);
            }
        }
    }

    _doProcessBlock(M, offset) {
        const _M = M;

        // Shortcut
        const X = this._X;

        // Iterate the system
        nextState$1.call(this);

        // Generate four keystream words
        S$1[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
        S$1[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
        S$1[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
        S$1[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

        for (let i = 0; i < 4; i += 1) {
            // Swap endian
            S$1[i] =
                (((S$1[i] << 8) | (S$1[i] >>> 24)) & 0x00ff00ff) |
                (((S$1[i] << 24) | (S$1[i] >>> 8)) & 0xff00ff00);

            // Encrypt
            _M[offset + i] ^= S$1[i];
        }
    }
}

/**
 * Shortcut functions to the cipher's object interface.
 *
 * @example
 *
 *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
 *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
 */
const Rabbit = StreamCipher._createHelper(RabbitAlgo);

// Reusable objects
const S = [];
const C_ = [];
const G = [];

function nextState() {
    // Shortcuts
    const X = this._X;
    const C = this._C;

    // Save old counter values
    for (let i = 0; i < 8; i += 1) {
        C_[i] = C[i];
    }

    // Calculate new counter values
    C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
    C[1] = (C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0)) | 0;
    C[2] = (C[2] + 0x34d34d34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0)) | 0;
    C[3] = (C[3] + 0x4d34d34d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0)) | 0;
    C[4] = (C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0)) | 0;
    C[5] = (C[5] + 0x34d34d34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0)) | 0;
    C[6] = (C[6] + 0x4d34d34d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0)) | 0;
    C[7] = (C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0)) | 0;
    this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;

    // Calculate the g-values
    for (let i = 0; i < 8; i += 1) {
        const gx = X[i] + C[i];

        // Construct high and low argument for squaring
        const ga = gx & 0xffff;
        const gb = gx >>> 16;

        // Calculate high and low result of squaring
        const gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
        const gl =
            (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

        // High XOR low
        G[i] = gh ^ gl;
    }

    // Calculate new state values
    X[0] =
        (G[0] +
            ((G[7] << 16) | (G[7] >>> 16)) +
            ((G[6] << 16) | (G[6] >>> 16))) |
        0;
    X[1] = (G[1] + ((G[0] << 8) | (G[0] >>> 24)) + G[7]) | 0;
    X[2] =
        (G[2] +
            ((G[1] << 16) | (G[1] >>> 16)) +
            ((G[0] << 16) | (G[0] >>> 16))) |
        0;
    X[3] = (G[3] + ((G[2] << 8) | (G[2] >>> 24)) + G[1]) | 0;
    X[4] =
        (G[4] +
            ((G[3] << 16) | (G[3] >>> 16)) +
            ((G[2] << 16) | (G[2] >>> 16))) |
        0;
    X[5] = (G[5] + ((G[4] << 8) | (G[4] >>> 24)) + G[3]) | 0;
    X[6] =
        (G[6] +
            ((G[5] << 16) | (G[5] >>> 16)) +
            ((G[4] << 16) | (G[4] >>> 16))) |
        0;
    X[7] = (G[7] + ((G[6] << 8) | (G[6] >>> 24)) + G[5]) | 0;
}

/**
 * Rabbit stream cipher algorithm.
 *
 * This is a legacy version that neglected to convert the key to little-endian.
 * This error doesn't affect the cipher's security,
 * but it does affect its compatibility with other implementations.
 */
class RabbitLegacyAlgo extends StreamCipher {
    constructor(...args) {
        super(...args);

        this.blockSize = 128 / 32;
        this.ivSize = 64 / 32;
    }

    _doReset() {
        // Shortcuts
        const K = this._key.words;
        const { iv } = this.cfg;

        // Generate initial state values
        this._X = [
            K[0],
            (K[3] << 16) | (K[2] >>> 16),
            K[1],
            (K[0] << 16) | (K[3] >>> 16),
            K[2],
            (K[1] << 16) | (K[0] >>> 16),
            K[3],
            (K[2] << 16) | (K[1] >>> 16),
        ];
        const X = this._X;

        // Generate initial counter values
        this._C = [
            (K[2] << 16) | (K[2] >>> 16),
            (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
            (K[3] << 16) | (K[3] >>> 16),
            (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
            (K[0] << 16) | (K[0] >>> 16),
            (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
            (K[1] << 16) | (K[1] >>> 16),
            (K[3] & 0xffff0000) | (K[0] & 0x0000ffff),
        ];
        const C = this._C;

        // Carry bit
        this._b = 0;

        // Iterate the system four times
        for (let i = 0; i < 4; i += 1) {
            nextState.call(this);
        }

        // Modify the counters
        for (let i = 0; i < 8; i += 1) {
            C[i] ^= X[(i + 4) & 7];
        }

        // IV setup
        if (iv) {
            // Shortcuts
            const IV = iv.words;
            const IV_0 = IV[0];
            const IV_1 = IV[1];

            // Generate four subvectors
            const i0 =
                (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) |
                (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
            const i2 =
                (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) |
                (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
            const i1 = (i0 >>> 16) | (i2 & 0xffff0000);
            const i3 = (i2 << 16) | (i0 & 0x0000ffff);

            // Modify counter values
            C[0] ^= i0;
            C[1] ^= i1;
            C[2] ^= i2;
            C[3] ^= i3;
            C[4] ^= i0;
            C[5] ^= i1;
            C[6] ^= i2;
            C[7] ^= i3;

            // Iterate the system four times
            for (let i = 0; i < 4; i += 1) {
                nextState.call(this);
            }
        }
    }

    _doProcessBlock(M, offset) {
        const _M = M;

        // Shortcut
        const X = this._X;

        // Iterate the system
        nextState.call(this);

        // Generate four keystream words
        S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
        S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
        S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
        S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

        for (let i = 0; i < 4; i += 1) {
            // Swap endian
            S[i] =
                (((S[i] << 8) | (S[i] >>> 24)) & 0x00ff00ff) |
                (((S[i] << 24) | (S[i] >>> 8)) & 0xff00ff00);

            // Encrypt
            _M[offset + i] ^= S[i];
        }
    }
}

/**
 * Shortcut functions to the cipher's object interface.
 *
 * @example
 *
 *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
 *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
 */
const RabbitLegacy = StreamCipher._createHelper(RabbitLegacyAlgo);

function generateKeystreamWord() {
    // Shortcuts
    const S = this._S;
    let i = this._i;
    let j = this._j;

    // Generate keystream word
    let keystreamWord = 0;
    for (let n = 0; n < 4; n += 1) {
        i = (i + 1) % 256;
        j = (j + S[i]) % 256;

        // Swap
        const t = S[i];
        S[i] = S[j];
        S[j] = t;

        keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
    }

    // Update counters
    this._i = i;
    this._j = j;

    return keystreamWord;
}

/**
 * RC4 stream cipher algorithm.
 */
class RC4Algo extends StreamCipher {
    _doReset() {
        // Shortcuts
        const key = this._key;
        const keyWords = key.words;
        const keySigBytes = key.sigBytes;

        // Init sbox
        this._S = [];
        const S = this._S;
        for (let i = 0; i < 256; i += 1) {
            S[i] = i;
        }

        // Key setup
        for (let i = 0, j = 0; i < 256; i += 1) {
            const keyByteIndex = i % keySigBytes;
            const keyByte =
                (keyWords[keyByteIndex >>> 2] >>>
                    (24 - (keyByteIndex % 4) * 8)) &
                0xff;

            j = (j + S[i] + keyByte) % 256;

            // Swap
            const t = S[i];
            S[i] = S[j];
            S[j] = t;
        }

        // Counters
        this._j = 0;
        this._i = this._j;
    }

    _doProcessBlock(M, offset) {
        const _M = M;

        _M[offset] ^= generateKeystreamWord.call(this);
    }
}
RC4Algo.keySize = 256 / 32;
RC4Algo.ivSize = 0;

/**
 * Shortcut functions to the cipher's object interface.
 *
 * @example
 *
 *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
 *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
 */
const RC4 = StreamCipher._createHelper(RC4Algo);

/**
 * Modified RC4 stream cipher algorithm.
 */
class RC4DropAlgo extends RC4Algo {
    constructor(...args) {
        super(...args);

        /**
         * Configuration options.
         *
         * @property {number} drop The number of keystream words to drop. Default 192
         */
        Object.assign(this.cfg, { drop: 192 });
    }

    _doReset() {
        super._doReset.call(this);

        // Drop
        for (let i = this.cfg.drop; i > 0; i -= 1) {
            generateKeystreamWord.call(this);
        }
    }
}

/**
 * Shortcut functions to the cipher's object interface.
 *
 * @example
 *
 *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
 *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
 */
const RC4Drop = StreamCipher._createHelper(RC4DropAlgo);

function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
    const _words = words;
    let keystream;

    // Shortcut
    const iv = this._iv;

    // Generate keystream
    if (iv) {
        keystream = iv.slice(0);

        // Remove IV for subsequent blocks
        this._iv = undefined;
    } else {
        keystream = this._prevBlock;
    }
    cipher.encryptBlock(keystream, 0);

    // Encrypt
    for (let i = 0; i < blockSize; i += 1) {
        _words[offset + i] ^= keystream[i];
    }
}

/**
 * Cipher Feedback block mode.
 */
class CFB extends BlockCipherMode {}
CFB.Encryptor = class extends CFB {
    processBlock(words, offset) {
        // Shortcuts
        const cipher = this._cipher;
        const { blockSize } = cipher;

        generateKeystreamAndEncrypt.call(
            this,
            words,
            offset,
            blockSize,
            cipher
        );

        // Remember this block to use with next block
        this._prevBlock = words.slice(offset, offset + blockSize);
    }
};
CFB.Decryptor = class extends CFB {
    processBlock(words, offset) {
        // Shortcuts
        const cipher = this._cipher;
        const { blockSize } = cipher;

        // Remember this block to use with next block
        const thisBlock = words.slice(offset, offset + blockSize);

        generateKeystreamAndEncrypt.call(
            this,
            words,
            offset,
            blockSize,
            cipher
        );

        // This block becomes the previous block
        this._prevBlock = thisBlock;
    }
};

/**
 * Counter block mode.
 */

class CTR extends BlockCipherMode {}
CTR.Encryptor = class extends CTR {
    processBlock(words, offset) {
        const _words = words;

        // Shortcuts
        const cipher = this._cipher;
        const { blockSize } = cipher;
        const iv = this._iv;
        let counter = this._counter;

        // Generate keystream
        if (iv) {
            this._counter = iv.slice(0);
            counter = this._counter;

            // Remove IV for subsequent blocks
            this._iv = undefined;
        }
        const keystream = counter.slice(0);
        cipher.encryptBlock(keystream, 0);

        // Increment counter
        counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0;

        // Encrypt
        for (let i = 0; i < blockSize; i += 1) {
            _words[offset + i] ^= keystream[i];
        }
    }
};
CTR.Decryptor = CTR.Encryptor;

const incWord = (word) => {
    let _word = word;

    if (((word >> 24) & 0xff) === 0xff) {
        // overflow
        let b1 = (word >> 16) & 0xff;
        let b2 = (word >> 8) & 0xff;
        let b3 = word & 0xff;

        if (b1 === 0xff) {
            // overflow b1
            b1 = 0;
            if (b2 === 0xff) {
                b2 = 0;
                if (b3 === 0xff) {
                    b3 = 0;
                } else {
                    b3 += 1;
                }
            } else {
                b2 += 1;
            }
        } else {
            b1 += 1;
        }

        _word = 0;
        _word += b1 << 16;
        _word += b2 << 8;
        _word += b3;
    } else {
        _word += 0x01 << 24;
    }
    return _word;
};

const incCounter = (counter) => {
    const _counter = counter;
    _counter[0] = incWord(_counter[0]);

    if (_counter[0] === 0) {
        // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
        _counter[1] = incWord(_counter[1]);
    }
    return _counter;
};

/** @preserve
 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
 * derived from CryptoJS.mode.CTR
 * Jan Hruby jhruby.web@gmail.com
 */
class CTRGladman extends BlockCipherMode {}
CTRGladman.Encryptor = class extends CTRGladman {
    processBlock(words, offset) {
        const _words = words;

        // Shortcuts
        const cipher = this._cipher;
        const { blockSize } = cipher;
        const iv = this._iv;
        let counter = this._counter;

        // Generate keystream
        if (iv) {
            this._counter = iv.slice(0);
            counter = this._counter;

            // Remove IV for subsequent blocks
            this._iv = undefined;
        }

        incCounter(counter);

        const keystream = counter.slice(0);
        cipher.encryptBlock(keystream, 0);

        // Encrypt
        for (let i = 0; i < blockSize; i += 1) {
            _words[offset + i] ^= keystream[i];
        }
    }
};
CTRGladman.Decryptor = CTRGladman.Encryptor;

/**
 * Electronic Codebook block mode.
 */

class ECB extends BlockCipherMode {}
ECB.Encryptor = class extends ECB {
    processBlock(words, offset) {
        this._cipher.encryptBlock(words, offset);
    }
};
ECB.Decryptor = class extends ECB {
    processBlock(words, offset) {
        this._cipher.decryptBlock(words, offset);
    }
};

/**
 * Output Feedback block mode.
 */

class OFB extends BlockCipherMode {}
OFB.Encryptor = class extends OFB {
    processBlock(words, offset) {
        const _words = words;

        // Shortcuts
        const cipher = this._cipher;
        const { blockSize } = cipher;
        const iv = this._iv;
        let keystream = this._keystream;

        // Generate keystream
        if (iv) {
            this._keystream = iv.slice(0);
            keystream = this._keystream;

            // Remove IV for subsequent blocks
            this._iv = undefined;
        }
        cipher.encryptBlock(keystream, 0);

        // Encrypt
        for (let i = 0; i < blockSize; i += 1) {
            _words[offset + i] ^= keystream[i];
        }
    }
};
OFB.Decryptor = OFB.Encryptor;

/**
 * ANSI X.923 padding strategy.
 */
const AnsiX923 = {
    pad(data, blockSize) {
        const _data = data;

        // Shortcuts
        const dataSigBytes = _data.sigBytes;
        const blockSizeBytes = blockSize * 4;

        // Count padding bytes
        const nPaddingBytes = blockSizeBytes - (dataSigBytes % blockSizeBytes);

        // Compute last byte position
        const lastBytePos = dataSigBytes + nPaddingBytes - 1;

        // Pad
        _data.clamp();
        _data.words[lastBytePos >>> 2] |=
            nPaddingBytes << (24 - (lastBytePos % 4) * 8);
        _data.sigBytes += nPaddingBytes;
    },

    unpad(data) {
        const _data = data;

        // Get number of padding bytes from last byte
        const nPaddingBytes = _data.words[(_data.sigBytes - 1) >>> 2] & 0xff;

        // Remove padding
        _data.sigBytes -= nPaddingBytes;
    },
};

/**
 * ISO 10126 padding strategy.
 */
const Iso10126 = {
    pad(data, blockSize) {
        // Shortcut
        const blockSizeBytes = blockSize * 4;

        // Count padding bytes
        const nPaddingBytes = blockSizeBytes - (data.sigBytes % blockSizeBytes);

        // Pad
        data.concat(WordArray.random(nPaddingBytes - 1)).concat(
            WordArray.create([nPaddingBytes << 24], 1)
        );
    },

    unpad(data) {
        const _data = data;
        // Get number of padding bytes from last byte
        const nPaddingBytes = _data.words[(_data.sigBytes - 1) >>> 2] & 0xff;

        // Remove padding
        _data.sigBytes -= nPaddingBytes;
    },
};

/**
 * Zero padding strategy.
 */
const ZeroPadding = {
    pad(data, blockSize) {
        const _data = data;

        // Shortcut
        const blockSizeBytes = blockSize * 4;

        // Pad
        _data.clamp();
        _data.sigBytes +=
            blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
    },

    unpad(data) {
        const _data = data;

        // Shortcut
        const dataWords = _data.words;

        // Unpad
        for (let i = _data.sigBytes - 1; i >= 0; i -= 1) {
            if ((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff) {
                _data.sigBytes = i + 1;
                break;
            }
        }
    },
};

/**
 * ISO/IEC 9797-1 Padding Method 2.
 */
const Iso97971 = {
    pad(data, blockSize) {
        // Add 0x80 byte
        data.concat(WordArray.create([0x80000000], 1));

        // Zero pad the rest
        ZeroPadding.pad(data, blockSize);
    },

    unpad(data) {
        const _data = data;

        // Remove zero padding
        ZeroPadding.unpad(_data);

        // Remove one more byte -- the 0x80 byte
        _data.sigBytes -= 1;
    },
};

/**
 * A noop padding strategy.
 */
const NoPadding = {
    pad() {},

    unpad() {},
};

const HexFormatter = {
    /**
     * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
     *
     * @param {CipherParams} cipherParams The cipher params object.
     *
     * @return {string} The hexadecimally encoded string.
     *
     * @static
     *
     * @example
     *
     *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
     */
    stringify(cipherParams) {
        return cipherParams.ciphertext.toString(Hex);
    },

    /**
     * Converts a hexadecimally encoded ciphertext string to a cipher params object.
     *
     * @param {string} input The hexadecimally encoded string.
     *
     * @return {CipherParams} The cipher params object.
     *
     * @static
     *
     * @example
     *
     *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
     */
    parse(input) {
        const ciphertext = Hex.parse(input);
        return CipherParams.create({ ciphertext });
    },
};

var Crypto = {
    lib: {
        Base,
        WordArray,
        BufferedBlockAlgorithm,
        Hasher,
        Cipher,
        StreamCipher,
        BlockCipherMode,
        BlockCipher,
        CipherParams,
        SerializableCipher,
        PasswordBasedCipher,
    },

    x64: {
        Word: X64Word,
        WordArray: X64WordArray,
    },

    enc: {
        Hex,
        Latin1,
        Utf8,
        Utf16,
        Utf16BE,
        Utf16LE,
        Base64,
    },

    algo: {
        HMAC,
        MD5: MD5Algo,
        SHA1: SHA1Algo,
        SHA224: SHA224Algo,
        SHA256: SHA256Algo,
        SHA384: SHA384Algo,
        SHA512: SHA512Algo,
        SHA3: SHA3Algo,
        RIPEMD160: RIPEMD160Algo,

        PBKDF2: PBKDF2Algo,
        EvpKDF: EvpKDFAlgo,

        AES: AESAlgo,
        DES: DESAlgo,
        TripleDES: TripleDESAlgo,
        Rabbit: RabbitAlgo,
        RabbitLegacy: RabbitLegacyAlgo,
        RC4: RC4Algo,
        RC4Drop: RC4DropAlgo,
    },

    mode: {
        CBC,
        CFB,
        CTR,
        CTRGladman,
        ECB,
        OFB,
    },

    pad: {
        Pkcs7,
        AnsiX923,
        Iso10126,
        Iso97971,
        NoPadding,
        ZeroPadding,
    },

    format: {
        OpenSSL: OpenSSLFormatter,
        Hex: HexFormatter,
    },

    kdf: {
        OpenSSL: OpenSSLKdf,
    },

    MD5,
    HmacMD5,
    SHA1,
    HmacSHA1,
    SHA224,
    HmacSHA224,
    SHA256,
    HmacSHA256,
    SHA384,
    HmacSHA384,
    SHA512,
    HmacSHA512,
    SHA3,
    HmacSHA3,
    RIPEMD160,
    HmacRIPEMD160,

    PBKDF2,
    EvpKDF,

    AES,
    DES,
    TripleDES,
    Rabbit,
    RabbitLegacy,
    RC4,
    RC4Drop,
};

const adjectives = [
    'Aquatic',
    'Aesthetical',
    'Ageless',
    'Authentic',
    'Afraid',
    'Athletic',
    'Academic',
    'Adventurous',
    'Aromatic',
    'Advantageous',
    'Bad',
    'Bald',
    'Beautiful',
    'Bitter',
    'Barking',
    'Baffling',
    'Bankrupt',
    'Busy',
    'Burning',
    'Boring',
    'Bold',
    'Charming',
    'Cheerful',
    'Clean',
    'Curly',
    'Curious',
    'Caring',
    'Crazy',
    'Cute',
    'Careful',
    'Classy',
    'Cheap',
    'Clingy',
    'Classic',
    'Chunky',
    'Cuddly',
    'Clumsy',
    'Cold',
    'Cozy',
    'Creamy',
    'Cosmetic',
    'Cryptic',
    'Cynical',
    'Damaged',
    'Dandy',
    'Dazzling',
    'Dark',
    'Deadly',
    'Dangerous',
    'Decent',
    'Deep',
    'Dirty',
    'Dramatic',
    'Dull',
    'Delightful',
    'Delicious',
    'Discreet',
    'Dizzy',
    'Disrespectful',
    'Eager',
    'Early',
    'Elegant',
    'Energetic',
    'Easy',
    'Euphoric',
    'Exotic',
    'Economic',
    'Eccentric',
    'Efficient',
    'Educated',
    'Elderly',
    'Egotistical',
    'Elite',
    'Empty',
    'Eternal',
    'Enthusiastic',
    'Enormous',
    'Expensive',
    'Exuberant',
    'Eye-Popping',
    'Fancy',
    'Fantastic',
    'Fierce',
    'Foolish',
    'Funny',
    'Fascinating',
    'Fatal',
    'Flawless',
    'Foolish',
    'Fat',
    'Fictional',
    'Flat',
    'Flying',
    'French',
    'Fuzzy',
    'Furious',
    'Frozen',
    'Fruity',
    'Generic',
    'Gentle',
    'Gifted',
    'Glamorous',
    'Gleaming',
    'Glorious',
    'Gorgeous',
    'Grateful',
    'Gross',
    'Grim',
    'Grimy',
    'Giant',
    'Goofy',
    'Gooey',
    'Great',
    'Giggly',
    'Giving',
    'Gigantic',
    'Gruesome',
    'Great',
    'Groovy',
    'Hairy',
    'Handsome',
    'Happy',
    'Harsh',
    'Hateful',
    'Haunting',
    'Hairless',
    'Hard',
    'Heartless',
    'Heavy',
    'Hip',
    'Hollow',
    'Helpless',
    'Horrible',
    'Hot',
    'Huge',
    'Humble',
    'Hungry',
    'Humble',
    'Hypnotic',
    'Hypersensitive',
    'Hysterical',
    'Hyperactive',
    'Helpful',
    'Honest',
    'Hurtful',
    'Icy',
    'Idiotic',
    'Immature',
    'Impolite',
    'Impressive',
    'Incredible',
    'Innocent',
    'Immortal',
    'Imaginary',
    'Imaginative',
    'Indirect',
    'Insane',
    'Insignificant',
    'Intense',
    'Intimidating',
    'Interesting',
    'Irritating',
    'Isolated',
    'Italian',
    'Irresistible',
    'Irrelevant',
];
const animals = [
    'Alligator',
    'Alpaca',
    'Anaconda',
    'Ape',
    'Axolotl',
    'Albatross',
    'Ant',
    'Antelope',
    'Barracuda',
    'Bumblebee',
    'Buffalo',
    'Baboon',
    'Bird',
    'Bee',
    'Butterfly',
    'Cat',
    'Chameleon',
    'Cockatoo',
    'Cheetah',
    'Chicken',
    'Coyote',
    'Cow',
    'Crab',
    'Duck',
    'Dalmatian',
    'Dolphin',
    'Dog',
    'Dingo',
    'Dachshund',
    'Dodo',
    'Deer',
    'Dragonfish',
    'Eagle',
    'Elephant',
    'Emu',
    'Elk',
    'Earthworm',
    'Eel',
    'Echidna',
    'Frog',
    'Flamingo',
    'Falcon',
    'Firefly',
    'Fox',
    'Fish',
    'Ferret',
    'Giraffe',
    'Gorilla',
    'Gnu',
    'Gazelle',
    'Goldfish',
    'Gopher',
    'Gecko',
    'Gnat',
    'Gibbon',
    'Goat',
    'Goose',
    'Grasshoper',
    'Grouse',
    'Guppy',
    'Hamster',
    'Hornbill',
    'Hedgehog',
    'Hippo',
    'Horse',
    'Honeybee',
    'Husky',
    'Hyena',
    'Hummingbird',
    'Iguana',
    'Impala',
];

const animations = Object.freeze({
    fadeLeftOut: function () {
        return 'animation: fadeLeftOutAnimation 0.3s !important;';
    },
    fadeLeftIn: function () {
        return 'animation: fadeLeftInAnimation 0.3s !important;';
    },
    fadeRightOut: function () {
        return 'animation: fadeRightOutAnimation 0.3s !important;';
    },
    fadeRightIn: function () {
        return 'animation: fadeRightInAnimation 0.3s !important;';
    },
});

function isKeyDownNumber(evt) {
    const charCode = evt.which ? evt.which : evt.keyCode;

    if (evt.target.selectionStart === 0 && charCode === 35) {
        return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }

    return true;
}

function humanReadAbleLastTime(ts) {
    const dateTime = new Date(ts);
    const hours = Math.abs(new Date(ts) - new Date()) / 36e5;
    const date = dateTime.toDateString();
    const time = dateTime.toLocaleTimeString();

    if (hours < 24) {
        return time.substring(0, 5);
    }
    if (hours < 168) {
        return dateTime.toLocaleDateString('en', { weekday: 'long' });
    }

    return date;
}

function sanitizeTime(ts) {
    const dateTime = new Date(ts);
    const date = dateTime.toDateString();
    const time = dateTime.toLocaleTimeString();

    return `${date} ${time}`;
}

function animateSideToMain(main, side, focus) {
    side.style = animations.fadeRightOut();

    setTimeout(() => {
        side.classList.add('hide');
        main.classList.remove('hide');

        side.style = '';
        main.style = animations.fadeLeftIn();

        requestAnimationFrame(() => {
            focus?.focus();
            main.style = '';
        });
    }, 300);
}

function animateMainToSide(main, side, focus) {
    main.style = animations.fadeLeftOut();

    setTimeout(() => {
        main.classList.add('hide');
        side.classList.remove('hide');

        main.style = '';
        side.style = animations.fadeRightIn();

        requestAnimationFrame(() => {
            focus?.focus();
            side.style = '';
        });
    }, 300);
}

function randomString() {
    const charset =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?';
    const random = (min, max) =>
        Math.floor(Math.random() * (max - min + 1) + min);

    return [...new Array(32)]
        .map(function () {
            return charset[random(0, charset.length - 1)];
        })
        .join('');
}

function generatePassword() {
    const password = randomString();
    const salt = Date.now() + '';
    const cipherPW = Crypto.AES.encrypt(password, salt).toString();
    return Object.freeze({
        password: cipherPW,
        salt,
    });
}

function randomNickname() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animale = animals[Math.floor(Math.random() * animals.length)];

    return `${adjective} ${animale}`;
}

function generateSafeLink(parameterName, content) {
    const urlObj = new URL(window.location.href);
    const cipherPW = Crypto.AES.encrypt(
        content,
        'hamburgerANDpizza0987654e3'
    ).toString();

    return `${urlObj.origin}?${parameterName}=${encodeURIComponent(cipherPW)}`;
}

function decryptSafeLink(ciphter) {
    return decodeURIComponent(
        Crypto.AES.decrypt(ciphter, 'hamburgerANDpizza0987654e3').toString(
            Crypto.enc.Utf8
        )
    );
}

function findUrls(text) {
    const urls = text.match(
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
    );
    return urls || [];
}

class InviteModal extends Modal {
    static properties = {
        inviteURL: { type: String },
        ME: { type: Object },
    };

    constructor() {
        super();

        this.ME = ME;
        this.isGenerated = false;
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    open() {
        const inviteGenerate = new CustomEvent('inviteGenerated', {
            bubbles: false,
            detail: {
                type: 'user',
                sentInviteLink: true,
            },
        });
        const qr = this.querySelector('.qr');

        super.open();
        navigator.clipboard.writeText(this.url).then(() => {
            qr.focus();
        });

        qr.innerHTML = '';
        new QRCode(qr, { text: this.url });
        return domCache.app.dispatchEvent(inviteGenerate);
    }

    render() {
        const url = generateSafeLink('user', this.ME.id);
        const content = $`<p class="create-group-headline">Invite Friends to be8</p><p>${o(
            LANG.INVITELINK.replaceAll('{{link}}', this.url)
        )}</p><br><div class="qr"></div><br>`;

        this.url = url;

        return super.render(content);
    }
}

customElements.define('invite-modal-window', InviteModal);

class PanicModal extends Modal {
    static properties = {
        ME: { type: Object },
    };

    constructor() {
        super();
        this.ME = ME;
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    onKeyPress(e) {
        if (!isKeyDownNumber(e)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.key === 'Enter') {
            return this.onClickDestroy();
        }
    }

    onClickDestroy() {
        const id = this.querySelector('input').value.trim();

        if (id === this.ME.id) {
            const panicEvent = new CustomEvent('panic', {
                bubbles: false,
                detail: {
                    ...this.ME,
                    done: async () => {
                        return location.reload();
                    },
                },
            });

            return domCache.app.dispatchEvent(panicEvent);
        }

        domCache.toast.notification = {
            type: 'error',
            text: 'Wrong code',
        };

        return domCache.toast.open();
    }

    open() {
        super.open();
        requestAnimationFrame(() => this.querySelector('input').focus());
    }

    render() {
        const text = o(LANG.PANICTEXT.replaceAll('{{id}}', this.ME.id));
        const content = $`<p>${text}</p><div><input tabindex="0" @keydown="${(
            e
        ) => this.onKeyPress(e)}" type="number" min="0"></div><button @click="${
            this.onClickDestroy
        }" class="danger-background">destroy everything</button>`;

        return super.render(content);
    }
}

customElements.define('panic-modal-window', PanicModal);

class ConversationModal extends Modal {
    static properties = {
        ME: {},
    };

    #modalContent = {};
    #createGroup = {};
    #dialogInput = {};
    #groupNameInput = {};
    #groupType = {};

    constructor() {
        super();
        this.ME = {};
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    open() {
        super.open();
        requestAnimationFrame(() => this.#dialogInput.focus());
    }

    #clickOnGoToGroup() {
        animateMainToSide(
            this.#modalContent,
            this.#createGroup,
            this.#groupNameInput
        );
    }

    #clickOnBackToMain() {
        animateSideToMain(
            this.#modalContent,
            this.#createGroup,
            this.#dialogInput
        );
    }

    #sendCreateGroup(nickname, groupType) {
        const createGroupEvent = new CustomEvent('createGroup', {
            bubbles: false,
            detail: {
                ...this.ME,
                nickname,
                groupType,
                success: () => {
                    domCache.toast.notification = {
                        type: 'success',
                        text: 'You created the group ' + nickname,
                    };
                    this.#groupNameInput.value = '';

                    domCache.toast.open();
                    return this.close();
                },
            },
        });

        return domCache.app.dispatchEvent(createGroupEvent);
    }

    #clickOnCreateGroup() {
        const name = this.#groupNameInput.value.trim();
        const type = this.#groupType.value;

        if (name.length === 0) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Enter a valid name for your group',
            };

            return domCache.toast.open();
        }

        return this.#sendCreateGroup(name, type);
    }

    close() {
        super.close();
        this.#clickOnBackToMain();
    }

    #sendNew1on1Conv(receiverID) {
        const newConversationEvent = new CustomEvent('startConversation', {
            bubbles: false,
            detail: {
                ...this.ME,
                receiverID,
                success: () => {
                    domCache.toast.notification = {
                        type: 'success',
                        text: 'Your are now chatting with ' + receiverID,
                    };
                    this.#dialogInput.value = '';

                    domCache.toast.open();
                    return this.close();
                },
                idDoesNotExist: () => {
                    domCache.toast.notification = {
                        type: 'error',
                        text:
                            'This id does not exist or banned you ' +
                            receiverID,
                    };

                    domCache.toast.open();
                },
            },
        });

        return domCache.app.dispatchEvent(newConversationEvent);
    }

    #keyDownOnGroup(e) {
        if (e.keyCode === 13) {
            return this.#clickOnCreateGroup();
        }
    }

    #keyDownOn1to1(e) {
        if (!isKeyDownNumber(e)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.keyCode === 13) {
            const id = this.#dialogInput.value.trim();

            if (id.length === 0) {
                domCache.toast.notification = {
                    type: 'error',
                    text: 'Enter a be8 id',
                };

                return domCache.toast.open();
            }
            if (id === this.ME.id) {
                domCache.toast.notification = {
                    type: 'error',
                    text: 'You can not chat with yourself.',
                };

                return domCache.toast.open();
            }

            return this.#sendNew1on1Conv(id);
        }
    }

    firstUpdated() {
        this.#modalContent = this.querySelector('.modal-content');
        this.#createGroup = this.querySelector('.create-group-content');
        this.#dialogInput = this.#modalContent.querySelector('input');
        this.#groupNameInput = this.#createGroup.querySelector('input');
        this.#groupType = this.#createGroup.querySelector('select');
    }

    render() {
        const content = $`<p>${LANG.CONVERSATION}</p><input @keydown="${(e) =>
            this.#keyDownOn1to1(
                e
            )}" tabindex="0" type="number" min="0"><div @click="${
            this.#clickOnGoToGroup
        }" class="sub-modal-button hover-background">Create a group <i class="fa-solid fa-arrow-right float-right"></i></div>`;
        const groupsettings = $`<div><p>Name</p><input @keydown="${(e) =>
            this.#keyDownOnGroup(
                e
            )}" type="text" maxlength="20"></div><p>Type</p><select><option value="public">public</option><option value="private">private</option></select><button @click="${
            this.#clickOnCreateGroup
        }">create group</button>`;
        const group = $`<div class="create-group-content hide"><p class="create-group-headline"><i @click="${
            this.#clickOnBackToMain
        }" class="fa-solid fa-arrow-left hover-font float-left"></i> <span>Create a group</span></p>${groupsettings}</div>`;

        return super.render(content, group);
    }
}

customElements.define('conversation-modal-window', ConversationModal);

function autoRefreshToast() {
    domCache.toast.notification = {
        type: 'success',
        text: 'Your unlock code and destroy code are set. Auto refresh in 2s.',
    };

    domCache.toast.open();
    setTimeout(() => location.reload(), 1750);
}

class Codes extends Modal {
    static properties = {
        ME: { type: Object },
        state: { type: String },
    };

    #modalContent = {};
    #updateUnlock = {};
    #updateDestroy = {};

    constructor() {
        super();
        this.ME = ME;
    }

    clickOnUpdateUnlock() {
        const [oldInput, newCodeInput, newCodeConfInput] = [
            ...this.#updateUnlock.querySelectorAll('input'),
        ];
        const newCode = newCodeInput.value;
        const newCodeConf = newCodeConfInput.value;
        const oldCode = oldInput.value;
        const updateUnlockEvent = new CustomEvent('updateCode', {
            bubbles: false,
            detail: {
                ...this.ME,
                code: newCode,
                oldCode,
                codeType: 'unlock',
                done: () => {
                    autoRefreshToast();
                    return this.close();
                },
                oldCodeWrong: () => {
                    domCache.toast.notification = {
                        type: 'error',
                        text: 'Your old code is wrong.',
                    };

                    return domCache.toast.open();
                },
            },
        });

        if (newCode !== newCodeConf) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Your new code and your re-typed are not identical.',
            };

            return domCache.toast.open();
        }

        return domCache.app.dispatchEvent(updateUnlockEvent);
    }

    clickOnUpdateDestroy() {
        const [oldInput, newCodeInput, newCodeConfInput] = [
            ...this.#updateDestroy.querySelectorAll('input'),
        ];
        const newCode = newCodeInput.value;
        const newCodeConf = newCodeConfInput.value;
        const oldCode = oldInput.value;
        const destroyEvent = new CustomEvent('updateCode', {
            bubbles: false,
            detail: {
                ...this.ME,
                code: newCode,
                oldCode,
                codeType: 'destroy',
                done: () => {
                    autoRefreshToast();
                    return this.close();
                },
                oldCodeWrong: () => {
                    domCache.toast.notification = {
                        type: 'error',
                        text: 'Your old code is wrong.',
                    };

                    return domCache.toast.open();
                },
            },
        });

        if (newCode !== newCodeConf) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Your new code and your re-typed are not identical.',
            };

            return domCache.toast.open();
        }

        return domCache.app.dispatchEvent(destroyEvent);
    }

    goToUpdateUnlock() {
        const input = this.#updateUnlock.querySelector('input');

        this.state = 'unlock';
        animateMainToSide(this.#modalContent, this.#updateUnlock, input);
    }

    goToUpdateDestroy() {
        const input = this.#updateUnlock.querySelector('input');

        this.state = 'destroy';
        animateMainToSide(this.#modalContent, this.#updateDestroy, input);
    }

    backToUpdateSelect() {
        if (this.state === 'unlock') {
            animateSideToMain(this.#modalContent, this.#updateUnlock);
        }
        if (this.state === 'destroy') {
            animateSideToMain(this.#modalContent, this.#updateDestroy);
        }

        this.state = 'main';
    }

    open() {
        super.open();

        this.state = 'main';
        requestAnimationFrame(() => this.querySelector('input')?.focus());
        this.#updateUnlock = this.querySelector('.unlock-side');
        this.#updateDestroy = this.querySelector('.destroy-side');
    }

    close() {
        super.close();
        this.backToUpdateSelect();
    }

    setup() {
        const inputs = [...this.querySelectorAll('input')];
        const [unlockInput, unlockInputConf, destroyInput, destroyInputConf] =
            inputs;
        const unlock = unlockInput.value;
        const unlockConf = unlockInputConf.value;
        const destroy = destroyInput.value;
        const destroyConf = destroyInputConf.value;
        const sameUnlock = unlock === unlockConf;
        const sameDestroy = destroy === destroyConf;
        const setupEvent = new CustomEvent('setupCodes', {
            bubbles: false,
            detail: {
                ...this.ME,
                unlockCode: unlock,
                destroyCode: destroy,
                done: () => {
                    autoRefreshToast();
                    inputs.forEach((input) => (input.value = ''));
                    this.close();
                },
            },
        });

        if (!sameUnlock) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Unlock and unlock re-type are not equal',
            };

            return domCache.toast.open();
        }
        if (!sameDestroy) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Destroy and destroy re-type are not equal',
            };

            return domCache.toast.open();
        }
        if (unlock === destroy) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Destroy and unlock are the same code',
            };

            return domCache.toast.open();
        }
        if (unlock.length === 0 || unlockConf.length === 0) {
            domCache.toast.notification = {
                type: 'error',
                text: 'You have to enter an unlock code',
            };

            return domCache.toast.open();
        }
        if (destroy.length === 0 || destroyConf.length === 0) {
            domCache.toast.notification = {
                type: 'error',
                text: 'You have to enter a destroy code',
            };

            return domCache.toast.open();
        }

        return domCache.app.dispatchEvent(setupEvent);
    }

    onKeyPress(e) {
        if (e.key === 'Enter') {
            return this.setup();
        }
    }

    renderUpdateSide() {
        const unlock = $`<div class="unlock-side hide"><p class="create-group-headline"><i @click="${this.backToUpdateSelect}" class="fa-solid fa-arrow-left hover-font float-left"></i> <span>Update Unlock</span></p><small>Old Code</small><input autocomplete="off" type="password" maxlength="40"><small>New Code</small><input type="password" maxlength="40"> <small>New Code re-type</small><input type="password" maxlength="40"><button @click="${this.clickOnUpdateUnlock}" class="full-width">Update</button></div>`;
        const destroy = $`<div class="destroy-side hide"><p class="create-group-headline"><i @click="${this.backToUpdateSelect}" class="fa-solid fa-arrow-left hover-font float-left"></i> <span>Update Destroy</span></p><small>Old Code</small><input autocomplete="off" type="password" maxlength="40"><small>New Code</small><input type="password" maxlength="40"> <small>New Code re-type</small><input type="password" maxlength="40"><button @click="${this.clickOnUpdateDestroy}" class="full-width">Update</button></div>`;

        return $`${unlock}${destroy}`;
    }

    renderUpdate() {
        const unlockCode = $`<p @click="${this.goToUpdateUnlock}" class="sub-modal-button hover-background"><span>Unlock Code</span> <i class="fa-solid fa-arrow-right hover-font float-right"></i></p>`;
        const destroyCode = $`<p @click="${this.goToUpdateDestroy}" class="sub-modal-button hover-background"><span>Destroy Code</span> <i class="fa-solid fa-arrow-right hover-font float-right"></i></p>`;

        return $`<p class="create-group-headline">Update</p>${unlockCode}${destroyCode}`;
    }

    renderSetup() {
        const headline = $`<div class="setup-unlock-container"><p class="create-group-headline">Setup</p><small>${LANG.UNLOCKSETUPTEXT}</small></div>`;
        const unlock = $`<form class="setup-unlock-container"><p>Unlock Code</p><small>new password</small><input type="password" autocomplete="off" maxlength="40"><small>re-type</small><input type="password" autocomplete="off" maxlength="40"></form>`;
        const destroy = $`<form><p>Destroy Code</p><small>new destory code</small><input type="password" autocomplete="off" maxlength="40"><small>re-type</small><input type="password" autocomplete="off" maxlength="40" @keydown="${(
            e
        ) => this.onKeyPress(e)}"></form>`;

        return $`${headline}${unlock}${destroy}<button @click="${this.setup}" class="full-width">Setup</button>`;
    }

    firstUpdated() {
        this.#modalContent = this.querySelector('.modal-content');
    }

    render() {
        const content = this.ME.codes
            ? this.renderUpdate()
            : this.renderSetup();
        const sideContent = this.ME.codes ? this.renderUpdateSide() : '';

        return super.render(content, sideContent);
    }
}

customElements.define('codes-modal-window', Codes);

class Lock extends Modal {
    static properties = {
        ME: { type: Object },
    };

    #done = function () {};
    #unlockInput = {};

    constructor() {
        super(false);
        this.ME = {};
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    enterUnlockCode(e) {
        if (e.keyCode === 13) {
            // enter
            const unlockEvent = new CustomEvent('unlock', {
                detail: {
                    code: this.#unlockInput.value,
                    done: () => {
                        domCache.toast.notification = {
                            type: 'success',
                            text: 'be8 unlocked',
                        };

                        domCache.toast.open();
                        this.#done();
                        return this.close();
                    },
                    error: () => {
                        domCache.toast.notification = {
                            type: 'error',
                            text: 'wrong unlock code',
                        };

                        return domCache.toast.open();
                    },
                },
            });

            return domCache.app.dispatchEvent(unlockEvent);
        }
    }

    open(done = function () {}) {
        if (this.ME.codes) {
            this.#done = done;
            super.open();
            requestAnimationFrame(() => this.#unlockInput.focus());
            return true;
        }

        done();
        return false;
    }

    firstUpdated() {
        this.#unlockInput = this.querySelector('input');
    }

    render() {
        const content = $`<p class="create-group-headline">Unlock be8</p><small>Enter your unlock code to use be8</small><input type="password" autocomplete="off" @keydown="${(
            e
        ) => this.enterUnlockCode(e)}" maxlength="40">`;
        return super.render(content);
    }
}

customElements.define('lock-modal-window', Lock);

const userIcons = Object.freeze({
    system: 'comment-dots',
    user: 'user',
    group: 'users-rectangle',
    channel: 'object-ungroup',
});
const groupMemberIcons = Object.freeze({
    admin: 'screwdriver-wrench',
    moderator: 'screwdriver',
    specialUser: 'user-graduate',
    user: 'user',
});
const memberIcons = Object.freeze([
    '🦖',
    '🦕',
    '🐙',
    '🦑',
    '🦐',
    '🦞',
    '🦀',
    '🐡',
    '🐠',
    '🐟',
    '🐬',
    '🐳',
    '🐋',
    '🦈',
    '🐊',
    '🐶',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🦊',
    '🐻',
    '🐼',
    '🐨',
    '🐯',
    '🦁',
    '🐮',
    '🐷',
    '🐽',
    '🐸',
    '🐵',
    '🐔',
    '🐧',
    '🐦',
    '🐤',
    '🐣',
    '🦆',
    '🦅',
    '🦉',
    '🦇',
    '🐺',
    '🐗',
    '🐴',
    '🦄',
    '🐝',
    '🐛',
    '🦋',
    '🐌',
    '🐞',
    '🐜',
    '🦟',
    '🦗',
    '🕷',
    '🦂',
    '🐢',
    '🐍',
    '🦎',
    '🐅',
    '🐆',
    '🦓',
    '🦍',
    '🐘',
    '🦛',
    '🦏',
    '🐪',
    '🐫',
    '🦒',
    '🦘',
    '🐃',
    '🐂',
    '🐄',
    '🐎',
    '🐖',
    '🐏',
    '🐑',
    '🦙',
    '🐐',
    '🦌',
    '🐕',
    '🐩',
    '🐈',
    '🐓',
    '🦃',
    '🦚',
    '🦜',
    '🦢',
    '🕊',
    '🐇',
    '🦝',
    '🦡',
    '🐁',
    '🐀',
    '🐿',
    '🦔',
]);

class Usermodal extends Modal {
    static properties = {
        conversationPartner: { type: Object },
    };

    constructor() {
        super();
        this.conversationPartner = LANG;
    }

    render() {
        const dateTime = sanitizeTime(this.conversationPartner.expire);
        const icon = $`<i class="fa-solid fa-${userIcons.user}"></i>`;
        const hl = $`<p class="create-group-headline">${icon} ${this.conversationPartner.nickname}</p>`;
        const id = $`<p><span>ID:</span> <span>${this.conversationPartner.id}</span></p>`;
        const nickname = $`<p><span>Nickname:</span> <span>${this.conversationPartner.nickname}</span></p>`;
        const status = $`<p><span>Status:</span> <span>"${this.conversationPartner.userStatus}"</span></p>`;
        const expire = this.conversationPartner.endless
            ? ''
            : $`<p><span>Valid Account:</span> <span>${dateTime}</span></p>`;
        const endlessIcon = this.conversationPartner.endless
            ? $`<i class="fa-solid fa-check danger-color"></i>`
            : $`<i class="fa-solid fa-times"></i>`;
        const endless = $`<p><span>Endless Account: </span>${endlessIcon}</p>`;
        const content = $`${hl}${id}${nickname}${expire}${endless}${status}`;

        return super.render(content);
    }
}

customElements.define('user-modal-window', Usermodal);

class SysUsermodal extends Modal {
    static properties = {
        conversationPartner: { type: Object },
    };

    constructor() {
        super();
        this.conversationPartner = LANG;
    }

    render() {
        const icon = $`<i class="fa-solid fa-${userIcons.system}"></i>`;
        const hl = $`<p class="create-group-headline">${icon} ${this.conversationPartner.nickname}</p>`;
        const content = $`${hl}<p>This is a system user you can't send messages to the system user.</p>`;

        return super.render(content);
    }
}

customElements.define('sysuser-modal-window', SysUsermodal);

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const { H: l } = L,
    c$1 = () => document.createComment(''),
    r = (o, t, i) => {
        var n;
        const d = o._$AA.parentNode,
            v = void 0 === t ? o._$AB : t._$AA;
        if (void 0 === i) {
            const t = d.insertBefore(c$1(), v),
                n = d.insertBefore(c$1(), v);
            i = new l(t, n, o, o.options);
        } else {
            const l = i._$AB.nextSibling,
                t = i._$AM,
                e = t !== o;
            if (e) {
                let l;
                null === (n = i._$AQ) || void 0 === n || n.call(i, o),
                    (i._$AM = o),
                    void 0 !== i._$AP && (l = o._$AU) !== t._$AU && i._$AP(l);
            }
            if (l !== v || e) {
                let o = i._$AA;
                for (; o !== l; ) {
                    const l = o.nextSibling;
                    d.insertBefore(o, v), (o = l);
                }
            }
        }
        return i;
    },
    u$1 = (o, l, t = o) => (o._$AI(l, t), o),
    f = {},
    s = (o, l = f) => (o._$AH = l),
    m = (o) => o._$AH,
    p = (o) => {
        var l;
        null === (l = o._$AP) || void 0 === l || l.call(o, !1, !0);
        let t = o._$AA;
        const i = o._$AB.nextSibling;
        for (; t !== i; ) {
            const o = t.nextSibling;
            t.remove(), (t = o);
        }
    };

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u = (e, s, t) => {
        const r = new Map();
        for (let l = s; l <= t; l++) r.set(e[l], l);
        return r;
    },
    c = e$1(
        class extends i {
            constructor(e) {
                if ((super(e), e.type !== t.CHILD))
                    throw Error(
                        'repeat() can only be used in text expressions'
                    );
            }
            ht(e, s, t) {
                let r;
                void 0 === t ? (t = s) : void 0 !== s && (r = s);
                const l = [],
                    o = [];
                let i = 0;
                for (const s of e)
                    (l[i] = r ? r(s, i) : i), (o[i] = t(s, i)), i++;
                return { values: o, keys: l };
            }
            render(e, s, t) {
                return this.ht(e, s, t).values;
            }
            update(s$1, [t, r$1, c]) {
                var d;
                const a = m(s$1),
                    { values: p$1, keys: v } = this.ht(t, r$1, c);
                if (!Array.isArray(a)) return (this.ut = v), p$1;
                const h =
                        null !== (d = this.ut) && void 0 !== d
                            ? d
                            : (this.ut = []),
                    m$1 = [];
                let y,
                    x,
                    j = 0,
                    k = a.length - 1,
                    w = 0,
                    A = p$1.length - 1;
                for (; j <= k && w <= A; )
                    if (null === a[j]) j++;
                    else if (null === a[k]) k--;
                    else if (h[j] === v[w])
                        (m$1[w] = u$1(a[j], p$1[w])), j++, w++;
                    else if (h[k] === v[A])
                        (m$1[A] = u$1(a[k], p$1[A])), k--, A--;
                    else if (h[j] === v[A])
                        (m$1[A] = u$1(a[j], p$1[A])),
                            r(s$1, m$1[A + 1], a[j]),
                            j++,
                            A--;
                    else if (h[k] === v[w])
                        (m$1[w] = u$1(a[k], p$1[w])),
                            r(s$1, a[j], a[k]),
                            k--,
                            w++;
                    else if (
                        (void 0 === y && ((y = u(v, w, A)), (x = u(h, j, k))),
                        y.has(h[j]))
                    )
                        if (y.has(h[k])) {
                            const e = x.get(v[w]),
                                t = void 0 !== e ? a[e] : null;
                            if (null === t) {
                                const e = r(s$1, a[j]);
                                u$1(e, p$1[w]), (m$1[w] = e);
                            } else
                                (m$1[w] = u$1(t, p$1[w])),
                                    r(s$1, a[j], t),
                                    (a[e] = null);
                            w++;
                        } else p(a[k]), k--;
                    else p(a[j]), j++;
                for (; w <= A; ) {
                    const e = r(s$1, m$1[A + 1]);
                    u$1(e, p$1[w]), (m$1[w++] = e);
                }
                for (; j <= k; ) {
                    const e = a[j++];
                    null !== e && p(e);
                }
                return (this.ut = v), s(s$1, m$1), b;
            }
        }
    );

class GroupUsermodal extends Modal {
    static properties = {
        ME: { type: Object },
        state: { type: String },
        conversationPartner: { type: Object },
        members: { type: Array },
        inviteUrl: { type: String },
    };

    #inviteGroupSide = {};
    #addUserSide = {};
    #leaveGroupSide = {};
    #modalContent = {};
    #addMemberId = {};

    constructor() {
        super();
        this.conversationPartner = LANG;
        this.members = [];
    }

    #addUser() {
        this.state = 'addUser';
        animateMainToSide(
            this.#modalContent,
            this.#addUserSide,
            this.#addMemberId
        );
    }

    #inviteUser() {
        const event = new CustomEvent('inviteGenerated', {
            detail: {
                sentInviteLink: true,
                type: 'group',
            },
        });
        navigator.clipboard.writeText(this.inviteUrl).then(() => {});

        this.state = 'invite';
        animateMainToSide(this.#modalContent, this.#inviteGroupSide);
        return domCache.app.dispatchEvent(event);
    }

    #leaveGroup() {
        this.state = 'leaveGroup';
        animateMainToSide(this.#modalContent, this.#leaveGroupSide);
    }

    open() {
        const qr = this.querySelector('.qr');

        if (qr) {
            qr.innerHTML = '';
            new QRCode(qr, { text: this.inviteUrl });
        }

        return super.open();
    }

    close() {
        super.close();
        this.#clickOnBackToMain();
    }

    #clickOnBackToMain() {
        if (this.state === 'invite') {
            animateSideToMain(this.#modalContent, this.#inviteGroupSide);
        }
        if (this.state === 'leaveGroup') {
            animateSideToMain(this.#modalContent, this.#leaveGroupSide);
        }
        if (this.state === 'addUser') {
            animateSideToMain(this.#modalContent, this.#addUserSide);
        }

        this.state = 'main';
    }

    firstUpdated() {
        this.#inviteGroupSide = this.querySelector('.invite-group-modal');
        this.#addUserSide = this.querySelector('.adduser-group-modal');
        this.#leaveGroupSide = this.querySelector('.leave-group-modal');
        this.#modalContent = this.querySelector('.modal-content');
        this.#addMemberId = this.querySelector('.adduser-group-modal input');
    }

    #sendAddGroupUser(id, input) {
        const event = new CustomEvent('addGroupMember', {
            bubbles: false,
            detail: {
                ...this.conversationPartner,
                id,
                done: () => {
                    domCache.toast.notification = {
                        type: 'success',
                        text: 'You added ' + id + ' to your group',
                    };

                    input.value = '';

                    domCache.toast.open();
                    return this.close();
                },
                warning: (reason) => {
                    domCache.toast.notification = {
                        type: 'warning',
                        text: LANG[reason],
                    };

                    return domCache.toast.open();
                },
            },
        });

        return domCache.app.dispatchEvent(event);
    }

    enterBe8Id(e) {
        if (!isKeyDownNumber(e)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.key === 'Enter') {
            const id = e.target.value.trim();

            if (id.length === 0) {
                domCache.toast.notification = {
                    type: 'error',
                    text: 'Enter a be8 id',
                };

                return domCache.toast.open();
            }
            if (id === this.ME.id) {
                domCache.toast.notification = {
                    type: 'error',
                    text: 'You can not chat with yourself.',
                };

                return domCache.toast.open();
            }

            return this.#sendAddGroupUser(id, e.target);
        }
    }

    #clickOnLeaveGroup() {
        const event = new CustomEvent('leaveGroup', {
            bubbles: false,
            detail: {
                ...this.conversationPartner,
                ...this.Me,
                done: () => {
                    return this.close();
                },
            },
        });

        return domCache.app.dispatchEvent(event);
    }

    #renderGroupSettings(amIAdmin) {
        const isPrivate = this.conversationPartner.groupType === 'private';
        const invite = isPrivate
            ? ''
            : $`<div class="sub-modal-button hover-background" @click="${
                  this.#inviteUser
              }"><i class="fa-solid fa-person-circle-plus"></i> Invite User <i class="fa-solid fa-arrow-right float-right"></i></div>`;
        const addUser =
            amIAdmin || !isPrivate
                ? $`<div @click="${
                      this.#addUser
                  }" class="sub-modal-button hover-background"><i class="fa-solid fa-plus"></i> Add Member <i class="fa-solid fa-arrow-right float-right"></i></div>`
                : '';

        return $`<div class="group-actions">${addUser}${invite}<div class="sub-modal-button hover-background" @click="${
            this.#leaveGroup
        }"><i class="fa-solid fa-person-through-window"></i> Leave Group <i class="fa-solid fa-arrow-right float-right"></i></div></div>`;
    }

    #renderSideGroup(amIAdmin) {
        const isPrivate = this.conversationPartner.groupType === 'private';
        const url = generateSafeLink('group', this.conversationPartner.groupID);
        const backToMain = $`<i @click="${
            this.#clickOnBackToMain
        }" class="fa-solid fa-arrow-left float-left hover-font"></i>`;
        const addUser = $`<div class="adduser-group-modal hide"><p class="create-group-headline">${backToMain} Add new Member</p><small>Enter a valid be8 id.</small><input @keydown="${(
            e
        ) => this.enterBe8Id(e)}" type="text"></div>`;
        const leaveText = amIAdmin
            ? LANG.LEAVEGROUPADMIN
            : LANG.LEAVEGROUPMEMBER;
        const leaveGroup = $`<div class="leave-group-modal hide"><p class="create-group-headline">${backToMain} Leave Group</p><small>${leaveText}</small><div class="leave-group-settings"><button @click="${
            this.#clickOnLeaveGroup
        }" class="danger-background">Yes</button><button @click="${
            this.close
        }" class="hover-background">No</button></div></div>`;
        const invite = isPrivate
            ? ''
            : $`<div class="invite-group-modal hide"><p class="create-group-headline">${backToMain} Invite Friends to your Group</p><p>${o(
                  LANG.INVITELINK.replaceAll('{{link}}', url)
              )}</p><br><div class="qr"></div><br></div>`;

        this.inviteUrl = url;

        return $`${addUser}${invite}${leaveGroup}`;
    }

    #clickOnKick(e) {
        const accID = e.target.getAttribute('data-id');
        const event = new CustomEvent('kickMemberFromGroup', {
            bubbles: false,
            detail: {
                ...this.conversationPartner,
                accID,
                done: () => {
                    domCache.toast.notification = {
                        type: 'success',
                        text:
                            'You kicked ' + accID + ' someone from your group',
                    };

                    return domCache.toast.open();
                },
            },
        });

        return domCache.app.dispatchEvent(event);
    }

    render() {
        const color =
            this.conversationPartner.groupType === 'public'
                ? 'orange-background'
                : 'danger-background';
        const hl = $`<p class="create-group-headline"><small class="group-type-badge ${color} float-left">${this.conversationPartner.groupType}</small> ${this.conversationPartner.nickname}</p>`;
        const amIAdmin = this.ME.id === this.conversationPartner.admin;
        const settings = this.#renderGroupSettings(amIAdmin);
        const members = c(
            this.members,
            (members) => members.id,
            ({ nickname, id, expire, endless, type }) => {
                const isSystem = type === 'system';
                const endlessIcon =
                    endless || isSystem
                        ? $`<i class="fa-solid fa-check danger-color"></i>`
                        : '';
                const isMe = this.ME.id === id;
                const kick =
                    amIAdmin && !isMe
                        ? $`<span data-id="${id}" @click="${
                              this.#clickOnKick
                          }" class="float-right hover-font">kick</span>`
                        : '';
                const isUserAdmin = this.conversationPartner.admin === id;
                const icon = $`<i class="fa-solid fa-${
                    groupMemberIcons[isUserAdmin ? 'admin' : 'user']
                }"></i>`;

                return $`<div class="group-member hover-background">${icon}<p class="member-firstline">${nickname} ${endlessIcon}<span class="float-right">#${id}</span></p><p class="member-secondline">${sanitizeTime(
                    expire
                )}${kick}</p></div>`;
            }
        );
        const content = $`${hl}<div class="group-members">${members}</div>${settings}`;
        const sideContent = this.#renderSideGroup(amIAdmin);

        return super.render(content, sideContent);
    }
}

customElements.define('groupuser-modal-window', GroupUsermodal);

const SYSTEMMESSAGES = Object.freeze({
    WELCOME:
        'Welcome to Be8, your nickname is <i class="highlight-color">{{nickname}}</i>. Be8 is the first ever real privacy messenger. Everything is End-to-End encrypted, only your device knows your key! Everything gets deleted after 30 days even your account, but you can create as much accounts as you want. Your id is <i class="highlight-color">#{{id}}</i>. You can find your expire date on the top left. Have fun.',
    STARTCONVERSATION:
        'Start conversation with <i class="highlight-color">#{{conversationID}}</i>',
    CREATEDGROUP:
        'You created a new group with the id <i class="highlight-color">{{extra1}}</i> and name <i class="highlight-color">{{extra2}}</i>',
    ADDEDTOGROUP:
        '<i class="highlight-color">{{extra3}}</i> with id <i class="highlight-color">#{{extra1}}</i> added you to group {{extra2}}',
    ACCADDEDTOGROUP:
        '<i class="highlight-color">{{extra1}}</i> id <i class="highlight-color">#{{extra2}}</i> was added to the group.',
    ACCJOINEDGROUP:
        '<i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">{{extra1}}</i> joined {{threadID}}.',
    ACCDELETED:
        'Account <i class="highlight-color">#{{extra1}}</i> has been destroyed.',
    LEFTGROUP:
        'You left group <i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">#{{extra1}}</i>.',
    ACCLEFTGROUP:
        '<i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">#{{extra1}}</i> left <i class="highlight-color">{{threadID}}</i>.',
    KICKEDFROMGROUP:
        'You were kicked from group <i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">#{{extra1}}</i>',
    ACCKICKEDFROMGROUP:
        '<i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">#{{extra1}}</i> was kicked from <i class="highlight-color">{{threadID}}</i>.',
    GROUPDELETED:
        'Group <i class="highlight-color">{{extra2}}</i> with id <i class="highlight-color">#{{extra1}}</i> was deleted.',
});

// max 30 chars, yeah intendation like this is no allowed
// but in this case it helps to figure out how long your title is.
const SYSTEMTITLES = Object.freeze({
    WELCOME: 'Welcome to the Be8 messenger',
    STARTCONVERSATION: 'A new conversation started',
    CREATEDGROUP: 'You created a new group',
    ADDEDTOGROUP: 'You were added to the group',
    ACCADDEDTOGROUP: 'User was added to the group',
    ACCJOINEDGROUP: 'Acc joined group',
    ACCDELETED: 'Acc you know is destroyed',
    LEFTGROUP: 'An user left the group',
    KICKEDFROMGROUP: 'You were kicked from a group',
    ACCLEFTGROUP: 'Acc left group',
    ACCKICKEDFROMGROUP: 'User was kicked from group',
    GROUPDELETED: 'Group was deleted',
    SENTIMAGE: '🌆 You sent an image',
    RECEIVEDIMAGE: '🌆 You received an image',
});

const maxImageSize = 2097152; // 2mb

class Messages extends s$1 {
    static properties = {
        conversationPartner: { type: Object },
        messages: { type: Array },
        ME: { type: Object },
    };

    #inputActive = true;
    #userModal = document.querySelector('user-modal-window');
    #userGroupModal = document.querySelector('groupuser-modal-window');
    #userSysModal = document.querySelector('sysuser-modal-window');
    #messageInput = {};
    #uploadButton = {};

    constructor() {
        super();
        this.conversationPartner = {};
        this.messages = [];
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    // only triggerable via mobile
    clickOnBack() {
        domCache.navi.classList.remove('hide');
        domCache.menus.messagesMenu.classList.add('hide');
        domCache.header.classList.remove('hide');
        domCache.bottomNavi.classList.remove('hide');
        domCache.bottomNavi
            .querySelector('div')
            .classList.add('active-setting');
    }

    clickOnUser() {
        if (this.conversationPartner.type === 'user') {
            this.#userModal.conversationPartner = this.conversationPartner;
            this.#userModal.open();
        }
        if (this.conversationPartner.type === 'group') {
            this.#userGroupModal.conversationPartner = this.conversationPartner;
            this.#userGroupModal.open();
        }
        if (this.conversationPartner.type === 'system') {
            this.#userSysModal.conversationPartner = this.conversationPartner;
            this.#userSysModal.open();
        }
    }

    setActive({ type }) {
        const isSystem = type === 'system';

        this.#focus();
        this.setInput();

        if (isSystem) {
            if (!this.#uploadButton.classList.contains('disabled')) {
                this.#uploadButton.classList.add('disabled');
                this.#uploadButton.classList.remove('hover-font');
            }

            this.#messageInput.disabled = true;
        } else {
            if (this.#uploadButton.classList.contains('disabled')) {
                this.#uploadButton.classList.remove('disabled');
                this.#uploadButton.classList.add('hover-font');
            }

            this.#messageInput.disabled = false;
        }
    }

    setInput(text = '') {
        return (this.#messageInput.value = text);
    }

    #focus() {
        requestAnimationFrame(() => this.#messageInput.focus());
    }

    firstUpdated() {
        this.#messageInput = this.querySelector('.write-message-input');
        this.#uploadButton = document.querySelector('.fa-photo-film');
    }

    writeMessage(e) {
        if (e.key === 'Enter' && this.#inputActive) {
            const text = this.#messageInput.value.trim();
            const isGroup = !!this.conversationPartner.groupID;
            const receiver = this.conversationPartner.partner;
            const groupOptions = {
                groupID: this.conversationPartner.groupID,
            };
            const writeEvent = new CustomEvent('writeMessage', {
                bubbles: false,
                detail: {
                    text: this.#messageInput.value,
                    nickname: this.ME.nickname,
                    sender: this.ME.id,
                    receiver,
                    threadID: this.conversationPartner.threadID,
                    type: isGroup ? 'group' : 'user',
                    ...(isGroup ? groupOptions : {}),
                    messageType: 'text',
                    done: () => {
                        this.#inputActive = true;
                        this.#messageInput.value = ''; // to prevent double ^ insert after enter
                        return this.#focus();
                    },
                },
            });

            this.#inputActive = false;

            if (text.length === 0) {
                return;
            }

            return domCache.app.dispatchEvent(writeEvent);
        }
    }

    uploadMedia() {
        this.querySelector('[type="file"]').click();
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            const messages = this.querySelector('.messages');

            messages.scrollTop = messages.scrollHeight;
        });
    }

    #sendImage(content) {
        const isGroup = !!this.conversationPartner.groupID;
        const groupOptions = {
            groupID: this.conversationPartner.groupID,
        };
        const uploadEvent = new CustomEvent('uploadMedia', {
            bubbles: false,
            detail: {
                contentID: randomString(),
                contentType: 'image',
                content,
                isGroup,
                receiver: this.conversationPartner.partner,
                nickname: this.ME.nickname,
                sender: this.ME.id,
                threadID: this.conversationPartner.threadID,
                messageType: 'image',
                ...(isGroup ? groupOptions : {}),
                type: isGroup ? 'group' : 'user',
                done: () => {
                    this.#uploadButton.classList.add('fa-photo-film');
                    this.#uploadButton.classList.remove(
                        'disabled',
                        'fa-circle-notch',
                        'fa-spin'
                    );
                },
            },
        });

        return domCache.app.dispatchEvent(uploadEvent);
    }

    #generateImageBlob(file) {
        const reader = new FileReader();
        const imgTag = document.createElement('img');
        const url = URL.createObjectURL(file);

        reader.onload = () => {
            imgTag.src = url;

            imgTag.onload = () => {
                this.#sendImage(reader.result);
                return URL.revokeObjectURL(url);
            };
        };

        return reader.readAsDataURL(file);
    }

    insertImage(image) {
        const domImage = this.querySelector(
            `[data-contentid="${image.contentID}"]`
        );
        const spinner = domImage.previousSibling;

        if (!spinner) {
            return;
        }

        domImage.setAttribute('src', image.content);
        return domImage.parentNode.removeChild(spinner);
    }

    changeInputEvent({ target }) {
        const file = [...target.files][0];

        if (file.size >= maxImageSize) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Max allowed file size for images is 2mb. Please choose a smaller one.',
            };

            return domCache.toast.open();
        }

        this.#uploadButton.disabled = true;
        this.#uploadButton.classList.remove('fa-photo-film', 'disabled');
        this.#uploadButton.classList.add('fa-circle-notch', 'fa-spin');

        this.#generateImageBlob(file);
        target.setAttribute('value', ''); // allow double upload of the same picture
        target.value = null;
    }

    renderWriteContainer() {
        return $`<div class="write-container"><input @keydown="${this.writeMessage}" class="write-message-input" type="text" maxlength="1000"><div><i @click="${this.uploadMedia}" class="fa-solid fa-photo-film hover-font"></i><input class="hide" @change="${this.changeInputEvent}" type="file" accept="image/png, image/gif, image/jpeg"></div></div>`;
    }

    renderConversationPartner() {
        const check = this.conversationPartner.endless
            ? $`<i class="fa-solid fa-check"></i>`
            : '';
        const icon = $`<i class="fa-solid fa-${
            userIcons[this.conversationPartner.type]
        }"></i>`;
        const idIndicator =
            this.conversationPartner.type !== 'system'
                ? $`<span>#${
                      this.conversationPartner.id ||
                      this.conversationPartner.groupID
                  }</span>`
                : '';
        const name = $`<p @click="${this.clickOnUser}" class="hover-font">${icon} ${this.conversationPartner.nickname} ${idIndicator}</p>`;
        const back = $`<i @click="${
            this.clickOnBack
        }" class="fa-solid fa-arrow-left ${
            isPhone ? '' : 'shrink-to-zero'
        }"></i>`;
        const user = $`<div class="conversation-partner-user">${name}${check}</div>`;

        return $`<div class="conversation-partner">${back}${user}</div>`;
    }

    #renderTextWithURL(text, urls, timeIndicator) {
        let lastText = text;
        const parts = urls.flatMap(function (url) {
            const urlHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            const [firstText, ...rest] = lastText.split(url);

            lastText = rest.join(url);

            return [firstText, o(urlHTML)];
        });

        parts.push(lastText);

        return $`<p class="message-text">${parts} ${timeIndicator}</p>`;
    }

    #renderTextContent({ text }, timeIndicator) {
        const urls = findUrls(text);

        if (urls.length === 0) {
            return $`<p class="message-text">${text} ${timeIndicator}</p>`;
        }

        return this.#renderTextWithURL(text, urls, timeIndicator);
    }

    #renderMessageContent(message, timeIndicator) {
        if (message.messageType === 'image') {
            return $`<i class="fa-solid fa-spin fa-circle-notch"></i><img data-contentid="${message.contentID}" src=""><p>${timeIndicator}</p>`;
        }

        return this.#renderTextContent(message, timeIndicator);
    }

    #renderStatusIndicator(amIsender, status, isGroup) {
        if (!amIsender) {
            return '';
        }
        if (!isGroup && status.length === 1) {
            return $`  <i class="fa-solid fa-check read-check"></i><i class="fa-solid fa-check read-check"></i>`;
        }
        if (
            isGroup &&
            this.#userGroupModal.members.every(
                (m) => status.includes(m.id) || m.id === this.ME.id
            )
        ) {
            return $`  <i class="fa-solid fa-check read-check"></i><i class="fa-solid fa-check read-check"></i>`;
        }

        return $`  <i class="fa-solid fa-check sent-check"></i>`;
    }

    #getNicknameLine(message) {
        const { nickname, id, memberIcon, color } =
            this.#userGroupModal.members.find(
                (member) => member.id === message.sender
            );
        return $`<p class="group-color-${color} message-top-line"><span>${memberIcon} ${nickname}</span>  <span>#${id}</span></p>`;
    }

    #renderRemoveMessage({ sender }) {
        const amIsender = sender === this.ME.id;
        return $`<div class="message-container"><div class="message ${
            amIsender ? 'sent-message' : 'received-message'
        }">${LANG.MESSAGEREMOVED}</div></div>`;
    }

    #renderUserMessage(message, isGroup) {
        const { messageID, nickname, sender, status, ts } = message;
        const amIsender = sender === this.ME.id;
        const firstLine =
            isGroup && !amIsender ? this.#getNicknameLine(message) : '';
        const statusIndicator = this.#renderStatusIndicator(
            amIsender,
            status,
            isGroup
        );
        const dateTime = new Date(ts);
        const time = dateTime.toLocaleTimeString();
        const thirdLine = $`<small class="message-bottom-line float-right unselectable">${time}${statusIndicator}</small>`;
        const secondLine = this.#renderMessageContent(message, thirdLine);

        return $`<div alt="${nickname}" data-messageid="${messageID}" class="message-container"><div class="message ${
            amIsender ? 'sent-message' : 'received-message'
        }">${firstLine}${secondLine}</div></div>`;
    }

    #renderSysMessage(message) {
        const dateTime = new Date(message.ts);
        const time = dateTime.toLocaleTimeString();
        const secondLine = SYSTEMMESSAGES[message.text]
            .replace('{{extra1}}', message.extra1)
            .replace('{{extra2}}', message.extra2)
            .replace('{{extra3}}', message.extra3)
            .replace('{{id}}', this.ME.id)
            .replace('{{threadID}}', message.threadID)
            .replace('{{nickname}}', this.ME.nickname)
            .replace('{{conversationID}}', this.conversationPartner.partner);
        const thirdLine = $`<p><small class="float-right unselectable">${time}</small></p>`;

        return $`<div alt="${message.nickname}" data-messageid="${
            message.messageID
        }" class="message-container system-message"><div class="message"><p>${o(
            secondLine
        )}</p>${thirdLine}</div></div>`;
    }

    render() {
        const isGroup = this.conversationPartner.type === 'group';
        const messages = c(
            this.messages,
            (message) => message.messageID,
            (message) => {
                const isSysMessage = message.messageType === 'system';

                if (message.messageType === 'removed') {
                    return this.#renderRemoveMessage(message);
                }
                if (isSysMessage) {
                    return this.#renderSysMessage(message);
                }

                return this.#renderUserMessage(message, isGroup);
            }
        );
        const messagesContainer = $`<div class="messages">${messages}</div>`;

        return $`${this.renderConversationPartner()}${messagesContainer}${this.renderWriteContainer()}`;
    }
}

customElements.define('messages-menu', Messages);

const tokenLength = 32;

class User extends s$1 {
    static properties = {
        ME: { type: Object },
    };

    #statusTimer = {};
    #tokenInput = {};

    constructor() {
        super();
        this.ME = ME;
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    clickOnEndlessToken() {
        const token = this.#tokenInput.value.trim();
        const tokenEvent = new CustomEvent('setToken', {
            bubbles: false,
            detail: {
                ...this.ME,
                token,
                wrongToken: () => {
                    domCache.toast.notification = {
                        type: 'error',
                        text: 'Your token is invalid',
                    };

                    return domCache.toast.open();
                },
                tokenInUse: () => {
                    domCache.toast.notification = {
                        type: 'error',
                        text: 'This token is already in use',
                    };

                    return domCache.toast.open();
                },
                success: ({ tokenType, validTime }) => {
                    const time =
                        tokenType === 'endless'
                            ? tokenType
                            : `${validTime / 1000 / 60 / 60 / 24} days`;
                    domCache.toast.notification = {
                        type: 'success',
                        text: `Your acc is upgraded to ${time}`,
                    };

                    this.#tokenInput.value = '';
                    domCache.toast.open();
                },
            },
        });

        if (token.length < tokenLength) {
            domCache.toast.notification = {
                type: 'error',
                text: 'Your token is too short',
            };

            return domCache.toast.open();
        }

        return domCache.app.dispatchEvent(tokenEvent);
    }

    #sendStatusChangeEvent(userStatus) {
        const statusEvent = new CustomEvent('setUserStatus', {
            bubbles: false,
            detail: {
                userStatus,
            },
        });

        return domCache.app.dispatchEvent(statusEvent);
    }

    keyDownStatus(event) {
        clearTimeout(this.#statusTimer);

        this.#statusTimer = setTimeout(() => {
            const status = event.target.value.trim();

            if (this.ME.userStatus === status) {
                return clearTimeout(this.#statusTimer);
            }

            this.ME = {
                ...this.ME,
                status,
            };

            this.#sendStatusChangeEvent(status);
        }, 400);
    }

    firstUpdated() {
        this.#tokenInput = this.querySelector('input');
    }

    render() {
        const expireDate = sanitizeTime(this.ME.expire);
        const endlessIcon = this.ME.endless
            ? $`<i class="fa-solid fa-check danger-color"></i>`
            : $`<i class="fa-solid fa-times"></i>`;
        const validLine = this.ME.endless
            ? ''
            : $`<p>Valid until: <i>${expireDate}</i></p>`;
        const creds = $`<div class="settings-container"><p>ID: <i>#${this.ME.id}</i></p><p>Nickname: <i>${this.ME.nickname}</i></p>${validLine}<p>Endless Account: ${endlessIcon}</p></div>`;
        const status = $`<div class="settings-container"><p>Status</p><textarea @keydown="${(
            e
        ) => this.keyDownStatus(e)}" maxlength="280">${
            this.ME.userStatus
        }</textarea></div>`;
        const endlessToken = this.ME.endless
            ? ''
            : $`<div class="settings-container"><p>Token</p><input type="text" maxlength="${tokenLength}"><button class="hover-green" @click="${this.clickOnEndlessToken}">Check</button></div>`;

        return $`<h1>User Menu</h1>${creds}${status}${endlessToken}`;
    }
}

customElements.define('user-menu', User);

class SettingsMenu extends s$1 {
    static properties = {
        ME: { type: Object },
    };

    #nicknameTimer = {};
    #codesModal = document.querySelector('codes-modal-window');

    constructor() {
        super();
        this.ME = ME;
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    clickOnCodes() {
        return this.#codesModal.open();
    }

    #sendChangeNichnameEvent(newNickname, oldNickname) {
        const nickName = new CustomEvent('changeNickName', {
            bubbles: false,
            detail: {
                oldNickname,
                newNickname,
            },
        });

        return domCache.app.dispatchEvent(nickName);
    }

    changeName(event) {
        clearTimeout(this.#nicknameTimer);

        this.#nicknameTimer = setTimeout(() => {
            const input = event.target;
            const newNickname = input.value;
            const oldNickname = this.ME.nickname;

            this.ME = {
                ...this.ME,
                nickname: newNickname,
            };

            this.#sendChangeNichnameEvent(newNickname, oldNickname);
        }, 900);
    }

    render() {
        const nickname = $`<div class="settings-container"><p>Nickname is ${this.ME.nickname}</p><input @input="${this.changeName}" type="text" value="${this.ME.nickname}" maxlength="20"></div>`;
        const codes = $`<div class="settings-container"><p>Destroy and Unlock</p><button @click="${
            this.clickOnCodes
        }" class="danger-background">${
            this.ME.codes ? 'Update' : 'Setup'
        }</button></div>`;

        return $`<h1>Settings</h1>${nickname}${codes}`;
    }
}

customElements.define('settings-menu', SettingsMenu);

const maxThreadTextLength = 23;

function generateSanText(text, messageType, isSystem) {
    if (isSystem) {
        return SYSTEMTITLES[text];
    }
    if (messageType === 'system') {
        return SYSTEMTITLES[text];
    }
    if (text.length <= maxThreadTextLength) {
        return text;
    }

    return text.substring(0, maxThreadTextLength) + '…';
}

function renderThread({
    endless,
    nickname,
    partner,
    text,
    ts,
    type,
    messageType,
    status,
}) {
    const isSystem = type === 'system';
    const dateTime = humanReadAbleLastTime(ts);
    const icon = $`<i class="fa-solid fa-${userIcons[type]} thread-avatar"></i>`;
    const endlessIcon =
        endless || isSystem
            ? $`<i class="fa-solid fa-check danger-color"></i>`
            : '';
    const senderID = isSystem
        ? ''
        : $`<span class="float-right">#${partner}<span></span></span>`;
    const sanText = generateSanText(text, messageType, isSystem);
    const readIndicator = $`<span class="thread-read-indicator${
        status === 'read' ? ' shrink-to-zero' : ''
    }"></span>`;

    return $`<div partner="${partner}" type="${type}" class="thread hover-background">${readIndicator}${icon}<div><p>${nickname}  ${endlessIcon}${senderID}</p><p>${sanText} <span class="float-right unselectable">${dateTime}</span></p></div></div>`;
}

class Threads extends s$1 {
    static properties = {
        threads: { type: Array },
    };

    #bootStraped = false;

    constructor() {
        super();
        this.threads = [];
        this.addEventListener('click', (e) => this.clickOnThreads(e));
    }

    #setActiveThread(active) {
        if (isDesktop) {
            const oldActive = this.querySelector('.active-thread');

            oldActive?.classList.remove('active-thread');
            active?.classList.add('active-thread');
        }
    }

    #removeThreadReadIndicator(parent) {
        const readIndicator = parent.querySelector('.thread-read-indicator');

        if (!readIndicator.classList.contains('shrink-to-zero')) {
            readIndicator.classList.add('shrink-to-zero');
        }
    }

    clickOnThreads(e) {
        const parent = e.target.expire ? e.target : e.target.closest('.thread');
        const partner = parent.getAttribute('partner');
        const thread = this.threads.find((t) => t.partner === partner);
        const threadEvent = new CustomEvent('threadSelect', {
            bubbles: false,
            detail: {
                ...thread,
            },
        });

        if (isPhone) {
            domCache.navi.classList.add('hide');
            domCache.menus.messagesMenu.classList.remove('hide');
            domCache.header.classList.add('hide');
            domCache.bottomNavi.classList.add('hide');
        }
        if (isDesktop) {
            domCache.app.clickOnChat(e);
            domCache.bottomNavi
                .querySelector('div')
                .classList.add('active-setting');
        }

        domCache.menus.messagesMenu.messages = [];
        domCache.menus.messagesMenu.conversationPartner = thread;

        this.#removeThreadReadIndicator(parent);
        this.#setActiveThread(parent);
        domCache.menus.messagesMenu.setActive(thread);
        return domCache.app.dispatchEvent(threadEvent);
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    bootStrap() {
        requestAnimationFrame(() => {
            const firstThread = this.querySelector('.thread');

            if (!this.#bootStraped && firstThread && isDesktop) {
                firstThread.click();
                this.#bootStraped = true;
            }
        });
    }

    render() {
        return c(this.threads, (thread) => thread.id, renderThread);
    }
}

customElements.define('threads-menu', Threads);

function isActiveMenu(div) {
    return div.classList.contains('active-setting');
}

function removeActiveMenu(container) {
    const user = container.querySelector('header i.fa-circle-user');
    const divs = [
        ...container.querySelectorAll('.bottom-navi div.active-setting'),
    ];

    divs.forEach((div) => div.classList.remove('active-setting'));
    user.classList.remove('active-setting');
}

class AppLayout extends s$1 {
    static properties = {
        ME: { type: Object },
    };

    #menus = {
        settingsMenu: {},
        messagesMenu: {},
        userMenu: {},
    };
    #threads = {};
    #userGroupModal = document.querySelector('groupuser-modal-window');
    #modal = document.querySelector('modal-window');
    #inviteModal = document.querySelector('invite-modal-window');
    #panicModal = document.querySelector('panic-modal-window');
    #converModal = document.querySelector('conversation-modal-window');
    #lockModal = document.querySelector('lock-modal-window');
    #codesModal = document.querySelector('codes-modal-window');

    set ME(val) {
        Object.values(this.#menus).forEach(function (menu) {
            menu.ME = val;
        });

        this.#userGroupModal.ME = val;
        this.#codesModal.ME = val;
        this.#lockModal.ME = val;
        this.#panicModal.ME = val;
        this.#inviteModal.ME = val;
        this.#converModal.ME = val;
        this.requestUpdate('ME', val);
    }

    constructor() {
        super();
        this.ME = ME;
    }

    createRenderRoot() {
        return this; // prevents creating a shadow root
    }

    clickOnChat(e) {
        const div = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;

        if (isActiveMenu(div)) {
            return;
        }

        this.setActiveMenu('messagesMenu');
        removeActiveMenu(this);
    }

    clickOnUser({ target }) {
        if (isActiveMenu(target)) {
            return;
        }

        this.setActiveMenu('userMenu');
        removeActiveMenu(this);
        target.classList.add('active-setting');
    }

    clickOnSettings(e) {
        const div = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;

        if (isActiveMenu(div)) {
            return;
        }

        this.setActiveMenu('settingsMenu');
        removeActiveMenu(this);
        div.classList.add('active-setting');
    }

    setActiveMenu(menu) {
        Object.values(this.#menus).forEach(function (menu) {
            if (!menu.classList.contains('hide')) {
                menu.classList.add('hide');
            }
        });

        if (isPhone && menu !== 'messagesMenu') {
            domCache.navi.classList.add('hide');
            this.querySelector('main').classList.add(
                'settings-mobile-menu-active'
            );
        }
        if (isPhone && menu === 'messagesMenu') {
            domCache.navi.classList.remove('hide');
            this.querySelector('main').classList.remove(
                'settings-mobile-menu-active'
            );
            return;
        }
        if (this.#menus[menu] && this.#menus[menu].classList.contains('hide')) {
            return this.#menus[menu].classList.remove('hide');
        }
    }

    clickOnNewConv() {
        return this.#converModal.open();
    }

    clickOnInvite() {
        return this.#inviteModal.open('join');
    }

    clickOnPanic() {
        return this.#panicModal.open();
    }

    openWelcomeWindow({ id, nickname }) {
        return this.#modal.setAndOpen({
            HTML: `<h1>Welcome to Be8</h1><p>your new ID is <i class="highlight-color">#${id}</i>, your nickname is <i class="highlight-color">${nickname}</i>. Everything gets deleted after 30 Days you can create as many accs as you want.</p>`,
        });
    }

    firstUpdated() {
        super.connectedCallback();

        const menus = {
            messagesMenu: this.querySelector('messages-menu'),
            settingsMenu: this.querySelector('settings-menu'),
            userMenu: this.querySelector('user-menu'),
        };

        domCache.app = this;
        domCache.menus = menus;
        domCache.threads = this.querySelector('threads-menu');
        domCache.settings = this.querySelector('settings-menu');
        domCache.user = this.querySelector('user-menu');
        domCache.navi = this.querySelector('nav');
        domCache.header = this.querySelector('header');
        domCache.bottomNavi = this.querySelector('.bottom-navi');
        domCache.toast = document.querySelector('toast-notification');

        this.#menus = menus;
        this.#threads = this.querySelector('threads-menu');

        requestAnimationFrame(function () {
            if (isPhone) {
                return;
            }

            menus.messagesMenu.focus();
        });
    }

    async openLockModal(done) {
        return this.#lockModal.open(done);
    }

    setGroupMember({ members, valid }) {
        if (!valid) {
            return;
        }

        this.#userGroupModal.members = members.map(function (member, i) {
            member.memberIcon = memberIcons[i <= 16 ? i : i - 16];
            member.color = i + 1;

            return member;
        });
    }

    getConversationPartner() {
        return this.#menus.messagesMenu.conversationPartner;
    }

    insertImage(image) {
        return this.#menus.messagesMenu.insertImage(image);
    }

    setMessages(messages) {
        this.#menus.messagesMenu.messages = messages.filter((m) => m.valid);
        this.#menus.messagesMenu.scrollToBottom();
    }

    setThreads(threads) {
        this.#threads.threads = threads;
        this.#threads.bootStrap();
    }

    clickOnThread({ partner }) {
        this.#threads.querySelector(`[partner="${partner}"]`)?.click();
    }

    getConversationPartners() {
        return this.#threads.threads
            .map((t) => t.partner)
            .filter((id) => id !== 's1');
    }

    render() {
        const header = $`<header><i @click="${(e) =>
            this.clickOnUser(
                e
            )}" class="fa-solid fa-circle-user hover-font"></i><i @click="${(
            e
        ) =>
            this.clickOnNewConv(
                e
            )}" class="fa-solid fa-pen-clip float-right hover-font"></i></header>`;
        const bottomNavi = $`<div class="bottom-navi"><div @click="${(e) =>
            this.clickOnChat(
                e
            )}" class="active-setting hover-font"><i class="fa-solid fa-comments"></i><small>${
            LANG.THREADSTITLE
        }</small></div><div @click="${(e) =>
            this.clickOnSettings(
                e
            )}" class="hover-font"><i class="fa-solid fa-gears"></i><small>Settings</small></div><div @click="${(
            e
        ) =>
            this.clickOnInvite(
                e
            )}" class="hover-font"><i class="fa-solid fa-plus"></i><small>Invite</small></div><div @click="${(
            e
        ) =>
            this.clickOnPanic(
                e
            )}" class="hover-font"><i class="fa-solid fa-bomb"></i><small>Panic</small></div></div>`;
        const menus = $`<messages-menu class="${
            isPhone ? 'hide' : ''
        }"></messages-menu><settings-menu class="hide"></settings-menu><user-menu class="hide"></user-menu>`;

        return $`${header}<nav><h1 class="chats-headline unselectable">Chats</h1><threads-menu></threads-menu></nav>${bottomNavi}<main>${menus}</main>`;
    }
}

customElements.define('app-layout', AppLayout);

const POST = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
};

const GET = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
};

const image =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAM3RFWHRDb21tZW50AHhyOmQ6REFGSElGUnZMaUE6MyxqOjMxMjg3NDk0NjEwLHQ6MjIwNzIyMDjCgLVAAAAjoklEQVR4nO3de1yO9/8H8FephFqFasmpUnMskcOEsIYcI+dthRmxiZCQaFjMvtiXZZt+TWMa1cxhOaTzcWqR2CRy2i1KK0Rn9fujR9e3+3Td13133ffd8n4+Hns8uq6u63O9tft1X4fP57oujfr6+noQQiTSVHcBhLRkFBBCWFBACGFBASGEBQWEEBYUEEJYUEAIYaGljo2+fPkSV65cQV1dHdq0aYNOnTqhU6dOMDU1VUc5AIAnT56gsLAQpaWlAAA9PT04ODiorR7SMqgkIK9evUJiYiISEhKQmJiIjIwMqcsOGjQIjo6OGDVqFKZOnQpdXV3e6yktLcXPP/+MlJQU/PXXX7h27ZrE5Tp06AAnJyc4OTnhvffew+DBg3mvhbRsGsrsSY+Pj8e2bduQkJCg0PomJiZYs2YNvLy80K5du2bXk5KSgn379uHkyZMKrW9gYIBZs2Zh27Zt6NKlS7PrIS2fUgJy7949LF++HBcvXuSlvc6dO8PX1xefffaZQnuUGzduYPXq1YiNjeWlHgDYuHEjAgMDeWuPtEy8B+To0aNYsWIFXr58yWezAABzc3N8/fXXmDVrllzrDR48GFeuXOG9nv79+yMiIgK9e/fmvW3SMvB6FWvHjh1wd3dXSjgA4NGjR8jOzpZrncTERKWEA2jYMw0dOhQ3btxQSvtE/XgLSGhoKPz9/flqTqo5c+bItfx//vMfJVXSoKysDM7OzsjPz1fqdoh68HKIlZSUBCcnJz7qYWVtbY28vDzOy9+6dUtlhz+9evXCtWvX0L59e5Vsj6hGs/cgBQUFmDFjBh+1yCTv3uOrr75SUiXi7ty5Aw8PD5Vtj6hGs/cgkyZNwvnz5/mqh9W1a9dga2vLadmioiK1dDxGRETIfRGBtFzN2oMkJiaqLBzW1tacwwEA+/fvV2I10vn4+Khlu0Q5mhUQX19fvuqQae7cuZyXraiowLfffqvEaqS7f/8+QkJC1LJtwj+FA5Kbm4vLly/zWQur2bNnc142JCQEJSUlSqyG3Y8//qi2bRN+KRyQ0NBQHstgJ+/h1d69e5VYjWzJycm4d++eWmsg/FA4IHFxcXzWwUqeq1cREREt4sOZmJio7hIIDxQOSGZmJp91sJInIDt27FBiJdz98ccf6i6B8EChgFy9epXvOqSytLTkfHiVnJyMnJwcJVfEjSr/RkR5FArIP//8w3cdUs2fP5/zsjY2Ni3mno1Hjx6puwTCA4UC8uLFC77rkCo/Px+vXr3itKypqSmSkpIwbdo0JVcl24MHD9RdAuGBQgGpqanhuw6pjh8/jn79+iE+Pp7T8u3bt8fp06fh7e2t5MrIm0ChgBgZGfFdB6sHDx5g3Lhx+Oyzz1BRUcFpnb179+LQoUNKrky6Dh06qG3bhD//ioA0CgoKQt++fZGamspp+U8++QQXLlxQywjbjh07qnybhH8KBcTExITvOji7f/8+Ro4cCS8vL1RWVspcfsKECUhLS1N5zep8Qgvhj0IB6dGjBwwMDPiuRS4HDhzAgAEDOA13sbOzw5UrV+TqjW8uemRQ66BwR6GjoyOfdSjkzp07GD58ONatWydzb2Jubo709HRMmDBBJbW9++67KtkOUS6FA9KSPgB79uzBwIEDZfZet2/fHhcuXMDy5cuVXlNL+vsQxSkckOnTp/NZR7PdunULQ4YMwcaNG2Uue/DgQaUOaLS0tIS1tbXS2ieqo3BABgwYgD59+vBZCy927dqFvn37Iisri3U5b29vpfW6f/zxx0ppl6hes26Y+uCDD/iqg1c3b96Eg4MDTp06JXWZnTt3ygyRohYsWKCUdonqNSsg7u7ufNWhFNL6ItLT07Fp0yalbHPcuHHo2bOnUtomqtesgHTr1g2LFi3iqxZeGRgYYPTo0WLzy8rK5H46ijxUeRsyUb5mP/Znw4YNfNTBO2mXcz08PCAQCJSyzf79+2P8+PFKaZuoR7MDYmNjo9RvZEVNmjRJbN7333+PX3/9VWnb3Lx5s9LaJurBy5MV7969CysrKz7q4U1RURGMjY2Z6T///BMODg6chqcoYvDgwXQXYSvEy7N5LS0tsXXrVj6a4oWDg4NQOCorKzFjxgylhQNQ7UMsiOrw9vDqgIAAWFpa8tVcs0yePFloeuXKlbh9+7bStufl5YX+/fsrrX2iPry+HyQ6OlplY53YZGRkYMiQIQCA8PBwuR46J68uXbrg1q1b0NPTU9o2iPrw/gKd9evXq/Sh0aIMDAzw7NkzAA1D421tbVFWVqa07aWnp2P48OFKa5+oF++vgd69e7fE/gdVaXo/+owZM5QajgMHDlA4WjmlvCf9119/VdtLLhsv765fv17ut1HJY8GCBfjss8+U1j5pGZT2ltusrCyMHj0a5eXlymheqtLSUmRmZiq1w27YsGGIj4/n5c27pGVTyh4EaOgXOHv2rLKal2jkyJGorKxU6mDBfv364cKFCxSON4TSAgI0DNwLDw9X5iaEuLi4YPbs2SguLlZK+926dUNcXBwMDQ2V0j5peZQaEKDhtQWqevzOtWvXkJKSopS2TU1NkZiYqNYHVhDVU9o5iKjDhw9j8eLFqtgU77p27YqEhIQWN5yGKJ/KAgI0vJqgJQ5sZNOrVy8kJSXBzMxM3aUQNVBpQADg/PnzEkfatkQDBgxAfHw8OnXqpO5SiJoo/RxElIuLC1JSUvDWW2+petNyGTt2LFJTUykcbziVBwRoeKZWRkYGevTooY7NyzRv3jzExcVBX19f3aUQNVNLQADgnXfeQWZmJgYOHKiuEiTy8/PDzz//rO4ySAuh8nMQUeXl5Zg+fTpiYmLUWQaAhrfTtvQHURDVUtsepFH79u1x6dIlrFq1Sm01GBkZISEhgcJBxKh9D9KUOvpKevfujfPnz9OjeohELSogAJCWloZp06ap5D2IkyZNwokTJ+hmJyKV2g+xRI0YMQJXr15V+i2sGzZsQFRUFIWDsGpxe5BGFRUVcHd3R2RkJK/tdujQAWFhYS3iRZ+k5WuxAWkUFBTE241J1tbWiIqKoievE85afECAhocwTJ8+HU+ePFG4jVmzZiE0NJRerknk0uLOQSQZOnQocnJy4OTkpND6//3vfxEREUHhIHL7VwQEAIyNjZGQkMDpBTmNTE1N8fvvv8PLy0uJlZHW7F9xiCXq/PnzmD9/Pp4/fy51mREjRuDUqVNCT1gkRF7/mj1IUy4uLsjJyYG9vb3E369duxapqakUDtJs/8o9SFPLli1jbumlS7iEb//6gABAWFgYvvzyS0RGRtIlXMKrVhEQvggEAoSFhQnNW7t2Ldq0aaOmioi6UUCaSElJwahRo4TmVVRUQFdXV00VEXX7V56kE6IqFBBCWFBACGFBASGEBQWEEBYUEEJYUEAIYaGl7gL+zdLS0lBdXQ09PT0MGjQImpr/+74pLi7G2bNncf/+fbx69QoWFhaYOnUqunfvLrGt2tpaJCUlITMzE4WFhdDV1YW5uTnGjh2Lvn37KlRfVVUVkpKSkJ2djadPn+L58+cwNDSEjY0NXFxcFH4LmEAgQFJSEm7evImSkhJoaWnB1NQU9vb2GDt2bLP7jcrKyhAbG4v8/HwUFRVBQ0MDJiYmGDx4MEaMGAFtbe1mtS8P6ihsQt6Owm7dukEgEAAAgoODsWTJElRWVsLPzw+HDh3Cy5cvhZbX0dFBQECA2JD9Y8eOYcuWLbh7967E7YwfPx779u3jHJQHDx5gx44diIiIkDriWUtLCwsXLkRgYCDnQZ3Xr1/Hli1b8Ntvv6G2tlbiMkZGRli6dCn69Okj9js9PT24ublJbf/27dvYunUrTp8+LfXNZCYmJli1ahW8vLxU8jwBCkgTzQnIihUrsHnzZkybNg1//PEH63a+++47LFu2DEDDUJa9e/fKrK1z58747bffMGzYMKnL1NfXY+fOnfjiiy84v/quT58+OH/+vMzHwIaGhmLFihWoqKjg1K4k1tbWyMvLk/i7vXv3ws/PD5WVlZzasrW1VcnYOwpIE80JyMiRI/Hq1StcvXoVADBmzBjY2dmhTZs2uHLlChISEpj1dHV1kZ+fj9OnT2PFihUAGr7RnZ2d0b9/f7x+/RpXr14VWgdo+IBlZWVJfGZweXk5Fi5ciIiICKH5ZmZmGDt2LHM4dePGDcTExAjtAUaNGoW4uDhoaUk+4r548SKmTJnCrKOrq4uPPvoIEydORNeuXVFTU4Pc3FwcO3YM8fHxEtsAgE8++UTiy5R8fX2xe/duoXkuLi4YP348unfvDg0NDeTn5+PUqVNITU1llrGwsEB6ejpMTU2lbrO5KCBNNCcgjfr164cffvgBQ4cOFZp/5swZzJ8/n/lm9/b2xtGjR1FcXIwBAwYgLCxM7FFH0dHRmDt3LvPedwDYt28fVq9eLVZLTU0N7O3t8eeffwIAevbsiQ0bNmDhwoVo27at0LIZGRmYOXMmHj16xMwLCwvD/Pnzxdp9/fo1+vfvj9zcXADAW2+9haioKIwcOVLi32TLli3Yvn07Mz1v3jz4+vrCwsICBgYGYsuHh4dj7ty5zHSPHj3w008/SW3/yJEj8PT0ZPZkU6ZMUeq7MCkgTTQ3IMOGDcPFixclfhAAYMeOHfD39xea17lzZ2RlZUk9eQ8ODsbSpUuZ6SFDhiAjI0PismlpaVi7di2GDBmCbdu2sb5L8cyZM5g+fTozPWHCBFy4cEFsufj4eIwbN46Z3rVrF3x9faW2CzTsTRu/6fv374/r169LXK6srAy9evVCUVERAMDQ0BApKSno168fa/vff/89PD09memkpCSx/298ocu8PIqMjJQaDgBYtGiR2LylS5dKDQcAuLu7w8jIiJm+evUqysrKJC47YsQIpKenY//+/TJfNDp16lRYWloy02lpaaipqRFbTjSMs2fPZm0XgNCJ+I0bN/DixQuJywUHBzPhABoOtWSFA2j4mzVdLiQkROY6iqKA8Khz586svzc3N0fXrl2F5sl6n3vbtm2Fbi2ura3F/fv3Fa6xkYaGBgYNGsRMl5WViR0uAhB7BGy3bt1kti26TNMQNHXs2DHm53bt2gntKdloaGjA1dWVmY6NjeW0niIoIComekmVywdOdJ3S0lJeahF9e5akdkXf6tv0fEga0UvLTfeAjYqLi5Gdnc1MOzo6omPHjjLbbmRnZ8f8LBAIUFBQwHldeVBHoYqJXinS0dGRuY5ox5ikQyE+aqmurhZbRrTvJSYmRuLJfFNNv9Gtra0lvsYuOzsbdXV1zHRpaanMc5umHj58KDRdXFyscMcnGwrIG6K4uBh37txBQUEBiouLUVZWJvQNLs348eNhYWGBe/fuAQC2bduGCRMmSP22j42NFbrUvGDBAonLPX36VGg6KysLWVlZXP85YkQ7ZflCAWml/vnnH5w7dw7R0dFISUlR+LxFS0sLX331FWbNmgUAyM3NxciRI7F9+3ZMmjQJ7dq1AwA8fvwYoaGh2LFjB9NfYm1tjXXr1klsV/QD3blzZ4XfCWlgYAAbGxuF1pWFAtLKPHz4ELt378aPP/7I27eqm5sb9uzZA19fX9TW1uLmzZuYNWsWdHR0YGZmhurqajx+/FhonZ49e+Ls2bNSh4OIvuXY29sbmzZt4qVePlFAWpHIyEh4enoKXXnS19fH2LFjMWzYMLzzzjuwtLSEiYkJDA0N4evri6CgIE5tr1mzBhoaGlizZg0zr7q6Gg8ePBBaTldXFx988AG+/PJL1ldoix6iSbvSpW4UkFbi4sWLWLBgAXMCb2xsjM2bN2PhwoW8vJP+wIEDzEn0hx9+CDs7O+Tm5qK0tBQ6OjowNjaGvb09Jk6cCDMzM5ntWVlZCU1L60xUNwpIK1BXVwdvb28mHEZGRoiPj+fU6cbF+fPnmQeAT548GUeOHIGGhkaz2rS0tBQ6+f/999/x8uXLFvfGL+oHaQWys7Nx8+ZNZtrd3Z23cAAQGm08aNCgZoejkbOzM/NzeXk5jh49yku7fKKAtAKinWTm5uac1hO91CpN47c8ABw6dAiRkZGch6Wz+fTTT4WmAwMDOdekKnSI1QqI9lQ3juiV5vXr1/Dx8UF4eDin9nv37o38/HwAQGFhIWbPno127drBysoKpqameOutt6Cnpwd9fX0YGxuje/fu6NmzJxwcHFjPf+zs7ODm5oZffvkFQEOP+Jw5c3Dy5EmJve9NZWZmwt/fH1paWvjll1/ERizzhQLSCtjb20NfX58ZxHjs2DF8+OGHQocwjbKzs7Fy5UqkpKRwbj8gIABpaWlCQ1EqKipw48YN3LhxQ+p62tramDhxIvz8/KTe6BUUFISMjAz8/fffAICEhAQMHToU/v7+cHV1FQpYTU0NEhMTERISgvDwcKYn3sfHB/v37+f875EHBaQVaN++PT7++GN8/fXXABoGNLq4uMDNzQ2DBw+Grq4uCgoKkJKSwgTD2toamzZtkjjCWJSDgwMiIyMxdepUzncqAg0f6LNnz+LChQsIDQ2V2KtuamqKiIgIzJw5kzlUvHPnDjw8PKCrqwsrKyt07NgRr169Ql5enljfjp6ensQvAr5QQFqJbdu24fLly0hPTwfQEJITJ07gxIkTYsu6ubnh4MGDMDQ0xKeffsr6oa+trcWGDRtw4MABVFdXY9SoUQgICECbNm1QWFiIkpISPH/+HM+ePUNRURGePHmCnJwcoZHBNTU1WL58OSZMmCCxb2TYsGFITk7Gxx9/LHQXZWVlJevh4vvvv4/du3dj4MCBXP5ECqGAtBL6+vqIiYnB9u3b8X//938oLi4W+r2uri7Gjx8PT09PuLi4MPOXLFmC4OBgifea19fXY968ecw5wuzZs/HTTz/JHGBZX1+P+Ph4eHp64vbt2wCAFy9e4Ny5c/joo48krmNpaYn4+HicPXsWhw8fRlxcnMQHTlhbW2PMmDFwd3eXetchn+iOwlaopqYG165dw6NHj6CtrQ1TU1NYW1vL3WF4+vRp5r6L9u3b4+HDh6y946JiYmLw/vvvM9O7d++Gj48Pp3WrqqqQn5+PwsJCVFdXo1OnTjAzM+N8hY4vtAdphbS1teHg4AAHB4dmtdP0AQy9e/eWKxwAxG4Ok+edkW3btkXfvn0VfiYYX6gfhEj1+vVr5meBQICqqiq51o+OjmZ+1tLSwtixY3mrTVUoIESqprf6FhUVwdfXV+gmJzZxcXFCD6iYN2+ezGdvtUR0DkKkevXqFQYNGiT0sDdHR0csX74czs7OYs+jKisrQ3p6Oo4dO4awsDCh+0LS0tJk3rPfElFACKvs7GxMmzaN6chrytjYGB07doSmpiZevHgh9JytRvb29jh9+jSne+9bIgoIkamgoAD+/v44cuSI1GfyijI1NYWXlxfWrVvH6b77looCQjh7/PgxTp48ifT0dFy/fh2PHz/Gs2fPoKGhgU6dOqFLly4YMmQInJyc4Orq2ireDkwBIYQFXcUihAUFhBAWFBBCWFBACGFBASGEBQWEEBYUEEJYUEAIYUEBIYQFBYQQFhQQQlhQQAhhQQEhhAUFhBAWFBBCWFBACGFBASGEBQWEEBYUEEJY0KNH3zD5+fn4448/mOk+ffrA1tZWjRW1bK0+ICdOnBB7VbEkWlpa0NfXh76+Prp37w5bW9sW90JJPsTGxmLZsmXM9KZNmyggLFp9QEJDQ3HhwgW519PU1ISDgwPmzp0Ld3f3f+VTAUnz0TmIFHV1dcjIyMDatWvRr18/hISEqLskogatfg8iysjICIaGhmLza2trUVZWhmfPnon9rqioCEuWLMGjR4+wZcsWVZRJWog3bg/i7e2Nu3fviv338OFDlJaWoqSkBJcuXcLixYuhpSX8/bF161bExcWpqXKiDm9cQGQxMjKCs7MzQkJCEBMTAwMDA6Hfb9u2TU2VEXWggLBwcnISO6RKTk5GYWGhmioiqkYBkeGjjz6Cpub//kx1dXWsb14lrQsFRAZjY2N06dJFaN7Tp0/VVA1RtTfuKpYi2rdvLzQt7bH+BQUFyMvLg4aGBnr16iX2Rtb4+HjEx8ejsLAQHTt2xLhx4+Ds7AwNDQ3W7ZeUlCA2Nhb379/H06dPoampCWNjY1hZWWHcuHFyv71WERUVFbh27RoqKysBNLxk891335W5XllZGWJjY5Gfn4+ioiJoaGjAxMQEgwcPxogRI6Ctrc1p+2lpaaiuroaenh4GDRoktFcHgL/++gtpaWkQCAR4+fIljI2NMWTIEIwePVrsYos8KCAyVFVVQSAQCM2T1vP822+/Mb3Ub7/9NgQCAdq0aQOBQAAPDw+xK2C7du2CQCCQ+mrjy5cvY9u2bbh06RJqamokLqOrq4spU6Zg69at6N+/v7z/PE7u3r2LSZMm4datWwAa3qJ74sQJ1nVu376NrVu34vTp0ygvL5e4jImJCVatWgUvLy+Zoxbmzp3L/H8IDg7GkiVLADR86WzduhXJyckS17O0tERgYCDmzp3L2r40dIglQ1RUlND/4FGjRsHCwkLmek+ePEFRURGKiorg7Ows8fKwpqam2Hv+gIY+mZUrV2L48OE4d+6c1HAAQGVlJSIjI2Fvb4/PP/+c47+Ku8ePH2Py5MlMODQ1NREcHIwZM2ZIXWfv3r2wtbXFzz//LDUcQEP/kp+fHxwdHXH79m3ONV29ehW1tbVYvXo1nJ2dpYYDaAj3vHnzsHPnTs7tN0V7EBZPnz6Fn58fM62lpYXAwEDO6xcXF2Pjxo3Mh0uUmZmZ2O6/trYWbm5uOHPmjNB8c3NzODs7o2vXrqirq4NAIEBMTAweP37MrBcQEIBHjx7h0KFDnGtkU1JSgilTpiA3N5eZ9/XXX8PDw0PqOr6+vti9e7fQPBcXF4wfPx7du3eHhoYG8vPzcerUKaSmpgIAcnJyMGHCBKSnp0v8whB1+/ZtfPDBBwgPDwcA6OjowNnZGVZWVtDV1cXt27cRHR0tFM7Nmzdj2LBhGDdunFx/AwqIFJcuXcKqVauYD4empia++eYbjBw5knMbP/zwA6KiogAAw4cPx6JFi9CnTx/U1NTg4cOHEsd3BQQECIXD0NAQX375JZYsWSJ23F1bW4ugoCBs3LgRFRUVABoOPwYOHIgVK1bI/W9u6uXLl3B1dcWVK1eYeTt27MDKlSulrhMeHi4Ujh49euCnn36S+Ddbt24djhw5Ak9PT1RUVODevXtYsmQJzp49K7O2S5cuAWj4f7Jq1SqsX78eb7/9ttAyDx48wOzZs5GZmQmg4erj559/TgGRJScnBz/++KPY/NraWjx//hx5eXlISkrCzZs3md9169YN33zzDaZNmybXtoKCggAAq1evxp49e8Q+4KKuX78udCjQrl07nDlzBqNGjZK4vJaWFlatWoXu3btj5syZzHwfHx+4urqKXX3jqqqqCnPmzBE6dPHx8RHam4oqKysTCo+hoSGioqLQr18/qeu4u7ujoqICnp6eABrO4ZKTk6X+e5syMjJCZGSk1A98jx49EBERgQEDBqCsrAwAkJSUhLy8PNjY2Mhsv9EbF5DIyEhERkZyWrZLly7w9fXF4sWLFRr6XlNTg4kTJ2Lv3r0yr1QBwL59+1BXV8dM+/j4cPqwzJgxA+7u7jhy5AgAoLy8HEFBQfjiiy/krvn169fw8PDA+fPnmXnLli0TO2wSFRwcjKKiImba19eXNRyNli5digMHDjB9SyEhIZz+zVFRUTKvovXo0QNubm4IDQ1l5qWmpsoVEDpJZ1FQUIDAwEB4eXkhLS1N7vW1tLQ4h6OiokLoypCOjg7r4Yyo1atXC01L2kvKUl9fj+XLlwvVsWDBAhw8eFDmuseOHWN+bteuHZYuXcppmxoaGnB1dWWmY2NjOa1nb2/PaTnREN25c4fTeo3euD2Ivb291G+2169f48WLF7h37x5yc3NRV1eHwsJCHD58GIcPH8aCBQvw7bffcu53mDx5Mvr06cNp2fT0dKGTSicnJ7nuQbG3t4eNjQ3y8vIAAI8ePcLNmzc5bx9o+NYPDg5mpqdNm4bQ0FCZh4bFxcXIzs5mph0dHdGxY0fO27Wzs2N+FggEKCgoUPjwUJSJiYnQtKTR2mzeuIDMmDED/v7+MpcrKipCaGgodu7cyfxRw8LCcOfOHcTFxaFDhw4y2+ByiNGo6W2wADBw4EDO6zZdpzEgAJCZmSkzIPn5+Th58iTOnTsndM/LuHHjcPz4cU4dednZ2UKHhqWlpfD19eVc98OHD4Wmi4uLeQuIaP1VVVVyrf/GBYQrExMTrF+/HlOnToWzszMKCgoAABkZGdi8eTP27dvH6/ZEh69069ZN7jZE1+EyJObEiRNinX62trb49ddf0a5dO07bFd1OVlYWsrKyOK0rycuXLxVel28UEBn69OmDvXv3Yt68ecy8Q4cOISAgQGwofHOUlpYKTevr68vdhuihX0lJiUK15OTkICQkBN7e3pyWF/1Ad+7cWaH6AcDAwECuk2hlo4Bw4ObmBmNjY+absry8HKmpqZg0aRJv2xDtMGx6yMJVbW2t0DSXw6Pp06fD1dUVd+/exa5du5hee19fX9ja2uK9996T2YZoML29vbFp0yY5Km+5KCAcaGlpwcbGRuhQ4u+//+Z1G6Intc+fP5e7jcbr/dLalKRfv35YuHAhgIaRy15eXgAaLlF/+OGHSE9PR8+ePVnbEN1O08u9/3Z0mZcj0W90Lpdu5SE6YFHey5EAxMYzyXuiu3LlSixevJiZfvLkCebNm8f00ktjZWUlNH39+nW5ttuSUUA4qKurE/vAig5taC7R6/WNQyS4ev36tdiJsaOjo9x1BAUFCdVy+fJlfPrpp6zrWFpaCg3g/P3331vUiXZzUEA4iI6OFjq80tTUxJAhQ3jdxsCBA4VCl5mZib/++ovz+jExMXjy5AkzbWdnBzMzM7nr0NXVxYkTJ4T2aIcPH2aGzUjj7OzM/FxeXo6jR4/Kve2WiAIiQ0lJCXx8fITmjRkzRqEPHxtNTU2x3uft27dzWre+vl5sWEnTpyfKq1u3bggLCxO6MWzdunWsw8pF9zKBgYGt4s5LCgiL+Ph4ODk54caNG0LzAwIClLK9FStWoFOnTsz08ePHceDAAZnrbdq0SejDa2FhwZx4K2r06NHYs2cPM11ZWYkFCxYw/UGi7Ozs4ObmxkwLBALMmTNH7PK1JJmZmZg4cSKmTJkid0eesr1xV7GkjeYF/jfU5O7du0hKSsK1a9fElvHz8+M0mE4RpqamOHjwoNDdb15eXrhy5Qp8fHzQt29foeWvXr2KHTt24OTJk8w8bW1tHD58mHMnH5sVK1YgOzubGX4iEAgwf/58XLp0CTo6OmLLBwUFISMjg7nCl5CQgKFDh8Lf3x+urq5Cl4NramqQmJiIkJAQhIeHMxdBfHx8sH///mbXzpc3LiDyjOZtSktLCxs3blT6c7HmzJmDu3fvws/Pj/nQhIaGIjQ0FD179oS5uTnq6+vx8OFDsVuBdXR08N1338HJyYm3eg4cOICbN28iJSUFQMOQ8TVr1uCbb74RW9bU1BQRERGYOXMms6e5c+cOPDw8oKurCysrK3Ts2BGvXr1CXl6e2Im8np6e0LlMS0CHWByMGTMGCQkJKnto3IYNG3D8+HF07dpVaP79+/eRmprKPJygKRsbG0RFRWHRokW81tK2bVuxWoKCgvDDDz9IXH7YsGFITk7GmDFjhOZXVlbizz//RHJyMq5cuSIWjvfffx/Jycly33OjbBSQJrS1tWFiYoLevXvD1dUVX3zxBbKzsxEfH6/QJdPmmD17NnJzc7F79244OjpKfDKHtrY2xo4di6CgIFy/fl1p377m5uY4fvw4LC0tmXkrV66Ueina0tIS8fHxOHPmDGbMmCF1SI61tTU++eQTJCcnIzo6WqEBmsqmUV9fX6/uIohspaWlePDgAYqLiwE09HpbWFio5JE/zVVVVYX8/HwUFhaiuroanTp1gpmZmdSnubQkFBBCWNAhFiEsKCCEsKCAEMKCAkIICwoIISwoIISwoIAQwoICQggLCgghLCgghLCggBDCggJCCAsKCCEsKCCEsKCAEMKCAkIICwoIISwoIISwoIAQwoICQggLCgghLCgghLCggBDCggJCCAsKCCEsKCCEsKCAEMKCAkIICwoIISwoIISwoIAQwoICQggLCgghLP4fc2rSZo/LtO0AAAAASUVORK5CYII=';

async function ping(data) {
    return await fetch('/subscribe', {
        ...POST,
        body: JSON.stringify(data),
    });
}

async function subscribeSW(swreg) {
    const data = await swreg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:
            'BGcpbQEQRF2Ans4lXwnyqd9EnWT2MgNx9j-ns5EoXDtmQZonB1TqGpBuJlw32gqvbHGTZQgh79mYYjp6dX-8zOg',
    });
    await ping(data);
}

async function registerServiceWorker() {
    await navigator.serviceWorker.register('/serviceworker.js');

    if (!('PushManager' in window)) {
        return console.log(
            'Browser does not have push notifications functionality'
        );
    }

    return navigator.serviceWorker.ready.then(function (registration) {
        return registration.pushManager
            .getSubscription()
            .then(function (subscription) {
                if (subscription === null) {
                    return subscribeSW(registration);
                }

                return ping(subscription);
            })
            .catch(function (error) {
                if (Notification.permission === 'denied') {
                    console.log('Permission for Notifications was denied');
                } else {
                    console.log('Unable to subscribe to push.', error);
                }
            });
    });
}

function setupSW() {
    if ('serviceWorker' in navigator) {
        return registerServiceWorker();
    }
    return console.log('Browser does not have serviceWorker functionality');
}

const connection = indexedDB.open('be8', 3);

async function initialiseDB() {
    return new Promise(function (success, error) {
        connection.onupgradeneeded = function () {
            const db = connection.result;
            const publicKeysStore = db.createObjectStore('publicKeys', {
                keyPath: 'accID',
            });
            const privateKeysStore = db.createObjectStore('privateKeys', {
                keyPath: 'accID',
            });
            const groupKeysStore = db.createObjectStore('groupKeys', {
                keyPath: ['groupID', 'version'],
            });
            const indexs = [
                ['crv', 'crv', { unique: false }],
                ['x', 'x', { unique: false }],
                ['y', 'y', { unique: false }],
                ['kty', 'kty', { unique: false }],
                ['key_ops', 'key_ops', { unique: false }],
                ['ext', 'ext', { unique: false }],
            ];

            indexs.forEach(function (parameters) {
                publicKeysStore.createIndex(...parameters);
                privateKeysStore.createIndex(...parameters);
                groupKeysStore.createIndex(...parameters);
            });
            console.log('upgrade or insert db');
        };

        connection.onsuccess = function () {
            return success();
        };

        connection.onerror = function (event) {
            console.log(event);
            return error();
        };
    });
}

async function initialiseDB$1() {
    await initialiseDB();
    return connection;
}

// generates an Initialization vector
function generateIV() {
    // a nonce (number once) is an arbitrary string that can be used just once in a cryptographic communication
    const nonce = self.crypto.randomUUID();
    return new TextEncoder().encode(nonce);
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
}

function getTypeOfKey(id) {
    if (!id) {
        throw 'engine: id is required in getTypeOfKey';
    }
    if (id.charAt(0) === 'g') {
        return 'group';
    }
    if (id.charAt(0) === 'c') {
        return 'channel';
    }

    return 'dialog';
}

const keyUsages = Object.freeze(['deriveKey', 'deriveBits']);
const algorithmType = 'ECDH'; // Elliptic Curve Diffie-Hellman
const algorithm = Object.freeze({
    name: algorithmType,
    namedCurve: 'P-384', // 384-bit prime curve
});
const format = 'jwk'; // json web key format

class Be8 {
    #indexedDB = {};
    #accID = '';
    #publicKeys = new Map();
    #privateKeys = new Map();
    #groupKeys = new Map();
    #channelKeys = new Map();

    constructor(accID, indexedDB) {
        this.#accID = accID;
        this.#indexedDB = indexedDB;

        if (typeof accID !== 'string' || isNaN(accID)) {
            throw `engine: no acc id or wrong type passed to the constructor got ${accID}`;
        }
        if (!indexedDB) {
            throw 'engine: no indexedDB passed to the constructor';
        }
    }

    async setup() {
        const databaseKeys = await this.getCachedKeys();
        const databaseGroupKeys = await this.getCachedGroupKeys();
        const privateTx = this.#indexedDB.result.transaction(
            'privateKeys',
            'readwrite'
        );
        const privateKeysStore = privateTx.objectStore('privateKeys');
        const all = privateKeysStore.getAll();
        const newAccID = this.#accID;
        const privateKey = await new Promise(function (success) {
            all.onsuccess = function (event) {
                return success(
                    event.target.result.find((key) => key.accID === newAccID)
                );
            };
        });

        if (!privateKey) {
            console.log(`engine: brand new acc, set id: #${this.#accID}`);
            await this.generatePrivAndPubKey();
        } else {
            console.log(`engine: old acc, used id: #${this.#accID}`);
            this.#privateKeys.set(this.#accID, privateKey);
        }

        databaseKeys.forEach(({ accID, publicKey }) =>
            this.#publicKeys.set(accID, publicKey)
        );
        databaseGroupKeys.forEach(({ groupID, version, groupKey }) =>
            this.#groupKeys.set(`${groupID}:${version}`, groupKey)
        );

        return databaseKeys;
    }

    getAccID() {
        return this.#accID;
    }

    hasGeneratedKeys() {
        const publicKey = this.#publicKeys.has(this.#accID);
        const privatekey = this.#privateKeys.has(this.#accID);

        if (!publicKey) {
            console.log(`engine: No public key for ${this.#accID} in hasKeys`);
        }
        if (!privatekey) {
            console.log(`engine: No private key for ${this.#accID} in hasKeys`);
        }

        return publicKey && privatekey;
    }

    hasKey(id) {
        const type = getTypeOfKey(id);

        if (type === 'group') {
            return this.#groupKeys.has(id);
        }
        if (type === 'channel') {
            return this.#channelKeys.has(id);
        }

        return this.#privateKeys.has(id);
    }

    #getPublicKey(id) {
        const type = getTypeOfKey(id);

        if (type === 'group') {
            return this.#groupKeys.get(id);
        }
        if (type === 'channel') {
            return this.#channelKeys.get(id);
        }

        return this.#publicKeys.get(id);
    }

    #getPrivateKey(id) {
        const type = getTypeOfKey(id);

        if (type === 'group') {
            return this.#groupKeys.get(id);
        }
        if (type === 'channel') {
            return this.#channelKeys.get(id);
        }

        return this.#privateKeys.get(id);
    }

    async addPublicKeys(publicKeys = []) {
        const tx = this.#indexedDB.result.transaction(
            'publicKeys',
            'readwrite'
        );
        const publicKeysStore = tx.objectStore('publicKeys');

        publicKeys.forEach(({ accID, publicKey }) =>
            this.#publicKeys.set(accID, publicKey)
        );
        const proms = publicKeys.map(function ({ accID, publicKey }) {
            publicKeysStore.put({ accID, ...publicKey });
            publicKeysStore.onsuccess = () =>
                console.log(`engine: added public key for ${accID}`);
        });

        return await Promise.all(proms);
    }

    addPublicKey(accID, key) {
        const tx = this.#indexedDB.result.transaction(
            'publicKeys',
            'readwrite'
        );
        const publicKeysStore = tx.objectStore('publicKeys');

        if (!accID) {
            console.log(`engine: missing accID: "${accID}" at addPublicKey`);
        }
        if (!key) {
            console.log(`engine: missing key: "${key}" at addPublicKey`);
        }

        publicKeysStore.put({ accID, ...key });
        return this.#publicKeys.set(accID, key);
    }

    async addGroupKeys(groupID, groupKeys) {
        if (groupID && groupKeys?.length > 0) {
            const tx = this.#indexedDB.result.transaction(
                'groupKeys',
                'readwrite'
            );
            const groupKeysStore = tx.objectStore('groupKeys');

            groupKeys.forEach(({ version, groupKey }) =>
                this.#groupKeys.set(`${groupID}:${version}`, groupKey)
            );
            const proms = groupKeys.map(function ({ version, groupKey }) {
                groupKeysStore.put({ groupID, version, ...groupKey });
                groupKeysStore.onsuccess = () =>
                    console.log(`engine: added group key for ${groupID}`);
            });

            return await Promise.all(proms);
        } else {
            console.log(
                `engine: missing groupID: "${groupID}" or keys: "${groupKeys}" in addGroupKey`
            );
        }
    }

    async getMyPublicKey() {
        const tx = this.#indexedDB.result.transaction(
            'publicKeys',
            'readwrite'
        );
        const publicKeysStore = tx.objectStore('publicKeys');
        const get = publicKeysStore.get(this.#accID);

        return await new Promise(function (success) {
            get.onsuccess = function (event) {
                return success(event.target.result);
            };
        });
    }

    async getCachedKeys() {
        const tx = this.#indexedDB.result.transaction(
            'publicKeys',
            'readwrite'
        );
        const publicKeysStore = tx.objectStore('publicKeys');
        const all = publicKeysStore.getAll();

        return await new Promise(function (success) {
            all.onsuccess = function (event) {
                const keys = event.target.result.map((key) => ({
                    accID: key.accID,
                    publicKey: key,
                }));
                return success(keys);
            };
        });
    }

    async getCachedGroupKeys() {
        const tx = this.#indexedDB.result.transaction('groupKeys', 'readwrite');
        const groupKeysStore = tx.objectStore('groupKeys');
        const all = groupKeysStore.getAll();

        return await new Promise(function (success) {
            all.onsuccess = function (event) {
                const keys = event.target.result.map((key) => ({
                    groupID: key.groupID,
                    version: key.version,
                    groupKey: key,
                }));
                return success(keys);
            };
        });
    }

    async getCachedGroupVersions(groupID) {
        const tx = this.#indexedDB.result.transaction('groupKeys', 'readwrite');
        const groupKeysStore = tx.objectStore('groupKeys');
        const all = groupKeysStore.getAllKeys();

        return await new Promise(function (success) {
            all.onsuccess = function (event) {
                const allVersions = event.target.result;
                const groupVersions = allVersions
                    .filter((v) => v[0] === groupID)
                    .map((v) => v.pop());

                return success(groupVersions);
            };
        });
    }

    async generateGroupKeys(version, groupID) {
        const { privateKey, publicKey } =
            await window.crypto.subtle.generateKey(algorithm, true, keyUsages);
        const proms = [
            window.crypto.subtle.exportKey(format, publicKey),
            window.crypto.subtle.exportKey(format, privateKey),
        ];
        const keys = await Promise.all(proms);
        const hasKeys = this.#groupKeys.get(`${groupID}:${version}`);

        if (hasKeys) {
            console.log(`engine: Group keys for ${version} already exist`);
            return hasKeys;
        }

        this.#groupKeys.set(`${groupID}:${version}`, keys[1]);

        return keys;
    }

    async generatePrivAndPubKey() {
        const { privateKey, publicKey } =
            await window.crypto.subtle.generateKey(algorithm, true, keyUsages);
        const proms = [
            window.crypto.subtle.exportKey(format, publicKey),
            window.crypto.subtle.exportKey(format, privateKey),
        ];
        const keys = await Promise.all(proms);
        const privateTx = this.#indexedDB.result.transaction(
            'privateKeys',
            'readwrite'
        );
        const publicTX = this.#indexedDB.result.transaction(
            'publicKeys',
            'readwrite'
        );
        const publicKeysStore = publicTX.objectStore('publicKeys');
        const privateKeysStore = privateTx.objectStore('privateKeys');

        publicKeysStore.put({ accID: this.#accID, ...keys[0] });
        privateKeysStore.put({ accID: this.#accID, ...keys[1] });
        this.#publicKeys.set(this.#accID, keys[0]);
        this.#privateKeys.set(this.#accID, keys[1]);

        await privateTx.complete;
        await publicTX.complete;

        return keys;
    }

    async getDerivedKey(publicKey, privateKey) {
        if (!publicKey) {
            throw 'engine: no public key passed to getDerivedKey';
        }
        if (!privateKey) {
            throw 'engine: no private key passed to getDerivedKey';
        }

        const publicKeyProm = window.crypto.subtle.importKey(
            format,
            publicKey,
            algorithm,
            true,
            []
        );
        const privateKeyProm = window.crypto.subtle.importKey(
            format,
            privateKey,
            algorithm,
            true,
            keyUsages
        );

        return Promise.all([publicKeyProm, privateKeyProm]).then(function ([
            publicKey,
            privateKey,
        ]) {
            const algorithm = {
                name: 'AES-GCM', // Advanced Encryption Standard Galois/Counter Mode
                length: 256,
            };

            return window.crypto.subtle.deriveKey(
                { name: algorithmType, public: publicKey },
                privateKey,
                algorithm,
                true,
                ['encrypt', 'decrypt']
            );
        });
    }

    async encryptText(derivedKey, text = '') {
        const encodedText = new TextEncoder().encode(text);
        const iv = generateIV();
        const stringifiedIV = new TextDecoder().decode(iv);
        const algorithm = {
            name: 'AES-GCM',
            iv,
        };

        if (!derivedKey) {
            throw 'engine: no derived key passed to encryptText';
        }

        return window.crypto.subtle
            .encrypt(algorithm, derivedKey, encodedText)
            .then(function (encryptedData) {
                const uintArray = new Uint8Array(encryptedData);
                const string = String.fromCharCode.apply(null, uintArray);
                const cipherText = window.btoa(string);

                return { cipherText, iv: stringifiedIV };
            });
    }

    async decryptText(derivedKey, cipherText = '', iv) {
        const mstring = window.atob(cipherText);
        const uintArray = new Uint8Array(
            [...mstring].map((char) => char.charCodeAt(0))
        );
        const parsedIV = new TextEncoder('utf-8').encode(iv);
        const algorithm = {
            name: 'AES-GCM',
            iv: parsedIV,
        };

        if (!derivedKey) {
            throw 'engine: no derived key passed to decryptText';
        }
        if (!iv) {
            throw 'engine: no iv (Initialization vector) passed to decryptText';
        }

        return window.crypto.subtle
            .decrypt(algorithm, derivedKey, uintArray)
            .then(function (decryptedData) {
                return new TextDecoder().decode(decryptedData);
            });
    }

    async encryptTextSimple(accIDSender, accIDReceiver, text) {
        const publicKey = this.#getPublicKey(accIDReceiver);
        const privateKey = this.#getPrivateKey(accIDSender);

        if (!publicKey) {
            throw `engine: Missing public key for ${accIDReceiver} at encryptTextSimple`;
        }
        if (!privateKey) {
            throw `engine: Missing private key for ${accIDSender} at encryptTextSimple`;
        }

        const derivedKey = await this.getDerivedKey(publicKey, privateKey);

        return await this.encryptText(derivedKey, text);
    }

    async decryptTextSimple(accIDSender, accIDReceiver, cipherText, iv) {
        const publicKey = this.#getPublicKey(accIDSender);
        const privateKey = this.#getPrivateKey(accIDReceiver);

        if (!publicKey) {
            throw `engine: Missing public key for ${accIDSender} at decryptTextSimple`;
        }
        if (!privateKey) {
            throw `engine: Missing private key for ${accIDReceiver} at decryptTextSimple`;
        }

        const derivedKey = await this.getDerivedKey(publicKey, privateKey);

        return await this.decryptText(derivedKey, cipherText, iv);
    }

    async encryptImage(derivedKey, base64Image) {
        const encodedText = new TextEncoder().encode(base64Image);
        const iv = generateIV();
        const stringifiedIV = new TextDecoder().decode(iv);

        if (!derivedKey) {
            throw 'engine: no derived key passed to decryptText';
        }

        return window.crypto.subtle
            .encrypt({ name: 'AES-GCM', iv }, derivedKey, encodedText)
            .then(function (encryptedData) {
                return {
                    cipherImage: arrayBufferToBase64(encryptedData),
                    iv: stringifiedIV,
                };
            });
    }

    async decryptImage(derivedKey, cipherImage, iv) {
        const mstring = window.atob(cipherImage);
        const uintArray = new Uint8Array(
            [...mstring].map((char) => char.charCodeAt(0))
        );
        const parsedIV = new TextEncoder('utf-8').encode(iv);
        const algorithm = {
            name: 'AES-GCM',
            iv: parsedIV,
        };

        if (!derivedKey) {
            throw 'engine: no derived key passed to decryptText';
        }

        return window.crypto.subtle
            .decrypt(algorithm, derivedKey, uintArray)
            .then(function (decryptedData) {
                return new TextDecoder().decode(decryptedData);
            });
    }

    async encryptImageSimple(accIDSender, accIDReceiver, base64Image) {
        const publicKey = this.#getPublicKey(accIDReceiver);
        const privateKey = this.#getPrivateKey(accIDSender);

        if (!publicKey) {
            throw `engine: Missing public key for ${accIDSender} at encryptImageSimple`;
        }
        if (!privateKey) {
            throw `engine: Missing private key for ${accIDReceiver} at encryptImageSimple`;
        }

        const derivedKey = await this.getDerivedKey(publicKey, privateKey);

        return await this.encryptImage(derivedKey, base64Image);
    }

    async decryptImageSimple(accIDSender, accIDReceiver, cipherImage, iv) {
        const publicKey = this.#getPublicKey(accIDSender);
        const privateKey = this.#getPrivateKey(accIDReceiver);

        if (!publicKey) {
            throw `engine: Missing public key for ${accIDSender} at decryptImageSimple`;
        }
        if (!privateKey) {
            throw `engine: Missing private key for ${accIDReceiver} at decryptImageSimple`;
        }

        const derivedKey = await this.getDerivedKey(publicKey, privateKey);

        return await this.decryptImage(derivedKey, cipherImage, iv);
    }

    async panic() {
        const pubtx = this.#indexedDB.result.transaction(
            'publicKeys',
            'readwrite'
        );
        const privtx = this.#indexedDB.result.transaction(
            'privateKeys',
            'readwrite'
        );
        const grouptx = this.#indexedDB.result.transaction(
            'groupKeys',
            'readwrite'
        );
        const publicKeysStore = pubtx.objectStore('publicKeys');
        const privateKeysStore = privtx.objectStore('privateKeys');
        const groupKeysStore = grouptx.objectStore('groupKeys');

        const pubKeyProms = new Promise(function (resolve) {
            const event = publicKeysStore.clear();

            event.onsuccess = function () {
                return resolve();
            };
        });
        const privKeyProms = new Promise(function (resolve) {
            const event = privateKeysStore.clear();

            event.onsuccess = function () {
                return resolve();
            };
        });
        const groupKeyProms = new Promise(function (resolve) {
            const event = groupKeysStore.clear();

            event.onsuccess = function () {
                return resolve();
            };
        });

        await Promise.all([pubKeyProms, privKeyProms, groupKeyProms]);

        this.#publicKeys.clear();
        this.#privateKeys.clear();
        this.#groupKeys.clear();
        this.#channelKeys.clear();
    }
}

let messageReceivedTimer = null;

var sound = Object.freeze({
    messageReceived() {
        clearTimeout(messageReceivedTimer);

        messageReceivedTimer = setTimeout(() => {
            const audio = new Audio('assets/sounds/received.mp3').play();

            if (audio) {
                audio.catch(console.log);
            }
        }, 300);
    },
});

const app = document.querySelector('app-layout');
const refreshAppComponent = (accObj) => (app.ME = accObj);
const actions = Object.freeze({
    newMessage,
    messageRead,
    expiredAcc,
    newConversation,
    groupMemberRemove,
    groupJoin,
    groupCreate: newConversation,
});
let be8 = {};

function setupSSE() {
    const source = new EventSource('/events');

    source.addEventListener(
        'message',
        async function (e) {
            const data = JSON.parse(e.data);
            return await actions[data.action](data);
        },
        false
    );
}

async function groupJoin(detail) {
    const isOpenConversation =
        detail.groupID === app.getConversationPartner().threadID;

    if (isOpenConversation) {
        await getMessages({ detail });
    }

    await getThreads();
}

async function groupMemberRemove(detail) {
    const isOpenConversation =
        detail.groupID === app.getConversationPartner().threadID;
    const isME = detail.leavingMember === be8.getAccID();

    if (isOpenConversation && !isME) {
        await getMessages({ detail });
    }
    if (isOpenConversation && isME) {
        app.clickOnThread({ partner: 's1' });
    }

    await getThreads();
}

async function newConversation(detail) {
    await getThreads();
    app.clickOnThread(detail);
}

async function expiredAcc(detail) {
    if (detail.threadID === app.getConversationPartner().threadID) {
        app.clickOnThread({ partner: 's1' });
    }

    return await getThreads();
}

async function newMessage(detail) {
    if (detail.threadID === app.getConversationPartner().threadID) {
        await getMessages({ detail });
    }
    if (document.hidden) {
        sound.messageReceived();
    }

    return await getThreads();
}

async function messageRead(detail) {
    if (detail.threadID === app.getConversationPartner().threadID) {
        await getMessages({ detail });
    }
}

async function generateEngine({ id }, database) {
    be8 = new Be8(id, database);

    Object.freeze(be8);
    return await be8.setup();
}

async function startConversation({ detail }) {
    const raw = await fetch('/startConversation', {
        ...POST,
        body: JSON.stringify(detail),
    });
    const data = await raw.json();

    if (data.valid) {
        return detail.success();
    }
    if (data.error === 'ACCNOTEXISTS') {
        return detail.idDoesNotExist();
    }
}

async function decryptImages(messages) {
    const imageMessages = messages.filter((m) => m.messageType === 'image');
    const imageProms = await imageMessages.map(async function (imageMessage) {
        const raw = await fetch('/imageget', {
            ...POST,
            body: JSON.stringify({
                contentID: imageMessage.contentID,
                threadID: imageMessage.threadID,
                sender: imageMessage.sender,
                messageID: imageMessage.messageID,
            }),
        });

        return await raw.json();
    });
    const images = await Promise.all(imageProms);
    const workingImages = images.filter((image) => image.valid);
    const brokenImages = images.filter((image) => !image.valid);
    const yourID = be8.getAccID();

    brokenImages.forEach((imagesMessage) => {
        return app.insertImage({ ...imagesMessage, content: image });
    });
    workingImages.forEach((imageMessage) => {
        const dialogPublicId =
            imageMessage.sender === yourID
                ? imageMessage.receiver
                : imageMessage.sender;
        const idForPublicKey = imageMessage.groupVersionKey
            ? imageMessage.sender
            : dialogPublicId;
        const idForPrivateKey = imageMessage.groupVersionKey || yourID;

        return be8
            .decryptImageSimple(
                idForPublicKey,
                idForPrivateKey,
                imageMessage.content,
                imageMessage.iv
            )
            .then(function (content) {
                return app.insertImage({ ...imageMessage, content });
            });
    });
}

async function decryptMessages(cipherMessages) {
    const yourID = be8.getAccID();
    const proms = cipherMessages.map(async function (message) {
        const dialogPublicId =
            message.sender === yourID ? message.receiver : message.sender;
        const idForPublicKey = message.groupVersionKey
            ? message.sender
            : dialogPublicId;
        const idForPrivateKey = message.groupVersionKey || yourID;
        const hasKey = be8.hasKey(idForPrivateKey);

        if (message.messageType === 'system') {
            return message;
        }
        if (!hasKey) {
            message.valid = false;
            return message;
        }
        if (message.messageType === 'text') {
            const text = await be8.decryptTextSimple(
                idForPublicKey,
                idForPrivateKey,
                message.text,
                message.iv
            );

            message.text = text;
        }

        return message;
    });

    return await Promise.all(proms);
}

async function getCachedUserIDs() {
    const cachedKeys = await be8.getCachedKeys();
    return cachedKeys.map((acc) => acc.accID);
}

async function fetchKeysAndAdd(groupID, cachedVersions) {
    const accID = be8.getAccID();
    const rawKeys = await fetch('/groupGetkeys', {
        ...POST,
        body: JSON.stringify({ groupID, accID }),
    });
    const { groupKeys } = await rawKeys.json();
    const filteredKeys = groupKeys.filter(
        (gk) => !cachedVersions.includes(gk.groupVersion)
    );
    const keyholder = filteredKeys.map((fk) => fk.keyholder);

    await syncPublicKeys(keyholder);

    if (filteredKeys.length > 0) {
        const decryptProms = filteredKeys.map(async function ({
            groupKey,
            keyholder,
            iv,
        }) {
            return await be8.decryptTextSimple(keyholder, accID, groupKey, iv);
        });
        const decryptedKeys = await Promise.all(decryptProms);

        const sanKeys = decryptedKeys.map(function (key, i) {
            const groupKey = JSON.parse(key);
            return { groupKey, version: filteredKeys[i].groupVersion };
        });

        return await be8.addGroupKeys(groupID, sanKeys);
    }
}

async function syncGroupKeys(groupID) {
    const cachedVersions = await be8.getCachedGroupVersions(groupID);
    const lastVersion = cachedVersions[cachedVersions.length - 1];
    const groupVersion = await groupGetVersion(groupID);

    if (!lastVersion || parseInt(groupVersion) > parseInt(lastVersion)) {
        return await fetchKeysAndAdd(groupID, cachedVersions);
    }
}

async function syncAllGroupKeys(groupIDs) {
    const proms = groupIDs.map((id) => syncGroupKeys(id));
    return await Promise.all(proms);
}

async function syncPublicKeys(extra = []) {
    const cachedIDs = await getCachedUserIDs();
    const accIDs = app
        .getConversationPartners()
        .concat(extra)
        .filter(
            (id) => !id.includes('g') && !cachedIDs.find((cID) => cID === id)
        );

    if (accIDs.length === 0) {
        return;
    }

    const raw = await fetch('/getkeys', {
        ...POST,
        body: JSON.stringify({ accIDs }),
    });
    const data = await raw.json();

    if (data.valid) {
        return await be8.addPublicKeys(data.publicKeys);
    }
}

async function getThreads() {
    const raw = await fetch('/getthreads', GET);
    const { valid, threads } = await raw.json();
    const groupIDs = threads.filter((t) => t.groupID).map((t) => t.groupID);
    const dialogIDs = threads
        .filter((t) => !t.groupID && t.partner !== 's1')
        .map((t) => t.partner);
    const allMembersOfGroups = groupIDs.map(async function (groupID) {
        const raw = await fetch('/groupgetmembers', {
            ...POST,
            body: JSON.stringify({ groupID }),
        });
        return await raw.json();
    });
    const members = await Promise.all(allMembersOfGroups);
    const memberIDs = members.flatMap((amg) => amg.members.map((m) => m.id));
    const uniqueMembersIDs = [...new Set(dialogIDs.concat(memberIDs))];

    await syncAllGroupKeys(groupIDs);
    await syncPublicKeys(uniqueMembersIDs);

    if (!valid) {
        return;
    }

    const decthreads = await decryptMessages(threads);

    return app.setThreads(decthreads);
}

async function storePublicKey() {
    const publicKey = await be8.getMyPublicKey();
    await fetch('/setkey', {
        ...POST,
        body: JSON.stringify({ publicKey }),
    });
}

async function getMessages({ detail }) {
    if (detail.type === 'group') {
        return getGroupMessages(detail);
    }
    if (detail.type === 'user' || detail.type === 'system') {
        return getDialogMessages(detail);
    }
}

async function getDialogMessages(detail) {
    const raw = await fetch('/getmessages', {
        ...POST,
        body: JSON.stringify(detail),
    });
    const { valid, messages } = await raw.json();

    if (valid) {
        const sanMessages = await decryptMessages(messages);

        app.setMessages(sanMessages);
        return await decryptImages(sanMessages);
    }
}

async function getGroupMessages(detail) {
    const rawMembers = await fetch('/groupgetmembers', {
        ...POST,
        body: JSON.stringify(detail),
    });
    const rawMessage = await fetch('/getmessages', {
        ...POST,
        body: JSON.stringify(detail),
    });
    const { valid, messages } = await rawMessage.json();
    const members = await rawMembers.json();
    const memberIDs = members.members.map(({ id }) => id);

    if (valid) {
        await syncGroupKeys(detail.groupID);
        await syncPublicKeys(memberIDs);

        const sanMessages = await decryptMessages(messages);
        app.setMessages(sanMessages);
        app.setGroupMember(members);
        return await decryptImages(sanMessages);
    }
}

async function groupGetVersion(groupID) {
    const raw = await fetch('/groupgetcurrentversion', {
        ...POST,
        body: JSON.stringify({ groupID }),
    });
    const { groupVersion } = await raw.json();

    return groupVersion;
}

async function getGroupMembers(groupID) {
    const membersRaw = await fetch('/groupgetmembers', {
        ...POST,
        body: JSON.stringify({ groupID }),
    });
    const { members } = await membersRaw.json();

    return members;
}

async function updateGroupKeyForParticipants(groupID, groupKey, groupMembers) {
    const keyString = JSON.stringify(groupKey);
    const members = groupMembers || (await getGroupMembers(groupID));
    const memberIDs = members.map((m) => m.id);

    await syncPublicKeys(memberIDs);

    const proms = members.map(async function ({ id }) {
        const keyholder = be8.getAccID();
        const { cipherText, iv } = await be8.encryptTextSimple(
            keyholder,
            id,
            keyString
        );

        return await fetch('/groupstorekey', {
            ...POST,
            body: JSON.stringify({
                keyholder,
                groupID,
                groupKey: cipherText,
                accID: id,
                iv,
            }),
        });
    });

    return await Promise.all(proms);
}

async function groupIncreaseVersion(groupID) {
    const raw = await fetch('/groupincreaseversion', {
        ...POST,
        body: JSON.stringify({ groupID }),
    });
    const { groupVersion } = await raw.json();

    return groupVersion;
}

async function generateGroupKey(groupID) {
    const groupVersion = await groupIncreaseVersion(groupID);
    const [, groupKey] = await be8.generateGroupKeys(groupVersion, groupID);

    return groupKey;
}

async function generateNewGroupKeyBeforeLeave(groupID) {
    const groupKey = await generateGroupKey(groupID);
    const groupMembers = await getGroupMembers(groupID);
    const sanGroupMembers = groupMembers.filter(
        ({ id }) => id !== be8.getAccID()
    );

    await updateGroupKeyForParticipants(groupID, groupKey, sanGroupMembers);
    return await syncGroupKeys(groupID);
}

async function joinGroupViaLink(groupID) {
    const { valid } = await groupJoinMember(groupID);

    if (valid) {
        const groupKey = await generateGroupKey(groupID);

        await updateGroupKeyForParticipants(groupID, groupKey);
        await syncGroupKeys(groupID);
        await fetch('/invitelink', {
            ...POST,
            body: JSON.stringify({ type: 'group', usedInviteLink: true }),
        });
    }
}

async function joinDialogViaLink(joinId) {
    await startConversation({
        detail: {
            id: be8.getAccID(),
            receiverID: joinId,
            success: () => {},
        },
    });
    await fetch('/invitelink', {
        ...POST,
        body: JSON.stringify({ type: 'user', usedInviteLink: true }),
    });
}

async function checkURL() {
    const url = new URL(window.location.href);
    const userID = url.searchParams.get('user');
    const groupId = url.searchParams.get('group');

    window.history.replaceState({}, document.title, '/');

    if (userID) {
        return await joinDialogViaLink(decryptSafeLink(userID));
    }
    if (groupId) {
        return await joinGroupViaLink(decryptSafeLink(groupId));
    }
}

async function groupJoinMember(groupID) {
    const raw = await fetch('/groupjoinmember', {
        ...POST,
        body: JSON.stringify({ groupID }),
    });

    return await raw.json();
}

async function recurringVisitor(accObj, database) {
    refreshAppComponent(accObj);
    await generateEngine(accObj, database);
    return await app.openLockModal(async () => {
        await getThreads();
        await checkURL();
    });
}

async function firstTimeVisitor(database) {
    const raw = await fetch('/newacc', {
        ...POST,
        body: JSON.stringify({
            ...generatePassword(),
            nickname: randomNickname(),
        }),
    });
    const data = await raw.json();

    if (data.valid) {
        const raw = await fetch('/me', GET);
        const { accObj } = await raw.json();

        refreshAppComponent(accObj);
        await generateEngine(accObj, database);
        await storePublicKey();
        await getThreads();
        await checkURL();
        return app.openWelcomeWindow(accObj);
    }
}

app.addEventListener('unlock', async function ({ detail }) {
    const raw = await fetch('/codeunlock', {
        ...POST,
        body: JSON.stringify(detail),
    });
    const { valid, isValid, isDestroyCode } = await raw.json();

    if (isDestroyCode) {
        location.reload();
    }
    if (valid && isValid) {
        return detail.done();
    }

    return detail.error();
});
app.addEventListener('leaveGroup', async function ({ detail }) {
    await generateNewGroupKeyBeforeLeave(detail.groupID);

    const raw = await fetch('/groupleavemember', {
        ...POST,
        body: JSON.stringify(detail),
    });
    const { valid } = await raw.json(detail);

    if (valid) {
        return detail.done();
    }
});
app.addEventListener('panic', async function ({ detail }) {
    await be8.panic();
    const raw = await fetch('/destroyacc', GET);
    const { valid } = await raw.json();

    if (valid) {
        return await detail.done();
    }
});
app.addEventListener('inviteGenerated', async function ({ detail }) {
    await fetch('/invitelink', { ...POST, body: JSON.stringify(detail) });
});
app.addEventListener('changeNickName', async function ({ detail }) {
    const raw = await fetch('/changenickname', {
        ...POST,
        body: JSON.stringify(detail),
    });
    const data = await raw.json();

    if (data.valid) {
        const raw = await fetch('/me', GET);
        const { accObj } = await raw.json();

        return refreshAppComponent(accObj);
    }
});
app.addEventListener('setupCodes', async function ({ detail }) {
    const raw = await fetch('/codeset', {
        ...POST,
        body: JSON.stringify(detail),
    });
    const data = await raw.json();

    if (data.valid) {
        return detail.done();
    }
});
app.addEventListener('updateCode', async function ({ detail }) {
    const raw = await fetch('/codeupdate', {
        ...POST,
        body: JSON.stringify(detail),
    });
    const { valid, reason } = await raw.json();

    if (reason === 'OLDCODEWRONG') {
        return detail.oldCodeWrong();
    }
    if (valid) {
        return detail.done();
    }
});
app.addEventListener('setUserStatus', async function ({ detail }) {
    await fetch('/userstatusset', { ...POST, body: JSON.stringify(detail) });
});
app.addEventListener('setToken', async function ({ detail }) {
    const raw = await fetch('/endlessvalidate', {
        ...POST,
        body: JSON.stringify({ token: detail.token }),
    });
    const data = await raw.json();

    if (data.valid && data.validate) {
        const raw = await fetch('/me', GET);
        const { accObj } = await raw.json();

        refreshAppComponent(accObj);
        return detail.success(data);
    }
    if (data.error === 'TOKENNOTEXIST') {
        return detail.wrongToken();
    }
    if (!data.valid && data.tokenInUse) {
        return detail.tokenInUse();
    }
});
app.addEventListener('startConversation', startConversation);
app.addEventListener('createGroup', async function ({ detail }) {
    const raw = await fetch('/groupcreate', {
        ...POST,
        body: JSON.stringify({
            nickname: detail.nickname,
            groupType: detail.groupType,
        }),
    });
    const { valid, groupID } = await raw.json();

    if (valid) {
        const { valid } = await groupJoinMember(groupID);
        const groupKey = await generateGroupKey(groupID);
        await updateGroupKeyForParticipants(groupID, groupKey);
        await syncGroupKeys(groupID);

        if (valid) {
            return detail.success();
        }
    }
});
app.addEventListener('kickMemberFromGroup', async function ({ detail }) {
    const raw = await fetch('/groupkickmember', {
        ...POST,
        body: JSON.stringify(detail),
    });
    const { valid } = await raw.json();

    if (valid) {
        const groupKey = await generateGroupKey(detail.groupID);

        await updateGroupKeyForParticipants(detail.groupID, groupKey);
        await syncGroupKeys(detail.groupID);
        return detail.done();
    }
});
app.addEventListener('addGroupMember', async function ({ detail }) {
    const raw = await fetch('/groupaddmember', {
        ...POST,
        body: JSON.stringify({ memberID: detail.id, groupID: detail.groupID }),
    });
    const data = await raw.json();

    if (data.valid) {
        const groupKey = await generateGroupKey(detail.groupID);

        await updateGroupKeyForParticipants(detail.groupID, groupKey);
        await syncGroupKeys(detail.groupID);
        return detail.done();
    } else {
        return detail.warning(data.reason);
    }
});
app.addEventListener('threadSelect', getMessages);
app.addEventListener('writeMessage', async function ({ detail }) {
    const groupVersion = detail.groupID
        ? await groupGetVersion(detail.receiver)
        : false;
    const sender = detail.groupID
        ? `${detail.receiver}:${groupVersion}`
        : be8.getAccID();
    const receiver = detail.groupID ? be8.getAccID() : detail.receiver;
    const { cipherText, iv } = await be8.encryptTextSimple(
        sender,
        receiver,
        detail.text
    );
    const options = {
        ...detail,
        ...(detail.groupID
            ? { groupVersionKey: `${detail.groupID}:${groupVersion}` }
            : {}),
        text: cipherText,
        iv,
    };

    await fetch('/writemessage', {
        ...POST,
        body: JSON.stringify(options),
    });
    return detail.done();
});
app.addEventListener('uploadMedia', async function ({ detail }) {
    const groupVersion = detail.isGroup
        ? await groupGetVersion(detail.receiver)
        : false;
    const sender = detail.isGroup
        ? `${detail.receiver}:${groupVersion}`
        : be8.getAccID();
    const receiver = detail.isGroup ? be8.getAccID() : detail.receiver;
    const { cipherImage, iv } = await be8.encryptImageSimple(
        sender,
        receiver,
        detail.content
    );
    const body = {
        ...detail,
        ...(detail.isGroup
            ? { groupVersionKey: `${detail.receiver}:${groupVersion}` }
            : {}),
        content: cipherImage,
        iv,
    };
    const raw = await fetch('/imageupload', {
        ...POST,
        body: JSON.stringify(body),
    });
    const { valid } = await raw.json();

    if (valid) {
        return detail.done();
    }
});
document.addEventListener('DOMContentLoaded', async function bootstrapApp() {
    const database = await initialiseDB$1();
    const raw = await fetch('/me', GET);
    const { error, accObj } = await raw.json();

    if (error === 'NOTAUTH') {
        await firstTimeVisitor(database);
    } else {
        await recurringVisitor(accObj, database);
    }

    setupSSE();
    return setupSW();
});
