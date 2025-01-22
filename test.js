import test from "node:test";
import isConstructor from "./index.js";

const throwWhenCalledHandler = Object.preventExtensions(Object.create(null, {
  "apply": {
    configurable: false,
    enumerable: false,
    writable: false,
    value: Object.freeze(Object.defineProperty(
      ((target) => {
        throw Object.defineProperty(
          (new Error("The function was called.")),
          "target",
          {
            configurable: false,
            enumerable: true,
            writable: false,
            value: target,
          }
        );
      }),
      "name",
      {
        configurable: false,
        enumerable: false,
        writable: false,
        value: "apply",
      }
    )),
  },
  "construct": {
    configurable: false,
    enumerable: false,
    writable: false,
    value: Object.freeze(Object.defineProperty(
      ((target) => {
        throw Object.defineProperty(
          (new Error("The function was called as a constructor.")),
          "target",
          {
            configurable: false,
            enumerable: true,
            writable: false,
            value: target,
          }
        );
      }),
      "name",
      {
        configurable: false,
        enumerable: false,
        writable: false,
        value: "construct",
      }
    )),
  },
}));

const throwWhenCalled = ((target) => new Proxy(target, throwWhenCalledHandler));

// TODO: Move these to a `common-test-cases` package.

const TODO = Symbol("TODO");

