'use strict'

const moment = require('moment-timezone')
const {stringify} = require('query-string')
const {fetch} = require('fetch-ponyfill')()

const parse = require('./parse')

const formatDate = (date) => moment(date).tz('Europe/Berlin').format('DD.MM.YY')
const formatTime = (date) => moment(date).tz('Europe/Berlin').format('HH:mm')

const defaults = {
	class: 2, // 1st class or 2nd class?
	travellers: [{ // one or more
		bc: 0, // bahncard; 13, 12, 11, 9, 4, 3, 2, 1, 0
		typ: "E", // E: adult: K: child; B: baby
		alter: 30
	}],
	noICETrains: false,
	// todo: can this have any value? the DB app just offers 0, 10, 15, 20, 25
	transferTime: 0, // in minutes
	duration: 1440, // search for routes in the next n minutes
	preferFastRoutes: true
}

const endpoint = 'http://ps.bahn.de/preissuche/preissuche/psc_service.go'

const queryPrices = (start, dest, date, opt) => {
	opt = Object.assign({}, defaults, opt || {})
	date = date || new Date()

	const query = {
		lang: 'en',
		service: 'pscangebotsuche',
		data: JSON.stringify({
			s: start,
			d: dest,
			dt: formatDate(date),
			t: formatTime(date),
			c: opt.class,
			ohneICE: opt.noICETrains,
			tct: opt.transferTime,
			dur: opt.duration,
			travellers: opt.travellers,
			sv: opt.preferFastRoutes,
			v: "16040000", // client version (direved from date?)
			dir: "1", // ???
			bic: false, // ???
			device: "HANDY", // todo: is this necessary?
			os: "iOS_9.3.1" // todo: is this necessary?
		})
	}

	return fetch(endpoint + '?' + stringify(query), {
		headers: {accept: 'application/json'},
		mode: 'cors',
		redirect: 'follow'
	})
	.then((res) => {
		if (!res.ok) {
			const err = new Error(res.statusText)
			err.statusCode = res.status
			throw err
		}
		return res.json()
	})
	.then((body) => {
		const notes = parse.notes(body.peTexte)

		const offers = []
		for (let id in body.angebote) {
			offers.push(parse.offer(body.angebote[id], notes))
		}

		const journeys = []
		for (let id in body.verbindungen) {
			journeys.push(parse.journey(body.verbindungen[id], offers))
		}

		return journeys
	})
}

module.exports = queryPrices
