
// 防抖
// 核心思想：等待最后一次操作”。
// 当一个事件被频繁触发时，防抖会为这个事件设置一个延迟执行的“冷却期”。
// 如果在冷却期内事件再次被触发，那么之前的“冷却期”就会被取消，重新开始计时。
// 只有当事件停止触发，并且完整地度过了这个“冷却期”后，绑定的处理函数才会真正执行一次。
function debounce(func, delay, immediate) {
    let timer = null   // 用于存储定时器的返回值

    return function debounced(...args) {
        // 1. 每次事件开始前，清除定时器
        clearTimeout(timer)

        // 重置定时器，delay毫秒后将timer置为null
        timer = setTimeout(() => {
            timer = null
            // 延迟执行模式（最常见）
            if (!immediate) func.apply(this, args)
        }, delay)

        // executeNow 为 true 表示这是第一次触发或上一次的定时器已过期
        const executeNow = !timer;

        // 立即执行
        if (executeNow && immediate) {
            func.apply(this, args)
        }
    }
}

const log = debounce((msg) => {
    console.log('debounced:', msg, Date.now());
}, 500);

log("A");
setTimeout(() => log("B"), 300);
setTimeout(() => log("C"), 900);
setTimeout(() => log("E"), 1200);



// 节流
// 核心思想：“定期执行”
// 单位时间内，只会执行一次，分为立即执行和最后执行
function throttle(func, delay) {
    let previous = 0;  // 记录上一次执行的时间戳
    return function throttled(...args) {
        const now = Date.now() // 获取当前时间戳

        // 如果距离上一次执行已经超过了delay毫秒，则可以执行
        if ((now - previous) > delay) {
            func.apply(this, args)
            previous = now;
        }

        // 如果时间间隔不够，则不执行，直接返回
    }
}

// 使用示例
const handleEvent = throttle(function (x, y) {
    console.log('触发事件:', x, y, Date.now());
}, 200); // 每100ms最多执行一次

// 模拟高频事件（每 20ms 调用一次）
let count = 0;
const interval = setInterval(() => {
    count++;
    handleEvent(count, count * 2);
    if (count > 20) clearInterval(interval); // 跑一段时间就停
}, 20);