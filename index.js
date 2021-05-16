const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000
const { MongoClient } = require("mongodb");
const e = require('express');
// Connection URI
const uri =
  "mongodb://localhost:27017";
  let dbName = 'udaan';
// Create a new MongoClient
try{
const client = new MongoClient(uri);
//console.log(client);
}catch(e){
    console.log(e);
}
app.post('/saveQuiz', (req, res) => {
  if(req.body && req.body.quiz){
    MongoClient.connect(uri, function(err, client) {
        const quiz = client.db(dbName).collection('quiz');
        let quizObj = req.body.quiz;
        let quizModel = {
            quizName : quizObj.quizName,
            questions: quizObj.questions
        };
        quiz.insertOne(quizModel, function(err, result) {
            if(err){
                res.send({status: false, error: err});
            }
            res.send({status: true, error: null})
        });
    });
  } else {
    res.send({status: false, error:'Parameter Missing'});
  }
})
// DB referencing
app.post('/saveQuestions', (req, res) => {
    if(req.body && req.body.question){
        let questionObj =  req.body.question;
      MongoClient.connect(uri, function(err, client) {
          const question = client.db(dbName).collection('question');
           let questionModel = {
              question : questionObj.question,
              answer: questionObj.answer
          };
          question.insertOne(questionModel, function(err, result) {
            if(err){
                res.send({status: false, error: err});
            }
            res.send({status: true, error: null})
          });
      });
    } else {
        res.send({status: false, error:'Parameter Missing'});
    }
  })

  app.get('/qetQuizes/:page', (req, res) => {
      MongoClient.connect(uri, function(err, client) {
          const question = client.db(dbName).collection('quiz');
          let skip = 0;
          let per_page_items = 1;
          if(req.params.page>=1){
              skip = (req.params.page-1)*per_page_items;
          } else {
            return res.send({status: false, error: 'Invalid Page'});
          }
          question.find({}).skip(skip).limit(1).toArray(function(err, items) {
              console.log(items);
            if(err){
                res.send({status: false, error: err});
            }
            res.send({status: true, error: null, data: items})
          });
      });
  })

  app.post('/saveResponse', (req, res) => {
    if(req.body && req.body.response){
      MongoClient.connect(uri, function(err, client) {
          const response = client.db(dbName).collection('response');
          let responseObj = req.body.response;
          let responseModel = {
              emailId : responseObj.emailId,
              response: []
          };
          responseObj.responses.forEach(each => {
            responseModel.response.push({question: each.question, response: each.response});
          });
          response.insertOne(responseModel, function(err, result) {
              if(err){
                  res.send({status: false, error: err});
              }
              res.send({status: true, error: null})
          });
      });
    } else {
      res.send({status: false, error:'Parameter Missing'});
    }
  })



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})