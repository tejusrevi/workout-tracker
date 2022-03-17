var assert = require("assert");
const { WorkoutProgram } = require("../model/workoutProgram");
const validation = require("../utils/validate-fields");
var request = require("supertest");

var myurl = "http://localhost:3000";
var server = request.agent(myurl);

let publicProgramID;
let privateProgramID;

let exerciseID;

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

describe("Workout Application - Testing WorkoutProgram resource", function () {
  before(function (done) {
    server
      .post("/user")
      .send({
        isLocal: true,
        username: "Dwayne Johnson",
        email: "rock@mun.ca",
        password: "password",
      })
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        return done();
      });
  });

  after(function (done) {
    server.delete("/user").end(function (err, res) {
      if (err) throw err;
      return done();
    });
  });

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
        let workoutProgram = new WorkoutProgram(isPublic, nameOfProgram);
        assert.strictEqual(workoutProgram.isPublic, false);
        assert.strictEqual(workoutProgram.nameOfProgram, nameOfProgram);
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
      it("Login user", loginUser());
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
      it("Success 2 - Create Workout Programs as an authenticated user (public program)", function (done) {
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
      it("Success 1 - Authenticated user trying to access private program", function (done) {
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
    describe("PUT /workoutProgram/workoutProgramID", function () {
      it("Logout user", logoutUser());
      it("Fail 1 - Unauthenticated user trying to update public program's program name", function (done) {
        server
          .put("/workoutProgram/" + publicProgramID)
          .send({
            isPublic: 0,
            nameOfProgram: "Private 10-Day Chest Program",
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
      it("Success 1 - Authenticated user trying to update public program's program name", function (done) {
        server
          .put("/workoutProgram/" + publicProgramID)
          .send({
            isPublic: 1,
            nameOfProgram: "Public 10-Day Chest Program",
          })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.message, "Workout Plan was updated.");
            return done();
          });
      });
    });

    describe("GET /workoutProgram", function () {
      it("Logout user", logoutUser());
      it("Success 1 - Unuthenticated user trying to access all workout programs", function (done) {
        server.get("/workoutProgram/").end(function (err, res) {
          if (err) return done(err);
          assert.strictEqual(res.body.length, 1);
          return done();
        });
      });
    });
    describe("PUT /workoutProgram/addExercise/:workoutProgramID", function () {
      it("Login user", loginUser());
      it("Success 1 - Authenticated user trying to add an exercise to (public) workout program", function (done) {
        server
          .put("/workoutProgram/addExercise/" + publicProgramID)
          .send({
            exerciseID: 0047,
            numSets: 4,
            numReps: 12
          })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.message, 'Exercise was addedd to workout program.');
            return done();
          });
      });
      it("Success 1 - Authenticated user trying to remove an exercise from (public) workout program", function (done) {
        server
          .put("/workoutProgram/removeExercise/" + publicProgramID)
          .query({
            exerciseID: exerciseID
          })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.message, 'Exercise removed from workout program.');
            return done();
          });
      });
    });
    describe("DELETE /workoutProgram/:workoutProgramID", function () {
      it("Logout user", logoutUser());
      it("Fail 1 - Unauthenticated user trying to delete workout programs", function (done) {
        server
          .delete("/workoutProgram/" + publicProgramID)
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
      it("Success 1 - Authenticated user trying to delete workout programs (public)", function (done) {
        server
          .delete("/workoutProgram/" + publicProgramID)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.message, "Workout Plan was deleted.");
            return done();
          });
      });
      it("Success 2 - Authenticated user trying to delete workout programs (private)", function (done) {
        server
          .delete("/workoutProgram/" + privateProgramID)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.message, "Workout Plan was deleted.");
            return done();
          });
      });
    });
  });
});
