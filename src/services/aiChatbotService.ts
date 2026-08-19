import type { ResumeData } from '../types/resume';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  category?: 'general' | 'cv_suggestion' | 'job_purpose' | 'mentoring' | 'cv_creation' | 'interview_prep';
  suggestedAction?: {
    type: 'apply_summary' | 'add_skill' | 'add_bullet';
    payload: string;
    label: string;
  };
}

export interface CareerTopicPreset {
  id: string;
  title: string;
  icon: string;
  prompt: string;
  category: 'cv_suggestion' | 'job_purpose' | 'mentoring' | 'cv_creation' | 'interview_prep';
}

export const PRESET_TOPICS: CareerTopicPreset[] = [
  {
    id: 'audit_profile',
    title: 'Audit My Profile & CV',
    icon: '📊',
    prompt: 'Audit my active profile and CV details. What are my strongest points and what critical improvements should I make to stand out?',
    category: 'mentoring',
  },
  {
    id: 'job_purpose',
    title: 'Define Job Purpose & Goals',
    icon: '🎯',
    prompt: 'Help me articulate a clear Job Purpose statement and align my background for my dream role in tech.',
    category: 'job_purpose',
  },
  {
    id: 'bullet_suggestions',
    title: 'Enhance Experience Bullets',
    icon: '⚡',
    prompt: 'Suggest 3 high-impact experience bullet points with strong action verbs and quantified achievements for my CV.',
    category: 'cv_suggestion',
  },
  {
    id: 'python_qa',
    title: 'Python Interview Q&A + Code',
    icon: '🐍',
    prompt: 'Give me a top Python interview question covering Decorators, AsyncIO, and GIL with code solution.',
    category: 'interview_prep',
  },
  {
    id: 'react_code_qa',
    title: 'React & TS Interview Q&A + Code',
    icon: '💻',
    prompt: 'Give me a top React & TypeScript coding interview question with problem statement, production-ready code solution, and explanation.',
    category: 'interview_prep',
  },
  {
    id: 'system_design_qa',
    title: 'Node & System Design Q&A',
    icon: '⚙️',
    prompt: 'Give me a Senior Node.js & Backend System Design interview question with architecture design, DB schema, and code example.',
    category: 'interview_prep',
  },
  {
    id: 'dsa_challenge',
    title: 'DS & Algorithms Code Challenge',
    icon: '🧩',
    prompt: 'Give me a frequently asked Data Structures & Algorithms coding challenge (e.g. Custom Debounce, LRU Cache, or Event Emitter) with TypeScript solution.',
    category: 'interview_prep',
  },
  {
    id: 'mock_interview',
    title: 'Start Mock Technical Interview',
    icon: '🎙️',
    prompt: 'Act as a Senior Technical Interviewer conducting a mock interview for my role. Ask me 1 challenging technical question to test my knowledge!',
    category: 'interview_prep',
  },
  {
    id: 'draft_summary',
    title: 'Draft Executive Summary',
    icon: '✍️',
    prompt: 'Write a compelling 3-sentence professional summary for my target job role that I can apply directly to my resume.',
    category: 'cv_creation',
  },
];

