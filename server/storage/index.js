"use strict";

var fs = require('fs');

var Storage = function (opts) {
	var defaults = {
		'file': './data/default.json'
	};

	this.options = { ...defaults, opts };

	const validate = (obj) => {
		return '' !== obj.title
			&& '' !== obj.voicing
			&& '' !== obj.composer
			&& '' !== obj.edition;
	}

	const findIndex = (obj) => {
		return this.data.findIndex(item => {
			return item.title === obj.title
				&& item.voicing === obj.voicing
				&& item.composer === obj.composer
				&& item.edition === obj.edition

		});
	}

	const add = (obj) => {
		const tmp = this.data.map(item => {
			return { ...item, status: 0 }
		});
		if (validate(obj)) {
			const index = findIndex(obj);
			if (index < 0) {
				this.data = [...tmp, { ...obj, id:data.length, status: 1 }]
			} else {
				this.data = [
					...tmp.slice(0, index),
					{ ...obj, id: tmp.length, status: 1 },
					...tmp.slice(index + 1, -1)]
			}
		}
	}

	const del = (num) => {
		throw Error('not implemented');
	}

	const save = () => {
		fs.writeFile(this.options.file, JSON.stringify(this.data), (k, v) =>
		{
			console.log(k, v);
			return true;
		});
	}

	const load = () => {
		this.data = JSON.parse(fs.readFileSync(this.options.file).toString());
	}

	const data = () => {
		return this.data;
	}

	this.__proto__ = {
		...this.__proto__,
		save,
		load,
		add
	}

	if (fs.existsSync(this.options.file)) {
		load();
	} else {
		this.data = [];
		save();
	}
}

module.exports = Storage;
