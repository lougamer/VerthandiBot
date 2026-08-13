const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Discord Bot client with message intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load the Gemini key from your Railway Environment variables
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.on('messageCreate', async (message) => {
    // Ignore messages sent by other bots
    if (message.author.bot) return;

    // Only respond if your bot user profile is directly @tagged in a chat
    if (message.mentions.has(client.user)) {
        const prompt = message.content.replace(`<@${client.user.id}>`, '').trim();
        if (!prompt) return message.reply("Hello! How can I help you today?");

        await message.channel.sendTyping();

        try {
            const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            
            return message.reply(response.text());
        } catch (error) {
            console.error("Gemini AI Exception:", error);
            return message.reply("My processing systems hit an API connection block!");
        }
    }
});

// Connect to Discord using your existing token variable
client.login(process.env.DISCORD_TOKEN);
