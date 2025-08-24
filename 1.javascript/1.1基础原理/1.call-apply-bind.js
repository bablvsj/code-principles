const obj1 = { name: "obj1" };
const obj2 = { name: "obj2" };

function greet(greeting) {
  console.log(`${greeting}, I am ${this.name}`);
}


//  call   func.call(thisArg, arg1, arg2, ...)   立即调用func函数  将this绑定到thisArg  参数以逗号分隔的形式传递。
greet.call(obj1, "Hello"); // 'Hello, I am obj1' (this -> obj1) 

// apply  func.apply(thisArg,[arg1,arg2,...])    立即调用func函数   将this绑定到thisArg  参数以数组形式传递
greet.apply(obj2, ["Hi"]); // 'Hi, I am obj2' (this -> obj2)

// bind  func.bind(thisArg, arg1, arg2, ...)    不立即调用func函数，而是返回创建一个新的函数，这个新函数的this永久绑定到thisArg  原始函数的参数也可以被部分绑定
const boundGreet = greet.bind(obj1, "Hey"); // 返回一个新函数
boundGreet(); // 'Hey, I am obj1' (this -> obj1, greeting -> 'Hey')



// call实现
Function.prototype.myCall = function (thisArg, ...args) {
  // 1. 处理thisArg 是null或undefined的情况
  if (thisArg === null || thisArg === undefined) {
    thisArg = window;
  } else {
    //2.将thisArg转换为对象
    // 这样做是为了处理原始值（如字符串、数字），它们在作为this是会被包装
    thisArg = Object(thisArg)
  }

  // 3. 获取调用myCall的函数本身 （即this）
  const fn = this; // 这里的this就是func

  // 4. 生成一个唯一的属性名，防止覆盖对象原有属性
  //  使用Symbol是最安全的，但为了兼容性，这里用一个不太可能冲突的字符串
  const uniqueProp = Symbol(["tempFn"])

  // 5. 将函数挂载到 thisArg 上
  thisArg[uniqueProp] = fn;

  // 6. 执行函数，并传入参数
  // 使用展开运算符 ...args 将数组展开
  const result = thisArg[uniqueProp](...args)

  // 7. 删除临时添加的属性
  delete thisArg[uniqueProp]

  // 8. 返回函数执行结果
  return result;
}

const obj = {
  name: "Alice",
  age: 30
}

function callSomething(city, hobby) {
  console.log(`Hello, this is ${this.name}, ${this.age} years old , from ${city} , like ${hobby}`)
}

// Hello, this is Alice, 30 years old , from Shanghai , like coding
callSomething.call(obj, "Shanghai", "coding")

// Hello, this is Alice, 30 years old , from call City , like call hobby
callSomething.myCall(obj, "call City", "call hobby")

function testThis() {
  console.log(this)
}

// testThis.myCall(null)




// 2. 手写 apply
Function.prototype.myApply = function (thisArg, argsArray) {
  if (thisArg == null || thisArg == undefined) {
    thisArg = window;
  } else {
    thisArg = Object(thisArg)
  }

  const fn = this;
  const uniqueProp = Symbol(["tempApply"]);

  thisArg[uniqueProp] = fn;

  let result;
  if (argsArray === null || argsArray === undefined) {
    result = thisArg[uniqueProp]();
  } else {
    result = thisArg[uniqueProp](...argsArray);
  }

  delete thisArg[uniqueProp]

  return result
}


callSomething.myApply(obj, ["apply para1", "apply para2"])

// 测试不传参数数组
function noArgs() {
  console.log('No arguments, this is:', this.name);
}
noArgs.myApply(obj);





// 3. 手写bind
Function.prototype.myBind = function (thisArg, ...presetArgs) {
  // 1. 保存调用 myBind 的函数 （原函数）
  const fn = this;

  // 2. 创建一个空函数用于处理原型链
  function Empty() { }

  // 3. 返回一个新函数
  const boundFn = function (...callArgs) {

    // 4. 判断当前函数是否被用作构造函数 （通过new 调用）
    //  如果是则this指向新创建的实例
    const isNew = this instanceof boundFn;

    // 5. 决定this的指向
    const finalThis = isNew ? this : (thisArg === null || thisArg === undefined ? window : Object(thisArg))

    // 6. 合并参数： bind时的预置参数 + 调用时的参数
    const allArgs = [...presetArgs, ...callArgs];

    // 7. 执行原函数
    // 如果是构造函数调用，使用new操作符
    if (isNew) {
      // / 使用 new 调用原函数，并传入合并后的参数
      // fn.apply(this, allArgs) 这样做是错误的！new 会覆盖 this
      return new fn(...allArgs)
    } else {
      return fn.apply(finalThis, allArgs)
    }
  }

  // 8. 处理原型链
  // 如果原函数有 prototype，我们需要让 boundFn 的 prototype 继承来自原函数的 prototype 
  // 否则，new boundFn() 创建的实例将无法访问原函数 prototype 上的方法
  if (fn.prototype) {
    // 让Empty的 prototype 指向原函数的 prototype
    Empty.prototype = fn.prototype;
    // 让 boundFn 的 prototype 指向一个新的 Empty 实例
    // 这样 boundFn.prototype.__proto__ 就指向了 fn.prototype
    boundFn.prototype = new Empty()
    // 修正 boundFn 的指向
    boundFn.prototype.constructor = boundFn;
  }
  // 如果 fn 没有 prototype （如箭头函数），则 boundFn 也不需要

  // 返回这个函数
  return boundFn;
}
const bindFn = callSomething.myBind(obj, "bind para")

bindFn("bind para 2")