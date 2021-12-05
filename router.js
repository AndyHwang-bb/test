let express = require('express')
let router = express.Router()
let con = require('./condition')



router.get('/', (req, res) => {
    con.show(res, (rows)=>{
        console.log(rows)
        res.render('index.html', {
            target: rows,
            logIn: false,
            logOut: true
        })
    })
})

router.post('/post', (req, res)=>{
    res.render('post.html', {
        nickname: req.body.name
    })
})

router.post('/posting', (req, res)=>{
    con.post(req, res, function(name, rows){
        res.render('index.html', {
            nickname: name,
            target: rows,
            logOut:false,
            logIn:true
            
        })
    })
})


router.get('/register', (req, res) => {
    res.render('register.html')
})

router.post('/register', (req, res) => {
    con.match(req, res , function(){
        res.render('register.html', {
            isUncreated : true,
        })
    })
})

router.get('/login', (req, res) => {
    res.render('login.html')
})

router.post('/log', (req, res) => {
    let email = req.body.email
    let password= req.body.password;
    let isMatch = "SELECT * FROM Users WHERE password ='" + password + "' AND email = '" + email + "'";
    con.log(res, isMatch, function(onerows, rows){
        res.render('index.html', {
            nickname: onerows[0].name,
            target: rows,
            logOut:false,
            logIn:true
        })
    })
})

router.post('/delete', (req, res)=>{
    con.del(req, res)
})


module.exports = router