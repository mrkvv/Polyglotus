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
	pairs: {
		id: number;
		word: string;
		translation: string;
	}
}

export interface GetFillSentenceTrainingResponse {
	tasks: TaskFill[];
	amount: number;
}

export interface TaskFill {
	sentence: string;
	answer: string;
	id: number;
}