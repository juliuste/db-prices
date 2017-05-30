'use strict'

const moment = require('moment-timezone')
const isRoughlyEqual = require('is-roughly-equal')
const stations = require('db-stations')
const test = require('tape')
require('tape-promise').default(test)

const prices = require('.')



const hour = 60 * 60 * 1000
const day = 24 * hour

const berlin = 8011160
const münchen = 8000261

const tz = 'Europe/Berlin'
const when = moment.tz(Date.now(), tz).hour(10).minute(30).second(0).day('monday').toDate()



const validDate = (d) => {
	return isRoughlyEqual(36 * hour, +when, +new Date(d))
}

const findStation = (id) => new Promise((yay, nay) =>
	stations(id).on('error', nay).once('data', yay))

const validLeg = async (test, t) => {
	test.ok(t, 'missing trip')

	test.ok(validDate(t.start), 'invalid start date')
	test.ok(t.origin, 'missing `origin`')
	test.ok(await findStation(t.origin.station), 'station not found')
	test.equal(typeof t.departurePlatform, 'string')

	if (!validDate(t.end)) console.error(t.end, when)
	test.ok(validDate(t.end), 'invalid end date')
	test.ok(t.destination, 'missing `destination`')
	test.ok(await findStation(t.destination.station), 'station not found')
	test.equal(typeof t.arrivalPlatform, 'string')

	test.ok(t.line, 'missing line')
	test.equal(typeof t.line.name, 'string')
	// test.equal(typeof t.line.mode, 'string') // todo
	test.equal(typeof t.line.product, 'string')
}

const validPrice = (test, p) => {
	test.ok(p, 'missing price')

	test.equal(p.currency, 'EUR')
	test.equal(typeof p.amount, 'number')
	test.ok(p.amount > 0 && p.amount < 1000, 'ridiculous amount')
	test.equal(typeof p.discount, 'boolean')
	// test.equal(typeof p.anyTrain, 'boolean') // todo
}

const validJourney = async (test, j) => {
	test.ok(j, 'missing route')

	test.ok(Array.isArray(j.legs), 'missing legs')
	test.ok(j.legs.length > 0, 'missing legs')
	for (let leg of j.legs) {
		await validLeg(test, leg)
	}

	test.equal(typeof j.nightTrain, 'boolean')
	validPrice(test, j.price)
}



test('Berlin Hbf -> München Hbf', async (test) => {
	const results = await prices(berlin, münchen, when)
	test.ok(Array.isArray(results))
	test.ok(results.length > 0, 'no results')
	for (let result of results) {
		await validJourney(test, result)
	}
})


// todo: opt.class
// todo: opt.noICETrains
// todo: opt.transferTime
// todo: opt.duration
// todo: opt.preferFastRoutes
