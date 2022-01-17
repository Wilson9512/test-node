require('dotenv').config();//載入 .env的設定

const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));


// *** 路由定義開始 :BEGIN


app.get('/', (req, res) => {

    //res.send(`<h2>Hello</h2>`)
    res.render('home',{name:'Wil'})
});//路徑跟方法


app.get('/json-sales',(req,res) =>{
    const sales = require('./data/sales');

    // console.log(sales);
    // res.json(sales);
res.render('json-sales',{sales});//將路由名稱取為樣板名
});
app.get('/try-qs',(req,res) =>{
    res.json(req.query);
});


// *** 路由定義結束:END

app.use((req, res) => {
    res.status(404).send(`<h1>找不到這頁</h1>`)
})


let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`NODE_ENV:${process.env.NODE_ENV}`);
    console.log(`啟動:${port}`, new Date());
});