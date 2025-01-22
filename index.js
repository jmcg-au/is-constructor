const cache = Object.freeze(new WeakMap());
const handler = Object.freeze({
  construct() {
    return handler;
  }
});
Object.freeze(handler.construct);
export default Object.freeze(Object.defineProperty(
  ((target) => {
    if ((typeof target) !== "function") {
      return false;
    }
    if (cache.has(target)) {
      return cache.get(target);
    }
    let result;
    try {
      new (new Proxy(target, handler))();
      result = true;
    } catch {
      result = false;
    }
    cache.set(target, result);
    return result;
  }),
  "name",
  {
    configurable: false,
    enumerable: false,
    writable: false,
    value: "isConstructor",
  }
));

// The following lines are settings for GNU Emacs.
// Local Variables:
// coding: utf-8-unix
// mode: javascript
// js-indent-level: 2
// End:
