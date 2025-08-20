// 1. 定义一个构造函数
function Person(name) {
    this.name = name;
}

// 2. JavaScript 引擎自动为 Person 函数创建 prototype 属性
//    Person.prototype 指向一个对象
//    这个对象有一个 constructor 属性，指向 Person 函数
console.log(Person.prototype);
// 输出: { constructor: ƒ Person(name) }

console.log(Person.prototype.constructor === Person); // true

// 3. 我们可以给 Person.prototype 添加方法
Person.prototype.sayHello = function () {
    console.log(`Hello, I'm ${this.name}`);
};

// 4. 现在，所有 Person 的实例都可以访问 sayHello 方法
const alice = new Person('Alice');
const bob = new Person('Bob');

alice.sayHello(); // Hello, I'm Alice
bob.sayHello();  // Hello, I'm Bob


// Person (函数)
//   |
//   | prototype (属性)
//   ↓
// Person.prototype (对象)
//   |
//   | constructor (属性)
//   ↓
// Person (函数)  <--- 循环链接
//   |
//   | sayHello (方法)
//   ↓
// function() { ... }


console.log(alice)
// {
//     "name":"Alice",
//     [[Prototype]]:Object
// }
console.log(alice.__proto__ === Person.prototype) // true
console.log(alice.__proto__.constructor === Person.prototype.constructor)   // true
console.log(alice.__proto__.constructor === Person)   // true

console.log(Person.prototype.constructor === Person) // true
// alice (实例对象)
//   |
//   | __proto__ (内部链接)
//   ↓
// Person.prototype (原型对象)
//   |
//   | constructor
//   ↓
// Person (构造函数)
//   |
//   | prototype
//   ↑------------------|
//                       |
//                       | (循环)


