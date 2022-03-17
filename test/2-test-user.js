var assert = require("assert");
const { User } = require("../model/user");
const validation = require("../utils/validate-fields");
const axios = require("axios");
var request = require("supertest");

var myurl = "http://localhost:3000";
var server = request.agent(myurl);

const instance = axios.create({
  baseURL: myurl,
  timeout: 5000, //5 seconds max
  headers: { "content-type": "application/json" },
  withCredentials: true,
});

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
    describe("User", function () {
      it("Test if user is invalid(Invalid Email)", async function () {
        let username = "Dwayne Johnson";
        let email = "rock@@mun.c#$a";
        let password = "password";
        assert.strictEqual(
          validation.validUserInfo(username, email, password).valid,
          false
        );
      });
      it("Test if user is valid", async function () {
        let username = "Dwayne Johnson";
        let email = "rock@mun.ca";
        let password = "password";
        assert.strictEqual(
          await validation.validUserInfo(username, email, password).valid,
          true
        );
      });
    });
  });
  describe("Test API calls", function () {
    describe("POST /user", async function () {
      it("Fail 1. POST - Test invalid email in the object", async function () {
        let data = {
          isLocal: true,
          username: "Dwayne Johnson",
          email: "rock@mudan.caa$dad",
          password: "password",
        };
        let res = await instance.post("/user", data);
        assert.strictEqual(res.data.success, false);
      });
      it("Fail 2. POST - Test no email in the object", async function () {
        let data = {
          isLocal: true,
          username: "Dwayne Johnson",
          password: "password",
        };
        let res = await instance.post("/user", data);
        assert.strictEqual(res.data.success, false);
      });
      it("Fail 3. POST - Test no password in the object", async function () {
        let data = {
          isLocal: true,
          username: "Dwayne Johnson",
          email: "rock@mun.ca",
        };
        let res = await instance.post("/user", data);
        assert.strictEqual(res.data.success, false);
      });
      it("Fail 4. POST - Test no username in the object", async function () {
        let data = {
          isLocal: true,
          email: "rock@mun.ca",
          password: "password",
        };
        let res = await instance.post("/user", data);
        assert.strictEqual(res.data.success, false);
      });

      it("Fail 5. POST - Test empty email in the object", async function () {
        let data = {
          isLocal: true,
          username: "Dwayne Johnson",
          password: "password",
          email: "",
        };
        let res = await instance.post("/user", data);
        assert.strictEqual(res.data.success, false);
      });
      it("Fail 6. POST - Test empty password in the object", async function () {
        let data = {
          isLocal: true,
          username: "Dwayne Johnson",
          email: "rock@mun.ca",
          password: "",
        };
        let res = await instance.post("/user", data);
        assert.strictEqual(res.data.success, false);
      });
      it("Fail 7. POST - Test empty username in the object", async function () {
        let data = {
          isLocal: true,
          email: "rock@mun.ca",
          password: "password",
          username: "",
        };
        let res = await instance.post("/user", data);
        assert.strictEqual(res.data.success, false);
      });
      it("Success 1. POST - Test with valid email, username and password", async function () {
        let data = {
          isLocal: true,
          username: "Dwayne Johnson",
          email: "rock@mun.ca",
          password: "password",
        };
        let res = await instance.post("/user", data);
        assert.strictEqual(res.data.success, true);
        assert.strictEqual(
          res.data.message,
          "User Dwayne Johnson was correctly inserted to the database."
        );
      });
      it("Fail 8. POST - Adding user with the same email again", async function () {
        let data = {
          isLocal: true,
          username: "Dwayne Johnson",
          email: "rock@mun.ca",
          password: "password",
        };
        let res = await instance.post("/user", data);
        assert.strictEqual(res.data.success, false);
        assert.strictEqual(
          res.data.message,
          "Email address already exists. Try logging in."
        );
      });
    });
    describe("POST /auth/local", async function () {
      it("Fail 1 - Try authenticating with incorrect username and password", function (done) {
        server
          .post("/auth/local")
          .send({ email: "rock@mun.ca", password: "wrongPassword" })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.header.location, "/"); // Unauthenticated user gets redirected to /
            return done();
          });
      });

      it("Success 1 - Try authenticating with correct username and password", function (done) {
        server
          .post("/auth/local")
          .send({ email: "rock@mun.ca", password: "password" })
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.header.location, "/user"); // Authenticated user gets redirected to /user
            return done();
          });
      });
    });
    describe("GET /user", function () {
      it("Logout user", logoutUser());
      it("Fail 1. GET - fetch user information without authenticating", function (done) {
        server
          .get("/user")
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            done();
          });
      });
      it("Login user", loginUser());
      it("Success 1. GET - fetch user information with an authenticated user", function (done) {
        server
          .get("/user")
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.username, "Dwayne Johnson");
            done();
          });
      });
    });
    describe("PUT /user & PUT user/personalInformation", function () {
      it("Logout  user", logoutUser());
      it("Fail 1. PUT - Update username without authenticating", function (done) {
        server
          .put("/user")
          .send({
            username: "Not Dwayne",
            password: "password",
          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            done();
          });
      });
      it("Logging in user", loginUser());
      it("Success 1. PUT - Update username after authenticating", function (done) {
        server
          .put("/user")
          .send({
            username: "Not Dwayne",
            password: "password",
          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.message, "User was updated.");
            done();
          });
      });
      it(
        "Login User (because updating account info logs out user)",
        loginUser()
      );
      it("Success 2. PUT - Update username after authenticating again", function (done) {
        server
          .put("/user")
          .send({
            username: "Dwayne Johnson",
            password: "password",
          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.message, "User was updated.");
            done();
          });
      });
      it("Logout user", logoutUser());
      it("Fail 2. PUT - Update personal info of unauthenticated user", function (done) {
        server
          .put("/user/personalInformation")
          .send({
            age: 49,
            gender: "male",
            height: 196,
            weight: 118,
            goalWeight: 120,
          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            done();
          });
      });
      it("Login user", loginUser());
      it("Fail 3. PUT - Update personal info of authenticated user with incorrect input", function (done) {
        server
          .put("/user/personalInformation")
          .send({
            age: "forty nine",
            gender: "male",
            height: "one hundred ninety six",
            weight: "one hundred eighteen",
            goalWeight: "one hundrend twenty",
          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            done();
          });
      });
      it("Success 2. PUT - Update personal info of authenticated user", function (done) {
        server
          .put("/user/personalInformation")
          .send({
            age: 49,
            gender: "male",
            height: 196,
            weight: 118,
            goalWeight: 120,
          })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            done();
          });
      });
    });
    describe("DELETE /user", function () {
      it("Logout user", logoutUser());
      it("Fail 1. DELETE - Delete unauthenticated user", function (done) {
        server
          .delete("/user")
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, false);
            done();
          });
      });

      it("Login user", loginUser());
      it("Success 1. DELETE - Delete authenticated user", function (done) {
        server
          .delete("/user")
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            assert.strictEqual(res.body.success, true);
            done();
          });
      });
    });
  });
});
