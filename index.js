var fs = require('fs'),
    exec = require('child_process').exec,
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore'),
    tmp = require('temporary');

function valid_type(t){
  return _.contains(['png','jpg','tiff','pdf'],t);
};

function valid_data(d){
  return _.contains(['path','binary'],d);
};

function mode(opt){
  var mode = {
    'interactive': '-i',
    'screen': '-S',
    'window': '-W'
  };

  if(opt.rect){
    return '-R'+opt.rect.join(',')
  }else{
    return mode[opt.mode]
  }
};

function capture1(opt){
  var img = new tmp.File();
  var cmd = ['screencapture',mode(opt),'-t'+opt.type,img.path].join(' ');
  var dat = (valid_data(opt.data))? opt.data : 'path';
  var ev = new EventEmitter;
  
  exec(cmd,function(err,stdout,stderr){
    if(err) throw err;
    if(stderr) throw err;
  }).on('close',function(){
    if(dat=='binary'){
      fs.readFile(img.path, {encoding:'binary'},function(x_x,data){
        ev.emit('captured', data);
        img.unlink();
      });
    }else{
      ev.emit('captured', img.path);
      img.unlink();
    }
  });
  
  return ev

};

function capture2(opt,cb){
  var img = new tmp.File();
  var cmd = ['screencapture',mode(opt),'-t'+opt.type,img.path].join(' ');
  var dat = (valid_data(opt.data))? opt.data : 'path';
  
  exec(cmd,function(err,stdout,stderr){
    if(err) return cb(err);
    if(stderr) return cb(err);
    if(dat=='binary'){
      fs.readFile(img.path,{encoding:'binary'},function(x_x,data){
        if(x_x) return cb(x_x);
        cb(null,data);
      });
    }else{
      cb(null,img.path);
    }
  }).on('close',function(){
    img.unlink();
  });
  
};

var Screeen = {};
Screeen.defaults = {
  type: 'jpg',
  mode: 'interactive',
  data: 'path'
};
Screeen.capture = function(){
  var opt,cb,
  args = Array.prototype.slice.call(arguments);

  if(args.length===1){
    var  _opt = args[0];
    opt = _.extend(Screeen.defaults, args[0]);
  }else if(args.length===2){
    opt = _.extend(Screeen.defaults, args[0]);
    cb = args[1];
  }else{
    opt = Screeen.defaults;
  }

  if(_.isUndefined(cb)){
    return capture1(opt)
  }else{
    capture2(opt,cb);
  }
};

module.exports = Screeen;

// if(require.main===module){
//   Screeen.capture({rect:[0,0,100,100],data:'binary'},function(err,data){
//     fs.writeFileSync('test.jpg', data, {encoding:'binary'});
//   });

//   Screeen.capture({mode:'window',data:'path'}).on('captured',function(path){
//     var w = fs.createWriteStream('test2.jpg');
//     fs.createReadStream(path).pipe(w);
//   });
// }
