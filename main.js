const Discord = require('discord.js');
const gTTS = require('gtts');
const utf8 = require('utf8');
const fs = require('fs');
const exec = require('child_process');
const { debug } = require('console');

const bot = new Discord.Client();
const prefix = '';
const ignored_by_autotts = ['.on','.off','.hmm','tts','stop'];

var discord_token = '';
var autotts = [];


fs.readFile('discord_token', 'utf8', function(err, data) {
	if (err) throw err;
	discord_token = data;
});


bot.on('ready', () => {
	console.log('Logged in as '+bot.user.tag);
	bot.user.setActivity('with myself', { type: 'PLAYING' });
});


bot.on('message', async msg => {
	const args = msg.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (msg.content === 'ping') {
		msg.reply('fuck you');
	}

	else if (command === 'tts') {
		let tts = args.join(' ');
		console.log(tts);
		var gtts = new gTTS(tts, 'en');
		gtts.save('cool.mp3');

		const connection = await msg.member.voice.channel.join();
		msg.reply('fuck you');
		const dispatcher = connection.play('cool.mp3');
		dispatcher.on('finish', async () => {
			await msg.member.voice.channel.leave();
		});
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
		await msg.member.voice.channel.leave();
	}

	else if (command === '.hmm') {
		let thing = args.join(' ');
		var num = Math.floor(Math.random() * 100) + 0;
		await msg.reply('I give '+thing+' **'+num+'%** <:smile:503737897812230144>');
	}

	else if (command === '.on') {
		autotts.push(msg.author.id);
		msg.channel.send('Auto-TTS enabled for '+msg.author.name+'..')
		console.log('Auto-TTS enabled for '+msg.author.name+'..')
		debug.log(autotts);
	}

	else if (command === '.off') {
		autotts = autotts.filter(item === msg.author.id);
		msg.channel.send('Auto-TTS disabled '+msg.author.name+'..')
		console.log('Auto-TTS disabled '+msg.author.name+'..')
		debug.log(autotts);
	}

	if (autotts.includes(msg.author.id) && !autotts.some(v => msg.content.toString().includes(v))) {
		awstts(msg.content,msg.member.voice.channel,msg.author.id,true);
	}
});

async function awstts(args,channel,author,tate) {
	if (tate === false) {
		let tts = args.join(' ');
		var apos = tts.replace(/\u2019/g, "'");
	}

	else {
		var apos = args.toString().replace(/\u2019/g, "'");
	}

	var utftts = utf8.encode('<speak>'+apos+'</speak>');

	console.log('Joining voice chanel..');

	const connection = await channel.join();

	let child

	if (author === '260065470974001153') {
		child = exec('echo "'+utftts+'" | node_modules/tts-cli/tts.js brian.mp3 --type ssml --voice Justin');
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
		const dispatcher = connection.play('brian.mp3');
	});
}


bot.login(discord_token)
