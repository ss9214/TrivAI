export type Status = "idle" | "active" | "completed";

export interface GameState {
  question_index: number;
  questionDisplay: QuestionDisplay;
  userStatuses: UserStatus[];
  owner: string;
  status: Status;
}

export interface QuestionDisplay {
  text: string;
  options: string[];
}

export interface UserStatus {
  userId: string;
  name: string;
  lifePoints: number;
  rank: number;
  answer?: Answer;
}

export interface Answer {
  choice: number;
  timestamp: Date;
}
