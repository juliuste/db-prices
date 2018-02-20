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

// see https://github.com/public-transport/friendly-public-transport-format/blob/5ba55e2/docs/readme.md#modes
const modesByProduct = {
	S: 'train',
	IC: 'train',
	ICE: 'train',
	RE: 'train',
	VBG: 'train', // http://www.laenderbahn.com/vogtlandbahn/
	ALX: 'train' // http://www.laenderbahn.com/alex
}

const leg = (data) => ({
	// todo: rp, re, sp
	origin: {
		type: 'station',
		id: data.s,
		name: data.sn
		// todo: coordinates
	},
	departure: when(data.dep),
	departurePlatform: data.pd || null,
	destination: {
		type: 'station',
		id: data.d,
		name: data.dn
		// todo: coordinates
	},
	arrival: when(data.arr),
	arrivalPlatform: data.pa || null,
	line: {
		type: 'line',
		id: slugg(data.tn),
		name: data.tn,
		mode: modesByProduct[data.eg] || null,
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
		description: offer.description,
		anyTrain: offer.anyTrain
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
