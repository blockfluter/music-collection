"use strict";

var fs = require('fs');

var Storage = function (opts) {
	var self = this;
	var defaults = {
		'file': './data/default.json'
	};

	this.options = { ...defaults, opts };

	this.validate = function (obj) {
		return '' !== obj.title
			&& '' !== obj.voicing
			&& '' !== obj.composer
			&& '' !== obj.edition;
	}

	this.findIndex = function (obj) {
		return this.data.findIndex(item => {
			return item.title === obj.title
				&& item.voicing === obj.voicing
				&& item.composer === obj.composer
				&& item.edition === obj.edition

		});
	}

	this.add = function (obj) {
		const data = this.data.map(item => {
			return { ...item, status: 0 }
		});
		if (this.validate(obj)) {
			const index = this.findIndex(obj);
			if (index < 0) {
				this.data = [...data, { ...obj, id: data.length, status: 1 }]
			} else {
				this.data = [...data.slice(0, index), { ...obj, id: this.data.length, status: 1 }, ...data.slice(index + 1, -1)]
			}
		}
	}

	this.del = function (num) {
		throw Error('not implemented');
	}

	this.save = function () {
		fs.writeFile(this.options.file, JSON.stringify(this.data), (k, v) => {
			console.log(k, v);
			return true;
		});
	}

	this.load = function () {
		this.data = JSON.parse(fs.readFileSync(this.options.file).toString());
	}

	this.data = function () {
		return this.data;
	}

	if (fs.existsSync(self.options.file)) {
		this.load();
	} else {
		this.data = [];
		this.save();
	}
}

module.exports = Storage;
