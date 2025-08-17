
function curry(fn) {
    // 获取原函数期望的参数数量
    const arity = fn.length;
    function curried(...args) {
        // 这里是核心逻辑：决定是继续收集参数还是执行原函数
        // 收集的参数数量 >= 原函数元数
        if (args.length >= arity) {
            return fn.apply(this, args)
        } else {
            // 继续收集
            return (...moreArgs) => {
                const newArgs = args.concat(moreArgs)
                return curried.apply(this, newArgs)
            }

        }
    }
    return curried
}

// 测试 1：基础用法
const add = (a, b) => a + b;
const curriedAdd = curry(add);

console.log(curriedAdd(2)(3)); // 5 ✅
console.log(curriedAdd(2, 3)); // 5 ✅ (一次传两个)

// 测试 2：多参数函数
const multiply = (x, y, z) => x * y * z;
const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4)); // 24 ✅
console.log(curriedMultiply(2, 3)(4)); // 24 ✅
console.log(curriedMultiply(2)(3, 4)); // 24 ✅
console.log(curriedMultiply(2, 3, 4)); // 24 ✅

// 测试 3：复用
const double = curriedMultiply(2); // 固定 x=2
const triple = curriedMultiply(3); // 固定 x=3

console.log(double(3, 4)); // 2 * 3 * 4 = 24 ✅
console.log(triple(2, 4)); // 3 * 2 * 4 = 24 ✅

const multiplyBySix = curriedMultiply(2)(3); // 固定 x=2, y=3
console.log(multiplyBySix(4)); // 2 * 3 * 4 = 24 ✅

