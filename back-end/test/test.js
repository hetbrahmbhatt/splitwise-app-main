var chai = require('chai')
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

it("Login API should check credentials and return status code if correct credentials(POST)", function (done) {
    chai.request('http://127.0.0.1:4003')
        .post('/users/login')
        .send({ "email": "x2@gmail.com", "password": "x2" })
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
})
it("Accept a group invitation", function (done) {
    chai.request('http://127.0.0.1:4003')
        .put('/groups/invite')
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdlMTIwMzZjOTk0YjNmNjkwMzRlZjciLCJlbWFpbCI6IngyQGdtYWlsLmNvbSIsIm5hbWUiOiJ4MiIsImRlZmF1bHRjdXJyZW5jeSI6IiQiLCJ0aW1lem9uZSI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJpYXQiOjE2MTkwNTI4OTIsImV4cCI6MTYyMDA2MDg5Mn0.LUZqnXuIJGUJHl1j2MzNPBO-kVPErJQpdL4e8dT7IIY')
        .send({ "groupID": "607ca3859006367697fd9b0f","userID": "607ca35e9006367697fd9b0d" , "type": "accept" })
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
})
it("Get User By ID(GET)", function (done) {
    chai.request('http://127.0.0.1:4003')
        .get('/users/userbyid/607ca35e9006367697fd9b0d')
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdlMTIwMzZjOTk0YjNmNjkwMzRlZjciLCJlbWFpbCI6IngyQGdtYWlsLmNvbSIsIm5hbWUiOiJ4MiIsImRlZmF1bHRjdXJyZW5jeSI6IiQiLCJ0aW1lem9uZSI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJpYXQiOjE2MTkwNTI4OTIsImV4cCI6MTYyMDA2MDg5Mn0.LUZqnXuIJGUJHl1j2MzNPBO-kVPErJQpdL4e8dT7IIY')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
})


it("Get Group By GroupID(GET)", function (done) {
    chai.request('http://127.0.0.1:4003')
        .get('/groups/groupbyid/607ca3859006367697fd9b0f')
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdlMTIwMzZjOTk0YjNmNjkwMzRlZjciLCJlbWFpbCI6IngyQGdtYWlsLmNvbSIsIm5hbWUiOiJ4MiIsImRlZmF1bHRjdXJyZW5jeSI6IiQiLCJ0aW1lem9uZSI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJpYXQiOjE2MTkwNTI4OTIsImV4cCI6MTYyMDA2MDg5Mn0.LUZqnXuIJGUJHl1j2MzNPBO-kVPErJQpdL4e8dT7IIY')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
})

it("Edit Profile Of a user (PUT)", function (done) {
    chai.request('http://127.0.0.1:4003')
        .put('/users/editprofile')
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdlMTIwMzZjOTk0YjNmNjkwMzRlZjciLCJlbWFpbCI6IngyQGdtYWlsLmNvbSIsIm5hbWUiOiJ4MiIsImRlZmF1bHRjdXJyZW5jeSI6IiQiLCJ0aW1lem9uZSI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJpYXQiOjE2MTkwNTI4OTIsImV4cCI6MTYyMDA2MDg5Mn0.LUZqnXuIJGUJHl1j2MzNPBO-kVPErJQpdL4e8dT7IIY')
        .send({ "name": "test1", "defaultCurrency": "$", "language": "Chinese", "phoneno": "123-456-7890" })
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
})