var express = require('express');
var router = express.Router();
var Storage = require('../server/storage');

var db = new Storage();

const pageTitle = 'Music Collection';

const save = (body) => {
  db.add({ title: body.title, composer: body.composer, voicing: body.voicing, edition:body.edition });
  db.save();
};

const composers = () => {
  return [...new Set(db.data.map(item => item.composer))];
}
const titles = () => {
  return [...new Set(db.data.map(item => item.title))];
}
const voicings = () => {
  return [...new Set(db.data.map(item => item.voicing))];
}
const editions = () => {
  return [...new Set(db.data.map(item => item.edition))];
}

const sortdata = (params) => {
  var { key, direction } = params;
  console.log('sort', key);
  if (key === '')
    return db.data;
  return db.data.sort((a, b) => {
    console.log('sorting', a[key], b[key]);
    
    return a[key].localeCompare(b[key]);  
  });
}
const params = (params) => {
  return { ...params, title: pageTitle, composers: composers(), titles: titles(), voicings:voicings(), editions:editions(), data:sortdata(params) };
}
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', params({key:''}));
});
router.get('/sort', function (req, res, next) {
  res.render('index', params(req.query));
});

router.post('/', function (req, res, next) {
  save(req.body);
  res.render('index', params({key:''}));
});

module.exports = router;
