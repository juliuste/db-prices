'use strict'

const got = require('got')
const moment = require('moment-timezone')

const formatDate = (date) => moment(date).tz('Europe/Berlin').format('DD.MM.YY')
const formatTime = (date) => moment(date).tz('Europe/Berlin').format('HH:mm')

const parsePrice = (string) => {
	string = string.split(',')
	return string[0] + string[1] ? string[1] / 100 : 0
}

const parseOffer = (routes, data) => ({
	// todo: sel, t, c, arq, ff, aix, risids
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
		platform: data.pd
	},
	end: new Date(+data.arr.m),
	to: {
		station: +data.d,
		platform: data.pa
	},
	line: data.tn,
	type: data.eg
})

const parseRoute = (data) => ({
	// todo: sel, dir,
	id: data.sid,
	transfers: data.nt, // is this correct?
	nightTrain: data.NZVerb, // is this correct?
	trips: data.trains.map(parseTrip),
	offer: null
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

const prices = (start, dest, date, opt) => {
	date = date || new Date()
	return got('http://ps.bahn.de/preissuche/preissuche/psc_service.go', {json: true, query: {
		lang: 'en',
		service: 'pscangebotsuche',
		data: JSON.stringify({
			s: start,
			d: dest,
			dt: formatDate(date),
			t: formatTime(date),
			c: 2, // 1: 1st class; 2: 2nd class
			ohneICE: false, // do not use ice trains
			tct: 0, // transfer time in minutes; default is 0; 0-45, stepped by 5; 0, 10, 15, 20, 25…
			dur: 1440, // search route in the next n minutes
			travellers:[{ // one or more
				bc: 0, // bahncard; 13, 12, 11, 9, 4, 3, 2, 1, 0
				typ: "E", // E: adult: K: child; B: baby
				alter: 69
			}],
			sv: true, // schnelle verbindung bevorzugen
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
