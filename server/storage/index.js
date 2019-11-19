
var fs = require('fs');

var Storage = function (opts) {
	var defaults = {
		'file': './data/default.json'
	};
	let _data = [];
	let _sort = [];

	let _filter = null;

	const options = { ...defaults, opts };

	const validate = (obj) => {
		return '' !== obj.title
			&& '' !== obj.voicing
			&& '' !== obj.composer
			&& '' !== obj.edition
			&& '' !== obj.period;
	}


	const add = (obj) => {
		const tmp = _data.map(item => {
			return { ...item, status: 0 }
		});
		const findIndex = (obj) => {
			return tmp.findIndex(item => {
				return item.title === obj.title
					&& item.voicing === obj.voicing
					&& item.composer === obj.composer
					&& item.edition === obj.edition
					&& item.period === obj.period

			});
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
					...tmp.slice(index, -1)]
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
		const mapped = _data.map(v => {
			return {
				id: v.id,
				title: v.title,
				composer: v.composer,
				voicing: v.voicing,
				edition: v.edition,
				period: v.period
			};

		})
		fs.writeFile(options.file,
			JSON.stringify(mapped, undefined, 2),
			(err) => {
				console.log(err);
			});
	}

	const load = () => {
		_data = JSON.parse(fs.readFileSync(options.file).toString());
	}

	const filterTest = (v1, v2) => {
		if (!v1)
			return true;
		return v1 == v2;
	}
	Object.defineProperty(this, "data", {
		get: () => {
			var { key, order } = _sort;
			if (key === '') {
				key = 'id'
			}
			return [
				..._data.filter(item => {
					return !_filter ||
						(
							filterTest(_filter.composer, item.composer)
							&& filterTest(_filter.voicing, item.voicing)
							&& filterTest(_filter.title, item.title)
						)
				}).sort((a, b) => {
					if (order === 'dec') {
						return typeof b[key] === 'string' ? b[key].localeCompare(a[key]) : b[key] - a[key];
					} else {
						return typeof a[key] === 'string' ? a[key].localeCompare(b[key]) : a[key] - b[key];
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
