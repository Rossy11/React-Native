/**
 * Created by fy on 2018/4/26.
 */
// "use strict"

var x = 0;

function test1() {
    this.x = 1;
    // console.log(this.x)
    console.log(this)
}

test1()

console.log(x)


function test2() {
    console.log('test2---', this.x)
}

var o = {}
o.x = 4;
o.m = test2
o.m()

function test3() {
    this.x = 3
}

var o = new test3()
console.log(o.x)


aaaaaa = 333
var bbbb = 3333

seees = 'eesfaefef'

console.log(global)
