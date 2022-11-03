# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['TestBundleSource.test_lit_js 1'] = '''var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/@lit/reactive-element/css-tag.js
var t = window;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var n = /* @__PURE__ */ new WeakMap();
var o = class {
  constructor(t3, e4, n5) {
    if (this._$cssResult$ = true, n5 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t3, this.t = e4;
  }
  get styleSheet() {
    let t3 = this.o;
    const s5 = this.t;
    if (e && void 0 === t3) {
      const e4 = void 0 !== s5 && 1 === s5.length;
      e4 && (t3 = n.get(s5)), void 0 === t3 && ((this.o = t3 = new CSSStyleSheet()).replaceSync(this.cssText), e4 && n.set(s5, t3));
    }
    return t3;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t3) => new o("string" == typeof t3 ? t3 : t3 + "", void 0, s);
var S = (s5, n5) => {
  e ? s5.adoptedStyleSheets = n5.map((t3) => t3 instanceof CSSStyleSheet ? t3 : t3.styleSheet) : n5.forEach((e4) => {
    const n6 = document.createElement("style"), o5 = t.litNonce;
    void 0 !== o5 && n6.setAttribute("nonce", o5), n6.textContent = e4.cssText, s5.appendChild(n6);
  });
};
var c = e ? (t3) => t3 : (t3) => t3 instanceof CSSStyleSheet ? ((t4) => {
  let e4 = "";
  for (const s5 of t4.cssRules)
    e4 += s5.cssText;
  return r(e4);
})(t3) : t3;

// node_modules/@lit/reactive-element/reactive-element.js
var s2;
var e2 = window;
var r2 = e2.trustedTypes;
var h = r2 ? r2.emptyScript : "";
var o2 = e2.reactiveElementPolyfillSupport;
var n2 = { toAttribute(t3, i3) {
  switch (i3) {
    case Boolean:
      t3 = t3 ? h : null;
      break;
    case Object:
    case Array:
      t3 = null == t3 ? t3 : JSON.stringify(t3);
  }
  return t3;
}, fromAttribute(t3, i3) {
  let s5 = t3;
  switch (i3) {
    case Boolean:
      s5 = null !== t3;
      break;
    case Number:
      s5 = null === t3 ? null : Number(t3);
      break;
    case Object:
    case Array:
      try {
        s5 = JSON.parse(t3);
      } catch (t4) {
        s5 = null;
      }
  }
  return s5;
} };
var a = (t3, i3) => i3 !== t3 && (i3 == i3 || t3 == t3);
var l = { attribute: true, type: String, converter: n2, reflect: false, hasChanged: a };
var d = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this.u();
  }
  static addInitializer(t3) {
    var i3;
    null !== (i3 = this.h) && void 0 !== i3 || (this.h = []), this.h.push(t3);
  }
  static get observedAttributes() {
    this.finalize();
    const t3 = [];
    return this.elementProperties.forEach((i3, s5) => {
      const e4 = this._$Ep(s5, i3);
      void 0 !== e4 && (this._$Ev.set(e4, s5), t3.push(e4));
    }), t3;
  }
  static createProperty(t3, i3 = l) {
    if (i3.state && (i3.attribute = false), this.finalize(), this.elementProperties.set(t3, i3), !i3.noAccessor && !this.prototype.hasOwnProperty(t3)) {
      const s5 = "symbol" == typeof t3 ? Symbol() : "__" + t3, e4 = this.getPropertyDescriptor(t3, s5, i3);
      void 0 !== e4 && Object.defineProperty(this.prototype, t3, e4);
    }
  }
  static getPropertyDescriptor(t3, i3, s5) {
    return { get() {
      return this[i3];
    }, set(e4) {
      const r4 = this[t3];
      this[i3] = e4, this.requestUpdate(t3, r4, s5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t3) {
    return this.elementProperties.get(t3) || l;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t3 = Object.getPrototypeOf(this);
    if (t3.finalize(), this.elementProperties = new Map(t3.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t4 = this.properties, i3 = [...Object.getOwnPropertyNames(t4), ...Object.getOwnPropertySymbols(t4)];
      for (const s5 of i3)
        this.createProperty(s5, t4[s5]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i3) {
    const s5 = [];
    if (Array.isArray(i3)) {
      const e4 = new Set(i3.flat(1 / 0).reverse());
      for (const i4 of e4)
        s5.unshift(c(i4));
    } else
      void 0 !== i3 && s5.push(c(i3));
    return s5;
  }
  static _$Ep(t3, i3) {
    const s5 = i3.attribute;
    return false === s5 ? void 0 : "string" == typeof s5 ? s5 : "string" == typeof t3 ? t3.toLowerCase() : void 0;
  }
  u() {
    var t3;
    this._$E_ = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t3 = this.constructor.h) || void 0 === t3 || t3.forEach((t4) => t4(this));
  }
  addController(t3) {
    var i3, s5;
    (null !== (i3 = this._$ES) && void 0 !== i3 ? i3 : this._$ES = []).push(t3), void 0 !== this.renderRoot && this.isConnected && (null === (s5 = t3.hostConnected) || void 0 === s5 || s5.call(t3));
  }
  removeController(t3) {
    var i3;
    null === (i3 = this._$ES) || void 0 === i3 || i3.splice(this._$ES.indexOf(t3) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t3, i3) => {
      this.hasOwnProperty(i3) && (this._$Ei.set(i3, this[i3]), delete this[i3]);
    });
  }
  createRenderRoot() {
    var t3;
    const s5 = null !== (t3 = this.shadowRoot) && void 0 !== t3 ? t3 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(s5, this.constructor.elementStyles), s5;
  }
  connectedCallback() {
    var t3;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t3 = this._$ES) || void 0 === t3 || t3.forEach((t4) => {
      var i3;
      return null === (i3 = t4.hostConnected) || void 0 === i3 ? void 0 : i3.call(t4);
    });
  }
  enableUpdating(t3) {
  }
  disconnectedCallback() {
    var t3;
    null === (t3 = this._$ES) || void 0 === t3 || t3.forEach((t4) => {
      var i3;
      return null === (i3 = t4.hostDisconnected) || void 0 === i3 ? void 0 : i3.call(t4);
    });
  }
  attributeChangedCallback(t3, i3, s5) {
    this._$AK(t3, s5);
  }
  _$EO(t3, i3, s5 = l) {
    var e4;
    const r4 = this.constructor._$Ep(t3, s5);
    if (void 0 !== r4 && true === s5.reflect) {
      const h3 = (void 0 !== (null === (e4 = s5.converter) || void 0 === e4 ? void 0 : e4.toAttribute) ? s5.converter : n2).toAttribute(i3, s5.type);
      this._$El = t3, null == h3 ? this.removeAttribute(r4) : this.setAttribute(r4, h3), this._$El = null;
    }
  }
  _$AK(t3, i3) {
    var s5;
    const e4 = this.constructor, r4 = e4._$Ev.get(t3);
    if (void 0 !== r4 && this._$El !== r4) {
      const t4 = e4.getPropertyOptions(r4), h3 = "function" == typeof t4.converter ? { fromAttribute: t4.converter } : void 0 !== (null === (s5 = t4.converter) || void 0 === s5 ? void 0 : s5.fromAttribute) ? t4.converter : n2;
      this._$El = r4, this[r4] = h3.fromAttribute(i3, t4.type), this._$El = null;
    }
  }
  requestUpdate(t3, i3, s5) {
    let e4 = true;
    void 0 !== t3 && (((s5 = s5 || this.constructor.getPropertyOptions(t3)).hasChanged || a)(this[t3], i3) ? (this._$AL.has(t3) || this._$AL.set(t3, i3), true === s5.reflect && this._$El !== t3 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t3, s5))) : e4 = false), !this.isUpdatePending && e4 && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = true;
    try {
      await this._$E_;
    } catch (t4) {
      Promise.reject(t4);
    }
    const t3 = this.scheduleUpdate();
    return null != t3 && await t3, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t3;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t4, i4) => this[i4] = t4), this._$Ei = void 0);
    let i3 = false;
    const s5 = this._$AL;
    try {
      i3 = this.shouldUpdate(s5), i3 ? (this.willUpdate(s5), null === (t3 = this._$ES) || void 0 === t3 || t3.forEach((t4) => {
        var i4;
        return null === (i4 = t4.hostUpdate) || void 0 === i4 ? void 0 : i4.call(t4);
      }), this.update(s5)) : this._$Ek();
    } catch (t4) {
      throw i3 = false, this._$Ek(), t4;
    }
    i3 && this._$AE(s5);
  }
  willUpdate(t3) {
  }
  _$AE(t3) {
    var i3;
    null === (i3 = this._$ES) || void 0 === i3 || i3.forEach((t4) => {
      var i4;
      return null === (i4 = t4.hostUpdated) || void 0 === i4 ? void 0 : i4.call(t4);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t3)), this.updated(t3);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t3) {
    return true;
  }
  update(t3) {
    void 0 !== this._$EC && (this._$EC.forEach((t4, i3) => this._$EO(i3, this[i3], t4)), this._$EC = void 0), this._$Ek();
  }
  updated(t3) {
  }
  firstUpdated(t3) {
  }
};
d.finalized = true, d.elementProperties = /* @__PURE__ */ new Map(), d.elementStyles = [], d.shadowRootOptions = { mode: "open" }, null == o2 || o2({ ReactiveElement: d }), (null !== (s2 = e2.reactiveElementVersions) && void 0 !== s2 ? s2 : e2.reactiveElementVersions = []).push("1.4.1");

