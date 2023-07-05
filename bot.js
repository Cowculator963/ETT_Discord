const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
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
    } 
    if (message.content === '!roll') {
        rollDice(message);
      }
      if (message.content === '!attendance') {
        takeAttendance(message.member);
        message.channel.send(`${message.member.displayName}, you have been marked as present.`);
      } else if (message.content === '!viewAttendance') {
        viewAttendanceList(message);
      }
      if (message.content === '!timeTable' && message.channel.name === 'class123') {
        const timetable = generateTimetable();
    
        let timetableMessage = 'Timetable:\n\n';
        timetable.forEach(slot => {
          timetableMessage += `${slot.day}:\n`;
          slot.subjects.forEach(subject => {
            timetableMessage += `${subject.name} ${subject.time}\n`;
          });
          timetableMessage += '\n'; // Add line break after each day
        });
    
        message.channel.send(timetableMessage);
      }
      
})
client.on('guildMemberAdd', member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'general');
    if (welcomeChannel) {
        welcomeChannel.send(`Welcome to the server, ${member}! Enjoy your stay.`);
    }
});

const attendanceList = new Set(); // Set to store the attendance

// Function to take attendance for the day
function takeAttendance(member) {
  attendanceList.add(member.id);
  console.log(`${member.displayName} (${member.id}) has been marked as present.`);
}

// Function to view the attendance list
function viewAttendanceList(message) {
    const guild = message.guild;
    const attendanceMembers = guild.members.cache.filter(member => attendanceList.has(member.id));
  
    const allMembers = guild.members.cache;
    const absentMembers = allMembers.filter(member => !attendanceList.has(member.id));
  
    let attendanceListText = '';
    let absentListText = '';
  
    if (attendanceMembers.size === 0) {
      attendanceListText = 'No members are currently marked as present.';
    } else {
      attendanceListText = `Members marked as present:\n${attendanceMembers.map(member => member.displayName).join('\n')}`;
    }
  
    if (absentMembers.size === 0) {
      absentListText = 'All members have been marked as present.';
    } else {
      absentListText = `Members not marked as present:\n${absentMembers.map(member => member.displayName).join('\n')}`;
    }
  
    message.channel.send(`${attendanceListText}\n\n${absentListText}`);
  }

  function generateTimetable() {
    return [
      {
        day: 'Monday',
        subjects: [
          { name: 'ISP', time: '10:00AM to 13:00PM' },
          { name: 'DataBase', time: '14:00PM to 17:00PM' }
        ]
      },
      {
        day: 'Tuesday',
        subjects: [
          { name: 'ISP', time: '10:00AM to 13:00PM' },
          { name: 'WAD', time: '14:00PM to 16:00PM' }
        ]
      },
      {
        day: 'Wednesday',
        subjects: [
          { name: 'CPMAD', time: '13:00PM to 15:00PM' },
          { name: 'WAD', time: '15:00PM to 17:00PM' }
        ]
      },
      {
        day: 'Thursday',
        subjects: [
          { name: 'ETT', time: '9:00AM to 11:00AM' },
          { name: 'CPMAD', time: '11:00AM to 13:00PM' },
          { name: 'GSM', time: '14:00PM to 16:00PM' }
        ]
      },
      {
        day: 'Friday',
        subjects: [
          { name: 'Self Learn', time: '' }
        ]
      }
    ];
  }
  



