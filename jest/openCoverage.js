const opn = require('opn')

opn('./coverage/lcov-report/index.html', { app: ['google-chrome'] })
