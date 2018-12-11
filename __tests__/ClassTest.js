/**
 * Created by fy on 2018/4/3.
 */
'use strict'
class Student {
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
}

let s1 = new Student('S1', 12)

s1 = {name:'S2', age:14}

console.log(s1)

// type Person = {
//     height: number,
//     weight: number,
//     name: string,
//     eat: () => void
// };
//
// let p1 = Person()
// p1.height = 11
// console.log(p1)

// function testVar() {
//     a = 1111111;
// }

// testVar()

// console.log(a);

var a1 = 11111;
function changeVar() {
    a1 = 22222;
}

changeVar()
console.log(a1);


let a2 = 0;
function changeLet() {
    a2 = 9999;
}

changeLet()
console.log(a2)


function varTest() {

    var x1 = 1;
    if(true){
        var x1 = 2;
        console.log(x1);
    }
    console.log(x1);
}

varTest();

function letTest() {
    let x1 = 3;
    if(true){
        let x1 = 4;
        console.log(x1);
    }
    console.log(x1);
}

letTest()