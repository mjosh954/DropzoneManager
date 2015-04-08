
var DropzoneManager = (function() {
	'use strict';

	function DropzoneManager(dropzones) {
		if(!(this instanceof DropzoneManager))
			return new DropzoneManager(dropzones);
		
		var self = this;
		this.dropzones = {};

		if(dropzones && dropzones.length > 0) {
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

		if(!isDropzoneInstance(dropzone))
		{
			return callback(new Error('Not a valid dropzone to register'));
		}
		
		initDropzone(dropzone); // initialize the new dropzone, then add

		this.dropzones[dropzone.options.id] = dropzone; // add to dictionary
		
		return callback(null, dropzone);
	};


	/**
	*
	* Add isRegistered property on dropzone object, 
	*
	**/
	function initDropzone(dropzone) {
		// NOTE: add additional 'default' properties
		// on the dropzone object
		if(!dropzone && !(typeof dropzone !== 'Dropzone'))
			throw new Error("Can't init Dropzone unless it's a type Dropzone");
		dropzone.isRegistered = true; 
	}


	/**
	*
	* Processes all registered dropzones with queued files for upload. 
	*
	**/
	DropzoneManager.prototype.processAll = function(options, callback) { // TODO add option to unregister post process
		// Default options if none passed
		var defaultOptions = {
			order: 'ASC',
			unregister : false
		};

		if(!callback && typeof options === 'function') {
			callback = options;
			options = defaultOptions;
		}

		options = options || defaultOptions;

		if(!this.hasRegisteredDropzones())
			return callback(new Error("Manager has no dropzones registered"));

		var ids = Object.keys(this.dropzones);
		var dropzones = [];

		// TODO add process order ASC and DESC
		ids.forEach(function(id) {
			// check if the dropzone is registered with id
			if(isRegistered(id)) 
				this.processById(id, function(err, dropzone) {
					if(!err) { 
						dropzones.push(dropzone); 
						if(options.unregister) {
							this.removeById({ id: id });
						}
					}
				});
		});

		// get collection of dropzones that were processed
		// pass in callback
		return callback(null, dropzones);
	};


	/**
	*
	* Processes the queue of a specific registered dropzone with id
	*
	**/
	DropzoneManager.prototype.processById = function(params, callback) { // TODO add option, ex. unregister after process
		if(!callback || typeof callback !== 'function') {
			callback = function(err, dropzone) { };
		}

		if(!this.hasRegisteredDropzones())
			return callback(new Error("Manager has no dropzones registered"));

		if(!isRegistered(this.dropzones, params.id))
			return callback(new Error('"' + params.id + '" is not a registered Dropzone'));

		var processedDropzone = this.dropzones[params.id];
		processedDropzone.processQueue();
		if(params.postUnregister){
			this.dropzones[params.id].isRegistered = false; // unregister if param post unregister is true
		}

		return callback(null, processedDropzone); // return processed dropzone
	};


	/**
	*
	* Clears out the manager of registered dropzone with specified id
	*
	**/
	DropzoneManager.prototype.removeById = function(params, callback) { // TODO add retainDZ instance option
		if(!callback || typeof callback !== 'function') {
			callback = function(err, dropzone) { };
		}

		if(!this.hasRegisteredDropzones())
			return callback(new Error('Manager has no dropzones registered'), null);

		// TODO finish
		// Check if id is registered 
		if(isRegistered(this.dropzones, params.id))
			return callback(new Error('"' + params.id + '" is not a registered Dropzone'));

		var removedDropzone = this.dropzones[params.id];
		
		if(params.retainInstance === true) {
			this.dropzpones[params.id].isRegistered = false; // keep in collection, remove registered flag
		} else { 
			delete this.dropzones[params.id]; // remove from collection
		}

		return callback(null, removedDropzone);
	};


	/**
	* 
	* Clears out the manager of all dropzones registered with callback returning the dropzones
	* O(1)
	* 
	**/
	DropzoneManager.prototype.unregisterAll = function(options, callback) {
		
		var defaultOptions = {
			retainInstance : false
		};

		if(!callback && typeof options === 'function'){
			callback = options;
			options = defaultOptions;
		}

		if(!this.hasRegisteredDropzones()) 
			return callback(new Error('Manager has no dropzones registered.'));
		
		options = options || defaultOptions;

		var unregisteredDropzones = JSON.parse(JSON.stringify(this.dropzones)); // create an unreferenced copy
		
		if(options.retainDropzones && options.retainInstance === false){ // remove all trace of dropzones
			this.dropzones = {}; // reset to empty object dictionary
		}
		else {
			var ids = Object.keys(this.dropzones);
			var dropzones = [];
			ids.forEach(function(id) {
				// check if the dropzone is registered with id
				if(isRegistered(id)) {
					var dropzone = this.dropzones[id].isRegistered = false;
					dropzones.push(dropzone);
				}
			});
		}

		return callback(null, unregisteredDropzones); // return all dropzones that got removed
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
					this.dropzones[id].files.forEach(function(file) {
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
		var keys = Object.keys(this.dropzones);

		if(keys.length === 0)
			return false;

		keys.forEach(function(key) {
			var dz = this.dropzones[key];
			if(dz.isRegistered) 
				return true; // return on first instance of a registered dropzone
		});

		return false;
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
		if(!dropzone) return false;
		return (dropzone instanceof Dropzone);
	}

	/**
	*
	* Check if dropzone is registered with that id.
	*
	**/
	function isRegistered(dropzones, id) {
		if(!dropzones) throw new Error('Missing dropzones parameter.');
		if(!id) throw new Error('Missing id parameter');

		return dropzones[id] !== "undefined" && isDropzoneInstance(dropzones[id]) && dropzones[id].isRegistered;
	}

	return DropzoneManager;

})();
