import * as o from "../dist";

const obj = {
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

{
    const cache = o.cache(obj);
    const TIME = 10_000_000;
    const step_0 = performance.now();
    for (let i = 0; i < TIME; i += 1) o.has(obj, "a.b.c.d.e.f.g");
    const step_1 = performance.now();
    for (let i = 0; i < TIME; i += 1) cache.has("a.b.c.d.e.f.g");
    const step_2 = performance.now();
    const no_cache_time = (step_1 - step_0) / 1000;
    const cache_time = (step_2 - step_1) / 1000;
    const opt = 100 - (cache_time / no_cache_time) * 100;
    console.log(`no-cache-time : ${no_cache_time}`);
    console.log(`   cache-time : ${cache_time}`);
    console.log(`   optimaize% : ${opt}`);
}
