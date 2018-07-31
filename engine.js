const 
    express = require('express'),
    app = express(),
    path = require('path'),
    helmet = require('helmet'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cookieSession = require('cookie-session'),
    expressNunjucks = require('express-nunjucks'),
    nunjucks = require('nunjucks');
    compression = require('compression'),
    errorhandler = require('errorhandler'),
    njk = expressNunjucks(app, {
        watch: 'production',
        noCache: 'production'
    }),
    nunjucks_env = new nunjucks.Environment();

//Compression Init
app.use(compression());

//Protection Init
app.use(helmet());
app.disable('etag');
app.disable('x-powered-by');

//View app Init
app.set('views', path.join(__dirname, 'views'));
app.use(cookieSession({
    name: 'rwg5h4jh56j5y',
    keys: ['4h644h64h45hw85h', 'g398gn39un0gq0j0g0g2g']
}));

//Parser & Cookies Init
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if(req.session) res.locals.unlocked = req.session.unlocked;
    next();
});

//Routes & Pages Init
app.use('/', require('./controllers/index'));

//Error Handler Init
app.use((req, res) => {
  res.redirect('/');
});
app.use((err, req, res) => {
  res.status(err.status || 500);
//   console.log(err);
  res.redirect('/');
});

module.exports = app;
