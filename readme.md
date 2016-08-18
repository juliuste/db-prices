# db-prices

JavaScript module for finding the cheapest railway connections using the Deutsche Bahn Sparpreise API.

[![npm version](https://img.shields.io/npm/v/db-prices.svg)](https://www.npmjs.com/package/db-prices)
[![Build Status](https://travis-ci.org/juliuste/db-prices.svg?branch=master)](https://travis-ci.org/juliuste/db-prices)
[![dependency status](https://img.shields.io/david/juliuste/db-prices.svg)](https://david-dm.org/juliuste/db-prices)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/db-prices.svg)](https://david-dm.org/juliuste/db-prices#info=devDependencies)
[![MIT License](https://img.shields.io/badge/license-MIT-black.svg)](https://opensource.org/licenses/MIT)

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

`from` and `to` must be station IDs like `8000105`.
`date` must be a `Date` object; if empty, the current datetime will be used.

With `opt`, you can override the default options, which look like this:

```javascript
{
	class: 				2, 		// 1st class or 2nd class
	noICETrains: 		false,
	transferTime: 		0, 		// in minutes
	duration: 			1440, 	// search for routes in the next n minutes
	preferFastRoutes: 	true
	travellers: [{ 	// one or more
		bc:	0, 		// BahnCard ID (see https://gist.github.com/juliuste/202bb04f450a79f8fa12a2ec3abcd72d)
		typ: "E", 	// E: adult: K: child; B: baby -- BUG: child and baby dont work ATM
		alter: 30 	// age
	}],
}
```

## Response

With `from = 8000105`, `to = 8011160` and `date = new Date('2016-08-17T00:00:00.000Z')`, the result looked like this:

```javascript
[{
	id: '0',
	transfers: 1,
	nightTrain: false,
	trips: [{
		id: '0.0',
		start: 2016 - 08 - 17 T03: 06: 00.000 Z,
		from: {
			station: 8000105,
			platform: '7'
		},
		end: 2016 - 08 - 17 T04: 55: 00.000 Z,
		to: {
			station: 8000128,
			platform: '4'
		},
		line: 'ICE  988',
		type: 'ICE'
	}, {
		id: '0.1',
		start: 2016 - 08 - 17 T05: 04: 00.000 Z,
		from: {
			station: 8000128,
			platform: '4'
		},
		end: 2016 - 08 - 17 T07: 58: 00.000 Z,
		to: {
			station: 8011160,
			platform: '12'
		},
		line: 'ICE  876',
		type: 'ICE'
	}],
	offer: {
		ref: '72660',
		discount: true,
		price: 117.9,
		routes: [/* … */],
		anyTrain: false
	}
}, /* … */]
```
## Similar Projects

- [db-hafas](https://github.com/derhuerst/db-hafas/) – "JavaScript client for the DB HAFAS API."
- [db-hafas-rest](https://github.com/derhuerst/db-hafas-rest/) – "DB Hafas REST API"
- [db-stations](https://github.com/derhuerst/db-stations/) – "A list of DB stations."

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/db-prices/issues).

Cheers to [Jannis R](https://github.com/derhuerst) for contributing.
