const { defineCliConfig } = require('sanity/cli')

module.exports = defineCliConfig({
  api: {
    projectId: 'qir915mw',
    dataset: 'production',
  },
  studioHost: 'truleaf',
})
