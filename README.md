# DropzoneManager
---

## Description
---
A manager for processing multiple DropzoneJS objects. 

## Usage
---
Add the required script tags linking to your copy of the dropzone.js and dropzone-manager.min.js files
```html 
<script src="./path/to/dropzone.js"></script>
<script src="./path/to/dropzone-manager.min.js"></script>
```
Create a new instance. 
```javascript
var manager = new DropzoneManager();
```
Add a dropzone
```javascript
var newDropzone = DropzoneManager.createDropzone('myDropzoneId', { url: "/url/to/post"}));

manager.add(newDropzone);
````
To process any Dropzones that are currently registered in the manager, just call processAll, which you can pass in a callback that return the all the dropzones that were processed.
```javascript
manager.processAll(function(dropzones) {
	alert('finished');
});
```