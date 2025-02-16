export type Status = "idle" | "active" | "completed";

export interface GameState {
  correctAnswer: number;
  question_index: number;
  questionDisplay: QuestionDisplay;
  userStatuses: UserStatus[];
  ownerId: string;
  status: Status;
  completionTime: Date;
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
  answer: number;
  answerTime: number;
}
