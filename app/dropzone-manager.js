
var DropzoneManager = (function() {
	'use strict';

	function DropzoneManager(dropzones) {
		if(!(this instanceof DropzoneManager))
			return new DropzoneManager(dropzones);
		
		this.self = this;
		this.dropzones = {}; // convert this to Dictionary[id] = dropzone

		if(dropzones) {
			dropzones.forEach(function(dropzone) {
				this.self.register(dropzone);
			});
		}
	}

	
	/**
	*
	* Adds a dropzone to the manager
	*
	**/
	DropzoneManager.prototype.register = function(dropzone, callback) {

		initDropzone(dropzone); // initialize the new dropzone, then add

		this.dropzones[dropzone.options.id] = dropzone; // add to dictionary
		
		if(callback && typeof callback === 'function')
			return callback(dropzone); // return newly registered dropzone
	};


	function initDropzone(dropzone) {
		// TODO: add additional properties
	}


	/**
	*
	* Processes all registered dropzones with queued files for upload. 
	*
	**/
	DropzoneManager.prototype.processAll = function(callback) {
		
		if(!this.hasRegisteredDropzones())
			return callback(new Error("Manager has no dropzones registered"));

		var ids = Object.keys(this.dropzones);
		ids.forEach(function(id) {
			this.processById(id);
		});

		if(callback && typeof callback === 'function')
			return callback();
	};


	/**
	*
	* Processes the queue of a specific registered dropzone with id
	*
	**/
	DropzoneManager.prototype.processById = function(id, callback) {

		if(!this.hasRegisteredDropzones())
			return callback(new Error("Manager has no dropzones registered"));

		if(!isRegistered(this.dropzones, id))
			return callback(new Error('"' + id + '" is not a registered Dropzone'));

		// TODO finish
		var processedDropzone = this.dropzones[id];
		processedDropzone.processQueue();

		if(callback && typeof callback === 'function')
			return callback(null, processedDropzone);

		return processedDropzone;
	};


	/**
	*
	* Clears out the manager of registered dropzone with specified id
	*
	**/
	DropzoneManager.prototype.removeById = function(id, callback) {
		
		if(!this.hasRegisteredDropzones())
			return callback(new Error('Manager has no dropzones registered'), null);

		// TODO finish
		// Check if id is registered 
		if(isRegistered(this.dropzones, id))
			return callback(new Error('"' + id + '" is not a registered Dropzone'));

		var removedDropzone = this.dropzones[id];
		delete this.dropzones[id];

		if(callback && typeof callback === 'function')
			return callback(null, removedDropzone);

		return removedDropzone;
	};


	/**
	* 
	* Clears out the manager of all dropzones registered with callback returning the dropzones
	* O(1)
	* 
	**/
	DropzoneManager.prototype.unregisterAll = function(callback) {
		var unregisteredDropzones = JSON.parse(JSON.stringify(this.dropzones)); // create an unreferenced copy
		
		this.dropzones = {}; // reset to empty object dictionary

		if(callback && typeof callback === 'function')
			callback(unregisteredDropzones); // return all dropzones that got removed
	};


	/**
	*
	* Checks if any dropzone in the manager has pending files for upload
	* O(n)
	* 
	**/
	DropzoneManager.prototype.hasAnyQueuedFiles = function() {
		var hasQueued = false;
		var ids = Object.keys(this.dropzones); // get all the keys

		ids.forEach(function(id) {
			this.dropzones[id].files.forEach(
				function(file) {
					if (file.status === "queued") {
		                hasQueued = true;
		                return;
	            	}            		
				});
			if(hasQueued) return;
		});

	    return hasQueued;
	};


	/**
	*
	* Check for any dropzones in manager
	*
	**/
	DropzoneManager.prototype.hasRegisteredDropzones = function() {
		return Object.keys(this.dropzones).length > 0;
	};


	/**
	*
	* Factory method to create dropzones
	*
	**/
	DropzoneManager.createDropzone = function(id, options) {
		// TODO Proxy to add additional properties and validation
		var newDropzone = new Dropzone(id, options);

		return newDropzone;
	};


	function isRegistered(dropzones, id) {
		return dropzones[id] === "undefined";
	}




	return DropzoneManager;

})();
