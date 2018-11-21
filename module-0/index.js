const express = require('express')
const nunjucks = require('nunjucks')

const app = express();


const ageMiddleware = (req, res, next) => {
    if(!req.query.age){
        res.redirect('/');
    }else{
        return next();
    }  
}

app.set('view engine', 'njk');
app.use(express.urlencoded({ extended : false }))

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});

app.get('/',( req, res ) => {
    res.render('form');
});

app.post('/check',(req, res) => {
    if( req.body.age >= 18 ){
        res.redirect(`major/?age=${age}`)
    }else{
        res.redirect(`minor/?age=${age}`)
    }
})

app.get('/major', ageMiddleware, ( req, res ) => {
    res.render('major',{ age: req.query.age });
})

app.get('/minor', ageMiddleware, ( req, res ) => {
    res.render('minor',{ age: req.query.age });
})

app.listen(3000);