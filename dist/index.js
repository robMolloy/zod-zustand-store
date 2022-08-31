
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./zod-zustand-store.cjs.production.min.js')
} else {
  module.exports = require('./zod-zustand-store.cjs.development.js')
}
