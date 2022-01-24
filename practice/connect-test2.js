const db = require('./../modules/connect-mysql');

db.query(
    "SELECT * FROM member LIMIT 2,3")
    .then(([r]) => { //array攤開來放入箭頭函式
        console.log(r);
        process.exit();
    })
    .catch(ex => {
        console.log(ex);
    })