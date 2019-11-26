
var fs = require('fs');

var Storage = function (opts) {
	var defaults = {
		'file': './data/default.json'
	};
	let _data = [];
	let _sort = [];

	let _filter = null;

	const options = { ...defaults, ...opts };

	const validate = (obj) => {
		return options.validate(obj);
	}

	const add = (obj) => {
		const tmp = _data.map(item => {
			return { ...item, status: 0 }
		});
		const findIndex = (obj) => {
			return tmp.findIndex(item => options.equal(item, obj));
		}
		if (validate(obj)) {
			const index = findIndex(obj);
			const id = tmp.length ? Math.max(...tmp.map(item => item.id)) + 1 : 1;

			if (index < 0) {
				_data = [...tmp, { ...obj, id, status: 1 }]
			} else {
				_data = [
					...tmp.slice(0, index),
					{ ...obj, status: 1 },
					...tmp.slice(index + 1)]
			}
		}
	}

	const update = (obj) => {
		const tmp = _data.map(item => {
			return { ...item, status: 0 }
		});
		const findIndex = (obj) => {
			return tmp.findIndex(item => {
				return item.id == obj.id;
			});
		}
		if (validate(obj)) {
			const index = findIndex(obj);
			if (index >= 0) {
				_data = [
					...tmp.slice(0, index),
					{ ...obj, status: 1 },
					...tmp.slice(index + 1)]
			}
		}

	}

	const setSort = (params) => {
		_sort = { ...params };
	}

	const setFilter = (filter) => {
		_filter = { ...filter };
	}

	const clearFilter = (filter) => {
		_filter = null;
	}

	const del = (num) => {
		throw Error('not implemented');
	}

	const save = () => {
		const mapped = _data.map(v => options.persist(v));
	
		fs.writeFile(options.file,
			JSON.stringify(mapped, undefined, 2),
			(err) => {
				console.log(err);
			});
	}

	const load = () => {
		_data = JSON.parse(fs.readFileSync(options.file).toString());
	}

	Object.defineProperty(this, "data", {
		get: () => {
			var { key, order } = _sort;
			if (key === '') {
				key = 'id'
			}
			return [
				..._data.filter(item => {
					return !_filter || options.filters(_filter, item)
				}).sort((a, b) => {
					if (order === 'dec') {
						return typeof a[key] === 'string' && typeof b[key] === 'string' ? b[key].localeCompare(a[key]) : b[key] - a[key];
					} else {
						return typeof a[key] === 'string' && typeof b[key] === 'string' ? a[key].localeCompare(b[key]) : a[key] - b[key];
					}
				})
			];
		}
	});
	Object.defineProperty(this, "filter", {
		get: () => {
			return _filter ? { ..._filter } : null;
		}
	});
	Object.defineProperty(this, "sort", {
		get: () => {
			return _sort ? { ..._sort } : { key: 'id', order: 'dec' };
		}
	});

	this.__proto__ = {
		...this.__proto__,
		save,
		load,
		add,
		update,
		setSort,
		setFilter,
		clearFilter
	}

	if (fs.existsSync(options.file)) {
		load();
	} else {
		save();
	}
}

module.exports = Storage;
