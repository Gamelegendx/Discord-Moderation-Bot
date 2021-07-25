//====================================================================================CONSTANTS REQUIRED ON READY=============================================================================================
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
const { Client, Collection } = require('discord.js');
const { PREFIX, TOKEN } = require('./config');
const bot = new Client({ disableMentions: 'everyone' });
const fs = require("fs");
const db = require('quick.db');
//============================================================================================================================================================================================================


//====================================================================================COLLECTIONS REQUIRED ON READY===========================================================================================
bot.commands = new Collection();
bot.aliases = new Collection();

//============================================================================================================================================================================================================



//============================================================================================INITIALIZING====================================================================================================
["aliases", "commands"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
});

//============================================================================================================================================================================================================


//=========================================================================================MENTION SETTINGS===========================================================================================

bot.on('message', async message => {


    let prefix;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        
            } catch {
            prefix = PREFIX
    };
    try {
        if (message.mentions.has(bot.user.id) && !message.content.includes("@everyone") && !message.content.includes("@here")) {
          message.channel.send(`\nMy prefix for \`${message.guild.name}\` is \`${prefix}\` Type \`${prefix}help\` for help`);
          }
          
    } catch {
        return;
    };

});


//============================================================================================================================================================================================================


bot.login(process.env.TOKEN);
