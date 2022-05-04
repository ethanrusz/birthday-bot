const { SlashCommandBuilder } = require("@discordjs/builders");
const { findByDate, findByUser } = require("../database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("find")
    .setDescription("Find birthdays")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("date")
        .setDescription("Find birthdays by date")
        .addIntegerOption((option) =>
          option.setName("day").setDescription("Enter a day").setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("month")
            .setDescription("Enter a month")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Find birthday by user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Enter a user")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "date") {
      const birthdayIDs = await findByDate(
        interaction.options.getInteger("day"),
        interaction.options.getInteger("month")
        // get user object for each birthdayID in birthdayIDs
      );
      if (birthdayIDs.length >= 1) {
        const users = await Promise.all(
          birthdayIDs.map(async (birthdayID) => {
            const user = await interaction.client.users.fetch(birthdayID);
            return user;
          })
        );
        const birthdayMessage = users.map(
          (user) => `${user.username}#${user.discriminator}`
        );
        await interaction.reply({
          content: `Birthdays: ${birthdayMessage.join(", ")}.`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There are no birthdays in the database for that day.",
          ephemeral: true,
        });
      }
    } else if (interaction.options.getSubcommand() === "user") {
      console.log("user");
      // TODO: find by user
    }
  },
};
