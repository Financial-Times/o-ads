var utils = require('./index.js');
function Queue(processor){
    if(!(this instanceof Queue)) {
      return new Queue(processor);
    }
    this.items = [];
    this.processed = false;
    this.processor = processor || function () {};
}

Queue.prototype.setProcessor = function (processor){
    this.processor = processor;
    return this;
};

Queue.prototype.process = function (){
    this.processed = true;
    for (var i = 0, j = this.items.length; i < j; i++){
        this.processor(this.items[i]);
    }
    return this;
};

Queue.prototype.add = function (item){
    if(this.processed === true) {
        this.processor(item);
    } else {
        this.items.push(item);
    }
    return this;
};

module.exports = Queue;
