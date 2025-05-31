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

const name = o.get(obj, "name");
console.log(name); // mahdi
o.set(obj, "name", "amir");
console.log(obj.name); // amir
console.log(o.has(obj, "city.alias")); // false
o.del(obj, "age");
console.log(obj.age); // undefinded
o.scan(obj).forEach((_1, _2) => console.log(_2)); // name,age,skills,skills.0,skills.1,city,city.name,city.code
const newobj = o.merge(obj, { loves: ["linux", "ts"] });
console.log(newobj); // {name:"mahdi",age:21,loves:["linux","ts"],...}
o.foreach(obj, (path) => console.log); // name,age,skills,skills.0,skills.1,city,city.name,city.code
o.map(obj, (path, value) => (path.includes("city") ? "not-found" : value));
console.log(obj); // {...,city:{code:"not-found",name:"not-found"},...}
o.filter(obj, (path) => path.includes("city"));
console.log(obj); // {city:{name:"mashhad",code:"051"}}

// # small bechmark for cache
const cache = o.cache(obj);
const TIME = 10_000_000;
const step_0 = performance.now();
for (let i = 0; i < TIME; i += 1) o.has(obj, "city.name");
const step_1 = performance.now();
for (let i = 0; i < TIME; i += 1) cache.has("city.name");
const step_2 = performance.now();
console.log(`no-cache-time : ${(step_1 - step_0) / 1000}`);
console.log(`cache-time    : ${(step_2 - step_1) / 1000}`);
// # cache control
const cache = o.cache(obj);
obj.name = "amir";
console.log("before : ", cache.get("name")); // mahdi
cache.refresh();
console.log("after  : ", cache.get("name")); // amir