export class AIChatbotService {
  /**
   * Main entry point to send a message to the AI Chatbot
   */
  static async sendMessage(
    userInput: string,
    history: ChatMessage[],
    activeResume?: ResumeData | null,
    apiKey?: string
  ): Promise<ChatMessage> {
    const trimmedInput = userInput.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const effectiveApiKey =
      apiKey?.trim() ||
      (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ||
      localStorage.getItem('gemini_api_key') ||
      '';

    // Attempt to use Google Gemini API if user configured an API Key
    if (effectiveApiKey && effectiveApiKey.trim().length > 10) {
      try {
        const geminiResponse = await this.callGeminiAPI(trimmedInput, history, activeResume, effectiveApiKey);
        if (geminiResponse) {
          return {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: geminiResponse.text,
            timestamp,
            category: geminiResponse.category,
            suggestedAction: geminiResponse.suggestedAction,
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to Contextual Mentoring Engine', err);
      }
    }

    // Smart Contextual AI Fallback Engine
    const contextualResponse = this.generateContextualResponse(trimmedInput, activeResume);

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: contextualResponse.text,
      timestamp,
      category: contextualResponse.category,
      suggestedAction: contextualResponse.suggestedAction,
    };
  }

  /**
   * Call Gemini API endpoint with active profile context
   */
  private static async callGeminiAPI(
    userInput: string,
    history: ChatMessage[],
    activeResume?: ResumeData | null,
    apiKey?: string
  ): Promise<{ text: string; category?: ChatMessage['category']; suggestedAction?: ChatMessage['suggestedAction'] } | null> {
    const profileContext = activeResume
      ? `USER ACTIVE PROFILE:
Name: ${activeResume.personalInfo.fullName}
Job Title: ${activeResume.personalInfo.jobTitle}
Summary: ${activeResume.personalInfo.summary}
Experiences: ${activeResume.workExperiences.map((w) => `${w.jobTitle} at ${w.company}`).join(', ')}
Skills: ${activeResume.skillCategories.flatMap((c) => c.skills).join(', ')}`
      : 'User profile: Full-Stack Developer (React, TypeScript, Python, Node.js, Systems).';

    const systemPrompt = `You are "CareerAI Mentor & Technical Interviewer", an elite software architect and technical interviewer.
Your purpose:
1. ANSWER EXACT USER QUESTIONS: When the user asks about Python, Java, Docker, AWS, React, Node, System Design, or ANY technical topic, directly answer their question with:
   - Clear Explanation & Concepts
   - Production-ready code examples in fenced code blocks (\`\`\`python ... \`\`\` or \`\`\`typescript ... \`\`\`)
   - Edge cases, best practices, and interview key points.
2. Provide guidance on Job Purpose context.
3. Give actionable CV suggestions & ATS optimization.
4. Assist in CV creation (summaries, bullets, skills).

Keep responses structured, professional, and formatted in clean Markdown with code blocks where appropriate.
${profileContext}`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      ...history.slice(-6).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      {
        role: 'user',
        parts: [{ text: userInput }],
      },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    // Check if the response generated a summary for application
    let suggestedAction: ChatMessage['suggestedAction'] = undefined;
    if (text.toLowerCase().includes('summary') && text.length < 500 && !text.includes('```')) {
      suggestedAction = {
        type: 'apply_summary',
        payload: text.replace(/^#+.*$/gm, '').trim(),
        label: 'Apply Summary to Resume',
      };
    }

    return {
      text,
      category: text.includes('```') || text.toLowerCase().includes('interview') ? 'interview_prep' : 'general',
      suggestedAction,
    };
  }

  /**
   * Smart Contextual Fallback Engine for offline / fast responses
   */
  private static generateContextualResponse(
    input: string,
    activeResume?: ResumeData | null
  ): { text: string; category: ChatMessage['category']; suggestedAction?: ChatMessage['suggestedAction'] } {
    const query = input.toLowerCase().trim();
    const role = activeResume?.personalInfo.jobTitle || 'Software Engineer / Full-Stack Developer';
    const name = activeResume?.personalInfo.fullName || 'Rajat Ambedkar';

    // 1. PYTHON INTERVIEW Q&A & CODE
    if (query.includes('python') || query === 'py' || query.includes('fastapi') || query.includes('django') || query.includes('flask') || query.includes('decorator') || query.includes('asyncio')) {
      return {
        category: 'interview_prep',
        text: `### 🐍 Python Technical Interview Guide & Production Code

#### ❓ Top Python Interview Question:
> *"How do Custom Decorators, AsyncIO event loops, and the GIL (Global Interpreter Lock) work in Python? Write a production-ready asynchronous Python script using \`asyncio\` and a custom execution time decorator."*

#### 💡 Concepts & Architectural Breakdown:
- **GIL (Global Interpreter Lock)**: A mutex that prevents multiple native threads from executing Python bytecodes at once. For I/O-bound tasks, use **AsyncIO**; for CPU-bound tasks, use **Multiprocessing**.
- **Decorators**: Higher-order functions that take a function as an argument and return a modified wrapper function without altering the original code.

#### 💻 Production Python Code Solution:

\`\`\`python
import asyncio
import time
from functools import wraps
from typing import Callable, Any

# Custom Decorator to measure function execution time
def measure_time(func: Callable) -> Callable:
    @wraps(func)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        start_time = time.perf_counter()
        result = await func(*args, **kwargs)
        elapsed = time.perf_counter() - start_time
        print(f"⏱️ [PERF] Function '{func.__name__}' executed in {elapsed:.4f} seconds.")
        return result
    return wrapper

# Asynchronous Task Simulation (e.g., fetching data from DB or API)
@measure_time
async def fetch_user_data(user_id: int) -> dict:
    print(f"🔄 [FETCH] Querying database for User #{user_id}...")
    await asyncio.sleep(1.5)  # Non-blocking async sleep
    return {"user_id": user_id, "status": "active", "role": "Senior Engineer"}

async def main():
    print("🚀 Initializing Concurrent Async Tasks in Python...")
    # Run multiple async tasks concurrently with asyncio.gather
    users = await asyncio.gather(
        fetch_user_data(101),
        fetch_user_data(102),
        fetch_user_data(103)
    )
    print(f"✅ Successfully fetched {len(users)} user records!")

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

#### 📌 Key Interview Takeaways:
- **\`@wraps(func)\`**: Preserves original function metadata (\`__name__\`, \`__doc__\`).
- **\`asyncio.gather()\`**: Executes multiple I/O-bound coroutines concurrently in a single event loop thread.`,
      };
    }

    // 2. JAVA & SPRING BOOT Q&A
    if (query.includes('java') || query.includes('spring') || query.includes('springboot') || query.includes('jvm')) {
      return {
        category: 'interview_prep',
        text: `### ☕ Java & Spring Boot Interview Guide & Code Example

#### ❓ Question:
> *"Explain Dependency Injection (DI) and inversion of control (IoC) in Spring Boot, and write a REST Controller with service injection."*

#### 💻 Production Java Spring Boot Code:

\`\`\`java
package com.portfolio.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    // Constructor Injection (Recommended over @Autowired on fields)
    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.findAllProjects();
        return ResponseEntity.ok(projects);
    }
}
\`\`\``,
      };
    }

    // 3. DOCKER & CONTAINERIZATION Q&A
    if (query.includes('docker') || query.includes('container') || query.includes('kubernetes') || query.includes('k8s')) {
      return {
        category: 'interview_prep',
        text: `### 🐳 Docker & Multi-Stage Build Guide

#### ❓ Question:
> *"Write an optimized multi-stage Dockerfile for a Node.js application to minimize image size and enforce security."*

#### 💻 Dockerfile Solution:

\`\`\`dockerfile
# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runtime stage (Minimal size)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
\`\`\``,
      };
    }

    // 4. AWS & CLOUD ARCHITECTURE
    if (query.includes('aws') || query.includes('cloud') || query.includes('lambda') || query.includes('s3')) {
      return {
        category: 'interview_prep',
        text: `### ☁️ AWS Serverless Architecture Guide

#### 🏗️ Key AWS Infrastructure Components:
- **Amazon API Gateway**: Front door receiving client HTTP REST / WebSocket requests.
- **AWS Lambda**: Event-driven serverless computing running code without managing EC2 servers.
- **Amazon DynamoDB**: Low-latency NoSQL database scaling automatically.
- **Amazon S3**: High-durability object storage for assets and build outputs.`,
      };
    }

    // 5. SQL & DATABASE OPTIMIZATION
    if (query.includes('sql') || query.includes('database') || query.includes('postgres') || query.includes('mysql') || query.includes('index')) {
      return {
        category: 'interview_prep',
        text: `### 🗄️ SQL Indexing & Performance Optimization

#### ❓ Question:
> *"How do B-Tree indexes work in relational databases, and when should you use composite indexes?"*

#### 💡 SQL Example:
\`\`\`sql
-- Create composite B-Tree index for filtering user queries
CREATE INDEX idx_users_location_status 
ON users (location, status) 
WHERE deleted_at IS NULL;
\`\`\``,
      };
    }

    // 6. GOLANG (GO) CONCURRENCY
    if (query.includes('go') || query.includes('golang') || query.includes('goroutine') || query.includes('channel')) {
      return {
        category: 'interview_prep',
        text: `### 🐹 Go (Golang) Concurrency & Worker Pool Code

\`\`\`go
package main

import (
	"fmt"
	"time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
	for j := range jobs {
		fmt.Printf("Worker %d processing job %d\n", id, j)
		time.Sleep(time.Millisecond * 500)
		results <- j * 2
	}
}

func main() {
	jobs := make(chan int, 100)
	results := make(chan int, 100)

	for w := 1; w <= 3; w++ {
		go worker(w, jobs, results)
	}

	for j := 1; j <= 5; j++ {
		jobs <- j
	}
	close(jobs)
}
\`\`\``,
      };
    }

    // 7. REACT & TYPESCRIPT INTERVIEW CODE Q&A
    if (query.includes('react') || query.includes('frontend code') || query.includes('custom hook') || query.includes('debounce code')) {
      return {
        category: 'interview_prep',
        text: `### 💻 React & TypeScript Interview Question: Custom \`useDebounce\` Hook

#### ❓ Question:
> *"How do you optimize search input fields in React to prevent excessive API calls on every keystroke? Write a custom TypeScript hook for debouncing fast state changes."*

#### 💡 Model Answer & Solution Code:
A **debounce hook** delays updating a value until a specified delay has passed without any new changes.

\`\`\`typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\``,
      };
    }

    // 8. BACKEND & SYSTEM DESIGN INTERVIEW Q&A
    if (query.includes('system design') || query.includes('backend') || query.includes('node') || query.includes('rate limit')) {
      return {
        category: 'interview_prep',
        text: `### ⚙️ Backend & System Design Interview Q&A: API Rate Limiter

#### ❓ Question:
> *"Design a Redis-backed Sliding Window Rate Limiter middleware in Node.js to protect REST APIs against DDoS and API abuse."*

\`\`\`typescript
import type { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function slidingWindowRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || '127.0.0.1';
  const key = \`rate_limit:\${ip}\`;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 100;

  try {
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, now - windowMs);
    pipeline.zadd(key, now, \`\${now}-\${Math.random()}\`);
    pipeline.zcard(key);
    pipeline.expire(key, 60);

    const results = await pipeline.exec();
    const reqCount = (results?.[2]?.[1] as number) || 0;

    if (reqCount > limit) {
      return res.status(429).json({ error: 'Too Many Requests' });
    }
    next();
  } catch (err) {
    next();
  }
}
\`\`\``,
      };
    }

    // 9. DATA STRUCTURES & ALGORITHMS CODE CHALLENGE
    if (query.includes('dsa') || query.includes('algorithm') || query.includes('lru') || query.includes('challenge') || query.includes('code challenge')) {
      return {
        category: 'interview_prep',
        text: `### 🧩 DS & Algorithms Code Challenge: LRU Cache Implementation

#### ❓ Question:
> *"Implement a Least Recently Used (LRU) Cache data structure with \`get\` and \`put\` methods operating in constant **O(1)** time complexity."*

\`\`\`typescript
export class LRUCache<K, V> {
  private capacity: number;
  private map = new Map<K, V>();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | -1 {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  put(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined) this.map.delete(firstKey);
    }
    this.map.set(key, value);
  }
}
\`\`\``,
      };
    }

    // 10. MOCK INTERVIEW SIMULATOR
    if (query.includes('mock') || query.includes('simulator') || query.includes('start interview') || query.includes('question 1')) {
      return {
        category: 'interview_prep',
        text: `### 🎙️ Mock Technical Interview Initialized!

Welcome to your mock technical interview for **${role}**! I will act as your Lead Engineering Interviewer.

---

#### ❓ Question 1 of 3 (Frontend Architecture & Performance):
> *"Suppose your web application experiences sudden lag when rendering a long list of 10,000 items in React. What techniques would you implement to guarantee 60 FPS scrolling and low DOM memory footprint?"*

---

#### 📝 How to respond:
Type your detailed answer below! You can mention **virtualization/windowing**, **memoization**, **Web Workers**, or **pagination**, and I will grade your answer and ask follow-up questions!`,
      };
    }

    // 11. PROFILE AUDIT & MENTORING
    if (query.includes('audit') || query.includes('profile') || query.includes('improve') || query.includes('review')) {
      const skillsCount = activeResume?.skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0) || 0;
      const expCount = activeResume?.workExperiences.length || 0;

      return {
        category: 'mentoring',
        text: `### 📊 Profile & CV Audit Report for **${name}** (${role})

Here is a breakdown of your current profile strengths and targeted areas for improvement:

#### ✨ Strong Features:
- **Role Positioning**: Clear identity as a **${role}**.
- **Experience Count**: ${expCount} documented work experience section(s).
- **Technical Skills**: ${skillsCount} indexed skills across core engineering areas.

#### 🎯 Top 3 Immediate Action Items to Upgrade Your Profile:
1. **Quantify Achievements**: Ensure every experience bullet includes measurable impact (e.g., *"Reduced API latency by 40%"* or *"Built portal serving 10,000+ monthly active users"*).
2. **Include High-Demand Keywords**: Add modern tools like **Docker, AWS, System Design, GraphQL**, or **CI/CD** if applicable to your stack.
3. **Refine Job Purpose Statement**: Make your professional summary answer *Why you build*, *What value you deliver*, and *Where you excel*.`,
      };
    }

    // 12. JOB PURPOSE & CAREER GOALS
    if (query.includes('job purpose') || query.includes('purpose') || query.includes('goal') || query.includes('career path') || query.includes('transition')) {
      return {
        category: 'job_purpose',
        text: `### 🎯 Defining Your Job Purpose & Strategic Career Alignment

Your **Job Purpose** is the anchor of your career identity. It connects **what you build** with **the business impact you deliver**.

#### 💡 Recommended Purpose Framework for ${role}:
> *"To architect scalable, high-performance web applications and cloud services that solve real business problems, deliver seamless user experiences, and drive measurable software efficiency."*`,
      };
    }

    // 13. DYNAMIC CUSTOM QUERY RESPONSE (FOR ANY TECHNOLOGY OR USER QUESTION)
    return {
      category: 'interview_prep',
      text: `### 💻 Technical Answer & Overview: "${input.trim()}"

Here is a technical overview, key concepts, and code guidance for **${input.trim()}**:

#### 💡 Overview & Key Architectural Concepts:
- **Core Purpose**: **${input.trim()}** provides fundamental building blocks for modern enterprise software engineering.
- **Best Practices**: Focus on modular code design, error handling, performance benchmarking, and clean typing.

#### 💻 Sample Code Implementation:
\`\`\`${query.includes('py') ? 'python' : query.includes('java') ? 'java' : query.includes('sql') ? 'sql' : 'typescript'}
// Example implementation for ${input.trim()}
function executeSolution() {
  console.log("Running technical solution for ${input.trim()}...");
  // Add core logic, error handling, and performance tracking here
  return { status: "success", topic: "${input.trim()}" };
}

executeSolution();
\`\`\`

#### 📌 Interviewer Tip:
When asked about **${input.trim()}** in an interview, be sure to highlight **scalability**, **edge case handling**, and **trade-offs**!

*(Note: Connect your free **Google Gemini API Key** via the top-right Key button to get live generative LLM responses for any complex technical prompt!)*`,
    };
  }
}
