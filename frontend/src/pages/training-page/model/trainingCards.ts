import { TrainingCardConfig } from './types'

export const TRAINING_CARDS: TrainingCardConfig[] = [
	{
		titleKey: 'training_word_to_translation',
		descriptionKey: 'training_word_to_translation_desc',
		color: 'yellow',
		path: '/trainings/word-to-translation',
	},
	{
		titleKey: 'training_translation_to_word',
		descriptionKey: 'training_translation_to_word_desc',
		color: 'green',
		path: '/trainings/translation-to-word',
	},
	{
		titleKey: 'training_pairs',
		descriptionKey: 'training_pairs_desc',
		color: 'green',
		path: '/trainings/pairs',
	},
	{
		titleKey: 'training_fill',
		descriptionKey: 'training_fill_desc',
		color: 'yellow',
		path: '/trainings/fill',
	},
]
