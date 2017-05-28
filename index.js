'use strict'

const {stringify} = require('query-string')
const {fetch} = require('fetch-ponyfill')()
const moment = require('moment-timezone')
const slugg = require('slugg')
const minBy = require('lodash.minby')

const formatDate = (date) => moment(date).tz('Europe/Berlin').format('DD.MM.YY')
const formatTime = (date) => moment(date).tz('Europe/Berlin').format('HH:mm')

const parsePrice = (string) => parseFloat(string.replace(',', '.'))

const parseOffer = (data) => ({
	// todo: sel, t, c, arq, ff, aix, risids
	ref: data.pky,
	discount: data.tt === 'SP', // are there others than SP & NP?
	price: parsePrice(data.p),
	routes: data.sids,
	anyTrain: data.zb !== 'Y'
})

const parseWhen = (data) => {
	// todo: timezone
	return moment.tz(parseInt(data.m), 'Europe/Berlin').toISOString()
}

const parseLeg = (data) => ({
	// todo: rp, re, sp
	origin: {
		type: 'station',
		id: data.s,
		name: data.sn
		// todo: coordinates
	},
	start: parseWhen(data.dep),
	departurePlatform: data.pd,
	to: {
		type: 'station',
		id: data.d,
		name: data.dn
		// todo: coordinates
	},
	end: parseWhen(data.arr),
	arrivalPlatform: data.pa,
	line: {
		type: 'line',
		id: slugg(data.tn),
		name: data.tn,
		// todo: mode
		product: data.eg
	}
})

const parseJourney = (_, offers) => {
	let offer = minBy(offers.filter((o) => o.routes.includes(_.sid)), (o) => o.price)
	const price = offer ? {
		currency: 'EUR',
		amount: offer.price,
		discount: offer.discount
	} : null

	return {
		// todo: sel, dir
		type: 'journey',
		id: _.sid,
		legs: _.trains.map(parseLeg),
		price,
		nightTrain: _.NZVerb // todo: why here?
	}
}

const parseNotes = (data) => {
	const results = {}
	for(let ref in data){
		results[ref] = parseNote(data[ref])
	}
	return results
}

const parseNote = (data) => ({
	title: data.name,
	text: data.hinweis
})

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

const prices = (start, dest, date, opt) => {
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
		const offers = []
		for (let id in body.angebote) {
			offers.push(parseOffer(body.angebote[id]))
		}

		const journeys = {}
		for (let id in body.verbindungen) {
			journeys[id] = parseJourney(body.verbindungen[id], offers)
		}

		return journeys
	})
}

module.exports = prices
