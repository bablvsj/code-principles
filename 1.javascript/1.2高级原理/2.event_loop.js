// 同步队列 -> 微任务队列 -> 宏任务队列 -> 微任务队列 -> 下一个宏任务队列

// 执行流程 (浏览器)
// 1. 执行同步代码： JavaScript 引擎首先执行调用栈中的所有同步代码。
// 2. 检查微任务队列： 当调用栈清空后，Event Loop 会立即检查微任务队列。
// 3. 执行所有微任务： Event Loop 会连续执行微任务队列中的所有微任务，直到队列为空。
//      注意： 在执行微任务的过程中，如果产生了新的微任务，这些新任务也会被加入队列并被执行
// （即“微任务队列在本轮循环中会完全清空”）。
// 4. 检查宏任务队列： 微任务队列清空后，Event Loop 会从宏任务队列中取出第一个宏任务，
// 将其推入调用栈执行。
// 5. 重复： 执行完这个宏任务后，再次检查微任务队列，执行所有微任务，然后取出下一个宏任务... 如此循环往复。
// 简单口诀： 同步 -> 清空微任务 -> 一个宏任务 -> 清

// 浏览器 vs Node.js Event Loop
// 浏览器：
// 1. 宏任务队列和微任务队列是分开的。
// 2. 执行一个宏任务后，会清空所有微任务。
// 3. UI 渲染通常在一个宏任务周期之后进行。
// Node.js：
// 事件循环分为6个阶段：
// Timers: 执行 setTimeout 和 setInterval 的回调。
// I/O callbacks: 执行几乎所有的 I/O 回调（除了 close 事件、定时器和 setImmediate）。
// idle, prepare: 内部使用。
// Poll: 检索新的 I/O 事件；执行 I/O 回调。这是处理 I/O 的主要阶段。如果 poll 队列为空，可能会等待。
// Check: 执行 setImmediate 的回调。
// Close callbacks: 执行 socket.on('close', ...) 这样的回调。
// 微任务执行时机： 在每个阶段之间，Node.js 都会清空微任务队列（process.nextTick 队列优先于 Promise 队列）。
// setImmediate vs setTimeout(0): 在 I/O 回调中，setImmediate 通常比 setTimeout(0) 先执行。

// Promise 链中的执行顺序严格遵循 微任务队列的 FIFO (先进先出) 原则和 Event Loop 的调度。
// 链式调用 (then) 的下一个回调何时执行？
// 它取决于前一个 then 回调所返回的 Promise 的状态。
// 如果返回的 Promise 立即 fulfilled/rejected，则下一个 then 回调立即加入微任务队列，并在当前微任务周期内执行。
// 如果返回的 Promise 是 pending 状态，则下一个 then 回调要等到这个 Promise 被解决后，才会被加入微任务队列，并在下一个合适的微任务检查点执行。
// setTimeout 等宏任务的优先级低于微任务。所有微任务必须在下一个宏任务之前执行完毕。



// 案例1
console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('promise1');
  // 返回一个 已经 resolve 的 Promise
  return Promise.resolve('Immediate value');
}).then(value => {
  console.log('promise2:', value);
}).then(() => {
  console.log('promise3');
});

console.log('script end');

// 输出顺序：  script start
//            script end
//            promise1
//            promise2 Immediate value
//            primise3
//            script end


// 案例2
console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('promise1');
  // 返回一个 新的 Promise，它会在 10ms 后 resolve
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Async Promise in then resolved');
      resolve('Value from async promise');
    }, 10);
  });
}).then(value => {
  console.log('promise2:', value);
}).then(() => {
  console.log('promise3');
});

console.log('script end');

// 输出顺序：  script start
//            script end
//            promise1
//            setTimeout
//            Async Promise in then resolved
//            promise2 Value form async promise
//            promise3

