
function Queue(processor) {
	if (!(this instanceof Queue)) {
		return new Queue(processor);
	}

	this.items = [];
	this.processed = false;
	this.processor = processor || function() {};
}

Queue.prototype.setProcessor = function(processor) {
	this.processor = processor;
	return this;
};

Queue.prototype.process = function() {
	this.processed = true;
	this.items.forEach(item => {
		this.processor(item);
	});

	return this;
};

Queue.prototype.add = function(item) {
	if (this.processed === true) {
		this.processor(item);
	} else {
		this.items.push(item);
	}

	return this;
};

module.exports = Queue;
