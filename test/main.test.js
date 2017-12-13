const request = require('supertest');


describe('E2E: Test Plugin', () => {

  it('should be able to hit anonymous api', function () {
    return request(`http://localhost:8080`)
      .get('/ip')
      .expect(200);
  });

  it('should not be able to hit authenticated api', function () {
    return request(`http://localhost:8080`)
      .get('/ip2')
      .expect(401);
  });

  //Ensuring we are not using out of the box oauth2 plugin
  it('should not give any response for GET /oauth2/token', function () {
    return request(`http://localhost:8080`)
      .get('/oauth2/token')
      .expect(404);
  });

  it('should give response for POST /oauth2/token', function () {
    return request(`http://localhost:8080`)
      .post('/oauth2/token')
      .set('Content-Type', 'application/json')
      .send('{"username":"test","password":"test"}')
      .expect(200, {
        email: 'test@test.com',
        username: 'test',
        id: 1,
        access_token: ''
      });
  });

  it('should verify access_token after login', function () {
    return request(`http://localhost:8080`)
      .post('/oauth2/token')
      .set('Content-Type', 'application/json')
      .send('{"username":"test","password":"test"}')
      .then(function(res) {
        var access_token = res.body.access_token;
        console.log('access_token',access_token);
        return request(`http://localhost:8080`)
        .get('/ip2')
        .set('Authorization', 'Bearer '+access_token)
        .then(function(res) {
          console.log(res.body);
          
        });
      });
  });


  it('should give response for GET /logout', function () {
    return request(`http://localhost:8080`)
      .get('/logout')
      .expect(200);
  });

})