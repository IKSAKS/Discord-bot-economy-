const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const random = require('random');
const fs = require('fs');
const jsonfile = require('jsonfile');
const { Permissions } = require('discord.js');
const permissions = new Permissions(268550160);


client.login(config.token);
client.on("ready", () => {
    console.log("Bot is Ready!");
    client.user.setActivity('if you type i!help!', { type: 'WATCHING' });               //when bot starts up
    
})
var stats = {};
if (fs.existsSync('stats.json')) {
    stats = jsonfile.readFileSync('stats.json');                    //makeing json file if delited
}


client.on("message", async message => {
    const prefix = "i!";
  

    if(message.author.bot) {
        console.log("message needs: message author is a bot")
        return;
    } 
    if(!message.guild) {
        console.log("message needs: not in server")                     //needs to get do past things
        return;     
    } 
    if(!message.content.startsWith(prefix)){
        console.log("message needs: doesn't have prefix")
        return;
    } 

    if (message.guild.id in stats === false) {          //adding guild in json
        stats[message.guild.id] = {};
    }

    const guildStats = stats[message.guild.id];
    if (message.author.id in guildStats === false) {
        guildStats[message.author.id] = {
            coins: 0,
            bank: 0,
            last_beg: 0,                                    //adding user in json
            xp: 0,
            level: 0,
            last_message: 0
        };
    }


    const args = message.content.slice(prefix.length).trim().split(/ +/g);               //spliting message to cmd
    const cmd = args.shift().toLowerCase();
    
    const userStats = guildStats[message.author.id];
    if (Date.now() - userStats.last_message > 5000) {
        userStats.xp += random.int(15, 25);
        userStats.last_message = Date.now();

        const xpToNextLevel = 5 * Math.pow(userStats.level, 2) + 35 * userStats.level + 100;
        if (userStats.xp >= xpToNextLevel) {
            userStats.level++;
            userStats.xp = userStats.xp - xpToNextLevel;                                                            //xp and level ups
            message.channel.send(message.author.username + ' has reached bank level ' + userStats.level);
        }

        jsonfile.writeFileSync('stats.json', stats);

        console.log(message.author.username + ' now has ' + userStats.xp);
        console.log(xpToNextLevel + ' XP needed for next bank level.');
    }
    if (Date.now() - userStats.last_beg > 3000) {
        if (cmd === "help") {
            message.channel.send("Hello " + message.author.username + "\nCommands:\ni!help\ni!ping\ni!beg\ni!bank\ni!pocket\ni!bal");
            console.log("Bot is typing");                           //when thay do i!help
        }
        else if(cmd === "beg") {

            const userStats = guildStats[message.author.id];
    
            const coinsGot = random.int(15, 75);                            //when thay do i!beg
            userStats.coins += coinsGot
            
            message.channel.send(message.author.username + ' just begged ' + coinsGot + 'coins and now has ' + userStats.coins + ' coins')
            console.log(message.author.username + ' just begged ' + coinsGot + ' coins and now has ' + userStats.coins);
        
       

        }
        else if(cmd === "bal") {
            var bankMaximum = Math.pow(userStats.level, 3) + 35 * userStats.level + 400;
            var bankPlaceFree = "(" + userStats.bank + "/" + bankMaximum + ")";            //when user says i!bal
            var bankPlaceFree2 = userStats.bank + "/" + bankMaximum;
            message.channel.send(userStats.coins + " Coins\n" + "Bank " + bankPlaceFree2)
        }
        else if(cmd === "bank"){
            const userStats = guildStats[message.author.id];
            var userStartsBank = parseInt(userStats.bank);
            var userStartsCoins = parseInt(userStats.coins);
            var bankMaximum = Math.pow(userStats.level, 3) + 35 * userStats.level + 400;
            var putMoeny = parseInt(message.content.slice(7));    //when user says i!bank
        
             if(args.length === 0 || args.length >= 2 || isNaN(putMoeny) || putMoeny <= 0){
                message.channel.send('What do you want to put in bank? \ni!bank 100')       //if thay dont say number
            }
            else{
                var putMoeny = parseInt(message.content.slice(7));
                const userStats = guildStats[message.author.id];
                if (putMoeny > userStats.coins) {
                    message.channel.send('You dont have that much coins');          //if user donesnt own that much money
                }
                else if(bankMaximum<putMoeny) {
                    message.channel.send("Your bank doesn\'t have place to put all of that money"); //if users bank is too small to fit money in it
                }
                else{
                    const userStats = guildStats[message.author.id];
                    userStats.bank = userStartsBank + putMoeny;
                    userStats.coins = userStartsCoins - putMoeny;
                    var bankPlaceFree = "(" + userStats.bank + "/" + bankMaximum + ")";            //message after success
                    var bankPlaceFree2 = userStats.bank + "/" + bankMaximum;
                    message.channel.send(message.author.username + ' just putted money in bank and now has ' + userStats.coins + ' coins and ' + userStats.bank + ' coins in bank' + bankPlaceFree)
                    console.log(message.author.username + ' just putted money in bank and now has ' + userStats.coins + ' coins and ' + userStats.bank + ' coins in bank' + bankPlaceFree)
        
                }
            } 
    
        
        }
        else if(cmd === "pocket"){
            const userStats = guildStats[message.author.id];
            var userStartsBank = parseInt(userStats.bank);                              //variables for command
            var userStartsCoins = parseInt(userStats.coins);
            var bankMaximum = Math.pow(userStats.level, 3) + 35 * userStats.level + 400;
            var putMoeny = parseInt(message.content.slice(9));


             if(args.length === 0 || args.length >= 2 || isNaN(putMoeny) || putMoeny <= 0){
                message.channel.send('What do you want to put in pocket? \ni!pocket 100')
              }

             else{
                var putMoeny = parseInt(message.content.slice(9));
                const userStats = guildStats[message.author.id];
                if (putMoeny > userStats.bank) {
                message.channel.send('You dont have that much coins');
                }

                else{
                    const userStats = guildStats[message.author.id];
                    userStats.bank = userStartsBank - putMoeny;
                    userStats.coins = userStartsCoins + putMoeny;
                    var bankPlaceFree = "(" + userStats.bank + "/" + bankMaximum + ")";
                    var bankPlaceFree2 = userStats.bank + "/" + bankMaximum;
                    message.channel.send(message.author.username + ' just putted money in pocket and now has ' + userStats.coins + ' coins and ' + userStats.bank + ' coins in bank' + bankPlaceFree)
                    console.log(message.author.username + ' just putted money in pocket and now has ' + userStats.coins + ' coins and ' + userStats.bank + ' coins in bank' + bankPlaceFree)
        
                }
            } 
    
        
        }
    
        else if(cmd === "ping") {
            const msg = await message.channel.send(`🏓 Pinging...`);

            msg.edit(`🏓 Pong\n💻 Letency is ${Math.floor(msg.createdAt - message.createdAt)}ms\n🖥️ APi Letency ${Math.round(client.ws.ping)}ms`);
        }
    
    
        jsonfile.writeFileSync('stats.json', stats);
        userStats.last_beg = Date.now();
    }
    else {
        message.channel.send('You need you wait 3 secends');
        console.log(message.author.tag + " is spamming");
    }
});
