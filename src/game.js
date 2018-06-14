const _ = require('lodash')
const yaml = require('js-yaml')
const jp = require('fs-jetpack')
const commands = yaml.safeLoad(jp.read('./src/commands.yaml'))

const Content = require('./Content.js')
const content = new Content('./src/content/')
content.load()


let state = {
  player: {
    locationId: 'room1',
    inventory: [
      'Wallet',
      'Smartphone'
    ]
  },
  entities: [

  ]
}


function matchCommand(input, superCommand) {
  return commands[superCommand].includes(input.toLowerCase())
}

function processCommand(input, respond) {
  const parts = input.split(' ')
  const command = parts[0]
  const args = parts.slice(1)

  // TITLE SPLASH
  if (input === 'title') {
    respond({
      type: 'flavor',
      text: content.get().splash,
      color: 'cyan',
      weight: 'bold'
    })
  }

  // LOOK
  else if (matchCommand(command, 'look')) {
    respond({
      type: 'flavor',
      text: content.getById(state.player.locationId).description
    })
  }

  // GET
  else if (matchCommand(command, 'get')) {
    const availableItemIds = content.getById(state.player.locationId).contents

    // NO ARGS
    if (args.length < 1) {
      respond({
        type: 'error',
        text: 'ERROR: NO ITEM SPECIFIED'
      })
    }

    // HAVE ARGS
    else if (args.length > 0 && availableItemIds.includes(args[0].toLowerCase())) {
      const item = content.getById(args[0])
      state.player.inventory.push(item.id)

      respond({
        type: 'good',
        text: `ACQUIRED [ ${item.id} ]`
      })
    }
  }

  // VIEW INVENTORY
  else if (matchCommand(command, 'inventory')) {
    respond({
      type: 'menu',
      text: JSON.stringify(state.player.inventory)
    })
  }

  // UNKNOWN COMMAND
  else {
    respond({
      type: 'error',
      text: 'ERROR: UNKNOWN COMMAND'
    })
  }

}


module.exports = processCommand