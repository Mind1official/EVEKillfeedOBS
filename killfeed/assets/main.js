var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var __await = function(promise, isYieldStar) {
  this[0] = promise;
  this[1] = isYieldStar;
};
var __asyncGenerator = (__this, __arguments, generator) => {
  var resume = (k, v, yes, no) => {
    try {
      var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
      Promise.resolve(isAwait ? v[0] : v).then((y) => isAwait ? resume(k === "return" ? k : "next", v[1] ? { done: y.done, value: y.value } : y, yes, no) : yes({ value: y, done })).catch((e) => resume("throw", e, yes, no));
    } catch (e) {
      no(e);
    }
  }, method = (k) => it[k] = (x) => new Promise((yes, no) => resume(k, x, yes, no)), it = {};
  return generator = generator.apply(__this, __arguments), it[__knownSymbol("asyncIterator")] = () => it, method("next"), method("throw"), method("return"), it;
};
var __yieldStar = (value) => {
  var obj = value[__knownSymbol("asyncIterator")], isAwait = false, method, it = {};
  if (obj == null) {
    obj = value[__knownSymbol("iterator")]();
    method = (k) => it[k] = (x) => obj[k](x);
  } else {
    obj = obj.call(value);
    method = (k) => it[k] = (v) => {
      if (isAwait) {
        isAwait = false;
        if (k === "throw") throw v;
        return v;
      }
      isAwait = true;
      return {
        done: false,
        value: new __await(new Promise((resolve) => {
          var x = obj[k](v);
          if (!(x instanceof Object)) __typeError("Object expected");
          resolve(x);
        }), 1)
      };
    };
  }
  return it[__knownSymbol("iterator")] = () => it, method("next"), "throw" in obj ? method("throw") : it.throw = (x) => {
    throw x;
  }, "return" in obj && method("return"), it;
};
var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);
var require_main = __commonJS({
  "assets/main.js"(exports) {
    (function polyfill() {
      const relList = document.createElement("link").relList;
      if (relList && relList.supports && relList.supports("modulepreload")) {
        return;
      }
      for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
      }
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type !== "childList") {
            continue;
          }
          for (const node of mutation.addedNodes) {
            if (node.tagName === "LINK" && node.rel === "modulepreload")
              processPreload(node);
          }
        }
      }).observe(document, { childList: true, subtree: true });
      function getFetchOpts(link) {
        const fetchOpts = {};
        if (link.integrity) fetchOpts.integrity = link.integrity;
        if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
        if (link.crossOrigin === "use-credentials")
          fetchOpts.credentials = "include";
        else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
        else fetchOpts.credentials = "same-origin";
        return fetchOpts;
      }
      function processPreload(link) {
        if (link.ep)
          return;
        link.ep = true;
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
      }
    })();
    /**
    * @vue/shared v3.5.16
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    **/
    /*! #__NO_SIDE_EFFECTS__ */
    // @__NO_SIDE_EFFECTS__
    function makeMap(str) {
      const map = /* @__PURE__ */ Object.create(null);
      for (const key of str.split(",")) map[key] = 1;
      return (val) => val in map;
    }
    const EMPTY_OBJ = {};
    const EMPTY_ARR = [];
    const NOOP = () => {
    };
    const NO = () => false;
    const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
    (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
    const isModelListener = (key) => key.startsWith("onUpdate:");
    const extend$1 = Object.assign;
    const remove = (arr, el) => {
      const i = arr.indexOf(el);
      if (i > -1) {
        arr.splice(i, 1);
      }
    };
    const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
    const hasOwn = (val, key) => hasOwnProperty$2.call(val, key);
    const isArray$1 = Array.isArray;
    const isMap = (val) => toTypeString(val) === "[object Map]";
    const isSet = (val) => toTypeString(val) === "[object Set]";
    const isFunction$1 = (val) => typeof val === "function";
    const isString$1 = (val) => typeof val === "string";
    const isSymbol = (val) => typeof val === "symbol";
    const isObject$1 = (val) => val !== null && typeof val === "object";
    const isPromise = (val) => {
      return (isObject$1(val) || isFunction$1(val)) && isFunction$1(val.then) && isFunction$1(val.catch);
    };
    const objectToString = Object.prototype.toString;
    const toTypeString = (value) => objectToString.call(value);
    const toRawType = (value) => {
      return toTypeString(value).slice(8, -1);
    };
    const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
    const isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
    const isReservedProp = /* @__PURE__ */ makeMap(
      // the leading comma is intentional so empty string "" is also included
      ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
    );
    const cacheStringFunction = (fn) => {
      const cache = /* @__PURE__ */ Object.create(null);
      return (str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
      };
    };
    const camelizeRE = /-(\w)/g;
    const camelize = cacheStringFunction(
      (str) => {
        return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
      }
    );
    const hyphenateRE = /\B([A-Z])/g;
    const hyphenate = cacheStringFunction(
      (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
    );
    const capitalize = cacheStringFunction((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    });
    const toHandlerKey = cacheStringFunction(
      (str) => {
        const s = str ? `on${capitalize(str)}` : ``;
        return s;
      }
    );
    const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
    const invokeArrayFns = (fns, ...arg) => {
      for (let i = 0; i < fns.length; i++) {
        fns[i](...arg);
      }
    };
    const def = (obj, key, value, writable = false) => {
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        writable,
        value
      });
    };
    const looseToNumber = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? val : n;
    };
    let _globalThis;
    const getGlobalThis = () => {
      return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    };
    function normalizeStyle(value) {
      if (isArray$1(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
          const item = value[i];
          const normalized = isString$1(item) ? parseStringStyle(item) : normalizeStyle(item);
          if (normalized) {
            for (const key in normalized) {
              res[key] = normalized[key];
            }
          }
        }
        return res;
      } else if (isString$1(value) || isObject$1(value)) {
        return value;
      }
    }
    const listDelimiterRE = /;(?![^(]*\))/g;
    const propertyDelimiterRE = /:([^]+)/;
    const styleCommentRE = /\/\*[^]*?\*\//g;
    function parseStringStyle(cssText) {
      const ret = {};
      cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
        if (item) {
          const tmp = item.split(propertyDelimiterRE);
          tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
      });
      return ret;
    }
    function normalizeClass(value) {
      let res = "";
      if (isString$1(value)) {
        res = value;
      } else if (isArray$1(value)) {
        for (let i = 0; i < value.length; i++) {
          const normalized = normalizeClass(value[i]);
          if (normalized) {
            res += normalized + " ";
          }
        }
      } else if (isObject$1(value)) {
        for (const name in value) {
          if (value[name]) {
            res += name + " ";
          }
        }
      }
      return res.trim();
    }
    const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
    const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
    function includeBooleanAttr(value) {
      return !!value || value === "";
    }
    const isRef$1 = (val) => {
      return !!(val && val["__v_isRef"] === true);
    };
    const toDisplayString = (val) => {
      return isString$1(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
    };
    const replacer = (_key, val) => {
      if (isRef$1(val)) {
        return replacer(_key, val.value);
      } else if (isMap(val)) {
        return {
          [`Map(${val.size})`]: [...val.entries()].reduce(
            (entries, [key, val2], i) => {
              entries[stringifySymbol(key, i) + " =>"] = val2;
              return entries;
            },
            {}
          )
        };
      } else if (isSet(val)) {
        return {
          [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
        };
      } else if (isSymbol(val)) {
        return stringifySymbol(val);
      } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject$1(val)) {
        return String(val);
      }
      return val;
    };
    const stringifySymbol = (v, i = "") => {
      var _a;
      return (
        // Symbol.description in es2019+ so we need to cast here to pass
        // the lib: es2016 check
        isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
      );
    };
    /**
    * @vue/reactivity v3.5.16
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    **/
    let activeEffectScope;
    class EffectScope {
      constructor(detached = false) {
        this.detached = detached;
        this._active = true;
        this._on = 0;
        this.effects = [];
        this.cleanups = [];
        this._isPaused = false;
        this.parent = activeEffectScope;
        if (!detached && activeEffectScope) {
          this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
            this
          ) - 1;
        }
      }
      get active() {
        return this._active;
      }
      pause() {
        if (this._active) {
          this._isPaused = true;
          let i, l;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].pause();
            }
          }
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].pause();
          }
        }
      }
      /**
       * Resumes the effect scope, including all child scopes and effects.
       */
      resume() {
        if (this._active) {
          if (this._isPaused) {
            this._isPaused = false;
            let i, l;
            if (this.scopes) {
              for (i = 0, l = this.scopes.length; i < l; i++) {
                this.scopes[i].resume();
              }
            }
            for (i = 0, l = this.effects.length; i < l; i++) {
              this.effects[i].resume();
            }
          }
        }
      }
      run(fn) {
        if (this._active) {
          const currentEffectScope = activeEffectScope;
          try {
            activeEffectScope = this;
            return fn();
          } finally {
            activeEffectScope = currentEffectScope;
          }
        }
      }
      /**
       * This should only be called on non-detached scopes
       * @internal
       */
      on() {
        if (++this._on === 1) {
          this.prevScope = activeEffectScope;
          activeEffectScope = this;
        }
      }
      /**
       * This should only be called on non-detached scopes
       * @internal
       */
      off() {
        if (this._on > 0 && --this._on === 0) {
          activeEffectScope = this.prevScope;
          this.prevScope = void 0;
        }
      }
      stop(fromParent) {
        if (this._active) {
          this._active = false;
          let i, l;
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].stop();
          }
          this.effects.length = 0;
          for (i = 0, l = this.cleanups.length; i < l; i++) {
            this.cleanups[i]();
          }
          this.cleanups.length = 0;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].stop(true);
            }
            this.scopes.length = 0;
          }
          if (!this.detached && this.parent && !fromParent) {
            const last = this.parent.scopes.pop();
            if (last && last !== this) {
              this.parent.scopes[this.index] = last;
              last.index = this.index;
            }
          }
          this.parent = void 0;
        }
      }
    }
    function getCurrentScope() {
      return activeEffectScope;
    }
    let activeSub;
    const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
    class ReactiveEffect {
      constructor(fn) {
        this.fn = fn;
        this.deps = void 0;
        this.depsTail = void 0;
        this.flags = 1 | 4;
        this.next = void 0;
        this.cleanup = void 0;
        this.scheduler = void 0;
        if (activeEffectScope && activeEffectScope.active) {
          activeEffectScope.effects.push(this);
        }
      }
      pause() {
        this.flags |= 64;
      }
      resume() {
        if (this.flags & 64) {
          this.flags &= -65;
          if (pausedQueueEffects.has(this)) {
            pausedQueueEffects.delete(this);
            this.trigger();
          }
        }
      }
      /**
       * @internal
       */
      notify() {
        if (this.flags & 2 && !(this.flags & 32)) {
          return;
        }
        if (!(this.flags & 8)) {
          batch(this);
        }
      }
      run() {
        if (!(this.flags & 1)) {
          return this.fn();
        }
        this.flags |= 2;
        cleanupEffect(this);
        prepareDeps(this);
        const prevEffect = activeSub;
        const prevShouldTrack = shouldTrack;
        activeSub = this;
        shouldTrack = true;
        try {
          return this.fn();
        } finally {
          cleanupDeps(this);
          activeSub = prevEffect;
          shouldTrack = prevShouldTrack;
          this.flags &= -3;
        }
      }
      stop() {
        if (this.flags & 1) {
          for (let link = this.deps; link; link = link.nextDep) {
            removeSub(link);
          }
          this.deps = this.depsTail = void 0;
          cleanupEffect(this);
          this.onStop && this.onStop();
          this.flags &= -2;
        }
      }
      trigger() {
        if (this.flags & 64) {
          pausedQueueEffects.add(this);
        } else if (this.scheduler) {
          this.scheduler();
        } else {
          this.runIfDirty();
        }
      }
      /**
       * @internal
       */
      runIfDirty() {
        if (isDirty(this)) {
          this.run();
        }
      }
      get dirty() {
        return isDirty(this);
      }
    }
    let batchDepth = 0;
    let batchedSub;
    let batchedComputed;
    function batch(sub, isComputed = false) {
      sub.flags |= 8;
      if (isComputed) {
        sub.next = batchedComputed;
        batchedComputed = sub;
        return;
      }
      sub.next = batchedSub;
      batchedSub = sub;
    }
    function startBatch() {
      batchDepth++;
    }
    function endBatch() {
      if (--batchDepth > 0) {
        return;
      }
      if (batchedComputed) {
        let e = batchedComputed;
        batchedComputed = void 0;
        while (e) {
          const next = e.next;
          e.next = void 0;
          e.flags &= -9;
          e = next;
        }
      }
      let error;
      while (batchedSub) {
        let e = batchedSub;
        batchedSub = void 0;
        while (e) {
          const next = e.next;
          e.next = void 0;
          e.flags &= -9;
          if (e.flags & 1) {
            try {
              ;
              e.trigger();
            } catch (err) {
              if (!error) error = err;
            }
          }
          e = next;
        }
      }
      if (error) throw error;
    }
    function prepareDeps(sub) {
      for (let link = sub.deps; link; link = link.nextDep) {
        link.version = -1;
        link.prevActiveLink = link.dep.activeLink;
        link.dep.activeLink = link;
      }
    }
    function cleanupDeps(sub) {
      let head;
      let tail = sub.depsTail;
      let link = tail;
      while (link) {
        const prev = link.prevDep;
        if (link.version === -1) {
          if (link === tail) tail = prev;
          removeSub(link);
          removeDep(link);
        } else {
          head = link;
        }
        link.dep.activeLink = link.prevActiveLink;
        link.prevActiveLink = void 0;
        link = prev;
      }
      sub.deps = head;
      sub.depsTail = tail;
    }
    function isDirty(sub) {
      for (let link = sub.deps; link; link = link.nextDep) {
        if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
          return true;
        }
      }
      if (sub._dirty) {
        return true;
      }
      return false;
    }
    function refreshComputed(computed2) {
      if (computed2.flags & 4 && !(computed2.flags & 16)) {
        return;
      }
      computed2.flags &= -17;
      if (computed2.globalVersion === globalVersion) {
        return;
      }
      computed2.globalVersion = globalVersion;
      if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
        return;
      }
      computed2.flags |= 2;
      const dep = computed2.dep;
      const prevSub = activeSub;
      const prevShouldTrack = shouldTrack;
      activeSub = computed2;
      shouldTrack = true;
      try {
        prepareDeps(computed2);
        const value = computed2.fn(computed2._value);
        if (dep.version === 0 || hasChanged(value, computed2._value)) {
          computed2.flags |= 128;
          computed2._value = value;
          dep.version++;
        }
      } catch (err) {
        dep.version++;
        throw err;
      } finally {
        activeSub = prevSub;
        shouldTrack = prevShouldTrack;
        cleanupDeps(computed2);
        computed2.flags &= -3;
      }
    }
    function removeSub(link, soft = false) {
      const { dep, prevSub, nextSub } = link;
      if (prevSub) {
        prevSub.nextSub = nextSub;
        link.prevSub = void 0;
      }
      if (nextSub) {
        nextSub.prevSub = prevSub;
        link.nextSub = void 0;
      }
      if (dep.subs === link) {
        dep.subs = prevSub;
        if (!prevSub && dep.computed) {
          dep.computed.flags &= -5;
          for (let l = dep.computed.deps; l; l = l.nextDep) {
            removeSub(l, true);
          }
        }
      }
      if (!soft && !--dep.sc && dep.map) {
        dep.map.delete(dep.key);
      }
    }
    function removeDep(link) {
      const { prevDep, nextDep } = link;
      if (prevDep) {
        prevDep.nextDep = nextDep;
        link.prevDep = void 0;
      }
      if (nextDep) {
        nextDep.prevDep = prevDep;
        link.nextDep = void 0;
      }
    }
    let shouldTrack = true;
    const trackStack = [];
    function pauseTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = false;
    }
    function resetTracking() {
      const last = trackStack.pop();
      shouldTrack = last === void 0 ? true : last;
    }
    function cleanupEffect(e) {
      const { cleanup } = e;
      e.cleanup = void 0;
      if (cleanup) {
        const prevSub = activeSub;
        activeSub = void 0;
        try {
          cleanup();
        } finally {
          activeSub = prevSub;
        }
      }
    }
    let globalVersion = 0;
    class Link {
      constructor(sub, dep) {
        this.sub = sub;
        this.dep = dep;
        this.version = dep.version;
        this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
      }
    }
    class Dep {
      constructor(computed2) {
        this.computed = computed2;
        this.version = 0;
        this.activeLink = void 0;
        this.subs = void 0;
        this.map = void 0;
        this.key = void 0;
        this.sc = 0;
      }
      track(debugInfo) {
        if (!activeSub || !shouldTrack || activeSub === this.computed) {
          return;
        }
        let link = this.activeLink;
        if (link === void 0 || link.sub !== activeSub) {
          link = this.activeLink = new Link(activeSub, this);
          if (!activeSub.deps) {
            activeSub.deps = activeSub.depsTail = link;
          } else {
            link.prevDep = activeSub.depsTail;
            activeSub.depsTail.nextDep = link;
            activeSub.depsTail = link;
          }
          addSub(link);
        } else if (link.version === -1) {
          link.version = this.version;
          if (link.nextDep) {
            const next = link.nextDep;
            next.prevDep = link.prevDep;
            if (link.prevDep) {
              link.prevDep.nextDep = next;
            }
            link.prevDep = activeSub.depsTail;
            link.nextDep = void 0;
            activeSub.depsTail.nextDep = link;
            activeSub.depsTail = link;
            if (activeSub.deps === link) {
              activeSub.deps = next;
            }
          }
        }
        return link;
      }
      trigger(debugInfo) {
        this.version++;
        globalVersion++;
        this.notify(debugInfo);
      }
      notify(debugInfo) {
        startBatch();
        try {
          if (false) ;
          for (let link = this.subs; link; link = link.prevSub) {
            if (link.sub.notify()) {
              ;
              link.sub.dep.notify();
            }
          }
        } finally {
          endBatch();
        }
      }
    }
    function addSub(link) {
      link.dep.sc++;
      if (link.sub.flags & 4) {
        const computed2 = link.dep.computed;
        if (computed2 && !link.dep.subs) {
          computed2.flags |= 4 | 16;
          for (let l = computed2.deps; l; l = l.nextDep) {
            addSub(l);
          }
        }
        const currentTail = link.dep.subs;
        if (currentTail !== link) {
          link.prevSub = currentTail;
          if (currentTail) currentTail.nextSub = link;
        }
        link.dep.subs = link;
      }
    }
    const targetMap = /* @__PURE__ */ new WeakMap();
    const ITERATE_KEY = Symbol(
      ""
    );
    const MAP_KEY_ITERATE_KEY = Symbol(
      ""
    );
    const ARRAY_ITERATE_KEY = Symbol(
      ""
    );
    function track(target, type, key) {
      if (shouldTrack && activeSub) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
          targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
        }
        let dep = depsMap.get(key);
        if (!dep) {
          depsMap.set(key, dep = new Dep());
          dep.map = depsMap;
          dep.key = key;
        }
        {
          dep.track();
        }
      }
    }
    function trigger(target, type, key, newValue, oldValue, oldTarget) {
      const depsMap = targetMap.get(target);
      if (!depsMap) {
        globalVersion++;
        return;
      }
      const run = (dep) => {
        if (dep) {
          {
            dep.trigger();
          }
        }
      };
      startBatch();
      if (type === "clear") {
        depsMap.forEach(run);
      } else {
        const targetIsArray = isArray$1(target);
        const isArrayIndex = targetIsArray && isIntegerKey(key);
        if (targetIsArray && key === "length") {
          const newLength = Number(newValue);
          depsMap.forEach((dep, key2) => {
            if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
              run(dep);
            }
          });
        } else {
          if (key !== void 0 || depsMap.has(void 0)) {
            run(depsMap.get(key));
          }
          if (isArrayIndex) {
            run(depsMap.get(ARRAY_ITERATE_KEY));
          }
          switch (type) {
            case "add":
              if (!targetIsArray) {
                run(depsMap.get(ITERATE_KEY));
                if (isMap(target)) {
                  run(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
              } else if (isArrayIndex) {
                run(depsMap.get("length"));
              }
              break;
            case "delete":
              if (!targetIsArray) {
                run(depsMap.get(ITERATE_KEY));
                if (isMap(target)) {
                  run(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
              }
              break;
            case "set":
              if (isMap(target)) {
                run(depsMap.get(ITERATE_KEY));
              }
              break;
          }
        }
      }
      endBatch();
    }
    function reactiveReadArray(array) {
      const raw = toRaw(array);
      if (raw === array) return raw;
      track(raw, "iterate", ARRAY_ITERATE_KEY);
      return isShallow(array) ? raw : raw.map(toReactive);
    }
    function shallowReadArray(arr) {
      track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
      return arr;
    }
    const arrayInstrumentations = {
      __proto__: null,
      [Symbol.iterator]() {
        return iterator$1(this, Symbol.iterator, toReactive);
      },
      concat(...args) {
        return reactiveReadArray(this).concat(
          ...args.map((x) => isArray$1(x) ? reactiveReadArray(x) : x)
        );
      },
      entries() {
        return iterator$1(this, "entries", (value) => {
          value[1] = toReactive(value[1]);
          return value;
        });
      },
      every(fn, thisArg) {
        return apply(this, "every", fn, thisArg, void 0, arguments);
      },
      filter(fn, thisArg) {
        return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
      },
      find(fn, thisArg) {
        return apply(this, "find", fn, thisArg, toReactive, arguments);
      },
      findIndex(fn, thisArg) {
        return apply(this, "findIndex", fn, thisArg, void 0, arguments);
      },
      findLast(fn, thisArg) {
        return apply(this, "findLast", fn, thisArg, toReactive, arguments);
      },
      findLastIndex(fn, thisArg) {
        return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
      },
      // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
      forEach(fn, thisArg) {
        return apply(this, "forEach", fn, thisArg, void 0, arguments);
      },
      includes(...args) {
        return searchProxy(this, "includes", args);
      },
      indexOf(...args) {
        return searchProxy(this, "indexOf", args);
      },
      join(separator) {
        return reactiveReadArray(this).join(separator);
      },
      // keys() iterator only reads `length`, no optimisation required
      lastIndexOf(...args) {
        return searchProxy(this, "lastIndexOf", args);
      },
      map(fn, thisArg) {
        return apply(this, "map", fn, thisArg, void 0, arguments);
      },
      pop() {
        return noTracking(this, "pop");
      },
      push(...args) {
        return noTracking(this, "push", args);
      },
      reduce(fn, ...args) {
        return reduce(this, "reduce", fn, args);
      },
      reduceRight(fn, ...args) {
        return reduce(this, "reduceRight", fn, args);
      },
      shift() {
        return noTracking(this, "shift");
      },
      // slice could use ARRAY_ITERATE but also seems to beg for range tracking
      some(fn, thisArg) {
        return apply(this, "some", fn, thisArg, void 0, arguments);
      },
      splice(...args) {
        return noTracking(this, "splice", args);
      },
      toReversed() {
        return reactiveReadArray(this).toReversed();
      },
      toSorted(comparer) {
        return reactiveReadArray(this).toSorted(comparer);
      },
      toSpliced(...args) {
        return reactiveReadArray(this).toSpliced(...args);
      },
      unshift(...args) {
        return noTracking(this, "unshift", args);
      },
      values() {
        return iterator$1(this, "values", toReactive);
      }
    };
    function iterator$1(self2, method, wrapValue) {
      const arr = shallowReadArray(self2);
      const iter = arr[method]();
      if (arr !== self2 && !isShallow(self2)) {
        iter._next = iter.next;
        iter.next = () => {
          const result = iter._next();
          if (result.value) {
            result.value = wrapValue(result.value);
          }
          return result;
        };
      }
      return iter;
    }
    const arrayProto = Array.prototype;
    function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
      const arr = shallowReadArray(self2);
      const needsWrap = arr !== self2 && !isShallow(self2);
      const methodFn = arr[method];
      if (methodFn !== arrayProto[method]) {
        const result2 = methodFn.apply(self2, args);
        return needsWrap ? toReactive(result2) : result2;
      }
      let wrappedFn = fn;
      if (arr !== self2) {
        if (needsWrap) {
          wrappedFn = function(item, index) {
            return fn.call(this, toReactive(item), index, self2);
          };
        } else if (fn.length > 2) {
          wrappedFn = function(item, index) {
            return fn.call(this, item, index, self2);
          };
        }
      }
      const result = methodFn.call(arr, wrappedFn, thisArg);
      return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
    }
    function reduce(self2, method, fn, args) {
      const arr = shallowReadArray(self2);
      let wrappedFn = fn;
      if (arr !== self2) {
        if (!isShallow(self2)) {
          wrappedFn = function(acc, item, index) {
            return fn.call(this, acc, toReactive(item), index, self2);
          };
        } else if (fn.length > 3) {
          wrappedFn = function(acc, item, index) {
            return fn.call(this, acc, item, index, self2);
          };
        }
      }
      return arr[method](wrappedFn, ...args);
    }
    function searchProxy(self2, method, args) {
      const arr = toRaw(self2);
      track(arr, "iterate", ARRAY_ITERATE_KEY);
      const res = arr[method](...args);
      if ((res === -1 || res === false) && isProxy(args[0])) {
        args[0] = toRaw(args[0]);
        return arr[method](...args);
      }
      return res;
    }
    function noTracking(self2, method, args = []) {
      pauseTracking();
      startBatch();
      const res = toRaw(self2)[method].apply(self2, args);
      endBatch();
      resetTracking();
      return res;
    }
    const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
    const builtInSymbols = new Set(
      /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
    );
    function hasOwnProperty$1(key) {
      if (!isSymbol(key)) key = String(key);
      const obj = toRaw(this);
      track(obj, "has", key);
      return obj.hasOwnProperty(key);
    }
    class BaseReactiveHandler {
      constructor(_isReadonly = false, _isShallow = false) {
        this._isReadonly = _isReadonly;
        this._isShallow = _isShallow;
      }
      get(target, key, receiver) {
        if (key === "__v_skip") return target["__v_skip"];
        const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_isShallow") {
          return isShallow2;
        } else if (key === "__v_raw") {
          if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
          // this means the receiver is a user proxy of the reactive proxy
          Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
            return target;
          }
          return;
        }
        const targetIsArray = isArray$1(target);
        if (!isReadonly2) {
          let fn;
          if (targetIsArray && (fn = arrayInstrumentations[key])) {
            return fn;
          }
          if (key === "hasOwnProperty") {
            return hasOwnProperty$1;
          }
        }
        const res = Reflect.get(
          target,
          key,
          // if this is a proxy wrapping a ref, return methods using the raw ref
          // as receiver so that we don't have to call `toRaw` on the ref in all
          // its class methods
          isRef(target) ? target : receiver
        );
        if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
          return res;
        }
        if (!isReadonly2) {
          track(target, "get", key);
        }
        if (isShallow2) {
          return res;
        }
        if (isRef(res)) {
          return targetIsArray && isIntegerKey(key) ? res : res.value;
        }
        if (isObject$1(res)) {
          return isReadonly2 ? readonly(res) : reactive(res);
        }
        return res;
      }
    }
    class MutableReactiveHandler extends BaseReactiveHandler {
      constructor(isShallow2 = false) {
        super(false, isShallow2);
      }
      set(target, key, value, receiver) {
        let oldValue = target[key];
        if (!this._isShallow) {
          const isOldValueReadonly = isReadonly(oldValue);
          if (!isShallow(value) && !isReadonly(value)) {
            oldValue = toRaw(oldValue);
            value = toRaw(value);
          }
          if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
            if (isOldValueReadonly) {
              return false;
            } else {
              oldValue.value = value;
              return true;
            }
          }
        }
        const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
        const result = Reflect.set(
          target,
          key,
          value,
          isRef(target) ? target : receiver
        );
        if (target === toRaw(receiver)) {
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value);
          }
        }
        return result;
      }
      deleteProperty(target, key) {
        const hadKey = hasOwn(target, key);
        target[key];
        const result = Reflect.deleteProperty(target, key);
        if (result && hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      }
      has(target, key) {
        const result = Reflect.has(target, key);
        if (!isSymbol(key) || !builtInSymbols.has(key)) {
          track(target, "has", key);
        }
        return result;
      }
      ownKeys(target) {
        track(
          target,
          "iterate",
          isArray$1(target) ? "length" : ITERATE_KEY
        );
        return Reflect.ownKeys(target);
      }
    }
    class ReadonlyReactiveHandler extends BaseReactiveHandler {
      constructor(isShallow2 = false) {
        super(true, isShallow2);
      }
      set(target, key) {
        return true;
      }
      deleteProperty(target, key) {
        return true;
      }
    }
    const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
    const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
    const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
    const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
    const toShallow = (value) => value;
    const getProto = (v) => Reflect.getPrototypeOf(v);
    function createIterableMethod(method, isReadonly2, isShallow2) {
      return function(...args) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const targetIsMap = isMap(rawTarget);
        const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
        const isKeyOnly = method === "keys" && targetIsMap;
        const innerIterator = target[method](...args);
        const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        !isReadonly2 && track(
          rawTarget,
          "iterate",
          isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
        );
        return {
          // iterator protocol
          next() {
            const { value, done } = innerIterator.next();
            return done ? { value, done } : {
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
              done
            };
          },
          // iterable protocol
          [Symbol.iterator]() {
            return this;
          }
        };
      };
    }
    function createReadonlyMethod(type) {
      return function(...args) {
        return type === "delete" ? false : type === "clear" ? void 0 : this;
      };
    }
    function createInstrumentations(readonly2, shallow) {
      const instrumentations = {
        get(key) {
          const target = this["__v_raw"];
          const rawTarget = toRaw(target);
          const rawKey = toRaw(key);
          if (!readonly2) {
            if (hasChanged(key, rawKey)) {
              track(rawTarget, "get", key);
            }
            track(rawTarget, "get", rawKey);
          }
          const { has } = getProto(rawTarget);
          const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
          if (has.call(rawTarget, key)) {
            return wrap(target.get(key));
          } else if (has.call(rawTarget, rawKey)) {
            return wrap(target.get(rawKey));
          } else if (target !== rawTarget) {
            target.get(key);
          }
        },
        get size() {
          const target = this["__v_raw"];
          !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
          return Reflect.get(target, "size", target);
        },
        has(key) {
          const target = this["__v_raw"];
          const rawTarget = toRaw(target);
          const rawKey = toRaw(key);
          if (!readonly2) {
            if (hasChanged(key, rawKey)) {
              track(rawTarget, "has", key);
            }
            track(rawTarget, "has", rawKey);
          }
          return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
        },
        forEach(callback, thisArg) {
          const observed = this;
          const target = observed["__v_raw"];
          const rawTarget = toRaw(target);
          const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
          !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
          return target.forEach((value, key) => {
            return callback.call(thisArg, wrap(value), wrap(key), observed);
          });
        }
      };
      extend$1(
        instrumentations,
        readonly2 ? {
          add: createReadonlyMethod("add"),
          set: createReadonlyMethod("set"),
          delete: createReadonlyMethod("delete"),
          clear: createReadonlyMethod("clear")
        } : {
          add(value) {
            if (!shallow && !isShallow(value) && !isReadonly(value)) {
              value = toRaw(value);
            }
            const target = toRaw(this);
            const proto = getProto(target);
            const hadKey = proto.has.call(target, value);
            if (!hadKey) {
              target.add(value);
              trigger(target, "add", value, value);
            }
            return this;
          },
          set(key, value) {
            if (!shallow && !isShallow(value) && !isReadonly(value)) {
              value = toRaw(value);
            }
            const target = toRaw(this);
            const { has, get } = getProto(target);
            let hadKey = has.call(target, key);
            if (!hadKey) {
              key = toRaw(key);
              hadKey = has.call(target, key);
            }
            const oldValue = get.call(target, key);
            target.set(key, value);
            if (!hadKey) {
              trigger(target, "add", key, value);
            } else if (hasChanged(value, oldValue)) {
              trigger(target, "set", key, value);
            }
            return this;
          },
          delete(key) {
            const target = toRaw(this);
            const { has, get } = getProto(target);
            let hadKey = has.call(target, key);
            if (!hadKey) {
              key = toRaw(key);
              hadKey = has.call(target, key);
            }
            get ? get.call(target, key) : void 0;
            const result = target.delete(key);
            if (hadKey) {
              trigger(target, "delete", key, void 0);
            }
            return result;
          },
          clear() {
            const target = toRaw(this);
            const hadItems = target.size !== 0;
            const result = target.clear();
            if (hadItems) {
              trigger(
                target,
                "clear",
                void 0,
                void 0
              );
            }
            return result;
          }
        }
      );
      const iteratorMethods = [
        "keys",
        "values",
        "entries",
        Symbol.iterator
      ];
      iteratorMethods.forEach((method) => {
        instrumentations[method] = createIterableMethod(method, readonly2, shallow);
      });
      return instrumentations;
    }
    function createInstrumentationGetter(isReadonly2, shallow) {
      const instrumentations = createInstrumentations(isReadonly2, shallow);
      return (target, key, receiver) => {
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_raw") {
          return target;
        }
        return Reflect.get(
          hasOwn(instrumentations, key) && key in target ? instrumentations : target,
          key,
          receiver
        );
      };
    }
    const mutableCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, false)
    };
    const shallowCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, true)
    };
    const readonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, false)
    };
    const shallowReadonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, true)
    };
    const reactiveMap = /* @__PURE__ */ new WeakMap();
    const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
    const readonlyMap = /* @__PURE__ */ new WeakMap();
    const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
    function targetTypeMap(rawType) {
      switch (rawType) {
        case "Object":
        case "Array":
          return 1;
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
          return 2;
        default:
          return 0;
      }
    }
    function getTargetType(value) {
      return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
    }
    function reactive(target) {
      if (isReadonly(target)) {
        return target;
      }
      return createReactiveObject(
        target,
        false,
        mutableHandlers,
        mutableCollectionHandlers,
        reactiveMap
      );
    }
    function shallowReactive(target) {
      return createReactiveObject(
        target,
        false,
        shallowReactiveHandlers,
        shallowCollectionHandlers,
        shallowReactiveMap
      );
    }
    function readonly(target) {
      return createReactiveObject(
        target,
        true,
        readonlyHandlers,
        readonlyCollectionHandlers,
        readonlyMap
      );
    }
    function shallowReadonly(target) {
      return createReactiveObject(
        target,
        true,
        shallowReadonlyHandlers,
        shallowReadonlyCollectionHandlers,
        shallowReadonlyMap
      );
    }
    function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
      if (!isObject$1(target)) {
        return target;
      }
      if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
        return target;
      }
      const targetType = getTargetType(target);
      if (targetType === 0) {
        return target;
      }
      const existingProxy = proxyMap.get(target);
      if (existingProxy) {
        return existingProxy;
      }
      const proxy = new Proxy(
        target,
        targetType === 2 ? collectionHandlers : baseHandlers
      );
      proxyMap.set(target, proxy);
      return proxy;
    }
    function isReactive(value) {
      if (isReadonly(value)) {
        return isReactive(value["__v_raw"]);
      }
      return !!(value && value["__v_isReactive"]);
    }
    function isReadonly(value) {
      return !!(value && value["__v_isReadonly"]);
    }
    function isShallow(value) {
      return !!(value && value["__v_isShallow"]);
    }
    function isProxy(value) {
      return value ? !!value["__v_raw"] : false;
    }
    function toRaw(observed) {
      const raw = observed && observed["__v_raw"];
      return raw ? toRaw(raw) : observed;
    }
    function markRaw(value) {
      if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
        def(value, "__v_skip", true);
      }
      return value;
    }
    const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
    const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
    function isRef(r) {
      return r ? r["__v_isRef"] === true : false;
    }
    function ref(value) {
      return createRef(value, false);
    }
    function createRef(rawValue, shallow) {
      if (isRef(rawValue)) {
        return rawValue;
      }
      return new RefImpl(rawValue, shallow);
    }
    class RefImpl {
      constructor(value, isShallow2) {
        this.dep = new Dep();
        this["__v_isRef"] = true;
        this["__v_isShallow"] = false;
        this._rawValue = isShallow2 ? value : toRaw(value);
        this._value = isShallow2 ? value : toReactive(value);
        this["__v_isShallow"] = isShallow2;
      }
      get value() {
        {
          this.dep.track();
        }
        return this._value;
      }
      set value(newValue) {
        const oldValue = this._rawValue;
        const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
        newValue = useDirectValue ? newValue : toRaw(newValue);
        if (hasChanged(newValue, oldValue)) {
          this._rawValue = newValue;
          this._value = useDirectValue ? newValue : toReactive(newValue);
          {
            this.dep.trigger();
          }
        }
      }
    }
    function unref(ref2) {
      return isRef(ref2) ? ref2.value : ref2;
    }
    const shallowUnwrapHandlers = {
      get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
      set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, receiver);
        }
      }
    };
    function proxyRefs(objectWithRefs) {
      return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
    }
    class ComputedRefImpl {
      constructor(fn, setter, isSSR) {
        this.fn = fn;
        this.setter = setter;
        this._value = void 0;
        this.dep = new Dep(this);
        this.__v_isRef = true;
        this.deps = void 0;
        this.depsTail = void 0;
        this.flags = 16;
        this.globalVersion = globalVersion - 1;
        this.next = void 0;
        this.effect = this;
        this["__v_isReadonly"] = !setter;
        this.isSSR = isSSR;
      }
      /**
       * @internal
       */
      notify() {
        this.flags |= 16;
        if (!(this.flags & 8) && // avoid infinite self recursion
        activeSub !== this) {
          batch(this, true);
          return true;
        }
      }
      get value() {
        const link = this.dep.track();
        refreshComputed(this);
        if (link) {
          link.version = this.dep.version;
        }
        return this._value;
      }
      set value(newValue) {
        if (this.setter) {
          this.setter(newValue);
        }
      }
    }
    function computed$1(getterOrOptions, debugOptions, isSSR = false) {
      let getter;
      let setter;
      if (isFunction$1(getterOrOptions)) {
        getter = getterOrOptions;
      } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
      }
      const cRef = new ComputedRefImpl(getter, setter, isSSR);
      return cRef;
    }
    const INITIAL_WATCHER_VALUE = {};
    const cleanupMap = /* @__PURE__ */ new WeakMap();
    let activeWatcher = void 0;
    function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
      if (owner) {
        let cleanups = cleanupMap.get(owner);
        if (!cleanups) cleanupMap.set(owner, cleanups = []);
        cleanups.push(cleanupFn);
      }
    }
    function watch$1(source, cb, options = EMPTY_OBJ) {
      const { immediate, deep, once, scheduler, augmentJob, call } = options;
      const reactiveGetter = (source2) => {
        if (deep) return source2;
        if (isShallow(source2) || deep === false || deep === 0)
          return traverse(source2, 1);
        return traverse(source2);
      };
      let effect2;
      let getter;
      let cleanup;
      let boundCleanup;
      let forceTrigger = false;
      let isMultiSource = false;
      if (isRef(source)) {
        getter = () => source.value;
        forceTrigger = isShallow(source);
      } else if (isReactive(source)) {
        getter = () => reactiveGetter(source);
        forceTrigger = true;
      } else if (isArray$1(source)) {
        isMultiSource = true;
        forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
        getter = () => source.map((s) => {
          if (isRef(s)) {
            return s.value;
          } else if (isReactive(s)) {
            return reactiveGetter(s);
          } else if (isFunction$1(s)) {
            return call ? call(s, 2) : s();
          } else ;
        });
      } else if (isFunction$1(source)) {
        if (cb) {
          getter = call ? () => call(source, 2) : source;
        } else {
          getter = () => {
            if (cleanup) {
              pauseTracking();
              try {
                cleanup();
              } finally {
                resetTracking();
              }
            }
            const currentEffect = activeWatcher;
            activeWatcher = effect2;
            try {
              return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
            } finally {
              activeWatcher = currentEffect;
            }
          };
        }
      } else {
        getter = NOOP;
      }
      if (cb && deep) {
        const baseGetter = getter;
        const depth = deep === true ? Infinity : deep;
        getter = () => traverse(baseGetter(), depth);
      }
      const scope = getCurrentScope();
      const watchHandle = () => {
        effect2.stop();
        if (scope && scope.active) {
          remove(scope.effects, effect2);
        }
      };
      if (once && cb) {
        const _cb = cb;
        cb = (...args) => {
          _cb(...args);
          watchHandle();
        };
      }
      let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
      const job = (immediateFirstRun) => {
        if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
          return;
        }
        if (cb) {
          const newValue = effect2.run();
          if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
            if (cleanup) {
              cleanup();
            }
            const currentWatcher = activeWatcher;
            activeWatcher = effect2;
            try {
              const args = [
                newValue,
                // pass undefined as the old value when it's changed for the first time
                oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
                boundCleanup
              ];
              oldValue = newValue;
              call ? call(cb, 3, args) : (
                // @ts-expect-error
                cb(...args)
              );
            } finally {
              activeWatcher = currentWatcher;
            }
          }
        } else {
          effect2.run();
        }
      };
      if (augmentJob) {
        augmentJob(job);
      }
      effect2 = new ReactiveEffect(getter);
      effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
      boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
      cleanup = effect2.onStop = () => {
        const cleanups = cleanupMap.get(effect2);
        if (cleanups) {
          if (call) {
            call(cleanups, 4);
          } else {
            for (const cleanup2 of cleanups) cleanup2();
          }
          cleanupMap.delete(effect2);
        }
      };
      if (cb) {
        if (immediate) {
          job(true);
        } else {
          oldValue = effect2.run();
        }
      } else if (scheduler) {
        scheduler(job.bind(null, true), true);
      } else {
        effect2.run();
      }
      watchHandle.pause = effect2.pause.bind(effect2);
      watchHandle.resume = effect2.resume.bind(effect2);
      watchHandle.stop = watchHandle;
      return watchHandle;
    }
    function traverse(value, depth = Infinity, seen) {
      if (depth <= 0 || !isObject$1(value) || value["__v_skip"]) {
        return value;
      }
      seen = seen || /* @__PURE__ */ new Set();
      if (seen.has(value)) {
        return value;
      }
      seen.add(value);
      depth--;
      if (isRef(value)) {
        traverse(value.value, depth, seen);
      } else if (isArray$1(value)) {
        for (let i = 0; i < value.length; i++) {
          traverse(value[i], depth, seen);
        }
      } else if (isSet(value) || isMap(value)) {
        value.forEach((v) => {
          traverse(v, depth, seen);
        });
      } else if (isPlainObject$1(value)) {
        for (const key in value) {
          traverse(value[key], depth, seen);
        }
        for (const key of Object.getOwnPropertySymbols(value)) {
          if (Object.prototype.propertyIsEnumerable.call(value, key)) {
            traverse(value[key], depth, seen);
          }
        }
      }
      return value;
    }
    /**
    * @vue/runtime-core v3.5.16
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    **/
    const stack = [];
    let isWarning = false;
    function warn$1(msg, ...args) {
      if (isWarning) return;
      isWarning = true;
      pauseTracking();
      const instance = stack.length ? stack[stack.length - 1].component : null;
      const appWarnHandler = instance && instance.appContext.config.warnHandler;
      const trace = getComponentTrace();
      if (appWarnHandler) {
        callWithErrorHandling(
          appWarnHandler,
          instance,
          11,
          [
            // eslint-disable-next-line no-restricted-syntax
            msg + args.map((a) => {
              var _a, _b;
              return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
            }).join(""),
            instance && instance.proxy,
            trace.map(
              ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
            ).join("\n"),
            trace
          ]
        );
      } else {
        const warnArgs = [`[Vue warn]: ${msg}`, ...args];
        if (trace.length && // avoid spamming console during tests
        true) {
          warnArgs.push(`
`, ...formatTrace(trace));
        }
        console.warn(...warnArgs);
      }
      resetTracking();
      isWarning = false;
    }
    function getComponentTrace() {
      let currentVNode = stack[stack.length - 1];
      if (!currentVNode) {
        return [];
      }
      const normalizedStack = [];
      while (currentVNode) {
        const last = normalizedStack[0];
        if (last && last.vnode === currentVNode) {
          last.recurseCount++;
        } else {
          normalizedStack.push({
            vnode: currentVNode,
            recurseCount: 0
          });
        }
        const parentInstance = currentVNode.component && currentVNode.component.parent;
        currentVNode = parentInstance && parentInstance.vnode;
      }
      return normalizedStack;
    }
    function formatTrace(trace) {
      const logs = [];
      trace.forEach((entry, i) => {
        logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
      });
      return logs;
    }
    function formatTraceEntry({ vnode, recurseCount }) {
      const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
      const isRoot = vnode.component ? vnode.component.parent == null : false;
      const open = ` at <${formatComponentName(
        vnode.component,
        vnode.type,
        isRoot
      )}`;
      const close = `>` + postfix;
      return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
    }
    function formatProps(props) {
      const res = [];
      const keys = Object.keys(props);
      keys.slice(0, 3).forEach((key) => {
        res.push(...formatProp(key, props[key]));
      });
      if (keys.length > 3) {
        res.push(` ...`);
      }
      return res;
    }
    function formatProp(key, value, raw) {
      if (isString$1(value)) {
        value = JSON.stringify(value);
        return raw ? value : [`${key}=${value}`];
      } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
        return raw ? value : [`${key}=${value}`];
      } else if (isRef(value)) {
        value = formatProp(key, toRaw(value.value), true);
        return raw ? value : [`${key}=Ref<`, value, `>`];
      } else if (isFunction$1(value)) {
        return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
      } else {
        value = toRaw(value);
        return raw ? value : [`${key}=`, value];
      }
    }
    function callWithErrorHandling(fn, instance, type, args) {
      try {
        return args ? fn(...args) : fn();
      } catch (err) {
        handleError(err, instance, type);
      }
    }
    function callWithAsyncErrorHandling(fn, instance, type, args) {
      if (isFunction$1(fn)) {
        const res = callWithErrorHandling(fn, instance, type, args);
        if (res && isPromise(res)) {
          res.catch((err) => {
            handleError(err, instance, type);
          });
        }
        return res;
      }
      if (isArray$1(fn)) {
        const values = [];
        for (let i = 0; i < fn.length; i++) {
          values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
        }
        return values;
      }
    }
    function handleError(err, instance, type, throwInDev = true) {
      const contextVNode = instance ? instance.vnode : null;
      const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
      if (instance) {
        let cur = instance.parent;
        const exposedInstance = instance.proxy;
        const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
        while (cur) {
          const errorCapturedHooks = cur.ec;
          if (errorCapturedHooks) {
            for (let i = 0; i < errorCapturedHooks.length; i++) {
              if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
                return;
              }
            }
          }
          cur = cur.parent;
        }
        if (errorHandler) {
          pauseTracking();
          callWithErrorHandling(errorHandler, null, 10, [
            err,
            exposedInstance,
            errorInfo
          ]);
          resetTracking();
          return;
        }
      }
      logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
    }
    function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
      if (throwInProd) {
        throw err;
      } else {
        console.error(err);
      }
    }
    const queue = [];
    let flushIndex = -1;
    const pendingPostFlushCbs = [];
    let activePostFlushCbs = null;
    let postFlushIndex = 0;
    const resolvedPromise = /* @__PURE__ */ Promise.resolve();
    let currentFlushPromise = null;
    function nextTick(fn) {
      const p2 = currentFlushPromise || resolvedPromise;
      return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
    }
    function findInsertionIndex(id) {
      let start = flushIndex + 1;
      let end = queue.length;
      while (start < end) {
        const middle = start + end >>> 1;
        const middleJob = queue[middle];
        const middleJobId = getId(middleJob);
        if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      return start;
    }
    function queueJob(job) {
      if (!(job.flags & 1)) {
        const jobId = getId(job);
        const lastJob = queue[queue.length - 1];
        if (!lastJob || // fast path when the job id is larger than the tail
        !(job.flags & 2) && jobId >= getId(lastJob)) {
          queue.push(job);
        } else {
          queue.splice(findInsertionIndex(jobId), 0, job);
        }
        job.flags |= 1;
        queueFlush();
      }
    }
    function queueFlush() {
      if (!currentFlushPromise) {
        currentFlushPromise = resolvedPromise.then(flushJobs);
      }
    }
    function queuePostFlushCb(cb) {
      if (!isArray$1(cb)) {
        if (activePostFlushCbs && cb.id === -1) {
          activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
        } else if (!(cb.flags & 1)) {
          pendingPostFlushCbs.push(cb);
          cb.flags |= 1;
        }
      } else {
        pendingPostFlushCbs.push(...cb);
      }
      queueFlush();
    }
    function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
      for (; i < queue.length; i++) {
        const cb = queue[i];
        if (cb && cb.flags & 2) {
          if (instance && cb.id !== instance.uid) {
            continue;
          }
          queue.splice(i, 1);
          i--;
          if (cb.flags & 4) {
            cb.flags &= -2;
          }
          cb();
          if (!(cb.flags & 4)) {
            cb.flags &= -2;
          }
        }
      }
    }
    function flushPostFlushCbs(seen) {
      if (pendingPostFlushCbs.length) {
        const deduped = [...new Set(pendingPostFlushCbs)].sort(
          (a, b) => getId(a) - getId(b)
        );
        pendingPostFlushCbs.length = 0;
        if (activePostFlushCbs) {
          activePostFlushCbs.push(...deduped);
          return;
        }
        activePostFlushCbs = deduped;
        for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
          const cb = activePostFlushCbs[postFlushIndex];
          if (cb.flags & 4) {
            cb.flags &= -2;
          }
          if (!(cb.flags & 8)) cb();
          cb.flags &= -2;
        }
        activePostFlushCbs = null;
        postFlushIndex = 0;
      }
    }
    const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
    function flushJobs(seen) {
      try {
        for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
          const job = queue[flushIndex];
          if (job && !(job.flags & 8)) {
            if (false) ;
            if (job.flags & 4) {
              job.flags &= ~1;
            }
            callWithErrorHandling(
              job,
              job.i,
              job.i ? 15 : 14
            );
            if (!(job.flags & 4)) {
              job.flags &= ~1;
            }
          }
        }
      } finally {
        for (; flushIndex < queue.length; flushIndex++) {
          const job = queue[flushIndex];
          if (job) {
            job.flags &= -2;
          }
        }
        flushIndex = -1;
        queue.length = 0;
        flushPostFlushCbs();
        currentFlushPromise = null;
        if (queue.length || pendingPostFlushCbs.length) {
          flushJobs();
        }
      }
    }
    let currentRenderingInstance = null;
    let currentScopeId = null;
    function setCurrentRenderingInstance(instance) {
      const prev = currentRenderingInstance;
      currentRenderingInstance = instance;
      currentScopeId = instance && instance.type.__scopeId || null;
      return prev;
    }
    function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
      if (!ctx) return fn;
      if (fn._n) {
        return fn;
      }
      const renderFnWithContext = (...args) => {
        if (renderFnWithContext._d) {
          setBlockTracking(-1);
        }
        const prevInstance = setCurrentRenderingInstance(ctx);
        let res;
        try {
          res = fn(...args);
        } finally {
          setCurrentRenderingInstance(prevInstance);
          if (renderFnWithContext._d) {
            setBlockTracking(1);
          }
        }
        return res;
      };
      renderFnWithContext._n = true;
      renderFnWithContext._c = true;
      renderFnWithContext._d = true;
      return renderFnWithContext;
    }
    function withDirectives(vnode, directives) {
      if (currentRenderingInstance === null) {
        return vnode;
      }
      const instance = getComponentPublicInstance(currentRenderingInstance);
      const bindings = vnode.dirs || (vnode.dirs = []);
      for (let i = 0; i < directives.length; i++) {
        let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
        if (dir) {
          if (isFunction$1(dir)) {
            dir = {
              mounted: dir,
              updated: dir
            };
          }
          if (dir.deep) {
            traverse(value);
          }
          bindings.push({
            dir,
            instance,
            value,
            oldValue: void 0,
            arg,
            modifiers
          });
        }
      }
      return vnode;
    }
    function invokeDirectiveHook(vnode, prevVNode, instance, name) {
      const bindings = vnode.dirs;
      const oldBindings = prevVNode && prevVNode.dirs;
      for (let i = 0; i < bindings.length; i++) {
        const binding = bindings[i];
        if (oldBindings) {
          binding.oldValue = oldBindings[i].value;
        }
        let hook = binding.dir[name];
        if (hook) {
          pauseTracking();
          callWithAsyncErrorHandling(hook, instance, 8, [
            vnode.el,
            binding,
            vnode,
            prevVNode
          ]);
          resetTracking();
        }
      }
    }
    const TeleportEndKey = Symbol("_vte");
    const isTeleport = (type) => type.__isTeleport;
    function setTransitionHooks(vnode, hooks) {
      if (vnode.shapeFlag & 6 && vnode.component) {
        vnode.transition = hooks;
        setTransitionHooks(vnode.component.subTree, hooks);
      } else if (vnode.shapeFlag & 128) {
        vnode.ssContent.transition = hooks.clone(vnode.ssContent);
        vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
      } else {
        vnode.transition = hooks;
      }
    }
    /*! #__NO_SIDE_EFFECTS__ */
    // @__NO_SIDE_EFFECTS__
    function defineComponent(options, extraOptions) {
      return isFunction$1(options) ? (
        // #8236: extend call and options.name access are considered side-effects
        // by Rollup, so we have to wrap it in a pure-annotated IIFE.
        /* @__PURE__ */ (() => extend$1({ name: options.name }, extraOptions, { setup: options }))()
      ) : options;
    }
    function markAsyncBoundary(instance) {
      instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
    }
    function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
      if (isArray$1(rawRef)) {
        rawRef.forEach(
          (r, i) => setRef(
            r,
            oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
            parentSuspense,
            vnode,
            isUnmount
          )
        );
        return;
      }
      if (isAsyncWrapper(vnode) && !isUnmount) {
        if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
          setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
        }
        return;
      }
      const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
      const value = isUnmount ? null : refValue;
      const { i: owner, r: ref3 } = rawRef;
      const oldRef = oldRawRef && oldRawRef.r;
      const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
      const setupState = owner.setupState;
      const rawSetupState = toRaw(setupState);
      const canSetSetupRef = setupState === EMPTY_OBJ ? () => false : (key) => {
        return hasOwn(rawSetupState, key);
      };
      if (oldRef != null && oldRef !== ref3) {
        if (isString$1(oldRef)) {
          refs[oldRef] = null;
          if (canSetSetupRef(oldRef)) {
            setupState[oldRef] = null;
          }
        } else if (isRef(oldRef)) {
          oldRef.value = null;
        }
      }
      if (isFunction$1(ref3)) {
        callWithErrorHandling(ref3, owner, 12, [value, refs]);
      } else {
        const _isString = isString$1(ref3);
        const _isRef = isRef(ref3);
        if (_isString || _isRef) {
          const doSet = () => {
            if (rawRef.f) {
              const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
              if (isUnmount) {
                isArray$1(existing) && remove(existing, refValue);
              } else {
                if (!isArray$1(existing)) {
                  if (_isString) {
                    refs[ref3] = [refValue];
                    if (canSetSetupRef(ref3)) {
                      setupState[ref3] = refs[ref3];
                    }
                  } else {
                    ref3.value = [refValue];
                    if (rawRef.k) refs[rawRef.k] = ref3.value;
                  }
                } else if (!existing.includes(refValue)) {
                  existing.push(refValue);
                }
              }
            } else if (_isString) {
              refs[ref3] = value;
              if (canSetSetupRef(ref3)) {
                setupState[ref3] = value;
              }
            } else if (_isRef) {
              ref3.value = value;
              if (rawRef.k) refs[rawRef.k] = value;
            } else ;
          };
          if (value) {
            doSet.id = -1;
            queuePostRenderEffect(doSet, parentSuspense);
          } else {
            doSet();
          }
        }
      }
    }
    getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
    getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
    const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
    const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
    function onActivated(hook, target) {
      registerKeepAliveHook(hook, "a", target);
    }
    function onDeactivated(hook, target) {
      registerKeepAliveHook(hook, "da", target);
    }
    function registerKeepAliveHook(hook, type, target = currentInstance) {
      const wrappedHook = hook.__wdc || (hook.__wdc = () => {
        let current = target;
        while (current) {
          if (current.isDeactivated) {
            return;
          }
          current = current.parent;
        }
        return hook();
      });
      injectHook(type, wrappedHook, target);
      if (target) {
        let current = target.parent;
        while (current && current.parent) {
          if (isKeepAlive(current.parent.vnode)) {
            injectToKeepAliveRoot(wrappedHook, type, target, current);
          }
          current = current.parent;
        }
      }
    }
    function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
      const injected = injectHook(
        type,
        hook,
        keepAliveRoot,
        true
        /* prepend */
      );
      onUnmounted(() => {
        remove(keepAliveRoot[type], injected);
      }, target);
    }
    function injectHook(type, hook, target = currentInstance, prepend = false) {
      if (target) {
        const hooks = target[type] || (target[type] = []);
        const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
          pauseTracking();
          const reset = setCurrentInstance(target);
          const res = callWithAsyncErrorHandling(hook, target, type, args);
          reset();
          resetTracking();
          return res;
        });
        if (prepend) {
          hooks.unshift(wrappedHook);
        } else {
          hooks.push(wrappedHook);
        }
        return wrappedHook;
      }
    }
    const createHook = (lifecycle) => (hook, target = currentInstance) => {
      if (!isInSSRComponentSetup || lifecycle === "sp") {
        injectHook(lifecycle, (...args) => hook(...args), target);
      }
    };
    const onBeforeMount = createHook("bm");
    const onMounted = createHook("m");
    const onBeforeUpdate = createHook(
      "bu"
    );
    const onUpdated = createHook("u");
    const onBeforeUnmount = createHook(
      "bum"
    );
    const onUnmounted = createHook("um");
    const onServerPrefetch = createHook(
      "sp"
    );
    const onRenderTriggered = createHook("rtg");
    const onRenderTracked = createHook("rtc");
    function onErrorCaptured(hook, target = currentInstance) {
      injectHook("ec", hook, target);
    }
    const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
    function renderList(source, renderItem, cache, index) {
      let ret;
      const cached = cache;
      const sourceIsArray = isArray$1(source);
      if (sourceIsArray || isString$1(source)) {
        const sourceIsReactiveArray = sourceIsArray && isReactive(source);
        let needsWrap = false;
        let isReadonlySource = false;
        if (sourceIsReactiveArray) {
          needsWrap = !isShallow(source);
          isReadonlySource = isReadonly(source);
          source = shallowReadArray(source);
        }
        ret = new Array(source.length);
        for (let i = 0, l = source.length; i < l; i++) {
          ret[i] = renderItem(
            needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
            i,
            void 0,
            cached
          );
        }
      } else if (typeof source === "number") {
        ret = new Array(source);
        for (let i = 0; i < source; i++) {
          ret[i] = renderItem(i + 1, i, void 0, cached);
        }
      } else if (isObject$1(source)) {
        if (source[Symbol.iterator]) {
          ret = Array.from(
            source,
            (item, i) => renderItem(item, i, void 0, cached)
          );
        } else {
          const keys = Object.keys(source);
          ret = new Array(keys.length);
          for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i];
            ret[i] = renderItem(source[key], key, i, cached);
          }
        }
      } else {
        ret = [];
      }
      return ret;
    }
    const getPublicInstance = (i) => {
      if (!i) return null;
      if (isStatefulComponent(i)) return getComponentPublicInstance(i);
      return getPublicInstance(i.parent);
    };
    const publicPropertiesMap = (
      // Move PURE marker to new line to workaround compiler discarding it
      // due to type annotation
      /* @__PURE__ */ extend$1(/* @__PURE__ */ Object.create(null), {
        $: (i) => i,
        $el: (i) => i.vnode.el,
        $data: (i) => i.data,
        $props: (i) => i.props,
        $attrs: (i) => i.attrs,
        $slots: (i) => i.slots,
        $refs: (i) => i.refs,
        $parent: (i) => getPublicInstance(i.parent),
        $root: (i) => getPublicInstance(i.root),
        $host: (i) => i.ce,
        $emit: (i) => i.emit,
        $options: (i) => resolveMergedOptions(i),
        $forceUpdate: (i) => i.f || (i.f = () => {
          queueJob(i.update);
        }),
        $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
        $watch: (i) => instanceWatch.bind(i)
      })
    );
    const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
    const PublicInstanceProxyHandlers = {
      get({ _: instance }, key) {
        if (key === "__v_skip") {
          return true;
        }
        const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
        let normalizedProps;
        if (key[0] !== "$") {
          const n = accessCache[key];
          if (n !== void 0) {
            switch (n) {
              case 1:
                return setupState[key];
              case 2:
                return data[key];
              case 4:
                return ctx[key];
              case 3:
                return props[key];
            }
          } else if (hasSetupBinding(setupState, key)) {
            accessCache[key] = 1;
            return setupState[key];
          } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
            accessCache[key] = 2;
            return data[key];
          } else if (
            // only cache other properties when instance has declared (thus stable)
            // props
            (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
          ) {
            accessCache[key] = 3;
            return props[key];
          } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
            accessCache[key] = 4;
            return ctx[key];
          } else if (shouldCacheAccess) {
            accessCache[key] = 0;
          }
        }
        const publicGetter = publicPropertiesMap[key];
        let cssModule, globalProperties;
        if (publicGetter) {
          if (key === "$attrs") {
            track(instance.attrs, "get", "");
          }
          return publicGetter(instance);
        } else if (
          // css module (injected by vue-loader)
          (cssModule = type.__cssModules) && (cssModule = cssModule[key])
        ) {
          return cssModule;
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (
          // global properties
          globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
        ) {
          {
            return globalProperties[key];
          }
        } else ;
      },
      set({ _: instance }, key, value) {
        const { data, setupState, ctx } = instance;
        if (hasSetupBinding(setupState, key)) {
          setupState[key] = value;
          return true;
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          data[key] = value;
          return true;
        } else if (hasOwn(instance.props, key)) {
          return false;
        }
        if (key[0] === "$" && key.slice(1) in instance) {
          return false;
        } else {
          {
            ctx[key] = value;
          }
        }
        return true;
      },
      has({
        _: { data, setupState, accessCache, ctx, appContext, propsOptions }
      }, key) {
        let normalizedProps;
        return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
      },
      defineProperty(target, key, descriptor) {
        if (descriptor.get != null) {
          target._.accessCache[key] = 0;
        } else if (hasOwn(descriptor, "value")) {
          this.set(target, key, descriptor.value, null);
        }
        return Reflect.defineProperty(target, key, descriptor);
      }
    };
    function normalizePropsOrEmits(props) {
      return isArray$1(props) ? props.reduce(
        (normalized, p2) => (normalized[p2] = null, normalized),
        {}
      ) : props;
    }
    let shouldCacheAccess = true;
    function applyOptions(instance) {
      const options = resolveMergedOptions(instance);
      const publicThis = instance.proxy;
      const ctx = instance.ctx;
      shouldCacheAccess = false;
      if (options.beforeCreate) {
        callHook(options.beforeCreate, instance, "bc");
      }
      const {
        // state
        data: dataOptions,
        computed: computedOptions,
        methods,
        watch: watchOptions,
        provide: provideOptions,
        inject: injectOptions,
        // lifecycle
        created,
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeDestroy,
        beforeUnmount,
        destroyed,
        unmounted,
        render,
        renderTracked,
        renderTriggered,
        errorCaptured,
        serverPrefetch,
        // public API
        expose,
        inheritAttrs,
        // assets
        components,
        directives,
        filters
      } = options;
      const checkDuplicateProperties = null;
      if (injectOptions) {
        resolveInjections(injectOptions, ctx, checkDuplicateProperties);
      }
      if (methods) {
        for (const key in methods) {
          const methodHandler = methods[key];
          if (isFunction$1(methodHandler)) {
            {
              ctx[key] = methodHandler.bind(publicThis);
            }
          }
        }
      }
      if (dataOptions) {
        const data = dataOptions.call(publicThis, publicThis);
        if (!isObject$1(data)) ;
        else {
          instance.data = reactive(data);
        }
      }
      shouldCacheAccess = true;
      if (computedOptions) {
        for (const key in computedOptions) {
          const opt = computedOptions[key];
          const get = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
          const set = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
          const c = computed({
            get,
            set
          });
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            get: () => c.value,
            set: (v) => c.value = v
          });
        }
      }
      if (watchOptions) {
        for (const key in watchOptions) {
          createWatcher(watchOptions[key], ctx, publicThis, key);
        }
      }
      if (provideOptions) {
        const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
        Reflect.ownKeys(provides).forEach((key) => {
          provide(key, provides[key]);
        });
      }
      if (created) {
        callHook(created, instance, "c");
      }
      function registerLifecycleHook(register, hook) {
        if (isArray$1(hook)) {
          hook.forEach((_hook) => register(_hook.bind(publicThis)));
        } else if (hook) {
          register(hook.bind(publicThis));
        }
      }
      registerLifecycleHook(onBeforeMount, beforeMount);
      registerLifecycleHook(onMounted, mounted);
      registerLifecycleHook(onBeforeUpdate, beforeUpdate);
      registerLifecycleHook(onUpdated, updated);
      registerLifecycleHook(onActivated, activated);
      registerLifecycleHook(onDeactivated, deactivated);
      registerLifecycleHook(onErrorCaptured, errorCaptured);
      registerLifecycleHook(onRenderTracked, renderTracked);
      registerLifecycleHook(onRenderTriggered, renderTriggered);
      registerLifecycleHook(onBeforeUnmount, beforeUnmount);
      registerLifecycleHook(onUnmounted, unmounted);
      registerLifecycleHook(onServerPrefetch, serverPrefetch);
      if (isArray$1(expose)) {
        if (expose.length) {
          const exposed = instance.exposed || (instance.exposed = {});
          expose.forEach((key) => {
            Object.defineProperty(exposed, key, {
              get: () => publicThis[key],
              set: (val) => publicThis[key] = val
            });
          });
        } else if (!instance.exposed) {
          instance.exposed = {};
        }
      }
      if (render && instance.render === NOOP) {
        instance.render = render;
      }
      if (inheritAttrs != null) {
        instance.inheritAttrs = inheritAttrs;
      }
      if (components) instance.components = components;
      if (directives) instance.directives = directives;
      if (serverPrefetch) {
        markAsyncBoundary(instance);
      }
    }
    function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
      if (isArray$1(injectOptions)) {
        injectOptions = normalizeInject(injectOptions);
      }
      for (const key in injectOptions) {
        const opt = injectOptions[key];
        let injected;
        if (isObject$1(opt)) {
          if ("default" in opt) {
            injected = inject(
              opt.from || key,
              opt.default,
              true
            );
          } else {
            injected = inject(opt.from || key);
          }
        } else {
          injected = inject(opt);
        }
        if (isRef(injected)) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            get: () => injected.value,
            set: (v) => injected.value = v
          });
        } else {
          ctx[key] = injected;
        }
      }
    }
    function callHook(hook, instance, type) {
      callWithAsyncErrorHandling(
        isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
        instance,
        type
      );
    }
    function createWatcher(raw, ctx, publicThis, key) {
      let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
      if (isString$1(raw)) {
        const handler = ctx[raw];
        if (isFunction$1(handler)) {
          {
            watch(getter, handler);
          }
        }
      } else if (isFunction$1(raw)) {
        {
          watch(getter, raw.bind(publicThis));
        }
      } else if (isObject$1(raw)) {
        if (isArray$1(raw)) {
          raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
        } else {
          const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
          if (isFunction$1(handler)) {
            watch(getter, handler, raw);
          }
        }
      } else ;
    }
    function resolveMergedOptions(instance) {
      const base = instance.type;
      const { mixins, extends: extendsOptions } = base;
      const {
        mixins: globalMixins,
        optionsCache: cache,
        config: { optionMergeStrategies }
      } = instance.appContext;
      const cached = cache.get(base);
      let resolved;
      if (cached) {
        resolved = cached;
      } else if (!globalMixins.length && !mixins && !extendsOptions) {
        {
          resolved = base;
        }
      } else {
        resolved = {};
        if (globalMixins.length) {
          globalMixins.forEach(
            (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
          );
        }
        mergeOptions(resolved, base, optionMergeStrategies);
      }
      if (isObject$1(base)) {
        cache.set(base, resolved);
      }
      return resolved;
    }
    function mergeOptions(to, from, strats, asMixin = false) {
      const { mixins, extends: extendsOptions } = from;
      if (extendsOptions) {
        mergeOptions(to, extendsOptions, strats, true);
      }
      if (mixins) {
        mixins.forEach(
          (m) => mergeOptions(to, m, strats, true)
        );
      }
      for (const key in from) {
        if (asMixin && key === "expose") ;
        else {
          const strat = internalOptionMergeStrats[key] || strats && strats[key];
          to[key] = strat ? strat(to[key], from[key]) : from[key];
        }
      }
      return to;
    }
    const internalOptionMergeStrats = {
      data: mergeDataFn,
      props: mergeEmitsOrPropsOptions,
      emits: mergeEmitsOrPropsOptions,
      // objects
      methods: mergeObjectOptions,
      computed: mergeObjectOptions,
      // lifecycle
      beforeCreate: mergeAsArray,
      created: mergeAsArray,
      beforeMount: mergeAsArray,
      mounted: mergeAsArray,
      beforeUpdate: mergeAsArray,
      updated: mergeAsArray,
      beforeDestroy: mergeAsArray,
      beforeUnmount: mergeAsArray,
      destroyed: mergeAsArray,
      unmounted: mergeAsArray,
      activated: mergeAsArray,
      deactivated: mergeAsArray,
      errorCaptured: mergeAsArray,
      serverPrefetch: mergeAsArray,
      // assets
      components: mergeObjectOptions,
      directives: mergeObjectOptions,
      // watch
      watch: mergeWatchOptions,
      // provide / inject
      provide: mergeDataFn,
      inject: mergeInject
    };
    function mergeDataFn(to, from) {
      if (!from) {
        return to;
      }
      if (!to) {
        return from;
      }
      return function mergedDataFn() {
        return extend$1(
          isFunction$1(to) ? to.call(this, this) : to,
          isFunction$1(from) ? from.call(this, this) : from
        );
      };
    }
    function mergeInject(to, from) {
      return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
    }
    function normalizeInject(raw) {
      if (isArray$1(raw)) {
        const res = {};
        for (let i = 0; i < raw.length; i++) {
          res[raw[i]] = raw[i];
        }
        return res;
      }
      return raw;
    }
    function mergeAsArray(to, from) {
      return to ? [...new Set([].concat(to, from))] : from;
    }
    function mergeObjectOptions(to, from) {
      return to ? extend$1(/* @__PURE__ */ Object.create(null), to, from) : from;
    }
    function mergeEmitsOrPropsOptions(to, from) {
      if (to) {
        if (isArray$1(to) && isArray$1(from)) {
          return [.../* @__PURE__ */ new Set([...to, ...from])];
        }
        return extend$1(
          /* @__PURE__ */ Object.create(null),
          normalizePropsOrEmits(to),
          normalizePropsOrEmits(from != null ? from : {})
        );
      } else {
        return from;
      }
    }
    function mergeWatchOptions(to, from) {
      if (!to) return from;
      if (!from) return to;
      const merged = extend$1(/* @__PURE__ */ Object.create(null), to);
      for (const key in from) {
        merged[key] = mergeAsArray(to[key], from[key]);
      }
      return merged;
    }
    function createAppContext() {
      return {
        app: null,
        config: {
          isNativeTag: NO,
          performance: false,
          globalProperties: {},
          optionMergeStrategies: {},
          errorHandler: void 0,
          warnHandler: void 0,
          compilerOptions: {}
        },
        mixins: [],
        components: {},
        directives: {},
        provides: /* @__PURE__ */ Object.create(null),
        optionsCache: /* @__PURE__ */ new WeakMap(),
        propsCache: /* @__PURE__ */ new WeakMap(),
        emitsCache: /* @__PURE__ */ new WeakMap()
      };
    }
    let uid$1 = 0;
    function createAppAPI(render, hydrate) {
      return function createApp2(rootComponent, rootProps = null) {
        if (!isFunction$1(rootComponent)) {
          rootComponent = extend$1({}, rootComponent);
        }
        if (rootProps != null && !isObject$1(rootProps)) {
          rootProps = null;
        }
        const context = createAppContext();
        const installedPlugins = /* @__PURE__ */ new WeakSet();
        const pluginCleanupFns = [];
        let isMounted = false;
        const app = context.app = {
          _uid: uid$1++,
          _component: rootComponent,
          _props: rootProps,
          _container: null,
          _context: context,
          _instance: null,
          version,
          get config() {
            return context.config;
          },
          set config(v) {
          },
          use(plugin, ...options) {
            if (installedPlugins.has(plugin)) ;
            else if (plugin && isFunction$1(plugin.install)) {
              installedPlugins.add(plugin);
              plugin.install(app, ...options);
            } else if (isFunction$1(plugin)) {
              installedPlugins.add(plugin);
              plugin(app, ...options);
            } else ;
            return app;
          },
          mixin(mixin) {
            {
              if (!context.mixins.includes(mixin)) {
                context.mixins.push(mixin);
              }
            }
            return app;
          },
          component(name, component) {
            if (!component) {
              return context.components[name];
            }
            context.components[name] = component;
            return app;
          },
          directive(name, directive) {
            if (!directive) {
              return context.directives[name];
            }
            context.directives[name] = directive;
            return app;
          },
          mount(rootContainer, isHydrate, namespace) {
            if (!isMounted) {
              const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
              vnode.appContext = context;
              if (namespace === true) {
                namespace = "svg";
              } else if (namespace === false) {
                namespace = void 0;
              }
              {
                render(vnode, rootContainer, namespace);
              }
              isMounted = true;
              app._container = rootContainer;
              rootContainer.__vue_app__ = app;
              return getComponentPublicInstance(vnode.component);
            }
          },
          onUnmount(cleanupFn) {
            pluginCleanupFns.push(cleanupFn);
          },
          unmount() {
            if (isMounted) {
              callWithAsyncErrorHandling(
                pluginCleanupFns,
                app._instance,
                16
              );
              render(null, app._container);
              delete app._container.__vue_app__;
            }
          },
          provide(key, value) {
            context.provides[key] = value;
            return app;
          },
          runWithContext(fn) {
            const lastApp = currentApp;
            currentApp = app;
            try {
              return fn();
            } finally {
              currentApp = lastApp;
            }
          }
        };
        return app;
      };
    }
    let currentApp = null;
    function provide(key, value) {
      if (!currentInstance) ;
      else {
        let provides = currentInstance.provides;
        const parentProvides = currentInstance.parent && currentInstance.parent.provides;
        if (parentProvides === provides) {
          provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
      }
    }
    function inject(key, defaultValue, treatDefaultAsFactory = false) {
      const instance = currentInstance || currentRenderingInstance;
      if (instance || currentApp) {
        let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
        if (provides && key in provides) {
          return provides[key];
        } else if (arguments.length > 1) {
          return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
        } else ;
      }
    }
    const internalObjectProto = {};
    const createInternalObject = () => Object.create(internalObjectProto);
    const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
    function initProps(instance, rawProps, isStateful, isSSR = false) {
      const props = {};
      const attrs = createInternalObject();
      instance.propsDefaults = /* @__PURE__ */ Object.create(null);
      setFullProps(instance, rawProps, props, attrs);
      for (const key in instance.propsOptions[0]) {
        if (!(key in props)) {
          props[key] = void 0;
        }
      }
      if (isStateful) {
        instance.props = isSSR ? props : shallowReactive(props);
      } else {
        if (!instance.type.props) {
          instance.props = attrs;
        } else {
          instance.props = props;
        }
      }
      instance.attrs = attrs;
    }
    function updateProps(instance, rawProps, rawPrevProps, optimized) {
      const {
        props,
        attrs,
        vnode: { patchFlag }
      } = instance;
      const rawCurrentProps = toRaw(props);
      const [options] = instance.propsOptions;
      let hasAttrsChanged = false;
      if (
        // always force full diff in dev
        // - #1942 if hmr is enabled with sfc component
        // - vite#872 non-sfc component used by sfc component
        (optimized || patchFlag > 0) && !(patchFlag & 16)
      ) {
        if (patchFlag & 8) {
          const propsToUpdate = instance.vnode.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            let key = propsToUpdate[i];
            if (isEmitListener(instance.emitsOptions, key)) {
              continue;
            }
            const value = rawProps[key];
            if (options) {
              if (hasOwn(attrs, key)) {
                if (value !== attrs[key]) {
                  attrs[key] = value;
                  hasAttrsChanged = true;
                }
              } else {
                const camelizedKey = camelize(key);
                props[camelizedKey] = resolvePropValue(
                  options,
                  rawCurrentProps,
                  camelizedKey,
                  value,
                  instance,
                  false
                );
              }
            } else {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            }
          }
        }
      } else {
        if (setFullProps(instance, rawProps, props, attrs)) {
          hasAttrsChanged = true;
        }
        let kebabKey;
        for (const key in rawCurrentProps) {
          if (!rawProps || // for camelCase
          !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
          // and converted to camelCase (#955)
          ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
            if (options) {
              if (rawPrevProps && // for camelCase
              (rawPrevProps[key] !== void 0 || // for kebab-case
              rawPrevProps[kebabKey] !== void 0)) {
                props[key] = resolvePropValue(
                  options,
                  rawCurrentProps,
                  key,
                  void 0,
                  instance,
                  true
                );
              }
            } else {
              delete props[key];
            }
          }
        }
        if (attrs !== rawCurrentProps) {
          for (const key in attrs) {
            if (!rawProps || !hasOwn(rawProps, key) && true) {
              delete attrs[key];
              hasAttrsChanged = true;
            }
          }
        }
      }
      if (hasAttrsChanged) {
        trigger(instance.attrs, "set", "");
      }
    }
    function setFullProps(instance, rawProps, props, attrs) {
      const [options, needCastKeys] = instance.propsOptions;
      let hasAttrsChanged = false;
      let rawCastValues;
      if (rawProps) {
        for (let key in rawProps) {
          if (isReservedProp(key)) {
            continue;
          }
          const value = rawProps[key];
          let camelKey;
          if (options && hasOwn(options, camelKey = camelize(key))) {
            if (!needCastKeys || !needCastKeys.includes(camelKey)) {
              props[camelKey] = value;
            } else {
              (rawCastValues || (rawCastValues = {}))[camelKey] = value;
            }
          } else if (!isEmitListener(instance.emitsOptions, key)) {
            if (!(key in attrs) || value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
      if (needCastKeys) {
        const rawCurrentProps = toRaw(props);
        const castValues = rawCastValues || EMPTY_OBJ;
        for (let i = 0; i < needCastKeys.length; i++) {
          const key = needCastKeys[i];
          props[key] = resolvePropValue(
            options,
            rawCurrentProps,
            key,
            castValues[key],
            instance,
            !hasOwn(castValues, key)
          );
        }
      }
      return hasAttrsChanged;
    }
    function resolvePropValue(options, props, key, value, instance, isAbsent) {
      const opt = options[key];
      if (opt != null) {
        const hasDefault = hasOwn(opt, "default");
        if (hasDefault && value === void 0) {
          const defaultValue = opt.default;
          if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
            const { propsDefaults } = instance;
            if (key in propsDefaults) {
              value = propsDefaults[key];
            } else {
              const reset = setCurrentInstance(instance);
              value = propsDefaults[key] = defaultValue.call(
                null,
                props
              );
              reset();
            }
          } else {
            value = defaultValue;
          }
          if (instance.ce) {
            instance.ce._setProp(key, value);
          }
        }
        if (opt[
          0
          /* shouldCast */
        ]) {
          if (isAbsent && !hasDefault) {
            value = false;
          } else if (opt[
            1
            /* shouldCastTrue */
          ] && (value === "" || value === hyphenate(key))) {
            value = true;
          }
        }
      }
      return value;
    }
    const mixinPropsCache = /* @__PURE__ */ new WeakMap();
    function normalizePropsOptions(comp, appContext, asMixin = false) {
      const cache = asMixin ? mixinPropsCache : appContext.propsCache;
      const cached = cache.get(comp);
      if (cached) {
        return cached;
      }
      const raw = comp.props;
      const normalized = {};
      const needCastKeys = [];
      let hasExtends = false;
      if (!isFunction$1(comp)) {
        const extendProps = (raw2) => {
          hasExtends = true;
          const [props, keys] = normalizePropsOptions(raw2, appContext, true);
          extend$1(normalized, props);
          if (keys) needCastKeys.push(...keys);
        };
        if (!asMixin && appContext.mixins.length) {
          appContext.mixins.forEach(extendProps);
        }
        if (comp.extends) {
          extendProps(comp.extends);
        }
        if (comp.mixins) {
          comp.mixins.forEach(extendProps);
        }
      }
      if (!raw && !hasExtends) {
        if (isObject$1(comp)) {
          cache.set(comp, EMPTY_ARR);
        }
        return EMPTY_ARR;
      }
      if (isArray$1(raw)) {
        for (let i = 0; i < raw.length; i++) {
          const normalizedKey = camelize(raw[i]);
          if (validatePropName(normalizedKey)) {
            normalized[normalizedKey] = EMPTY_OBJ;
          }
        }
      } else if (raw) {
        for (const key in raw) {
          const normalizedKey = camelize(key);
          if (validatePropName(normalizedKey)) {
            const opt = raw[key];
            const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : extend$1({}, opt);
            const propType = prop.type;
            let shouldCast = false;
            let shouldCastTrue = true;
            if (isArray$1(propType)) {
              for (let index = 0; index < propType.length; ++index) {
                const type = propType[index];
                const typeName = isFunction$1(type) && type.name;
                if (typeName === "Boolean") {
                  shouldCast = true;
                  break;
                } else if (typeName === "String") {
                  shouldCastTrue = false;
                }
              }
            } else {
              shouldCast = isFunction$1(propType) && propType.name === "Boolean";
            }
            prop[
              0
              /* shouldCast */
            ] = shouldCast;
            prop[
              1
              /* shouldCastTrue */
            ] = shouldCastTrue;
            if (shouldCast || hasOwn(prop, "default")) {
              needCastKeys.push(normalizedKey);
            }
          }
        }
      }
      const res = [normalized, needCastKeys];
      if (isObject$1(comp)) {
        cache.set(comp, res);
      }
      return res;
    }
    function validatePropName(key) {
      if (key[0] !== "$" && !isReservedProp(key)) {
        return true;
      }
      return false;
    }
    const isInternalKey = (key) => key[0] === "_" || key === "$stable";
    const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
    const normalizeSlot = (key, rawSlot, ctx) => {
      if (rawSlot._n) {
        return rawSlot;
      }
      const normalized = withCtx((...args) => {
        if (false) ;
        return normalizeSlotValue(rawSlot(...args));
      }, ctx);
      normalized._c = false;
      return normalized;
    };
    const normalizeObjectSlots = (rawSlots, slots, instance) => {
      const ctx = rawSlots._ctx;
      for (const key in rawSlots) {
        if (isInternalKey(key)) continue;
        const value = rawSlots[key];
        if (isFunction$1(value)) {
          slots[key] = normalizeSlot(key, value, ctx);
        } else if (value != null) {
          const normalized = normalizeSlotValue(value);
          slots[key] = () => normalized;
        }
      }
    };
    const normalizeVNodeSlots = (instance, children) => {
      const normalized = normalizeSlotValue(children);
      instance.slots.default = () => normalized;
    };
    const assignSlots = (slots, children, optimized) => {
      for (const key in children) {
        if (optimized || !isInternalKey(key)) {
          slots[key] = children[key];
        }
      }
    };
    const initSlots = (instance, children, optimized) => {
      const slots = instance.slots = createInternalObject();
      if (instance.vnode.shapeFlag & 32) {
        const type = children._;
        if (type) {
          assignSlots(slots, children, optimized);
          if (optimized) {
            def(slots, "_", type, true);
          }
        } else {
          normalizeObjectSlots(children, slots);
        }
      } else if (children) {
        normalizeVNodeSlots(instance, children);
      }
    };
    const updateSlots = (instance, children, optimized) => {
      const { vnode, slots } = instance;
      let needDeletionCheck = true;
      let deletionComparisonTarget = EMPTY_OBJ;
      if (vnode.shapeFlag & 32) {
        const type = children._;
        if (type) {
          if (optimized && type === 1) {
            needDeletionCheck = false;
          } else {
            assignSlots(slots, children, optimized);
          }
        } else {
          needDeletionCheck = !children.$stable;
          normalizeObjectSlots(children, slots);
        }
        deletionComparisonTarget = children;
      } else if (children) {
        normalizeVNodeSlots(instance, children);
        deletionComparisonTarget = { default: 1 };
      }
      if (needDeletionCheck) {
        for (const key in slots) {
          if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
            delete slots[key];
          }
        }
      }
    };
    const queuePostRenderEffect = queueEffectWithSuspense;
    function createRenderer(options) {
      return baseCreateRenderer(options);
    }
    function baseCreateRenderer(options, createHydrationFns) {
      const target = getGlobalThis();
      target.__VUE__ = true;
      const {
        insert: hostInsert,
        remove: hostRemove,
        patchProp: hostPatchProp,
        createElement: hostCreateElement,
        createText: hostCreateText,
        createComment: hostCreateComment,
        setText: hostSetText,
        setElementText: hostSetElementText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        setScopeId: hostSetScopeId = NOOP,
        insertStaticContent: hostInsertStaticContent
      } = options;
      const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
        if (n1 === n2) {
          return;
        }
        if (n1 && !isSameVNodeType(n1, n2)) {
          anchor = getNextHostNode(n1);
          unmount(n1, parentComponent, parentSuspense, true);
          n1 = null;
        }
        if (n2.patchFlag === -2) {
          optimized = false;
          n2.dynamicChildren = null;
        }
        const { type, ref: ref3, shapeFlag } = n2;
        switch (type) {
          case Text:
            processText(n1, n2, container, anchor);
            break;
          case Comment:
            processCommentNode(n1, n2, container, anchor);
            break;
          case Static:
            if (n1 == null) {
              mountStaticNode(n2, container, anchor, namespace);
            }
            break;
          case Fragment:
            processFragment(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            break;
          default:
            if (shapeFlag & 1) {
              processElement(
                n1,
                n2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
            } else if (shapeFlag & 6) {
              processComponent(
                n1,
                n2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
            } else if (shapeFlag & 64) {
              type.process(
                n1,
                n2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized,
                internals
              );
            } else if (shapeFlag & 128) {
              type.process(
                n1,
                n2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized,
                internals
              );
            } else ;
        }
        if (ref3 != null && parentComponent) {
          setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
        }
      };
      const processText = (n1, n2, container, anchor) => {
        if (n1 == null) {
          hostInsert(
            n2.el = hostCreateText(n2.children),
            container,
            anchor
          );
        } else {
          const el = n2.el = n1.el;
          if (n2.children !== n1.children) {
            hostSetText(el, n2.children);
          }
        }
      };
      const processCommentNode = (n1, n2, container, anchor) => {
        if (n1 == null) {
          hostInsert(
            n2.el = hostCreateComment(n2.children || ""),
            container,
            anchor
          );
        } else {
          n2.el = n1.el;
        }
      };
      const mountStaticNode = (n2, container, anchor, namespace) => {
        [n2.el, n2.anchor] = hostInsertStaticContent(
          n2.children,
          container,
          anchor,
          namespace,
          n2.el,
          n2.anchor
        );
      };
      const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
        let next;
        while (el && el !== anchor) {
          next = hostNextSibling(el);
          hostInsert(el, container, nextSibling);
          el = next;
        }
        hostInsert(anchor, container, nextSibling);
      };
      const removeStaticNode = ({ el, anchor }) => {
        let next;
        while (el && el !== anchor) {
          next = hostNextSibling(el);
          hostRemove(el);
          el = next;
        }
        hostRemove(anchor);
      };
      const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        if (n2.type === "svg") {
          namespace = "svg";
        } else if (n2.type === "math") {
          namespace = "mathml";
        }
        if (n1 == null) {
          mountElement(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          patchElement(
            n1,
            n2,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      };
      const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        let el;
        let vnodeHook;
        const { props, shapeFlag, transition, dirs } = vnode;
        el = vnode.el = hostCreateElement(
          vnode.type,
          namespace,
          props && props.is,
          props
        );
        if (shapeFlag & 8) {
          hostSetElementText(el, vnode.children);
        } else if (shapeFlag & 16) {
          mountChildren(
            vnode.children,
            el,
            null,
            parentComponent,
            parentSuspense,
            resolveChildrenNamespace(vnode, namespace),
            slotScopeIds,
            optimized
          );
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "created");
        }
        setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
        if (props) {
          for (const key in props) {
            if (key !== "value" && !isReservedProp(key)) {
              hostPatchProp(el, key, null, props[key], namespace, parentComponent);
            }
          }
          if ("value" in props) {
            hostPatchProp(el, "value", null, props.value, namespace);
          }
          if (vnodeHook = props.onVnodeBeforeMount) {
            invokeVNodeHook(vnodeHook, parentComponent, vnode);
          }
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
        }
        const needCallTransitionHooks = needTransition(parentSuspense, transition);
        if (needCallTransitionHooks) {
          transition.beforeEnter(el);
        }
        hostInsert(el, container, anchor);
        if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
          queuePostRenderEffect(() => {
            vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
            needCallTransitionHooks && transition.enter(el);
            dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
          }, parentSuspense);
        }
      };
      const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
        if (scopeId) {
          hostSetScopeId(el, scopeId);
        }
        if (slotScopeIds) {
          for (let i = 0; i < slotScopeIds.length; i++) {
            hostSetScopeId(el, slotScopeIds[i]);
          }
        }
        if (parentComponent) {
          let subTree = parentComponent.subTree;
          if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
            const parentVNode = parentComponent.vnode;
            setScopeId(
              el,
              parentVNode,
              parentVNode.scopeId,
              parentVNode.slotScopeIds,
              parentComponent.parent
            );
          }
        }
      };
      const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
        for (let i = start; i < children.length; i++) {
          const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
          patch(
            null,
            child,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      };
      const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        const el = n2.el = n1.el;
        let { patchFlag, dynamicChildren, dirs } = n2;
        patchFlag |= n1.patchFlag & 16;
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;
        let vnodeHook;
        parentComponent && toggleRecurse(parentComponent, false);
        if (vnodeHook = newProps.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        }
        if (dirs) {
          invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
        }
        parentComponent && toggleRecurse(parentComponent, true);
        if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
          hostSetElementText(el, "");
        }
        if (dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            el,
            parentComponent,
            parentSuspense,
            resolveChildrenNamespace(n2, namespace),
            slotScopeIds
          );
        } else if (!optimized) {
          patchChildren(
            n1,
            n2,
            el,
            null,
            parentComponent,
            parentSuspense,
            resolveChildrenNamespace(n2, namespace),
            slotScopeIds,
            false
          );
        }
        if (patchFlag > 0) {
          if (patchFlag & 16) {
            patchProps(el, oldProps, newProps, parentComponent, namespace);
          } else {
            if (patchFlag & 2) {
              if (oldProps.class !== newProps.class) {
                hostPatchProp(el, "class", null, newProps.class, namespace);
              }
            }
            if (patchFlag & 4) {
              hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
            }
            if (patchFlag & 8) {
              const propsToUpdate = n2.dynamicProps;
              for (let i = 0; i < propsToUpdate.length; i++) {
                const key = propsToUpdate[i];
                const prev = oldProps[key];
                const next = newProps[key];
                if (next !== prev || key === "value") {
                  hostPatchProp(el, key, prev, next, namespace, parentComponent);
                }
              }
            }
          }
          if (patchFlag & 1) {
            if (n1.children !== n2.children) {
              hostSetElementText(el, n2.children);
            }
          }
        } else if (!optimized && dynamicChildren == null) {
          patchProps(el, oldProps, newProps, parentComponent, namespace);
        }
        if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
          queuePostRenderEffect(() => {
            vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
            dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
          }, parentSuspense);
        }
      };
      const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
        for (let i = 0; i < newChildren.length; i++) {
          const oldVNode = oldChildren[i];
          const newVNode = newChildren[i];
          const container = (
            // oldVNode may be an errored async setup() component inside Suspense
            // which will not have a mounted element
            oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
            // of the Fragment itself so it can move its children.
            (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
            // which also requires the correct parent container
            !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
            oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
              // In other cases, the parent container is not actually used so we
              // just pass the block element here to avoid a DOM parentNode call.
              fallbackContainer
            )
          );
          patch(
            oldVNode,
            newVNode,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            true
          );
        }
      };
      const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
        if (oldProps !== newProps) {
          if (oldProps !== EMPTY_OBJ) {
            for (const key in oldProps) {
              if (!isReservedProp(key) && !(key in newProps)) {
                hostPatchProp(
                  el,
                  key,
                  oldProps[key],
                  null,
                  namespace,
                  parentComponent
                );
              }
            }
          }
          for (const key in newProps) {
            if (isReservedProp(key)) continue;
            const next = newProps[key];
            const prev = oldProps[key];
            if (next !== prev && key !== "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
          if ("value" in newProps) {
            hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
          }
        }
      };
      const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
        const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
        let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
        if (fragmentSlotScopeIds) {
          slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
        }
        if (n1 == null) {
          hostInsert(fragmentStartAnchor, container, anchor);
          hostInsert(fragmentEndAnchor, container, anchor);
          mountChildren(
            // #10007
            // such fragment like `<></>` will be compiled into
            // a fragment which doesn't have a children.
            // In this case fallback to an empty array
            n2.children || [],
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
          // of renderSlot() with no valid children
          n1.dynamicChildren) {
            patchBlockChildren(
              n1.dynamicChildren,
              dynamicChildren,
              container,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds
            );
            if (
              // #2080 if the stable fragment has a key, it's a <template v-for> that may
              //  get moved around. Make sure all root level vnodes inherit el.
              // #2134 or if it's a component root, it may also get moved around
              // as the component is being moved.
              n2.key != null || parentComponent && n2 === parentComponent.subTree
            ) {
              traverseStaticChildren(
                n1,
                n2,
                true
                /* shallow */
              );
            }
          } else {
            patchChildren(
              n1,
              n2,
              container,
              fragmentEndAnchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        }
      };
      const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        n2.slotScopeIds = slotScopeIds;
        if (n1 == null) {
          if (n2.shapeFlag & 512) {
            parentComponent.ctx.activate(
              n2,
              container,
              anchor,
              namespace,
              optimized
            );
          } else {
            mountComponent(
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              optimized
            );
          }
        } else {
          updateComponent(n1, n2, optimized);
        }
      };
      const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
        const instance = initialVNode.component = createComponentInstance(
          initialVNode,
          parentComponent,
          parentSuspense
        );
        if (isKeepAlive(initialVNode)) {
          instance.ctx.renderer = internals;
        }
        {
          setupComponent(instance, false, optimized);
        }
        if (instance.asyncDep) {
          parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
          if (!initialVNode.el) {
            const placeholder = instance.subTree = createVNode(Comment);
            processCommentNode(null, placeholder, container, anchor);
          }
        } else {
          setupRenderEffect(
            instance,
            initialVNode,
            container,
            anchor,
            parentSuspense,
            namespace,
            optimized
          );
        }
      };
      const updateComponent = (n1, n2, optimized) => {
        const instance = n2.component = n1.component;
        if (shouldUpdateComponent(n1, n2, optimized)) {
          if (instance.asyncDep && !instance.asyncResolved) {
            updateComponentPreRender(instance, n2, optimized);
            return;
          } else {
            instance.next = n2;
            instance.update();
          }
        } else {
          n2.el = n1.el;
          instance.vnode = n2;
        }
      };
      const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
        const componentUpdateFn = () => {
          if (!instance.isMounted) {
            let vnodeHook;
            const { el, props } = initialVNode;
            const { bm, m, parent, root, type } = instance;
            const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
            toggleRecurse(instance, false);
            if (bm) {
              invokeArrayFns(bm);
            }
            if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
              invokeVNodeHook(vnodeHook, parent, initialVNode);
            }
            toggleRecurse(instance, true);
            {
              if (root.ce) {
                root.ce._injectChildStyle(type);
              }
              const subTree = instance.subTree = renderComponentRoot(instance);
              patch(
                null,
                subTree,
                container,
                anchor,
                instance,
                parentSuspense,
                namespace
              );
              initialVNode.el = subTree.el;
            }
            if (m) {
              queuePostRenderEffect(m, parentSuspense);
            }
            if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
              const scopedInitialVNode = initialVNode;
              queuePostRenderEffect(
                () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
                parentSuspense
              );
            }
            if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
              instance.a && queuePostRenderEffect(instance.a, parentSuspense);
            }
            instance.isMounted = true;
            initialVNode = container = anchor = null;
          } else {
            let { next, bu, u, parent, vnode } = instance;
            {
              const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
              if (nonHydratedAsyncRoot) {
                if (next) {
                  next.el = vnode.el;
                  updateComponentPreRender(instance, next, optimized);
                }
                nonHydratedAsyncRoot.asyncDep.then(() => {
                  if (!instance.isUnmounted) {
                    componentUpdateFn();
                  }
                });
                return;
              }
            }
            let originNext = next;
            let vnodeHook;
            toggleRecurse(instance, false);
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            } else {
              next = vnode;
            }
            if (bu) {
              invokeArrayFns(bu);
            }
            if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
              invokeVNodeHook(vnodeHook, parent, next, vnode);
            }
            toggleRecurse(instance, true);
            const nextTree = renderComponentRoot(instance);
            const prevTree = instance.subTree;
            instance.subTree = nextTree;
            patch(
              prevTree,
              nextTree,
              // parent may have changed if it's in a teleport
              hostParentNode(prevTree.el),
              // anchor may have changed if it's in a fragment
              getNextHostNode(prevTree),
              instance,
              parentSuspense,
              namespace
            );
            next.el = nextTree.el;
            if (originNext === null) {
              updateHOCHostEl(instance, nextTree.el);
            }
            if (u) {
              queuePostRenderEffect(u, parentSuspense);
            }
            if (vnodeHook = next.props && next.props.onVnodeUpdated) {
              queuePostRenderEffect(
                () => invokeVNodeHook(vnodeHook, parent, next, vnode),
                parentSuspense
              );
            }
          }
        };
        instance.scope.on();
        const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
        instance.scope.off();
        const update = instance.update = effect2.run.bind(effect2);
        const job = instance.job = effect2.runIfDirty.bind(effect2);
        job.i = instance;
        job.id = instance.uid;
        effect2.scheduler = () => queueJob(job);
        toggleRecurse(instance, true);
        update();
      };
      const updateComponentPreRender = (instance, nextVNode, optimized) => {
        nextVNode.component = instance;
        const prevProps = instance.vnode.props;
        instance.vnode = nextVNode;
        instance.next = null;
        updateProps(instance, nextVNode.props, prevProps, optimized);
        updateSlots(instance, nextVNode.children, optimized);
        pauseTracking();
        flushPreFlushCbs(instance);
        resetTracking();
      };
      const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
        const c1 = n1 && n1.children;
        const prevShapeFlag = n1 ? n1.shapeFlag : 0;
        const c2 = n2.children;
        const { patchFlag, shapeFlag } = n2;
        if (patchFlag > 0) {
          if (patchFlag & 128) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            return;
          } else if (patchFlag & 256) {
            patchUnkeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            return;
          }
        }
        if (shapeFlag & 8) {
          if (prevShapeFlag & 16) {
            unmountChildren(c1, parentComponent, parentSuspense);
          }
          if (c2 !== c1) {
            hostSetElementText(container, c2);
          }
        } else {
          if (prevShapeFlag & 16) {
            if (shapeFlag & 16) {
              patchKeyedChildren(
                c1,
                c2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
            } else {
              unmountChildren(c1, parentComponent, parentSuspense, true);
            }
          } else {
            if (prevShapeFlag & 8) {
              hostSetElementText(container, "");
            }
            if (shapeFlag & 16) {
              mountChildren(
                c2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
            }
          }
        }
      };
      const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        c1 = c1 || EMPTY_ARR;
        c2 = c2 || EMPTY_ARR;
        const oldLength = c1.length;
        const newLength = c2.length;
        const commonLength = Math.min(oldLength, newLength);
        let i;
        for (i = 0; i < commonLength; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          patch(
            c1[i],
            nextChild,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
        if (oldLength > newLength) {
          unmountChildren(
            c1,
            parentComponent,
            parentSuspense,
            true,
            false,
            commonLength
          );
        } else {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            commonLength
          );
        }
      };
      const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        let i = 0;
        const l2 = c2.length;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;
        while (i <= e1 && i <= e2) {
          const n1 = c1[i];
          const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (isSameVNodeType(n1, n2)) {
            patch(
              n1,
              n2,
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            break;
          }
          i++;
        }
        while (i <= e1 && i <= e2) {
          const n1 = c1[e1];
          const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
          if (isSameVNodeType(n1, n2)) {
            patch(
              n1,
              n2,
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            break;
          }
          e1--;
          e2--;
        }
        if (i > e1) {
          if (i <= e2) {
            const nextPos = e2 + 1;
            const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
            while (i <= e2) {
              patch(
                null,
                c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
              i++;
            }
          }
        } else if (i > e2) {
          while (i <= e1) {
            unmount(c1[i], parentComponent, parentSuspense, true);
            i++;
          }
        } else {
          const s1 = i;
          const s2 = i;
          const keyToNewIndexMap = /* @__PURE__ */ new Map();
          for (i = s2; i <= e2; i++) {
            const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
            if (nextChild.key != null) {
              keyToNewIndexMap.set(nextChild.key, i);
            }
          }
          let j;
          let patched = 0;
          const toBePatched = e2 - s2 + 1;
          let moved = false;
          let maxNewIndexSoFar = 0;
          const newIndexToOldIndexMap = new Array(toBePatched);
          for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
          for (i = s1; i <= e1; i++) {
            const prevChild = c1[i];
            if (patched >= toBePatched) {
              unmount(prevChild, parentComponent, parentSuspense, true);
              continue;
            }
            let newIndex;
            if (prevChild.key != null) {
              newIndex = keyToNewIndexMap.get(prevChild.key);
            } else {
              for (j = s2; j <= e2; j++) {
                if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                  newIndex = j;
                  break;
                }
              }
            }
            if (newIndex === void 0) {
              unmount(prevChild, parentComponent, parentSuspense, true);
            } else {
              newIndexToOldIndexMap[newIndex - s2] = i + 1;
              if (newIndex >= maxNewIndexSoFar) {
                maxNewIndexSoFar = newIndex;
              } else {
                moved = true;
              }
              patch(
                prevChild,
                c2[newIndex],
                container,
                null,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
              patched++;
            }
          }
          const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
          j = increasingNewIndexSequence.length - 1;
          for (i = toBePatched - 1; i >= 0; i--) {
            const nextIndex = s2 + i;
            const nextChild = c2[nextIndex];
            const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
            if (newIndexToOldIndexMap[i] === 0) {
              patch(
                null,
                nextChild,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
            } else if (moved) {
              if (j < 0 || i !== increasingNewIndexSequence[j]) {
                move(nextChild, container, anchor, 2);
              } else {
                j--;
              }
            }
          }
        }
      };
      const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
        const { el, type, transition, children, shapeFlag } = vnode;
        if (shapeFlag & 6) {
          move(vnode.component.subTree, container, anchor, moveType);
          return;
        }
        if (shapeFlag & 128) {
          vnode.suspense.move(container, anchor, moveType);
          return;
        }
        if (shapeFlag & 64) {
          type.move(vnode, container, anchor, internals);
          return;
        }
        if (type === Fragment) {
          hostInsert(el, container, anchor);
          for (let i = 0; i < children.length; i++) {
            move(children[i], container, anchor, moveType);
          }
          hostInsert(vnode.anchor, container, anchor);
          return;
        }
        if (type === Static) {
          moveStaticNode(vnode, container, anchor);
          return;
        }
        const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
        if (needTransition2) {
          if (moveType === 0) {
            transition.beforeEnter(el);
            hostInsert(el, container, anchor);
            queuePostRenderEffect(() => transition.enter(el), parentSuspense);
          } else {
            const { leave, delayLeave, afterLeave } = transition;
            const remove22 = () => {
              if (vnode.ctx.isUnmounted) {
                hostRemove(el);
              } else {
                hostInsert(el, container, anchor);
              }
            };
            const performLeave = () => {
              leave(el, () => {
                remove22();
                afterLeave && afterLeave();
              });
            };
            if (delayLeave) {
              delayLeave(el, remove22, performLeave);
            } else {
              performLeave();
            }
          }
        } else {
          hostInsert(el, container, anchor);
        }
      };
      const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
        const {
          type,
          props,
          ref: ref3,
          children,
          dynamicChildren,
          shapeFlag,
          patchFlag,
          dirs,
          cacheIndex
        } = vnode;
        if (patchFlag === -2) {
          optimized = false;
        }
        if (ref3 != null) {
          pauseTracking();
          setRef(ref3, null, parentSuspense, vnode, true);
          resetTracking();
        }
        if (cacheIndex != null) {
          parentComponent.renderCache[cacheIndex] = void 0;
        }
        if (shapeFlag & 256) {
          parentComponent.ctx.deactivate(vnode);
          return;
        }
        const shouldInvokeDirs = shapeFlag & 1 && dirs;
        const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
        let vnodeHook;
        if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
        if (shapeFlag & 6) {
          unmountComponent(vnode.component, parentSuspense, doRemove);
        } else {
          if (shapeFlag & 128) {
            vnode.suspense.unmount(parentSuspense, doRemove);
            return;
          }
          if (shouldInvokeDirs) {
            invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
          }
          if (shapeFlag & 64) {
            vnode.type.remove(
              vnode,
              parentComponent,
              parentSuspense,
              internals,
              doRemove
            );
          } else if (dynamicChildren && // #5154
          // when v-once is used inside a block, setBlockTracking(-1) marks the
          // parent block with hasOnce: true
          // so that it doesn't take the fast path during unmount - otherwise
          // components nested in v-once are never unmounted.
          !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
          (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
            unmountChildren(
              dynamicChildren,
              parentComponent,
              parentSuspense,
              false,
              true
            );
          } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
            unmountChildren(children, parentComponent, parentSuspense);
          }
          if (doRemove) {
            remove2(vnode);
          }
        }
        if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
          queuePostRenderEffect(() => {
            vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
            shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
          }, parentSuspense);
        }
      };
      const remove2 = (vnode) => {
        const { type, el, anchor, transition } = vnode;
        if (type === Fragment) {
          {
            removeFragment(el, anchor);
          }
          return;
        }
        if (type === Static) {
          removeStaticNode(vnode);
          return;
        }
        const performRemove = () => {
          hostRemove(el);
          if (transition && !transition.persisted && transition.afterLeave) {
            transition.afterLeave();
          }
        };
        if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
          const { leave, delayLeave } = transition;
          const performLeave = () => leave(el, performRemove);
          if (delayLeave) {
            delayLeave(vnode.el, performRemove, performLeave);
          } else {
            performLeave();
          }
        } else {
          performRemove();
        }
      };
      const removeFragment = (cur, end) => {
        let next;
        while (cur !== end) {
          next = hostNextSibling(cur);
          hostRemove(cur);
          cur = next;
        }
        hostRemove(end);
      };
      const unmountComponent = (instance, parentSuspense, doRemove) => {
        const {
          bum,
          scope,
          job,
          subTree,
          um,
          m,
          a,
          parent,
          slots: { __: slotCacheKeys }
        } = instance;
        invalidateMount(m);
        invalidateMount(a);
        if (bum) {
          invokeArrayFns(bum);
        }
        if (parent && isArray$1(slotCacheKeys)) {
          slotCacheKeys.forEach((v) => {
            parent.renderCache[v] = void 0;
          });
        }
        scope.stop();
        if (job) {
          job.flags |= 8;
          unmount(subTree, instance, parentSuspense, doRemove);
        }
        if (um) {
          queuePostRenderEffect(um, parentSuspense);
        }
        queuePostRenderEffect(() => {
          instance.isUnmounted = true;
        }, parentSuspense);
        if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
          parentSuspense.deps--;
          if (parentSuspense.deps === 0) {
            parentSuspense.resolve();
          }
        }
      };
      const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
        for (let i = start; i < children.length; i++) {
          unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
        }
      };
      const getNextHostNode = (vnode) => {
        if (vnode.shapeFlag & 6) {
          return getNextHostNode(vnode.component.subTree);
        }
        if (vnode.shapeFlag & 128) {
          return vnode.suspense.next();
        }
        const el = hostNextSibling(vnode.anchor || vnode.el);
        const teleportEnd = el && el[TeleportEndKey];
        return teleportEnd ? hostNextSibling(teleportEnd) : el;
      };
      let isFlushing = false;
      const render = (vnode, container, namespace) => {
        if (vnode == null) {
          if (container._vnode) {
            unmount(container._vnode, null, null, true);
          }
        } else {
          patch(
            container._vnode || null,
            vnode,
            container,
            null,
            null,
            null,
            namespace
          );
        }
        container._vnode = vnode;
        if (!isFlushing) {
          isFlushing = true;
          flushPreFlushCbs();
          flushPostFlushCbs();
          isFlushing = false;
        }
      };
      const internals = {
        p: patch,
        um: unmount,
        m: move,
        r: remove2,
        mt: mountComponent,
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        n: getNextHostNode,
        o: options
      };
      let hydrate;
      return {
        render,
        hydrate,
        createApp: createAppAPI(render)
      };
    }
    function resolveChildrenNamespace({ type, props }, currentNamespace) {
      return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
    }
    function toggleRecurse({ effect: effect2, job }, allowed) {
      if (allowed) {
        effect2.flags |= 32;
        job.flags |= 4;
      } else {
        effect2.flags &= -33;
        job.flags &= -5;
      }
    }
    function needTransition(parentSuspense, transition) {
      return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    }
    function traverseStaticChildren(n1, n2, shallow = false) {
      const ch1 = n1.children;
      const ch2 = n2.children;
      if (isArray$1(ch1) && isArray$1(ch2)) {
        for (let i = 0; i < ch1.length; i++) {
          const c1 = ch1[i];
          let c2 = ch2[i];
          if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
            if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
              c2 = ch2[i] = cloneIfMounted(ch2[i]);
              c2.el = c1.el;
            }
            if (!shallow && c2.patchFlag !== -2)
              traverseStaticChildren(c1, c2);
          }
          if (c2.type === Text) {
            c2.el = c1.el;
          }
          if (c2.type === Comment && !c2.el) {
            c2.el = c1.el;
          }
        }
      }
    }
    function getSequence(arr) {
      const p2 = arr.slice();
      const result = [0];
      let i, j, u, v, c;
      const len = arr.length;
      for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
          j = result[result.length - 1];
          if (arr[j] < arrI) {
            p2[i] = j;
            result.push(i);
            continue;
          }
          u = 0;
          v = result.length - 1;
          while (u < v) {
            c = u + v >> 1;
            if (arr[result[c]] < arrI) {
              u = c + 1;
            } else {
              v = c;
            }
          }
          if (arrI < arr[result[u]]) {
            if (u > 0) {
              p2[i] = result[u - 1];
            }
            result[u] = i;
          }
        }
      }
      u = result.length;
      v = result[u - 1];
      while (u-- > 0) {
        result[u] = v;
        v = p2[v];
      }
      return result;
    }
    function locateNonHydratedAsyncRoot(instance) {
      const subComponent = instance.subTree.component;
      if (subComponent) {
        if (subComponent.asyncDep && !subComponent.asyncResolved) {
          return subComponent;
        } else {
          return locateNonHydratedAsyncRoot(subComponent);
        }
      }
    }
    function invalidateMount(hooks) {
      if (hooks) {
        for (let i = 0; i < hooks.length; i++)
          hooks[i].flags |= 8;
      }
    }
    const ssrContextKey = Symbol.for("v-scx");
    const useSSRContext = () => {
      {
        const ctx = inject(ssrContextKey);
        return ctx;
      }
    };
    function watch(source, cb, options) {
      return doWatch(source, cb, options);
    }
    function doWatch(source, cb, options = EMPTY_OBJ) {
      const { immediate, deep, flush, once } = options;
      const baseWatchOptions = extend$1({}, options);
      const runsImmediately = cb && immediate || !cb && flush !== "post";
      let ssrCleanup;
      if (isInSSRComponentSetup) {
        if (flush === "sync") {
          const ctx = useSSRContext();
          ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
        } else if (!runsImmediately) {
          const watchStopHandle = () => {
          };
          watchStopHandle.stop = NOOP;
          watchStopHandle.resume = NOOP;
          watchStopHandle.pause = NOOP;
          return watchStopHandle;
        }
      }
      const instance = currentInstance;
      baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
      let isPre = false;
      if (flush === "post") {
        baseWatchOptions.scheduler = (job) => {
          queuePostRenderEffect(job, instance && instance.suspense);
        };
      } else if (flush !== "sync") {
        isPre = true;
        baseWatchOptions.scheduler = (job, isFirstRun) => {
          if (isFirstRun) {
            job();
          } else {
            queueJob(job);
          }
        };
      }
      baseWatchOptions.augmentJob = (job) => {
        if (cb) {
          job.flags |= 4;
        }
        if (isPre) {
          job.flags |= 2;
          if (instance) {
            job.id = instance.uid;
            job.i = instance;
          }
        }
      };
      const watchHandle = watch$1(source, cb, baseWatchOptions);
      if (isInSSRComponentSetup) {
        if (ssrCleanup) {
          ssrCleanup.push(watchHandle);
        } else if (runsImmediately) {
          watchHandle();
        }
      }
      return watchHandle;
    }
    function instanceWatch(source, value, options) {
      const publicThis = this.proxy;
      const getter = isString$1(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
      let cb;
      if (isFunction$1(value)) {
        cb = value;
      } else {
        cb = value.handler;
        options = value;
      }
      const reset = setCurrentInstance(this);
      const res = doWatch(getter, cb.bind(publicThis), options);
      reset();
      return res;
    }
    function createPathGetter(ctx, path) {
      const segments = path.split(".");
      return () => {
        let cur = ctx;
        for (let i = 0; i < segments.length && cur; i++) {
          cur = cur[segments[i]];
        }
        return cur;
      };
    }
    const getModelModifiers = (props, modelName) => {
      return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
    };
    function emit(instance, event, ...rawArgs) {
      if (instance.isUnmounted) return;
      const props = instance.vnode.props || EMPTY_OBJ;
      let args = rawArgs;
      const isModelListener2 = event.startsWith("update:");
      const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
      if (modifiers) {
        if (modifiers.trim) {
          args = rawArgs.map((a) => isString$1(a) ? a.trim() : a);
        }
        if (modifiers.number) {
          args = rawArgs.map(looseToNumber);
        }
      }
      let handlerName;
      let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
      props[handlerName = toHandlerKey(camelize(event))];
      if (!handler && isModelListener2) {
        handler = props[handlerName = toHandlerKey(hyphenate(event))];
      }
      if (handler) {
        callWithAsyncErrorHandling(
          handler,
          instance,
          6,
          args
        );
      }
      const onceHandler = props[handlerName + `Once`];
      if (onceHandler) {
        if (!instance.emitted) {
          instance.emitted = {};
        } else if (instance.emitted[handlerName]) {
          return;
        }
        instance.emitted[handlerName] = true;
        callWithAsyncErrorHandling(
          onceHandler,
          instance,
          6,
          args
        );
      }
    }
    function normalizeEmitsOptions(comp, appContext, asMixin = false) {
      const cache = appContext.emitsCache;
      const cached = cache.get(comp);
      if (cached !== void 0) {
        return cached;
      }
      const raw = comp.emits;
      let normalized = {};
      let hasExtends = false;
      if (!isFunction$1(comp)) {
        const extendEmits = (raw2) => {
          const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
          if (normalizedFromExtend) {
            hasExtends = true;
            extend$1(normalized, normalizedFromExtend);
          }
        };
        if (!asMixin && appContext.mixins.length) {
          appContext.mixins.forEach(extendEmits);
        }
        if (comp.extends) {
          extendEmits(comp.extends);
        }
        if (comp.mixins) {
          comp.mixins.forEach(extendEmits);
        }
      }
      if (!raw && !hasExtends) {
        if (isObject$1(comp)) {
          cache.set(comp, null);
        }
        return null;
      }
      if (isArray$1(raw)) {
        raw.forEach((key) => normalized[key] = null);
      } else {
        extend$1(normalized, raw);
      }
      if (isObject$1(comp)) {
        cache.set(comp, normalized);
      }
      return normalized;
    }
    function isEmitListener(options, key) {
      if (!options || !isOn(key)) {
        return false;
      }
      key = key.slice(2).replace(/Once$/, "");
      return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
    }
    function markAttrsAccessed() {
    }
    function renderComponentRoot(instance) {
      const {
        type: Component,
        vnode,
        proxy,
        withProxy,
        propsOptions: [propsOptions],
        slots,
        attrs,
        emit: emit2,
        render,
        renderCache,
        props,
        data,
        setupState,
        ctx,
        inheritAttrs
      } = instance;
      const prev = setCurrentRenderingInstance(instance);
      let result;
      let fallthroughAttrs;
      try {
        if (vnode.shapeFlag & 4) {
          const proxyToUse = withProxy || proxy;
          const thisProxy = false ? new Proxy(proxyToUse, {
            get(target, key, receiver) {
              warn$1(
                `Property '${String(
                  key
                )}' was accessed via 'this'. Avoid using 'this' in templates.`
              );
              return Reflect.get(target, key, receiver);
            }
          }) : proxyToUse;
          result = normalizeVNode(
            render.call(
              thisProxy,
              proxyToUse,
              renderCache,
              false ? shallowReadonly(props) : props,
              setupState,
              data,
              ctx
            )
          );
          fallthroughAttrs = attrs;
        } else {
          const render2 = Component;
          if (false) ;
          result = normalizeVNode(
            render2.length > 1 ? render2(
              false ? shallowReadonly(props) : props,
              false ? {
                get attrs() {
                  markAttrsAccessed();
                  return shallowReadonly(attrs);
                },
                slots,
                emit: emit2
              } : { attrs, slots, emit: emit2 }
            ) : render2(
              false ? shallowReadonly(props) : props,
              null
            )
          );
          fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
        }
      } catch (err) {
        blockStack.length = 0;
        handleError(err, instance, 1);
        result = createVNode(Comment);
      }
      let root = result;
      if (fallthroughAttrs && inheritAttrs !== false) {
        const keys = Object.keys(fallthroughAttrs);
        const { shapeFlag } = root;
        if (keys.length) {
          if (shapeFlag & (1 | 6)) {
            if (propsOptions && keys.some(isModelListener)) {
              fallthroughAttrs = filterModelListeners(
                fallthroughAttrs,
                propsOptions
              );
            }
            root = cloneVNode(root, fallthroughAttrs, false, true);
          }
        }
      }
      if (vnode.dirs) {
        root = cloneVNode(root, null, false, true);
        root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
      }
      if (vnode.transition) {
        setTransitionHooks(root, vnode.transition);
      }
      {
        result = root;
      }
      setCurrentRenderingInstance(prev);
      return result;
    }
    const getFunctionalFallthrough = (attrs) => {
      let res;
      for (const key in attrs) {
        if (key === "class" || key === "style" || isOn(key)) {
          (res || (res = {}))[key] = attrs[key];
        }
      }
      return res;
    };
    const filterModelListeners = (attrs, props) => {
      const res = {};
      for (const key in attrs) {
        if (!isModelListener(key) || !(key.slice(9) in props)) {
          res[key] = attrs[key];
        }
      }
      return res;
    };
    function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
      const { props: prevProps, children: prevChildren, component } = prevVNode;
      const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
      const emits = component.emitsOptions;
      if (nextVNode.dirs || nextVNode.transition) {
        return true;
      }
      if (optimized && patchFlag >= 0) {
        if (patchFlag & 1024) {
          return true;
        }
        if (patchFlag & 16) {
          if (!prevProps) {
            return !!nextProps;
          }
          return hasPropsChanged(prevProps, nextProps, emits);
        } else if (patchFlag & 8) {
          const dynamicProps = nextVNode.dynamicProps;
          for (let i = 0; i < dynamicProps.length; i++) {
            const key = dynamicProps[i];
            if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
              return true;
            }
          }
        }
      } else {
        if (prevChildren || nextChildren) {
          if (!nextChildren || !nextChildren.$stable) {
            return true;
          }
        }
        if (prevProps === nextProps) {
          return false;
        }
        if (!prevProps) {
          return !!nextProps;
        }
        if (!nextProps) {
          return true;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      }
      return false;
    }
    function hasPropsChanged(prevProps, nextProps, emitsOptions) {
      const nextKeys = Object.keys(nextProps);
      if (nextKeys.length !== Object.keys(prevProps).length) {
        return true;
      }
      for (let i = 0; i < nextKeys.length; i++) {
        const key = nextKeys[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
          return true;
        }
      }
      return false;
    }
    function updateHOCHostEl({ vnode, parent }, el) {
      while (parent) {
        const root = parent.subTree;
        if (root.suspense && root.suspense.activeBranch === vnode) {
          root.el = vnode.el;
        }
        if (root === vnode) {
          (vnode = parent.vnode).el = el;
          parent = parent.parent;
        } else {
          break;
        }
      }
    }
    const isSuspense = (type) => type.__isSuspense;
    function queueEffectWithSuspense(fn, suspense) {
      if (suspense && suspense.pendingBranch) {
        if (isArray$1(fn)) {
          suspense.effects.push(...fn);
        } else {
          suspense.effects.push(fn);
        }
      } else {
        queuePostFlushCb(fn);
      }
    }
    const Fragment = Symbol.for("v-fgt");
    const Text = Symbol.for("v-txt");
    const Comment = Symbol.for("v-cmt");
    const Static = Symbol.for("v-stc");
    const blockStack = [];
    let currentBlock = null;
    function openBlock(disableTracking = false) {
      blockStack.push(currentBlock = disableTracking ? null : []);
    }
    function closeBlock() {
      blockStack.pop();
      currentBlock = blockStack[blockStack.length - 1] || null;
    }
    let isBlockTreeEnabled = 1;
    function setBlockTracking(value, inVOnce = false) {
      isBlockTreeEnabled += value;
      if (value < 0 && currentBlock && inVOnce) {
        currentBlock.hasOnce = true;
      }
    }
    function setupBlock(vnode) {
      vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
      closeBlock();
      if (isBlockTreeEnabled > 0 && currentBlock) {
        currentBlock.push(vnode);
      }
      return vnode;
    }
    function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
      return setupBlock(
        createBaseVNode(
          type,
          props,
          children,
          patchFlag,
          dynamicProps,
          shapeFlag,
          true
        )
      );
    }
    function createBlock(type, props, children, patchFlag, dynamicProps) {
      return setupBlock(
        createVNode(
          type,
          props,
          children,
          patchFlag,
          dynamicProps,
          true
        )
      );
    }
    function isVNode(value) {
      return value ? value.__v_isVNode === true : false;
    }
    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }
    const normalizeKey = ({ key }) => key != null ? key : null;
    const normalizeRef = ({
      ref: ref3,
      ref_key,
      ref_for
    }) => {
      if (typeof ref3 === "number") {
        ref3 = "" + ref3;
      }
      return ref3 != null ? isString$1(ref3) || isRef(ref3) || isFunction$1(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
    };
    function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
      const vnode = {
        __v_isVNode: true,
        __v_skip: true,
        type,
        props,
        key: props && normalizeKey(props),
        ref: props && normalizeRef(props),
        scopeId: currentScopeId,
        slotScopeIds: null,
        children,
        component: null,
        suspense: null,
        ssContent: null,
        ssFallback: null,
        dirs: null,
        transition: null,
        el: null,
        anchor: null,
        target: null,
        targetStart: null,
        targetAnchor: null,
        staticCount: 0,
        shapeFlag,
        patchFlag,
        dynamicProps,
        dynamicChildren: null,
        appContext: null,
        ctx: currentRenderingInstance
      };
      if (needFullChildrenNormalization) {
        normalizeChildren(vnode, children);
        if (shapeFlag & 128) {
          type.normalize(vnode);
        }
      } else if (children) {
        vnode.shapeFlag |= isString$1(children) ? 8 : 16;
      }
      if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
      !isBlockNode && // has current parent block
      currentBlock && // presence of a patch flag indicates this node needs patching on updates.
      // component nodes also should always be patched, because even if the
      // component doesn't need to update, it needs to persist the instance on to
      // the next vnode so that it can be properly unmounted later.
      (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
      // vnode should not be considered dynamic due to handler caching.
      vnode.patchFlag !== 32) {
        currentBlock.push(vnode);
      }
      return vnode;
    }
    const createVNode = _createVNode;
    function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
      if (!type || type === NULL_DYNAMIC_COMPONENT) {
        type = Comment;
      }
      if (isVNode(type)) {
        const cloned = cloneVNode(
          type,
          props,
          true
          /* mergeRef: true */
        );
        if (children) {
          normalizeChildren(cloned, children);
        }
        if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
          if (cloned.shapeFlag & 6) {
            currentBlock[currentBlock.indexOf(type)] = cloned;
          } else {
            currentBlock.push(cloned);
          }
        }
        cloned.patchFlag = -2;
        return cloned;
      }
      if (isClassComponent(type)) {
        type = type.__vccOpts;
      }
      if (props) {
        props = guardReactiveProps(props);
        let { class: klass, style } = props;
        if (klass && !isString$1(klass)) {
          props.class = normalizeClass(klass);
        }
        if (isObject$1(style)) {
          if (isProxy(style) && !isArray$1(style)) {
            style = extend$1({}, style);
          }
          props.style = normalizeStyle(style);
        }
      }
      const shapeFlag = isString$1(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction$1(type) ? 2 : 0;
      return createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        isBlockNode,
        true
      );
    }
    function guardReactiveProps(props) {
      if (!props) return null;
      return isProxy(props) || isInternalObject(props) ? extend$1({}, props) : props;
    }
    function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
      const { props, ref: ref3, patchFlag, children, transition } = vnode;
      const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
      const cloned = {
        __v_isVNode: true,
        __v_skip: true,
        type: vnode.type,
        props: mergedProps,
        key: mergedProps && normalizeKey(mergedProps),
        ref: extraProps && extraProps.ref ? (
          // #2078 in the case of <component :is="vnode" ref="extra"/>
          // if the vnode itself already has a ref, cloneVNode will need to merge
          // the refs so the single vnode can be set on multiple refs
          mergeRef && ref3 ? isArray$1(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
        ) : ref3,
        scopeId: vnode.scopeId,
        slotScopeIds: vnode.slotScopeIds,
        children,
        target: vnode.target,
        targetStart: vnode.targetStart,
        targetAnchor: vnode.targetAnchor,
        staticCount: vnode.staticCount,
        shapeFlag: vnode.shapeFlag,
        // if the vnode is cloned with extra props, we can no longer assume its
        // existing patch flag to be reliable and need to add the FULL_PROPS flag.
        // note: preserve flag for fragments since they use the flag for children
        // fast paths only.
        patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
        dynamicProps: vnode.dynamicProps,
        dynamicChildren: vnode.dynamicChildren,
        appContext: vnode.appContext,
        dirs: vnode.dirs,
        transition,
        // These should technically only be non-null on mounted VNodes. However,
        // they *should* be copied for kept-alive vnodes. So we just always copy
        // them since them being non-null during a mount doesn't affect the logic as
        // they will simply be overwritten.
        component: vnode.component,
        suspense: vnode.suspense,
        ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
        ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
        el: vnode.el,
        anchor: vnode.anchor,
        ctx: vnode.ctx,
        ce: vnode.ce
      };
      if (transition && cloneTransition) {
        setTransitionHooks(
          cloned,
          transition.clone(cloned)
        );
      }
      return cloned;
    }
    function createTextVNode(text = " ", flag = 0) {
      return createVNode(Text, null, text, flag);
    }
    function createCommentVNode(text = "", asBlock = false) {
      return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
    }
    function normalizeVNode(child) {
      if (child == null || typeof child === "boolean") {
        return createVNode(Comment);
      } else if (isArray$1(child)) {
        return createVNode(
          Fragment,
          null,
          // #3666, avoid reference pollution when reusing vnode
          child.slice()
        );
      } else if (isVNode(child)) {
        return cloneIfMounted(child);
      } else {
        return createVNode(Text, null, String(child));
      }
    }
    function cloneIfMounted(child) {
      return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
    }
    function normalizeChildren(vnode, children) {
      let type = 0;
      const { shapeFlag } = vnode;
      if (children == null) {
        children = null;
      } else if (isArray$1(children)) {
        type = 16;
      } else if (typeof children === "object") {
        if (shapeFlag & (1 | 64)) {
          const slot = children.default;
          if (slot) {
            slot._c && (slot._d = false);
            normalizeChildren(vnode, slot());
            slot._c && (slot._d = true);
          }
          return;
        } else {
          type = 32;
          const slotFlag = children._;
          if (!slotFlag && !isInternalObject(children)) {
            children._ctx = currentRenderingInstance;
          } else if (slotFlag === 3 && currentRenderingInstance) {
            if (currentRenderingInstance.slots._ === 1) {
              children._ = 1;
            } else {
              children._ = 2;
              vnode.patchFlag |= 1024;
            }
          }
        }
      } else if (isFunction$1(children)) {
        children = { default: children, _ctx: currentRenderingInstance };
        type = 32;
      } else {
        children = String(children);
        if (shapeFlag & 64) {
          type = 16;
          children = [createTextVNode(children)];
        } else {
          type = 8;
        }
      }
      vnode.children = children;
      vnode.shapeFlag |= type;
    }
    function mergeProps(...args) {
      const ret = {};
      for (let i = 0; i < args.length; i++) {
        const toMerge = args[i];
        for (const key in toMerge) {
          if (key === "class") {
            if (ret.class !== toMerge.class) {
              ret.class = normalizeClass([ret.class, toMerge.class]);
            }
          } else if (key === "style") {
            ret.style = normalizeStyle([ret.style, toMerge.style]);
          } else if (isOn(key)) {
            const existing = ret[key];
            const incoming = toMerge[key];
            if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
              ret[key] = existing ? [].concat(existing, incoming) : incoming;
            }
          } else if (key !== "") {
            ret[key] = toMerge[key];
          }
        }
      }
      return ret;
    }
    function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
      callWithAsyncErrorHandling(hook, instance, 7, [
        vnode,
        prevVNode
      ]);
    }
    const emptyAppContext = createAppContext();
    let uid = 0;
    function createComponentInstance(vnode, parent, suspense) {
      const type = vnode.type;
      const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
      const instance = {
        uid: uid++,
        vnode,
        type,
        parent,
        appContext,
        root: null,
        // to be immediately set
        next: null,
        subTree: null,
        // will be set synchronously right after creation
        effect: null,
        update: null,
        // will be set synchronously right after creation
        job: null,
        scope: new EffectScope(
          true
          /* detached */
        ),
        render: null,
        proxy: null,
        exposed: null,
        exposeProxy: null,
        withProxy: null,
        provides: parent ? parent.provides : Object.create(appContext.provides),
        ids: parent ? parent.ids : ["", 0, 0],
        accessCache: null,
        renderCache: [],
        // local resolved assets
        components: null,
        directives: null,
        // resolved props and emits options
        propsOptions: normalizePropsOptions(type, appContext),
        emitsOptions: normalizeEmitsOptions(type, appContext),
        // emit
        emit: null,
        // to be set immediately
        emitted: null,
        // props default value
        propsDefaults: EMPTY_OBJ,
        // inheritAttrs
        inheritAttrs: type.inheritAttrs,
        // state
        ctx: EMPTY_OBJ,
        data: EMPTY_OBJ,
        props: EMPTY_OBJ,
        attrs: EMPTY_OBJ,
        slots: EMPTY_OBJ,
        refs: EMPTY_OBJ,
        setupState: EMPTY_OBJ,
        setupContext: null,
        // suspense related
        suspense,
        suspenseId: suspense ? suspense.pendingId : 0,
        asyncDep: null,
        asyncResolved: false,
        // lifecycle hooks
        // not using enums here because it results in computed properties
        isMounted: false,
        isUnmounted: false,
        isDeactivated: false,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        sp: null
      };
      {
        instance.ctx = { _: instance };
      }
      instance.root = parent ? parent.root : instance;
      instance.emit = emit.bind(null, instance);
      if (vnode.ce) {
        vnode.ce(instance);
      }
      return instance;
    }
    let currentInstance = null;
    let internalSetCurrentInstance;
    let setInSSRSetupState;
    {
      const g = getGlobalThis();
      const registerGlobalSetter = (key, setter) => {
        let setters;
        if (!(setters = g[key])) setters = g[key] = [];
        setters.push(setter);
        return (v) => {
          if (setters.length > 1) setters.forEach((set) => set(v));
          else setters[0](v);
        };
      };
      internalSetCurrentInstance = registerGlobalSetter(
        `__VUE_INSTANCE_SETTERS__`,
        (v) => currentInstance = v
      );
      setInSSRSetupState = registerGlobalSetter(
        `__VUE_SSR_SETTERS__`,
        (v) => isInSSRComponentSetup = v
      );
    }
    const setCurrentInstance = (instance) => {
      const prev = currentInstance;
      internalSetCurrentInstance(instance);
      instance.scope.on();
      return () => {
        instance.scope.off();
        internalSetCurrentInstance(prev);
      };
    };
    const unsetCurrentInstance = () => {
      currentInstance && currentInstance.scope.off();
      internalSetCurrentInstance(null);
    };
    function isStatefulComponent(instance) {
      return instance.vnode.shapeFlag & 4;
    }
    let isInSSRComponentSetup = false;
    function setupComponent(instance, isSSR = false, optimized = false) {
      isSSR && setInSSRSetupState(isSSR);
      const { props, children } = instance.vnode;
      const isStateful = isStatefulComponent(instance);
      initProps(instance, props, isStateful, isSSR);
      initSlots(instance, children, optimized || isSSR);
      const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
      isSSR && setInSSRSetupState(false);
      return setupResult;
    }
    function setupStatefulComponent(instance, isSSR) {
      const Component = instance.type;
      instance.accessCache = /* @__PURE__ */ Object.create(null);
      instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
      const { setup } = Component;
      if (setup) {
        pauseTracking();
        const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
        const reset = setCurrentInstance(instance);
        const setupResult = callWithErrorHandling(
          setup,
          instance,
          0,
          [
            instance.props,
            setupContext
          ]
        );
        const isAsyncSetup = isPromise(setupResult);
        resetTracking();
        reset();
        if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
          markAsyncBoundary(instance);
        }
        if (isAsyncSetup) {
          setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
          if (isSSR) {
            return setupResult.then((resolvedResult) => {
              handleSetupResult(instance, resolvedResult);
            }).catch((e) => {
              handleError(e, instance, 0);
            });
          } else {
            instance.asyncDep = setupResult;
          }
        } else {
          handleSetupResult(instance, setupResult);
        }
      } else {
        finishComponentSetup(instance);
      }
    }
    function handleSetupResult(instance, setupResult, isSSR) {
      if (isFunction$1(setupResult)) {
        if (instance.type.__ssrInlineRender) {
          instance.ssrRender = setupResult;
        } else {
          instance.render = setupResult;
        }
      } else if (isObject$1(setupResult)) {
        instance.setupState = proxyRefs(setupResult);
      } else ;
      finishComponentSetup(instance);
    }
    function finishComponentSetup(instance, isSSR, skipOptions) {
      const Component = instance.type;
      if (!instance.render) {
        instance.render = Component.render || NOOP;
      }
      {
        const reset = setCurrentInstance(instance);
        pauseTracking();
        try {
          applyOptions(instance);
        } finally {
          resetTracking();
          reset();
        }
      }
    }
    const attrsProxyHandlers = {
      get(target, key) {
        track(target, "get", "");
        return target[key];
      }
    };
    function createSetupContext(instance) {
      const expose = (exposed) => {
        instance.exposed = exposed || {};
      };
      {
        return {
          attrs: new Proxy(instance.attrs, attrsProxyHandlers),
          slots: instance.slots,
          emit: instance.emit,
          expose
        };
      }
    }
    function getComponentPublicInstance(instance) {
      if (instance.exposed) {
        return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
          get(target, key) {
            if (key in target) {
              return target[key];
            } else if (key in publicPropertiesMap) {
              return publicPropertiesMap[key](instance);
            }
          },
          has(target, key) {
            return key in target || key in publicPropertiesMap;
          }
        }));
      } else {
        return instance.proxy;
      }
    }
    const classifyRE = /(?:^|[-_])(\w)/g;
    const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
    function getComponentName(Component, includeInferred = true) {
      return isFunction$1(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
    }
    function formatComponentName(instance, Component, isRoot = false) {
      let name = getComponentName(Component);
      if (!name && Component.__file) {
        const match = Component.__file.match(/([^/\\]+)\.\w+$/);
        if (match) {
          name = match[1];
        }
      }
      if (!name && instance && instance.parent) {
        const inferFromRegistry = (registry) => {
          for (const key in registry) {
            if (registry[key] === Component) {
              return key;
            }
          }
        };
        name = inferFromRegistry(
          instance.components || instance.parent.type.components
        ) || inferFromRegistry(instance.appContext.components);
      }
      return name ? classify(name) : isRoot ? `App` : `Anonymous`;
    }
    function isClassComponent(value) {
      return isFunction$1(value) && "__vccOpts" in value;
    }
    const computed = (getterOrOptions, debugOptions) => {
      const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
      return c;
    };
    const version = "3.5.16";
    /**
    * @vue/runtime-dom v3.5.16
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    **/
    let policy = void 0;
    const tt = typeof window !== "undefined" && window.trustedTypes;
    if (tt) {
      try {
        policy = /* @__PURE__ */ tt.createPolicy("vue", {
          createHTML: (val) => val
        });
      } catch (e) {
      }
    }
    const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
    const svgNS = "http://www.w3.org/2000/svg";
    const mathmlNS = "http://www.w3.org/1998/Math/MathML";
    const doc = typeof document !== "undefined" ? document : null;
    const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
    const nodeOps = {
      insert: (child, parent, anchor) => {
        parent.insertBefore(child, anchor || null);
      },
      remove: (child) => {
        const parent = child.parentNode;
        if (parent) {
          parent.removeChild(child);
        }
      },
      createElement: (tag, namespace, is, props) => {
        const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
        if (tag === "select" && props && props.multiple != null) {
          el.setAttribute("multiple", props.multiple);
        }
        return el;
      },
      createText: (text) => doc.createTextNode(text),
      createComment: (text) => doc.createComment(text),
      setText: (node, text) => {
        node.nodeValue = text;
      },
      setElementText: (el, text) => {
        el.textContent = text;
      },
      parentNode: (node) => node.parentNode,
      nextSibling: (node) => node.nextSibling,
      querySelector: (selector) => doc.querySelector(selector),
      setScopeId(el, id) {
        el.setAttribute(id, "");
      },
      // __UNSAFE__
      // Reason: innerHTML.
      // Static content here can only come from compiled templates.
      // As long as the user only uses trusted templates, this is safe.
      insertStaticContent(content, parent, anchor, namespace, start, end) {
        const before = anchor ? anchor.previousSibling : parent.lastChild;
        if (start && (start === end || start.nextSibling)) {
          while (true) {
            parent.insertBefore(start.cloneNode(true), anchor);
            if (start === end || !(start = start.nextSibling)) break;
          }
        } else {
          templateContainer.innerHTML = unsafeToTrustedHTML(
            namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
          );
          const template = templateContainer.content;
          if (namespace === "svg" || namespace === "mathml") {
            const wrapper = template.firstChild;
            while (wrapper.firstChild) {
              template.appendChild(wrapper.firstChild);
            }
            template.removeChild(wrapper);
          }
          parent.insertBefore(template, anchor);
        }
        return [
          // first
          before ? before.nextSibling : parent.firstChild,
          // last
          anchor ? anchor.previousSibling : parent.lastChild
        ];
      }
    };
    const vtcKey = Symbol("_vtc");
    function patchClass(el, value, isSVG) {
      const transitionClasses = el[vtcKey];
      if (transitionClasses) {
        value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
      }
      if (value == null) {
        el.removeAttribute("class");
      } else if (isSVG) {
        el.setAttribute("class", value);
      } else {
        el.className = value;
      }
    }
    const vShowOriginalDisplay = Symbol("_vod");
    const vShowHidden = Symbol("_vsh");
    const CSS_VAR_TEXT = Symbol("");
    const displayRE = /(^|;)\s*display\s*:/;
    function patchStyle(el, prev, next) {
      const style = el.style;
      const isCssString = isString$1(next);
      let hasControlledDisplay = false;
      if (next && !isCssString) {
        if (prev) {
          if (!isString$1(prev)) {
            for (const key in prev) {
              if (next[key] == null) {
                setStyle(style, key, "");
              }
            }
          } else {
            for (const prevStyle of prev.split(";")) {
              const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
              if (next[key] == null) {
                setStyle(style, key, "");
              }
            }
          }
        }
        for (const key in next) {
          if (key === "display") {
            hasControlledDisplay = true;
          }
          setStyle(style, key, next[key]);
        }
      } else {
        if (isCssString) {
          if (prev !== next) {
            const cssVarText = style[CSS_VAR_TEXT];
            if (cssVarText) {
              next += ";" + cssVarText;
            }
            style.cssText = next;
            hasControlledDisplay = displayRE.test(next);
          }
        } else if (prev) {
          el.removeAttribute("style");
        }
      }
      if (vShowOriginalDisplay in el) {
        el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
        if (el[vShowHidden]) {
          style.display = "none";
        }
      }
    }
    const importantRE = /\s*!important$/;
    function setStyle(style, name, val) {
      if (isArray$1(val)) {
        val.forEach((v) => setStyle(style, name, v));
      } else {
        if (val == null) val = "";
        if (name.startsWith("--")) {
          style.setProperty(name, val);
        } else {
          const prefixed = autoPrefix(style, name);
          if (importantRE.test(val)) {
            style.setProperty(
              hyphenate(prefixed),
              val.replace(importantRE, ""),
              "important"
            );
          } else {
            style[prefixed] = val;
          }
        }
      }
    }
    const prefixes = ["Webkit", "Moz", "ms"];
    const prefixCache = {};
    function autoPrefix(style, rawName) {
      const cached = prefixCache[rawName];
      if (cached) {
        return cached;
      }
      let name = camelize(rawName);
      if (name !== "filter" && name in style) {
        return prefixCache[rawName] = name;
      }
      name = capitalize(name);
      for (let i = 0; i < prefixes.length; i++) {
        const prefixed = prefixes[i] + name;
        if (prefixed in style) {
          return prefixCache[rawName] = prefixed;
        }
      }
      return rawName;
    }
    const xlinkNS = "http://www.w3.org/1999/xlink";
    function patchAttr(el, key, value, isSVG, instance, isBoolean2 = isSpecialBooleanAttr(key)) {
      if (isSVG && key.startsWith("xlink:")) {
        if (value == null) {
          el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
        } else {
          el.setAttributeNS(xlinkNS, key, value);
        }
      } else {
        if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
          el.removeAttribute(key);
        } else {
          el.setAttribute(
            key,
            isBoolean2 ? "" : isSymbol(value) ? String(value) : value
          );
        }
      }
    }
    function patchDOMProp(el, key, value, parentComponent, attrName) {
      if (key === "innerHTML" || key === "textContent") {
        if (value != null) {
          el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
        }
        return;
      }
      const tag = el.tagName;
      if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
      !tag.includes("-")) {
        const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
        const newValue = value == null ? (
          // #11647: value should be set as empty string for null and undefined,
          // but <input type="checkbox"> should be set as 'on'.
          el.type === "checkbox" ? "on" : ""
        ) : String(value);
        if (oldValue !== newValue || !("_value" in el)) {
          el.value = newValue;
        }
        if (value == null) {
          el.removeAttribute(key);
        }
        el._value = value;
        return;
      }
      let needRemove = false;
      if (value === "" || value == null) {
        const type = typeof el[key];
        if (type === "boolean") {
          value = includeBooleanAttr(value);
        } else if (value == null && type === "string") {
          value = "";
          needRemove = true;
        } else if (type === "number") {
          value = 0;
          needRemove = true;
        }
      }
      try {
        el[key] = value;
      } catch (e) {
      }
      needRemove && el.removeAttribute(attrName || key);
    }
    function addEventListener(el, event, handler, options) {
      el.addEventListener(event, handler, options);
    }
    function removeEventListener(el, event, handler, options) {
      el.removeEventListener(event, handler, options);
    }
    const veiKey = Symbol("_vei");
    function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
      const invokers = el[veiKey] || (el[veiKey] = {});
      const existingInvoker = invokers[rawName];
      if (nextValue && existingInvoker) {
        existingInvoker.value = nextValue;
      } else {
        const [name, options] = parseName(rawName);
        if (nextValue) {
          const invoker = invokers[rawName] = createInvoker(
            nextValue,
            instance
          );
          addEventListener(el, name, invoker, options);
        } else if (existingInvoker) {
          removeEventListener(el, name, existingInvoker, options);
          invokers[rawName] = void 0;
        }
      }
    }
    const optionsModifierRE = /(?:Once|Passive|Capture)$/;
    function parseName(name) {
      let options;
      if (optionsModifierRE.test(name)) {
        options = {};
        let m;
        while (m = name.match(optionsModifierRE)) {
          name = name.slice(0, name.length - m[0].length);
          options[m[0].toLowerCase()] = true;
        }
      }
      const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
      return [event, options];
    }
    let cachedNow = 0;
    const p = /* @__PURE__ */ Promise.resolve();
    const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
    function createInvoker(initialValue, instance) {
      const invoker = (e) => {
        if (!e._vts) {
          e._vts = Date.now();
        } else if (e._vts <= invoker.attached) {
          return;
        }
        callWithAsyncErrorHandling(
          patchStopImmediatePropagation(e, invoker.value),
          instance,
          5,
          [e]
        );
      };
      invoker.value = initialValue;
      invoker.attached = getNow();
      return invoker;
    }
    function patchStopImmediatePropagation(e, value) {
      if (isArray$1(value)) {
        const originalStop = e.stopImmediatePropagation;
        e.stopImmediatePropagation = () => {
          originalStop.call(e);
          e._stopped = true;
        };
        return value.map(
          (fn) => (e2) => !e2._stopped && fn && fn(e2)
        );
      } else {
        return value;
      }
    }
    const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
    key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
    const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
      const isSVG = namespace === "svg";
      if (key === "class") {
        patchClass(el, nextValue, isSVG);
      } else if (key === "style") {
        patchStyle(el, prevValue, nextValue);
      } else if (isOn(key)) {
        if (!isModelListener(key)) {
          patchEvent(el, key, prevValue, nextValue, parentComponent);
        }
      } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
        patchDOMProp(el, key, nextValue);
        if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
          patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
        }
      } else if (
        // #11081 force set props for possible async custom element
        el._isVueCE && (/[A-Z]/.test(key) || !isString$1(nextValue))
      ) {
        patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
      } else {
        if (key === "true-value") {
          el._trueValue = nextValue;
        } else if (key === "false-value") {
          el._falseValue = nextValue;
        }
        patchAttr(el, key, nextValue, isSVG);
      }
    };
    function shouldSetAsProp(el, key, value, isSVG) {
      if (isSVG) {
        if (key === "innerHTML" || key === "textContent") {
          return true;
        }
        if (key in el && isNativeOn(key) && isFunction$1(value)) {
          return true;
        }
        return false;
      }
      if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
        return false;
      }
      if (key === "form") {
        return false;
      }
      if (key === "list" && el.tagName === "INPUT") {
        return false;
      }
      if (key === "type" && el.tagName === "TEXTAREA") {
        return false;
      }
      if (key === "width" || key === "height") {
        const tag = el.tagName;
        if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
          return false;
        }
      }
      if (isNativeOn(key) && isString$1(value)) {
        return false;
      }
      return key in el;
    }
    const getModelAssigner = (vnode) => {
      const fn = vnode.props["onUpdate:modelValue"] || false;
      return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
    };
    function onCompositionStart(e) {
      e.target.composing = true;
    }
    function onCompositionEnd(e) {
      const target = e.target;
      if (target.composing) {
        target.composing = false;
        target.dispatchEvent(new Event("input"));
      }
    }
    const assignKey = Symbol("_assign");
    const vModelText = {
      created(el, { modifiers: { lazy, trim: trim2, number } }, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        const castToNumber = number || vnode.props && vnode.props.type === "number";
        addEventListener(el, lazy ? "change" : "input", (e) => {
          if (e.target.composing) return;
          let domValue = el.value;
          if (trim2) {
            domValue = domValue.trim();
          }
          if (castToNumber) {
            domValue = looseToNumber(domValue);
          }
          el[assignKey](domValue);
        });
        if (trim2) {
          addEventListener(el, "change", () => {
            el.value = el.value.trim();
          });
        }
        if (!lazy) {
          addEventListener(el, "compositionstart", onCompositionStart);
          addEventListener(el, "compositionend", onCompositionEnd);
          addEventListener(el, "change", onCompositionEnd);
        }
      },
      // set value on mounted so it's after min/max for type="range"
      mounted(el, { value }) {
        el.value = value == null ? "" : value;
      },
      beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim: trim2, number } }, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        if (el.composing) return;
        const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
        const newValue = value == null ? "" : value;
        if (elValue === newValue) {
          return;
        }
        if (document.activeElement === el && el.type !== "range") {
          if (lazy && value === oldValue) {
            return;
          }
          if (trim2 && el.value.trim() === newValue) {
            return;
          }
        }
        el.value = newValue;
      }
    };
    const keyNames = {
      esc: "escape",
      space: " ",
      up: "arrow-up",
      left: "arrow-left",
      right: "arrow-right",
      down: "arrow-down",
      delete: "backspace"
    };
    const withKeys = (fn, modifiers) => {
      const cache = fn._withKeys || (fn._withKeys = {});
      const cacheKey = modifiers.join(".");
      return cache[cacheKey] || (cache[cacheKey] = (event) => {
        if (!("key" in event)) {
          return;
        }
        const eventKey = hyphenate(event.key);
        if (modifiers.some(
          (k) => k === eventKey || keyNames[k] === eventKey
        )) {
          return fn(event);
        }
      });
    };
    const rendererOptions = /* @__PURE__ */ extend$1({ patchProp }, nodeOps);
    let renderer;
    function ensureRenderer() {
      return renderer || (renderer = createRenderer(rendererOptions));
    }
    const createApp = (...args) => {
      const app = ensureRenderer().createApp(...args);
      const { mount } = app;
      app.mount = (containerOrSelector) => {
        const container = normalizeContainer(containerOrSelector);
        if (!container) return;
        const component = app._component;
        if (!isFunction$1(component) && !component.render && !component.template) {
          component.template = container.innerHTML;
        }
        if (container.nodeType === 1) {
          container.textContent = "";
        }
        const proxy = mount(container, false, resolveRootNamespace(container));
        if (container instanceof Element) {
          container.removeAttribute("v-cloak");
          container.setAttribute("data-v-app", "");
        }
        return proxy;
      };
      return app;
    };
    function resolveRootNamespace(container) {
      if (container instanceof SVGElement) {
        return "svg";
      }
      if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
        return "mathml";
      }
    }
    function normalizeContainer(container) {
      if (isString$1(container)) {
        const res = document.querySelector(container);
        return res;
      }
      return container;
    }
    function bind(fn, thisArg) {
      return function wrap() {
        return fn.apply(thisArg, arguments);
      };
    }
    const { toString } = Object.prototype;
    const { getPrototypeOf } = Object;
    const { iterator, toStringTag } = Symbol;
    const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
      const str = toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(/* @__PURE__ */ Object.create(null));
    const kindOfTest = (type) => {
      type = type.toLowerCase();
      return (thing) => kindOf(thing) === type;
    };
    const typeOfTest = (type) => (thing) => typeof thing === type;
    const { isArray } = Array;
    const isUndefined = typeOfTest("undefined");
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
    }
    const isArrayBuffer = kindOfTest("ArrayBuffer");
    function isArrayBufferView(val) {
      let result;
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && isArrayBuffer(val.buffer);
      }
      return result;
    }
    const isString = typeOfTest("string");
    const isFunction = typeOfTest("function");
    const isNumber = typeOfTest("number");
    const isObject = (thing) => thing !== null && typeof thing === "object";
    const isBoolean = (thing) => thing === true || thing === false;
    const isPlainObject = (val) => {
      if (kindOf(val) !== "object") {
        return false;
      }
      const prototype2 = getPrototypeOf(val);
      return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
    };
    const isDate = kindOfTest("Date");
    const isFile = kindOfTest("File");
    const isBlob = kindOfTest("Blob");
    const isFileList = kindOfTest("FileList");
    const isStream = (val) => isObject(val) && isFunction(val.pipe);
    const isFormData = (thing) => {
      let kind;
      return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
      kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
    };
    const isURLSearchParams = kindOfTest("URLSearchParams");
    const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
    const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    function forEach(obj, fn, { allOwnKeys = false } = {}) {
      if (obj === null || typeof obj === "undefined") {
        return;
      }
      let i;
      let l;
      if (typeof obj !== "object") {
        obj = [obj];
      }
      if (isArray(obj)) {
        for (i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        const len = keys.length;
        let key;
        for (i = 0; i < len; i++) {
          key = keys[i];
          fn.call(null, obj[key], key, obj);
        }
      }
    }
    function findKey(obj, key) {
      key = key.toLowerCase();
      const keys = Object.keys(obj);
      let i = keys.length;
      let _key;
      while (i-- > 0) {
        _key = keys[i];
        if (key === _key.toLowerCase()) {
          return _key;
        }
      }
      return null;
    }
    const _global = (() => {
      if (typeof globalThis !== "undefined") return globalThis;
      return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
    })();
    const isContextDefined = (context) => !isUndefined(context) && context !== _global;
    function merge() {
      const { caseless } = isContextDefined(this) && this || {};
      const result = {};
      const assignValue = (val, key) => {
        const targetKey = caseless && findKey(result, key) || key;
        if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
          result[targetKey] = merge(result[targetKey], val);
        } else if (isPlainObject(val)) {
          result[targetKey] = merge({}, val);
        } else if (isArray(val)) {
          result[targetKey] = val.slice();
        } else {
          result[targetKey] = val;
        }
      };
      for (let i = 0, l = arguments.length; i < l; i++) {
        arguments[i] && forEach(arguments[i], assignValue);
      }
      return result;
    }
    const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
      forEach(b, (val, key) => {
        if (thisArg && isFunction(val)) {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      }, { allOwnKeys });
      return a;
    };
    const stripBOM = (content) => {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    };
    const inherits = (constructor, superConstructor, props, descriptors2) => {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
      constructor.prototype.constructor = constructor;
      Object.defineProperty(constructor, "super", {
        value: superConstructor.prototype
      });
      props && Object.assign(constructor.prototype, props);
    };
    const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
      let props;
      let i;
      let prop;
      const merged = {};
      destObj = destObj || {};
      if (sourceObj == null) return destObj;
      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = filter !== false && getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
      return destObj;
    };
    const endsWith = (str, searchString, position) => {
      str = String(str);
      if (position === void 0 || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      const lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
    const toArray = (thing) => {
      if (!thing) return null;
      if (isArray(thing)) return thing;
      let i = thing.length;
      if (!isNumber(i)) return null;
      const arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    };
    const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
      return (thing) => {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
    const forEachEntry = (obj, fn) => {
      const generator = obj && obj[iterator];
      const _iterator = generator.call(obj);
      let result;
      while ((result = _iterator.next()) && !result.done) {
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
      }
    };
    const matchAll = (regExp, str) => {
      let matches;
      const arr = [];
      while ((matches = regExp.exec(str)) !== null) {
        arr.push(matches);
      }
      return arr;
    };
    const isHTMLForm = kindOfTest("HTMLFormElement");
    const toCamelCase = (str) => {
      return str.toLowerCase().replace(
        /[-_\s]([a-z\d])(\w*)/g,
        function replacer2(m, p1, p2) {
          return p1.toUpperCase() + p2;
        }
      );
    };
    const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
    const isRegExp = kindOfTest("RegExp");
    const reduceDescriptors = (obj, reducer) => {
      const descriptors2 = Object.getOwnPropertyDescriptors(obj);
      const reducedDescriptors = {};
      forEach(descriptors2, (descriptor, name) => {
        let ret;
        if ((ret = reducer(descriptor, name, obj)) !== false) {
          reducedDescriptors[name] = ret || descriptor;
        }
      });
      Object.defineProperties(obj, reducedDescriptors);
    };
    const freezeMethods = (obj) => {
      reduceDescriptors(obj, (descriptor, name) => {
        if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
          return false;
        }
        const value = obj[name];
        if (!isFunction(value)) return;
        descriptor.enumerable = false;
        if ("writable" in descriptor) {
          descriptor.writable = false;
          return;
        }
        if (!descriptor.set) {
          descriptor.set = () => {
            throw Error("Can not rewrite read-only method '" + name + "'");
          };
        }
      });
    };
    const toObjectSet = (arrayOrString, delimiter) => {
      const obj = {};
      const define = (arr) => {
        arr.forEach((value) => {
          obj[value] = true;
        });
      };
      isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
      return obj;
    };
    const noop = () => {
    };
    const toFiniteNumber = (value, defaultValue) => {
      return value != null && Number.isFinite(value = +value) ? value : defaultValue;
    };
    function isSpecCompliantForm(thing) {
      return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
    }
    const toJSONObject = (obj) => {
      const stack2 = new Array(10);
      const visit = (source, i) => {
        if (isObject(source)) {
          if (stack2.indexOf(source) >= 0) {
            return;
          }
          if (!("toJSON" in source)) {
            stack2[i] = source;
            const target = isArray(source) ? [] : {};
            forEach(source, (value, key) => {
              const reducedValue = visit(value, i + 1);
              !isUndefined(reducedValue) && (target[key] = reducedValue);
            });
            stack2[i] = void 0;
            return target;
          }
        }
        return source;
      };
      return visit(obj, 0);
    };
    const isAsyncFn = kindOfTest("AsyncFunction");
    const isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
    const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
      if (setImmediateSupported) {
        return setImmediate;
      }
      return postMessageSupported ? ((token, callbacks) => {
        _global.addEventListener("message", ({ source, data }) => {
          if (source === _global && data === token) {
            callbacks.length && callbacks.shift()();
          }
        }, false);
        return (cb) => {
          callbacks.push(cb);
          _global.postMessage(token, "*");
        };
      })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
    })(
      typeof setImmediate === "function",
      isFunction(_global.postMessage)
    );
    const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
    const isIterable = (thing) => thing != null && isFunction(thing[iterator]);
    const utils$1 = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isBoolean,
      isObject,
      isPlainObject,
      isReadableStream,
      isRequest,
      isResponse,
      isHeaders,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isRegExp,
      isFunction,
      isStream,
      isURLSearchParams,
      isTypedArray,
      isFileList,
      forEach,
      merge,
      extend,
      trim,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf,
      kindOfTest,
      endsWith,
      toArray,
      forEachEntry,
      matchAll,
      isHTMLForm,
      hasOwnProperty,
      hasOwnProp: hasOwnProperty,
      // an alias to avoid ESLint no-prototype-builtins detection
      reduceDescriptors,
      freezeMethods,
      toObjectSet,
      toCamelCase,
      noop,
      toFiniteNumber,
      findKey,
      global: _global,
      isContextDefined,
      isSpecCompliantForm,
      toJSONObject,
      isAsyncFn,
      isThenable,
      setImmediate: _setImmediate,
      asap,
      isIterable
    };
    function AxiosError$1(message, code, config, request, response) {
      Error.call(this);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error().stack;
      }
      this.message = message;
      this.name = "AxiosError";
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      if (response) {
        this.response = response;
        this.status = response.status ? response.status : null;
      }
    }
    utils$1.inherits(AxiosError$1, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: utils$1.toJSONObject(this.config),
          code: this.code,
          status: this.status
        };
      }
    });
    const prototype$1 = AxiosError$1.prototype;
    const descriptors = {};
    [
      "ERR_BAD_OPTION_VALUE",
      "ERR_BAD_OPTION",
      "ECONNABORTED",
      "ETIMEDOUT",
      "ERR_NETWORK",
      "ERR_FR_TOO_MANY_REDIRECTS",
      "ERR_DEPRECATED",
      "ERR_BAD_RESPONSE",
      "ERR_BAD_REQUEST",
      "ERR_CANCELED",
      "ERR_NOT_SUPPORT",
      "ERR_INVALID_URL"
      // eslint-disable-next-line func-names
    ].forEach((code) => {
      descriptors[code] = { value: code };
    });
    Object.defineProperties(AxiosError$1, descriptors);
    Object.defineProperty(prototype$1, "isAxiosError", { value: true });
    AxiosError$1.from = (error, code, config, request, response, customProps) => {
      const axiosError = Object.create(prototype$1);
      utils$1.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      }, (prop) => {
        return prop !== "isAxiosError";
      });
      AxiosError$1.call(axiosError, error.message, code, config, request, response);
      axiosError.cause = error;
      axiosError.name = error.name;
      customProps && Object.assign(axiosError, customProps);
      return axiosError;
    };
    const httpAdapter = null;
    function isVisitable(thing) {
      return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
    }
    function removeBrackets(key) {
      return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
    }
    function renderKey(path, key, dots) {
      if (!path) return key;
      return path.concat(key).map(function each(token, i) {
        token = removeBrackets(token);
        return !dots && i ? "[" + token + "]" : token;
      }).join(dots ? "." : "");
    }
    function isFlatArray(arr) {
      return utils$1.isArray(arr) && !arr.some(isVisitable);
    }
    const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
      return /^is[A-Z]/.test(prop);
    });
    function toFormData$1(obj, formData, options) {
      if (!utils$1.isObject(obj)) {
        throw new TypeError("target must be an object");
      }
      formData = formData || new FormData();
      options = utils$1.toFlatObject(options, {
        metaTokens: true,
        dots: false,
        indexes: false
      }, false, function defined(option, source) {
        return !utils$1.isUndefined(source[option]);
      });
      const metaTokens = options.metaTokens;
      const visitor = options.visitor || defaultVisitor;
      const dots = options.dots;
      const indexes = options.indexes;
      const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
      const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
      if (!utils$1.isFunction(visitor)) {
        throw new TypeError("visitor must be a function");
      }
      function convertValue(value) {
        if (value === null) return "";
        if (utils$1.isDate(value)) {
          return value.toISOString();
        }
        if (!useBlob && utils$1.isBlob(value)) {
          throw new AxiosError$1("Blob is not supported. Use a Buffer instead.");
        }
        if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
          return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
        }
        return value;
      }
      function defaultVisitor(value, key, path) {
        let arr = value;
        if (value && !path && typeof value === "object") {
          if (utils$1.endsWith(key, "{}")) {
            key = metaTokens ? key : key.slice(0, -2);
            value = JSON.stringify(value);
          } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
            key = removeBrackets(key);
            arr.forEach(function each(el, index) {
              !(utils$1.isUndefined(el) || el === null) && formData.append(
                // eslint-disable-next-line no-nested-ternary
                indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
                convertValue(el)
              );
            });
            return false;
          }
        }
        if (isVisitable(value)) {
          return true;
        }
        formData.append(renderKey(path, key, dots), convertValue(value));
        return false;
      }
      const stack2 = [];
      const exposedHelpers = Object.assign(predicates, {
        defaultVisitor,
        convertValue,
        isVisitable
      });
      function build(value, path) {
        if (utils$1.isUndefined(value)) return;
        if (stack2.indexOf(value) !== -1) {
          throw Error("Circular reference detected in " + path.join("."));
        }
        stack2.push(value);
        utils$1.forEach(value, function each(el, key) {
          const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
            formData,
            el,
            utils$1.isString(key) ? key.trim() : key,
            path,
            exposedHelpers
          );
          if (result === true) {
            build(el, path ? path.concat(key) : [key]);
          }
        });
        stack2.pop();
      }
      if (!utils$1.isObject(obj)) {
        throw new TypeError("data must be an object");
      }
      build(obj);
      return formData;
    }
    function encode$1(str) {
      const charMap = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E",
        "%20": "+",
        "%00": "\0"
      };
      return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer2(match) {
        return charMap[match];
      });
    }
    function AxiosURLSearchParams(params, options) {
      this._pairs = [];
      params && toFormData$1(params, this, options);
    }
    const prototype = AxiosURLSearchParams.prototype;
    prototype.append = function append(name, value) {
      this._pairs.push([name, value]);
    };
    prototype.toString = function toString2(encoder) {
      const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode$1);
      } : encode$1;
      return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + "=" + _encode(pair[1]);
      }, "").join("&");
    };
    function encode(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    function buildURL(url, params, options) {
      if (!params) {
        return url;
      }
      const _encode = options && options.encode || encode;
      if (utils$1.isFunction(options)) {
        options = {
          serialize: options
        };
      }
      const serializeFn = options && options.serialize;
      let serializedParams;
      if (serializeFn) {
        serializedParams = serializeFn(params, options);
      } else {
        serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
      }
      if (serializedParams) {
        const hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
      }
      return url;
    }
    class InterceptorManager {
      constructor() {
        this.handlers = [];
      }
      /**
       * Add a new interceptor to the stack
       *
       * @param {Function} fulfilled The function to handle `then` for a `Promise`
       * @param {Function} rejected The function to handle `reject` for a `Promise`
       *
       * @return {Number} An ID used to remove interceptor later
       */
      use(fulfilled, rejected, options) {
        this.handlers.push({
          fulfilled,
          rejected,
          synchronous: options ? options.synchronous : false,
          runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
      }
      /**
       * Remove an interceptor from the stack
       *
       * @param {Number} id The ID that was returned by `use`
       *
       * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
       */
      eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      }
      /**
       * Clear all interceptors from the stack
       *
       * @returns {void}
       */
      clear() {
        if (this.handlers) {
          this.handlers = [];
        }
      }
      /**
       * Iterate over all the registered interceptors
       *
       * This method is particularly useful for skipping over any
       * interceptors that may have become `null` calling `eject`.
       *
       * @param {Function} fn The function to call for each interceptor
       *
       * @returns {void}
       */
      forEach(fn) {
        utils$1.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      }
    }
    const transitionalDefaults = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };
    const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
    const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
    const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
    const platform$1 = {
      isBrowser: true,
      classes: {
        URLSearchParams: URLSearchParams$1,
        FormData: FormData$1,
        Blob: Blob$1
      },
      protocols: ["http", "https", "file", "blob", "url", "data"]
    };
    const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
    const _navigator = typeof navigator === "object" && navigator || void 0;
    const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
    const hasStandardBrowserWebWorkerEnv = (() => {
      return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
      self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
    })();
    const origin = hasBrowserEnv && window.location.href || "http://localhost";
    const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      hasBrowserEnv,
      hasStandardBrowserEnv,
      hasStandardBrowserWebWorkerEnv,
      navigator: _navigator,
      origin
    }, Symbol.toStringTag, { value: "Module" }));
    const platform = __spreadValues(__spreadValues({}, utils), platform$1);
    function toURLEncodedForm(data, options) {
      return toFormData$1(data, new platform.classes.URLSearchParams(), Object.assign({
        visitor: function(value, key, path, helpers) {
          if (platform.isNode && utils$1.isBuffer(value)) {
            this.append(key, value.toString("base64"));
            return false;
          }
          return helpers.defaultVisitor.apply(this, arguments);
        }
      }, options));
    }
    function parsePropPath(name) {
      return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
        return match[0] === "[]" ? "" : match[1] || match[0];
      });
    }
    function arrayToObject(arr) {
      const obj = {};
      const keys = Object.keys(arr);
      let i;
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        obj[key] = arr[key];
      }
      return obj;
    }
    function formDataToJSON(formData) {
      function buildPath(path, value, target, index) {
        let name = path[index++];
        if (name === "__proto__") return true;
        const isNumericKey = Number.isFinite(+name);
        const isLast = index >= path.length;
        name = !name && utils$1.isArray(target) ? target.length : name;
        if (isLast) {
          if (utils$1.hasOwnProp(target, name)) {
            target[name] = [target[name], value];
          } else {
            target[name] = value;
          }
          return !isNumericKey;
        }
        if (!target[name] || !utils$1.isObject(target[name])) {
          target[name] = [];
        }
        const result = buildPath(path, value, target[name], index);
        if (result && utils$1.isArray(target[name])) {
          target[name] = arrayToObject(target[name]);
        }
        return !isNumericKey;
      }
      if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
        const obj = {};
        utils$1.forEachEntry(formData, (name, value) => {
          buildPath(parsePropPath(name), value, obj, 0);
        });
        return obj;
      }
      return null;
    }
    function stringifySafely(rawValue, parser, encoder) {
      if (utils$1.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils$1.trim(rawValue);
        } catch (e) {
          if (e.name !== "SyntaxError") {
            throw e;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
    }
    const defaults = {
      transitional: transitionalDefaults,
      adapter: ["xhr", "http", "fetch"],
      transformRequest: [function transformRequest(data, headers) {
        const contentType = headers.getContentType() || "";
        const hasJSONContentType = contentType.indexOf("application/json") > -1;
        const isObjectPayload = utils$1.isObject(data);
        if (isObjectPayload && utils$1.isHTMLForm(data)) {
          data = new FormData(data);
        }
        const isFormData2 = utils$1.isFormData(data);
        if (isFormData2) {
          return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
        }
        if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
          return data;
        }
        if (utils$1.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils$1.isURLSearchParams(data)) {
          headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
          return data.toString();
        }
        let isFileList2;
        if (isObjectPayload) {
          if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
            return toURLEncodedForm(data, this.formSerializer).toString();
          }
          if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
            const _FormData = this.env && this.env.FormData;
            return toFormData$1(
              isFileList2 ? { "files[]": data } : data,
              _FormData && new _FormData(),
              this.formSerializer
            );
          }
        }
        if (isObjectPayload || hasJSONContentType) {
          headers.setContentType("application/json", false);
          return stringifySafely(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse(data) {
        const transitional = this.transitional || defaults.transitional;
        const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        const JSONRequested = this.responseType === "json";
        if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
          return data;
        }
        if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
          const silentJSONParsing = transitional && transitional.silentJSONParsing;
          const strictJSONParsing = !silentJSONParsing && JSONRequested;
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }
        return data;
      }],
      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      env: {
        FormData: platform.classes.FormData,
        Blob: platform.classes.Blob
      },
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": void 0
        }
      }
    };
    utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
      defaults.headers[method] = {};
    });
    const ignoreDuplicateOf = utils$1.toObjectSet([
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after"
    ]);
    const parseHeaders = (rawHeaders) => {
      const parsed = {};
      let key;
      let val;
      let i;
      rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
        i = line.indexOf(":");
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();
        if (!key || parsed[key] && ignoreDuplicateOf[key]) {
          return;
        }
        if (key === "set-cookie") {
          if (parsed[key]) {
            parsed[key].push(val);
          } else {
            parsed[key] = [val];
          }
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      });
      return parsed;
    };
    const $internals = Symbol("internals");
    function normalizeHeader(header) {
      return header && String(header).trim().toLowerCase();
    }
    function normalizeValue(value) {
      if (value === false || value == null) {
        return value;
      }
      return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
    }
    function parseTokens(str) {
      const tokens = /* @__PURE__ */ Object.create(null);
      const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
      let match;
      while (match = tokensRE.exec(str)) {
        tokens[match[1]] = match[2];
      }
      return tokens;
    }
    const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
    function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
      if (utils$1.isFunction(filter)) {
        return filter.call(this, value, header);
      }
      if (isHeaderNameFilter) {
        value = header;
      }
      if (!utils$1.isString(value)) return;
      if (utils$1.isString(filter)) {
        return value.indexOf(filter) !== -1;
      }
      if (utils$1.isRegExp(filter)) {
        return filter.test(value);
      }
    }
    function formatHeader(header) {
      return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
        return char.toUpperCase() + str;
      });
    }
    function buildAccessors(obj, header) {
      const accessorName = utils$1.toCamelCase(" " + header);
      ["get", "set", "has"].forEach((methodName) => {
        Object.defineProperty(obj, methodName + accessorName, {
          value: function(arg1, arg2, arg3) {
            return this[methodName].call(this, header, arg1, arg2, arg3);
          },
          configurable: true
        });
      });
    }
    let AxiosHeaders$1 = class AxiosHeaders {
      constructor(headers) {
        headers && this.set(headers);
      }
      set(header, valueOrRewrite, rewrite) {
        const self2 = this;
        function setHeader(_value, _header, _rewrite) {
          const lHeader = normalizeHeader(_header);
          if (!lHeader) {
            throw new Error("header name must be a non-empty string");
          }
          const key = utils$1.findKey(self2, lHeader);
          if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
            self2[key || _header] = normalizeValue(_value);
          }
        }
        const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
        if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
          setHeaders(header, valueOrRewrite);
        } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
          setHeaders(parseHeaders(header), valueOrRewrite);
        } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
          let obj = {}, dest, key;
          for (const entry of header) {
            if (!utils$1.isArray(entry)) {
              throw TypeError("Object iterator must return a key-value pair");
            }
            obj[key = entry[0]] = (dest = obj[key]) ? utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
          }
          setHeaders(obj, valueOrRewrite);
        } else {
          header != null && setHeader(valueOrRewrite, header, rewrite);
        }
        return this;
      }
      get(header, parser) {
        header = normalizeHeader(header);
        if (header) {
          const key = utils$1.findKey(this, header);
          if (key) {
            const value = this[key];
            if (!parser) {
              return value;
            }
            if (parser === true) {
              return parseTokens(value);
            }
            if (utils$1.isFunction(parser)) {
              return parser.call(this, value, key);
            }
            if (utils$1.isRegExp(parser)) {
              return parser.exec(value);
            }
            throw new TypeError("parser must be boolean|regexp|function");
          }
        }
      }
      has(header, matcher) {
        header = normalizeHeader(header);
        if (header) {
          const key = utils$1.findKey(this, header);
          return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }
        return false;
      }
      delete(header, matcher) {
        const self2 = this;
        let deleted = false;
        function deleteHeader(_header) {
          _header = normalizeHeader(_header);
          if (_header) {
            const key = utils$1.findKey(self2, _header);
            if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
              delete self2[key];
              deleted = true;
            }
          }
        }
        if (utils$1.isArray(header)) {
          header.forEach(deleteHeader);
        } else {
          deleteHeader(header);
        }
        return deleted;
      }
      clear(matcher) {
        const keys = Object.keys(this);
        let i = keys.length;
        let deleted = false;
        while (i--) {
          const key = keys[i];
          if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
            delete this[key];
            deleted = true;
          }
        }
        return deleted;
      }
      normalize(format) {
        const self2 = this;
        const headers = {};
        utils$1.forEach(this, (value, header) => {
          const key = utils$1.findKey(headers, header);
          if (key) {
            self2[key] = normalizeValue(value);
            delete self2[header];
            return;
          }
          const normalized = format ? formatHeader(header) : String(header).trim();
          if (normalized !== header) {
            delete self2[header];
          }
          self2[normalized] = normalizeValue(value);
          headers[normalized] = true;
        });
        return this;
      }
      concat(...targets) {
        return this.constructor.concat(this, ...targets);
      }
      toJSON(asStrings) {
        const obj = /* @__PURE__ */ Object.create(null);
        utils$1.forEach(this, (value, header) => {
          value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
        });
        return obj;
      }
      [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
      }
      toString() {
        return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
      }
      getSetCookie() {
        return this.get("set-cookie") || [];
      }
      get [Symbol.toStringTag]() {
        return "AxiosHeaders";
      }
      static from(thing) {
        return thing instanceof this ? thing : new this(thing);
      }
      static concat(first, ...targets) {
        const computed2 = new this(first);
        targets.forEach((target) => computed2.set(target));
        return computed2;
      }
      static accessor(header) {
        const internals = this[$internals] = this[$internals] = {
          accessors: {}
        };
        const accessors = internals.accessors;
        const prototype2 = this.prototype;
        function defineAccessor(_header) {
          const lHeader = normalizeHeader(_header);
          if (!accessors[lHeader]) {
            buildAccessors(prototype2, _header);
            accessors[lHeader] = true;  
          }
        }
        utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
        return this;
      }
    };
    AxiosHeaders$1.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "Authorization"]);
    utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
      let mapped = key[0].toUpperCase() + key.slice(1);
      return {
        get: () => value,
        set(headerValue) {
          this[mapped] = headerValue;
        }
      };
    });
    utils$1.freezeMethods(AxiosHeaders$1);
    function transformData(fns, response) {
      const config = this || defaults;
      const context = response || config;
      const headers = AxiosHeaders$1.from(context.headers);
      let data = context.data;
      utils$1.forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
      });
      headers.normalize();
      return data;
    }
    function isCancel$1(value) {
      return !!(value && value.__CANCEL__);
    }
    function CanceledError$1(message, config, request) {
      AxiosError$1.call(this, message == null ? "canceled" : message, AxiosError$1.ERR_CANCELED, config, request);
      this.name = "CanceledError";
    }
    utils$1.inherits(CanceledError$1, AxiosError$1, {
      __CANCEL__: true
    });
    function settle(resolve, reject, response) {
      const validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError$1(
          "Request failed with status code " + response.status,
          [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    }
    function parseProtocol(url) {
      const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || "";
    }
    function speedometer(samplesCount, min) {
      samplesCount = samplesCount || 10;
      const bytes = new Array(samplesCount);
      const timestamps = new Array(samplesCount);
      let head = 0;
      let tail = 0;
      let firstSampleTS;
      min = min !== void 0 ? min : 1e3;
      return function push(chunkLength) {
        const now = Date.now();
        const startedAt = timestamps[tail];
        if (!firstSampleTS) {
          firstSampleTS = now;
        }
        bytes[head] = chunkLength;
        timestamps[head] = now;
        let i = tail;
        let bytesCount = 0;
        while (i !== head) {
          bytesCount += bytes[i++];
          i = i % samplesCount;
        }
        head = (head + 1) % samplesCount;
        if (head === tail) {
          tail = (tail + 1) % samplesCount;
        }
        if (now - firstSampleTS < min) {
          return;
        }
        const passed = startedAt && now - startedAt;
        return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
      };
    }
    function throttle(fn, freq) {
      let timestamp = 0;
      let threshold = 1e3 / freq;
      let lastArgs;
      let timer;
      const invoke = (args, now = Date.now()) => {
        timestamp = now;
        lastArgs = null;
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        fn.apply(null, args);
      };
      const throttled = (...args) => {
        const now = Date.now();
        const passed = now - timestamp;
        if (passed >= threshold) {
          invoke(args, now);
        } else {
          lastArgs = args;
          if (!timer) {
            timer = setTimeout(() => {
              timer = null;
              invoke(lastArgs);
            }, threshold - passed);
          }
        }
      };
      const flush = () => lastArgs && invoke(lastArgs);
      return [throttled, flush];
    }
    const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
      let bytesNotified = 0;
      const _speedometer = speedometer(50, 250);
      return throttle((e) => {
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : void 0;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;
        bytesNotified = loaded;
        const data = {
          loaded,
          total,
          progress: total ? loaded / total : void 0,
          bytes: progressBytes,
          rate: rate ? rate : void 0,
          estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
          event: e,
          lengthComputable: total != null,
          [isDownloadStream ? "download" : "upload"]: true
        };
        listener(data);
      }, freq);
    };
    const progressEventDecorator = (total, throttled) => {
      const lengthComputable = total != null;
      return [(loaded) => throttled[0]({
        lengthComputable,
        total,
        loaded
      }), throttled[1]];
    };
    const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
    const isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
      url = new URL(url, platform.origin);
      return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
    })(
      new URL(platform.origin),
      platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
    ) : () => true;
    const cookies = platform.hasStandardBrowserEnv ? (
      // Standard browser envs support document.cookie
      {
        write(name, value, expires, path, domain, secure) {
          const cookie = [name + "=" + encodeURIComponent(value)];
          utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
          utils$1.isString(path) && cookie.push("path=" + path);
          utils$1.isString(domain) && cookie.push("domain=" + domain);
          secure === true && cookie.push("secure");
          document.cookie = cookie.join("; ");
        },
        read(name) {
          const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      }
    ) : (
      // Non-standard browser env (web workers, react-native) lack needed support.
      {
        write() {
        },
        read() {
          return null;
        },
        remove() {
        }
      }
    );
    function isAbsoluteURL(url) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    }
    function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    }
    function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
      let isRelativeUrl = !isAbsoluteURL(requestedURL);
      if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    }
    const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? __spreadValues({}, thing) : thing;
    function mergeConfig$1(config1, config2) {
      config2 = config2 || {};
      const config = {};
      function getMergedValue(target, source, prop, caseless) {
        if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
          return utils$1.merge.call({ caseless }, target, source);
        } else if (utils$1.isPlainObject(source)) {
          return utils$1.merge({}, source);
        } else if (utils$1.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(a, b, prop, caseless) {
        if (!utils$1.isUndefined(b)) {
          return getMergedValue(a, b, prop, caseless);
        } else if (!utils$1.isUndefined(a)) {
          return getMergedValue(void 0, a, prop, caseless);
        }
      }
      function valueFromConfig2(a, b) {
        if (!utils$1.isUndefined(b)) {
          return getMergedValue(void 0, b);
        }
      }
      function defaultToConfig2(a, b) {
        if (!utils$1.isUndefined(b)) {
          return getMergedValue(void 0, b);
        } else if (!utils$1.isUndefined(a)) {
          return getMergedValue(void 0, a);
        }
      }
      function mergeDirectKeys(a, b, prop) {
        if (prop in config2) {
          return getMergedValue(a, b);
        } else if (prop in config1) {
          return getMergedValue(void 0, a);
        }
      }
      const mergeMap = {
        url: valueFromConfig2,
        method: valueFromConfig2,
        data: valueFromConfig2,
        baseURL: defaultToConfig2,
        transformRequest: defaultToConfig2,
        transformResponse: defaultToConfig2,
        paramsSerializer: defaultToConfig2,
        timeout: defaultToConfig2,
        timeoutMessage: defaultToConfig2,
        withCredentials: defaultToConfig2,
        withXSRFToken: defaultToConfig2,
        adapter: defaultToConfig2,
        responseType: defaultToConfig2,
        xsrfCookieName: defaultToConfig2,
        xsrfHeaderName: defaultToConfig2,
        onUploadProgress: defaultToConfig2,
        onDownloadProgress: defaultToConfig2,
        decompress: defaultToConfig2,
        maxContentLength: defaultToConfig2,
        maxBodyLength: defaultToConfig2,
        beforeRedirect: defaultToConfig2,
        transport: defaultToConfig2,
        httpAgent: defaultToConfig2,
        httpsAgent: defaultToConfig2,
        cancelToken: defaultToConfig2,
        socketPath: defaultToConfig2,
        responseEncoding: defaultToConfig2,
        validateStatus: mergeDirectKeys,
        headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
      };
      utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
        const merge2 = mergeMap[prop] || mergeDeepProperties;
        const configValue = merge2(config1[prop], config2[prop], prop);
        utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
      });
      return config;
    }
    const resolveConfig = (config) => {
      const newConfig = mergeConfig$1({}, config);
      let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
      newConfig.headers = headers = AxiosHeaders$1.from(headers);
      newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
      if (auth) {
        headers.set(
          "Authorization",
          "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
        );
      }
      let contentType;
      if (utils$1.isFormData(data)) {
        if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
          headers.setContentType(void 0);
        } else if ((contentType = headers.getContentType()) !== false) {
          const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
          headers.setContentType([type || "multipart/form-data", ...tokens].join("; "));
        }
      }
      if (platform.hasStandardBrowserEnv) {
        withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
        if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
          const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
          if (xsrfValue) {
            headers.set(xsrfHeaderName, xsrfValue);
          }
        }
      }
      return newConfig;
    };
    const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
    const xhrAdapter = isXHRAdapterSupported && function(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        const _config = resolveConfig(config);
        let requestData = _config.data;
        const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
        let { responseType, onUploadProgress, onDownloadProgress } = _config;
        let onCanceled;
        let uploadThrottled, downloadThrottled;
        let flushUpload, flushDownload;
        function done() {
          flushUpload && flushUpload();
          flushDownload && flushDownload();
          _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
          _config.signal && _config.signal.removeEventListener("abort", onCanceled);
        }
        let request = new XMLHttpRequest();
        request.open(_config.method.toUpperCase(), _config.url, true);
        request.timeout = _config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          const responseHeaders = AxiosHeaders$1.from(
            "getAllResponseHeaders" in request && request.getAllResponseHeaders()
          );
          const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          const response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };
          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(new AxiosError$1("Request aborted", AxiosError$1.ECONNABORTED, config, request));
          request = null;
        };
        request.onerror = function handleError2() {
          reject(new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
          const transitional = _config.transitional || transitionalDefaults;
          if (_config.timeoutErrorMessage) {
            timeoutErrorMessage = _config.timeoutErrorMessage;
          }
          reject(new AxiosError$1(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
            config,
            request
          ));
          request = null;
        };
        requestData === void 0 && requestHeaders.setContentType(null);
        if ("setRequestHeader" in request) {
          utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
          });
        }
        if (!utils$1.isUndefined(_config.withCredentials)) {
          request.withCredentials = !!_config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = _config.responseType;
        }
        if (onDownloadProgress) {
          [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
          request.addEventListener("progress", downloadThrottled);
        }
        if (onUploadProgress && request.upload) {
          [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
          request.upload.addEventListener("progress", uploadThrottled);
          request.upload.addEventListener("loadend", flushUpload);
        }
        if (_config.cancelToken || _config.signal) {
          onCanceled = (cancel) => {
            if (!request) {
              return;
            }
            reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
            request.abort();
            request = null;
          };
          _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
          if (_config.signal) {
            _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
          }
        }
        const protocol = parseProtocol(_config.url);
        if (protocol && platform.protocols.indexOf(protocol) === -1) {
          reject(new AxiosError$1("Unsupported protocol " + protocol + ":", AxiosError$1.ERR_BAD_REQUEST, config));
          return;
        }
        request.send(requestData || null);
      });
    };
    const composeSignals = (signals, timeout) => {
      const { length } = signals = signals ? signals.filter(Boolean) : [];
      if (timeout || length) {
        let controller = new AbortController();
        let aborted;
        const onabort = function(reason) {
          if (!aborted) {
            aborted = true;
            unsubscribe();
            const err = reason instanceof Error ? reason : this.reason;
            controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
          }
        };
        let timer = timeout && setTimeout(() => {
          timer = null;
          onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
        }, timeout);
        const unsubscribe = () => {
          if (signals) {
            timer && clearTimeout(timer);
            timer = null;
            signals.forEach((signal2) => {
              signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
            });
            signals = null;
          }
        };
        signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
        const { signal } = controller;
        signal.unsubscribe = () => utils$1.asap(unsubscribe);
        return signal;
      }
    };
    const streamChunk = function* (chunk, chunkSize) {
      let len = chunk.byteLength;
      if (len < chunkSize) {
        yield chunk;
        return;
      }
      let pos = 0;
      let end;
      while (pos < len) {
        end = pos + chunkSize;
        yield chunk.slice(pos, end);
        pos = end;
      }
    };
    const readBytes = function(iterable, chunkSize) {
      return __asyncGenerator(this, null, function* () {
        try {
          for (var iter = __forAwait(readStream(iterable)), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
            const chunk = temp.value;
            yield* __yieldStar(streamChunk(chunk, chunkSize));
          }
        } catch (temp) {
          error = [temp];
        } finally {
          try {
            more && (temp = iter.return) && (yield new __await(temp.call(iter)));
          } finally {
            if (error)
              throw error[0];
          }
        }
      });
    };
    const readStream = function(stream) {
      return __asyncGenerator(this, null, function* () {
        if (stream[Symbol.asyncIterator]) {
          yield* __yieldStar(stream);
          return;
        }
        const reader = stream.getReader();
        try {
          for (; ; ) {
            const { done, value } = yield new __await(reader.read());
            if (done) {
              break;
            }
            yield value;
          }
        } finally {
          yield new __await(reader.cancel());
        }
      });
    };
    const trackStream = (stream, chunkSize, onProgress, onFinish) => {
      const iterator2 = readBytes(stream, chunkSize);
      let bytes = 0;
      let done;
      let _onFinish = (e) => {
        if (!done) {
          done = true;
          onFinish && onFinish(e);
        }
      };
      return new ReadableStream({
        pull(controller) {
          return __async(this, null, function* () {
            try {
              const { done: done2, value } = yield iterator2.next();
              if (done2) {
                _onFinish();
                controller.close();
                return;
              }
              let len = value.byteLength;
              if (onProgress) {
                let loadedBytes = bytes += len;
                onProgress(loadedBytes);
              }
              controller.enqueue(new Uint8Array(value));
            } catch (err) {
              _onFinish(err);
              throw err;
            }
          });
        },
        cancel(reason) {
          _onFinish(reason);
          return iterator2.return();
        }
      }, {
        highWaterMark: 2
      });
    };
    const isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
    const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
    const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : (str) => __async(exports, null, function* () {
      return new Uint8Array(yield new Response(str).arrayBuffer());
    }));
    const test = (fn, ...args) => {
      try {
        return !!fn(...args);
      } catch (e) {
        return false;
      }
    };
    const supportsRequestStream = isReadableStreamSupported && test(() => {
      let duplexAccessed = false;
      const hasContentType = new Request(platform.origin, {
        body: new ReadableStream(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
      return duplexAccessed && !hasContentType;
    });
    const DEFAULT_CHUNK_SIZE = 64 * 1024;
    const supportsResponseStream = isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
    const resolvers = {
      stream: supportsResponseStream && ((res) => res.body)
    };
    isFetchSupported && ((res) => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
        !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res2) => res2[type]() : (_, config) => {
          throw new AxiosError$1(`Response type '${type}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config);
        });
      });
    })(new Response());
    const getBodyLength = (body) => __async(exports, null, function* () {
      if (body == null) {
        return 0;
      }
      if (utils$1.isBlob(body)) {
        return body.size;
      }
      if (utils$1.isSpecCompliantForm(body)) {
        const _request = new Request(platform.origin, {
          method: "POST",
          body
        });
        return (yield _request.arrayBuffer()).byteLength;
      }
      if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
        return body.byteLength;
      }
      if (utils$1.isURLSearchParams(body)) {
        body = body + "";
      }
      if (utils$1.isString(body)) {
        return (yield encodeText(body)).byteLength;
      }
    });
    const resolveBodyLength = (headers, body) => __async(exports, null, function* () {
      const length = utils$1.toFiniteNumber(headers.getContentLength());
      return length == null ? getBodyLength(body) : length;
    });
    const fetchAdapter = isFetchSupported && ((config) => __async(exports, null, function* () {
      let {
        url,
        method,
        data,
        signal,
        cancelToken,
        timeout,
        onDownloadProgress,
        onUploadProgress,
        responseType,
        headers,
        withCredentials = "same-origin",
        fetchOptions
      } = resolveConfig(config);
      responseType = responseType ? (responseType + "").toLowerCase() : "text";
      let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
      let request;
      const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
        composedSignal.unsubscribe();
      });
      let requestContentLength;
      try {
        if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = yield resolveBodyLength(headers, data)) !== 0) {
          let _request = new Request(url, {
            method: "POST",
            body: data,
            duplex: "half"
          });
          let contentTypeHeader;
          if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
            headers.setContentType(contentTypeHeader);
          }
          if (_request.body) {
            const [onProgress, flush] = progressEventDecorator(
              requestContentLength,
              progressEventReducer(asyncDecorator(onUploadProgress))
            );
            data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
          }
        }
        if (!utils$1.isString(withCredentials)) {
          withCredentials = withCredentials ? "include" : "omit";
        }
        const isCredentialsSupported = "credentials" in Request.prototype;
        request = new Request(url, __spreadProps(__spreadValues({}, fetchOptions), {
          signal: composedSignal,
          method: method.toUpperCase(),
          headers: headers.normalize().toJSON(),
          body: data,
          duplex: "half",
          credentials: isCredentialsSupported ? withCredentials : void 0
        }));
        let response = yield fetch(request);
        const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
        if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
          const options = {};
          ["status", "statusText", "headers"].forEach((prop) => {
            options[prop] = response[prop];
          });
          const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
          const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
            responseContentLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true)
          ) || [];
          response = new Response(
            trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
              flush && flush();
              unsubscribe && unsubscribe();
            }),
            options
          );
        }
        responseType = responseType || "text";
        let responseData = yield resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
        !isStreamResponse && unsubscribe && unsubscribe();
        return yield new Promise((resolve, reject) => {
          settle(resolve, reject, {
            data: responseData,
            headers: AxiosHeaders$1.from(response.headers),
            status: response.status,
            statusText: response.statusText,
            config,
            request
          });
        });
      } catch (err) {
        unsubscribe && unsubscribe();
        if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
          throw Object.assign(
            new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config, request),
            {
              cause: err.cause || err
            }
          );
        }
        throw AxiosError$1.from(err, err && err.code, config, request);
      }
    }));
    const knownAdapters = {
      http: httpAdapter,
      xhr: xhrAdapter,
      fetch: fetchAdapter
    };
    utils$1.forEach(knownAdapters, (fn, value) => {
      if (fn) {
        try {
          Object.defineProperty(fn, "name", { value });
        } catch (e) {
        }
        Object.defineProperty(fn, "adapterName", { value });
      }
    });
    const renderReason = (reason) => `- ${reason}`;
    const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
    const adapters = {
      getAdapter: (adapters2) => {
        adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
        const { length } = adapters2;
        let nameOrAdapter;
        let adapter;
        const rejectedReasons = {};
        for (let i = 0; i < length; i++) {
          nameOrAdapter = adapters2[i];
          let id;
          adapter = nameOrAdapter;
          if (!isResolvedHandle(nameOrAdapter)) {
            adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
            if (adapter === void 0) {
              throw new AxiosError$1(`Unknown adapter '${id}'`);
            }
          }
          if (adapter) {
            break;
          }
          rejectedReasons[id || "#" + i] = adapter;
        }
        if (!adapter) {
          const reasons = Object.entries(rejectedReasons).map(
            ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
          );
          let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
          throw new AxiosError$1(
            `There is no suitable adapter to dispatch the request ` + s,
            "ERR_NOT_SUPPORT"
          );
        }
        return adapter;
      },
      adapters: knownAdapters
    };
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
      if (config.signal && config.signal.aborted) {
        throw new CanceledError$1(null, config);
      }
    }
    function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = AxiosHeaders$1.from(config.headers);
      config.data = transformData.call(
        config,
        config.transformRequest
      );
      if (["post", "put", "patch"].indexOf(config.method) !== -1) {
        config.headers.setContentType("application/x-www-form-urlencoded", false);
      }
      const adapter = adapters.getAdapter(config.adapter || defaults.adapter);
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData.call(
          config,
          config.transformResponse,
          response
        );
        response.headers = AxiosHeaders$1.from(response.headers);
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel$1(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              config.transformResponse,
              reason.response
            );
            reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
          }
        }
        return Promise.reject(reason);
      });
    }
    const VERSION$1 = "1.9.0";
    const validators$1 = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
      validators$1[type] = function validator2(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
      };
    });
    const deprecatedWarnings = {};
    validators$1.transitional = function transitional(validator2, version2, message) {
      function formatMessage(opt, desc) {
        return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return (value, opt, opts) => {
        if (validator2 === false) {
          throw new AxiosError$1(
            formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
            AxiosError$1.ERR_DEPRECATED
          );
        }
        if (version2 && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(
            formatMessage(
              opt,
              " has been deprecated since v" + version2 + " and will be removed in the near future"
            )
          );
        }
        return validator2 ? validator2(value, opt, opts) : true;
      };
    };
    validators$1.spelling = function spelling(correctSpelling) {
      return (value, opt) => {
        console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
        return true;
      };
    };
    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== "object") {
        throw new AxiosError$1("options must be an object", AxiosError$1.ERR_BAD_OPTION_VALUE);
      }
      const keys = Object.keys(options);
      let i = keys.length;
      while (i-- > 0) {
        const opt = keys[i];
        const validator2 = schema[opt];
        if (validator2) {
          const value = options[opt];
          const result = value === void 0 || validator2(value, opt, options);
          if (result !== true) {
            throw new AxiosError$1("option " + opt + " must be " + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError$1("Unknown option " + opt, AxiosError$1.ERR_BAD_OPTION);
        }
      }
    }
    const validator = {
      assertOptions,
      validators: validators$1
    };
    const validators = validator.validators;
    let Axios$1 = class Axios {
      constructor(instanceConfig) {
        this.defaults = instanceConfig || {};
        this.interceptors = {
          request: new InterceptorManager(),
          response: new InterceptorManager()
        };
      }
      /**
       * Dispatch a request
       *
       * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
       * @param {?Object} config
       *
       * @returns {Promise} The Promise to be fulfilled
       */
      request(configOrUrl, config) {
        return __async(this, null, function* () {
          try {
            return yield this._request(configOrUrl, config);
          } catch (err) {
            if (err instanceof Error) {
              let dummy = {};
              Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
              const stack2 = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
              try {
                if (!err.stack) {
                  err.stack = stack2;
                } else if (stack2 && !String(err.stack).endsWith(stack2.replace(/^.+\n.+\n/, ""))) {
                  err.stack += "\n" + stack2;
                }
              } catch (e) {
              }
            }
            throw err;
          }
        });
      }
      _request(configOrUrl, config) {
        if (typeof configOrUrl === "string") {
          config = config || {};
          config.url = configOrUrl;
        } else {
          config = configOrUrl || {};
        }
        config = mergeConfig$1(this.defaults, config);
        const { transitional, paramsSerializer, headers } = config;
        if (transitional !== void 0) {
          validator.assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean)
          }, false);
        }
        if (paramsSerializer != null) {
          if (utils$1.isFunction(paramsSerializer)) {
            config.paramsSerializer = {
              serialize: paramsSerializer
            };
          } else {
            validator.assertOptions(paramsSerializer, {
              encode: validators.function,
              serialize: validators.function
            }, true);
          }
        }
        if (config.allowAbsoluteUrls !== void 0) ;
        else if (this.defaults.allowAbsoluteUrls !== void 0) {
          config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
        } else {
          config.allowAbsoluteUrls = true;
        }
        validator.assertOptions(config, {
          baseUrl: validators.spelling("baseURL"),
          withXsrfToken: validators.spelling("withXSRFToken")
        }, true);
        config.method = (config.method || this.defaults.method || "get").toLowerCase();
        let contextHeaders = headers && utils$1.merge(
          headers.common,
          headers[config.method]
        );
        headers && utils$1.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          (method) => {
            delete headers[method];
          }
        );
        config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
            return;
          }
          synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        let promise;
        let i = 0;
        let len;
        if (!synchronousRequestInterceptors) {
          const chain = [dispatchRequest.bind(this), void 0];
          chain.unshift.apply(chain, requestInterceptorChain);
          chain.push.apply(chain, responseInterceptorChain);
          len = chain.length;
          promise = Promise.resolve(config);
          while (i < len) {
            promise = promise.then(chain[i++], chain[i++]);
          }
          return promise;
        }
        len = requestInterceptorChain.length;
        let newConfig = config;
        i = 0;
        while (i < len) {
          const onFulfilled = requestInterceptorChain[i++];
          const onRejected = requestInterceptorChain[i++];
          try {
            newConfig = onFulfilled(newConfig);
          } catch (error) {
            onRejected.call(this, error);
            break;
          }
        }
        try {
          promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
          return Promise.reject(error);
        }
        i = 0;
        len = responseInterceptorChain.length;
        while (i < len) {
          promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }
        return promise;
      }
      getUri(config) {
        config = mergeConfig$1(this.defaults, config);
        const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
        return buildURL(fullPath, config.params, config.paramsSerializer);
      }
    };
    utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
      Axios$1.prototype[method] = function(url, config) {
        return this.request(mergeConfig$1(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });
    utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig$1(config || {}, {
            method,
            headers: isForm ? {
              "Content-Type": "multipart/form-data"
            } : {},
            url,
            data
          }));
        };
      }
      Axios$1.prototype[method] = generateHTTPMethod();
      Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
    });
    let CancelToken$1 = class CancelToken2 {
      constructor(executor) {
        if (typeof executor !== "function") {
          throw new TypeError("executor must be a function.");
        }
        let resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });
        const token = this;
        this.promise.then((cancel) => {
          if (!token._listeners) return;
          let i = token._listeners.length;
          while (i-- > 0) {
            token._listeners[i](cancel);
          }
          token._listeners = null;
        });
        this.promise.then = (onfulfilled) => {
          let _resolve;
          const promise = new Promise((resolve) => {
            token.subscribe(resolve);
            _resolve = resolve;
          }).then(onfulfilled);
          promise.cancel = function reject() {
            token.unsubscribe(_resolve);
          };
          return promise;
        };
        executor(function cancel(message, config, request) {
          if (token.reason) {
            return;
          }
          token.reason = new CanceledError$1(message, config, request);
          resolvePromise(token.reason);
        });
      }
      /**
       * Throws a `CanceledError` if cancellation has been requested.
       */
      throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      }
      /**
       * Subscribe to the cancel signal
       */
      subscribe(listener) {
        if (this.reason) {
          listener(this.reason);
          return;
        }
        if (this._listeners) {
          this._listeners.push(listener);
        } else {
          this._listeners = [listener];
        }
      }
      /**
       * Unsubscribe from the cancel signal
       */
      unsubscribe(listener) {
        if (!this._listeners) {
          return;
        }
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
          this._listeners.splice(index, 1);
        }
      }
      toAbortSignal() {
        const controller = new AbortController();
        const abort = (err) => {
          controller.abort(err);
        };
        this.subscribe(abort);
        controller.signal.unsubscribe = () => this.unsubscribe(abort);
        return controller.signal;
      }
      /**
       * Returns an object that contains a new `CancelToken` and a function that, when called,
       * cancels the `CancelToken`.
       */
      static source() {
        let cancel;
        const token = new CancelToken2(function executor(c) {
          cancel = c;
        });
        return {
          token,
          cancel
        };
      }
    };
    function spread$1(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    }
    function isAxiosError$1(payload) {
      return utils$1.isObject(payload) && payload.isAxiosError === true;
    }
    const HttpStatusCode$1 = {
      Continue: 100,
      SwitchingProtocols: 101,
      Processing: 102,
      EarlyHints: 103,
      Ok: 200,
      Created: 201,
      Accepted: 202,
      NonAuthoritativeInformation: 203,
      NoContent: 204,
      ResetContent: 205,
      PartialContent: 206,
      MultiStatus: 207,
      AlreadyReported: 208,
      ImUsed: 226,
      MultipleChoices: 300,
      MovedPermanently: 301,
      Found: 302,
      SeeOther: 303,
      NotModified: 304,
      UseProxy: 305,
      Unused: 306,
      TemporaryRedirect: 307,
      PermanentRedirect: 308,
      BadRequest: 400,
      Unauthorized: 401,
      PaymentRequired: 402,
      Forbidden: 403,
      NotFound: 404,
      MethodNotAllowed: 405,
      NotAcceptable: 406,
      ProxyAuthenticationRequired: 407,
      RequestTimeout: 408,
      Conflict: 409,
      Gone: 410,
      LengthRequired: 411,
      PreconditionFailed: 412,
      PayloadTooLarge: 413,
      UriTooLong: 414,
      UnsupportedMediaType: 415,
      RangeNotSatisfiable: 416,
      ExpectationFailed: 417,
      ImATeapot: 418,
      MisdirectedRequest: 421,
      UnprocessableEntity: 422,
      Locked: 423,
      FailedDependency: 424,
      TooEarly: 425,
      UpgradeRequired: 426,
      PreconditionRequired: 428,
      TooManyRequests: 429,
      RequestHeaderFieldsTooLarge: 431,
      UnavailableForLegalReasons: 451,
      InternalServerError: 500,
      NotImplemented: 501,
      BadGateway: 502,
      ServiceUnavailable: 503,
      GatewayTimeout: 504,
      HttpVersionNotSupported: 505,
      VariantAlsoNegotiates: 506,
      InsufficientStorage: 507,
      LoopDetected: 508,
      NotExtended: 510,
      NetworkAuthenticationRequired: 511
    };
    Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
      HttpStatusCode$1[value] = key;
    });
    function createInstance(defaultConfig) {
      const context = new Axios$1(defaultConfig);
      const instance = bind(Axios$1.prototype.request, context);
      utils$1.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
      utils$1.extend(instance, context, null, { allOwnKeys: true });
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
      };
      return instance;
    }
    const axios = createInstance(defaults);
    axios.Axios = Axios$1;
    axios.CanceledError = CanceledError$1;
    axios.CancelToken = CancelToken$1;
    axios.isCancel = isCancel$1;
    axios.VERSION = VERSION$1;
    axios.toFormData = toFormData$1;
    axios.AxiosError = AxiosError$1;
    axios.Cancel = axios.CanceledError;
    axios.all = function all2(promises) {
      return Promise.all(promises);
    };
    axios.spread = spread$1;
    axios.isAxiosError = isAxiosError$1;
    axios.mergeConfig = mergeConfig$1;
    axios.AxiosHeaders = AxiosHeaders$1;
    axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
    axios.getAdapter = adapters.getAdapter;
    axios.HttpStatusCode = HttpStatusCode$1;
    axios.default = axios;
    const {
      Axios,
      AxiosError,
      CanceledError,
      isCancel,
      CancelToken,
      VERSION,
      all,
      Cancel,
      isAxiosError,
      spread,
      toFormData,
      AxiosHeaders,
      HttpStatusCode,
      formToJSON,
      getAdapter,
      mergeConfig
    } = axios;
    class KillfeedAPI {
      constructor() {
        __publicField(this, "baseUrl");
        __publicField(this, "apiKey");
        // System cache for security status
        __publicField(this, "systemCache", /* @__PURE__ */ new Map());
        // ESI API helpers with basic caching
        __publicField(this, "characterCache", /* @__PURE__ */ new Map());
        __publicField(this, "corpCache", /* @__PURE__ */ new Map());
        __publicField(this, "allianceCache", /* @__PURE__ */ new Map());
        __publicField(this, "typeCache", /* @__PURE__ */ new Map());
        const urlParams = new URLSearchParams(window.location.search);
        const apiUrlParam = urlParams.get("api_url");
        if (apiUrlParam) {
          this.baseUrl = apiUrlParam;
        } else {
          this.baseUrl = "direct";
        }
        this.apiKey = "";
      }
      setConfig(baseUrl, apiKey = "") {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
      }
      getHeaders() {
        const headers = {
          "Content-Type": "application/json"
        };
        if (this.apiKey) {
          headers["Authorization"] = `Bearer ${this.apiKey}`;
        }
        return headers;
      }
      getKillmails(systems, regions, limit = 50) {
        return __async(this, null, function* () {
          if (this.baseUrl !== "direct") {
            return this.getKillmailsFromWordPress(limit);
          }
          return this.getKillmailsDirectFromZkb(systems, regions, limit);
        });
      }
      /**
       * Get monitored locations from WordPress backend
       */
      getMonitoredLocations() {
        return __async(this, null, function* () {
          if (this.baseUrl === "direct") {
            return { systems: [], regions: [] };
          }
          try {
            const [systemsResponse, regionsResponse] = yield Promise.all([
              axios.get(`${this.baseUrl}/systems`, {
                headers: this.getHeaders(),
                timeout: 1e4,
                withCredentials: false
              }),
              axios.get(`${this.baseUrl}/regions`, {
                headers: this.getHeaders(),
                timeout: 1e4,
                withCredentials: false
              })
            ]);
            const systems = systemsResponse.data.success ? systemsResponse.data.data : [];
            const regions = regionsResponse.data.success ? regionsResponse.data.data : [];
            console.log("Fetched monitored locations:", { systems: systems.length, regions: regions.length });
            return { systems, regions };
          } catch (error) {
            console.error("Failed to fetch monitored locations:", error);
            return { systems: [], regions: [] };
          }
        });
      }
      /**
       * Production: Fetch killmails from WordPress backend using its own monitoring configuration
       */
      getKillmailsFromWordPress(limit = 50) {
        return __async(this, null, function* () {
          try {
            console.log("Fetching from WordPress backend:", this.baseUrl);
            console.log("Using WordPress backend monitoring configuration (no URL parameter override)");
            const params = new URLSearchParams();
            params.append("limit", limit.toString());
            params.append("hours", "24");
            const url = `${this.baseUrl}/killmails?${params.toString()}`;
            console.log("WordPress API URL:", url);
            const response = yield axios.get(url, {
              headers: this.getHeaders(),
              timeout: 15e3,
              withCredentials: false
            });
            console.log("WordPress API Response:", response.data);
            if (response.data.success) {
              console.log(`✅ Fetched ${response.data.data.length} killmails from WordPress backend using configured monitoring`);
              return response.data.data;
            } else {
              throw new Error(response.data.message || "WordPress API error");
            }
          } catch (error) {
            console.error("❌ WordPress backend failed:", error);
            throw error;
          }
        });
      }
      /**
       * Development: Direct zKillboard fetch for Bolt environment with region support
       */
      getKillmailsDirectFromZkb(systems, regions, limit = 50) {
        return __async(this, null, function* () {
          console.log("🔧 Development mode: Fetching live data from zKillboard");
          const targetSystems = systems && systems.length > 0 ? systems : [];
          const targetRegions = regions && regions.length > 0 ? regions : [];
          if (targetSystems.length === 0 && targetRegions.length === 0) {
            targetSystems.push("EFM-C4", "Jita", "Amarr");
          }
          const killmails = [];
          const systemIds = {
            "jita": 30000142,
            "amarr": 30002187,
            "dodixie": 30002659,
            "rens": 30002510,
            "hek": 30000144,
            "perimeter": 30045349,
            "efm-c4": 30000783,
            "tama": 30002813,
            "amamake": 30002537,
            "rancer": 30001372,
            "uedama": 30000210,
            "niarja": 30002505
          };
          const regionIds = {
            "the forge": 10000002,
            "domain": 10000043,
            "sinq laison": 10000032,
            "heimatar": 10000030,
            "metropolis": 10000042,
            "black rise": 10000069,
            "placid": 10000048,
            "genesis": 10000067,
            "delve": 10000060,
            "fountain": 10000054,
            "catch": 10000014,
            "providence": 10000039,
            "syndicate": 10000040,
            "curse": 10000012,
            "stain": 10000022
          };
          for (const systemName of targetSystems) {
            const systemId = systemIds[systemName.toLowerCase()];
            if (!systemId) {
              console.warn(`⚠️ Unknown system: ${systemName}`);
              continue;
            }
            try {
              console.log(`📡 Fetching live killmails for ${systemName} (ID: ${systemId})`);
              const isDevelopment = false;
              let zkbUrl;
              if (isDevelopment) ;
              else {
                zkbUrl = `https://zkillboard.com/api/kills/solarSystemID/${systemId}/`;
              }
              const zkbResponse = yield axios.get(zkbUrl, {
                timeout: 1e4,
              });
              if (Array.isArray(zkbResponse.data) && zkbResponse.data.length > 0) {
                const systemKillmails = zkbResponse.data.slice(0, Math.floor(limit / (targetSystems.length + targetRegions.length)));
                for (const zkbKill of systemKillmails) {
                  const processedKill = yield this.processZkbKillmail(zkbKill, systemName, systemId);
                  if (processedKill) {
                    killmails.push(processedKill);
                  }
                }
                console.log(`✅ ${systemName}: ${systemKillmails.length} killmails processed`);
              } else {
                console.log(`ℹ️ ${systemName}: No recent killmails found`);
              }
              yield new Promise((resolve) => setTimeout(resolve, 1e3));
            } catch (error) {
              console.error(`❌ Failed to fetch killmails for ${systemName}:`, error);
              {
                const demoKill = this.createDemoKillmail(systemName, systemId);
                if (demoKill) {
                  killmails.push(demoKill);
                }
              }
            }
          }
          for (const regionName of targetRegions) {
            const regionId = regionIds[regionName.toLowerCase()];
            if (!regionId) {
              console.warn(`⚠️ Unknown region: ${regionName}`);
              continue;
            }
            try {
              console.log(`📡 Fetching live killmails for ${regionName} (ID: ${regionId})`);
              const isDevelopment = false;
              let zkbUrl;
              if (isDevelopment) ;
              else {
                zkbUrl = `https://zkillboard.com/api/kills/regionID/${regionId}/`;
              }
              const zkbResponse = yield axios.get(zkbUrl, {
                timeout: 1e4
              });
              if (Array.isArray(zkbResponse.data) && zkbResponse.data.length > 0) {
                const regionKillmails = zkbResponse.data.slice(0, Math.floor(limit / (targetSystems.length + targetRegions.length)));
                for (const zkbKill of regionKillmails) {
                  const processedKill = yield this.processZkbKillmail(zkbKill, regionName, null, true);
                  if (processedKill) {
                    killmails.push(processedKill);
                  }
                }
                console.log(`✅ ${regionName}: ${regionKillmails.length} killmails processed`);
              } else {
                console.log(`ℹ️ ${regionName}: No recent killmails found`);
              }
              yield new Promise((resolve) => setTimeout(resolve, 1e3));
            } catch (error) {
              console.error(`❌ Failed to fetch killmails for ${regionName}:`, error);
              {
                const demoKill = this.createDemoKillmail(regionName, 0, true);
                if (demoKill) {
                  killmails.push(demoKill);
                }
              }
            }
          }
          console.log(`🎯 Development mode: ${killmails.length} total killmails fetched`);
          return killmails.slice(0, limit);
        });
      }
      /**
       * Create demo killmail for production fallback
       */
      createDemoKillmail(locationName, locationId, isRegion = false) {
        const now = /* @__PURE__ */ new Date();
        const killmailId = Math.floor(Math.random() * 1e6) + 1e8;
        return {
          id: killmailId,
          killmail_id: killmailId,
          system_id: isRegion ? 0 : locationId,
          system_name: isRegion ? "Demo System" : locationName,
          region_name: isRegion ? locationName : "Demo Region",
          ship_type_id: 587,
          // Rifter
          ship_name: "Rifter",
          victim_name: "Demo Pilot",
          victim_corp: "Demo Corporation",
          victim_alliance: "Demo Alliance",
          victim_corp_logo: "https://images.evetech.net/corporations/1000001/logo?size=64",
          victim_alliance_logo: "https://images.evetech.net/alliances/1000001/logo?size=64",
          killer_name: "Elite Pilot",
          killer_corp: "Elite Corporation",
          killer_alliance: "Elite Alliance",
          killer_corp_logo: "https://images.evetech.net/corporations/1000002/logo?size=64",
          killer_alliance_logo: "https://images.evetech.net/alliances/1000002/logo?size=64",
          kill_time: new Date(now.getTime() - 3e5).toISOString(),
          // 5 minutes ago
          zkb_url: `https://zkillboard.com/kill/${killmailId}/`,
          total_value: Math.floor(Math.random() * 1e8) + 1e7,
          // 10M - 110M ISK
          created_at: now.toISOString(),
          security_status: Math.random() * 1
          // Random security status for demo
        };
      }
      /**
       * Process zKillboard killmail data and enrich with ESI
       */
      processZkbKillmail(zkbKill, locationName, locationId, isRegion = false) {
        return __async(this, null, function* () {
          var _a, _b, _c, _d, _e, _f, _g;
          try {
            const killmailId = zkbKill.killmail_id;
            const zkbData = zkbKill.zkb || {};
            const totalValue = zkbData.totalValue || 0;
            const hash = zkbData.hash || "";
            let killmailDetail = null;
            if (hash) {
              try {
                const isDevelopment = false;
                let esiUrl;
                if (isDevelopment) ;
                else {
                  esiUrl = `https://esi.evetech.net/latest/killmails/${killmailId}/${hash}/`;
                }
                const esiResponse = yield axios.get(esiUrl, { timeout: 5e3 });
                killmailDetail = esiResponse.data;
              } catch (error) {
                console.warn(`⚠️ ESI lookup failed for killmail ${killmailId}`);
              }
            }
            let systemDetails = null;
            if (locationId && !isRegion) {
              systemDetails = yield this.getSystemDetails(locationId);
            }
            const securityStatus = (systemDetails == null ? void 0 : systemDetails.security_status) || 0;
            let victimName = "Unknown Pilot";
            let victimCorp = "Unknown Corporation";
            let victimAlliance = "";
            let killerName = "Unknown Killer";
            let killerCorp = "Unknown Corporation";
            let killerAlliance = "";
            let shipName = "Unknown Ship";
            let killTime = (/* @__PURE__ */ new Date()).toISOString();
            let actualSystemName = isRegion ? "Unknown System" : locationName;
            let actualSystemId = isRegion ? 0 : locationId || 0;
            if (killmailDetail) {
              const victim = killmailDetail.victim || {};
              const attackers = killmailDetail.attackers || [];
              const finalBlow = attackers.find((a) => a.final_blow) || attackers[0] || {};
              if (isRegion && killmailDetail.solar_system_id) {
                actualSystemId = killmailDetail.solar_system_id;
                const systemInfo = yield this.getSystemDetails(actualSystemId);
                if (systemInfo) {
                  actualSystemName = systemInfo.name;
                }
              }
              if (victim.character_id) {
                victimName = yield this.getCharacterName(victim.character_id);
              }
              if (victim.corporation_id) {
                victimCorp = yield this.getCorporationName(victim.corporation_id);
              }
              if (victim.alliance_id) {
                victimAlliance = yield this.getAllianceName(victim.alliance_id);
              }
              if (victim.ship_type_id) {
                shipName = yield this.getTypeName(victim.ship_type_id);
              }
              if (finalBlow.character_id) {
                killerName = yield this.getCharacterName(finalBlow.character_id);
              }
              if (finalBlow.corporation_id) {
                killerCorp = yield this.getCorporationName(finalBlow.corporation_id);
              }
              if (finalBlow.alliance_id) {
                killerAlliance = yield this.getAllianceName(finalBlow.alliance_id);
              }
              killTime = killmailDetail.killmail_time || killTime;
            }
            return {
              id: killmailId,
              killmail_id: killmailId,
              system_id: actualSystemId,
              system_name: actualSystemName,
              region_name: isRegion ? locationName : "Unknown Region",
              ship_type_id: ((_a = killmailDetail == null ? void 0 : killmailDetail.victim) == null ? void 0 : _a.ship_type_id) || 0,
              ship_name: shipName,
              victim_name: victimName,
              victim_corp: victimCorp,
              victim_alliance: victimAlliance,
              victim_corp_logo: ((_b = killmailDetail == null ? void 0 : killmailDetail.victim) == null ? void 0 : _b.corporation_id) ? `https://images.evetech.net/corporations/${killmailDetail.victim.corporation_id}/logo?size=64` : void 0,
              victim_alliance_logo: ((_c = killmailDetail == null ? void 0 : killmailDetail.victim) == null ? void 0 : _c.alliance_id) ? `https://images.evetech.net/alliances/${killmailDetail.victim.alliance_id}/logo?size=64` : void 0,
              killer_name: killerName,
              killer_corp: killerCorp,
              killer_alliance: killerAlliance,
              killer_corp_logo: ((_e = (_d = killmailDetail == null ? void 0 : killmailDetail.attackers) == null ? void 0 : _d[0]) == null ? void 0 : _e.corporation_id) ? `https://images.evetech.net/corporations/${killmailDetail.attackers[0].corporation_id}/logo?size=64` : void 0,
              killer_alliance_logo: ((_g = (_f = killmailDetail == null ? void 0 : killmailDetail.attackers) == null ? void 0 : _f[0]) == null ? void 0 : _g.alliance_id) ? `https://images.evetech.net/alliances/${killmailDetail.attackers[0].alliance_id}/logo?size=64` : void 0,
              kill_time: killTime,
              zkb_url: `https://zkillboard.com/kill/${killmailId}/`,
              total_value: totalValue,
              created_at: (/* @__PURE__ */ new Date()).toISOString(),
              security_status: securityStatus
            };
          } catch (error) {
            console.error("❌ Failed to process killmail:", error);
            return null;
          }
        });
      }
      /**
       * Get system details including security status
       */
      getSystemDetails(systemId) {
        return __async(this, null, function* () {
          if (this.systemCache.has(systemId)) {
            return this.systemCache.get(systemId);
          }
          try {
            const isDevelopment = false;
            let url;
            if (isDevelopment) ;
            else {
              url = `https://esi.evetech.net/latest/universe/systems/${systemId}/`;
            }
            const response = yield axios.get(url, { timeout: 3e3 });
            const systemData = response.data;
            this.systemCache.set(systemId, systemData);
            return systemData;
          } catch (error) {
            const fallback = { security_status: 0 };
            this.systemCache.set(systemId, fallback);
            return fallback;
          }
        });
      }
      getCharacterName(characterId) {
        return __async(this, null, function* () {
          if (this.characterCache.has(characterId)) {
            return this.characterCache.get(characterId);
          }
          try {
            const isDevelopment = false;
            let url;
            if (isDevelopment) ;
            else {
              url = `https://esi.evetech.net/latest/characters/${characterId}/`;
            }
            const response = yield axios.get(url, { timeout: 3e3 });
            const name = response.data.name || `Character ${characterId}`;
            this.characterCache.set(characterId, name);
            return name;
          } catch (error) {
            const fallback = `Character ${characterId}`;
            this.characterCache.set(characterId, fallback);
            return fallback;
          }
        });
      }
      getCorporationName(corpId) {
        return __async(this, null, function* () {
          if (this.corpCache.has(corpId)) {
            return this.corpCache.get(corpId);
          }
          try {
            const isDevelopment = false;
            let url;
            if (isDevelopment) ;
            else {
              url = `https://esi.evetech.net/latest/corporations/${corpId}/`;
            }
            const response = yield axios.get(url, { timeout: 3e3 });
            const name = response.data.name || `Corporation ${corpId}`;
            this.corpCache.set(corpId, name);
            return name;
          } catch (error) {
            const fallback = `Corporation ${corpId}`;
            this.corpCache.set(corpId, fallback);
            return fallback;
          }
        });
      }
      getAllianceName(allianceId) {
        return __async(this, null, function* () {
          if (this.allianceCache.has(allianceId)) {
            return this.allianceCache.get(allianceId);
          }
          try {
            const isDevelopment = false;
            let url;
            if (isDevelopment) ;
            else {
              url = `https://esi.evetech.net/latest/alliances/${allianceId}/`;
            }
            const response = yield axios.get(url, { timeout: 3e3 });
            const name = response.data.name || `Alliance ${allianceId}`;
            this.allianceCache.set(allianceId, name);
            return name;
          } catch (error) {
            const fallback = `Alliance ${allianceId}`;
            this.allianceCache.set(allianceId, fallback);
            return fallback;
          }
        });
      }
      getTypeName(typeId) {
        return __async(this, null, function* () {
          if (this.typeCache.has(typeId)) {
            return this.typeCache.get(typeId);
          }
          try {
            const isDevelopment = false;
            let url;
            if (isDevelopment) ;
            else {
              url = `https://esi.evetech.net/latest/universe/types/${typeId}/`;
            }
            const response = yield axios.get(url, { timeout: 3e3 });
            const name = response.data.name || `Type ${typeId}`;
            this.typeCache.set(typeId, name);
            return name;
          } catch (error) {
            const fallback = `Type ${typeId}`;
            this.typeCache.set(typeId, fallback);
            return fallback;
          }
        });
      }
      getSystemStatus() {
        return __async(this, null, function* () {
          if (this.baseUrl === "direct") {
            return [
              { id: 1, name: "EFM-C4", active: true },
              { id: 2, name: "Jita", active: true },
              { id: 3, name: "Amarr", active: true },
              { id: 4, name: "Tama", active: true },
              { id: 5, name: "Dodixie", active: true }
            ];
          }
          try {
            const response = yield axios.get(
              `${this.baseUrl}/systems`,
              {
                headers: this.getHeaders(),
                timeout: 1e4,
                withCredentials: false
              }
            );
            return response.data.success ? response.data.data : [];
          } catch (error) {
            console.error("Failed to fetch system status:", error);
            return [];
          }
        });
      }
    }
    const killfeedAPI = new KillfeedAPI();
    var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    function getDefaultExportFromCjs(x) {
      return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
    }
    var dayjs_min = { exports: {} };
    (function(module2, exports2) {
      !function(t, e) {
        module2.exports = e();
      }(commonjsGlobal, function() {
        var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
          var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
          return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
        } }, m = function(t2, e2, n2) {
          var r2 = String(t2);
          return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
        }, v = { s: m, z: function(t2) {
          var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
          return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
        }, m: function t2(e2, n2) {
          if (e2.date() < n2.date()) return -t2(n2, e2);
          var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
          return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
        }, a: function(t2) {
          return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
        }, p: function(t2) {
          return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
        }, u: function(t2) {
          return void 0 === t2;
        } }, g = "en", D = {};
        D[g] = M;
        var p2 = "$isDayjsObject", S = function(t2) {
          return t2 instanceof _ || !(!t2 || !t2[p2]);
        }, w = function t2(e2, n2, r2) {
          var i2;
          if (!e2) return g;
          if ("string" == typeof e2) {
            var s2 = e2.toLowerCase();
            D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
            var u2 = e2.split("-");
            if (!i2 && u2.length > 1) return t2(u2[0]);
          } else {
            var a2 = e2.name;
            D[a2] = e2, i2 = a2;
          }
          return !r2 && i2 && (g = i2), i2 || !r2 && g;
        }, O = function(t2, e2) {
          if (S(t2)) return t2.clone();
          var n2 = "object" == typeof e2 ? e2 : {};
          return n2.date = t2, n2.args = arguments, new _(n2);
        }, b = v;
        b.l = w, b.i = S, b.w = function(t2, e2) {
          return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
        };
        var _ = function() {
          function M2(t2) {
            this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p2] = true;
          }
          var m2 = M2.prototype;
          return m2.parse = function(t2) {
            this.$d = function(t3) {
              var e2 = t3.date, n2 = t3.utc;
              if (null === e2) return /* @__PURE__ */ new Date(NaN);
              if (b.u(e2)) return /* @__PURE__ */ new Date();
              if (e2 instanceof Date) return new Date(e2);
              if ("string" == typeof e2 && !/Z$/i.test(e2)) {
                var r2 = e2.match($);
                if (r2) {
                  var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                  return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
                }
              }
              return new Date(e2);
            }(t2), this.init();
          }, m2.init = function() {
            var t2 = this.$d;
            this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
          }, m2.$utils = function() {
            return b;
          }, m2.isValid = function() {
            return !(this.$d.toString() === l);
          }, m2.isSame = function(t2, e2) {
            var n2 = O(t2);
            return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
          }, m2.isAfter = function(t2, e2) {
            return O(t2) < this.startOf(e2);
          }, m2.isBefore = function(t2, e2) {
            return this.endOf(e2) < O(t2);
          }, m2.$g = function(t2, e2, n2) {
            return b.u(t2) ? this[e2] : this.set(n2, t2);
          }, m2.unix = function() {
            return Math.floor(this.valueOf() / 1e3);
          }, m2.valueOf = function() {
            return this.$d.getTime();
          }, m2.startOf = function(t2, e2) {
            var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
              var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
              return r2 ? i2 : i2.endOf(a);
            }, $2 = function(t3, e3) {
              return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
            }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
            switch (f2) {
              case h:
                return r2 ? l2(1, 0) : l2(31, 11);
              case c:
                return r2 ? l2(1, M3) : l2(0, M3 + 1);
              case o:
                var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
                return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
              case a:
              case d:
                return $2(v2 + "Hours", 0);
              case u:
                return $2(v2 + "Minutes", 1);
              case s:
                return $2(v2 + "Seconds", 2);
              case i:
                return $2(v2 + "Milliseconds", 3);
              default:
                return this.clone();
            }
          }, m2.endOf = function(t2) {
            return this.startOf(t2, false);
          }, m2.$set = function(t2, e2) {
            var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
            if (o2 === c || o2 === h) {
              var y2 = this.clone().set(d, 1);
              y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
            } else l2 && this.$d[l2]($2);
            return this.init(), this;
          }, m2.set = function(t2, e2) {
            return this.clone().$set(t2, e2);
          }, m2.get = function(t2) {
            return this[b.p(t2)]();
          }, m2.add = function(r2, f2) {
            var d2, l2 = this;
            r2 = Number(r2);
            var $2 = b.p(f2), y2 = function(t2) {
              var e2 = O(l2);
              return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
            };
            if ($2 === c) return this.set(c, this.$M + r2);
            if ($2 === h) return this.set(h, this.$y + r2);
            if ($2 === a) return y2(1);
            if ($2 === o) return y2(7);
            var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
            return b.w(m3, this);
          }, m2.subtract = function(t2, e2) {
            return this.add(-1 * t2, e2);
          }, m2.format = function(t2) {
            var e2 = this, n2 = this.$locale();
            if (!this.isValid()) return n2.invalidDate || l;
            var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s3) {
              return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
            }, d2 = function(t3) {
              return b.s(s2 % 12 || 12, t3, "0");
            }, $2 = f2 || function(t3, e3, n3) {
              var r3 = t3 < 12 ? "AM" : "PM";
              return n3 ? r3.toLowerCase() : r3;
            };
            return r2.replace(y, function(t3, r3) {
              return r3 || function(t4) {
                switch (t4) {
                  case "YY":
                    return String(e2.$y).slice(-2);
                  case "YYYY":
                    return b.s(e2.$y, 4, "0");
                  case "M":
                    return a2 + 1;
                  case "MM":
                    return b.s(a2 + 1, 2, "0");
                  case "MMM":
                    return h2(n2.monthsShort, a2, c2, 3);
                  case "MMMM":
                    return h2(c2, a2);
                  case "D":
                    return e2.$D;
                  case "DD":
                    return b.s(e2.$D, 2, "0");
                  case "d":
                    return String(e2.$W);
                  case "dd":
                    return h2(n2.weekdaysMin, e2.$W, o2, 2);
                  case "ddd":
                    return h2(n2.weekdaysShort, e2.$W, o2, 3);
                  case "dddd":
                    return o2[e2.$W];
                  case "H":
                    return String(s2);
                  case "HH":
                    return b.s(s2, 2, "0");
                  case "h":
                    return d2(1);
                  case "hh":
                    return d2(2);
                  case "a":
                    return $2(s2, u2, true);
                  case "A":
                    return $2(s2, u2, false);
                  case "m":
                    return String(u2);
                  case "mm":
                    return b.s(u2, 2, "0");
                  case "s":
                    return String(e2.$s);
                  case "ss":
                    return b.s(e2.$s, 2, "0");
                  case "SSS":
                    return b.s(e2.$ms, 3, "0");
                  case "Z":
                    return i2;
                }
                return null;
              }(t3) || i2.replace(":", "");
            });
          }, m2.utcOffset = function() {
            return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
          }, m2.diff = function(r2, d2, l2) {
            var $2, y2 = this, M3 = b.p(d2), m3 = O(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
              return b.m(y2, m3);
            };
            switch (M3) {
              case h:
                $2 = D2() / 12;
                break;
              case c:
                $2 = D2();
                break;
              case f:
                $2 = D2() / 3;
                break;
              case o:
                $2 = (g2 - v2) / 6048e5;
                break;
              case a:
                $2 = (g2 - v2) / 864e5;
                break;
              case u:
                $2 = g2 / n;
                break;
              case s:
                $2 = g2 / e;
                break;
              case i:
                $2 = g2 / t;
                break;
              default:
                $2 = g2;
            }
            return l2 ? $2 : b.a($2);
          }, m2.daysInMonth = function() {
            return this.endOf(c).$D;
          }, m2.$locale = function() {
            return D[this.$L];
          }, m2.locale = function(t2, e2) {
            if (!t2) return this.$L;
            var n2 = this.clone(), r2 = w(t2, e2, true);
            return r2 && (n2.$L = r2), n2;
          }, m2.clone = function() {
            return b.w(this.$d, this);
          }, m2.toDate = function() {
            return new Date(this.valueOf());
          }, m2.toJSON = function() {
            return this.isValid() ? this.toISOString() : null;
          }, m2.toISOString = function() {
            return this.$d.toISOString();
          }, m2.toString = function() {
            return this.$d.toUTCString();
          }, M2;
        }(), k = _.prototype;
        return O.prototype = k, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t2) {
          k[t2[1]] = function(e2) {
            return this.$g(e2, t2[0], t2[1]);
          };
        }), O.extend = function(t2, e2) {
          return t2.$i || (t2(e2, _, O), t2.$i = true), O;
        }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
          return O(1e3 * t2);
        }, O.en = D[g], O.Ls = D, O.p = {}, O;
      });
    })(dayjs_min);
    var dayjs_minExports = dayjs_min.exports;
    const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
    const _hoisted_1$3 = { class: "killmail-header" };
    const _hoisted_2$3 = { class: "system-info" };
    const _hoisted_3$3 = { class: "system-name" };
    const _hoisted_4$3 = { class: "time-date" };
    const _hoisted_5$3 = { class: "kill-value" };
    const _hoisted_6$3 = ["href"];
    const _hoisted_7$3 = { class: "killmail-body" };
    const _hoisted_8$3 = { class: "ship-column" };
    const _hoisted_9$3 = ["src", "alt"];
    const _hoisted_10$3 = { class: "ship-info" };
    const _hoisted_11$2 = { class: "ship-name" };
    const _hoisted_12$2 = { class: "pilots-column" };
    const _hoisted_13$2 = { class: "pilot-section victim-section" };
    const _hoisted_14$2 = ["src", "alt"];
    const _hoisted_15$2 = { class: "pilot-info" };
    const _hoisted_16$2 = { class: "pilot-name" };
    const _hoisted_17$2 = { class: "corp-name" };
    const _hoisted_18$1 = {
      key: 0,
      class: "alliance-name"
    };
    const _hoisted_19$1 = { class: "pilot-section killer-section" };
    const _hoisted_20$1 = { class: "pilot-info killer-info" };
    const _hoisted_21$1 = { class: "pilot-name" };
    const _hoisted_22$1 = { class: "corp-name" };
    const _hoisted_23$1 = {
      key: 0,
      class: "alliance-name"
    };
    const _hoisted_24$1 = ["src", "alt"];
    const _sfc_main$4 = /* @__PURE__ */ defineComponent({
      __name: "KillmailCard",
      props: {
        killmail: {},
        isNew: { type: Boolean }
      },
      setup(__props) {
        const props = __props;
        const formattedTime = computed(() => {
          return dayjs(props.killmail.kill_time).format("HH:mm:ss");
        });
        const formattedDate = computed(() => {
          return dayjs(props.killmail.kill_time).format("MMM DD");
        });
        const formattedValue = computed(() => {
          const value = props.killmail.total_value;
          if (value >= 1e9) {
            return `${(value / 1e9).toFixed(2)}B`;
          } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(2)}M`;
          } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(0)}K`;
          } else {
            return value.toLocaleString();
          }
        });
        const valueColor = computed(() => {
          const value = props.killmail.total_value;
          if (value >= 1e9) {
            return "#ff6b35";
          } else if (value >= 1e8) {
            return "#ffd700";
          } else if (value >= 1e7) {
            return "#00d4ff";
          } else {
            return "#ffffff";
          }
        });
        const securityClass = computed(() => {
          const security = props.killmail.security_status;
          if (security === void 0 || security === null) return "unknown";
          if (security >= 0.5) return "highsec";
          if (security > 0) return "lowsec";
          return "nullsec";
        });
        const formattedSecurity = computed(() => {
          const security = props.killmail.security_status;
          if (security === void 0 || security === null) return "Unknown";
          return security.toFixed(1);
        });
        const shouldShowSecurityBadge = computed(() => {
          return props.killmail.security_status !== void 0 && props.killmail.security_status !== null;
        });
        computed(() => {
          return props.killmail.victim_corp_logo || `https://images.evetech.net/corporations/${props.killmail.victim_corp}/logo?size=64`;
        });
        const victimAllianceLogo = computed(() => {
          return props.killmail.victim_alliance_logo || `https://images.evetech.net/alliances/${props.killmail.victim_alliance}/logo?size=64`;
        });
        computed(() => {
          return props.killmail.killer_corp_logo || `https://images.evetech.net/corporations/${props.killmail.killer_corp}/logo?size=64`;
        });
        const killerAllianceLogo = computed(() => {
          return props.killmail.killer_alliance_logo || `https://images.evetech.net/alliances/${props.killmail.killer_alliance}/logo?size=64`;
        });
        const shipImage = computed(() => {
          return `https://images.evetech.net/types/${props.killmail.ship_type_id}/icon?size=64`;
        });
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock("div", {
            class: normalizeClass(["killmail-card", { "killmail-new": _ctx.isNew }])
          }, [
            createBaseVNode("div", _hoisted_1$3, [
              createBaseVNode("div", _hoisted_2$3, [
                createBaseVNode("span", _hoisted_3$3, toDisplayString(_ctx.killmail.system_name), 1),
				shouldShowSecurityBadge.value ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    class: normalizeClass(["security-badge", securityClass.value])
                  }, toDisplayString(formattedSecurity.value), 3)) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_5$3, [
                createBaseVNode("span", {
                  class: "value-amount",
                  style: normalizeStyle({ color: valueColor.value })
                }, toDisplayString(formattedValue.value) + " ISK ", 5)
              ]),
              createBaseVNode("a", {
                href: _ctx.killmail.zkb_url,
                target: "_blank",
                class: "zkb-link",
                title: "View on zKillboard"
              }, " zKB ", 8, _hoisted_6$3)
            ]),
            createBaseVNode("div", _hoisted_7$3, [
              createBaseVNode("div", _hoisted_8$3, [
                createBaseVNode("img", {
                  src: shipImage.value,
                  alt: _ctx.killmail.ship_name,
                  class: "ship-icon",
                  loading: "lazy"
                }, null, 8, _hoisted_9$3),
                createBaseVNode("div", _hoisted_10$3, [
                  createBaseVNode("div", _hoisted_11$2, toDisplayString(_ctx.killmail.ship_name), 1),
				  createBaseVNode("span", _hoisted_4$3, toDisplayString(formattedTime.value) + " • " + toDisplayString(formattedDate.value), 1)
                ])
              ]),
              createBaseVNode("div", _hoisted_12$2, [
                createBaseVNode("div", _hoisted_13$2, [
                  createBaseVNode("img", {
                    src: victimAllianceLogo.value,
                    alt: _ctx.killmail.victim_alliance || _ctx.killmail.victim_corp,
                    class: "alliance-logo",
                    loading: "lazy"
                  }, null, 8, _hoisted_14$2),
                  createBaseVNode("div", _hoisted_15$2, [
                    createBaseVNode("div", _hoisted_16$2, toDisplayString(_ctx.killmail.victim_name), 1),
                    createBaseVNode("div", _hoisted_17$2, toDisplayString(_ctx.killmail.victim_corp), 1),
                    _ctx.killmail.victim_alliance ? (openBlock(), createElementBlock("div", _hoisted_18$1, toDisplayString(_ctx.killmail.victim_alliance), 1)) : createCommentVNode("", true)
                  ])
                ]),
                _cache[0] || (_cache[0] = createBaseVNode("div", { class: "vs-section" }, [
                  createBaseVNode("div", { class: "vs-text" }, "VS")
                ], -1)),
                createBaseVNode("div", _hoisted_19$1, [
                  createBaseVNode("div", _hoisted_20$1, [
                    createBaseVNode("div", _hoisted_21$1, toDisplayString(_ctx.killmail.killer_name), 1),
                    createBaseVNode("div", _hoisted_22$1, toDisplayString(_ctx.killmail.killer_corp), 1),
                    _ctx.killmail.killer_alliance ? (openBlock(), createElementBlock("div", _hoisted_23$1, toDisplayString(_ctx.killmail.killer_alliance), 1)) : createCommentVNode("", true)
                  ]),
                  createBaseVNode("img", {
                    src: killerAllianceLogo.value,
                    alt: _ctx.killmail.killer_alliance || _ctx.killmail.killer_corp,
                    class: "alliance-logo",
                    loading: "lazy"
                  }, null, 8, _hoisted_24$1)
                ])
              ])
            ])
          ], 2);
        };
      }
    });
    const _export_sfc = (sfc, props) => {
      const target = sfc.__vccOpts || sfc;
      for (const [key, val] of props) {
        target[key] = val;
      }
      return target;
    };
    const KillmailCard = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-a115766c"]]);
    const _hoisted_1$2 = {
      key: 0,
      class: "overlay-header"
    };
    const _hoisted_2$2 = { class: "status" };
    const _hoisted_3$2 = { class: "status-text" };
    const _hoisted_4$2 = {
      key: 0,
      class: "monitoring-info"
    };
    const _hoisted_5$2 = {
      key: 1,
      class: "debug-info"
    };
    const _hoisted_6$2 = { class: "killfeed-container" };
    const _hoisted_7$2 = {
      key: 0,
      class: "loading-state"
    };
    const _hoisted_8$2 = {
      key: 1,
      class: "error-state"
    };
    const _hoisted_9$2 = {
      key: 2,
      class: "empty-state"
    };
    const _hoisted_10$2 = {
      key: 1,
      class: "overlay-footer"
    };
    const _sfc_main$3 = /* @__PURE__ */ defineComponent({
      __name: "KillfeedOverlay",
      props: {
        obsMode: { type: Boolean, default: false },
        theme: { default: "dark" },
        maxKills: { default: 50 },
        autoScroll: { type: Boolean, default: true },
        refreshInterval: { default: 10 * 1000 },
        systems: { default: () => [] },
        regions: { default: () => [] }
      },
      setup(__props) {
        const props = __props;
        const killmails = ref([]);
        const newKillIds = ref(/* @__PURE__ */ new Set());
        const loading = ref(true);
        const error = ref(null);
        const lastUpdate = ref(null);
        const refreshTimer = ref(null);
        const debugInfo = ref("");
        const monitoredSystems = ref([]);
        const monitoredRegions = ref([]);
        const displayedKillmails = computed(() => {
          return killmails.value.slice(0, props.maxKills);
        });
        const statusText = computed(() => {
          if (loading.value) return "Loading killmails...";
          if (error.value) return `Error: ${error.value}`;
          if (lastUpdate.value) {
            //const minutes = Math.floor((Date.now() - lastUpdate.value.getTime()));
            return `LIVE`;
          }
          return "No data";
        });


        const monitoringInfo = computed(() => {
          const systemsCount = monitoredSystems.value.length > 0 ? monitoredSystems.value.length : props.systems.length;
          const regionsCount = monitoredRegions.value.length > 0 ? monitoredRegions.value.length : props.regions.length;
          const locations = [];
          if (systemsCount > 0) {
            locations.push(`${systemsCount} system${systemsCount > 1 ? "s" : ""}`);
          }
          if (regionsCount > 0) {
            locations.push(`${regionsCount} region${regionsCount > 1 ? "s" : ""}`);
          }
          if (locations.length === 0) {
            return "No locations monitored";
          }
          return locations.join(" + ");
        });


        function fetchMonitoredLocations() {
          return __async(this, null, function* () {
            try {
              const { systems, regions } = yield killfeedAPI.getMonitoredLocations();
              monitoredSystems.value = systems;
              monitoredRegions.value = regions;
              console.log("Updated monitored locations:", {
                systems: systems.length,
                regions: regions.length
              });
            } catch (error2) {
              console.warn("Failed to fetch monitored locations:", error2);
            }
          });
        }
        function fetchKillmails() {
          return __async(this, null, function* () {
            try {
              loading.value = true;
              error.value = null;
              console.log("=== EVE Killfeed Debug Info ===");
              console.log("Current API URL:", killfeedAPI.baseUrl || "Direct zKillboard");
              console.log("Environment:", "production");
              console.log("Development mode:", false);
              console.log("VITE_WP_API_URL:", void 0);
              const urlParams = new URLSearchParams(window.location.search);
              const apiUrl = urlParams.get("api_url");
              const systems = urlParams.get("systems");
              const regions = urlParams.get("regions");
              if (apiUrl) {
                console.log("API URL from URL params:", apiUrl);
              }
              if (systems) {
                console.log("Systems from URL params:", systems);
              }
              if (regions) {
                console.log("Regions from URL params:", regions);
              }
              debugInfo.value = killfeedAPI.baseUrl === "direct" ? "Fetching directly from zKillboard + ESI" : `Fetching from: ${killfeedAPI.baseUrl}`;
              let systemList = [];
              let regionList = [];
              if (killfeedAPI.baseUrl === "direct") {
                systemList = systems ? systems.split(",").map((s) => s.trim()) : props.systems;
                regionList = regions ? regions.split(",").map((s) => s.trim()) : props.regions;
                console.log("Direct mode: Using URL/prop parameters for systems/regions");
              } else {
                systemList = [];
                regionList = [];
                console.log("WordPress mode: Using backend monitoring configuration (ignoring URL parameters)");
              }
              const newKillmails = yield killfeedAPI.getKillmails(systemList, regionList, props.maxKills);
              
              // Create a NEW constant with the filtered results
              const filteredKillmails = newKillmails.filter((kill) => kill.total_value >= 2.5e5);

              console.log("Received killmails:", newKillmails.length);
              console.log("Number of killmails (after 1M ISK filter):", filteredKillmails.length);

              // Now use 'filteredKillmails' for all subsequent logic
              if (filteredKillmails.length > 0) {
                console.log("Sample killmail:", filteredKillmails[0]);
                const isRealData = filteredKillmails.some(
                  (k) => k.victim_name !== "Unknown Pilot" && k.victim_name !== "Demo Pilot" && !k.victim_name.includes("Test") && !k.victim_name.includes("Pilot #")
                );
                debugInfo.value = isRealData ? `✅ Real data: ${filteredKillmails.length} killmails` : `⚠️ Demo/Limited data: ${filteredKillmails.length} killmails`;
                console.log("Data type:", isRealData ? "REAL DATA" : "DEMO/LIMITED DATA");
              } else {
                debugInfo.value = "❌ No killmails received (or all were < 1M ISK)";
              }
              if (killmails.value.length > 0) {
                const existingIds = new Set(killmails.value.map((k) => k.killmail_id));
                const freshKillIds = /* @__PURE__ */ new Set();
                const newKills = [];
                filteredKillmails.forEach((kill) => {
                  if (!existingIds.has(kill.killmail_id)) {
                    freshKillIds.add(kill.killmail_id);
                    newKills.push(kill);
                  }
                });
              lastUpdate.value = /* @__PURE__ */ new Date();
              console.log("✅ Killmails updated successfully");
            } catch (err) {
              error.value = err instanceof Error ? err.message : "Unknown error";
              debugInfo.value = `❌ Error: ${error.value}`;
              console.error("Failed to fetch killmails:", err);
              if (killmails.value.length === 0) {
                killmails.value = getDemoKillmails();
                debugInfo.value = "🎭 Demo data (API unavailable)";
              }
            } finally {
              loading.value = false;
            }
          });
        }
        function getDemoKillmails() {
          const now = /* @__PURE__ */ new Date();
          return [
            {
              id: 1,
              killmail_id: 127790027,
              system_id: 30000783,
              system_name: "EFM-C4",
              region_name: "A-R00001",
              ship_type_id: 11176,
              ship_name: "Machariel",
              victim_name: "Demo Victim",
              victim_corp: "Demo Corporation",
              victim_alliance: "Demo Alliance",
              victim_corp_logo: "https://images.evetech.net/corporations/1000001/logo?size=64",
              victim_alliance_logo: "https://images.evetech.net/alliances/1000001/logo?size=64",
              killer_name: "Elite Killer",
              killer_corp: "Elite Corp",
              killer_alliance: "Elite Alliance",
              killer_corp_logo: "https://images.evetech.net/corporations/1000002/logo?size=64",
              killer_alliance_logo: "https://images.evetech.net/alliances/1000002/logo?size=64",
              kill_time: new Date(now.getTime() - 3e5).toISOString(),
              // 5 minutes ago
              zkb_url: "https://zkillboard.com/kill/127790027/",
              total_value: 28765e7,
              // 287.65B ISK
              created_at: now.toISOString(),
              security_status: 0.4
            },
            {
              id: 2,
              killmail_id: 127790028,
              system_id: 30002813,
              system_name: "Tama",
              region_name: "Black Rise",
              ship_type_id: 587,
              ship_name: "Rifter",
              victim_name: "Another Pilot",
              victim_corp: "Another Corporation",
              victim_alliance: "",
              victim_corp_logo: "https://images.evetech.net/corporations/1000003/logo?size=64",
              victim_alliance_logo: void 0,
              killer_name: "Skilled Hunter",
              killer_corp: "Hunter Corp",
              killer_alliance: "Hunter Alliance",
              killer_corp_logo: "https://images.evetech.net/corporations/1000004/logo?size=64",
              killer_alliance_logo: "https://images.evetech.net/alliances/1000004/logo?size=64",
              kill_time: new Date(now.getTime() - 6e5).toISOString(),
              // 10 minutes ago
              zkb_url: "https://zkillboard.com/kill/127790028/",
              total_value: 1575e4,
              // 15.75M ISK
              created_at: now.toISOString(),
              security_status: 0.3
            }
          ];
        }
        function startAutoRefresh() {
          if (refreshTimer.timer) {
            clearInterval(refreshTimer.timer);
          }
          console.log(`🔄 Starting auto-refresh with ${props.refreshInterval}ms interval`);
          refreshTimer.timer = setInterval(() => {
            console.log("🔄 Auto-refresh triggered");
            fetchKillmails();
          }, props.refreshInterval);
        }
        function stopAutoRefresh() {
          if (refreshTimer.timer) {
            console.log("⏹️ Stopping auto-refresh");
            clearInterval(refreshTimer.timer);
            refreshTimer.timer = null;
          }
        }
        onMounted(() => {
          console.log("🚀 KillfeedOverlay mounted");
          const urlParams = new URLSearchParams(window.location.search);
          const apiUrl = urlParams.get("api_url");
          const apiKey = urlParams.get("api_key");
          if (apiUrl) {
            killfeedAPI.setConfig(apiUrl, apiKey || "");
          }
          fetchMonitoredLocations();
          fetchKillmails();
          startAutoRefresh();


          // Uncommented as OBS never calls "focus"
        //   window.addEventListener("focus", () => {
        //     console.log("🎯 Window focused - fetching fresh data");
        //     fetchKillmails();
        //     if (!refreshTimer.timer) {
        //       startAutoRefresh();
        //     }
        //   });

          
          window.addEventListener("blur", () => {
            console.log("🌫️ Window blurred");
          });
        });
        onUnmounted(() => {
          console.log("🛑 KillfeedOverlay unmounted");
          stopAutoRefresh();
          document.removeEventListener("visibilitychange", () => {
          });
          window.removeEventListener("focus", () => {
          });
          window.removeEventListener("blur", () => {
          });
        });
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock("div", {
            class: normalizeClass(["killfeed-overlay", {
              "obs-mode": _ctx.obsMode,
              "theme-light": _ctx.theme === "light",
              "theme-dark": _ctx.theme === "dark"
            }])
          }, [
            !_ctx.obsMode ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
              _cache[0] || (_cache[0] = createBaseVNode("h1", { class: "title" }, "EVE Online Killfeed", -1)),
              createBaseVNode("div", _hoisted_2$2, [
                createBaseVNode("div", {
                  class: normalizeClass(["status-indicator", { "online": !loading.value && !error.value }])
                }, null, 2),
                createBaseVNode("span", _hoisted_3$2, toDisplayString(statusText.value), 1)
              ]),
              monitoringInfo.value ? (openBlock(), createElementBlock("div", _hoisted_4$2, " Monitoring: " + toDisplayString(monitoringInfo.value), 1)) : createCommentVNode("", true),
              debugInfo.value ? (openBlock(), createElementBlock("div", _hoisted_5$2, toDisplayString(debugInfo.value), 1)) : createCommentVNode("", true)
            ])) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_6$2, [
              loading.value && killmails.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_7$2, _cache[1] || (_cache[1] = [
                createBaseVNode("div", { class: "loading-spinner" }, null, -1),
                createBaseVNode("p", null, "Loading killmails from zKillboard...", -1)
              ]))) : error.value && killmails.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_8$2, [
                createBaseVNode("p", null, toDisplayString(error.value), 1),
                createBaseVNode("button", {
                  onClick: fetchKillmails,
                  class: "retry-button"
                }, " Retry ")
              ])) : killmails.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_9$2, _cache[2] || (_cache[2] = [
                createBaseVNode("p", null, "No killmails found in the last 24 hours.", -1)
              ]))) : (openBlock(), createElementBlock("div", {
                key: 3,
                class: normalizeClass(["killmail-list", { "auto-scroll": _ctx.autoScroll }])
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(displayedKillmails.value, (killmail) => {
                  return openBlock(), createBlock(KillmailCard, {
                    key: killmail.killmail_id,
                    killmail,
                    "is-new": newKillIds.value.has(killmail.killmail_id)
                  }, null, 8, ["killmail", "is-new"]);
                }), 128))
              ], 2))
            ]),
            !_ctx.obsMode ? (openBlock(), createElementBlock("div", _hoisted_10$2, _cache[3] || (_cache[3] = [
              createBaseVNode("p", { class: "footer-text" }, [
                createTextVNode(" Powered by zKillboard • "),
                createBaseVNode("a", {
                  href: "https://zkillboard.com",
                  target: "_blank"
                }, "zkillboard.com")
              ], -1)
            ]))) : createCommentVNode("", true)
          ], 2);
        };
      }
    });
    const KillfeedOverlay = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-3ec1cf86"]]);
    const _hoisted_1$1 = { class: "test-interface" };
    const _hoisted_2$1 = { class: "test-section" };
    const _hoisted_3$1 = { class: "test-controls" };
    const _hoisted_4$1 = ["disabled"];
    const _hoisted_5$1 = { class: "test-section" };
    const _hoisted_6$1 = { class: "test-controls" };
    const _hoisted_7$1 = ["disabled"];
    const _hoisted_8$1 = {
      key: 1,
      class: "results"
    };
    const _hoisted_9$1 = { class: "killmail-header" };
    const _hoisted_10$1 = { class: "system-name" };
    const _hoisted_11$1 = { class: "kill-value" };
    const _hoisted_12$1 = { class: "kill-details" };
    const _hoisted_13$1 = ["href"];
    const _hoisted_14$1 = { class: "test-section" };
    const _hoisted_15$1 = { class: "log-container" };
    const _hoisted_16$1 = { class: "log-timestamp" };
    const _hoisted_17$1 = { class: "log-message" };
    const _sfc_main$2 = /* @__PURE__ */ defineComponent({
      __name: "TestInterface",
      setup(__props) {
        const testApiUrl = ref("");
        const testApiKey = ref("");
        const testSystems = ref("EFM-C4,Jita");
        const testing = ref(false);
        const fetching = ref(false);
        const connectionStatus = ref(null);
        const fetchStatus = ref(null);
        const testKillmails = ref([]);
        const testLog = ref([]);
        onMounted(() => {
          testApiUrl.value = "https://mind1official.com/wp-json/eve-killfeed/v1";
          log("info", "Test system initialized");
        });
        function log(level, message) {
          const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
          testLog.value.push({ timestamp, level, message });
          if (testLog.value.length > 50) {
            testLog.value = testLog.value.slice(-50);
          }
        }
        function testConnection() {
          return __async(this, null, function* () {
            var _a, _b;
            if (!testApiUrl.value.trim()) {
              connectionStatus.value = { type: "error", message: "Please enter an API URL" };
              return;
            }
            testing.value = true;
            connectionStatus.value = null;
            log("info", `Testing connection to: ${testApiUrl.value}`);
            try {
              const headers = {
                "Content-Type": "application/json"
              };
              if (testApiKey.value.trim()) {
                headers["Authorization"] = `Bearer ${testApiKey.value.trim()}`;
              }
              const response = yield axios.get(`${testApiUrl.value}/status`, {
                headers,
                timeout: 1e4
              });
              if (response.data.success) {
                connectionStatus.value = {
                  type: "success",
                  message: `✅ Connection successful! Version: ${response.data.data.version}, Systems: ${response.data.data.monitored_systems.length}`
                };
                log("success", "API connection successful");
                log("info", `Monitored systems: ${response.data.data.monitored_systems.join(", ")}`);
              } else {
                connectionStatus.value = {
                  type: "error",
                  message: `❌ API Error: ${response.data.message || "Unknown error"}`
                };
                log("error", `API returned error: ${response.data.message}`);
              }
            } catch (error) {
              const errorMessage = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || error.message || "Unknown error";
              connectionStatus.value = {
                type: "error",
                message: `❌ Connection failed: ${errorMessage}`
              };
              log("error", `Connection failed: ${errorMessage}`);
            } finally {
              testing.value = false;
            }
          });
        }
        function fetchTestKillmails() {
          return __async(this, null, function* () {
            var _a, _b;
            if (!testApiUrl.value.trim()) {
              fetchStatus.value = { type: "error", message: "Please test the API connection first" };
              return;
            }
            if (!testSystems.value.trim()) {
              fetchStatus.value = { type: "error", message: "Please enter systems to test" };
              return;
            }
            fetching.value = true;
            fetchStatus.value = null;
            testKillmails.value = [];
            log("info", `Fetching killmails for systems: ${testSystems.value}`);
            try {
              const headers = {
                "Content-Type": "application/json"
              };
              if (testApiKey.value.trim()) {
                headers["Authorization"] = `Bearer ${testApiKey.value.trim()}`;
              }
              const params = {
                systems: testSystems.value,
                limit: "20",
                hours: "24"
              };
              const response = yield axios.get(`${testApiUrl.value}/killmails`, {
                headers,
                params,
                timeout: 15e3
              });
              if (response.data.success) {
                const killmails = response.data.data;
                if (killmails.length > 0) {
                  fetchStatus.value = {
                    type: "success",
                    message: `✅ Found ${killmails.length} killmails (Total: ${response.data.total})`
                  };
                  testKillmails.value = killmails;
                  log("success", `Successfully fetched ${killmails.length} killmails`);
                } else {
                  fetchStatus.value = {
                    type: "info",
                    message: "No killmails found for the specified systems"
                  };
                  log("info", "No killmails found");
                }
              } else {
                fetchStatus.value = {
                  type: "error",
                  message: `❌ API Error: ${response.data.message || "Unknown error"}`
                };
                log("error", `Killmail fetch failed: ${response.data.message}`);
              }
            } catch (error) {
              const errorMessage = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || error.message || "Unknown error";
              fetchStatus.value = {
                type: "error",
                message: `❌ Fetch failed: ${errorMessage}`
              };
              log("error", `Killmail fetch failed: ${errorMessage}`);
            } finally {
              fetching.value = false;
            }
          });
        }
        function clearResults() {
          testKillmails.value = [];
          fetchStatus.value = null;
          log("info", "Results cleared");
        }
        function formatISK(value) {
          if (value >= 1e9) {
            return `${(value / 1e9).toFixed(2)}B`;
          } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(2)}M`;
          } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(0)}K`;
          } else {
            return value.toLocaleString();
          }
        }
        function formatTime(timeString) {
          return new Date(timeString).toLocaleTimeString();
        }
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock("div", _hoisted_1$1, [
            _cache[7] || (_cache[7] = createBaseVNode("div", { class: "header" }, [
              createBaseVNode("h1", null, "EVE Killfeed Test System"),
              createBaseVNode("p", null, "Test the WordPress API connection and killfeed functionality")
            ], -1)),
            createBaseVNode("div", _hoisted_2$1, [
              _cache[3] || (_cache[3] = createBaseVNode("h2", null, "API Configuration", -1)),
              createBaseVNode("div", _hoisted_3$1, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => testApiUrl.value = $event),
                  placeholder: "WordPress API URL (e.g., https://mind1official.com/wp-json/eve-killfeed/v1)"
                }, null, 512), [
                  [vModelText, testApiUrl.value]
                ]),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => testApiKey.value = $event),
                  placeholder: "API Key (optional)"
                }, null, 512), [
                  [vModelText, testApiKey.value]
                ]),
                createBaseVNode("button", {
                  onClick: testConnection,
                  disabled: testing.value
                }, toDisplayString(testing.value ? "Testing..." : "Test Connection"), 9, _hoisted_4$1)
              ]),
              connectionStatus.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["status", connectionStatus.value.type])
              }, toDisplayString(connectionStatus.value.message), 3)) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_5$1, [
              _cache[5] || (_cache[5] = createBaseVNode("h2", null, "Killmail Fetch Test", -1)),
              createBaseVNode("div", _hoisted_6$1, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => testSystems.value = $event),
                  placeholder: "Systems to test (comma-separated, e.g., EFM-C4,Jita)"
                }, null, 512), [
                  [vModelText, testSystems.value]
                ]),
                createBaseVNode("button", {
                  onClick: fetchTestKillmails,
                  disabled: fetching.value
                }, toDisplayString(fetching.value ? "Fetching..." : "Fetch Killmails"), 9, _hoisted_7$1),
                createBaseVNode("button", { onClick: clearResults }, "Clear Results")
              ]),
              fetchStatus.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["status", fetchStatus.value.type])
              }, toDisplayString(fetchStatus.value.message), 3)) : createCommentVNode("", true),
              testKillmails.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(testKillmails.value, (kill) => {
                  return openBlock(), createElementBlock("div", {
                    key: kill.killmail_id,
                    class: "killmail-item"
                  }, [
                    createBaseVNode("div", _hoisted_9$1, [
                      createBaseVNode("span", _hoisted_10$1, toDisplayString(kill.system_name), 1),
                      createBaseVNode("span", _hoisted_11$1, toDisplayString(formatISK(kill.total_value)) + " ISK", 1)
                    ]),
                    createBaseVNode("div", _hoisted_12$1, [
                      createTextVNode(toDisplayString(formatTime(kill.kill_time)) + " - " + toDisplayString(kill.victim_name) + " (" + toDisplayString(kill.ship_name) + ") killed by " + toDisplayString(kill.killer_name) + " ", 1),
                      _cache[4] || (_cache[4] = createBaseVNode("br", null, null, -1)),
                      createBaseVNode("a", {
                        href: kill.zkb_url,
                        target: "_blank"
                      }, "View on zKillboard", 8, _hoisted_13$1)
                    ])
                  ]);
                }), 128))
              ])) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_14$1, [
              _cache[6] || (_cache[6] = createBaseVNode("h2", null, "Test Log", -1)),
              createBaseVNode("div", _hoisted_15$1, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(testLog.value, (entry, index) => {
                  return openBlock(), createElementBlock("div", {
                    key: index,
                    class: "log-entry"
                  }, [
                    createBaseVNode("span", _hoisted_16$1, toDisplayString(entry.timestamp), 1),
                    createBaseVNode("span", {
                      class: normalizeClass(["log-level", entry.level])
                    }, toDisplayString(entry.level.toUpperCase()), 3),
                    createBaseVNode("span", _hoisted_17$1, toDisplayString(entry.message), 1)
                  ]);
                }), 128))
              ])
            ])
          ]);
        };
      }
    });
    const TestInterface = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-1a435087"]]);
    const _hoisted_1 = { class: "api-test-interface" };
    const _hoisted_2 = { class: "test-section" };
    const _hoisted_3 = { class: "test-controls" };
    const _hoisted_4 = ["disabled"];
    const _hoisted_5 = ["disabled"];
    const _hoisted_6 = {
      key: 1,
      class: "results"
    };
    const _hoisted_7 = { class: "result-header" };
    const _hoisted_8 = { class: "system-name" };
    const _hoisted_9 = { class: "result-details" };
    const _hoisted_10 = { key: 0 };
    const _hoisted_11 = { class: "test-section" };
    const _hoisted_12 = { class: "test-controls" };
    const _hoisted_13 = ["disabled"];
    const _hoisted_14 = ["disabled"];
    const _hoisted_15 = {
      key: 1,
      class: "results"
    };
    const _hoisted_16 = { class: "killmail-header" };
    const _hoisted_17 = { class: "system-name" };
    const _hoisted_18 = { class: "kill-value" };
    const _hoisted_19 = { class: "kill-details" };
    const _hoisted_20 = ["href"];
    const _hoisted_21 = { class: "test-section" };
    const _hoisted_22 = { class: "test-controls" };
    const _hoisted_23 = ["disabled"];
    const _hoisted_24 = {
      key: 1,
      class: "results"
    };
    const _hoisted_25 = { class: "killmail-header" };
    const _hoisted_26 = { class: "system-name" };
    const _hoisted_27 = { class: "kill-value" };
    const _hoisted_28 = { class: "kill-details" };
    const _hoisted_29 = ["href"];
    const _hoisted_30 = { class: "test-section" };
    const _hoisted_31 = { class: "log-container" };
    const _hoisted_32 = { class: "log-timestamp" };
    const _hoisted_33 = { class: "log-message" };
    const _sfc_main$1 = /* @__PURE__ */ defineComponent({
      __name: "ApiTestInterface",
      setup(__props) {
        const systemSearchQuery = ref("EFM-C4");
        const zkbSystemId = ref("30000783");
        const combinedSystemName = ref("EFM-C4");
        const esiTesting = ref(false);
        const zkbTesting = ref(false);
        const combinedTesting = ref(false);
        const esiStatus = ref(null);
        const zkbStatus = ref(null);
        const combinedStatus = ref(null);
        const esiResults = ref([]);
        const zkbResults = ref([]);
        const combinedResults = ref([]);
        const testLog = ref([]);
        const knownSystems = {
          "jita": 30000142,
          "amarr": 30002187,
          "dodixie": 30002659,
          "rens": 30002510,
          "hek": 30000144,
          "perimeter": 30045349,
          "efm-c4": 30000783,
          "tama": 30002813,
          "amamake": 30002537,
          "rancer": 30001372,
          "uedama": 30000210,
          "niarja": 30002505
        };
        onMounted(() => {
          log("info", "API Test System initialized");
          log("info", "Testing ESI and zKillboard API connections");
        });
        function log(level, message) {
          const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
          testLog.value.push({ timestamp, level, message });
          if (testLog.value.length > 100) {
            testLog.value = testLog.value.slice(-100);
          }
        }
        function clearLog() {
          testLog.value = [];
          log("info", "Log cleared");
        }
        function testESIStatus() {
          return __async(this, null, function* () {
            esiTesting.value = true;
            esiStatus.value = null;
            log("info", "Testing ESI API status...");
            try {
              const response = yield axios.get("https://esi.evetech.net/latest/status/", {
                timeout: 1e4
              });
              esiStatus.value = {
                type: "success",
                message: `✅ ESI API is online. Players: ${response.data.players}, Server version: ${response.data.server_version}`
              };
              log("success", `ESI API status: ${response.data.players} players online`);
            } catch (error) {
              esiStatus.value = {
                type: "error",
                message: `❌ ESI API failed: ${error.message}`
              };
              log("error", `ESI API status failed: ${error.message}`);
            } finally {
              esiTesting.value = false;
            }
          });
        }
        function testESISearch() {
          return __async(this, null, function* () {
            if (!systemSearchQuery.value.trim()) {
              esiStatus.value = { type: "error", message: "Please enter a system name" };
              return;
            }
            esiTesting.value = true;
            esiStatus.value = null;
            esiResults.value = [];
            const query = systemSearchQuery.value.trim();
            log("info", `Searching ESI for system: ${query}`);
            try {
              const knownId = knownSystems[query.toLowerCase()];
              if (knownId) {
                log("info", `Found known system ID: ${knownId} for ${query}`);
                const systemResponse = yield axios.get(`https://esi.evetech.net/latest/universe/systems/${knownId}/`, {
                  timeout: 1e4
                });
                esiResults.value = [{
                  id: knownId,
                  name: systemResponse.data.name,
                  security: systemResponse.data.security_status,
                  constellation_id: systemResponse.data.constellation_id
                }];
                esiStatus.value = {
                  type: "success",
                  message: `✅ Found known system: ${systemResponse.data.name} (ID: ${knownId})`
                };
                log("success", `ESI system lookup successful for known system`);
                return;
              }
              const searchResponse = yield axios.get("https://esi.evetech.net/latest/search/", {
                params: {
                  categories: "solar_system",
                  search: query,
                  strict: false
                },
                timeout: 1e4
              });
              if (searchResponse.data.solar_system && searchResponse.data.solar_system.length > 0) {
                const systemIds = searchResponse.data.solar_system.slice(0, 5);
                const systems = [];
                log("info", `ESI search found ${searchResponse.data.solar_system.length} systems`);
                for (const systemId of systemIds) {
                  try {
                    const systemResponse = yield axios.get(`https://esi.evetech.net/latest/universe/systems/${systemId}/`);
                    systems.push({
                      id: systemId,
                      name: systemResponse.data.name,
                      security: systemResponse.data.security_status,
                      constellation_id: systemResponse.data.constellation_id
                    });
                    log("info", `Got system details: ${systemResponse.data.name} (${systemId})`);
                  } catch (e) {
                    log("error", `Failed to get details for system ${systemId}: ${e.message}`);
                  }
                }
                esiResults.value = systems;
                esiStatus.value = {
                  type: "success",
                  message: `✅ Found ${systems.length} systems matching "${query}"`
                };
                log("success", `ESI search completed: ${systems.length} systems found`);
              } else {
                esiStatus.value = {
                  type: "info",
                  message: `No systems found matching "${query}"`
                };
                log("info", `No ESI search results for "${query}"`);
              }
            } catch (error) {
              esiStatus.value = {
                type: "error",
                message: `❌ ESI search failed: ${error.message}`
              };
              log("error", `ESI search failed: ${error.message}`);
            } finally {
              esiTesting.value = false;
            }
          });
        }
        function testZKBStatus() {
          return __async(this, null, function* () {
            zkbTesting.value = true;
            zkbStatus.value = null;
            log("info", "Testing zKillboard API status...");
            try {
              const response = yield axios.get("https://zkillboard.com/api/stats/", {
                timeout: 15e3,
              });
              zkbStatus.value = {
                type: "success",
                message: `✅ zKillboard API is responding`
              };
              log("success", "zKillboard API status check successful");
            } catch (error) {
              zkbStatus.value = {
                type: "error",
                message: `❌ zKillboard API failed: ${error.message}`
              };
              log("error", `zKillboard API status failed: ${error.message}`);
            } finally {
              zkbTesting.value = false;
            }
          });
        }
        function testZKillboard() {
          return __async(this, null, function* () {
            if (!zkbSystemId.value.trim()) {
              zkbStatus.value = { type: "error", message: "Please enter a system ID" };
              return;
            }
            zkbTesting.value = true;
            zkbStatus.value = null;
            zkbResults.value = [];
            const systemId = zkbSystemId.value.trim();
            log("info", `Fetching killmails from zKillboard for system ID: ${systemId}`);
            try {
              const response = yield axios.get(`https://zkillboard.com/api/kills/solarSystemID/${systemId}/`, {
                timeout: 15e3,
              });
              if (Array.isArray(response.data) && response.data.length > 0) {
                const killmails = response.data.slice(0, 10);
                zkbResults.value = killmails;
                zkbStatus.value = {
                  type: "success",
                  message: `✅ Found ${response.data.length} killmails (showing first 10)`
                };
                log("success", `zKillboard fetch successful: ${response.data.length} killmails found`);
                killmails.forEach((kill, index) => {
                  var _a;
                  const value = ((_a = kill.zkb) == null ? void 0 : _a.totalValue) || 0;
                  log("info", `Killmail ${index + 1}: ID ${kill.killmail_id}, Value: ${formatISK(value)} ISK`);
                });
              } else {
                zkbStatus.value = {
                  type: "info",
                  message: `No killmails found for system ID ${systemId}`
                };
                log("info", `No killmails found for system ${systemId}`);
              }
            } catch (error) {
              zkbStatus.value = {
                type: "error",
                message: `❌ zKillboard fetch failed: ${error.message}`
              };
              log("error", `zKillboard fetch failed: ${error.message}`);
            } finally {
              zkbTesting.value = false;
            }
          });
        }
        function testCombinedFlow() {
          return __async(this, null, function* () {
            if (!combinedSystemName.value.trim()) {
              combinedStatus.value = { type: "error", message: "Please enter a system name" };
              return;
            }
            combinedTesting.value = true;
            combinedStatus.value = null;
            combinedResults.value = [];
            const systemName = combinedSystemName.value.trim();
            log("info", `Starting combined flow test for: ${systemName}`);
            try {
              let systemId = null;
              systemId = knownSystems[systemName.toLowerCase()] || null;
              if (systemId) {
                log("success", `Step 1: Found known system ID ${systemId} for ${systemName}`);
              } else {
                log("info", "Step 1: Searching ESI for system ID...");
                const searchResponse = yield axios.get("https://esi.evetech.net/latest/search/", {
                  params: {
                    categories: "solar_system",
                    search: systemName,
                    strict: false
                  },
                  timeout: 1e4
                });
                if (searchResponse.data.solar_system && searchResponse.data.solar_system.length > 0) {
                  systemId = searchResponse.data.solar_system[0];
                  log("success", `Step 1: ESI found system ID ${systemId} for ${systemName}`);
                } else {
                  throw new Error(`System "${systemName}" not found in ESI`);
                }
              }
              log("info", `Step 2: Fetching killmails from zKillboard for system ${systemId}...`);
              const zkbResponse = yield axios.get(`https://zkillboard.com/api/kills/solarSystemID/${systemId}/`, {
                timeout: 15e3,
              });
              if (Array.isArray(zkbResponse.data) && zkbResponse.data.length > 0) {
                const killmails = zkbResponse.data.slice(0, 5);
                combinedResults.value = killmails;
                combinedStatus.value = {
                  type: "success",
                  message: `✅ Complete flow successful! Found ${zkbResponse.data.length} killmails for ${systemName}`
                };
                log("success", `Step 2: Found ${zkbResponse.data.length} killmails`);
                log("success", `Combined flow completed successfully for ${systemName}`);
              } else {
                combinedStatus.value = {
                  type: "info",
                  message: `Flow completed but no killmails found for ${systemName}`
                };
                log("info", `Step 2: No killmails found for ${systemName}`);
              }
            } catch (error) {
              combinedStatus.value = {
                type: "error",
                message: `❌ Combined flow failed: ${error.message}`
              };
              log("error", `Combined flow failed: ${error.message}`);
            } finally {
              combinedTesting.value = false;
            }
          });
        }
        function formatISK(value) {
          if (value >= 1e9) {
            return `${(value / 1e9).toFixed(2)}B`;
          } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(2)}M`;
          } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(0)}K`;
          } else {
            return value.toLocaleString();
          }
        }
        function getSecurityClass(security) {
          if (security === void 0) return "unknown";
          if (security >= 0.5) return "highsec";
          if (security > 0) return "lowsec";
          return "nullsec";
        }
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock("div", _hoisted_1, [
            _cache[12] || (_cache[12] = createBaseVNode("div", { class: "header" }, [
              createBaseVNode("h1", null, "EVE API Test System"),
              createBaseVNode("p", null, "Test ESI and zKillboard API connections directly")
            ], -1)),
            createBaseVNode("div", _hoisted_2, [
              _cache[4] || (_cache[4] = createBaseVNode("h2", null, "🔍 ESI API Test", -1)),
              createBaseVNode("div", _hoisted_3, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => systemSearchQuery.value = $event),
                  placeholder: "Search for system (e.g., Jita, EFM-C4)",
                  onKeyup: withKeys(testESISearch, ["enter"])
                }, null, 544), [
                  [vModelText, systemSearchQuery.value]
                ]),
                createBaseVNode("button", {
                  onClick: testESISearch,
                  disabled: esiTesting.value
                }, toDisplayString(esiTesting.value ? "Searching..." : "Test ESI Search"), 9, _hoisted_4),
                createBaseVNode("button", {
                  onClick: testESIStatus,
                  disabled: esiTesting.value
                }, toDisplayString(esiTesting.value ? "Testing..." : "Test ESI Status"), 9, _hoisted_5)
              ]),
              esiStatus.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["status", esiStatus.value.type])
              }, toDisplayString(esiStatus.value.message), 3)) : createCommentVNode("", true),
              esiResults.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_6, [
                _cache[3] || (_cache[3] = createBaseVNode("h3", null, "ESI Search Results:", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(esiResults.value, (system) => {
                  var _a;
                  return openBlock(), createElementBlock("div", {
                    key: system.id,
                    class: "result-item"
                  }, [
                    createBaseVNode("div", _hoisted_7, [
                      createBaseVNode("span", _hoisted_8, toDisplayString(system.name), 1),
                      createBaseVNode("span", {
                        class: normalizeClass(["security", getSecurityClass(system.security)])
                      }, " Sec: " + toDisplayString(((_a = system.security) == null ? void 0 : _a.toFixed(1)) || "Unknown"), 3)
                    ]),
                    createBaseVNode("div", _hoisted_9, [
                      createTextVNode(" System ID: " + toDisplayString(system.id) + " ", 1),
                      system.constellation_id ? (openBlock(), createElementBlock("span", _hoisted_10, " • Constellation: " + toDisplayString(system.constellation_id), 1)) : createCommentVNode("", true)
                    ])
                  ]);
                }), 128))
              ])) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_11, [
              _cache[7] || (_cache[7] = createBaseVNode("h2", null, "⚔️ zKillboard API Test", -1)),
              createBaseVNode("div", _hoisted_12, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => zkbSystemId.value = $event),
                  placeholder: "System ID (e.g., 30000142 for Jita, 30000783 for EFM-C4)"
                }, null, 512), [
                  [vModelText, zkbSystemId.value]
                ]),
                createBaseVNode("button", {
                  onClick: testZKillboard,
                  disabled: zkbTesting.value
                }, toDisplayString(zkbTesting.value ? "Fetching..." : "Test zKillboard"), 9, _hoisted_13),
                createBaseVNode("button", {
                  onClick: testZKBStatus,
                  disabled: zkbTesting.value
                }, toDisplayString(zkbTesting.value ? "Testing..." : "Test zKB Status"), 9, _hoisted_14)
              ]),
              zkbStatus.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["status", zkbStatus.value.type])
              }, toDisplayString(zkbStatus.value.message), 3)) : createCommentVNode("", true),
              zkbResults.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_15, [
                _cache[6] || (_cache[6] = createBaseVNode("h3", null, "zKillboard Results:", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(zkbResults.value, (kill) => {
                  var _a;
                  return openBlock(), createElementBlock("div", {
                    key: kill.killmail_id,
                    class: "killmail-item"
                  }, [
                    createBaseVNode("div", _hoisted_16, [
                      createBaseVNode("span", _hoisted_17, "Killmail ID: " + toDisplayString(kill.killmail_id), 1),
                      createBaseVNode("span", _hoisted_18, toDisplayString(formatISK(((_a = kill.zkb) == null ? void 0 : _a.totalValue) || 0)) + " ISK", 1)
                    ]),
                    createBaseVNode("div", _hoisted_19, [
                      createTextVNode(" Time: " + toDisplayString(new Date(kill.killmail_time || Date.now()).toLocaleString()) + " ", 1),
                      _cache[5] || (_cache[5] = createBaseVNode("br", null, null, -1)),
                      createBaseVNode("a", {
                        href: `https://zkillboard.com/kill/${kill.killmail_id}/`,
                        target: "_blank"
                      }, " View on zKillboard ", 8, _hoisted_20)
                    ])
                  ]);
                }), 128))
              ])) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_21, [
              _cache[10] || (_cache[10] = createBaseVNode("h2", null, "🔗 Combined API Test", -1)),
              createBaseVNode("div", _hoisted_22, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => combinedSystemName.value = $event),
                  placeholder: "System name (e.g., EFM-C4)"
                }, null, 512), [
                  [vModelText, combinedSystemName.value]
                ]),
                createBaseVNode("button", {
                  onClick: testCombinedFlow,
                  disabled: combinedTesting.value
                }, toDisplayString(combinedTesting.value ? "Testing..." : "Test Full Flow"), 9, _hoisted_23)
              ]),
              combinedStatus.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["status", combinedStatus.value.type])
              }, toDisplayString(combinedStatus.value.message), 3)) : createCommentVNode("", true),
              combinedResults.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_24, [
                _cache[9] || (_cache[9] = createBaseVNode("h3", null, "Combined Results:", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(combinedResults.value, (kill) => {
                  var _a;
                  return openBlock(), createElementBlock("div", {
                    key: kill.killmail_id,
                    class: "killmail-item"
                  }, [
                    createBaseVNode("div", _hoisted_25, [
                      createBaseVNode("span", _hoisted_26, toDisplayString(combinedSystemName.value), 1),
                      createBaseVNode("span", _hoisted_27, toDisplayString(formatISK(((_a = kill.zkb) == null ? void 0 : _a.totalValue) || 0)) + " ISK", 1)
                    ]),
                    createBaseVNode("div", _hoisted_28, [
                      createTextVNode(" Killmail: " + toDisplayString(kill.killmail_id) + " • Time: " + toDisplayString(new Date(kill.killmail_time || Date.now()).toLocaleString()) + " ", 1),
                      _cache[8] || (_cache[8] = createBaseVNode("br", null, null, -1)),
                      createBaseVNode("a", {
                        href: `https://zkillboard.com/kill/${kill.killmail_id}/`,
                        target: "_blank"
                      }, " View on zKillboard ", 8, _hoisted_29)
                    ])
                  ]);
                }), 128))
              ])) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_30, [
              _cache[11] || (_cache[11] = createBaseVNode("h2", null, "📋 Test Log", -1)),
              createBaseVNode("div", _hoisted_31, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(testLog.value, (entry, index) => {
                  return openBlock(), createElementBlock("div", {
                    key: index,
                    class: "log-entry"
                  }, [
                    createBaseVNode("span", _hoisted_32, toDisplayString(entry.timestamp), 1),
                    createBaseVNode("span", {
                      class: normalizeClass(["log-level", entry.level])
                    }, toDisplayString(entry.level.toUpperCase()), 3),
                    createBaseVNode("span", _hoisted_33, toDisplayString(entry.message), 1)
                  ]);
                }), 128))
              ]),
              createBaseVNode("button", {
                onClick: clearLog,
                class: "clear-log-btn"
              }, "Clear Log")
            ])
          ]);
        };
      }
    });
    const ApiTestInterface = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-eb7186e5"]]);
    const _sfc_main = /* @__PURE__ */ defineComponent({
      __name: "App",
      setup(__props) {
        const obsMode = ref(false);
        const theme = ref("dark");
        const maxKills = ref(50);
        const autoScroll = ref(true);
        const testMode = ref(false);
        const apiTestMode = ref(false);
        const systems = ref([]);
        const regions = ref([]);
        onMounted(() => {
          const urlParams = new URLSearchParams(window.location.search);
          obsMode.value = urlParams.get("obs") === "1";
          theme.value = urlParams.get("theme") === "light" ? "light" : "dark";
          testMode.value = urlParams.get("test") === "1";
          apiTestMode.value = urlParams.get("apitest") === "1";

          // Only debug if ?debug=1 is present on the url
          const isDebugMode = urlParams.get("debug") === "1";
          if ( !isDebugMode) return;

          const systemsParam = urlParams.get("systems");
          if (systemsParam) {
            systems.value = systemsParam.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
          }
          const regionsParam = urlParams.get("regions");
          if (regionsParam) {
            regions.value = regionsParam.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
          }
          if (systems.value.length === 0 && regions.value.length === 0) {
            systems.value = ["EFM-C4", "Jita", "Tama"];
          }
          const maxKillsParam = urlParams.get("max_kills");
          if (maxKillsParam) {
            maxKills.value = parseInt(maxKillsParam, 10) || 50;
          }
          const autoScrollParam = urlParams.get("auto_scroll");
          if (autoScrollParam) {
            autoScroll.value = autoScrollParam !== "0";
          }
          if (apiTestMode.value) {
            document.title = "EVE Killfeed - API Test System";
          } else if (testMode.value) {
            document.title = "EVE Killfeed - Test System";
          } else {
            const locationList = [...systems.value, ...regions.value].join(", ");
            document.title = obsMode.value ? `EVE Killfeed - ${locationList}` : `EVE Online Killfeed - ${locationList}`;
          }
        });
        return (_ctx, _cache) => {
          return apiTestMode.value ? (openBlock(), createBlock(ApiTestInterface, { key: 0 })) : testMode.value ? (openBlock(), createBlock(TestInterface, { key: 1 })) : (openBlock(), createBlock(KillfeedOverlay, {
            key: 2,
            "obs-mode": obsMode.value,
            theme: theme.value,
            "max-kills": maxKills.value,
            "auto-scroll": autoScroll.value,
            systems: systems.value,
            regions: regions.value
          }, null, 8, ["obs-mode", "theme", "max-kills", "auto-scroll", "systems", "regions"]));
        };
      }
    });
    var relativeTime$1 = { exports: {} };
    (function(module2, exports2) {
      !function(r, e) {
        module2.exports = e();
      }(commonjsGlobal, function() {
        return function(r, e, t) {
          r = r || {};
          var n = e.prototype, o = { future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years" };
          function i(r2, e2, t2, o2) {
            return n.fromToBase(r2, e2, t2, o2);
          }
          t.en.relativeTime = o, n.fromToBase = function(e2, n2, i2, d2, u) {
            for (var f, a, s, l = i2.$locale().relativeTime || o, h = r.thresholds || [{ l: "s", r: 44, d: "second" }, { l: "m", r: 89 }, { l: "mm", r: 44, d: "minute" }, { l: "h", r: 89 }, { l: "hh", r: 21, d: "hour" }, { l: "d", r: 35 }, { l: "dd", r: 25, d: "day" }, { l: "M", r: 45 }, { l: "MM", r: 10, d: "month" }, { l: "y", r: 17 }, { l: "yy", d: "year" }], m = h.length, c = 0; c < m; c += 1) {
              var y = h[c];
              y.d && (f = d2 ? t(e2).diff(i2, y.d, true) : i2.diff(e2, y.d, true));
              var p2 = (r.rounding || Math.round)(Math.abs(f));
              if (s = f > 0, p2 <= y.r || !y.r) {
                p2 <= 1 && c > 0 && (y = h[c - 1]);
                var v = l[y.l];
                u && (p2 = u("" + p2)), a = "string" == typeof v ? v.replace("%d", p2) : v(p2, n2, y.l, s);
                break;
              }
            }
            if (n2) return a;
            var M = s ? l.future : l.past;
            return "function" == typeof M ? M(a) : M.replace("%s", a);
          }, n.to = function(r2, e2) {
            return i(r2, e2, this, true);
          }, n.from = function(r2, e2) {
            return i(r2, e2, this);
          };
          var d = function(r2) {
            return r2.$u ? t.utc() : t();
          };
          n.toNow = function(r2) {
            return this.to(d(this), r2);
          }, n.fromNow = function(r2) {
            return this.from(d(this), r2);
          };
        };
      });
    })(relativeTime$1);
    var relativeTimeExports = relativeTime$1.exports;
    const relativeTime = /* @__PURE__ */ getDefaultExportFromCjs(relativeTimeExports);
    dayjs.extend(relativeTime);
    createApp(_sfc_main).mount("#app");
  }
});
export default require_main();
