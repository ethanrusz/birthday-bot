const { SlashCommandBuilder } = require("@discordjs/builders");
const { insertPerson, removePerson, updatePerson } = require("../database.js");

// Configure birthday command
module.exports = {
  data: new SlashCommandBuilder() 
    .setName("birthday")
    .setDescription("Alter birthdays")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a birthday")
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
        .setDescription("Remove a birthday")
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
        .setDescription("Update a birthday")
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
          option.setName("year").setDescription("Enter a four digit year")
        )
    ),
  async execute(interaction) {
    // Find what subcommand was used
    if (interaction.options.getSubcommand() === "add") {
      // Set user and birthday
      const user = interaction.options.getUser("user");
      // If a year wasn't set, it's 2006 now!
      let birthday = new Date(
        interaction.options.getInteger("year") === null
          ? 2006
          : interaction.options.getInteger("year"),
        interaction.options.getInteger("month") - 1,
        interaction.options.getInteger("day")
      );
      birthday.setUTCHours(0, 0, 0, 0);
      // Insert the person
      await insertPerson(user["id"], birthday);
      // Reply to whomever sent command
      await interaction.reply({
        content: `Added ${user} to the birthday database.`,
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "remove") {
      const user = interaction.options.getUser("user");
      await removePerson(user["id"]);
      await interaction.reply({
        content: `Removed ${user} from the birthday database.`,
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "update") {
      const user = interaction.options.getUser("user");
      let birthday = new Date(
        interaction.options.getInteger("year") === null
          ? 2006
          : interaction.options.getInteger("year"),
        interaction.options.getInteger("month") - 1,
        interaction.options.getInteger("day")
      );
      birthday.setUTCHours(0, 0, 0, 0);
      // Update the person
      await updatePerson(user["id"], birthday);
      // Reply to whomever sent command
      await interaction.reply({
        content: `Updated ${user} to the birthday database.`,
        ephemeral: true,
      });
    }
  },
};
