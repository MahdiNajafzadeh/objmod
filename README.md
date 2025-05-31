# objmod

A lightweight and type-safe utility module for working with deeply nested object properties using dot-separated string paths in TypeScript.

## Features

* 🔍 **Access** deeply nested values with full TypeScript type safety.
* 🛠️ **Set**, **delete**, and **check** nested values.
* 🔁 **Scan** object trees and iterate over all deep paths.
* 🧠 **Type inference** for path strings and returned values.
* ⚡ **Caching** support for faster repeated access.
* 🧹 Functional utilities like `map`, `filter`, and `foreach`.

## Installation

```bash
npm install objmod
npm install --save-dev @types/objmod
```

Or just copy and paste the module into your project as it's completely dependency-free.

## Usage

### Basic API

#### `get<T, P>(obj: T, path: P, def?: V): V`

Get a nested value from an object.

```ts
get({ a: { b: { c: 42 } } }, "a.b.c"); // 42
```

#### `set<T, P>(obj: T, path: P, value: V): void`

Set a value at a given nested path.

```ts
set(obj, "a.b.c", 100);
```

#### `has<T, P>(obj: T, path: P): boolean`

Check if a nested path exists.

```ts
has(obj, "a.b.c"); // true or false
```

#### `del<T, P>(obj: T, path: P): boolean`

Delete a deeply nested property.

```ts
del(obj, "a.b.c");
```

### Advanced Utilities

#### `scan<T>(obj: T): Map<string, any>`

Recursively get a flat map of dot-separated paths to values.

```ts
scan({ a: { b: 1, c: { d: 2 } } });
// Map { "a.b" => 1, "a.c.d" => 2 }
```

#### `foreach<T>(obj: T, cb)`

Call a function for each deep key.

```ts
foreach(obj, (path, value) => console.log(path, value));
```

#### `map<T>(obj: T, cb)`

Transform all deep values in-place.

```ts
map(obj, (path, value) => typeof value === 'number' ? value * 2 : value);
```

#### `filter<T>(obj: T, cb)`

Remove entries based on a predicate.

```ts
filter(obj, (path, value) => typeof value === 'string');
```

#### `merge<T, S>(target: T, source: S): T & S`

Deep merge two objects.

```ts
merge({ a: 1 }, { b: { c: 2 } });
// { a: 1, b: { c: 2 } }
```

#### `cache<T>(obj: T)`

Create a cached interface for nested operations.

```ts
const cached = cache(myObject);
cached.get("a.b");
cached.set("x.y", 42);
cached.refresh();
```

## Types

### `DeepKeyOf<T>`

Recursively extracts all possible dot-separated keys in an object.

### `DeepValueOf<T, P>`

Given a type `T` and a key path `P`, returns the type at that path.

## Example

```ts
type Data = {
  user: {
    name: string;
    preferences: {
      theme: string;
    };
  };
};

type Keys = DeepKeyOf<Data>; // "user.name" | "user.preferences.theme"
type ThemeType = DeepValueOf<Data, "user.preferences.theme">; // string
```

## License

MIT © 2025 Mahdi Najafzadeh

