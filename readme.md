# db-prices

JavaScript module for finding the cheapest railway connections using the Deutsche Bahn Sparpreise API. Inofficial, using an endpoint by *Deutsche Bahn*. Ask them for permission before using this module in production.

[![npm version](https://img.shields.io/npm/v/db-prices.svg)](https://www.npmjs.com/package/db-prices)
[![Build Status](https://travis-ci.org/juliuste/db-prices.svg?branch=master)](https://travis-ci.org/juliuste/db-prices)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/db-prices.svg)](https://greenkeeper.io/)
[![dependency status](https://img.shields.io/david/juliuste/db-prices.svg)](https://david-dm.org/juliuste/db-prices)
[![license](https://img.shields.io/github/license/juliuste/db-prices.svg?style=flat)](LICENSE)
[![chat on gitter](https://badges.gitter.im/public-transport/Lobby.svg)](https://gitter.im/public-transport/Lobby)

## Installation

```bash
npm install db-prices
```

## Usage

`prices()` returns a `Promise` that will resolve with a list of offers.

```javascript
const prices = require('db-prices')

prices(from, to, [date], [opt]).then(…)
```

`from` and `to` must be station IDs like `'8000105'`.
`date` must be a `Date` object; if empty, the current datetime will be used.

With `opt`, you can override the default options, which look like this:

```javascript
{
	class: 			2, 	// 1st class or 2nd class
	noICETrains: 		false,
	transferTime: 		0, 	// in minutes
	duration: 		1440, 	// search for routes in the next n minutes
	preferFastRoutes: 	true
	travellers: [{ 		// one or more
		bc:	0, 	// BahnCard ID (see https://gist.github.com/juliuste/202bb04f450a79f8fa12a2ec3abcd72d)
		typ: 	"E", 	// E: adult: K: child; B: baby -- BUG: child and baby dont work ATM
		alter: 	30 	// age
	}],
}
```

## Response

The result will be a list of [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) `journey` objects.

With `from = '8000105'`, `to = '8011160'` and `date = new Date('2016-08-17T00:00:00.000Z')`, the result looked like this:

```javascript
[
	{
		type: 'journey',
		id: '0',
		origin: {
			type: 'station',
			id: '8000105',
			name: 'Frankfurt(Main)Hbf'
		},
		destination: {
			type: 'station',
			id: '8098160',
			name: 'Berlin Hbf (tief)'
		},
		legs: [{
			origin: {
				type: 'station',
				id: '8000105',
				name: 'Frankfurt(Main)Hbf'
			},
			departure: '2017-06-05T08:53:00.000Z',
			departurePlatform: '13',
			destination: {
				type: 'station',
				id: '8098160',
				name: 'Berlin Hbf (tief)'
			},
			arrival: '2017-06-05T13:17:00.000Z',
			arrivalPlatform: '7',
			line: {
				type: 'line',
				id: 'ice-1537',
				name: 'ICE 1537',
				product: 'ICE'
			}
		}],
		price: {
			currency: 'EUR',
			amount: 126,
			discount: false,
			name: 'Flexpreis',
			description: 'Fully flexible (not bound to a specific train / not dependent on the connection indicated on the selected route). Exchanges and refunds free of charge; on or after the first day of validity subject to a fee.'
		},
		nightTrain: false
	}
	// …
]
```

## Similar Projects

- [db-hafas](https://github.com/derhuerst/db-hafas/) – "JavaScript client for the DB HAFAS API."
- [db-hafas-rest](https://github.com/juliuste/db-hafas-rest/) – "DB Hafas REST API"
- [db-stations](https://github.com/derhuerst/db-stations/) – "A list of DB stations."

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/db-prices/issues).

Cheers to [Jannis R](https://github.com/derhuerst) for contributing.
