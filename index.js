const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");
const { token, roleID, guildID } = require("./config.json");
const cron = require("node-cron");
const { findByDate } = require("./database.js");

// Create a new Discord client with intents
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

// Collection of all the commands files
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Load all the commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// When the bot is ready
client.once("ready", () => {
  console.log("Ready!");

  // Nightly birthday job
  cron.schedule("0 * * * * *", async () => {
    console.log("Running cron job");

    // Get guild from guildID
    const guild = client.guilds.cache.get(guildID);
    // Get role from roleID
    const role = guild.roles.cache.get(roleID);

    // Remove birthday role from all users
    guild.members.fetch().then((members) => {
      members.forEach((member) => {
        if (member.roles.cache.has(role.id)) {
          member.roles.remove(role.id);
        }
      });
    });

    // Get all users with birthdays today from MongoDB
    const birthdayIDs = await findByDate(
      new Date().getDate(),
      new Date().getMonth() + 1 // month is 0-indexed
    );

    // If there are birthdays today
    if (birthdayIDs) {
      // Add birthday role to all users with birthdays today
      guild.members.fetch().then((members) => {
        members.forEach((member) => {
          if (birthdayIDs.includes(member.id)) {
            member.roles.add(role.id);
          }
        });
      });
    } else {
      console.log("No birthdays today");
    }
  });
});

// Command handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
