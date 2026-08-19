export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type QuestionType = 'mcq' | 'multiple_select' | 'true_false' | 'code_output' | 'coding_challenge' | 'descriptive';
export type ExamMode = 'exam' | 'practice';
export type CompanyPreset = 'general' | 'google' | 'amazon' | 'microsoft' | 'tcs' | 'infosys' | 'capgemini';

export interface Question {
  id: string;
  techId: string;
  techName: string;
  topic: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  codeSnippet?: string;
  testCases?: { input: string; expectedOutput: string }[];
}

export interface TestConfig {
  selectedTechs: string[];
  difficulty: DifficultyLevel | 'mixed';
  questionCount: number; // 10, 20, 30, 50, 70
  mode: ExamMode;
  timeLimitMinutes: number;
  companyPreset: CompanyPreset;
  jobDescription?: string;
}

export interface TestSession {
  id: string;
  config: TestConfig;
  questions: Question[];
  userAnswers: Record<string, string>;
  markedForReview: string[];
  startTime: number;
  elapsedSeconds: number;
  status: 'in_progress' | 'submitted';
}

export interface TopicResult {
  topic: string;
  techName: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface EvaluationResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  status: 'PASS' | 'FAIL';
  timeSpentSeconds: number;
  techBreakdown: Record<string, { total: number; correct: number; accuracy: number }>;
  topicBreakdown: TopicResult[];
  weakTopics: string[];
  strongTopics: string[];
  aiFeedback?: string;
  missingConcepts?: string[];
  improvementPlan?: string;
  userStats?: {
    totalTestsTaken: number;
    avgScore: number;
    bestScore: number;
    streakDays: number;
  };
}

export interface TechnologyPack {
  id: string;
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'core' | 'ai_devops';
  questionCount: number;
  description: string;
}
