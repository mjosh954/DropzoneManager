
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
	DropzoneManager.prototype.register = function(dropzone, options, callback) {
		if(!isDropzoneInstance(dropzone))
			return callback(new Error('Not a valid dropzone to register'));
		
		if(!callback && typeof options === 'function'){
			callback = options;
			options = {};
		}

		initDropzone(dropzone); // initialize the new dropzone, then add

		this.dropzones[dropzone.options.id] = dropzone; // add to dictionary
		
		if(callback && typeof callback === 'function')
			return callback(null, dropzone); // return newly registered and initialized dropzone
	};


	function initDropzone(dropzone) {
		// TODO: add additional properties
	}


	/**
	*
	* Processes all registered dropzones with queued files for upload. 
	*
	**/
	DropzoneManager.prototype.processAll = function(options, callback) {
		if(!callback && typeof options === 'function') {
			callback = options;
			options = {};
			options.order = 'ASC';
		}

		if(!this.hasRegisteredDropzones())
			return callback(new Error("Manager has no dropzones registered"));

		var ids = Object.keys(this.dropzones);
		var dropzones = [];
		ids.forEach(function(id) {
			// check if the dropzone is registered with id
			if(isRegistered(id)) 
				this.processById(id, function(err, dropzone) {
					if(!err) dropzones.push(dropzone);
				});
		});

		// get collection of dropzones that were processed
		// pass in callback

		if(callback && typeof callback === 'function')
			return callback(null, dropzones);
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
		delete this.dropzones[id]; // remove from collection

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
		if(!this.hasRegisteredDropzones()) 
			return callback(new Error('Manager has no dropzones registered.'));

		var unregisteredDropzones = JSON.parse(JSON.stringify(this.dropzones)); // create an unreferenced copy
	
		this.dropzones = {}; // reset to empty object dictionary

		if(callback && typeof callback === 'function')
			return callback(null, unregisteredDropzones); // return all dropzones that got removed
	
		return unregisteredDropzones;
	};


	/**
	*
	* Checks if any dropzone in the manager has pending files for upload
	* O(n)
	* 
	**/
	DropzoneManager.prototype.hasAnyQueuedFiles = function() {
		var hasQueued = false;

		// Check if there's any registered dropzones first. Return false if none.
		if(this.hasRegisteredDropzones()) {
			var ids = Object.keys(this.dropzones); // get all the keys

			ids.forEach(function(id) {
				if(isRegistered(id)) {
					this.dropzones[id].files.forEach(
						function(file) {
							if (file.status === "queued") {
				                hasQueued = true;
				                return;
			            	}            		
						});
				}

				if(hasQueued) return;
			});
		}

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

	function isDropzoneInstance(dropzone) {
		return (dropzone instanceof Dropzone);
	}

	/**
	*
	* Check if dropzone is registered with that id.
	*
	**/
	function isRegistered(dropzones, id) {
		return dropzones[id] !== "undefined" && isDropzoneInstance(dropzones[id]);
	}

	return DropzoneManager;

})();
