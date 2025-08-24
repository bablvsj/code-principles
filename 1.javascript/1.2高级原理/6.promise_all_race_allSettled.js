// all
Promise.myAll = function (promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError("promise must be iterable"))
        }

        const results = [];
        let completedCount = 0;
        const total = promises.length

        if (total < 1) {
            return resolve(results)
        }

        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(value => {
                results[index] = value;
                completedCount++;
                // 当所有都完成时，resolve
                if (completedCount === total) {
                    resolve(results)
                }

            }).catch(error =>
                // 只要有一个rejected 立即reject
                reject(error))
        })
    })
}

// console.log(Promise.myAll([Promise.resolve(1), Promise.resolve(2)]))

// // 使用示例
// Promise.myAll([Promise.resolve(1), Promise.resolve(2)])
//     .then(console.log) // [1, 2]
// Promise.myAll([Promise.resolve(1), Promise.reject('error')])
//     .catch(console.error) // error



// race
// 修改您的 myRace 实现，添加调试
Promise.myRace = function (promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('promises must be iterable'));
        }

        console.log('myRace started');
        promises.forEach((promise, index) => {
            console.log(`Processing promise ${index}`);
            Promise.resolve(promise)
                .then(value => {
                    console.log(`Promise ${index} fulfilled with`, value);
                    resolve(value);
                })
                .catch(reason => {
                    console.log(`Promise ${index} rejected with`, reason);
                    reject(reason);
                });
        });
    });
};

// 运行测试
// Promise.myRace([Promise.reject('err1'), Promise.resolve(2)])
//     .catch(err => {
//         console.log('Caught in .catch:', err); // 明确使用 console.log
//         // 或者
//         console.error('Explicit error:', err); // 明确使用 console.error
//     });
Promise.myRace([Promise.resolve(1), Promise.reject('error')])
    .then(console.log) // 1 (resolve 优先)
// Promise.myRace([Promise.reject('er1r1'), Promise.resolve(2)])
// .catch(error => console.log(error)) // err1 (reject 优先)




// settled
Promise.myAllSettled = function(promises) {
  return new Promise((resolve) => { // 注意：allSettled 不会 reject
    if (!Array.isArray(promises)) {
      // 实际中应抛出错误，但为了简化，这里用 resolve([])
      return resolve([]);
    }

    const results = [];
    let completedCount = 0;
    const total = promises.length;

    if (total === 0) {
      return resolve(results);
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = { status: 'fulfilled', value };
          completedCount++;
          if (completedCount === total) {
            resolve(results);
          }
        })
        .catch(reason => {
          results[index] = { status: 'rejected', reason };
          completedCount++;
          if (completedCount === total) {
            resolve(results);
          }
        });
    });
  });
};

// 使用示例
// Promise.myAllSettled([Promise.resolve(1), Promise.reject('err')])
//   .then(console.log)
//   // [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'err' }]



