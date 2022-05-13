const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB");
app.use(bodyParser.urlencoded({extended: true}));

const articleSchema = new mongoose.Schema({
      title: String,
      content: String
});

const Article = new mongoose.model("Article", articleSchema);

// getting all the articles
//
// app.get("/articles", function(req,res){
//
//     Article.find({}).exec( function(err,articles){
//             if(err) {
//               res.send(err);
//             }else{
//               res.send(articles);
//             }
//     });
// });
//
// // post request to insert an article into the database
//
// app.post("/articles", function(req,res){
//     const newArti = new Article({
//             title: req.body.title,
//             content: req.body.content
//     });
//     newArti.save(function(err){
//             if(err){
//               res.send(err);
//             }else{
//               res.send("Article successfully added!");
//             }
//     });
// });
//
// // deleting all the articles
//
// app.delete("/articles", function(req,res){
//     Article.deleteMany({}, function(err){
//        err ? res.send(err) : res.send("Deleted all the articles!");
//     });
// });

// using chained routing to reduce the code to perform the achieve functionality as above

app.route("/articles")
.get( function(req,res){

    Article.find({}).exec( function(err,articles){
            if(err) {
              res.send(err);
            }else{
              res.send(articles);
            }
    });
})
.post(function(req,res){
    const newArti = new Article({
            title: req.body.title,
            content: req.body.content
    });
    newArti.save(function(err){
            if(err){
              res.send(err);
            }else{
              res.send("Article successfully added!");
            }
    });
})
.delete(function(req,res){
    Article.deleteMany({}, function(err){
       err ? res.send(err) : res.send("Deleted all the articles!");
    });
});

app.route("/articles/:articleTitle")
.get(function(req,res){

    Article.findOne({title: req.params.articleTitle}, function(err,art){
            if(err){
              res.send(err);
            }else{
              res.send(art);
            }
    });
})
.put(function(req,res){

     Article.Update(
       {title: req.params.articleTitle},
       {title: req.body.title, content: req.body.content},
       {overwrite: true},
       function(err){
         if(err) res.send(err);
         else res.send("Successfully upadted the article.");
       }
     );
})
.patch(function(req,res){

     Article.update(
       {title: req.params.articleTitle},
       {$set: req.body},
       function(err){
         if(err) res.send(err);
         else res.send("Successfully updated the article.");
       }
     )
})
.delete(function(req,res){

    Article.deleteOne({title: req.params.articleTitle}, function(err){
        err ? res.send(err) : res.send("Deleted the article!");
    });
})

app.listen(3000, function(){
  console.log("Server started at 3000");
});
