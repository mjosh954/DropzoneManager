
;var DropzoneManager = (function() {
	'use strict';

	function DropzoneManager(dropzones) {
		if(!(this instanceof DropzoneManager))
			return new DropzoneManager(dropzones);
		
		var dropzoneContainer;

		if(dropzones)
		else
			dropzoneContainer = [];
		
		// only expose this public method
		this.getRegisteredDropzones = function() {
			return dropzoneContainer;
		};
	}

	/**
	*
	* Adds a dropzone to the manager
	*
	**/
	DropzoneManager.prototype.register = function(dropzone, callback) {
		this.getRegisteredDropzones().push(dropzone);
		
		if(callback && typeof callback === 'function')
			callback(dropzone); // return newly registered dropzone
	};


	/**
	*
	* Processes all registered dropzones with queued files for upload. 
	*
	**/
	DropzoneManager.prototype.process = function(callback) {
		
		if(!this.hasRegisteredDropzones())
			return callback(new Error("Manager has no dropzones registered"));

		this.getRegisteredDropzones().forEach(function(dropzone) {
			dropzone.processQueue();
		});

		if(callback && typeof callback === 'function')
			callback();
	};

	/**
	*
	* Processes the queue of a specific registered dropzone with id
	*
	**/
	DropzoneManager.prototype.processById = function(id, callback) {
		var dropzone;

		if(!this.hasRegisteredDropzones())
			return callback(new Error("Manager has no dropzones registered"));

		if(callback && typeof callback === 'function')
			callback(null, dropzone);
	};


	/**
	*
	* Clears out the manager of registered dropzone with specified id
	*
	**/
	DropzoneManager.prototype.removeById = function(id, callback) {
		var dropzone;

		if(!this.hasRegisteredDropzones())
			callback(new Error('Manager has no dropzones registered'), null);



		if(callback && typeof callback === 'function')
			callback(null, dropzone);
	};


	/**
	* Clears out the manager of all dropzones registered
	* O(1)
	* 
	**/
	DropzoneManager.prototype.unregisterAll = function(callback) {
		this.getRegisteredDropzones().length = 0;

		if(callback && typeof callback === 'function')
			callback();
	};

	/**
	*
	* Checks if any dropzone in the manager has pending files for upload
	* O(n)
	**/
	DropzoneManager.prototype.hasAnyQueuedFiles = function() {
		var hasQueued = false;
		this.getRegisteredDropzones().forEach(function(dropzone) {
			dropzone.files.forEach(function(file) {
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
		return this.getRegisteredDropzones().length > 0;
	};

	/**
	*
	* Factory method to create dropzones
	*
	**/
	DropzoneManager.createDropzone = function(id, options) {
		// TODO Proxy to add additional properties and validation
		var newDropzone = new Dropzone('div#' + id, options);

		return newDropzone;
	};


	return DropzoneManager;
})();
