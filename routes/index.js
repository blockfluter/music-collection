var express = require('express');
var router = express.Router();
var Storage = require('../server/storage');

var db = new Storage({
  validate: (obj) => {
    return '' !== obj.title
      && '' !== obj.voicing
      && '' !== obj.composer
      && '' !== obj.edition
      && '' !== obj.period
  },
  equal: (a, b) => {
    return a.title === b.title
      && a.voicing === b.voicing
      && a.composer === b.composer
      && a.edition === b.edition
      && a.period === b.period
  },
  persist: (v) => {
    return {
      id: v.id,
      title: v.title,
      composer: v.composer,
      voicing: v.voicing,
      edition: v.edition,
      period: v.period
    };
  },
  filters: (_filter, item) => {
    const filterTest = (v1, v2) => {
      if (!v1)
        return true;
      return new RegExp(`${v1}`, 'i').exec(v2);
    }
    return filterTest(_filter.composer, item.composer)
      && filterTest(_filter.voicing, item.voicing)
      && filterTest(_filter.title, item.title);
  }

});

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
  return [...new Set(db.data.map(item => item.composer))].sort();
}
const titles = () => {
  return [...new Set(db.data.map(item => item.title))].sort();
}
const voicings = () => {
  return [...new Set(db.data.map(item => item.voicing))].sort();
}
const editions = () => {
  return [...new Set(db.data.map(item => item.edition))].sort();
}
const periods = () => {
  return [...new Set(db.data.map(item => item.period))].sort();
}
const nullform = {
  id: '',
  title: '',
  composer: '',
  period: '',
  voicing: '',
  edition: ''
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
