import chai from 'chai';
import f from '../_javascript/functions/basic';

let expect = chai.expect;

describe("multiply", function(){

  it("multiplies two integers together", function(){
    expect(f.multiply(2,3)).to.equal(6);
    expect(f.multiply(5,8)).to.equal(40);
    expect(f.multiply(-9,3)).to.equal(-27);
  })
});
