/*eslint-env node, mocha*/

import { expect } from "chai";

export default function common(business, lander, _ids, errors, idProp = "id") {
  describe("extend", () => {
    it("extends and uses extended method", done => {
      let now = new Date().getTime();
      let extended = business.extend({
        create(data) {
          data.time = now;
          return this._super.apply(this, arguments);
        }
      });

      extended.create({ name: "Dave", website:"http://www.mrdave.com/" }).then(data => {
        return extended.remove(data[idProp]);
      }).then(data => {
        expect(data.time).to.equal(now);
        done();
      }).catch(done);
    });
  });

  describe("get", () => {
    it("returns an instance that exists", done => {
      business.get(_ids.Doug).then(data => {
        expect(data[idProp].toString()).to.equal(_ids.Doug.toString());
        expect(data.name).to.equal("Doug");
        done();
      }).catch(done);
    });

    it("returns NotFound error for non-existing id", function(done) {
      this.timeout(5000);
      business.get("568225fbfe21222432e836ff").catch(error => {
        expect(error).to.be.ok;
        expect(error instanceof errors.NotFound).to.be.ok;
        expect(error.message).to.equal("No record found for id '568225fbfe21222432e836ff'");
        done();
      });
    });
  });

  describe("remove", () => {
    it("deletes an existing instance and returns the deleted instance", done => {
      business.remove(_ids.Doug).then(data => {
        expect(data).to.be.ok;
        expect(data.name).to.equal("Doug");
        done();
      }).catch(done);
    });
  });

  describe("find", () => {
    beforeEach(done => {
      business.create({
        name: "Bob",
        website: "http://www.hellobob.com"
      }).then(bob => {
        _ids.Bob = bob[idProp].toString();

        return lander.create({
          name: "Alice",
          url: "http://www.helloalice.com",
          businessId:bob[idProp].toString()
        });
      }).then(alice => {
        _ids.AliceLander = alice[idProp].toString();
        done();
      }).catch(done);
    });

    afterEach(done => {
      lander.remove(_ids.AliceLander).then(() => {
        return business.remove(_ids.Bob);
      }).then(() => done()).catch(done);
    });

    it("returns all items", done => {
      business.find().then(data => {
        expect(data).to.be.instanceof(Array);
        expect(data.length).to.equal(2);
        done();
      }).catch(done);
    });

    it("filters results by a single parameter", done => {
      var params = { query: { name: "Alice" } };

      lander.find(params).then(data => {
        expect(data).to.be.instanceof(Array);
        expect(data.length).to.equal(1);
        expect(data[0].name).to.equal("Alice");
        done();
      }).catch(done);
    });

    it("filters results by multiple parameters", done => {
      var params = { query: { name: "Alice", businessId: _ids.Bob } };

      lander.find(params).then(data => {
        expect(data).to.be.instanceof(Array);
        expect(data.length).to.equal(1);
        expect(data[0].name).to.equal("Alice");
        done();
      }).catch(done);
    });
  });

  describe("update", () => {
    //it("replaces an existing instance", done => {
    //  business.update(_ids.Doug, { name: "Dougler11"}).then(data => {
    //    expect(data[idProp].toString()).to.equal(_ids.Doug.toString());
    //    console.log(data);
    //    expect(data.name).to.equal("Dougler11");
    //    expect(data.website).to.be.notOk;
    //    done();
    //  }).catch(done);
    //});

    it("returns NotFound error for non-existing id", done => {
      business.update("568225fbfe21222432e836ff", { name: "NotFound" }).then(done, error => {
        expect(error).to.be.ok;
        expect(error instanceof errors.NotFound).to.be.ok;
        //console.log(error);
        expect(error.message).to.equal("No record found for id '568225fbfe21222432e836ff'");
        done();
      });
    });

    it("update an existing instance using param", done => {
      business.update(null, { name: "Dougler11" }, {query: {name:"Doug"}}).then(data => {
        console.log(data);
        expect(data).to.be.instanceof(Array);
        expect(data.length).to.equal(1);
        expect(data[0].name).to.equal("Dougler11");
        done();
      }).catch(done);
    });
  });

  describe("patch", () => {
    it("updates an existing instance", done => {
      business.patch(_ids.Doug, { name: "PatchDoug" }).then(data => {
        expect(data[idProp].toString()).to.equal(_ids.Doug.toString());
        expect(data.name).to.equal("PatchDoug");
        done();
      }).catch(done);
    });
  });

  describe("create", () => {
    it("creates a single new instance and returns the created instance", done => {
      business.create({
        name: "Bill",
        website: "http://www.thisisbill.com"
      }).then(data => {
        expect(data).to.be.instanceof(Object);
        expect(data).to.not.be.empty;
        expect(data.name).to.equal("Bill");
        done();
      }).catch(done);
    });

    it("creates multiple new instances", done => {
      let items = [
        {
          name: "Gerald",
          website: "http://www.thisisgerald.com"
        },
        {
          name: "Herald",
          website: "http://www.thisisherald.com"
        }
      ];

      business.create(items).then(data => {
        expect(data).to.not.be.empty;
        expect(data[0].name).to.equal("Gerald");
        expect(data[1].name).to.equal("Herald");
        done();
      }).catch(done);
    });
  });
}