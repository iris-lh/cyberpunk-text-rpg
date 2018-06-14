const readline = require('readline');
const chalk = require('chalk')
const processCommand = require('./game.js')

const prompt = '>> '

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: prompt
})



function clearScreen() {
  console.log('\033c')
}

function question(message, callback) {
  rl.question(message + ' ' + prompt, callback)
}

function display(message) {
  console.log()
  console.log(message)
  console.log()
  rl.prompt()
}



clearScreen()

// GET TITLE SPLASH
processCommand('title', response => {
  display(chalk[response.weight][response.color](response.text))
})

// START COMMAND PROMPT

rl.prompt()
rl.on('line', (input) => {
  console.log()

  // QUIT
  if (input.toLowerCase() === 'quit') {
    question('CONFIRM QUIT [y]', (answer) => {
      console.log()
      if (answer.toLowerCase() === 'y') {
        console.log('SHUTTING DOWN')
        clearScreen()
        process.exit(0)
      } else {
        rl.prompt()
      }
    })

  // PASS TO GAME API
  } else {
    processCommand(input, response => {
      display(response.text)
    })
  }  

  rl.prompt()
});