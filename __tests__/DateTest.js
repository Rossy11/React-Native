/**
 * Created by fy on 2018/4/17.
 */

// import moment from 'moment'

var aDate = new Date()
console.log("new--",aDate)

var bDate = aDate.getFullYear() + '-' + (aDate.getMonth()+1) + '-' + aDate.getDate()
console.log(bDate)

let newTimeScape = Number(aDate)
let aMonthAgo = newTimeScape - 30*24*60*60*1000
console.log(newTimeScape, aMonthAgo)
let aMonthAgoTime = new Date(aMonthAgo)
console.log(aMonthAgoTime)


console.log("DataString--", aDate.toDateString())
console.log("UTCString--", aDate.toUTCString())
console.log("toLocalString---", aDate.toLocaleDateString())

var newDate = new Date('2018-2-29')
console.log(123,newDate)
console.log('NewDate---', newDate.toLocaleString())

console.log("toLocalTimeString--", aDate.toLocaleTimeString())

console.log("年-月-日",aDate.getFullYear(), aDate.getMonth(), aDate.getDate())

aDate.setFullYear(2011,4,5)
console.log("2011,4,5---",aDate.setDate())

var today = new Date(2018,4,17)
console.log("2018,4,17---",today)

var dateString = new Date("5/4/2018 19:08:00")
console.log("dateString----", dateString)
//
// let time1 = moment().format('YYYY-MM-DD HH:mm:ss')
// console.log(time1)


let aNumber = 0.11
console.log(aNumber.toFixed(2))
