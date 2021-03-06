/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http')
var chai = require('chai')
var assert = chai.assert
var server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', function () {

  suite('POST /api/issues/{project} => object with issue data', function () {

    test('Every field filled in', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.status_text, 'In QA')
          assert.exists(res.body._id)
          assert.exists(res.body.created_on)
          assert.exists(res.body.updated_on)
          assert.isTrue(res.body.open)
          done()
        })
    })

    test('Required fields filled in', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.exists(res.body.assigned_to)
          assert.exists(res.body.status_text)
          assert.exists(res.body._id)
          assert.exists(res.body.created_on)
          assert.exists(res.body.updated_on)
          assert.isTrue(res.body.open)
          done()
        })
    })

    test('Missing required fields', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'Missing required fields')
          done()
        })
    })
  })

  suite('PUT /api/issues/{project} => text', function () {

    test('No body', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'no updated field sent')
          done()
        })
    })

    test('One field to update', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end((err, res) => {
          const _id = res.body._id
          chai.request(server)
            .put('/api/issues/test')
            .send({
              _id: _id,
              issue_title: 'New Title'
            })
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.body.issue_title, 'New Title')
              assert.equal(res.body.issue_text, 'text')
              assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
              assert.exists(res.body.assigned_to)
              assert.exists(res.body.status_text)
              assert.exists(res.body._id)
              assert.exists(res.body.created_on)
              assert.exists(res.body.updated_on)
              assert.isTrue(res.body.open)
              assert.equal(res.body.message, `successfully updated ${_id}`)
              done()
            })
        })
    })

    test('Multiple fields to update', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end((err, res) => {
          const _id = res.body._id
          chai.request(server)
            .put('/api/issues/test')
            .send({
              _id: _id,
              issue_title: 'New Title',
              issue_text: 'new text'
            })
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.body.issue_title, 'New Title')
              assert.equal(res.body.issue_text, 'new text')
              assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
              assert.exists(res.body.assigned_to)
              assert.exists(res.body.status_text)
              assert.exists(res.body._id)
              assert.exists(res.body.created_on)
              assert.exists(res.body.updated_on)
              assert.isTrue(res.body.open)
              assert.equal(res.body.message, `successfully updated ${_id}`)
              done()
            })
        })
    })
  })

  suite('GET /api/issues/{project} => Array of objects with issue data', function () {

    test('No filter', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'created_by')
          assert.property(res.body[0], 'assigned_to')
          assert.property(res.body[0], 'open')
          assert.property(res.body[0], 'status_text')
          assert.property(res.body[0], '_id')
          done()
        })
    })

    test('One filter', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end((req, res) => {
          chai.request(server)
            .get('/api/issues/test')
            .query({ open: true })
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.isArray(res.body)
              res.body.forEach((body) => {
                assert.property(body, 'issue_title')
                assert.property(body, 'issue_text')
                assert.property(body, 'created_on')
                assert.property(body, 'updated_on')
                assert.property(body, 'created_by')
                assert.property(body, 'assigned_to')
                assert.property(body, 'open')
                assert.property(body, 'status_text')
                assert.property(body, '_id')
                assert.isTrue(body.open)
              })
              done()
            })
        })
    })

    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end((req, res) => {
          chai.request(server)
            .get('/api/issues/test')
            .query({ open: true, issue_text: 'text' })
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.isArray(res.body)
              res.body.forEach((body) => {
                assert.property(body, 'issue_title')
                assert.equal(body.issue_text, 'text')
                assert.property(body, 'created_on')
                assert.property(body, 'updated_on')
                assert.property(body, 'created_by')
                assert.property(body, 'assigned_to')
                assert.property(body, 'open')
                assert.property(body, 'status_text')
                assert.property(body, '_id')
                assert.isTrue(body.open)
              })
              done()
            })
        })
    })
  })

  suite('DELETE /api/issues/{project} => text', function () {

    test('No _id', function (done) {
      chai.request(server)
        .del('/api/issues/test')
        .send({ _id: 'invalidId' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.message, '_id error')
          done()
        })
    })

    test('Valid _id', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end((err, res) => {
          const _id = res.body._id
          chai.request(server)
            .del('/api/issues/test')
            .send({ _id })
            .end((err, res) => {
              assert.equal(res.status, 200)
              assert.equal(res.body.message, `deleted ${_id}`)
              done()
            })
        })
    })
  })
})
