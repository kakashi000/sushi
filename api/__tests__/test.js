/* eslint-disable no-undef */
const request = require('supertest');
const server = require('../app.js');

describe('/stats route testing', () => {
  it("should return an object with the bot's stats", async () => {
    const response = await request(server).get('/stats');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('counts');
    expect(response.body).toHaveProperty('countsLastMonth');
  });
});
