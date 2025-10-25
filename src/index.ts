/**
 * Recursive type that extracts deep keys from an object as dot-separated strings.
 * For primitive values, it returns never.
 * For objects, it returns keys and nested keys in "key" or "key.subkey" format.
 *
 * @template T The object type to extract keys from.
 */
export type DeepKeyOf<T> = T extends object
    ? {
          [K in keyof T & string]: T[K] extends object
              ? `${K}` | `${K}.${DeepKeyOf<T[K]>}`
              : K;
      }[keyof T & string]
    : never;
/**
 * Recursively gets the type of the value located at the given dot-separated path in an object.
 * Returns unknown if the path does not exist.
 *
 * @template T The object type.
 * @template P The path string, e.g. "a.b.c".
 */
export type DeepValueOf<
    T,
    P extends string,
> = P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
        ? DeepValueOf<T[Key], Rest>
        : unknown
    : P extends keyof T
      ? T[P]
      : unknown;
/**
 * Retrieves a nested value from an object given a dot-separated path.
 * If the path does not exist, returns the default value if provided.
 *
 * @template T The type of the object.
 * @template P A valid deep key path within T.
 *
 * @param {T} obj The object to get the value from.
 * @param {P} path The dot-separated path string.
 * @param {DeepValueOf<T, P>} [def] Default value to return if the path is not found.
 * @returns {DeepValueOf<T, P>} The value at the given path, or the default value.
 */
export function get<
    T extends object,
    P extends DeepKeyOf<T>,
    V extends DeepValueOf<T, P>,
>(obj: T, path: P, def?: V): V {
    const address = path.split(".") as string[];
    let value: unknown = obj;
    for (const key of address) {
        if (typeof value !== "object" || value === null || !(key in value)) {
            return def as V;
        }
        value = (value as Record<string, unknown>)[key];
    }
    return value as V;
}
/**
 * Sets a value at the given dot-separated path in an object.
 * Creates intermediate objects if they don't exist.
 *
 * @template T The object type, must be an object.
 *
 * @param {T} obj The object to set the value in.
 * @param {string} path The dot-separated path string.
 * @param {unknown} val The value to set.
 */
export function set<
    T extends object,
    P extends DeepKeyOf<T>,
    V extends DeepValueOf<T, P>,
>(obj: T, path: P, val: V | unknown) {
    if (!path) return false;
    const address = path.split(".").filter(Boolean);
    let value: Record<string, unknown> = obj as Record<string, unknown>;
    for (const key of address) {
        if (typeof value[key] !== "object" || value[key] === null) {
            value[key] = {};
        }
        value = value[key] as Record<string, unknown>;
    }
    const lastKey = address[address.length - 1] as string;
    value[lastKey] = val;
}
/**
 * Checks if a nested path exists in an object.
 *
 * @template T The object type.
 * @template P A valid deep key path within T.
 *
 * @param {T} obj The object to check.
 * @param {P} path The dot-separated path string.
 * @returns {boolean} True if the path exists, false otherwise.
 */
export function has<T extends object, P extends DeepKeyOf<T>>(
    obj: T,
    path: P,
): boolean {
    const address = path.split(".") as string[];
    let value: unknown = obj;
    for (const key of address) {
        if (typeof value !== "object" || value === null || !(key in value)) {
            return false;
        }
        value = (value as Record<string, unknown>)[key];
    }
    return true;
}
/**
 * Deletes the property at the given dot-separated path from an object.
 *
 * @template T The object type.
 * @template P The dot-separated path to delete.
 *
 * @param obj The object to modify.
 * @param path The path of the property to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export function del<
    T extends object,
    P extends DeepKeyOf<T>,
    V extends DeepValueOf<T, P>,
>(obj: T, path: P): V {
    const address = path.split(".") as string[];
    let value: Record<string, unknown> = obj as Record<string, unknown>;
    for (const key of address) {
        if (
            !(key in value) ||
            typeof value[key] !== "object" ||
            value[key] === null
        ) {
            return undefined as V;
        }
        value = value[key] as Record<string, unknown>;
    }
    const lastKey = address[address.length - 1] as string;
    const target = value[lastKey];
    value[lastKey] = undefined;
    return target as V;
}

/**
 * Recursively scans an object and builds a map of dot-separated paths to values.
 *
 * @template T The object type.
 * @template P The deep key path type.
 * @template V The value type.
 *
 * @param obj The object to scan.
 * @param prefix Internal prefix for recursive path building (default: "").
 * @param map (Optional) An existing map to populate.
 * @returns A map of all deep paths to their corresponding values.
 */
