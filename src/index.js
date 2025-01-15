const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path'); 

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

dotenv.config();
const token = process.env.DISCORD_TOKEN;
const PREFIX = '/';


client.events = new Map();

const loadEvents = (folderPath, client) => {
 const eventsPath = path.join(__dirname, folderPath);

 if (!fs.existsSync(eventsPath)) {
  console.warn(`Warning: Folder ${folderPath} tidak ditemukan`);
  return;
 }

 const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

 for (const file of eventFiles) {
  try {
   const event = require(path.join(eventsPath, file));
   if (event.name) {
    client.events.set(event.name, event);
    client.on(event.name, (...args) => event.execute(...args));
    console.log(`Event loaded: ${event.name}`);
   }
  } catch (error) {
   console.error(`Error loading event file ${file}:`, error);
  }
 }
}

loadEvents('./events', client);



client.commands = new Map();
// Perbaikan fungsi loadCommands dengan path yang benar
const loadCommands = (folderPath, client) => {
    const commandsPath = path.join(__dirname, folderPath);
    
    // Periksa apakah folder exists
    if (!fs.existsSync(commandsPath)) {
        console.warn(`Warning: Folder ${folderPath} tidak ditemukan`);
        return;
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        try {
            const command = require(path.join(commandsPath, file));
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(`Command loaded: ${command.name}`);
            } else {
                console.error(`Error loading command from file ${file}: Missing name property.`);
            }
        } catch (error) {
            console.error(`Error loading command file ${file}:`, error);
        }
    }
};

client.on('messageCreate', async (message) => {
    try {
        if (!message.content.startsWith(PREFIX) || message.author.bot) return;

        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;

        const command = client.commands.get(commandName);
        command.execute(message, args);

    } catch (error) {
        console.error('Error in messageCreate event:', error);
        message.reply('Terjadi kesalahan saat menjalankan command.').catch(console.error);
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', (error) => {
    console.error('Unhandled error:', error);
});

client.login(token);