function rollDice(message) {
    const min = 1;
    const max = 6;
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    message.channel.send(`You rolled a ${result}!`);
  }



  client.on('messageCreate', message => {
    if (message.content === '!reminder') {
      let timetable = 'Test and Submission Reminders:\n\n';
  
      const reminders = [
        {
          course: 'DataBase Modelling',
          tests: [
            { week: 'Week 14', name: 'PT2', weightage: '20%' },
            { week: 'Week 17', name: 'Project', weightage: '30%' }
          ]
        },
        {
          course: 'Web API',
          tests: [
            { week: 'Week 14', name: 'PT2', weightage: '20%' },
            { week: 'Week 17', name: 'Project 2', weightage: '25%' }
          ]
        },
        {
          course: 'CPMAD',
          tests: [
            { week: 'Week 13', name: 'PT2', weightage: '20%' },
            { week: 'Week 13-17', name: 'Project Development', weightage: '40%' }
          ]
        },
        {
          course: 'ISP',
          tests: [
            { week: 'Week 15', name: 'Self Reflection', weightage: '5%' },
            { week: 'Week 16', name: 'Project Documentation', weightage: '20%' },
            { week: 'Week 17', name: 'Project Part 2 Deliverables', weightage: '25%' },
            { week: 'Week 17', name: 'Final Presentation', weightage: '10%' }
          ]
        },
        {
          course: 'ETT',
          tests: [
            { week: 'Week 16', name: 'Showcase' }
          ],
          submissions: [
            { week: 'Week 18', name: 'Reflection' }
          ]
        },
        {
          course: 'Doing Business Globally',
          tests: [
            { week: 'Week 16', name: 'ICA2' }
          ]
        },
        {
          course: 'Successful Manager',
          submissions: [
            { week: 'Week 16', name: 'ICA2' }
          ]
        }
      ];
  
      reminders.forEach(course => {
        timetable += `${course.course}:\n`;
        
        if (course.tests) {
          course.tests.forEach(test => {
            timetable += `${test.week}: ${test.name}`;
            if (test.weightage) {
              timetable += ` (${test.weightage})`;
            }
            timetable += '\n';
          });
        }
  
        if (course.submissions) {
          course.submissions.forEach(submission => {
            timetable += `${submission.week}: Submit ${submission.name}\n`;
          });
        }
  
        timetable += '\n';
      });
  
      message.channel.send(timetable);
    }
  });
  

  client.on('messageCreate', message => {
    if (message.content === '!week') {
      const currentDate = new Date();
      const startDate = new Date('2023-04-17'); // Set your school's start date here
      const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
      const weekNumber = Math.ceil((currentDate - startDate) / millisecondsPerWeek) ;
  
      message.channel.send(`Current Week: ${weekNumber} out of 18` );
    }
  });
  
  
  
  client.on('messageCreate', message => {
    
    if (message.author.bot) return; // Ignore messages sent by bots
    console.log(message.author.id)
    if (message.content === '!guess') {
        
      const minNumber = 1;
      const maxNumber = 10;
      const maxAttempts = 5;
      const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      let attempts = 0;
  
      message.channel.send(`Guess a number between ${minNumber} and ${maxNumber}. You have ${maxAttempts} attempts.`);
  
      const filter = m => !m.author.bot;
      const collector = message.channel.createMessageCollector(filter);
  
      collector.on('collect', m => {
        const guessedNumber = parseInt(m.content);
  
        if (isNaN(guessedNumber) || guessedNumber < minNumber || guessedNumber > maxNumber) {
        //   message.channel.send(`Invalid input. Please enter a valid number between ${minNumber} and ${maxNumber}.`);
        } else {
          attempts++;
  
          if (guessedNumber === randomNumber) {
            collector.stop();
            message.channel.send(`Congratulations! You guessed the correct number ${randomNumber} in ${attempts} attempts.`);
          } else if (attempts >= maxAttempts) {
            collector.stop();
            message.channel.send(`You ran out of attempts. The correct number was ${randomNumber}. Try again!`);
          } else if (guessedNumber < randomNumber) {
            message.channel.send('Too low! Guess again.');
          } else if (guessedNumber > randomNumber) {
            message.channel.send('Too high! Guess again.');
          }
        }
      });
    }
  });
  
  

  

client.login('MTEyNDcyMTkxNDU1Njk4OTU1MQ.GvqLPO.vQK1GVuC3HAPTVBO3kcMUFDG6WcBXFrENOiVoo');

