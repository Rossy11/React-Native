/**
 * Created by fy on 2018/4/27.
 */

require('react-native')
require('react')


// 1. 回调函数


function callback() {
    console.log('回调函数0执行')
}

function callback1() {
    console.log('回调函数1执行')
}

console.log('开始')

function  timeNeededFunction(aCallback,bCallback) {
    setTimeout(()=>{
        console.log('这是一个耗时操作')
        aCallback()
        bCallback()
    },1000);
}

timeNeededFunction(callback, callback1)

console.log('结束')


// 2.事件监听

function eventDone() {
    console.log('eventDone')
}

function eventListen() {
    console.log('eventDoing')
    eventListen.trigger('done')
}

// eventListen.on('done', eventDone)


// 3.发布/订阅


console.log('end')


// 4. Promise

function requestName() {
    return 'Youth'
}

requestName().then(name => {
    return name + '_MTV'
}).then(info => {
    info + '_YEAH!'
}).then(done => {
    console.log(done)
}).catch(error => {
    console.log(error.message)
})



