// node_modules/lit-html/lit-html.js
var t2;
var i2 = window;
var s3 = i2.trustedTypes;
var e3 = s3 ? s3.createPolicy("lit-html", { createHTML: (t3) => t3 }) : void 0;
var o3 = `lit$${(Math.random() + "").slice(9)}$`;
var n3 = "?" + o3;
var l2 = `<${n3}>`;
var h2 = document;
var r3 = (t3 = "") => h2.createComment(t3);
var d2 = (t3) => null === t3 || "object" != typeof t3 && "function" != typeof t3;
var u = Array.isArray;
var c2 = (t3) => u(t3) || "function" == typeof (null == t3 ? void 0 : t3[Symbol.iterator]);
var v = /<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))/g;
var a2 = /-->/g;
var f = />/g;
var _ = RegExp(`>|[ \t
\\f\\r](?:([^\\\\s"\'>=/]+)([ \t
\\f\\r]*=[ \t
\\f\\r]*(?:[^ \t
\\f\\r"\'\\`<>=]|("|\')|))|$)`, "g");
var m = /'/g;
var p = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var g = (t3) => (i3, ...s5) => ({ _$litType$: t3, strings: i3, values: s5 });
var y = g(1);
var w = g(2);
var x = Symbol.for("lit-noChange");
var b = Symbol.for("lit-nothing");
var T = /* @__PURE__ */ new WeakMap();
var A = h2.createTreeWalker(h2, 129, null, false);
var E = (t3, i3) => {
  const s5 = t3.length - 1, n5 = [];
  let h3, r4 = 2 === i3 ? "<svg>" : "", d3 = v;
  for (let i4 = 0; i4 < s5; i4++) {
    const s6 = t3[i4];
    let e4, u3, c3 = -1, g2 = 0;
    for (; g2 < s6.length && (d3.lastIndex = g2, u3 = d3.exec(s6), null !== u3); )
      g2 = d3.lastIndex, d3 === v ? "!--" === u3[1] ? d3 = a2 : void 0 !== u3[1] ? d3 = f : void 0 !== u3[2] ? ($.test(u3[2]) && (h3 = RegExp("</" + u3[2], "g")), d3 = _) : void 0 !== u3[3] && (d3 = _) : d3 === _ ? ">" === u3[0] ? (d3 = null != h3 ? h3 : v, c3 = -1) : void 0 === u3[1] ? c3 = -2 : (c3 = d3.lastIndex - u3[2].length, e4 = u3[1], d3 = void 0 === u3[3] ? _ : \'"\' === u3[3] ? p : m) : d3 === p || d3 === m ? d3 = _ : d3 === a2 || d3 === f ? d3 = v : (d3 = _, h3 = void 0);
    const y2 = d3 === _ && t3[i4 + 1].startsWith("/>") ? " " : "";
    r4 += d3 === v ? s6 + l2 : c3 >= 0 ? (n5.push(e4), s6.slice(0, c3) + "$lit$" + s6.slice(c3) + o3 + y2) : s6 + o3 + (-2 === c3 ? (n5.push(void 0), i4) : y2);
  }
  const u2 = r4 + (t3[s5] || "<?>") + (2 === i3 ? "</svg>" : "");
  if (!Array.isArray(t3) || !t3.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [void 0 !== e3 ? e3.createHTML(u2) : u2, n5];
};
var C = class {
  constructor({ strings: t3, _$litType$: i3 }, e4) {
    let l4;
    this.parts = [];
    let h3 = 0, d3 = 0;
    const u2 = t3.length - 1, c3 = this.parts, [v2, a3] = E(t3, i3);
    if (this.el = C.createElement(v2, e4), A.currentNode = this.el.content, 2 === i3) {
      const t4 = this.el.content, i4 = t4.firstChild;
      i4.remove(), t4.append(...i4.childNodes);
    }
    for (; null !== (l4 = A.nextNode()) && c3.length < u2; ) {
      if (1 === l4.nodeType) {
        if (l4.hasAttributes()) {
          const t4 = [];
          for (const i4 of l4.getAttributeNames())
            if (i4.endsWith("$lit$") || i4.startsWith(o3)) {
              const s5 = a3[d3++];
              if (t4.push(i4), void 0 !== s5) {
                const t5 = l4.getAttribute(s5.toLowerCase() + "$lit$").split(o3), i5 = /([.?@])?(.*)/.exec(s5);
                c3.push({ type: 1, index: h3, name: i5[2], strings: t5, ctor: "." === i5[1] ? M : "?" === i5[1] ? k : "@" === i5[1] ? H : S2 });
              } else
                c3.push({ type: 6, index: h3 });
            }
          for (const i4 of t4)
            l4.removeAttribute(i4);
        }
        if ($.test(l4.tagName)) {
          const t4 = l4.textContent.split(o3), i4 = t4.length - 1;
          if (i4 > 0) {
            l4.textContent = s3 ? s3.emptyScript : "";
            for (let s5 = 0; s5 < i4; s5++)
              l4.append(t4[s5], r3()), A.nextNode(), c3.push({ type: 2, index: ++h3 });
            l4.append(t4[i4], r3());
          }
        }
      } else if (8 === l4.nodeType)
        if (l4.data === n3)
          c3.push({ type: 2, index: h3 });
        else {
          let t4 = -1;
          for (; -1 !== (t4 = l4.data.indexOf(o3, t4 + 1)); )
            c3.push({ type: 7, index: h3 }), t4 += o3.length - 1;
        }
      h3++;
    }
  }
  static createElement(t3, i3) {
    const s5 = h2.createElement("template");
    return s5.innerHTML = t3, s5;
  }
};
function P(t3, i3, s5 = t3, e4) {
  var o5, n5, l4, h3;
  if (i3 === x)
    return i3;
  let r4 = void 0 !== e4 ? null === (o5 = s5._$Co) || void 0 === o5 ? void 0 : o5[e4] : s5._$Cl;
  const u2 = d2(i3) ? void 0 : i3._$litDirective$;
  return (null == r4 ? void 0 : r4.constructor) !== u2 && (null === (n5 = null == r4 ? void 0 : r4._$AO) || void 0 === n5 || n5.call(r4, false), void 0 === u2 ? r4 = void 0 : (r4 = new u2(t3), r4._$AT(t3, s5, e4)), void 0 !== e4 ? (null !== (l4 = (h3 = s5)._$Co) && void 0 !== l4 ? l4 : h3._$Co = [])[e4] = r4 : s5._$Cl = r4), void 0 !== r4 && (i3 = P(t3, r4._$AS(t3, i3.values), r4, e4)), i3;
}
var V = class {
  constructor(t3, i3) {
    this.u = [], this._$AN = void 0, this._$AD = t3, this._$AM = i3;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  v(t3) {
    var i3;
    const { el: { content: s5 }, parts: e4 } = this._$AD, o5 = (null !== (i3 = null == t3 ? void 0 : t3.creationScope) && void 0 !== i3 ? i3 : h2).importNode(s5, true);
    A.currentNode = o5;
    let n5 = A.nextNode(), l4 = 0, r4 = 0, d3 = e4[0];
    for (; void 0 !== d3; ) {
      if (l4 === d3.index) {
        let i4;
        2 === d3.type ? i4 = new N(n5, n5.nextSibling, this, t3) : 1 === d3.type ? i4 = new d3.ctor(n5, d3.name, d3.strings, this, t3) : 6 === d3.type && (i4 = new I(n5, this, t3)), this.u.push(i4), d3 = e4[++r4];
      }
      l4 !== (null == d3 ? void 0 : d3.index) && (n5 = A.nextNode(), l4++);
    }
    return o5;
  }
  p(t3) {
    let i3 = 0;
    for (const s5 of this.u)
      void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t3, s5, i3), i3 += s5.strings.length - 2) : s5._$AI(t3[i3])), i3++;
  }
};
var N = class {
  constructor(t3, i3, s5, e4) {
    var o5;
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = t3, this._$AB = i3, this._$AM = s5, this.options = e4, this._$Cm = null === (o5 = null == e4 ? void 0 : e4.isConnected) || void 0 === o5 || o5;
  }
  get _$AU() {
    var t3, i3;
    return null !== (i3 = null === (t3 = this._$AM) || void 0 === t3 ? void 0 : t3._$AU) && void 0 !== i3 ? i3 : this._$Cm;
  }
  get parentNode() {
    let t3 = this._$AA.parentNode;
    const i3 = this._$AM;
    return void 0 !== i3 && 11 === t3.nodeType && (t3 = i3.parentNode), t3;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t3, i3 = this) {
    t3 = P(this, t3, i3), d2(t3) ? t3 === b || null == t3 || "" === t3 ? (this._$AH !== b && this._$AR(), this._$AH = b) : t3 !== this._$AH && t3 !== x && this.g(t3) : void 0 !== t3._$litType$ ? this.$(t3) : void 0 !== t3.nodeType ? this.T(t3) : c2(t3) ? this.k(t3) : this.g(t3);
  }
  O(t3, i3 = this._$AB) {
    return this._$AA.parentNode.insertBefore(t3, i3);
  }
  T(t3) {
    this._$AH !== t3 && (this._$AR(), this._$AH = this.O(t3));
  }
  g(t3) {
    this._$AH !== b && d2(this._$AH) ? this._$AA.nextSibling.data = t3 : this.T(h2.createTextNode(t3)), this._$AH = t3;
  }
  $(t3) {
    var i3;
    const { values: s5, _$litType$: e4 } = t3, o5 = "number" == typeof e4 ? this._$AC(t3) : (void 0 === e4.el && (e4.el = C.createElement(e4.h, this.options)), e4);
    if ((null === (i3 = this._$AH) || void 0 === i3 ? void 0 : i3._$AD) === o5)
      this._$AH.p(s5);
    else {
      const t4 = new V(o5, this), i4 = t4.v(this.options);
      t4.p(s5), this.T(i4), this._$AH = t4;
    }
  }
  _$AC(t3) {
    let i3 = T.get(t3.strings);
    return void 0 === i3 && T.set(t3.strings, i3 = new C(t3)), i3;
  }
  k(t3) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i3 = this._$AH;
    let s5, e4 = 0;
    for (const o5 of t3)
      e4 === i3.length ? i3.push(s5 = new N(this.O(r3()), this.O(r3()), this, this.options)) : s5 = i3[e4], s5._$AI(o5), e4++;
    e4 < i3.length && (this._$AR(s5 && s5._$AB.nextSibling, e4), i3.length = e4);
  }
  _$AR(t3 = this._$AA.nextSibling, i3) {
    var s5;
    for (null === (s5 = this._$AP) || void 0 === s5 || s5.call(this, false, true, i3); t3 && t3 !== this._$AB; ) {
      const i4 = t3.nextSibling;
      t3.remove(), t3 = i4;
    }
  }
  setConnected(t3) {
    var i3;
    void 0 === this._$AM && (this._$Cm = t3, null === (i3 = this._$AP) || void 0 === i3 || i3.call(this, t3));
  }
};
var S2 = class {
  constructor(t3, i3, s5, e4, o5) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = t3, this.name = i3, this._$AM = e4, this.options = o5, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = b;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3, i3 = this, s5, e4) {
    const o5 = this.strings;
    let n5 = false;
    if (void 0 === o5)
      t3 = P(this, t3, i3, 0), n5 = !d2(t3) || t3 !== this._$AH && t3 !== x, n5 && (this._$AH = t3);
    else {
      const e5 = t3;
      let l4, h3;
      for (t3 = o5[0], l4 = 0; l4 < o5.length - 1; l4++)
        h3 = P(this, e5[s5 + l4], i3, l4), h3 === x && (h3 = this._$AH[l4]), n5 || (n5 = !d2(h3) || h3 !== this._$AH[l4]), h3 === b ? t3 = b : t3 !== b && (t3 += (null != h3 ? h3 : "") + o5[l4 + 1]), this._$AH[l4] = h3;
    }
    n5 && !e4 && this.j(t3);
  }
  j(t3) {
    t3 === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t3 ? t3 : "");
  }
};
var M = class extends S2 {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t3) {
    this.element[this.name] = t3 === b ? void 0 : t3;
  }
};
var R = s3 ? s3.emptyScript : "";
var k = class extends S2 {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t3) {
    t3 && t3 !== b ? this.element.setAttribute(this.name, R) : this.element.removeAttribute(this.name);
  }
};
var H = class extends S2 {
  constructor(t3, i3, s5, e4, o5) {
    super(t3, i3, s5, e4, o5), this.type = 5;
  }
  _$AI(t3, i3 = this) {
    var s5;
    if ((t3 = null !== (s5 = P(this, t3, i3, 0)) && void 0 !== s5 ? s5 : b) === x)
      return;
    const e4 = this._$AH, o5 = t3 === b && e4 !== b || t3.capture !== e4.capture || t3.once !== e4.once || t3.passive !== e4.passive, n5 = t3 !== b && (e4 === b || o5);
    o5 && this.element.removeEventListener(this.name, this, e4), n5 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
  }
  handleEvent(t3) {
    var i3, s5;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s5 = null === (i3 = this.options) || void 0 === i3 ? void 0 : i3.host) && void 0 !== s5 ? s5 : this.element, t3) : this._$AH.handleEvent(t3);
  }
};
var I = class {
  constructor(t3, i3, s5) {
    this.element = t3, this.type = 6, this._$AN = void 0, this._$AM = i3, this.options = s5;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3) {
    P(this, t3);
  }
};
var z = i2.litHtmlPolyfillSupport;
null == z || z(C, N), (null !== (t2 = i2.litHtmlVersions) && void 0 !== t2 ? t2 : i2.litHtmlVersions = []).push("2.4.0");
var Z = (t3, i3, s5) => {
  var e4, o5;
  const n5 = null !== (e4 = null == s5 ? void 0 : s5.renderBefore) && void 0 !== e4 ? e4 : i3;
  let l4 = n5._$litPart$;
  if (void 0 === l4) {
    const t4 = null !== (o5 = null == s5 ? void 0 : s5.renderBefore) && void 0 !== o5 ? o5 : null;
    n5._$litPart$ = l4 = new N(i3.insertBefore(r3(), t4), t4, void 0, null != s5 ? s5 : {});
  }
  return l4._$AI(t3), l4;
};

