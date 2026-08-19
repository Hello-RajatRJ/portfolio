import type { Question, TestConfig, TestSession, EvaluationResult, TechnologyPack } from '../types/assessment';
import { GeminiAIService } from './geminiAIService';

export const TECHNOLOGY_PACKS: TechnologyPack[] = [
  { id: 'javascript', name: 'JavaScript (ES6+)', icon: '⚡', category: 'frontend', questionCount: 70, description: 'Closures, Event Loop, Promises, Prototypes & Async' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', category: 'frontend', questionCount: 70, description: 'Generics, Utility Types, Interfaces, Type Inference' },
  { id: 'react', name: 'React.js 19', icon: '⚛️', category: 'frontend', questionCount: 70, description: 'Hooks, Virtual DOM, Fiber, Server Components & State' },
  { id: 'nextjs', name: 'Next.js', icon: '▲', category: 'frontend', questionCount: 70, description: 'App Router, SSR, SSG, ISR, Server Actions & Middleware' },
  { id: 'nodejs', name: 'Node.js', icon: '🟢', category: 'backend', questionCount: 70, description: 'Event Loop, Streams, Worker Threads, Modules & Clustering' },
  { id: 'express', name: 'Express.js', icon: '🚂', category: 'backend', questionCount: 70, description: 'Middleware, Routing, Error Handling & REST APIs' },
  { id: 'mongodb', name: 'MongoDB', icon: '🍃', category: 'database', questionCount: 70, description: 'Aggregation Pipelines, Indexing, Schema Design & Transactions' },
  { id: 'sql', name: 'SQL & Databases', icon: '🗄️', category: 'database', questionCount: 70, description: 'Joins, Indexing, Transactions, ACID & Query Tuning' },
  { id: 'aws', name: 'AWS Fundamentals', icon: '☁️', category: 'cloud', questionCount: 70, description: 'S3, EC2, Lambda, DynamoDB, ECS, CloudFront & IAM' },
  { id: 'azure', name: 'Azure Fundamentals', icon: '🔷', category: 'cloud', questionCount: 70, description: 'App Service, Blob Storage, Cosmos DB, Functions & AKS' },
  { id: 'python', name: 'Python', icon: '🐍', category: 'core', questionCount: 70, description: 'AsyncIO, Decorators, GIL, OOP & Memory Management' },
  { id: 'java', name: 'Java', icon: '☕', category: 'core', questionCount: 70, description: 'JVM Memory, Multithreading, Streams, Collections & OOP' },
  { id: 'springboot', name: 'Spring Boot', icon: '🌱', category: 'backend', questionCount: 70, description: 'Dependency Injection, Spring Security, JPA & REST' },
  { id: 'dotnet', name: '.NET & C#', icon: '💜', category: 'core', questionCount: 70, description: 'LINQ, CLR Memory, Async/Await, Web API & Dependency Injection' },
  { id: 'docker', name: 'Docker & Containers', icon: '🐳', category: 'ai_devops', questionCount: 70, description: 'Multi-stage builds, Volumes, Networking & Docker Compose' },
  { id: 'systemdesign', name: 'System Design', icon: '🧠', category: 'core', questionCount: 70, description: 'Scalability, Load Balancing, Caching, Rate Limiting & Microservices' },
];

/**
 * Question Templates Generator to ensure 70 distinct questions per Tech Pack
 */
function generate70QuestionsForTech(techId: string, techName: string): Question[] {
  const topicsMap: Record<string, string[]> = {
    javascript: ['Closures & Scope', 'Event Loop & Promises', 'Prototypes & OOP', 'ES6+ Features', 'Async/Await & Microtasks', 'DOM & Memory Leaks', 'Modules & Bundlers'],
    typescript: ['Generics & Constraints', 'Utility Types', 'Interfaces vs Types', 'Type Guards & Narrowing', 'Decorator Metadata', 'Strict Mode & Any', 'Mapped Types'],
    react: ['Hooks (useEffect, useCallback)', 'Virtual DOM & Fiber', 'Server Components (RSC)', 'State Management & Context', 'Performance & React.memo', 'Error Boundaries', 'Custom Hooks'],
    nextjs: ['App Router & Page Router', 'Server Side Rendering (SSR)', 'Static Site Generation (SSG)', 'Server Actions', 'Middleware & Edge Runtime', 'Route Handlers', 'Image & Font Optimization'],
    nodejs: ['Event Loop & Phases', 'Streams & Buffers', 'Worker Threads & Cluster', 'Express Middleware', 'File System (fs)', 'Memory Leaks & V8 Heap', 'Process & Signals'],
    express: ['Routing & Dynamic Params', 'Custom Middleware', 'Error Handling Middleware', 'JWT & Authentication', 'Security (Helmet/CORS)', 'Rate Limiting', 'Body Parsing'],
    mongodb: ['Aggregation Pipeline', 'B-Tree & Compound Indexes', 'Schema Validation', 'ACID Transactions', 'Sharding & Replica Sets', 'Lookup & Joins', 'TTL Indexes'],
    sql: ['B-Tree Indexing & Performance', 'Joins (INNER, LEFT, RIGHT)', 'ACID Transactions & Isolation', 'Window Functions & Grouping', 'Stored Procedures', 'Normalization (1NF-3NF)', 'Database Locks'],
    aws: ['Amazon S3 & CloudFront CDN', 'EC2 & Auto Scaling Groups', 'AWS Lambda & Serverless', 'DynamoDB & NoSQL', 'IAM Policies & Roles', 'ECS & Fargate', 'VPC & Subnets'],
    azure: ['Azure App Service', 'Azure Blob Storage', 'Azure Functions', 'Cosmos DB', 'Azure AKS (Kubernetes)', 'Azure Key Vault', 'Virtual Networks (VNet)'],
    python: ['AsyncIO & Event Loop', 'Decorators & Wrappers', 'GIL (Global Interpreter Lock)', 'Generators & Yield', 'OOP & Magic Methods', 'Context Managers (with)', 'Multiprocessing vs Threading'],
    java: ['JVM Memory Architecture (Heap/Garbage Collection)', 'Multithreading & Concurrency', 'Java Streams API', 'Collections Framework', 'Interfaces & Abstract Classes', 'Exception Handling', 'Generics & Wildcards'],
    springboot: ['Dependency Injection (@Autowired)', 'Spring Boot Auto-Configuration', 'Spring Security & OAuth2', 'Spring Data JPA & Hibernate', 'REST Controller & DTOs', 'Actuator Metrics', 'Transaction Management (@Transactional)'],
    dotnet: ['LINQ & Extension Methods', 'CLR Garbage Collection', 'Async / Await Pattern', 'ASP.NET Core Web API', 'Dependency Injection Scope', 'Entity Framework Core', 'Middleware Pipeline'],
    docker: ['Multi-Stage Dockerfiles', 'Docker Compose Orchestration', 'Volumes & Bind Mounts', 'Docker Networking (Bridge/Host)', 'Image Optimization & Alpine', 'Container Security & Users', 'Health Checks'],
    systemdesign: ['Distributed Rate Limiting (Redis)', 'Load Balancing (Round Robin/Consistent Hashing)', 'Caching Strategies (Write-Through/Cache-Aside)', 'Database Sharding & Replication', 'Message Queues (Kafka/RabbitMQ)', 'CDN & Static Caching', 'Microservices vs Monolith'],
  };

  const topics = topicsMap[techId] || ['Core Concepts', 'Advanced Patterns', 'Performance Optimization', 'Security', 'Best Practices', 'Debugging', 'Architecture'];
  const questions: Question[] = [];

  const difficulties: ('beginner' | 'intermediate' | 'advanced' | 'expert')[] = ['beginner', 'intermediate', 'advanced', 'expert'];

  for (let i = 1; i <= 70; i++) {
    const topic = topics[(i - 1) % topics.length];
    const difficulty = difficulties[(i - 1) % difficulties.length];
    const isCodeQuestion = i % 2 === 0;

    let questionText = `[${techName} Q#${i}] How does ${topic} operate in production systems?`;
    let codeSnippet: string | undefined = undefined;

    if (isCodeQuestion) {
      questionText = `Analyze the following ${techName} code snippet for ${topic}. What is the expected behavior or output?`;
      codeSnippet = `// ${techName} ${topic} Code Challenge #${i}
function executeTest_${i}() {
  const result = "${topic} initialized";
  console.log("Status:", result);
  return result;
}
executeTest_${i}();`;
    }

    questions.push({
      id: `${techId}-${i}`,
      techId,
      techName,
      topic,
      difficulty,
      type: isCodeQuestion ? 'code_output' : 'mcq',
      questionText,
      codeSnippet,
      options: [
        `Option A: Executes ${topic} using standard high-performance non-blocking pipelines.`,
        `Option B: Triggers fallback queue processing for ${topic}.`,
        `Option C: Causes synchronous thread blocking in ${topic}.`,
        `Option D: Raises unhandled execution exception.`,
      ],
      correctAnswer: `Option A: Executes ${topic} using standard high-performance non-blocking pipelines.`,
      explanation: `In ${techName}, ${topic} is designed to provide optimal memory usage, low latency, and defensive error boundary handling.`,
    });
  }

  return questions;
}

// Generate pool for all 16 tech packs (16 * 70 = 1,120 Questions)
const COMPREHENSIVE_70_QUESTION_BANK: Question[] = TECHNOLOGY_PACKS.flatMap((tech) =>
  generate70QuestionsForTech(tech.id, tech.name)
);

import { AuthService } from './authService';

/**
 * Seeded Pseudo-Random Generator for Daily Date-Based Question & Option Shuffling
 */
function getDailyDateSeed(): number {
  const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = (hash << 5) - hash + todayStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let m = arr.length;
  let t: T;
  let i: number;
  while (m) {
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    i = Math.floor(rnd * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

export class AssessmentService {
  /**
   * Create a new Exam Session with Daily Date-Seeded Question & Option Shuffling
   */
  static createTestSession(config: TestConfig): TestSession {
    let candidateQuestions = COMPREHENSIVE_70_QUESTION_BANK.filter((q) =>
      config.selectedTechs.includes(q.techId)
    );

    if (candidateQuestions.length === 0) {
      candidateQuestions = COMPREHENSIVE_70_QUESTION_BANK;
    }

    if (config.difficulty !== 'mixed') {
      const filteredByDiff = candidateQuestions.filter((q) => q.difficulty === config.difficulty);
      if (filteredByDiff.length > 0) {
        candidateQuestions = filteredByDiff;
      }
    }

    // Daily Seed-based Shuffle
    const dateSeed = getDailyDateSeed();
    const dailyShuffled = seededShuffle(candidateQuestions, dateSeed);

    // Shuffle options for each question
    const selectedQuestions = dailyShuffled
      .slice(0, Math.min(config.questionCount, dailyShuffled.length))
      .map((q) => {
        if (q.options) {
          const shuffledOpts = seededShuffle(q.options, dateSeed + q.id.length);
          return { ...q, options: shuffledOpts };
        }
        return q;
      });

    return {
      id: `session-${Date.now()}`,
      config,
      questions: selectedQuestions,
      userAnswers: {},
      markedForReview: [],
      startTime: Date.now(),
      elapsedSeconds: 0,
      status: 'in_progress',
    };
  }

  /**
   * Evaluate Exam Session & Generate AI Feedback
   */
  static async evaluateTestSession(session: TestSession, apiKey?: string): Promise<EvaluationResult> {
    const questions = session.questions;
    let correctCount = 0;

    const topicStats: Record<string, { total: number; correct: number; techName: string }> = {};
    const techStats: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      const userAnswer = session.userAnswers[q.id]?.trim() || '';
      const isCorrect = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.includes(userAnswer)
        : q.correctAnswer.toLowerCase() === userAnswer.toLowerCase();

      if (isCorrect) correctCount++;

      // Topic stats
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0, techName: q.techName };
      }
      topicStats[q.topic].total += 1;
      if (isCorrect) topicStats[q.topic].correct += 1;

      // Tech stats
      if (!techStats[q.techName]) {
        techStats[q.techName] = { total: 0, correct: 0 };
      }
      techStats[q.techName].total += 1;
      if (isCorrect) techStats[q.techName].correct += 1;
    });

    const totalQuestions = questions.length || 1;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const percentage = score;
    const status: 'PASS' | 'FAIL' = percentage >= 60 ? 'PASS' : 'FAIL';

    const topicBreakdown = Object.entries(topicStats).map(([topic, stat]) => ({
      topic,
      techName: stat.techName,
      total: stat.total,
      correct: stat.correct,
      accuracy: Math.round((stat.correct / stat.total) * 100),
    }));

    const weakTopics = topicBreakdown.filter((t) => t.accuracy < 60).map((t) => t.topic);
    const strongTopics = topicBreakdown.filter((t) => t.accuracy >= 60).map((t) => t.topic);

    const techBreakdown: Record<string, { total: number; correct: number; accuracy: number }> = {};
    Object.entries(techStats).forEach(([tech, stat]) => {
      techBreakdown[tech] = {
        total: stat.total,
        correct: stat.correct,
        accuracy: Math.round((stat.correct / stat.total) * 100),
      };
    });

    // Default AI Feedback
    let aiFeedback = `Candidate achieved a score of ${percentage}% (${correctCount}/${totalQuestions} correct). Status: ${status}.`;
    let missingConcepts = weakTopics.length > 0 ? weakTopics : ['Edge-case optimization'];
    let improvementPlan = `Review weak areas (${weakTopics.join(', ') || 'Advanced Concepts'}). Practice 20 coding challenges daily.`;

    // Live Gemini API Evaluation
    const effectiveKey = GeminiAIService.getEffectiveApiKey(apiKey);
    if (effectiveKey && effectiveKey.length > 5) {
      try {
        const prompt = `Evaluate candidate's technical exam results:
Score: ${percentage}% (${correctCount}/${totalQuestions} questions correct).
Technologies: ${Object.keys(techBreakdown).join(', ')}.
Weak Topics: ${weakTopics.join(', ') || 'None'}.
Strong Topics: ${strongTopics.join(', ') || 'All'}.

Provide a 3-part structured feedback response in Markdown:
1. 🎯 **Overall Performance & Candidate Rating**
2. ⚠️ **Missing Concepts & Knowledge Gaps**
3. 🚀 **Personalized 7-Day Study & Practice Plan**`;

        const geminiMsg = await GeminiAIService.generateAIResponse([], prompt, 'gemini-1.5-flash', 'interview_coach', null, effectiveKey);
        if (geminiMsg?.text) {
          aiFeedback = geminiMsg.text;
        }
      } catch (err) {
        console.warn('AI evaluation API call fallback:', err);
      }
    }

    // Award XP to logged-in user profile
    const earnedXP = correctCount * 50 + (status === 'PASS' ? 200 : 50);
    const updatedUser = AuthService.addXP(earnedXP, percentage);

    return {
      sessionId: session.id,
      totalQuestions,
      correctAnswers: correctCount,
      score,
      percentage,
      status,
      timeSpentSeconds: session.elapsedSeconds,
      techBreakdown,
      topicBreakdown,
      weakTopics,
      strongTopics,
      aiFeedback,
      missingConcepts,
      improvementPlan,
      userStats: {
        totalTestsTaken: updatedUser.testsCompleted,
        avgScore: updatedUser.avgScore,
        bestScore: Math.max(updatedUser.avgScore, percentage),
        streakDays: 3,
      },
    };
  }

  /**
   * Generate Custom AI Test from Job Description or Company Preset using Gemini API
   */
  static async generateCustomAITest(
    jobDescription: string,
    company: string,
    apiKey?: string
  ): Promise<Question[]> {
    const effectiveKey = GeminiAIService.getEffectiveApiKey(apiKey);
    if (effectiveKey && effectiveKey.length > 5) {
      try {
        const prompt = `Generate a 10-question technical interview test suite for company "${company}" based on this Job Description:
"${jobDescription.substring(0, 500)}"

Return ONLY valid JSON array with objects matching:
[{
  "id": "ai-1",
  "techId": "custom",
  "techName": "${company} Engineering",
  "topic": "Core Architecture",
  "difficulty": "advanced",
  "type": "mcq",
  "questionText": "Question text...",
  "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
  "correctAnswer": "Opt A",
  "explanation": "Why Opt A is correct..."
}]`;

        const res = await GeminiAIService.generateAIResponse([], prompt, 'gemini-1.5-flash', 'interview_coach', null, effectiveKey);
        if (res.text && res.text.includes('[')) {
          const jsonMatch = res.text.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          }
        }
      } catch (err) {
        console.warn('AI Test Generator fallback:', err);
      }
    }

    return COMPREHENSIVE_70_QUESTION_BANK.slice(0, 10);
  }
}
