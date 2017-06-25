import supertest from 'supertest';
import cheerio from 'cheerio';

import app from '../index.js';

describe("HTML response", function(){

  let request;
  beforeEach(function() {
    
    request = supertest(app)
      .get("/")
      .set("User-Agent", "a cool browser")
      .set("Accept", "text/html");
  });


  it("returns a homepage built on HTML", function(done){
    request
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(200)
      .end(done);
  });

  it('has a proper header', function(done){
    request
      .expect(function(res) {
        let htmlResponse = res.text,
            $ = cheerio.load(htmlResponse),
            header = $('h1');

        if (!header) { throw new Error("Header isn't there!"); }
      })
      .end(done);
  });
});