// node_modules/lit-element/lit-element.js
var l3;
var o4;
var s4 = class extends d {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t3, e4;
    const i3 = super.createRenderRoot();
    return null !== (t3 = (e4 = this.renderOptions).renderBefore) && void 0 !== t3 || (e4.renderBefore = i3.firstChild), i3;
  }
  update(t3) {
    const i3 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t3), this._$Do = Z(i3, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t3;
    super.connectedCallback(), null === (t3 = this._$Do) || void 0 === t3 || t3.setConnected(true);
  }
  disconnectedCallback() {
    var t3;
    super.disconnectedCallback(), null === (t3 = this._$Do) || void 0 === t3 || t3.setConnected(false);
  }
  render() {
    return x;
  }
};
s4.finalized = true, s4._$litElement$ = true, null === (l3 = globalThis.litElementHydrateSupport) || void 0 === l3 || l3.call(globalThis, { LitElement: s4 });
var n4 = globalThis.litElementPolyfillSupport;
null == n4 || n4({ LitElement: s4 });
(null !== (o4 = globalThis.litElementVersions) && void 0 !== o4 ? o4 : globalThis.litElementVersions = []).push("3.2.2");

// visualizations/examples/lit.js
var CustomVisualization = class extends s4 {
  constructor() {
    super();
    this.name = "Somebody";
  }
  render() {
    return y`<p>Hello, ${this.name}!</p>`;
  }
};
__publicField(CustomVisualization, "properties", {
  name: { type: String }
});
export {
  CustomVisualization as default
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
'''

snapshots['TestBundleSource.test_lit_ts 1'] = '''var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// node_modules/@lit/reactive-element/css-tag.js
var t = window;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var n = /* @__PURE__ */ new WeakMap();
var o = class {
  constructor(t3, e6, n6) {
    if (this._$cssResult$ = true, n6 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t3, this.t = e6;
  }
  get styleSheet() {
    let t3 = this.o;
    const s5 = this.t;
    if (e && void 0 === t3) {
      const e6 = void 0 !== s5 && 1 === s5.length;
      e6 && (t3 = n.get(s5)), void 0 === t3 && ((this.o = t3 = new CSSStyleSheet()).replaceSync(this.cssText), e6 && n.set(s5, t3));
    }
    return t3;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t3) => new o("string" == typeof t3 ? t3 : t3 + "", void 0, s);
var S = (s5, n6) => {
  e ? s5.adoptedStyleSheets = n6.map((t3) => t3 instanceof CSSStyleSheet ? t3 : t3.styleSheet) : n6.forEach((e6) => {
    const n7 = document.createElement("style"), o6 = t.litNonce;
    void 0 !== o6 && n7.setAttribute("nonce", o6), n7.textContent = e6.cssText, s5.appendChild(n7);
  });
};
var c = e ? (t3) => t3 : (t3) => t3 instanceof CSSStyleSheet ? ((t4) => {
  let e6 = "";
  for (const s5 of t4.cssRules)
    e6 += s5.cssText;
  return r(e6);
})(t3) : t3;

// node_modules/@lit/reactive-element/reactive-element.js
var s2;
var e2 = window;
var r2 = e2.trustedTypes;
var h = r2 ? r2.emptyScript : "";
var o2 = e2.reactiveElementPolyfillSupport;
var n2 = { toAttribute(t3, i4) {
  switch (i4) {
    case Boolean:
      t3 = t3 ? h : null;
      break;
    case Object:
    case Array:
      t3 = null == t3 ? t3 : JSON.stringify(t3);
  }
  return t3;
}, fromAttribute(t3, i4) {
  let s5 = t3;
  switch (i4) {
    case Boolean:
      s5 = null !== t3;
      break;
    case Number:
      s5 = null === t3 ? null : Number(t3);
      break;
    case Object:
    case Array:
      try {
        s5 = JSON.parse(t3);
      } catch (t4) {
        s5 = null;
      }
  }
  return s5;
} };
var a = (t3, i4) => i4 !== t3 && (i4 == i4 || t3 == t3);
var l = { attribute: true, type: String, converter: n2, reflect: false, hasChanged: a };
var d = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this.u();
  }
  static addInitializer(t3) {
    var i4;
    null !== (i4 = this.h) && void 0 !== i4 || (this.h = []), this.h.push(t3);
  }
  static get observedAttributes() {
    this.finalize();
    const t3 = [];
    return this.elementProperties.forEach((i4, s5) => {
      const e6 = this._$Ep(s5, i4);
      void 0 !== e6 && (this._$Ev.set(e6, s5), t3.push(e6));
    }), t3;
  }
  static createProperty(t3, i4 = l) {
    if (i4.state && (i4.attribute = false), this.finalize(), this.elementProperties.set(t3, i4), !i4.noAccessor && !this.prototype.hasOwnProperty(t3)) {
      const s5 = "symbol" == typeof t3 ? Symbol() : "__" + t3, e6 = this.getPropertyDescriptor(t3, s5, i4);
      void 0 !== e6 && Object.defineProperty(this.prototype, t3, e6);
    }
  }
  static getPropertyDescriptor(t3, i4, s5) {
    return { get() {
      return this[i4];
    }, set(e6) {
      const r4 = this[t3];
      this[i4] = e6, this.requestUpdate(t3, r4, s5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t3) {
    return this.elementProperties.get(t3) || l;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t3 = Object.getPrototypeOf(this);
    if (t3.finalize(), this.elementProperties = new Map(t3.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t4 = this.properties, i4 = [...Object.getOwnPropertyNames(t4), ...Object.getOwnPropertySymbols(t4)];
      for (const s5 of i4)
        this.createProperty(s5, t4[s5]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i4) {
    const s5 = [];
    if (Array.isArray(i4)) {
      const e6 = new Set(i4.flat(1 / 0).reverse());
      for (const i5 of e6)
        s5.unshift(c(i5));
    } else
      void 0 !== i4 && s5.push(c(i4));
    return s5;
  }
  static _$Ep(t3, i4) {
    const s5 = i4.attribute;
    return false === s5 ? void 0 : "string" == typeof s5 ? s5 : "string" == typeof t3 ? t3.toLowerCase() : void 0;
  }
  u() {
    var t3;
    this._$E_ = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t3 = this.constructor.h) || void 0 === t3 || t3.forEach((t4) => t4(this));
  }
  addController(t3) {
    var i4, s5;
    (null !== (i4 = this._$ES) && void 0 !== i4 ? i4 : this._$ES = []).push(t3), void 0 !== this.renderRoot && this.isConnected && (null === (s5 = t3.hostConnected) || void 0 === s5 || s5.call(t3));
  }
  removeController(t3) {
    var i4;
    null === (i4 = this._$ES) || void 0 === i4 || i4.splice(this._$ES.indexOf(t3) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t3, i4) => {
      this.hasOwnProperty(i4) && (this._$Ei.set(i4, this[i4]), delete this[i4]);
    });
  }
  createRenderRoot() {
    var t3;
    const s5 = null !== (t3 = this.shadowRoot) && void 0 !== t3 ? t3 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(s5, this.constructor.elementStyles), s5;
  }
  connectedCallback() {
    var t3;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t3 = this._$ES) || void 0 === t3 || t3.forEach((t4) => {
      var i4;
      return null === (i4 = t4.hostConnected) || void 0 === i4 ? void 0 : i4.call(t4);
    });
  }
  enableUpdating(t3) {
  }
  disconnectedCallback() {
    var t3;
    null === (t3 = this._$ES) || void 0 === t3 || t3.forEach((t4) => {
      var i4;
      return null === (i4 = t4.hostDisconnected) || void 0 === i4 ? void 0 : i4.call(t4);
    });
  }
  attributeChangedCallback(t3, i4, s5) {
    this._$AK(t3, s5);
  }
  _$EO(t3, i4, s5 = l) {
    var e6;
    const r4 = this.constructor._$Ep(t3, s5);
    if (void 0 !== r4 && true === s5.reflect) {
      const h3 = (void 0 !== (null === (e6 = s5.converter) || void 0 === e6 ? void 0 : e6.toAttribute) ? s5.converter : n2).toAttribute(i4, s5.type);
      this._$El = t3, null == h3 ? this.removeAttribute(r4) : this.setAttribute(r4, h3), this._$El = null;
    }
  }
  _$AK(t3, i4) {
    var s5;
    const e6 = this.constructor, r4 = e6._$Ev.get(t3);
    if (void 0 !== r4 && this._$El !== r4) {
      const t4 = e6.getPropertyOptions(r4), h3 = "function" == typeof t4.converter ? { fromAttribute: t4.converter } : void 0 !== (null === (s5 = t4.converter) || void 0 === s5 ? void 0 : s5.fromAttribute) ? t4.converter : n2;
      this._$El = r4, this[r4] = h3.fromAttribute(i4, t4.type), this._$El = null;
    }
  }
  requestUpdate(t3, i4, s5) {
    let e6 = true;
    void 0 !== t3 && (((s5 = s5 || this.constructor.getPropertyOptions(t3)).hasChanged || a)(this[t3], i4) ? (this._$AL.has(t3) || this._$AL.set(t3, i4), true === s5.reflect && this._$El !== t3 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t3, s5))) : e6 = false), !this.isUpdatePending && e6 && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = true;
    try {
      await this._$E_;
    } catch (t4) {
      Promise.reject(t4);
    }
    const t3 = this.scheduleUpdate();
    return null != t3 && await t3, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t3;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t4, i5) => this[i5] = t4), this._$Ei = void 0);
    let i4 = false;
    const s5 = this._$AL;
    try {
      i4 = this.shouldUpdate(s5), i4 ? (this.willUpdate(s5), null === (t3 = this._$ES) || void 0 === t3 || t3.forEach((t4) => {
        var i5;
        return null === (i5 = t4.hostUpdate) || void 0 === i5 ? void 0 : i5.call(t4);
      }), this.update(s5)) : this._$Ek();
    } catch (t4) {
      throw i4 = false, this._$Ek(), t4;
    }
    i4 && this._$AE(s5);
  }
  willUpdate(t3) {
  }
  _$AE(t3) {
    var i4;
    null === (i4 = this._$ES) || void 0 === i4 || i4.forEach((t4) => {
      var i5;
      return null === (i5 = t4.hostUpdated) || void 0 === i5 ? void 0 : i5.call(t4);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t3)), this.updated(t3);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t3) {
    return true;
  }
  update(t3) {
    void 0 !== this._$EC && (this._$EC.forEach((t4, i4) => this._$EO(i4, this[i4], t4)), this._$EC = void 0), this._$Ek();
  }
  updated(t3) {
  }
  firstUpdated(t3) {
  }
};
d.finalized = true, d.elementProperties = /* @__PURE__ */ new Map(), d.elementStyles = [], d.shadowRootOptions = { mode: "open" }, null == o2 || o2({ ReactiveElement: d }), (null !== (s2 = e2.reactiveElementVersions) && void 0 !== s2 ? s2 : e2.reactiveElementVersions = []).push("1.4.1");

