
const f1 = a=>a*a;
const f3 = a=> [...Array(b - a   1)].map((e, i) => a   i)
Array(b - a   1).fill(' ').map((e, i) => a   i)
[...Array(b - a   1).entries()].map(e => e[0]   a)
[...Array(b - a   1).keys()].map(e => e   a);


console.log(f1(7));
console.log('1:',__dirname);

module.exports = f1; //匯出