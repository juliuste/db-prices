'use strict'

const got = require('got')
const moment = require('moment-timezone')

const formatDate = (date) => moment(date).tz('Europe/Berlin').format('DD.MM.YY')
const formatTime = (date) => moment(date).tz('Europe/Berlin').format('HH:mm')

const parsePrice = (string) => parseFloat(string.replace(',','.'))

const parseOffer = (routes, data) => ({
	// todo: sel, t, c, arq, ff, aix, risids
	raw: data,
	ref: data.pky,
	discount: data.tt === 'SP', // are there others than SP & NP?
	price: parsePrice(data.p),
	routes: data.sids.map((sid) => routes.find((route) => route.id === sid)),
	anyTrain: data.zb !== 'Y'
})

const parseTrip = (data) => ({
	// todo: rp, re, sp
	id: data.tid,
	start: new Date(+data.dep.m),
	from: {
		station: +data.s,
		name: data.sn,
		platform: data.pd
	},
	end: new Date(+data.arr.m),
	to: {
		station: +data.d,
		name: data.dn,
		platform: data.pa
	},
	line: data.tn,
	type: data.eg
})

const parseRoute = (data) => ({
	// todo: sel, dir,
	id: data.sid,
	transfers: +data.nt, // is this correct?
	nightTrain: data.NZVerb, // is this correct?
	trips: data.trains.map(parseTrip),
	offer: null,
	raw: data
})

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

const err = (error) => {throw error}

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

const prices = (start, dest, date, opt) => {
	opt = Object.assign({}, defaults, opt || {})
	date = date || new Date()
	return got('http://ps.bahn.de/preissuche/preissuche/psc_service.go', {json: true, query: {
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
	}})
	.then((res) => {
		const body = res.body

		const routes = []
		for(let id in body.verbindungen) routes[id] = parseRoute(body.verbindungen[id])

		const offers = []
		for(let id in body.angebote) offers[id] = parseOffer(routes, body.angebote[id])

		for(let offer of offers) for(let route of offer.routes) route.offer = offer

		return routes
	}, err)
}

module.exports = prices
