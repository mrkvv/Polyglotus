export type Role = "user" | "LLM";

export interface sendMessageResponse {
	userMessage: string;
	aiMessage: string;
}

export interface getMessageHistoryResponse {
	messages: Message[];
}

export interface Message {
	id: number;
	userId: number;
	role: Role;
	content: string;
	createdAt: string;
}