const fs = require('fs');

const data = {
    name:'Wil',
    age: 26
};

fs.writeFile(
    'data.json',
    JSON.stringify(data, null, 4),
    error => {
        if(error){
            console.log('無法寫入檔案');
            process.exit();// 結束程式
        }
        console.log('寫入成功');
    });