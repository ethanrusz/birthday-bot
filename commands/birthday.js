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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update")
        .setDescription("Updates a birthday")
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
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "add") {
      const user = interaction.options.getUser("user");
      const day = interaction.options.getInteger("day");
      const month = interaction.options.getInteger("month");
      const year = interaction.options.getInteger("year");

      await interaction.reply(`Add ${user} ${year}-${month}-${day}`);
    } else if (interaction.options.getSubcommand() === "remove") {
      const user = interaction.options.getUser("user");

      await interaction.reply(`Remove ${user}`);
    } else if (interaction.options.getSubcommand() === "update") {
      const user = interaction.options.getUser("user");
      const day = interaction.options.getInteger("day");
      const month = interaction.options.getInteger("month");
      const year = interaction.options.getInteger("year");

      await interaction.reply(`Update ${user} ${year}-${month}-${day}`);
    }
  },
};
