const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://root:root123@cluster0.spnfw8e.mongodb.net/urlShort');
const {UrlModel} = require('./models/url-model');

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function(req,res){
    let allUrls = UrlModel.find().then(function(allUrlData){
     res.render('home',{
        allUrlData
     });
    }).catch(function(err){
        console.log(err)
    })
});

app.post('/create',function(req,res){
    let myRandNumer = Math.floor(Math.random() * 10000);
    let newUrlShort = new UrlModel({
        longUrl : req.body.longUrl,
        shortUrl : myRandNumer
    })
    newUrlShort.save().then(function(savedData){
        res.redirect('/');
    }).catch(function(err){
        console.log(err)
    });

});
app.get("/:shortId",function(req, res){
    UrlModel.findOne({ shortUrl: req.params.shortId })
    .then(function(data) {
        UrlModel.findByIdAndUpdate({_id: data.id},{ $inc: {  clickCount:1 } })
        .then(function(updateData) {
            res.redirect(data.longUrl);
        })
        .catch(function(err) {
            console.log(err);
        });
    })
    .catch(function(err) {
        console.log(err);
    });
});

app.get('/delete/:id',function(req,res){
    UrlModel.findByIdAndDelete({_id:req.params.id}).then(function(data){
        res.redirect('/')
    }).catch(function(err){
        console.log(err);
    })
})

app.listen(4000,function(){
    console.log('the app is listining in port 4000')
});