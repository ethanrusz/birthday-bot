const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Alter birthdays")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds a birthday")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Enter a user")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName("day").setDescription("Enter a day").setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("month")
            .setDescription("Enter a month")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName("year").setDescription("Enter a year")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a birthday")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Enter a user")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    await interaction.reply({
      content: "Pong!",
      ephemeral: true,
    });
  },
};
