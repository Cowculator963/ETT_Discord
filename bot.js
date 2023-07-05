const { Client, GatewayIntentBits, Partials  } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel],
});

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', message => {
    console.log('Message Received:', message.content);
    if (message.content.trim() === '!ping') {
        message.channel.send('Pong!');
        console.log('Message Received');
    } else if (message.content.startsWith('!')) {
        // Handle other commands
        console.log('Unknown Command');
    } else {
        console.log('Regular Message');
    }
});

client.on('guildMemberAdd', member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'general');
    
    if (welcomeChannel) {
      setTimeout(() => {
        welcomeChannel.send(`Welcome to the ETT server, ${member}! Enjoy your stay.`);
      }, 3000); // Delay of 3 seconds (3000 milliseconds)
    }
  });

  client.on('messageCreate', message => {
    if (message.content === '!roll') {
      const randomNumber = Math.floor(Math.random() * 6) + 1; // Generates a random number between 1 and 6
      message.channel.send(`Your dice rolled a ${randomNumber}!`);
    }
  });


  let gameInProgress = false;
  let players = [];
  let gameTimer;

client.on('messageCreate', message => {
  if (message.content === '!playSPS') {
    if (gameInProgress) {
      message.channel.send('A game is already in progress. Please wait for it to finish.');
    } else {
      message.channel.send('Scissors Paper Stone game has started! Use "!joinSPS" to join the game.');
      players.push(message.author);
      gameInProgress = true;
      gameTimer = setTimeout(() => {
        endGame(message.channel);
      }, 10000); // 10 seconds timeout
    }
  } else if (message.content === '!joinSPS') {
    if (gameInProgress) {
      players.push(message.author);
      if (players.length === 2) {
        clearTimeout(gameTimer);
        startGame(message.channel);
      }
    } else {
      message.channel.send('No game is currently in progress.');
    }
  } else if (message.content === '!endSPS') {
    if (gameInProgress) {
      endGame(message.channel);
    } else {
      message.channel.send('No game is currently in progress.');
    }
  }
});

  function startGame(message) {
    if (gameInProgress) {
      message.channel.send('A game is already in progress. Please wait for it to finish.');
      return;
    }
  
    gameInProgress = true;
    message.channel.send('Both players have joined the game. Let the Scissors Paper Stone begin!');
  
    const choices = ['scissors', 'paper', 'stone'];
    const player1Choice = choices[Math.floor(Math.random() * choices.length)];
    const player2Choice = choices[Math.floor(Math.random() * choices.length)];
  
    message.channel.send(`Player 1 choice: ${player1Choice}`);
    message.channel.send(`Player 2 choice: ${player2Choice}`);
  
    let winner = '';
  
    if (player1Choice === player2Choice) {
      winner = 'It\'s a tie!';
    } else if (
      (player1Choice === 'scissors' && player2Choice === 'paper') ||
      (player1Choice === 'paper' && player2Choice === 'stone') ||
      (player1Choice === 'stone' && player2Choice === 'scissors')
    ) {
      winner = 'Player 1 wins!';
    } else {
      winner = 'Player 2 wins!';
    }
  
    message.channel.send(winner);
  
    // Reset the game state
    gameInProgress = false;
  }

  function endGame(channel) {
    gameInProgress = false;
    players = [];
    clearTimeout(gameTimer);
    channel.send('The game has ended.');
  }
  
  

client.login('MTEyNDcyMTkxNDU1Njk4OTU1MQ.GvqLPO.vQK1GVuC3HAPTVBO3kcMUFDG6WcBXFrENOiVoo');