// node_modules/lit-html/lit-html.js
var t2;
var i2 = window;
var s3 = i2.trustedTypes;
var e3 = s3 ? s3.createPolicy("lit-html", { createHTML: (t3) => t3 }) : void 0;
var o3 = `lit$${(Math.random() + "").slice(9)}$`;
var n3 = "?" + o3;
var l2 = `<${n3}>`;
var h2 = document;
var r3 = (t3 = "") => h2.createComment(t3);
var d2 = (t3) => null === t3 || "object" != typeof t3 && "function" != typeof t3;
var u = Array.isArray;
var c2 = (t3) => u(t3) || "function" == typeof (null == t3 ? void 0 : t3[Symbol.iterator]);
var v = /<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))/g;
var a2 = /-->/g;
var f = />/g;
var _ = RegExp(`>|[ \t
\\f\\r](?:([^\\\\s"\'>=/]+)([ \t
\\f\\r]*=[ \t
\\f\\r]*(?:[^ \t
\\f\\r"\'\\`<>=]|("|\')|))|$)`, "g");
var m = /'/g;
var p = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var g = (t3) => (i4, ...s5) => ({ _$litType$: t3, strings: i4, values: s5 });
var y = g(1);
var w = g(2);
var x = Symbol.for("lit-noChange");
var b = Symbol.for("lit-nothing");
var T = /* @__PURE__ */ new WeakMap();
var A = h2.createTreeWalker(h2, 129, null, false);
var E = (t3, i4) => {
  const s5 = t3.length - 1, n6 = [];
  let h3, r4 = 2 === i4 ? "<svg>" : "", d3 = v;
  for (let i5 = 0; i5 < s5; i5++) {
    const s6 = t3[i5];
    let e6, u3, c3 = -1, g2 = 0;
    for (; g2 < s6.length && (d3.lastIndex = g2, u3 = d3.exec(s6), null !== u3); )
      g2 = d3.lastIndex, d3 === v ? "!--" === u3[1] ? d3 = a2 : void 0 !== u3[1] ? d3 = f : void 0 !== u3[2] ? ($.test(u3[2]) && (h3 = RegExp("</" + u3[2], "g")), d3 = _) : void 0 !== u3[3] && (d3 = _) : d3 === _ ? ">" === u3[0] ? (d3 = null != h3 ? h3 : v, c3 = -1) : void 0 === u3[1] ? c3 = -2 : (c3 = d3.lastIndex - u3[2].length, e6 = u3[1], d3 = void 0 === u3[3] ? _ : \'"\' === u3[3] ? p : m) : d3 === p || d3 === m ? d3 = _ : d3 === a2 || d3 === f ? d3 = v : (d3 = _, h3 = void 0);
    const y2 = d3 === _ && t3[i5 + 1].startsWith("/>") ? " " : "";
    r4 += d3 === v ? s6 + l2 : c3 >= 0 ? (n6.push(e6), s6.slice(0, c3) + "$lit$" + s6.slice(c3) + o3 + y2) : s6 + o3 + (-2 === c3 ? (n6.push(void 0), i5) : y2);
  }
  const u2 = r4 + (t3[s5] || "<?>") + (2 === i4 ? "</svg>" : "");
  if (!Array.isArray(t3) || !t3.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [void 0 !== e3 ? e3.createHTML(u2) : u2, n6];
};
var C = class {
  constructor({ strings: t3, _$litType$: i4 }, e6) {
    let l5;
    this.parts = [];
    let h3 = 0, d3 = 0;
    const u2 = t3.length - 1, c3 = this.parts, [v2, a3] = E(t3, i4);
    if (this.el = C.createElement(v2, e6), A.currentNode = this.el.content, 2 === i4) {
      const t4 = this.el.content, i5 = t4.firstChild;
      i5.remove(), t4.append(...i5.childNodes);
    }
    for (; null !== (l5 = A.nextNode()) && c3.length < u2; ) {
      if (1 === l5.nodeType) {
        if (l5.hasAttributes()) {
          const t4 = [];
          for (const i5 of l5.getAttributeNames())
            if (i5.endsWith("$lit$") || i5.startsWith(o3)) {
              const s5 = a3[d3++];
              if (t4.push(i5), void 0 !== s5) {
                const t5 = l5.getAttribute(s5.toLowerCase() + "$lit$").split(o3), i6 = /([.?@])?(.*)/.exec(s5);
                c3.push({ type: 1, index: h3, name: i6[2], strings: t5, ctor: "." === i6[1] ? M : "?" === i6[1] ? k : "@" === i6[1] ? H : S2 });
              } else
                c3.push({ type: 6, index: h3 });
            }
          for (const i5 of t4)
            l5.removeAttribute(i5);
        }
        if ($.test(l5.tagName)) {
          const t4 = l5.textContent.split(o3), i5 = t4.length - 1;
          if (i5 > 0) {
            l5.textContent = s3 ? s3.emptyScript : "";
            for (let s5 = 0; s5 < i5; s5++)
              l5.append(t4[s5], r3()), A.nextNode(), c3.push({ type: 2, index: ++h3 });
            l5.append(t4[i5], r3());
          }
        }
      } else if (8 === l5.nodeType)
        if (l5.data === n3)
          c3.push({ type: 2, index: h3 });
        else {
          let t4 = -1;
          for (; -1 !== (t4 = l5.data.indexOf(o3, t4 + 1)); )
            c3.push({ type: 7, index: h3 }), t4 += o3.length - 1;
        }
      h3++;
    }
  }
  static createElement(t3, i4) {
    const s5 = h2.createElement("template");
    return s5.innerHTML = t3, s5;
  }
};
function P(t3, i4, s5 = t3, e6) {
  var o6, n6, l5, h3;
  if (i4 === x)
    return i4;
  let r4 = void 0 !== e6 ? null === (o6 = s5._$Co) || void 0 === o6 ? void 0 : o6[e6] : s5._$Cl;
  const u2 = d2(i4) ? void 0 : i4._$litDirective$;
  return (null == r4 ? void 0 : r4.constructor) !== u2 && (null === (n6 = null == r4 ? void 0 : r4._$AO) || void 0 === n6 || n6.call(r4, false), void 0 === u2 ? r4 = void 0 : (r4 = new u2(t3), r4._$AT(t3, s5, e6)), void 0 !== e6 ? (null !== (l5 = (h3 = s5)._$Co) && void 0 !== l5 ? l5 : h3._$Co = [])[e6] = r4 : s5._$Cl = r4), void 0 !== r4 && (i4 = P(t3, r4._$AS(t3, i4.values), r4, e6)), i4;
}
var V = class {
  constructor(t3, i4) {
    this.u = [], this._$AN = void 0, this._$AD = t3, this._$AM = i4;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  v(t3) {
    var i4;
    const { el: { content: s5 }, parts: e6 } = this._$AD, o6 = (null !== (i4 = null == t3 ? void 0 : t3.creationScope) && void 0 !== i4 ? i4 : h2).importNode(s5, true);
    A.currentNode = o6;
    let n6 = A.nextNode(), l5 = 0, r4 = 0, d3 = e6[0];
    for (; void 0 !== d3; ) {
      if (l5 === d3.index) {
        let i5;
        2 === d3.type ? i5 = new N(n6, n6.nextSibling, this, t3) : 1 === d3.type ? i5 = new d3.ctor(n6, d3.name, d3.strings, this, t3) : 6 === d3.type && (i5 = new I(n6, this, t3)), this.u.push(i5), d3 = e6[++r4];
      }
      l5 !== (null == d3 ? void 0 : d3.index) && (n6 = A.nextNode(), l5++);
    }
    return o6;
  }
  p(t3) {
    let i4 = 0;
    for (const s5 of this.u)
      void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t3, s5, i4), i4 += s5.strings.length - 2) : s5._$AI(t3[i4])), i4++;
  }
};
var N = class {
  constructor(t3, i4, s5, e6) {
    var o6;
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = t3, this._$AB = i4, this._$AM = s5, this.options = e6, this._$Cm = null === (o6 = null == e6 ? void 0 : e6.isConnected) || void 0 === o6 || o6;
  }
  get _$AU() {
    var t3, i4;
    return null !== (i4 = null === (t3 = this._$AM) || void 0 === t3 ? void 0 : t3._$AU) && void 0 !== i4 ? i4 : this._$Cm;
  }
  get parentNode() {
    let t3 = this._$AA.parentNode;
    const i4 = this._$AM;
    return void 0 !== i4 && 11 === t3.nodeType && (t3 = i4.parentNode), t3;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t3, i4 = this) {
    t3 = P(this, t3, i4), d2(t3) ? t3 === b || null == t3 || "" === t3 ? (this._$AH !== b && this._$AR(), this._$AH = b) : t3 !== this._$AH && t3 !== x && this.g(t3) : void 0 !== t3._$litType$ ? this.$(t3) : void 0 !== t3.nodeType ? this.T(t3) : c2(t3) ? this.k(t3) : this.g(t3);
  }
  O(t3, i4 = this._$AB) {
    return this._$AA.parentNode.insertBefore(t3, i4);
  }
  T(t3) {
    this._$AH !== t3 && (this._$AR(), this._$AH = this.O(t3));
  }
  g(t3) {
    this._$AH !== b && d2(this._$AH) ? this._$AA.nextSibling.data = t3 : this.T(h2.createTextNode(t3)), this._$AH = t3;
  }
  $(t3) {
    var i4;
    const { values: s5, _$litType$: e6 } = t3, o6 = "number" == typeof e6 ? this._$AC(t3) : (void 0 === e6.el && (e6.el = C.createElement(e6.h, this.options)), e6);
    if ((null === (i4 = this._$AH) || void 0 === i4 ? void 0 : i4._$AD) === o6)
      this._$AH.p(s5);
    else {
      const t4 = new V(o6, this), i5 = t4.v(this.options);
      t4.p(s5), this.T(i5), this._$AH = t4;
    }
  }
  _$AC(t3) {
    let i4 = T.get(t3.strings);
    return void 0 === i4 && T.set(t3.strings, i4 = new C(t3)), i4;
  }
  k(t3) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i4 = this._$AH;
    let s5, e6 = 0;
    for (const o6 of t3)
      e6 === i4.length ? i4.push(s5 = new N(this.O(r3()), this.O(r3()), this, this.options)) : s5 = i4[e6], s5._$AI(o6), e6++;
    e6 < i4.length && (this._$AR(s5 && s5._$AB.nextSibling, e6), i4.length = e6);
  }
  _$AR(t3 = this._$AA.nextSibling, i4) {
    var s5;
    for (null === (s5 = this._$AP) || void 0 === s5 || s5.call(this, false, true, i4); t3 && t3 !== this._$AB; ) {
      const i5 = t3.nextSibling;
      t3.remove(), t3 = i5;
    }
  }
  setConnected(t3) {
    var i4;
    void 0 === this._$AM && (this._$Cm = t3, null === (i4 = this._$AP) || void 0 === i4 || i4.call(this, t3));
  }
};
var S2 = class {
  constructor(t3, i4, s5, e6, o6) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = t3, this.name = i4, this._$AM = e6, this.options = o6, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = b;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3, i4 = this, s5, e6) {
    const o6 = this.strings;
    let n6 = false;
    if (void 0 === o6)
      t3 = P(this, t3, i4, 0), n6 = !d2(t3) || t3 !== this._$AH && t3 !== x, n6 && (this._$AH = t3);
    else {
      const e7 = t3;
      let l5, h3;
      for (t3 = o6[0], l5 = 0; l5 < o6.length - 1; l5++)
        h3 = P(this, e7[s5 + l5], i4, l5), h3 === x && (h3 = this._$AH[l5]), n6 || (n6 = !d2(h3) || h3 !== this._$AH[l5]), h3 === b ? t3 = b : t3 !== b && (t3 += (null != h3 ? h3 : "") + o6[l5 + 1]), this._$AH[l5] = h3;
    }
    n6 && !e6 && this.j(t3);
  }
  j(t3) {
    t3 === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t3 ? t3 : "");
  }
};
var M = class extends S2 {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t3) {
    this.element[this.name] = t3 === b ? void 0 : t3;
  }
};
var R = s3 ? s3.emptyScript : "";
var k = class extends S2 {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t3) {
    t3 && t3 !== b ? this.element.setAttribute(this.name, R) : this.element.removeAttribute(this.name);
  }
};
var H = class extends S2 {
  constructor(t3, i4, s5, e6, o6) {
    super(t3, i4, s5, e6, o6), this.type = 5;
  }
  _$AI(t3, i4 = this) {
    var s5;
    if ((t3 = null !== (s5 = P(this, t3, i4, 0)) && void 0 !== s5 ? s5 : b) === x)
      return;
    const e6 = this._$AH, o6 = t3 === b && e6 !== b || t3.capture !== e6.capture || t3.once !== e6.once || t3.passive !== e6.passive, n6 = t3 !== b && (e6 === b || o6);
    o6 && this.element.removeEventListener(this.name, this, e6), n6 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
  }
  handleEvent(t3) {
    var i4, s5;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s5 = null === (i4 = this.options) || void 0 === i4 ? void 0 : i4.host) && void 0 !== s5 ? s5 : this.element, t3) : this._$AH.handleEvent(t3);
  }
};
var I = class {
  constructor(t3, i4, s5) {
    this.element = t3, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s5;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3) {
    P(this, t3);
  }
};
var z = i2.litHtmlPolyfillSupport;
null == z || z(C, N), (null !== (t2 = i2.litHtmlVersions) && void 0 !== t2 ? t2 : i2.litHtmlVersions = []).push("2.4.0");
var Z = (t3, i4, s5) => {
  var e6, o6;
  const n6 = null !== (e6 = null == s5 ? void 0 : s5.renderBefore) && void 0 !== e6 ? e6 : i4;
  let l5 = n6._$litPart$;
  if (void 0 === l5) {
    const t4 = null !== (o6 = null == s5 ? void 0 : s5.renderBefore) && void 0 !== o6 ? o6 : null;
    n6._$litPart$ = l5 = new N(i4.insertBefore(r3(), t4), t4, void 0, null != s5 ? s5 : {});
  }
  return l5._$AI(t3), l5;
};

