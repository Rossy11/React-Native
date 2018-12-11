/**
 * Created by fy on 2018/5/17.
 */
require('react')

function aFunction() {
    return next => {
        console.log(next)
    }
}

aFunction()('222')


let obj1 = {
    aa:'11',
    bb:22
}

let obj2 = {...obj1, aa:'xx'}
console.log(obj2)

let arr1 = [1,2,3]

// 报错
// let arr2 = [...obj2]

let arr2 = [3,4,...arr1]

console.log(arr2)



for(var i in arr2) {
    console.log('枚举\n',i)
}

let newObj1 = new Object()

console.log(newObj1,'是否可枚举',newObj1.propertyIsEnumerable())

for (var i in newObj1) {
    console.log(i)
}

newObj1 = {aa:'aa',bb:11}

console.log(newObj1,'是否可枚举',newObj1.propertyIsEnumerable())

for (var i in newObj1) {
    console.log(i)
}

console.log(122,newObj1.__proto__.toString())