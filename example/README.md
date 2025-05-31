# Example Usage of `objmod` Library

```ts
const o = require("./dist");

const obj = {
  name: "mahdi",
  age: 21,
  skills: ["js", "ts", "html"],
  city: {
    name: "mashhad",
    code: "051",
  },
};
```

## 🔹 `get`: Access a property using a dot-separated path

```ts
const name = o.get(obj, "name");
console.log(name); // Output: "mahdi"
```

## 🔹 `set`: Update a value at the given path

```ts
o.set(obj, "name", "amir");
console.log(obj.name); // Output: "amir"
```

## 🔹 `has`: Check if a property exists

```ts
console.log(o.has(obj, "city.alias")); // Output: false
```

## 🔹 `del`: Delete a property

```ts
o.del(obj, "age");
console.log(obj.age); // Output: undefined
```

## 🔹 `scan`: Recursively list all paths in the object

```ts
o.scan(obj).forEach((_value, path) => console.log(path));
// Output:
// name
// skills
// skills.0
// skills.1
// skills.2
// city
// city.name
// city.code
```

## 🔹 `merge`: Merge two objects

```ts
const newobj = o.merge(obj, { loves: ["linux", "ts"] });
console.log(newobj);
// Output:
// {
//   name: "amir",
//   skills: ["js", "ts", "html"],
//   city: { name: "mashhad", code: "051" },
//   loves: ["linux", "ts"]
// }
```

## 🔹 `foreach`: Apply a function to every path

```ts
o.foreach(obj, (path) => console.log(path));
// Output:
// name
// skills
// skills.0
// skills.1
// skills.2
// city
// city.name
// city.code
```

## 🔹 `map`: Map over all properties and modify values

```ts
o.map(obj, (path, value) => (path.includes("city") ? "not-found" : value));
console.log(obj);
// Output:
// {
//   name: "amir",
//   skills: ["js", "ts", "html"],
//   city: { name: "not-found", code: "not-found" }
// }
```

## 🔹 `filter`: Keep only matching paths

```ts
const filtered = o.filter(obj, (path) => path.includes("city"));
console.log(filtered);
// Output:
// {
//   city: {
//     name: "mashhad",
//     code: "051"
//   }
// }
```

---

# Cache Usage

## 🔹 Benchmark: Comparing normal vs. cached access

```ts
const cache = o.cache(obj);
const TIME = 10_000_000;

const step_0 = performance.now();
for (let i = 0; i < TIME; i++) {
  o.has(obj, "city.name");
}
const step_1 = performance.now();

for (let i = 0; i < TIME; i++) {
  cache.has("city.name");
}
const step_2 = performance.now();

console.log(`no-cache-time : ${(step_1 - step_0) / 1000}`);
console.log(`cache-time    : ${(step_2 - step_1) / 1000}`);
```

## 🔹 Refreshing cache after mutation

```ts
const cache = o.cache(obj);

obj.name = "amir";
console.log("before :", cache.get("name")); // Output: "mahdi"

cache.refresh();
console.log("after  :", cache.get("name")); // Output: "amir"
```