[
  // Primitive values
  ["primitive value ‘undefined’", undefined, false],
  ["primitive value ‘null’", null, false],
  ["primitive ‘boolean’ value ‘false’", false, false],
  ["primitive ‘boolean’ value ‘true’", true, false],
  ["primitive ‘number’ value 0", 0, false],
  ["primitive ‘number’ value 1", 1, false],
  ["primitive ‘number’ value ‘NaN’", NaN, false],
  ["primitive ‘bigint’ value 0", 0n, false],
  ["primitive ‘bigint’ value 1", 1n, false],
  ["primitive ‘string’ value \"\" (empty string)", "", false],
  ["primitive ‘string’ value \"string\"", "string", false],
  ["primitive unregistered ‘symbol’ value with no description", Symbol(), false],
  ["primitive registered ‘symbol’ value with key \"\" (empty string)", Symbol.for(""), false],

  // Primitive wrapper objects
  ["primitive wrapper object for ‘boolean’ value ‘false’", Object(false), false],
  ["primitive wrapper object for ‘boolean’ value ‘true’", Object(true), false],
  ["primitive wrapper object for ‘number’ value 0", Object(0), false],
  ["primitive wrapper object for ‘number’ value 1", Object(1), false],
  ["primitive wrapper object for ‘number’ value ‘NaN’", Object(NaN), false],
  ["primitive wrapper object for ‘bigint’ value 0", Object(0n), false],
  ["primitive wrapper object for ‘bigint’ value 1", Object(1n), false],
  ["primitive wrapper object for ‘string’ value \"\" (empty string)", Object(""), false],
  ["primitive wrapper object for ‘string’ value \"string\"", Object("string"), false],
  ["primitive wrapper object for unregistered ‘symbol’ value with no description", Object(Symbol()), false],
  ["primitive wrapper object for registered ‘symbol’ value with key \"\" (empty string)", Object(Symbol.for("")), false],

  // Non‐function objects
  ["empty ordinary object", {}, false],
  ["empty null‐prototype object", Object.create(null), false],

  // Function objects
  ["arrow function", throwWhenCalled(() => {}), false],
  ["ordinary function", throwWhenCalled(function() {}), true],
  ["class", throwWhenCalled(class {}), true],
  ["method", throwWhenCalled({ method() {} }.method), false],
  ["async function", throwWhenCalled(async function () {}), false],
  ["async arrow function", throwWhenCalled(async () => {}), false],
  ["generator function", throwWhenCalled(function* () {}), false],
  ["async generator function", throwWhenCalled(async function* () {}), false],

  // Intrinsics
  ["%AggregateError%", AggregateError, true],
  ["%Array%", Array, true],
  ["%ArrayBuffer%", ArrayBuffer, true],
  ["%ArrayIteratorPrototype%", Object.getPrototypeOf([][Symbol.iterator]()), false],
  ["%AsyncFunction%", (async function () {}).constructor, true],
  ["%AsyncGeneratorFunction%", (async function* () {}).constructor, true],
  ["%AsyncGeneratorPrototype%", Object.getPrototypeOf((async function* () {})()), false],
  ["%AsyncIteratorPrototype%", Object.getPrototypeOf(Object.getPrototypeOf((async function* () {})())), false],
  ["%Atomics%", Atomics, false],
  ["%BigInt%", BigInt, true],
  ["%BigInt64Array%", BigInt64Array, true],
  ["%BigUint64Array%", BigUint64Array, true],
  ["%Boolean%", Boolean, true],
  ["%DataView%", DataView, true],
  ["%Date%", Date, true],
  ["%decodeURI%", decodeURI, false],
  ["%decodeURIComponent%", decodeURIComponent, false],
  ["%encodeURI%", encodeURI, false],
  ["%encodeURIComponent", encodeURIComponent, false],
  ["%Error%", Error, true],
  ["%escape%", escape, false],
  ["%unescape%", unescape, false],
  ["%eval%", eval, false],
  ["%FinalizationRegistry%", FinalizationRegistry, true],
  ["%Float32Array%", Float32Array, true],
  ["%Float64Array%", Float64Array, true],
  ["%Function%", Function, true],
  ["%GeneratorFunction%", (function* () {}).constructor, true],
  ["%GeneratorPrototype%", Object.getPrototypeOf((function* () {})()), false],
  ["%Int8Array%", Int8Array, true],
  ["%Int32Array%", Int32Array, true],
  ["%isFinite%", isFinite, false],
  ["%isNaN%", isNaN, false],
  ["%Iterator%", Iterator, true],
  ["%IteratorHelperPrototype%", Object.getPrototypeOf(((function* () {})()).take(0)), false],
  ["%JSON%", JSON, false],
  ["%Map%", Map, true],
  ["%MapIteratorPrototype%", Object.getPrototypeOf((new Map())[Symbol.iterator]()), false],
  ["%Math%", Math, false],
  ["%Number%", Number, true],
  ["%Object%", Object, true],
  ["%parseFloat%", parseFloat, false],
  ["%parseInt", parseInt, false],
  ["%Promise%", Promise, true],
  ["%Proxy%", Proxy, true],
  ["%RangeError%", RangeError, true],
  ["%ReferenceError%", ReferenceError, true],
  ["%Reflect%", Reflect, false],
  ["%RegExp%", RegExp, true],
  ["%RegExpStringIteratorPrototype%", Object.getPrototypeOf("".matchAll(/./g)), false],
  ["%Set%", Set, true],
  ["%SetIteratorPrototype%", Object.getPrototypeOf((new Set())[Symbol.iterator]()), false],
  ["%SharedArrayBuffer%", SharedArrayBuffer, true],
  ["%String%", String, true],
  ["%StringIteratorPrototype%", Object.getPrototypeOf(Object("")[Symbol.iterator]()), false],
  ["%Symbol%", Symbol, true],
  ["%SyntaxError%", SyntaxError, true],
  ["%TypedArray%", Object.getPrototypeOf(Int8Array), true],
  ["%TypeError%", TypeError, true],
  ["%Uint8Array%", Uint8Array, true],
  ["%Uint8ClampedArray%", Uint8ClampedArray, true],
  ["%Uint16Array%", Uint16Array, true],
  ["%Uint32Array%", Uint32Array, true],
  ["%URIError%", URIError, true],
  ["%WeakMap%", WeakMap, true],
  ["%WeakRef%", WeakRef, true],
  ["%WeakSet%", WeakSet, true],
  ["%WrapForValidIteratorPrototype%", Object.getPrototypeOf(Iterator.from({})), false],

  // make sure the cache gets hit at least once
  ["%Object% (again)", Object, true],

].forEach(
  ([description, value, expectedResult]) => test(
    `isConstructor(${description}) = ${expectedResult}`,
    ((value === TODO) ? { todo: true } : { plan: 1 }),
    ((context) => context.assert.strictEqual(isConstructor(value), expectedResult))
  )
);

// The following lines are settings for GNU Emacs.
// Local Variables:
// coding: utf-8-unix
// mode: javascript
// js-indent-level: 2
// End:
