

function DropzoneManager(dropzones) {
	if(!(this instanceof DropzoneManager))
		return new DropzoneManager(dropzones);

	if(dropzones)
		this.dropzones = dropzones;
	else
		this.dropzones = [];

}

DropzoneManager.prototype.register = function(dropzone, callback) {
	this.dropzones.push(dropzone);
	
	if(callback && typeof callback === 'function')
		callback(dropzone); 
};


DropzoneManager.prototype.process = function(callback) {
	
	dropzones.forEach(function(dropzone) {

	});

	if(callback && typeof callback === 'function')
		callback();
};

DropzoneManager.prototype.processById = function(id, callback) {
	var dropzone;

	if(callback && typeof callback === 'function')
		callback(null, dropzone);
};


DropzoneManager.prototype.removeById = function(id, callback) {
	var dropzone;
	if(this.dropzones.length === 0)
		callback(new Error('No dropzones registered'), null);

	if(callback && typeof callback === 'function')
		callback(null, dropzone);
};

DropzoneManager.prototype.clear = function(callback) {

	if(callback && typeof callback === 'function')
		callback();
};