// node_modules/lit-element/lit-element.js
var l3;
var o4;
var s4 = class extends d {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t3, e6;
    const i4 = super.createRenderRoot();
    return null !== (t3 = (e6 = this.renderOptions).renderBefore) && void 0 !== t3 || (e6.renderBefore = i4.firstChild), i4;
  }
  update(t3) {
    const i4 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t3), this._$Do = Z(i4, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t3;
    super.connectedCallback(), null === (t3 = this._$Do) || void 0 === t3 || t3.setConnected(true);
  }
  disconnectedCallback() {
    var t3;
    super.disconnectedCallback(), null === (t3 = this._$Do) || void 0 === t3 || t3.setConnected(false);
  }
  render() {
    return x;
  }
};
s4.finalized = true, s4._$litElement$ = true, null === (l3 = globalThis.litElementHydrateSupport) || void 0 === l3 || l3.call(globalThis, { LitElement: s4 });
var n4 = globalThis.litElementPolyfillSupport;
null == n4 || n4({ LitElement: s4 });
(null !== (o4 = globalThis.litElementVersions) && void 0 !== o4 ? o4 : globalThis.litElementVersions = []).push("3.2.2");

// node_modules/@lit/reactive-element/decorators/property.js
var i3 = (i4, e6) => "method" === e6.kind && e6.descriptor && !("value" in e6.descriptor) ? { ...e6, finisher(n6) {
  n6.createProperty(e6.key, i4);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e6.key, initializer() {
  "function" == typeof e6.initializer && (this[e6.key] = e6.initializer.call(this));
}, finisher(n6) {
  n6.createProperty(e6.key, i4);
} };
function e4(e6) {
  return (n6, t3) => void 0 !== t3 ? ((i4, e7, n7) => {
    e7.constructor.createProperty(n7, i4);
  })(e6, n6, t3) : i3(e6, n6);
}

// node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
var n5;
var e5 = null != (null === (n5 = window.HTMLSlotElement) || void 0 === n5 ? void 0 : n5.prototype.assignedElements) ? (o6, n6) => o6.assignedElements(n6) : (o6, n6) => o6.assignedNodes(n6).filter((o7) => o7.nodeType === Node.ELEMENT_NODE);

// visualizations/examples/lit_ts.ts
var CustomVisualization = class extends s4 {
  constructor() {
    super(...arguments);
    this.name = "somebody";
  }
  render() {
    return y`<p>Hello, ${this.name}!</p>`;
  }
};
__decorateClass([
  e4({ type: String })
], CustomVisualization.prototype, "name", 2);
export {
  CustomVisualization as default
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
'''

snapshots['TestBundleSource.test_svelte 1'] = '''// node_modules/svelte/internal/index.mjs
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
var is_hydrating = false;
function start_hydrating() {
  is_hydrating = true;
}
function end_hydrating() {
  is_hydrating = false;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var seen_callbacks = /* @__PURE__ */ new Set();
var flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var outroing = /* @__PURE__ */ new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      this[attr] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}
var SvelteComponent = class {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
};

// visualizations/examples/utils/hello.svelte
function create_fragment(ctx) {
  let p;
  let t0;
  let t1;
  let t2;
  return {
    c() {
      p = element("p");
      t0 = text("Hello, ");
      t1 = text(ctx[0]);
      t2 = text("!");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      append(p, t0);
      append(p, t1);
      append(p, t2);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1)
        set_data(t1, ctx2[0]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { name } = $$props;
  $$self.$$set = ($$props2) => {
    if ("name" in $$props2)
      $$invalidate(0, name = $$props2.name);
  };
  return [name];
}
var Hello = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });
  }
};
var hello_default = Hello;

// visualizations/examples/svelte.svelte
var CustomVisualization = class extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute("name");
    const mountPoint = document.createElement("div");
    new hello_default({ target: mountPoint, props: { name } });
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);
  }
};
var Svelte = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, null, safe_not_equal, {});
  }
};
var svelte_default = Svelte;
export {
  CustomVisualization,
  svelte_default as default
};
'''

snapshots['TestBundleSource.test_vanilla_js 1'] = '''// visualizations/examples/vanilla_js.js
var CustomVisualization = class extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute("name");
    this.innerHTML = `<p>Hello, ${name}!</p>`;
  }
};
export {
  CustomVisualization as default
};
'''
