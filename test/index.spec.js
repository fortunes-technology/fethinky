/*eslint-env node, mocha*/
import base from "./feathers-base";
import errors from "feathers-errors";
import service from "../src";
import Business from "./business";
import Lander from "./lander";

let _ids = {};
let business = service({
  model: Business
});
let lander = service({
  model: Lander
});

function clean(done) {
  this.timeout(5000);
  Business.delete().run().then(() => {
    Lander.delete().run().then(() => {
      done();
    });
  });
}

describe("fethinky", () => {
  before(clean);
  after(clean);

  beforeEach(done => {
    console.log("Hello BeforeEach");
    business.create({
      name: "Doug",
      website: "http://www.mrdoug.com/"
    }).then(data => {
      _ids.Doug = data.id;
      lander.create({
        name: "Doug",
        url: "http://www.mrdoug.com/",
        businessId: data.id
      }).then(data => {
        _ids.DougLander = data.id;
        done();
      }, done);
    }, done);
  });

  afterEach(done => {
    console.log("Hello afterEach");
    const doneNow = () => done();
    business.remove(_ids.Doug).then(doneNow, doneNow);
  });
  base(business, lander, _ids, errors);
});