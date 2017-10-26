var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var util = require('./util');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.post('/authorize', util.getAuthorization);
app.get('/accesstoken', util.getAccessToken);
app.post('/usertimeline', util.getUserTimeline);
app.listen(3000);