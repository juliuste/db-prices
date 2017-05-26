'use strict'

const floor = require('floordate')
const isRoughlyEqual = require('is-roughly-equal')
const stations = require('db-stations')
const test = require('tape')
require('tape-promise').default(test)

const prices = require('.')



const hour = 60 * 60 * 1000
const day = 24 * hour

const berlin = 8011160
const münchen = 8000261

const when = new Date(floor(new Date(), 'day') + day)



const validDate = (d) => d instanceof Date && isRoughlyEqual(2 * hour, +when)

const validPrice = (p) => 'number' === typeof p && p > 0 && p < 1000

const findStation = (id) => new Promise((yay, nay) =>
	stations(id).on('error', nay).once('data', yay))

const validTrip = async (test, t) => {
	test.ok(t, 'missing trip')

	test.ok(validDate(t.start), 'invalid data')
	test.ok(t.from, 'missing `from`')
	test.ok(await findStation(t.from.station), 'station not found')
	// test.equal(typeof t.from.platform, 'string')

	test.ok(validDate(t.end))
	test.ok(t.to, 'missing `to`')
	test.ok(await findStation(t.to.station), 'station not found')
	// test.equal(typeof t.to.platform, 'string')

	test.equal(typeof t.line, 'string')
	test.equal(typeof t.type, 'string')
}

const validOffer = (test, o) => {
	test.ok(o, 'missing offer')

	test.equal(typeof o.discount, 'boolean')
	test.ok(validPrice(o.price), 'invalid price')
	test.ok(Array.isArray(o.routes), 'missing routes') // avoiding recursion here
	test.equal(typeof o.anyTrain, 'boolean')
}

const validRoute = async (test, r) => {
	test.ok(r, 'missing route')

	test.ok(Array.isArray(r.trips), 'missing trips')
	test.ok(r.trips.length > 0, 'missing trips')
	for (let trip of r.trips) {
		await validTrip(test, trip)
	}

	test.equal(typeof r.transfers, 'number')
	test.ok(r.transfers >= 0 && r.transfers < 10, 'weird nr of transfers')
	test.equal(typeof r.nightTrain, 'boolean')
	validOffer(test, r.offer)
}



test('Berlin Hbf -> München Hbf', async (test) => {
	const results = await prices(berlin, münchen, when)
	test.ok(Array.isArray(results))
	test.ok(results.length > 0, 'no results')
	for (let result of results) {
		await validRoute(test, result)
	}
})


// todo: opt.class
// todo: opt.noICETrains
// todo: opt.transferTime
// todo: opt.duration
// todo: opt.preferFastRoutes
