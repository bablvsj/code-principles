function deepClone(target, hash = new WeakMap()) {

    if (target === null || target == undefined) return target

    // 处理基本类型和函数
    if (typeof target != "object") return target

    // 处理日期
    if (target instanceof Date) return new Date(target)

    // 处理正则
    if (target instanceof RegExp) return new RegExp(target)

    // 处理循环引用 
    // 检查 WeakMap 中是否已经存在 target 的拷贝   
    if (hash.has(target)) {
        // 如果存在，说明之前已经拷贝过这个对象，直接返回缓存的拷贝
        // 这样就避免了无限递归
        return hash.get(target)
    }

    // 创建新对象
    // 根据 target 的构造函数创建一个新的实例
    // 这样可以保证新对象的原型链和原对象一致
    // 例如：[] 的 constructor 是 Array，{} 的 constructor 是 Object
    let cloneTarget;
    try {
        // 使用 target.constructor 创建新实例
        // 注意：某些对象（如通过 Object.create(null) 创建的）可能没有 constructor
        cloneTarget = new target.constructor();
    } catch (error) {
        // 如果创建失败（比如 constructor 不存在或不是构造函数），回退到创建一个空对象
        // 使用 Object.create(null) 可以创建一个没有原型链的对象
        cloneTarget = Object.create(null)
    }


    // 在递归拷贝其属性之前，先将 (原对象 -> 新对象) 的映射存入 hash
    // 这样当递归遇到循环引用时，就能查到并返回已创建的新对象
    hash.set(target, cloneTarget)

    // 使用 for...in 遍历所有可枚举属性（包括原型链上的）
    // 但我们通常只拷贝对象自身的属性
    for (let key in target) {
        // 使用 hasOwnProperty 过滤掉继承的属性
        if (target.hasOwnProperty(key)) {
            // 递归地对 target[key] 进行深拷贝
            // 注意：传入同一个 hash，确保循环引用检测在整个拷贝过程中有效
            cloneTarget[key] = deepClone(target[key], hash)
        }

    }

    return cloneTarget
}


// 测试基本类型
console.log(deepClone(123)); // 123
console.log(deepClone('hello')); // 'hello'

// 测试简单对象
const obj1 = { a: 1, b: { c: 2 } };
const cloned1 = deepClone(obj1);
console.log(cloned1.b === obj1.b); // false (深度独立)

// 测试数组
const arr1 = [1, [2, 3], { d: 4 }];
const cloned2 = deepClone(arr1);
console.log(cloned2[1] === arr1[1]); // false

// 测试 Date
const date1 = new Date();
const cloned3 = deepClone(date1);
console.log(cloned3.getTime() === date1.getTime()); // true
console.log(cloned3 === date1); // false

// 测试 RegExp
const reg1 = /abc/gi;
const cloned4 = deepClone(reg1);
console.log(cloned4.source === reg1.source); // true
console.log(cloned4.flags === reg1.flags); // true
console.log(cloned4 === reg1); // false

// 测试 Set
// const set1 = new Set([1, { e: 5 }]);
// const cloned5 = deepClone(set1);
// console.log(cloned5.size === set1.size); // true
// console.log(cloned5.values().next().value === set1.values().next().value); // false (对象已深拷贝)

// 测试 Map
// const map1 = new Map([['key1', 1], ['key2', { f: 6 }]]);
// const cloned6 = deepClone(map1);
// console.log(cloned6.get('key2') === map1.get('key2')); // false

// 测试循环引用
// const circularObj = { name: 'circular' };
// circularObj.self = circularObj; // 自引用
// const cloned7 = deepClone(circularObj);
// console.log(cloned7.self === cloned7); // true (正确建立了自引用，且不是原对象)
// console.log(cloned7.self === circularObj); // false (与原对象独立)

// 测试函数 (直接返回引用)
function func() { return 'test'; }
const cloned8 = deepClone(func);
console.log(cloned8 === func); // true