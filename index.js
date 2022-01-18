require('dotenv').config();//載入 .env的設定

const express = require('express');

const app = express();

app.set('view engine', 'ejs');

//拿到中介函式/軟體//放在此處變Top-level middleware 像過濾器或是閘門
app.use(express.urlencoded({extended: false}));//use是所有的方法都會進來
app.use(express.json());
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


//中介函式用在post 當第二個參數 第三個才是處理器/回呼函式
//express會判斷Content-Type現在需要哪個middleware處理
app.post('/try-post',(req,res) =>{
    res.json(req.body);
});

app.get('/try-post-form',(req,res) =>{
    res.render('try-post-form',{email:'',password:''});
});

app.post('/try-post-form',(req,res) =>{
    res.render('try-post-form',req.body);
});

// *** 路由定義結束:END

//設定404頁面
app.use((req, res) => {
    res.status(404).send(`<h1>找不到這頁</h1>`)
})


let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`NODE_ENV:${process.env.NODE_ENV}`);
    console.log(`啟動:${port}`, new Date());
});