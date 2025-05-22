/**
 * Primitive data types in JavaScript.
 * Includes string, number, boolean, null, undefined, symbol, and bigint.
 */
type Primitive = string | number | boolean | null | undefined | symbol | bigint;
/**
 * Recursive type that extracts deep keys from an object as dot-separated strings.
 * For primitive values, it returns never.
 * For objects, it returns keys and nested keys in "key" or "key.subkey" format.
 * 
 * @template T The object type to extract keys from.
 */
export type DeepKeyOf<T> = T extends Primitive ? never : {
	[K in keyof T & string]: T[K] extends Primitive
	? K
	: `${K}` | `${K}.${DeepKeyOf<T[K]>}`
}[keyof T & string];
/**
 * Recursively gets the type of the value located at the given dot-separated path in an object.
 * Returns unknown if the path does not exist.
 * 
 * @template T The object type.
 * @template P The path string, e.g. "a.b.c".
 */
export type PathValue<T, P extends string> =
	P extends `${infer Key}.${infer Rest}`
	? Key extends keyof T
	? PathValue<T[Key], Rest>
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
 * @param {PathValue<T, P>} [def] Default value to return if the path is not found.
 * @returns {PathValue<T, P>} The value at the given path, or the default value.
 */
export function get<T, P extends DeepKeyOf<T>>(obj: T, path: P, def?: PathValue<T, P>): PathValue<T, P> {
	const address = path.split('.') as string[];
	let value: unknown = obj;

	for (const key of address) {
		if (typeof value !== 'object' || value === null || !(key in value)) {
			return def as PathValue<T, P>;
		}
		value = (value as Record<string, unknown>)[key];
	}
	return value as PathValue<T, P>;
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
 * @returns {boolean} True if the value was successfully set, false otherwise (e.g. empty path).
 */
export function set<T extends object>(obj: T, path: string, val: unknown): boolean {
	if (!path) return false;

	const address = path.split('.').filter(Boolean);
	if (address.length === 0) return false;

	let value: Record<string, unknown> = obj as Record<string, unknown>;

	for (let i = 0; i < address.length - 1; i++) {
		const key = address[i]!;
		if (typeof value[key] !== 'object' || value[key] === null) {
			value[key] = {};
		}
		value = value[key] as Record<string, unknown>;
	}
	const lastKey = address[address.length - 1]!;
	value[lastKey] = val;
	return true;
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
export function has<T, P extends DeepKeyOf<T>>(obj: T, path: P): boolean {
	const address = path.split('.') as string[];
	let value: unknown = obj;

	for (const key of address) {
		if (typeof value !== 'object' || value === null || !(key in value)) {
			return false;
		}
		value = (value as Record<string, unknown>)[key];
	}
	return true;
}

export default {
	get,
	set,
	has
}
