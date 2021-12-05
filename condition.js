let sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./SQlite/SQlite.db')


exports.show = function (response, callback) {
    new Promise((res, rej) => {
        db.all("SELECT * FROM Database", [], (err, rows) => {
            if (err) {
                rej()
            }
            res(rows)
        })
    }).then(function (rows) {
        callback(rows)
    }, function () {
        response.status(500).send('Error')
    })

}





exports.match = function (req, response, callback) {
    let email = req.body.email;
    let name = req.body.nickname;
    let password = req.body.password
    let isName = "SELECT * FROM Users WHERE name ='" + name + "'";
    let isEmail = "SELECT * FROM Users WHERE email   ='" + email + "'";
    new Promise((res, rej) => {
        db.all(isName, [], (err, rows) => {
            if (err) {
                response.status(500).send('Error')
            }
            if (rows.length === 0) {
                res()
            }
            else {
                //失败
                rej()
            }
        })
    }).then(function () {
        db.all(isEmail, [], (err, rows) => {
            if (err) {
                response.status(500).send('Error')
            }
            if (rows.length === 0) {
                //创建成功 
                let insert = "INSERT INTO Users(email, name, password) VALUES(?, ?, ?)"
                db.run(insert, [email, name, password], function (err) {
                    if (err) {
                        response.status(500).send('Error')
                    }
                    response.render('index.html', {
                        nickname: name,
                        logIn: true,
                        logOut: false
                    })

                })
            }
            else {
                //失败
                callback()
            }
        })
    }, function () {
        //失败
        callback()
    })
}


exports.log = function (response, isMatch, callback) {
    new Promise((res, rej) => {
        db.all(isMatch, [], (err, rows) => {
            if (err) {
                response.status(500).send('Error')
            }
            if (rows.length === 0) {
                rej()
            } else {
                console.log(rows)
                res(rows)
            }
        })
    }).then(function (onerows) {
        db.all("SELECT * FROM Database", [], (err, rows) => {
            if (err) {
                response.status(500).send('Error')
            }
            callback(onerows, rows)
        })
    }, function () {
        response.render('login.html', {
            isError: true,

        })
    })
}





exports.del = function (req, response) {
    let name = req.body.name
    console.log(name)
    new Promise((res, rej) => {
        db.run("DELETE FROM Database WHERE name=?", name, function (err) {
            if (err) {
                response.status(500).send('Error')
            }
            res()
        })
    }).then(function () {
        db.all("SELECT * FROM Database", [], (err, rows) => {
            if (err) {
                response.status(500).send('Error')
            }
            response.render('index.html', {
                target: rows,
                logIn: false,
                logOut: true
            })
        })
    })
}


exports.post = function (req, res, callback) {
    let name = req.body.name;
    let title = req.body.title;
    let content = req.body.content;
    let temp = Date.now()
    let date = temp.toLocaleString( )

    console.log(title,name,date)
    new Promise((response, reject) => {
        let insert = "INSERT INTO Database(name, content, title, date) VALUES(?, ?, ?, ?)"
        db.run(insert, [name, content, title, date], function (err) {
            if(err){
                res.status(500).send('Error')
            }
            response()
        })
        }).then(function(){
            db.all("SELECT * FROM Database", [], (err, rows) => {
                if (err) {
                    response.status(500).send('Error')
                }
                callback(name, rows)
            })
        })
    }