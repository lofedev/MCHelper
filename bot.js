//
// helper bot
// @author lofe
// @contributor tictac67
// copyright lofe all rights reserved
//

const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();
const fs = require('fs');
let file = JSON.parse(fs.readFileSync('./factoids.json','utf8'));

const names = [];
const descs = []; 
Object.keys(file).forEach(i=>{
    names.push(i)
    descs.push(file[i])
});

client.once('ready', () => {
  console.log('Bot has started!');
});

client.once('reconnecting', () => {
    console.log('Bot is reconnecting.');
});

client.once('disconnect', () => {
    console.log('Bot has disconnected!');
});

// ----------------------------------------------------
// express-glitch-keepalive
// Required to let Glitch host 24/7.
// ----------------------------------------------------

const express = require('express');
const keepalive = require('express-glitch-keepalive');

const app = express();

app.use(keepalive);

app.get('/', (req, res) => {
res.json('rhee');
});
app.get("/", (request, response) => {
response.sendStatus(200);
});
app.listen(process.env.PORT);

// ----------------------------------------------------
// bot
// Required for all botty things.
// ----------------------------------------------------

client.on('message', async message => {  
    if (message.author.bot) return;
    if (message.channel.type === 'dm') {
        let embed = new Discord.RichEmbed()
        .setColor('22D3EF')
        .setTitle("DM commands are not supported!")
        .setDescription("I cannot read commands from a DM! Sorry.")
        .addField("**Support Server**", "https://discord.gg/CgskRWy", true)
        .setFooter('® - Lofe')
        return message.channel.send(embed);
    };
    if (!message.content.startsWith(prefix)) return;
	if (message.content.startsWith(`${prefix}grab`)) {
        return grab(message);
	}else if (message.content.startsWith(`${prefix}help`)) {
        return help(message);
	} else {
		let embed = new Discord.RichEmbed()
        .setColor('22D3EF')
        .setTitle('Error')
        .setDescription('Invalid command!')
        .setFooter('® - Lofe')
        return message.channel.send(embed);
	}
});

function grab(message) {
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    
    if (!args) {
        let embed = new Discord.RichEmbed()
        .setColor('22D3EF')
        .setTitle("Error")
        .setDescription("I don't know what to look for.. maybe try providing an argument?")
        .setFooter('® - Lofe')
        return message.channel.send(embed);
    } else {
        if (names.length === descs.length){
            let count = 0;
            names.forEach((v,i)=>{
                if (v === args[1]){
                    let embed = new Discord.RichEmbed()
                    .setColor('22D3EF')
                    .setTitle(`${v}`)
                    .setDescription(`${descs[i]}`)
                    .setFooter('® - Lofe')
                    return message.channel.send(embed);
                }else{
                    count += 1;
                    if (count === names.length){
                        let embed = new Discord.RichEmbed()
                        .setColor('22D3EF')
                        .setTitle("Error")
                        .setDescription(`Factoid ${args[1]} does not exist.`)
                        .setFooter('® - Lofe')
                        return message.channel.send(embed);
                    }
                }
            });
        }
    }
}

function updateStatus(){
    client.user.setPresence({
        game: {
            name: 'over '+client.guilds.size+' servers | mchelper v1 developed by Lofe',
            type: "WATCHING",
        }
    });
}

function help(message) {
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    
    if (!args[1]) {
        let embed = new Discord.RichEmbed()
        .setColor('22D3EF')
        .setTitle("Help")
        .setDescription(`**${prefix}help** | This menu shows up.\n **${prefix}grab** | Grabs a [factoid](https://docs.google.com/spreadsheets/d/1WA2XcppKBrcsMiNwohT6IDaNVFbNMxFRGlR8F_t0328/edit?usp=sharing)\n\n**Thank you to shnopy#2525 for contributions!**`)
        .setFooter('® - Lofe')
        message.channel.send(embed);
    } else {
        let embed = new Discord.RichEmbed()
        .setColor('22D3EF')
        .setTitle("Error")
        .setDescription("This is a help command.. maybe try without the arguments?")
        .setFooter('® - Lofe')
        message.channel.send(embed);   
    }
}

client.on('guildCreate', () => {
    client.user.setStatus('online')
    updateStatus()
});

client.on('guildDelete', () => {
    client.user.setStatus('online')
    updateStatus()
});

client.on('ready', () => {
    client.user.setStatus('online')
    updateStatus()
});

client.login(token);