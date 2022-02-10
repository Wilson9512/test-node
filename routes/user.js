const express = require('express');
const db = require('../modules/connect-mysql');
const upload = require('./../modules/upload-images');

const router = express.Router();

async function getListData(req, res) {
    const perPage = 5;//一頁幾筆
    //用戶要看第幾頁
    let page = req.query.page ? parseInt(req.query.page) : 1;
    if (page < 1) {
        return res.redirect('/user/list');
    }//頁數合理規則
    const conditions = {}; //傳到 ejs 的條件
    let search = req.query.search ? req.query.search.trim() : '';//trim去掉頭尾空白
    let sqlWhere = ' WHERE 1 ';
    if (search) {
        sqlWhere += ` AND \`user_id\` LIKE ${db.escape('%' + search + '%')} `;
        conditions.search = search;
    }
    //輸出
    const
        output = {
            //success: false,
            perPage,
            page,
            totalRows: 0,
            totalPages: 0,
            rows: [],
            conditions
        };

    const t_sql = `SELECT COUNT(1) num FROM user ${sqlWhere}`;
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    //let totalPages = 0;
    if (totalRows) {
        output.totalPages = Math.ceil(totalRows / perPage);
        output.totalRows = totalRows;
        if (page > output.totalPages) {
            //到最後一頁
            return res.redirect(`/user/list?page=${output.totalPages}`);
        }

        const sql = `SELECT * FROM user ${sqlWhere} ORDER BY \`user_id\` DESC LIMIT ${perPage*
        (page-1)}, ${perPage}`;
        const [rs2] = await db.query(sql);
        //拿到資料在這邊先做格式轉換
        //rs2.forEach(el => el.member_bir = res.locals.toDateString(el.member_bir));
        output.rows = rs2;
    }
    return output;
}

router.get('/', async (req, res) => {
    res.redirect('user/list')
});
router.get('/list', async (req, res) => {
    res.render('user/list', await getListData(req, res));
});
router.get('/api/list', async (req, res) => {
    res.json(await getListData(req, res));
});
router.get('/add', async (req, res) => {
    res.render('user/add');
});
// multipart/form-data
router.post('/add2', upload.none(), async (req, res) => {
    res.json(req.body);
});
//application/xxx-form-urlencoded
//application/json
router.post('/add', async (req, res) => {
    const output = {
        success: false,
        error: ''
    };
    // const sql = "INSERT INTO user SET ?";
    // const obj = {...req.body, user_time: new Date()};
    //
    // const [result] = await db.query(sql, [obj]);
    // console.log(result);
    //
    // res.json(result);
    //INSERT INTO `user`(`user_id`,`user_account`,`user_pass`,`user_time`) VALUES('17', 'frfrfr@gmail.com', 'memem', NOW());
    const sql = "INSERT INTO `user`(`user_id`,`user_account`,`user_pass`,`user_time`) VALUES(?, ?, ?, NOW())";
    const [result] = await db.query(sql, [
        req.body.user_id,
        req.body.user_account,
        req.body.user_pass,

    ]);
    console.log(result);
    output.success = !!result.affectedRows;
    output.result = result;

    res.json(output);
});
router.get('/delete/:user_id', async (req, res)=>{
    const sql = "DELETE FROM user WHERE user_id=?";
    const [result] = await db.query(sql, [req.params.user_id]);
    res.redirect('/user/list');
});

router.get('/edit/:user_id', async (req, res)=>{
    const sql = "SELECT * FROM user WHERE user_id=?";
    const [rs] = await db.query(sql, [req.params.user_id]);

    if (! rs.length){
        return res.redirect('/user/list');
    }
    res.render('user/edit', rs[0]);
});

router.post('/edit/:user_id', async (req, res)=>{
    const output = {
        success: false,
        error: ''
    };

    const sql = "UPDATE user SET ? WHERE user_id=?";

    const [result] = await db.query(sql, [req.body, req.params.user_id]);

    console.log(result);
    output.success = !! result.changedRows;
    output.result = result;

    res.json(output);
});

module.exports = router;