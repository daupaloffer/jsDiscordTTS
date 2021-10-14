const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const utf8 = require('utf8');
const exec = require('child_process');

const bot = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '';
const ignored_by_autotts = ['.on','.off','.hmm','stop'];

var autotts = [];


//bot.on("debug", console.log);


// Called on bot "ready" state
bot.on('ready', () => {
	console.log('Logged in as '+bot.user.tag);
	bot.user.setActivity('with myself', { type: 'PLAYING' });
});


// Called on message event
bot.on('messageCreate', msg => {
	console.log('Message received');
	const args = msg.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (msg.content === 'ping') {
		msg.reply('fuck you');
	}

	else if (command === 'b') {
		const True = 'True';
		if (True) {
			if (msg.member.voice.channel) {
				awstts(args,msg.member.voice.channel,msg.author.id,false);
			}
		}
		else {
			console.log('Already in voice channel');
		}
	}

	else if (command === 'stop') {
		console.log('Stopping voice connection and dispatcher..');
		msg.member.voice.channel.leave();
	}

	else if (command === '.hmm') {
		let thing = args.join(' ');
		var num = Math.floor(Math.random() * 100) + 0;
		msg.reply('I give '+thing+' **'+num+'%** :slight_smile:');
	}

	else if (command === '.on') {
		autotts.push(msg.author.id);
		msg.channel.send('Auto-TTS enabled for '+msg.author.name+'..');
		console.log('Auto-TTS enabled for '+msg.author.name+'..');
		console.log(autotts);
	}

	else if (command === '.off') {
		autotts = autotts.filter(item === msg.author.id);
		msg.channel.send('Auto-TTS disabled '+msg.author.name+'..');
		console.log('Auto-TTS disabled '+msg.author.name+'..');
		console.log(autotts);
	}

	if (autotts.includes(msg.author.id) && !ignored_by_autotts.some(v => msg.content.toString().includes(v))) {
		awstts(msg.content,msg.member.voice.channel,msg.author.id,true);
	}
});


// Work with tts-cli package to interface with AWS Polly
async function awstts(args, channel, author, auto) {
	if (auto === false) {
		let tts = args.join(' ');
		var apos = tts.replace(/\u2019/g, "'");
	}

	else {
		var apos = args.toString().replace(/\u2019/g, "'");
	}

	var utftts = utf8.encode('<speak>'+apos+'</speak>');
	console.log('Joining voice chanel..');
	const connection = await channel.join();


	// Make this into a database in the future, I know it's godawful to have it like this
	let child
	if (author === '260065470974001153') {
		child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Justin'); // There is surely a better way to do this, will work on it in future
	}

	else if (author === '601968691998883861') {
		child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Ivy');
	}

	else if (author === '277735371289264128') {
		child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Geraint');
	}

	else if (author === '218286293170388992') {
		child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Russell');
	}

	else if (author === '201762678585294849') {
		child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Ruben');
	}

	else if (author === '134694626832547840') {
		child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Maxim');
	}

	else {
		child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Brian');
	}

	child.on('exit', async function() {
		connection.play('brian.mp3');
	});
}

bot.login(token);
