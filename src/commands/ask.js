const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
// Pulls the settings directly from your application.js configuration file
const config = require('../config/application.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask the Verthandi AI a question!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you want to ask the AI')
                .setRequired(true)),
    async execute(interaction) {
        // Automatically turns off if you don't have a Gemini API key set up in Railway
        if (!config.aiChat.enabled) {
            return await interaction.reply({ content: "The AI module is currently disabled in the configuration settings.", ephemeral: true });
        }

        const prompt = interaction.options.getString('question');
        
        // Acknowledge the command immediately to give the AI time to think without timing out
        await interaction.deferReply();

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://googleapis.com{config.aiChat.model}:generateContent?key=${apiKey}`;

        // Forms the prompt packet alongside your custom personality rules from the config file
        const postData = JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: config.aiChat.personality }] }
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    
                    if (aiText) {
                        // Automatically cuts off the text safely if it exceeds your config limits
                        return await interaction.editReply(aiText.substring(0, config.aiChat.maxOutputLength));
                    } else {
                        return await interaction.editReply("I connected to my AI module, but received an empty response. Verify your Gemini key inside Railway!");
                    }
                } catch (err) {
                    return await interaction.editReply("I failed to process the response syntax from my AI engine.");
                }
            });
        });

        req.on('error', async (e) => {
            return await interaction.editReply("I failed to reach the AI cloud network.");
        });

        req.write(postData);
        req.end();
    },
};
