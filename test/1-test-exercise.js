var assert = require("assert");
var request = require("supertest");

var myurl = "http://localhost:3000";
var server = request.agent(myurl);

var exerciseID = "1003";  // ID for 'band squat row'
describe("Workout Application - Testing Exercise resource", function () {
  describe("Test API calls", function () {
    describe("GET /exercise", function () {
      it("Success 1. GET - fetch all exercise", function (done) {
        server
          .get("/exercise")
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual((res.body).length, 1327);
            done();
          });
      });
    });
    describe("GET /exercise/exerciseID", function () {
      it("Fail 1. GET - fetch exercise by exerciseID (Incorrect ID)", function (done) {
        server
          .get("/exercise/" + "IDthatDoesntExist")
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            assert.strictEqual(res.body.message, "Incorrect ID.");
            done();
          });
      });
      it("Success 1. GET - fetch exercise by exerciseID", function (done) {
        server
          .get("/exercise/" + exerciseID)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.name, 'band squat row');
            done();
          });
      });
    });
  });
});
