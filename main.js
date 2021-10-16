const { Client, Intents } = require('discord.js');
const voice = require('@discordjs/voice');
const { token } = require('./config.json');
const utf8 = require('utf8');
const { join } = require('path');
const { createReadStream } = require('fs');
const exec = require('child_process').exec;

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const prefix = '';
const ignored_by_autotts = ['.on','.off','.hmm','stop'];

var autotts = [];


//bot.on("debug", console.log);


// Called on bot "ready" state
bot.once('ready', () => {
	console.log('Logged in as '+bot.user.tag);
	bot.user.setActivity('with myself', { type: 'PLAYING' });
});


// Called on message event
bot.on('messageCreate', async msg => {
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
		const connection = voice.getVoiceConnection(msg.member.voice.channel.guild.id);
		connection.destroy();
	}

	else if (command === '.hmm') {
		let thing = args.join(' ');
		var num = Math.floor(Math.random() * 100) + 0;
		await msg.reply('I give '+thing+' **'+num+'%** :slight_smile:');
	}

	else if (command === '.on') {
		autotts.push(msg.author.id);
		msg.channel.send('Auto-TTS enabled for '+msg.author.username+'..');
	}

	else if (command === '.off') {
		autotts = autotts.filter(item => item !== msg.author.id);
		msg.channel.send('Auto-TTS disabled for '+msg.author.username+'..');
	}

	if (msg.member.voice.channel && autotts.includes(msg.author.id) && !ignored_by_autotts.some(v => msg.content.toString().includes(v))) {
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

	const connection = voice.joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});

	// Make this into a database in the future, I know it's godawful to have it like this
	let child
	switch (author) {
		case '260065470974001153':
			child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Justin'); // There is surely a better way to do this, will work on it in future
			break;
		case '440806921021292544':
			child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Ivy');
			break;
		case '277735371289264128':
			child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Geraint');
			break;
		case '640016448252805121':
			child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Emma --engine neural');
			break;
		case '127390189491453952':
			child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Kendra');
			break;
		case '601968691998883861':
			child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Joey --engine neural');
			break;
		default:
			child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Brian');
			break;
	}

	const player = voice.createAudioPlayer();
	

	child.on('exit', () => {
		const resource = voice.createAudioResource(createReadStream(join(__dirname, 'brian.mp3')));
		player.play(resource);
		connection.subscribe(player);
	});
	
}

bot.login(token);
