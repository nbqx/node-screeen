var should = require('should'),
    Screeen = require(__dirname+'/../');

describe('test!',function(){
  it('with callback',function(done){
    Screeen.capture({type:'jpg',mode:'screen',data:'binary'},function(err,data){
      done();
    });
  });

  it('without callback',function(done){
    Screeen.capture({rect:[0,0,120,120]}).on('captured',function(path){
      done();
    });
  });
});
