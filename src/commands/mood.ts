import {AutocompleteInteraction, ChatInputCommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {inject, injectable} from 'inversify';
import Command from './index.js';
import {TYPES} from '../types.js';
import AddQueryToQueue from '../services/add-query-to-queue.js';
import {MOOD_PRESETS, getMoodQuery} from '../utils/mood-presets.js';

@injectable()
export default class implements Command {
  public readonly slashCommand = new SlashCommandBuilder()
    .setName('mood')
    .setDescription('play music based on a mood')
    .addStringOption(option => option
      .setName('mood')
      .setDescription('the mood you want to listen to')
      .setAutocomplete(true)
      .setRequired(true))
    .addIntegerOption(option => option
      .setName('count')
      .setDescription('number of songs to add (defaults to guild playlist limit)')
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(false))
    .addBooleanOption(option => option
      .setName('immediate')
      .setDescription('add tracks to the front of the queue'))
    .addBooleanOption(option => option
      .setName('shuffle')
      .setDescription('shuffle the added tracks'));

  public requiresVC = true;

  private readonly addQueryToQueue: AddQueryToQueue;

  constructor(@inject(TYPES.Services.AddQueryToQueue) addQueryToQueue: AddQueryToQueue) {
    this.addQueryToQueue = addQueryToQueue;
  }

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const mood = interaction.options.getString('mood')!.trim();
    const count = interaction.options.getInteger('count');

    // Validate mood exists
    const query = getMoodQuery(mood);
    if (!query) {
      throw new Error('unknown mood. Use autocomplete to see available moods.');
    }

    await this.addQueryToQueue.addToQueue({
      interaction,
      query,
      addToFrontOfQueue: interaction.options.getBoolean('immediate') ?? false,
      shuffleAdditions: interaction.options.getBoolean('shuffle') ?? false,
      shouldSplitChapters: false,
      skipCurrentTrack: false,
      playlistLimit: count ?? undefined,
    });
  }

  public async handleAutocompleteInteraction(interaction: AutocompleteInteraction): Promise<void> {
    const query = interaction.options.getString('mood')?.trim().toLowerCase() ?? '';

    // Get all mood names
    const allMoods = Object.keys(MOOD_PRESETS);

    // Filter moods by user input (prefix matching)
    const filteredMoods = query === ''
      ? allMoods
      : allMoods.filter(mood => mood.toLowerCase().startsWith(query));

    // Limit to 25 results (Discord autocomplete limit)
    const results = filteredMoods.slice(0, 25);

    await interaction.respond(results.map(mood => ({
      name: mood,
      value: mood,
    })));
  }
}
