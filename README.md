## Screeen (OSX ONLY)

utility for osx screenshot img

### Install

    $ npm install screeen

### Usage

option:

* type('png','jpg','tiff','pdf') - default `jpg`
* data('path' or 'binary') - default `path`
* mode('interactive','screen','window') - default `interactive`
* rect(x,y,w,h as array) - default `not set`

ignore `opt.mode` option if `option.rect` is set

### Example

``` js
// with callback
Screeen.capture({type:'jpg',data:'binary'}, function(err,data){
  // data is BINARY data
  if(err) return console.log(err);
  fs.writeFileSync('test.jpg', data, {encoding:'binary'});
});

// without callback
var w = fs.createWriteStream('test2.jpg');
Screeen.capture({rect:[0,0,100,100]}).on('captured',function(path){
  // path is TEMPORARY FILE PATH
  fs.createReadStream(path).pipe(w);
});

```
