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
