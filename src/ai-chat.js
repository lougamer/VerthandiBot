const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Trigger only if the bot profile is explicitly mentioned/tagged
    if (message.mentions.has(client.user)) {
        const prompt = message.content.replace(`<@${client.user.id}>`, '').trim();
        if (!prompt) return message.reply("Hello! How can I help you today?");

        await message.channel.sendTyping();

        try {
            // Directly fetch data from Gemini using native web requests
            const response = await fetch(
                `https://googleapis.com{process.env.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                }
            );

            const data = await response.json();
            
            // Extract the text safely out of Gemini's response formatting
            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
                return message.reply(data.candidates[0].content.parts[0].text);
            } else {
                return message.reply("I connected to my brain, but received an empty response. Verify your Gemini API key variables!");
            }
        } catch (error) {
            console.error("AI Network Exception:", error);
            return message.reply("I failed to reach my AI brain. Try again shortly!");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);


