import {ChatInputCommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {inject, injectable} from 'inversify';
import Command from './index.js';
import {TYPES} from '../types.js';
import AddQueryToQueue from '../services/add-query-to-queue.js';
import {getRandomMood, getMoodQuery} from '../utils/mood-presets.js';

@injectable()
export default class implements Command {
  public readonly slashCommand = new SlashCommandBuilder()
    .setName('random')
    .setDescription('play music from a random mood')
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
    const count = interaction.options.getInteger('count');

    // Select a random mood
    const selectedMood = getRandomMood();
    const query = getMoodQuery(selectedMood);

    if (!query) {
      throw new Error('failed to select random mood');
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
}
