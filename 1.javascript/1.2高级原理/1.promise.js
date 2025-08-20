class MyPromise {
  // state: string;
  // value: undefined;
  // reason: undefined;
  // onFulfilledCallbacks: [];
  // onRejectedCallbacks: [];
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = []; // 存储成功回调
    this.onRejectedCallbacks = []; // 存储失败回调

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected"
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    // 立即执行executor
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    // 处理onFulfilled/onRejected 可能不是函数的情况
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason };


    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state == "fulfilled") {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);

            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      // 如果状态还是 pending，说明异步操作还没结束，先将回调存起来
      if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }

    })

    return promise2;

  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }
}

// 处理then回调返回值 x的函数
function resolvePromise(promise2, x, resolve, reject) {
  // 防止循环引用
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected form promise"))
  }

  let called = false;  // 确保resolve或reject只调用一次

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(x,
          y => {  // onFulfilled
            if (called) return;
            called = true;
            // 递归处理y
            resolvePromise(promise2, y, resolve, reject)
          },
          r => { // onRejected
            if (called) return;
            called = true;
            reject(r)
          })
      } else {
        // x 是一个普通对象
        resolve(x)
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error)
    }
  } else {
    // x是一个普通值
    resolve(x)
  }
}


const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log("promise 1")
    resolve("Hello")
  }, 0)
})

promise.then(res => {
  console.log(res + " World")
  return "next"
}).then((res) => console.log(res + ' promise 2'))