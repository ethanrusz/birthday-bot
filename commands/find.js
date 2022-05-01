const { SlashCommandBuilder } = require("@discordjs/builders");

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
      console.log("date");
      //TODO: find by date
    } else if (interaction.options.getSubcommand() === "user") {
      console.log("user");
      // TODO: find by user
    }
  },
};
