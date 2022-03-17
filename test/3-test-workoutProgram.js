var assert = require("assert");
const { WorkoutProgram } = require("../model/workoutProgram");
const validation = require("../utils/validate-fields");
var request = require("supertest");

var myurl = "http://localhost:3000";
var server = request.agent(myurl);

let publicProgramID;
let privateProgramID;

function loginUser() {
  return function (done) {
    server
      .post("/auth/local")
      .send({ email: "rock@mun.ca", password: "password" })
      .end(onResponse);

    function onResponse(err, res) {
      if (err) return done(err);
      return done();
    }
  };
}

function logoutUser() {
  return function (done) {
    server.get("/logout").end(onResponse);

    function onResponse(err, res) {
      if (err) return done(err);
      return done();
    }
  };
}

describe("Workout Application - Tests with Mocha", function () {
  describe("Test Models", function () {
    describe("WorkoutProgram", function () {
      it("Test if WorkoutProgram is invalid(empty nameOfProgram)", async function () {
        let isPublic = 0;
        let nameOfProgram = "";
        assert.strictEqual(
          validation.validWorkoutProgramInfo(isPublic, nameOfProgram).valid,
          false
        );
      });
      it("Test if WorkoutProgram is valid", async function () {
        let isPublic = 0;
        let nameOfProgram = "30 Day Leg Workout";
        assert.strictEqual(
          validation.validWorkoutProgramInfo(isPublic, nameOfProgram).valid,
          true
        );
      });
    });
  });
  describe("Test API calls", function () {
    describe("POST /workoutProgram", function () {
      it("Fail 1 - Create Workout Programs as an unauthenticated user", function (done) {
        server
          .post("/workoutProgram")
          .send({
            isPublic: 0,
            nameOfProgram: "5-Day Abs Program",
          })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            assert.strictEqual(
              res.body.message,
              "User needs to be authenticated to perform this action."
            );
            return done();
          });
      });
      it("Login user", loginUser());
      it("Fail 2 - Authenticated user, but with empty nameOfProgram", function (done) {
        server
          .post("/workoutProgram")
          .send({
            isPublic: 0,
            nameOfProgram: "",
          })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            return done();
          });
      });
      it("Fail 3 - Authenticated user, but with wrong isPublic", function (done) {
        server
          .post("/workoutProgram")
          .send({
            isPublic: "public",
            nameOfProgram: "5-Day Abs Program",
          })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            return done();
          });
      });
      it("Fail 4 - Authenticated user, but with missing nameOfProgram", function (done) {
        server
          .post("/workoutProgram")
          .send({
            isPublic: 1,
          })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            return done();
          });
      });
      it("Fail 4 - Authenticated user, but with missing isPublic", function (done) {
        server
          .post("/workoutProgram")
          .send({
            nameOfProgram: "5-Day Abs Program",
          })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            return done();
          });
      });
      it("Success 1 - Create Workout Programs as an authenticated user (private program)", function (done) {
        server
          .post("/workoutProgram")
          .send({
            isPublic: 0,
            nameOfProgram: "Private 5-Day Abs Program",
          })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(
              res.body.message,
              "A new workout program was created."
            );
            privateProgramID = res.body.insertedID;
            return done();
          });
      });
      it("Success 1 - Create Workout Programs as an authenticated user (public program)", function (done) {
        server
          .post("/workoutProgram")
          .send({
            isPublic: 1,
            nameOfProgram: "Public 5-Day Abs Program",
          })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(
              res.body.message,
              "A new workout program was created."
            );
            console.log(res.body);
            publicProgramID = res.body.insertedID;
            return done();
          });
      });
    });
    describe("GET /workoutProgram/workoutProgramID", function () {
      it("Logout user", logoutUser());
      it("Success 1 - Unaunthenticated user trying to access public program", function (done) {
        server
          .get("/workoutProgram/" + publicProgramID)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(
              res.body.nameOfProgram,
              "Public 5-Day Abs Program"
            );
            return done();
          });
      });
      it("Fail 1 - Unaunthenticated user trying to access private program", function (done) {
        server
          .get("/workoutProgram/" + privateProgramID)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            assert.strictEqual(
              res.body.message,
              "You are not authorized to view this information."
            );
            return done();
          });
      });
      it("Login user", loginUser());
      it("Success 1 - Aunthenticated user trying to access private program", function (done) {
        server
          .get("/workoutProgram/" + privateProgramID)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(
              res.body.nameOfProgram,
              "Private 5-Day Abs Program"
            );
            return done();
          });
      });
    });
  });
});
