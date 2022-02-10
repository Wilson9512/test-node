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
        sqlWhere += ` AND \`member_name\` LIKE ${db.escape('%' + search + '%')} `;
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

    const t_sql = `SELECT COUNT(1) num FROM member ${sqlWhere}`;
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    //let totalPages = 0;
    if (totalRows) {
        output.totalPages = Math.ceil(totalRows / perPage);
        output.totalRows = totalRows;
        if (page > output.totalPages) {
            //到最後一頁
            return res.redirect(`/member/list?page=${output.totalPages}`);
        }

        const sql = `SELECT * FROM member ${sqlWhere} ORDER BY \`member_id\` DESC LIMIT ${perPage*
        (page-1)}, ${perPage}`;
        const [rs2] = await db.query(sql);
        //拿到資料在這邊先做格式轉換
        rs2.forEach(el => el.member_bir = res.locals.toDateString(el.member_bir));
        output.rows = rs2;
    }
    return output;
}

router.get('/', async (req, res) => {
    res.redirect('member/list')
});
router.get('/list', async (req, res) => {
    res.render('member/list', await getListData(req, res));
});
router.get('/api/list', async (req, res) => {
    res.json(await getListData(req, res));
});
router.get('/add', async (req, res) => {
    res.render('member/add');
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
    /*
    const sql = "INSERT INTO member SET ?";
    const obj = {...req.body, user_id:16,member_level:1};

    const [result] = await db.query(sql, [obj]);
    console.log(result);
     */

    //TODO:資料格式檢查
    const sql = "INSERT INTO `member`(`user_id`,`member_id`,`member_name`,`member_bir`,'member_mob',`member_addr`,`member_level`) " +
        "VALUES(?, ?, ?, ?, ?, ?)"
    const [result] = await db.query(sql, [
        req.body.user_id,
        req.body.member_id || null,
        req.body.member_name,
        req.body.member_bir,
        req.body.member_mob,
        req.body.member_addr,
        req.body.member_level || null,

    ]);
    console.log(result);
    output.success = !!result.affectedRows;
    output.result = result;

    res.json(output);
});
router.get('/delete/:member_id', async (req, res)=>{
    const sql = "DELETE FROM member WHERE member_id=?";
    const [result] = await db.query(sql, [req.params.member_id]);
    res.redirect('/member/list');
});

router.get('/edit/:member_id', async (req, res)=>{
   const sql = "SELECT * FROM member WHERE member_id=?";
   const [rs] = await db.query(sql, [req.params.member_id]);

   if (! rs.length){
       return res.redirect('/member/list');
   }
   res.render('member/edit', rs[0]);
});

router.post('/edit/:member_id', async (req, res)=>{
    const output = {
        success: false,
        error: ''
    };

    const sql = "UPDATE member SET ? WHERE member_id=?";

    const [result] = await db.query(sql, [req.body, req.params.member_id]);

    console.log(result);
    output.success = !! result.changedRows;
    output.result = result;

    res.json(output);
});


module.exports = router;