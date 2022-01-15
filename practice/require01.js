
const {f1,f3} = require('./arrow-func'); //相對路徑
const f2 = require(__dirname + '/arrow-func'); //傳統寫法
console.log('2:',__dirname);


console.log(f1(9));
// console.log(f2(10));
console.log(f3(10));
console.log(f2.f1(5));
console.log(f2.f3(5));