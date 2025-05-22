# objmod - Deep Object Utilities for TypeScript

A powerful and type-safe TypeScript utility library to **get**, **set**, and **check** deeply nested properties in objects using dot-separated string paths. Perfect for complex data structures with full compile-time type inference!

---

## Features

- **Type-safe deep key extraction** with `DeepKeyOf<T>`: Get all valid nested keys as dot-separated strings.
- **Typed value retrieval** using `get(obj, path, default?)` that respects the exact type at the given path.
- **Deep setting** of nested properties with automatic creation of intermediate objects via `set(obj, path, value)`.
- **Existence check** for any nested path with `has(obj, path)`.
- Full support for primitive and complex nested objects with zero runtime surprises.
- Written entirely in TypeScript with comprehensive typing.

---

## Installation

```bash
npm install objmod
````

---

## Usage

```ts
import objmod from 'objmod';

const data = {
  user: {
    profile: {
      name: 'Mahdi',
      age: 30
    }
  }
};

// Get a nested value (typed as string)
const userName = objmod.get(data, 'user.profile.name'); // "Mahdi"

// Set a nested value (creates intermediate objects if needed)
objmod.set(data, 'user.profile.location.city', 'Tehran');

// Check if nested path exists
const hasAge = objmod.has(data, 'user.profile.age'); // true

// Get with default value if path is missing
const country = objmod.get(data, 'user.profile.location.country', 'Unknown'); // "Unknown"
```

---

## API

### `DeepKeyOf<T>`

A recursive type that extracts all valid deep keys of an object `T` as dot-separated strings. Ignores primitive values.

### `get<T, P extends DeepKeyOf<T>>(obj: T, path: P, def?: PathValue<T, P>): PathValue<T, P>`

Returns the value at the nested `path` inside `obj`. Returns `def` if path doesn't exist.

### `set<T extends object>(obj: T, path: string, val: unknown): boolean`

Sets the value at the nested `path` inside `obj`. Creates intermediate objects as needed. Returns `true` if successful.

### `has<T, P extends DeepKeyOf<T>>(obj: T, path: P): boolean`

Returns `true` if the nested `path` exists inside `obj`, else `false`.

---

## Why Use objmod?

Managing deeply nested data is a pain in vanilla JavaScript — lots of manual checks, risk of runtime errors, and no type safety.

**objmod** solves these problems elegantly by:

* Leveraging TypeScript's advanced types for safe, autocompleted paths.
* Eliminating the need for verbose, repetitive code.
* Gracefully handling missing intermediate keys.
* Offering a minimal but powerful API to improve your developer experience.

---

## License

MIT © Mahdi Najafzadeh

---

Made with ❤️ and TypeScript expertise by Mahdi Najafzadeh