export function scan<
    T extends object,
    P extends DeepKeyOf<T>,
    V extends DeepValueOf<T, P>,
>(obj: T, prefix = "", map = new Map<P, V>()) {
    for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        map.set(path as P, value as V);
        if (value && typeof value === "object") {
            scan(value as T, path, map);
        }
    }
    return map;
}

/**
 * Deeply merges the source object into the target object using dot-separated paths.
 *
 * @template Target The target object type.
 * @template Source The source object type.
 * @template NewObjet The resulting object type.
 *
 * @param target The target object to receive merged values.
 * @param source The source object whose values will be merged in.
 * @returns The merged object.
 */
export function merge<
    Target extends object,
    Source extends object,
    NewObjet extends Target & Source,
>(target: Target, source: Source): NewObjet {
    const map = scan(source);
    map.forEach((value, path) => set(target, path as any, value));
    return target as unknown as NewObjet;
}

/**
 * Iterates over all deep key paths in the object and invokes the callback with each.
 *
 * @template T The object type.
 * @template P The deep key path type.
 * @template V The value type at each path.
 * @template CallBack The callback type.
 *
 * @param obj The object to iterate.
 * @param func The function to call for each path/value pair.
 */
export function foreach<
    T extends object,
    P extends DeepKeyOf<T>,
    V extends DeepValueOf<T, P>,
    CallBack extends (path: P, value: V) => any,
>(obj: T, func: CallBack) {
    const map = scan(obj);
    map.forEach((value, path) => func(path as P, value as V));
}

/**
 * Applies a transformation function to each value in the object.
 * Updates each value with the result of the function.
 *
 * @template T The object type.
 * @template P The path type.
 * @template V The value type.
 * @template CallBack The transformer function type.
 *
 * @param obj The object to transform.
 * @param func The function to apply to each path/value pair.
 */
export function map<
    T extends object,
    P extends DeepKeyOf<T>,
    V extends DeepValueOf<T, P>,
    CallBack extends (path: P, value: V) => any,
>(obj: T, func: CallBack) {
    const map = scan(obj);
    map.forEach((value, path) =>
        set(obj, path as P, func(path as P, value as V)),
    );
}

/**
 * Removes entries from the object for which the predicate function returns false.
 *
 * @template T The object type.
 * @template P The path type.
 * @template V The value type.
 * @template CallBack The filter function type.
 *
 * @param obj The object to filter.
 * @param func The predicate function that decides whether to keep each path/value pair.
 */
export function filter<
    T extends object,
    P extends DeepKeyOf<T>,
    V extends DeepValueOf<T, P>,
    CallBack extends (path: P, value: V) => boolean,
>(obj: T, func: CallBack) {
    const map = scan(obj);
    map.forEach((value, path) =>
        func(path as P, value as V) ? null : del(obj as T, path as P),
    );
}

/**
 * Creates a caching wrapper for accessing and modifying deeply nested properties.
 *
 * @template T The object type.
 * @template P The deep key path type.
 * @template V The value type.
 *
 * @param obj The object to wrap.
 * @returns An interface providing cached get/set/has operations and manual refresh.
 */
export function cache<
    T extends object,
    P extends DeepKeyOf<T>,
    V extends DeepValueOf<T, P>,
>(obj: T) {
    const map = scan(obj);

    /**
     * Gets a value from the cache or original object.
     *
     * @param path The path to retrieve.
     * @param def The default value if not found.
     * @returns The cached or resolved value.
     */
    function _get(path: P, def?: V): V {
        if (map.has(path)) return map.get(path) as V;
        else {
            const value = get(obj, path, def);
            map.set(path, value);
            return value;
        }
    }

    /**
     * Sets a value in the object and updates the cache.
     *
     * @param path The path to set.
     * @param value The value to assign.
     * @returns True if set was successful.
     */
    function _set(path: P, value: V) {
        map.set(path, value);
        return set(obj, path, value);
    }

    /**
     * Checks whether a value exists in the cache.
     *
     * @param path The path to check.
     * @returns True if cached.
     */
    function _has(path: P): boolean {
        return map.has(path);
    }

    /**
     * Clears and rebuilds the internal cache.
     */
    function _refresh() {
        map.clear();
        scan(obj).forEach((value, path) => map.set(path, value));
    }

    return {
        get: _get,
        set: _set,
        has: _has,
        refresh: _refresh,
        map: map,
    };
}
