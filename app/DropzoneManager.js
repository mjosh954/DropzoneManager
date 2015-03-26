

function DropzoneManager(dropzones) {
	if(!(this instanceof DropzoneManager))
		return new DropzoneManager(dropzones);

	if(dropzones)
		this.dropzones = dropzones;
	else
		this.dropzones = [];

}

DropzoneManager.prototype.add = function(dropzone) {
	this.dropzones.push(dropzone);
};

DropzoneManager.prototype.processAll = function(callback) {
	dropzones.forEach(function(dropzone) {

	});

	if(callback && typeof callback === 'function')
		callback();
};

DropzoneManager.prototype.processNth = function(index, callback) {
	
	if(callback && typeof callback === 'function')
		callback();
};

DropzoneManager.prototype.removeNth = function(index, callback) {

	if(callback && typeof callback === 'function')
		callback();
};

DropzoneManager.prototype.clear = function(callback) {
	
	if(callback && typeof callback === 'function')
		callback();
};
