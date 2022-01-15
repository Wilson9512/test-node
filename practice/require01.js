
const f1 = require('./arrow-func');
const f2 = require(__dirname + '/arrow-func');
console.log('2:',__dirname);


console.log(f1(9));
console.log(f2(10));