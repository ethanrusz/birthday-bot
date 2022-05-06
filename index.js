const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");
const { token, roleID, guildID } = require("./config.json");
const cron = require("node-cron");
const { findByDate } = require("./database.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("Ready!");

  // list all users with birthdays today from findByDate
  cron.schedule("0 * * * * *", async () => {
    console.log("Running cron job");

    // FIXME: Remove roles
    // remove birthday roles from all users

    //get all users with birthdays today
    const birthdayIDs = await findByDate(
      new Date().getDate(),
      new Date().getMonth() + 1
    );
    if (birthdayIDs) {
      //add role roleID to users in guild guildID
      // TODO: add roles
    } else {
      console.log("No birthdays today");
    }
  });
});

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
