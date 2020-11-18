'use strict'
const runAll = require('npm-run-all')

runAll(['build:js'], { silent: true, printLabel: true })
  .then(() => {
    console.log('Finished revving media.')
  })
  .catch(err => {
    console.log('Failed revving media!')
    console.error(err)
  })
