'use strict'

const floor = require('floordate')
const isRoughlyEqual = require('is-roughly-equal')
const co = require('co').wrap
const stations = require('db-stations')
const test = require('tape-co').default

const prices = require('./index')



const hour = 60 * 60 * 1000
const day = 24 * hour

const berlin = 8011160
const münchen = 8000261

const when = new Date(floor(new Date(), 'day') + day)



test('Berlin Hbf -> München Hbf', function* (test) {
	const results = yield prices(berlin, münchen, when)
	// todo
})
