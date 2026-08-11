// Drop-in replacement for the Claude-artifact `window.storage` API, backed by
// the browser's own localStorage so the app works fully offline and standalone.
// Matches the exact shape the app already expects: get() resolves to
// { key, value } or null; set()/delete() resolve to a small result object.
(function () {
  const PREFIX = "money-ledger:";

  function fullKey(key, shared) {
    return PREFIX + (shared ? "shared:" : "personal:") + key;
  }

  window.storage = {
    async get(key, shared) {
      try {
        const raw = localStorage.getItem(fullKey(key, shared));
        if (raw === null) return null;
        return { key, value: raw, shared: !!shared };
      } catch (e) {
        return null;
      }
    },
    async set(key, value, shared) {
      try {
        localStorage.setItem(fullKey(key, shared), value);
        return { key, value, shared: !!shared };
      } catch (e) {
        return null;
      }
    },
    async delete(key, shared) {
      try {
        localStorage.removeItem(fullKey(key, shared));
        return { key, deleted: true, shared: !!shared };
      } catch (e) {
        return null;
      }
    },
    async list(prefix, shared) {
      try {
        const base = fullKey("", shared);
        const search = base + (prefix || "");
        const keys = Object.keys(localStorage)
          .filter((k) => k.startsWith(search))
          .map((k) => k.slice(base.length));
        return { keys, prefix: prefix || undefined, shared: !!shared };
      } catch (e) {
        return null;
      }
    },
  };
})();
