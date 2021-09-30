const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  response.sendStatus(200);
});
const Discord = require("discord.js");
const db = require('quick.db')
const client = new Discord.Client();
const ayarlar = require('./endless.json')
const fs = require("fs");
const moment = require("moment");
moment.locale("tr")
const chalk = require("chalk");
require("./util/eventLoader")(client);



const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    console.log("Endless V12 Kayıt Botu!")
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

//--------------------------------OTO MESAJ ENDLESS-------------------------------\\
client.on('message', msg => {
    if (msg.content === '.tag') {
        msg.channel.send(`¹⁹⁹³`); // TAGINIZI YAZIN
    } else if (msg.content === 'tag') {
        msg.channel.send(`¹⁹⁹³`);// TAGINIZI YAZIN
        }
    }
);
//--------------------------------HOŞGELDİN MESAJ ENDLESS-------------------------------\\
client.on("guildMemberAdd", member => {  
  const kanal = member.guild.channels.cache.find(r => r.id === "851527135567151134"); //HOŞGELDİN MESAJI ATILACAĞI KANAL IDSINI GİRİN ÖRNEĞİN UNREGİSTER CHATİ
    
    let user = client.users.cache.get(member.id);
    require("moment-duration-format");
      const kurulus = new Date().getTime() - user.createdAt.getTime();  
  const gecen = moment.duration(kurulus).format(`YY **[Yıl,]** DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`) 
   
    var kontrol;
  if (kurulus < 1296000000) kontrol = ':warning:,❌'
  if (kurulus > 1296000000) kontrol = ':white_check_mark:'
  moment.locale("tr");
  kanal.send(":tada: Sunucumuza Hoş Geldin ! <@" + member + "> \n\n Hesabın "+ gecen +" Önce Oluşturulmuş "+kontrol+" \n\n Sunucu kurallarımız <#850104141006635038> kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek. \n\n Seninle beraber **" + member.guild.memberCount + "** kişi olduk , Tagımızı alarak bizlere destek olabilirsin , Kayıt olmak için teyit odalarına girip ses teyit vermen gerekiyor <@&850251998829346837> seninle ilgilenecektir  İyi eğlenceler !")
 });
//--------------------------------TAG ROL KISMI ENDLESS-------------------------------\\
client.on("userUpdate", async (oldUser, newUser) => {
if (oldUser.username !== newUser.username) {
let endlesstag = "¹⁹⁹³"; //Tagınızı yazın
let endlessunucu = "850103132226453564"; //Sunucu ID'sini giriniz
let endlesskanal = "891791219548622918" //Mesajın atılacağı log kanalını giriniz
let endlessrol = "891792615819870209";//Taglı rolünün ID'sini giriniz 
if (newUser.username.includes(endlesstag) && !client.guilds.cache.get(endlessunucu).members.cache.get(newUser.id).roles.cache.has(endlessrol)) {
client.channels.cache.get(endlesskanal).send(`**${newUser} adlı kişi ${endlesstag} tagımızı aldığı için <@&${endlessrol}> rolü verildi !**`)
client.guilds.cache.get(endlessunucu).members.cache.get(newUser.id).roles.add(endlessrol) }
if (!newUser.username.includes(endlesstag) && client.guilds.cache.get(endlessunucu).members.cache.get(newUser.id).roles.cache.has(endlessrol)) {
client.guilds.cache.get(endlessunucu).members.cache.get(newUser.id).roles.remove(endlessrol)
client.channels.cache.get(endlesskanal).send(`**${newUser} adlı kişi ${endlesstag} tagımızı çıkardığı için <@&${endlessrol}> rolü alındı !**`) } } })