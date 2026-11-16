export interface GetSimpleTrainingRequest {
	to: string;
	amount: number;
}

export interface GetSimpleTrainingResponse {
	tasks: Task[];
	amount?: number;
}

export interface Task {
	id: number;
	word: string;
	options: string[];
	answer: string;
}

export interface GetPairsTrainingResponse {
	tasks: TaskPairs[];
	amount: number;
}

export interface TaskPairs {
	pairs: Pair[];
}

export interface Pair {
	id: number;
	word: string;
	translation: string;
}

export interface GetFillSentenceTrainingResponse {
	task: TaskFill[];
	amount: number;
}

export interface TaskFill {
	sentence: string;
	answer: string;
	id: number;
}

export type TrainingCardColor = 'yellow' | 'green'

export interface TrainingCardConfig {
	titleKey: string
	descriptionKey: string
	color: TrainingCardColor
	path: string
}
