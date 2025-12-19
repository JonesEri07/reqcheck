/**
 * Widget API Client
 */
const API_BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : "";

export interface QuizQuestion {
  id: string;
  type: "multiple_choice" | "fill_blank_blocks";
  prompt: string;
  config: any;
  imageUrl?: string;
  imageAltText?: string;
  timeLimitSeconds?: number;
  skillName?: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  jobId: string;
  passThreshold: number;
  cached: boolean;
}

export interface StartAttemptResponse {
  sessionToken: string;
  attemptId: string;
  resumed?: boolean;
  questions?: QuizQuestion[]; // Questions stored in the attempt (for new attempts)
}

export interface CurrentAttemptResponse {
  status: "passed" | "failed" | "in_progress" | "abandoned" | null;
  attempt: {
    id: string;
    sessionToken: string;
    questionsShown: QuizQuestion[];
    answers: Array<{
      questionId: string;
      question: QuizQuestion;
      answer: string | string[];
      isCorrect: boolean;
      answeredAt: string;
    }>;
    startedAt: string;
    completedAt: string | null;
    passed: boolean | null;
    score: number | null;
  } | null;
  timeRemaining: number | null; // hours until can retry
  firstUnansweredIndex: number | null; // index of first unanswered question
}

export interface ProgressResponse {
  success: boolean;
  isLastQuestion: boolean;
  totalAnswered: number;
  totalQuestions: number;
}

export interface SubmitAttemptResponse {
  passed: boolean;
  score: number;
  requiredScore: number;
  totalQuestions: number;
  verificationToken: string | null;
  tokenExpiresAt: string | null;
  cooldownUntil: string | null;
}

export interface WidgetStyles {
  fontColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  accentColor?: string; // For selected answers, progress bars, etc.
}

export interface ValidateResponse {
  canRender: boolean;
  error?: string;
  errorCode?: string;
  config?: {
    passThreshold: number;
    questionCount: number;
    jobId: string;
  };
  widgetStyles?: WidgetStyles | null;
}

/**
 * Validate widget can render
 */
export async function validateWidget(
  companyId: string,
  jobId: string,
  testMode?: boolean
): Promise<ValidateResponse> {
  const origin = window.location.origin;
  const params = new URLSearchParams({
    companyId,
    jobId,
    origin,
  });
  if (testMode) {
    params.append("testMode", "true");
  }
  const response = await fetch(
    `${API_BASE_URL}/api/v1/widget/validate?${params.toString()}`
  );
  return response.json();
}

/**
 * Get questions for a job (generates quiz)
 */
export async function getQuestions(
  companyId: string,
  jobId: string,
  email?: string
): Promise<QuizResponse> {
  const params = new URLSearchParams({
    companyId,
    jobId,
  });
  if (email) {
    params.append("email", email);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/widget/questions?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error(`Failed to get questions: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Start a verification attempt
 */
export async function startAttempt(
  companyId: string,
  jobId: string,
  email: string,
  testMode?: boolean
): Promise<StartAttemptResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/widget/attempts/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companyId,
      jobId,
      email,
      testMode: testMode || false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start attempt: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Submit attempt answers
 */
export async function submitAttempt(
  sessionToken: string,
  attemptId: string,
  answers: Array<{
    questionId: string;
    answer: string | string[];
  }>,
  timeTakenSeconds?: number
): Promise<SubmitAttemptResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/widget/attempts/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionToken,
        attemptId,
        answers,
        timeTakenSeconds,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to submit attempt: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check verification status
 */
export async function checkStatus(
  companyId: string,
  jobId: string,
  email: string
): Promise<{
  verified: boolean;
  passed: boolean;
  score: number;
  completedAt: string;
  tokenExpiresAt: string | null;
}> {
  const params = new URLSearchParams({
    companyId,
    jobId,
    email,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/widget/attempts/status?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to check status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get current attempt (for resume logic)
 */
export async function getCurrentAttempt(
  companyId: string,
  jobId: string,
  email: string
): Promise<CurrentAttemptResponse> {
  const params = new URLSearchParams({
    companyId,
    jobId,
    email,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/widget/attempts/current?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get current attempt: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Save progress after answering a question
 */
export async function saveProgress(
  sessionToken: string,
  attemptId: string,
  questionId: string,
  answer: string | string[]
): Promise<ProgressResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/widget/attempts/progress`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionToken,
        attemptId,
        questionId,
        answer,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to save progress: ${response.statusText}`);
  }

  return response.json();
}
