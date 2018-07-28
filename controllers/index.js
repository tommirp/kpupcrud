const 
    express = require('express'),
    router = express.Router(),
    moment = require('moment');

var MysqlJson = require('mysql-json');
var mysqlJson = new MysqlJson({
    host:'db4free.net',
    user:'justkidding',
    password:'bercanda',
    database:'justkiddingdb'
});

const authCheck = (session) => {
    if (session) {
        let dateToken = "fe9h9f2g4ubg"+moment().format("DDMMYYYY")+"iewf9h9394g924w8gvbgn34og";
        if (session.token == dateToken) return true;
        else return false;
    } else return false;
}

const bodyToUpdateMysql = (data) => {
    let result = "";
    let cntn = Object.keys(data);
    cntn.forEach( function(c, i) {
        if (i==0) result += c+"="+"'"+data[c]+"'";
        else result += ", "+c+"="+"'"+data[c]+"'";
    });
    return result;
};

router.get('/', async(req, res, next) => {
    if (!authCheck(req.session)) res.redirect('/logout');
    else {
        if (req.query.do == 'detail') {
            mysqlJson.query("SELECT * FROM data WHERE id = "+req.query.id, function(err, response) {
                console.log(err);
                
                mysqlJson.query("SELECT * FROM sta WHERE data_ref = "+req.query.id, function(err, response_sta) {                    
                    res.render('detail', { data: response[0], sta: JSON.stringify(response_sta) });
                });
            });
        } else if (req.query.do == 'delete') {
            mysqlJson.query("DELETE FROM data WHERE id = "+req.query.id, function(err, response) {
                console.log(err);
                res.redirect('/');
            });
        } else if (req.query.do == 'add') {
            res.render('add');
        } else {
            mysqlJson.query("SELECT * FROM data", function(err, response) {
                console.log(err);
                res.render('index', { data: response });
            });
        }
    }
});
router.post('/', async(req, res, next) => {    
    if (!authCheck(req.session)) res.redirect('/logout');
    else {
        if (req.query.do == 'edit') {
            mysqlJson.query("UPDATE data SET "+bodyToUpdateMysql(req.body)+" WHERE id = "+req.query.id, function(err, response) {
                console.log(err);
                res.redirect('/');
            });
        } else {
            let valus = '';
            let i = 0
            for (var key in req.body) {
                if(i==0) valus = "'"+req.body[key]+"'";
                else valus = valus+", '"+req.body[key]+"'";
                i++;
            }
            mysqlJson.query("INSERT INTO data ("+Object.keys(req.body).toString()+") VALUES ("+valus+")", function(err, response) {
                console.log(err);
                res.redirect('/');
            });
        }
    }
});

router.get('/login', async(req, res, next) => {
    req.session.unlocked = null;
    req.session.token = null;
    res.render('login');  
});
router.post('/login', async(req, res, next) => {
    // let dynamicPass = moment().format("DDMMYYYY")+'123';
    let dynamicPass = '123';
    if(req.body.username == 'admin' && req.body.password == dynamicPass) {
        req.session.token = "fe9h9f2g4ubg"+moment().format("DDMMYYYY")+"iewf9h9394g924w8gvbgn34og";
        req.session.unlocked = true;
        res.redirect('/');
    } else res.redirect('/logout');
});

router.get('/logout', async(req, res, next) => {
    req.session.unlocked = null;
    req.session.token = null;  
    res.redirect('/login');  
});

module.exports = router;