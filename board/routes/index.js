var express = require('express');
var router = express.Router();
global.moment = require("moment")

/* GET home page. */
router.get('/', async function (req, res, next) {
  var names = [
    "진용화", "이장호", "정필성", "홍길동"
  ]
  var [rows] = await connection.query("select * from board order by writeDate desc")
  res.render("index", { list: rows })

  /*
  connection.query("select * from board").then(rows => {
    res.render('index', { title: 'Express', names: names, list: rows[0] });
  })
  */
});

router.get("/write", function (req, res) {
  res.render("write")
})
router.post("/board/write", async function (req, res) {
  console.log(req.body)

  await connection.query("insert into board(title,writer,body) values(?,?,?)",
    [req.body.title, req.body.writer, req.body.body])

  res.redirect("/")

})
router.get("/board/:no", async function (req, res) {
  var [rows] = await connection.query("select * from board where no=?", [req.params.no])
  var board = rows[0]
  board.hits++
  await connection.query("update board set hits=? where no=?", [board.hits, req.params.no])

  res.render("view", { board: board })
})

router.get("/board/delete/:no", async function (req, res) {
  await connection.query("delete from board where no=?", [req.params.no])
  res.redirect("/")
})
router.get("/board/modify/:no", async function (req, res) {
  var [rows] = await connection.query("select * from board where no=?", [req.params.no])
  res.render("modify", { board: rows[0] })
})

router.post("/board/modify", async function (req, res) {
  console.log(req.body)
  var query = "update board set title=?,writer=?,body=? where no=?"
  await connection.query(query, [req.body.title, req.body.writer, req.body.body, req.body.no])
  res.redirect("/board/" + req.body.no)
})


module.exports = router;