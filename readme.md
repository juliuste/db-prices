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

```javascript
prices = require('db-prices')

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
        routes: [
            [Circular], {
                id: '2',
                transfers: 1,
                nightTrain: false,
                trips: [{
                    id: '2.0',
                    start: 2016 - 08 - 17 T04: 26: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '8'
                    },
                    end: 2016 - 08 - 17 T05: 49: 00.000 Z,
                    to: {
                        station: 8000115,
                        platform: '1'
                    },
                    line: 'RE  4502',
                    type: 'RE'
                }, {
                    id: '2.1',
                    start: 2016 - 08 - 17 T06: 07: 00.000 Z,
                    from: {
                        station: 8000115,
                        platform: '7'
                    },
                    end: 2016 - 08 - 17 T09: 33: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '8'
                    },
                    line: 'ICE 1684',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '3',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '3.0',
                    start: 2016 - 08 - 17 T05: 02: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '10'
                    },
                    end: 2016 - 08 - 17 T09: 01: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '6'
                    },
                    line: 'ICE 1533',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '5',
                transfers: 1,
                nightTrain: false,
                trips: [{
                    id: '5.0',
                    start: 2016 - 08 - 17 T05: 18: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '9'
                    },
                    end: 2016 - 08 - 17 T08: 22: 00.000 Z,
                    to: {
                        station: 8010205,
                        platform: '14'
                    },
                    line: 'ICE 1555',
                    type: 'ICE'
                }, {
                    id: '5.1',
                    start: 2016 - 08 - 17 T09: 15: 00.000 Z,
                    from: {
                        station: 8010205,
                        platform: '11'
                    },
                    end: 2016 - 08 - 17 T10: 30: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '7'
                    },
                    line: 'IC  2286',
                    type: 'IC'
                }],
                offer: [Circular]
            }, {
                id: '6',
                transfers: 2,
                nightTrain: false,
                trips: [{
                    id: '6.0',
                    start: 2016 - 08 - 17 T05: 42: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '11'
                    },
                    end: 2016 - 08 - 17 T05: 47: 00.000 Z,
                    to: {
                        station: 8002041,
                        platform: '6'
                    },
                    line: 'RB 15606',
                    type: 'RB'
                }, {
                    id: '6.1',
                    start: 2016 - 08 - 17 T06: 01: 00.000 Z,
                    from: {
                        station: 8002041,
                        platform: '8'
                    },
                    end: 2016 - 08 - 17 T08: 34: 00.000 Z,
                    to: {
                        station: 8000152,
                        platform: '7'
                    },
                    line: 'ICE  674',
                    type: 'ICE'
                }, {
                    id: '6.2',
                    start: 2016 - 08 - 17 T09: 04: 00.000 Z,
                    from: {
                        station: 8000152,
                        platform: '10'
                    },
                    end: 2016 - 08 - 17 T10: 49: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '1'
                    },
                    line: 'IC  2222',
                    type: 'IC'
                }],
                offer: [Circular]
            }, {
                id: '7',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '7.0',
                    start: 2016 - 08 - 17 T06: 13: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '9'
                    },
                    end: 2016 - 08 - 17 T10: 57: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '12'
                    },
                    line: 'ICE  694',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '8',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '8.0',
                    start: 2016 - 08 - 17 T07: 02: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '13'
                    },
                    end: 2016 - 08 - 17 T11: 01: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '7'
                    },
                    line: 'ICE 1535',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '9',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '9.0',
                    start: 2016 - 08 - 17 T07: 13: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '8'
                    },
                    end: 2016 - 08 - 17 T11: 59: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '12'
                    },
                    line: 'ICE  374',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '10',
                transfers: 1,
                nightTrain: false,
                trips: [{
                    id: '10.0',
                    start: 2016 - 08 - 17 T07: 19: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '9'
                    },
                    end: 2016 - 08 - 17 T10: 22: 00.000 Z,
                    to: {
                        station: 8010205,
                        platform: '14'
                    },
                    line: 'ICE 1557',
                    type: 'ICE'
                }, {
                    id: '10.1',
                    start: 2016 - 08 - 17 T11: 15: 00.000 Z,
                    from: {
                        station: 8010205,
                        platform: '11'
                    },
                    end: 2016 - 08 - 17 T12: 30: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '6'
                    },
                    line: 'IC  2186',
                    type: 'IC'
                }],
                offer: [Circular]
            }, {
                id: '11',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '11.0',
                    start: 2016 - 08 - 17 T08: 13: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '9'
                    },
                    end: 2016 - 08 - 17 T12: 54: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '11'
                    },
                    line: 'ICE  692',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '12',
                transfers: 1,
                nightTrain: false,
                trips: [{
                    id: '12.0',
                    start: 2016 - 08 - 17 T08: 26: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '6'
                    },
                    end: 2016 - 08 - 17 T09: 49: 00.000 Z,
                    to: {
                        station: 8000115,
                        platform: '1'
                    },
                    line: 'RE  4510',
                    type: 'RE'
                }, {
                    id: '12.1',
                    start: 2016 - 08 - 17 T10: 07: 00.000 Z,
                    from: {
                        station: 8000115,
                        platform: '7'
                    },
                    end: 2016 - 08 - 17 T13: 33: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '7'
                    },
                    line: 'ICE 1208',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '13',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '13.0',
                    start: 2016 - 08 - 17 T09: 02: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '13'
                    },
                    end: 2016 - 08 - 17 T13: 01: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '6'
                    },
                    line: 'ICE 1537',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '14',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '14.0',
                    start: 2016 - 08 - 17 T09: 13: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '9'
                    },
                    end: 2016 - 08 - 17 T13: 59: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '12'
                    },
                    line: 'ICE  372',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '15',
                transfers: 1,
                nightTrain: false,
                trips: [{
                    id: '15.0',
                    start: 2016 - 08 - 17 T09: 19: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '6'
                    },
                    end: 2016 - 08 - 17 T12: 22: 00.000 Z,
                    to: {
                        station: 8010205,
                        platform: '14'
                    },
                    line: 'ICE 1559',
                    type: 'ICE'
                }, {
                    id: '15.1',
                    start: 2016 - 08 - 17 T13: 15: 00.000 Z,
                    from: {
                        station: 8010205,
                        platform: '11'
                    },
                    end: 2016 - 08 - 17 T14: 30: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '6'
                    },
                    line: 'IC  2384',
                    type: 'IC'
                }],
                offer: [Circular]
            }, {
                id: '16',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '16.0',
                    start: 2016 - 08 - 17 T10: 13: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '8'
                    },
                    end: 2016 - 08 - 17 T14: 56: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '11'
                    },
                    line: 'ICE  690',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '17',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '17.0',
                    start: 2016 - 08 - 17 T11: 02: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '12'
                    },
                    end: 2016 - 08 - 17 T15: 01: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '6'
                    },
                    line: 'ICE 1539',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '18',
                transfers: 1,
                nightTrain: false,
                trips: [{
                    id: '18.0',
                    start: 2016 - 08 - 17 T11: 13: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '9'
                    },
                    end: 2016 - 08 - 17 T15: 43: 00.000 Z,
                    to: {
                        station: 8010404,
                        platform: '6'
                    },
                    line: 'ICE  370',
                    type: 'ICE'
                }, {
                    id: '18.1',
                    start: 2016 - 08 - 17 T15: 51: 00.000 Z,
                    from: {
                        station: 8010404,
                        platform: '6'
                    },
                    end: 2016 - 08 - 17 T16: 01: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '3'
                    },
                    line: 'RE 63917',
                    type: 'RE'
                }],
                offer: [Circular]
            }, {
                id: '19',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '19.0',
                    start: 2016 - 08 - 17 T11: 13: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '9'
                    },
                    end: 2016 - 08 - 17 T16: 02: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '11'
                    },
                    line: 'ICE  370',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '20',
                transfers: 1,
                nightTrain: false,
                trips: [{
                    id: '20.0',
                    start: 2016 - 08 - 17 T11: 19: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '6'
                    },
                    end: 2016 - 08 - 17 T14: 22: 00.000 Z,
                    to: {
                        station: 8010205,
                        platform: '14'
                    },
                    line: 'ICE 1651',
                    type: 'ICE'
                }, {
                    id: '20.1',
                    start: 2016 - 08 - 17 T15: 15: 00.000 Z,
                    from: {
                        station: 8010205,
                        platform: '11'
                    },
                    end: 2016 - 08 - 17 T16: 30: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '7'
                    },
                    line: 'IC  2282',
                    type: 'IC'
                }],
                offer: [Circular]
            }, {
                id: '21',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '21.0',
                    start: 2016 - 08 - 17 T12: 13: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '8'
                    },
                    end: 2016 - 08 - 17 T16: 58: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '12'
                    },
                    line: 'ICE  598',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '22',
                transfers: 1,
                nightTrain: false,
                trips: [{
                    id: '22.0',
                    start: 2016 - 08 - 17 T12: 26: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '5'
                    },
                    end: 2016 - 08 - 17 T13: 49: 00.000 Z,
                    to: {
                        station: 8000115,
                        platform: '1'
                    },
                    line: 'RE  4518',
                    type: 'RE'
                }, {
                    id: '22.1',
                    start: 2016 - 08 - 17 T14: 07: 00.000 Z,
                    from: {
                        station: 8000115,
                        platform: '7'
                    },
                    end: 2016 - 08 - 17 T17: 33: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '7'
                    },
                    line: 'ICE 1586',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '23',
                transfers: 1,
                nightTrain: false,
                trips: [{
                    id: '23.0',
                    start: 2016 - 08 - 17 T12: 58: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '8'
                    },
                    end: 2016 - 08 - 17 T15: 34: 00.000 Z,
                    to: {
                        station: 8000152,
                        platform: '4'
                    },
                    line: 'ICE  576',
                    type: 'ICE'
                }, {
                    id: '23.1',
                    start: 2016 - 08 - 17 T16: 04: 00.000 Z,
                    from: {
                        station: 8000152,
                        platform: '9'
                    },
                    end: 2016 - 08 - 17 T17: 54: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '11'
                    },
                    line: 'IC  1920',
                    type: 'IC'
                }],
                offer: [Circular]
            }, {
                id: '24',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '24.0',
                    start: 2016 - 08 - 17 T13: 02: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '13'
                    },
                    end: 2016 - 08 - 17 T17: 01: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '6'
                    },
                    line: 'ICE 1631',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '25',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '25.0',
                    start: 2016 - 08 - 17 T13: 13: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '8'
                    },
                    end: 2016 - 08 - 17 T17: 59: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '12'
                    },
                    line: 'ICE  278',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '27',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '27.0',
                    start: 2016 - 08 - 17 T14: 13: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '8'
                    },
                    end: 2016 - 08 - 17 T18: 54: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '11'
                    },
                    line: 'ICE  596',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '28',
                transfers: 1,
                nightTrain: false,
                trips: [{
                    id: '28.0',
                    start: 2016 - 08 - 17 T14: 26: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '6'
                    },
                    end: 2016 - 08 - 17 T15: 49: 00.000 Z,
                    to: {
                        station: 8000115,
                        platform: '1'
                    },
                    line: 'RE  4522',
                    type: 'RE'
                }, {
                    id: '28.1',
                    start: 2016 - 08 - 17 T16: 07: 00.000 Z,
                    from: {
                        station: 8000115,
                        platform: '7'
                    },
                    end: 2016 - 08 - 17 T19: 33: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '7'
                    },
                    line: 'ICE 1584',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '29',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '29.0',
                    start: 2016 - 08 - 17 T15: 02: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '13'
                    },
                    end: 2016 - 08 - 17 T19: 01: 00.000 Z,
                    to: {
                        station: 8098160,
                        platform: '6'
                    },
                    line: 'ICE 1633',
                    type: 'ICE'
                }],
                offer: [Circular]
            }, {
                id: '31',
                transfers: 0,
                nightTrain: false,
                trips: [{
                    id: '31.0',
                    start: 2016 - 08 - 17 T16: 17: 00.000 Z,
                    from: {
                        station: 8000105,
                        platform: '9'
                    },
                    end: 2016 - 08 - 17 T20: 27: 00.000 Z,
                    to: {
                        station: 8011160,
                        platform: '12'
                    },
                    line: 'ICE 1090',
                    type: 'ICE'
                }],
                offer: [Circular]
            }
        ],
        anyTrain: false
    }
}, …]
```
## Similar Projects

- [db-hafas](https://github.com/derhuerst/db-hafas/) – "JavaScript client for the DB HAFAS API."

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/db-prices/issues).

Cheers to [Jannis R](https://github.com/derhuerst) for contributing.