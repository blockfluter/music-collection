var express = require('express');
var router = express.Router();
var Storage = require('../server/storage');

var db = new Storage();

const pageTitle = 'Music Catalog';

const save = (body) => {
  db.add(body);
  db.save();
};

const update = (body) => {
  db.update(body);
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
const nullform = {
  id: '',
  title: '',
  composer: '',
  period: '',
  voicing: '',
  edition:''
}
const pageData = (formvalues) => {
  return {
    values: formvalues,
    title: pageTitle,
    composers: composers(),
    titles: titles(),
    voicings: voicings(),
    editions: editions(),
    periods: periods(),
    data: db.data,
    filter: db.filter,
    sort: db.sort
  };
}

router.get('/', function (req, res, next) {
  res.render('index', pageData(nullform));
});

router.get('/sort', function (req, res, next) {
  db.setSort(req.query);
  res.render('index', pageData(nullform));
});

router.post('/add', function (req, res, next) {
  save(req.body);
  res.render('index', pageData(req.body));
});

router.post('/update', function (req, res, next) {
  update(req.body);
  res.render('index', pageData(req.body));
});

router.post('/setfilter', function (req, res, next) {
  db.setFilter(req.body);
  res.render('index', pageData(nullform));
});

router.post('/clearfilter', function (req, res, next) {
  db.clearFilter();
  res.render('index', pageData(req.body));
});

module.exports = router;
