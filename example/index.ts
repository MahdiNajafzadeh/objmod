import * as o from "../dist";

const obj = {
    name: "mahdi",
    age: 21,
    skills: ["js", "ts", "html"],
    city: {
        name: "mashhad",
        code: "051",
    },
    a: {
        b: {
            c: {
                d: {
                    e: {
                        f: {
                            g: "normal-string",
                        },
                    },
                },
            },
        },
    },
};

const name = o.get(obj, "name");
console.log(name); // mahdi
o.set(obj, "name", "amir");
console.log(obj.name); // amir
console.log(o.has(obj, "city.alias")); // false, in typesciprt make error
o.del(obj, "age");
console.log(obj.age); // undefinded
o.scan(obj).forEach((_1, _2) => console.log(_2)); // name,age,skills,skills.0,skills.1,city,city.name,city.code
const newobj = o.merge(obj, { loves: ["linux", "ts"] });
console.log(newobj); // {name:"mahdi",age:21,loves:["linux","ts"],...}
o.foreach(obj, (path) => console.log(path)); // name,age,skills,skills.0,skills.1,city,city.name,city.code
o.map(obj, (path, value) => (path.includes("city") ? "not-found" : value));
console.log(obj); // {...,city:{code:"not-found",name:"not-found"},...}
o.filter(obj, (path) => path.includes("city"));
console.log(obj); // {city:{name:"mashhad",code:"051"}}

// # cache control
{
    const obj = {
        name: "mahdi",
    };
    const cache = o.cache(obj);
    console.log("before : ", cache.get("name")); // mahdi
    obj.name = "amir";
    cache.refresh();
    console.log("after  : ", cache.get("name")); // amir
}
