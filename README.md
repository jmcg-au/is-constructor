# `@jmcg/is-constructor`

Determine whether a JavaScript function is a constructor, without calling it.

```javascript
import isConstructor from "@jmcg/is-constructor";

isConstructor(() => {}) // false
isConstructor(function() {}) // true
isConstructor(class {}) // true
isConstructor({ method() {} }.method) // false
isConstructor(async function () {}) // false
isConstructor(function* () {}) // false
isConstructor(async function* () {}) // false
```

## Technical notes

This is accomplished by creating a
[`Proxy`](https://tc39.es/ecma262/#sec-proxy-objects) for the target
function, with a
[`construct()` handler](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots-construct-argumentslist-newtarget)
which returns a sentinel object.  The `Proxy` is then called as a
constructor.  If the target function is a constructor, the
`construct()` handler will be called, returning the sentinel object
(which is ignored), and `isConstructor()` will return `true`.  If the
target function is not a constructor, a `TypeError` will be thrown and
caught, and `isConstructor()` will return `false`.

The results are cached in a `WeakMap`, so calling `isConstructor()`
repeatedly on the same function will always return the same result.

## License

This package is released under
[the Creative Commons Attribution 4.0 International (CC-BY-4.0) license](LICENSE.txt).
