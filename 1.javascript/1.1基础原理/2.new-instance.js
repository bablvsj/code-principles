// 手写实现 new
function myNew(constructor, ...args) {
    // 1. 创建一个新对象，其__proto__指向 Constructor.prototype
    const obj = Object.create(constructor.prototype);

    // 2. 执行构造函数，将this指向新对
    // 使用 apply 调用 Constructor，传入 obj 作为 this 和参数
    const result = constructor.apply(obj, args)

    // 3. 如果构造函数返回了一个对象，则返回对象；否则返回新创建的对象
    if (result !== null && (typeof result === "object" || typeof result === "function")) {
        return result;
    }

    return obj;
}



// 使用示例
function Person(name, age) {
    this.name = name;
    this.age = age;
    // return { hobby: 'coding' }; // 如果取消注释，myNew 将返回这个对象
}

Person.prototype.sayHello = function () {
    console.log(`Hello, I'm ${this.name}`);
};

const person1 = myNew(Person, 'Alice', 30);
console.log(person1); // Person { name: 'Alice', age: 30 }
person1.sayHello(); // Hello, I'm Alice


function Creator() {
    this.type = "creator";
    return { special: "obj" }
}

const creator = myNew(Creator)
console.log(creator)



// 手写实现 instanceof
function myInstanceof(instance, Constructor) {
    // 1. 获取实例对象的原型（即 __proto__）
    let proto = Object.getPrototypeOf(instance)

    // 2. 获取构造函数的prototype
    const prototype = Constructor.prototype

    // 3. 沿着原型链向上查找
    while (proto !== null) {
        // 4. 如果找到匹配的 prototype，返回 true
        if (proto === prototype) {
            return true
        }

        // 5. 继续向上查找
        proto = Object.getPrototypeOf(proto)
    }

    // 6. 如果原型链遍历完都没有找到，返回 false
    return false;
}

console.log(myInstanceof(1, Object))
console.log(myInstanceof(1, Array))
