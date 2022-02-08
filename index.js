require('dotenv').config();//載入 .env的設定

const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session); //require('express-mysql-session')是一個function
const moment = require('moment-timezone');
//const upload = multer({dest: 'tmp_uploads/'});//上傳目的地設定
const upload = require('./modules/upload-images');
const db = require('./modules/connect-mysql');
const sessionStore = new MysqlStore({}, db); //object本來要設定連線資料庫的設定,現在可以透過套件直接連線到資料庫了

const app = express();

//設定(set)樣版引擎,使用views資料夾名不用另外設定
app.set('view engine', 'ejs');
//Top-level middleware
//拿到中介函式/軟體//像過濾器或是閘門//use是不管什麼方法都接收
// const urlencodedParser = express.urlencoded({extended: false});
app.use(express.urlencoded({extended: false}));//use是所有的方法都會進來
app.use(express.json());//如果http body 送的是json 這個會負責解析json
app.use(express.static('public'));//靜態內容資料夾設定

app.use(session({
    name: 'mySessionId',
    saveUninitialized: false, //初始化設定:新用戶沒有用到session時要不要建立session跟發送cookie
    resave: false,//沒有變更要不要強制回存
    secret: 'fdgopwerkgwerkpoqgbinwoqgrrgdg599wet3zws',
    cookie: {
        maxAge: 1800000, //30分鐘--ms
        //設定用戶cookie什麼時候過期
    },
}));

//自訂的 頂層 middleware
app.use((req, res, next) => {
    res.locals.wil = '哈囉';
    //res.send('oooo'); //回應之後,不會往下個路由規則
    next();
})

app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

app.use((req, res, next) => {
    res.locals.title = '小網站';
    next();
});

// *** 路由定義開始 :BEGIN

app.get('/', (req, res) => {
    res.locals.title = '首頁 -' + res.locals.title;
    //res.send(`<h2>Hello</h2>`)
    res.render('home', {name: 'Wil'});
});//路徑跟方法

app.get('/json-sales', (req, res) => {
    const sales = require('./data/sales');//進來變成陣列
    // console.log(sales);
    // res.json(sales[0].name);//要輸入數字要加''
    /* 排序
    req.query.orderByCol=age;
    const col = 'age';
    col.sort((a,b)=>{
    });
    req.query.orderByRule=desc;
    */
    const orderByRule = req.query.orderByCol = 'desc';
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
    res.render('try-post-form', {email: '', passworwd: ''});
});
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
});

app.get('/pending', (req, res) => {
});

/*app.post('/try-upload', upload.single('avatar'), async (req, res) => {
//avatar是上傳單個檔案的欄位名稱 //用postman測試 //promise不要用try catch
    const type = ['image/jpeg','image/png'];
    const f = req.file;
    if (f && f.mimetype === type) {
        try {
            //promise物件await放在這邊 async放在handler前面
            //變更路徑相當於搬移檔案反之叫unlink
            await fs.rename(req.file.path, __dirname + '/public/img/' + f.originalname)
            res.json({success: true, filename: f.originalname});
        } catch (ex) {
            //例外情況
            res.json({success: false, error: '無法存檔', ex});
        }
    } else {
        //比較嚴重的錯誤情況
        await fs.unlink(req.file.path); //刪除暫存檔
        res.json({success: false, error: '格式不對'});
    }
});
*/
//upload呼叫完single或是array才算是一個middleware
app.post('/try-upload2', upload.single('avatar'), async (req, res) => {
    res.json(req.file);
});

app.post('/try-upload3', upload.array('photo', 10), async (req, res) => {
    //安全性考量只需將mimetype,filename,size給前端
    //element這個參數拿到整個物件
    //第一種寫法
    /*const result = req.files.map(element =>{
        return {
            "mimetype": element.mimetype,
            "filename": element.filename,
            "size": element.size
        }
    });
    */

    //第二種寫法
    //展開變成區域變數回傳包成物件
    const result = req.files.map(({mimetype, filename, size}) => {
        return {mimetype, filename, size};
    });

    res.json(result);
});

//加反斜線是要跳脫\d
app.get('/my-params1/:action?/:id(\\d+)?', (req, res) => {
    res.json(req.params);//params(參數的縮寫)
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
    let u = req.url.split('?')[0];//url的?後面參數都不要避免手機號碼後面增加query string//split切出來變array
    u.slice(3);//弄掉/m/,從索引值3到最後
    //u = u.split('-').join('');//弄掉dash
    u = u.replace(/-/g, '');//能控制要拿掉幾個字串,g即是全拿
    res.json({
        url: req.url,
        mobile: u.slice(3)
    });
});

app.use('/admin2', require('./routes/admin2'));//路由模組：當中介器require來用
app.use('/admin3', require('./routes/admin3'));//路由模組：當中介器require來用
app.use('/member', require('./routes/member'));

app.get('/try-session', (req, res) => {
    //自定一個參數名:不能叫cookie
    req.session.myVar = req.session.myVar || 0;
    req.session.myVar++;
    res.json(req.session);
});

app.get('/try-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';//格式format

    res.json({
        m1: moment().format(fm),
        m2: moment().tz('Europe/Dublin').format(fm),
        m3: moment(req.session.cookie.expires).format(fm),
        m4: moment(req.session.cookie.expires).tz('Europe/Dublin').format(fm),
    });
});

app.get('/try-db', async (req, res) => {
    //問號跟php一樣是為了避免sql injection
    const sql = "SELECT * FROM member LIMIT 5";
    const [rs, fields] = await db.query(sql);
    res.json(rs);
});

// *** 路由定義結束:END

//設定404頁面
app.use((req, res) => {
    res.status(404).send(`<h1>找不到這頁</h1>`)
})


let port = process.env.PORT || 3000;
const node_env = process.env.NODE_ENV || 'development';
app.listen(port, () => {
    console.log(`NODE_ENV:${node_env}`);
    console.log(`啟動: ${port} - `, new Date());
});