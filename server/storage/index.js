
var fs = require('fs');

var Storage = function (opts) {
	var defaults = {
		'file': './data/default.json'
	};
	let _data = [];
	const options = { ...defaults, opts };

	const validate = (obj) => {
		return '' !== obj.title
			&& '' !== obj.voicing
			&& '' !== obj.composer
			&& '' !== obj.edition
			&& '' !== obj.period;
	}

	const findIndex = (obj) => {
		return _data.findIndex(item => {
			return item.title === obj.title
				&& item.voicing === obj.voicing
				&& item.composer === obj.composer
				&& item.edition === obj.edition
				&& item.period === obj.period

		});
	}

	const add = (obj) => {
		const tmp = _data.map(item => {
			return { ...item, status: 0 }
		});
		if (validate(obj)) {
			const index = findIndex(obj);
			const id = Math.max(...tmp.map(item => item.id)) + 1;

			if (index < 0) {
				_data = [...tmp, { ...obj, id, status: 1 }]
			} else {
				_data = [
					...tmp.slice(0, index),
					{ ...obj, id, status: 1 },
					...tmp.slice(index + 1, -1)]
			}
		}
	}

	const sortdata = (params) => {
		var { key, direction } = params;
		if (key === '')
			return _data;
		return _data.sort((a, b) => {
			return typeof a[key] === 'string' ? a[key].localeCompare(b[key]) : b[key] - a[key];
		});
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
			JSON.stringify(mapped),
			(err) => {
				console.log(err);
			});
	}

	const load = () => {
		_data = JSON.parse(fs.readFileSync(options.file).toString());
	}

	Object.defineProperty(this, "data", {
		get: function () { return _data; }
	});

	this.__proto__ = {
		...this.__proto__,
		save,
		load,
		add,
		sortdata
	}

	if (fs.existsSync(options.file)) {
		load();
	} else {
		save();
	}
}

module.exports = Storage;
