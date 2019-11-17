var express = require('express');
var router = express.Router();
var Storage = require('../server/storage');

var db = new Storage();

const pageTitle = 'Music Collection';

const save = (body) => {
  db.add({
    title: body.title,
    composer: body.composer,
    voicing: body.voicing,
    edition: body.edition,
    period: body.period
  });
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
const periods = () => {
  return [...new Set(db.data.map(item => item.period))];
}

const params = (params) => {
  return {
    ...params,
    title: pageTitle,
    composers: composers(),
    titles: titles(),
    voicings: voicings(),
    editions: editions(),
    periods: periods(),
    data: db.sortdata(params)
  };
}
/* GET home page. */
const values = {
  composer: '',
  voicing: '',
  period: '',
  edition: '',
  title: ''
}
router.get('/', function (req, res, next) {
  res.render('index', params({ key: '' }));
});
router.get('/sort', function (req, res, next) {
  res.render('index', params({ ...req.query, values }));
});

router.post('/', function (req, res, next) {
  save(req.body);
  res.render('index', params({ key: '', values: req.body }));
});

module.exports = router;
