require('dotenv').config();//載入 .env的設定

const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const upload = multer({dest: 'tmp_uploads/'});
const uploadImg = require('./modules/upload-images');

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
    res.render('home', {name: 'Wil'});
});//路徑跟方法

app.get('/json-sales', (req, res) => {
    const sales = require('./data/sales');
    // console.log(sales);
    // res.json(sales);
    res.render('json-sales', {sales});//將路由名稱取為樣板名
});

app.get('/try-qs', (req, res) => {
    res.json(req.query);
});

//中介函式用在post 當第二個參數 第三個才是處理器/回呼函式
//express會判斷Content-Type現在需要哪個middleware處理
app.post('/try-post', (req, res) => {
    res.json(req.body);
});

app.get('/try-post-form', (req, res) => {
    res.render('try-post-form', {email: '', password: ''});
});

app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
});

app.get('/pending', (req, res) => {
});

app.post('/try-upload', upload.single('avatar'), async (req, res) => {
//avatar是上傳單個檔案的欄位名稱 //用postman測試
    if (req.file && req.file.mimetype === 'image/jpeg') {
        try {
            //promise物件await放在這邊 async放在handler前面
            await fs.rename(req.file.path, __dirname + '/public/img/' + req.file.originalname)
            res.json({success: true, filename: req.file.originalname});
        } catch (ex) {//例外情況
            res.json({success: false, error: '無法存檔', ex});
        }
    } else {//比較嚴重的錯誤情況
        await fs.unlink(req.file.path); //刪除暫存檔
        res.json({success: false, error: '格式不對'});
    }
});

app.post('/try-upload2', uploadImg.single('avatar'), async (req, res) => {
    res.json(req.file);
});

app.post('/try-upload3', uploadImg.array('photo', 10), async (req, res) => {
    res.json(req.files);
});

//加反斜線是要跳脫\d
app.get('/my-params1/:action?/:id(\\d+)?', (req, res) => {
    res.json(req.params);
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
    let u = req.url.split('?')[0];//url的?後面參數都不要
    u.slice(3);
    u = u.split('-').join('');
    res.json({
        url: req.url,
        mobile: u
    });
});

app.use(require('./routes/admin2'));//路由模組：當中介器require來用

// *** 路由定義結束:END

//設定404頁面
app.use((req, res) => {
    res.status(404).send(`<h1>找不到這頁</h1>`)
})


let port = process.env.PORT || 3000;
const node_env = process.env.NODE_ENV || 'development';
app.listen(port, () => {
    console.log(`NODE_ENV:${node_env}`);
    console.log(`啟動: ${port}`, new Date());
});