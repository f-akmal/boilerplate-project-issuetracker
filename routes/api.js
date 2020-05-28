/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'

const expect = require('chai').expect
const MongoClient = require('mongodb')
const ObjectId = require('mongodb').ObjectID
const mongoose = require('mongoose')

const CONNECTION_STRING = process.env.DB //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const issueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: '' },
  status_text: { type: String, default: '' },
  created_on: { type: Date, default: new Date() },
  updated_on: { type: Date, default: new Date() },
  open: { type: Boolean, default: true }
})

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      const project = req.params.project
      const Issue = mongoose.model(project, issueSchema, project)
      const query = req.query
      Issue.find(query, (err, docs) => {
        res.json(docs)
      })
    })

    .post(function (req, res) {
      const project = req.params.project
      const Issue = mongoose.model(project, issueSchema, project)
      const issue = new Issue(req.body)
      issue.save((err, doc) => {
        if (err) {
          return res.json({ message: 'Missing required fields' })
        }
        res.json(doc)
      })
    })

    .put(function (req, res) {
      const project = req.params.project
      const Issue = mongoose.model(project, issueSchema, project)
      const { _id, ...query } = req.body
      if (!_id || !query) return res.json({ message: 'no updated field sent' })
      Issue.findOneAndUpdate(
        { _id },
        { ...query, updated_on: new Date() },
        { new: true, lean: true },
        (err, doc) => {
          res.json({ ...doc, message: `successfully updated ${_id}` })
        })
    })

    .delete(function (req, res) {
      const project = req.params.project
      const Issue = mongoose.model(project, issueSchema, project)
      const { _id } = req.body
      Issue.findOneAndDelete({ _id }, (err, result) => {
        if (err) return res.json({ message: '_id error' })
        res.json({ message: `deleted ${_id}` })
      })
    })

}
