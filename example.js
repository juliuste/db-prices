'use strict'

const moment = require('moment-timezone')
const {inspect} = require('util')
const prices = require('.')

const tz = 'Europe/Berlin'
// some monday in the future
const when = moment.tz(Date.now(), tz).hour(10).minute(30).second(0).day(1 + 7).toDate()

prices('8000105', '8011160', when)
.then((routes) => {
	console.log(inspect(routes, {depth: null}))
})
.catch((err) => {
	console.error(err)
	process.exit(1)
})
