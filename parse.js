'use strict'

const moment = require('moment-timezone')
const slugg = require('slugg')
const minBy = require('lodash.minby')

const price = (string) => parseFloat(string.replace(',', '.'))

const offer = (data, notes) => {
	const offer = {
		// todo: sel, t, c, arq, ff, aix, risids
		name: null,
		description: null,
		discount: data.tt === 'SP', // are there others than SP & NP?
		price: price(data.p),
		routes: data.sids,
		anyTrain: data.zb !== 'Y'
	}

	if (notes[data.pky]) Object.assign(offer, notes[data.pky])

	return offer
}

const when = (data) => {
	// todo: timezone
	return moment.tz(parseInt(data.m), 'Europe/Berlin').toISOString()
}

const leg = (data) => ({
	// todo: rp, re, sp
	origin: {
		type: 'station',
		id: data.s,
		name: data.sn
		// todo: coordinates
	},
	start: when(data.dep),
	departurePlatform: data.pd,
	destination: {
		type: 'station',
		id: data.d,
		name: data.dn
		// todo: coordinates
	},
	end: when(data.arr),
	arrivalPlatform: data.pa,
	line: {
		type: 'line',
		id: slugg(data.tn),
		name: data.tn,
		// todo: mode
		product: data.eg
	}
})

const journey = (_, offers) => {
	const legs = _.trains.map(leg)

	let offer = minBy(offers.filter((o) => o.routes.includes(_.sid)), (o) => o.price)
	const price = offer ? {
		currency: 'EUR',
		amount: offer.price,
		discount: offer.discount,
		name: offer.name,
		description: offer.description
	} : null

	return {
		// todo: sel, dir
		type: 'journey',
		id: _.sid,
		origin: legs[0].origin,
		destination: legs[legs.length - 1].destination,
		legs,
		price,
		nightTrain: _.NZVerb // todo: why here?
	}
}

const notes = (data) => {
	const notes = {}
	for (let ref in data) {
		notes[ref] = {name: data[ref].name, description: data[ref].hinweis}
	}
	return notes
}

module.exports = {notes, offer, journey}
