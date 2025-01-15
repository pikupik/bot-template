const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        try {
            const welcomeChannelId = '1315022354643943455';
            const channel = member.guild.channels.cache.get(welcomeChannelId);
            const getRole = '1317000275378176010';
            const getRules = '1316931733882535947';
            const getKata = '1321546125265731708';
            const image = 'https://cdn.discordapp.com/attachments/1329072090535559211/1329171357727981689/WhatsApp_Image_2025-01-16_at_02.18.00_f93616fb.jpg?ex=67895eca&is=67880d4a&hm=e2ab56df91fbd042ba5551d4fe36d7f5dec74f8a987c4f2058bf538c2bd690db&'

            if (!channel) return console.error('Channel welcome tidak ditemukan!');

            const welcomeEmbed = new EmbedBuilder()
                .setTitle("Welcome to Six-9")
                .setDescription(`Selamat Datang <@${member.id}> \nsilahkan Ambil Role kamu di sini <#${getRole}>\nJangan lupa baca rules disini ya <#${getRules}> \nBoleh kali kasih kata-kata hari ini disini <#${getKata}>`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setImage(image)
                .setTimestamp()
                .setFooter({
                    text: `Member ke-${member.guild.memberCount}`,
                    iconURL: member.guild.iconURL({ dynamic: true })
                })
                .setColor('#00ff00');

            channel.send({
                embeds: [welcomeEmbed]
            });
        } catch (error) {
            console.error('Error dalam event welcome:', error);
        }
    }
};