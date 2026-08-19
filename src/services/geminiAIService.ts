import type { ResumeData } from '../types/resume';

export interface GeminiMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'apply_summary';
    payload: string;
    label: string;
  };
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  model: string;
  persona: string;
  messages: GeminiMessage[];
}

export interface AIPersona {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
}

export const AI_MODELS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', badge: 'Fast & Live', desc: 'Optimal speed & intelligence for interview coding and chat' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', badge: 'Next-Gen LLM', desc: 'Latest generation model with high reasoning' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', badge: 'Complex Reasoning', desc: 'Best for deep system design & complex code' },
];

const MASTER_AI_INSTRUCTION = `
You are an advanced, articulate, highly intelligent AI Software Architect & Technical Coach.
When answering ANY developer prompt or technical question:

1. 📖 **Definition & Core Concept**:
   - Provide a clear, authoritative technical definition explaining *what it is*.
2. 🎯 **Use Cases & Business Purpose**:
   - Explain *for which purpose we use it*, real-world engineering problems it solves, and why developers choose it.
3. 💻 **Production Code & Practical Example**:
   - Provide complete, runnable code in fenced code blocks (\`\`\`python ... \`\`\` or \`\`\`typescript ... \`\`\`) with comments.
4. 🎙️ **Interview Cracking & Senior Engineer Key Takeaways**:
   - Highlight how to articulate this answer in technical interviews, Big-O time/space complexity, and architecture trade-offs.

CRITICAL CONDITIONAL RULE FOR CLOUD:
- Include AWS / Azure cloud deployment details and RAG processes ONLY IF the user explicitly asks about Cloud, AWS, Azure, Infrastructure, DevOps, or RAG! Otherwise, keep the response focused directly on the exact question asked.
`;

export const AI_PERSONAS: AIPersona[] = [
  {
    id: 'interview_coach',
    name: 'Technical Interview Coach',
    icon: '🎙️',
    description: 'Guides candidates to crack software engineering & system design interviews.',
    systemPrompt: `You are an elite Technical Interview Coach and Lead Engineer.${MASTER_AI_INSTRUCTION}`,
  },
  {
    id: 'code_assistant',
    name: 'Software Architect & Code Assistant',
    icon: '🧑‍💻',
    description: 'Generates production-grade code, refactors, and explains software architecture.',
    systemPrompt: `You are a Lead Software Architect & Coding Expert.${MASTER_AI_INSTRUCTION}`,
  },
  {
    id: 'system_architect',
    name: 'System Design Architect',
    icon: '🧠',
    description: 'Designs scalable cloud architectures (AWS/Azure), microservices, and databases.',
    systemPrompt: `You are a Principal Cloud & System Architect.${MASTER_AI_INSTRUCTION}`,
  },
  {
    id: 'cv_strategist',
    name: 'CV Creator & Interview Positioning',
    icon: '📄',
    description: 'Crafts ATS resumes, Job Purpose statements, and interview introduction strategy.',
    systemPrompt: `You are an Executive Resume Writer & Technical HR Strategist.${MASTER_AI_INSTRUCTION}`,
  },
];

export class GeminiAIService {
  /**
   * Helper to check if a Gemini API Key is configured in .env or localStorage
   */
  static getEffectiveApiKey(customApiKey?: string): string {
    return (
      customApiKey?.trim() ||
      (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim() ||
      localStorage.getItem('gemini_api_key')?.trim() ||
      ''
    );
  }

  /**
   * Send multi-turn messages directly to Google Gemini REST API or use local fallback
   */
  static async generateAIResponse(
    messages: GeminiMessage[],
    userPrompt: string,
    modelId: string = 'gemini-1.5-flash',
    personaId: string = 'interview_coach',
    activeResume?: ResumeData | null,
    apiKey?: string
  ): Promise<GeminiMessage> {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const effectiveApiKey = this.getEffectiveApiKey(apiKey);
    const selectedPersona = AI_PERSONAS.find((p) => p.id === personaId) || AI_PERSONAS[0];

    // Direct Google Gemini API Call if key is present
    if (effectiveApiKey && effectiveApiKey.length > 5) {
      try {
        const geminiText = await this.callGeminiAPI(
          messages,
          userPrompt,
          modelId,
          selectedPersona.systemPrompt,
          activeResume,
          effectiveApiKey
        );

        if (geminiText) {
          let suggestedAction: GeminiMessage['suggestedAction'] = undefined;
          if (geminiText.toLowerCase().includes('summary') && geminiText.length < 500 && !geminiText.includes('```')) {
            suggestedAction = {
              type: 'apply_summary',
              payload: geminiText.replace(/^#+.*$/gm, '').trim(),
              label: 'Apply Summary to Resume',
            };
          }

          return {
            id: `msg-${Date.now()}`,
            role: 'model',
            text: geminiText,
            timestamp,
            suggestedAction,
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed:', err);
      }
    }

    // Direct Answer Fallback Engine when offline
    const fallbackText = this.generateDirectFallback(userPrompt);

    return {
      id: `msg-${Date.now()}`,
      role: 'model',
      text: fallbackText,
      timestamp,
    };
  }

  /**
   * Gemini REST API HTTP Request
   */
  private static async callGeminiAPI(
    messages: GeminiMessage[],
    userPrompt: string,
    modelId: string,
    systemInstruction: string,
    activeResume: ResumeData | null | undefined,
    apiKey: string
  ): Promise<string | null> {
    const resumeContext = activeResume
      ? `\nCANDIDATE PROFILE CONTEXT:\nName: ${activeResume.personalInfo.fullName}\nTitle: ${activeResume.personalInfo.jobTitle}\nSkills: ${activeResume.skillCategories.flatMap((c) => c.skills).join(', ')}`
      : '';

    const systemText = `${systemInstruction}${resumeContext}`;

    const formattedContents = [
      {
        role: 'user',
        parts: [{ text: systemText }],
      },
      ...messages.slice(-10).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ];

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: formattedContents }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
      throw new Error(errMsg);
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  }

  /**
   * Generates a direct technical answer for offline / fallback mode
   */
  private static generateDirectFallback(prompt: string): string {
    const q = prompt.toLowerCase().trim();
    const isCloudRequested = q.includes('cloud') || q.includes('aws') || q.includes('azure') || q.includes('rag') || q.includes('devops');

    // 1. REACT
    if (q.includes('react')) {
      let text = `### 📖 1. Definition & Core Concept
**React** (developed by Meta) is an open-source, component-based JavaScript library designed for building fast, interactive user interfaces for single-page web applications (SPAs). It uses a declarative programming paradigm and a Virtual DOM to efficiently update and render components.

### 🎯 2. Use Cases & Business Purpose
- **Single Page Applications (SPAs)**: Building dynamic dashboards, SaaS platforms, and interactive web tools.
- **Reusable Component Libraries**: Creating consistent UI design systems across engineering teams.
- **Efficient DOM Updates**: Minimizing expensive DOM mutations via Virtual DOM reconciliation.

### 💻 3. Production Code & Practical Example
\`\`\`tsx
import React, { useState, useEffect, useCallback } from 'react';

interface UserProps {
  userId: string;
}

export const UserCard: React.FC<UserProps> = ({ userId }) => {
  const [user, setUser] = useState<{ name: string; title: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(\`/api/users/\${userId}\`);
      const data = await res.json();
      setUser(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return <div className="animate-pulse">Loading profile...</div>;
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white">
      <h3 className="font-bold text-indigo-400">{user?.name}</h3>
      <p className="text-xs text-slate-400">{user?.title}</p>
    </div>
  );
};
\`\`\`

### 🎙️ 4. Interview Cracking & Senior Engineer Key Takeaways
- **Virtual DOM & Reconciliation**: Explain how React heuristic diffing works in O(n) time using element types and unique \`key\` props.
- **Fiber Architecture**: Mention how React Fiber enables async interruptible rendering and priority scheduling for smooth 60 FPS UI.`;

      if (isCloudRequested) {
        text += `\n\n### ☁️ 5. Cloud (AWS / Azure) & RAG Integration
- **AWS Deployment**: Built production static assets (\`dist/\`) are hosted on **Amazon S3** and delivered globally with low latency via **Amazon CloudFront CDN**.
- **Azure Deployment**: Hosted on **Azure Static Web Apps** with integrated GitHub Actions CI/CD.
- **RAG Integration**: React acts as the frontend interface sending prompts via REST/SSE streaming to backend Vector Search RAG endpoints (Pinecone / AWS Bedrock).`;
      }

      return text;
    }

    // 2. PYTHON
    if (q.includes('python')) {
      let text = `### 📖 1. Definition & Core Concept
**Python** is a high-level, interpreted programming language known for clean readable syntax, dynamic typing, and dominance in Data Science, Machine Learning, Web Backend APIs, and DevOps automation.

### 🎯 2. Use Cases & Business Purpose
- **AI & Machine Learning**: Neural networks, NLP, and RAG pipelines via PyTorch, TensorFlow, and LangChain.
- **Async Web Backends**: Building high-speed REST APIs using FastAPI, Django, and Flask.
- **DevOps & Scripting**: Automation, data ingestion pipelines (ETL), and cloud scripting.

### 💻 3. Production Code & Practical Example
\`\`\`python
import asyncio
import time
from functools import wraps

def measure_runtime(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = await func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"⏱️ '{func.__name__}' completed in {elapsed:.4f}s")
        return result
    return wrapper

@measure_runtime
async def fetch_api_data(task_id: int):
    await asyncio.sleep(1.0)
    return {"task_id": task_id, "status": "completed"}

async def main():
    results = await asyncio.gather(fetch_api_data(101), fetch_api_data(102))
    print(results)

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

### 🎙️ 4. Interview Cracking & Senior Engineer Key Takeaways
- **GIL (Global Interpreter Lock)**: Explain why CPython uses a mutex for thread safety and how AsyncIO / Multiprocessing bypass CPU bottlenecks.
- **Decorators & Closures**: Explain higher-order functions and how \`@wraps\` preserves function metadata.`;

      if (isCloudRequested) {
        text += `\n\n### ☁️ 5. Cloud (AWS / Azure) & RAG Integration
- **AWS & Azure**: Deployed on **AWS Lambda** / **Azure Functions** for serverless event handling, or containerized on **AWS ECS / Azure App Service**.
- **RAG Integration**: Python serves as the primary language for LangChain / LlamaIndex pipelines querying vector stores (Pinecone / ChromaDB / AWS Bedrock).`;
      }

      return text;
    }

    // 3. AWS / AZURE / CLOUD
    if (isCloudRequested) {
      return `### 📖 1. Definition & Core Concept
**Cloud Infrastructure (AWS & Azure)** provides on-demand computing power, storage, networking, database management, and AI services over the internet with pay-as-you-go pricing.

### 🎯 2. Use Cases & Business Purpose
- **Serverless & Microservices Auto-Scaling**: Scaling applications automatically to millions of requests.
- **High Availability & Disaster Recovery**: Multi-region availability ensuring 99.999% uptime.
- **Generative AI & Data Lakes**: Storing raw enterprise data and running vector search / RAG foundation models.

### 💻 3. Production Code & Practical Example
\`\`\`python
import boto3

# AWS Boto3 SDK: Uploading asset to Amazon S3 Bucket
s3_client = boto3.client('s3', region_name='us-east-1')

def upload_to_s3(file_path: str, bucket: str, key: str):
    s3_client.upload_file(file_path, bucket, key)
    print(f"✅ Asset {key} deployed successfully to S3!")

upload_to_s3("./dist/bundle.js", "my-cloud-bucket", "v1/bundle.js")
\`\`\`

### ☁️ 4. Cloud (AWS / Azure) & RAG Architecture
- **AWS**: S3 (Storage), ECS/Lambda (Compute), DynamoDB (NoSQL), CloudFront (CDN), AWS Bedrock (RAG & AI).
- **Azure**: Blob Storage, App Service/AKS, Cosmos DB, Azure OpenAI Service + Azure AI Search.

### 🎙️ 5. Interview Cracking Strategy
- Explain IaaS (EC2) vs PaaS (App Service) vs Serverless (Lambda).
- Discuss cost optimization, multi-region redundancy, and security IAM roles.`;
    }

    // 4. DEFAULT DYNAMIC DIRECT RESPONSE
    return `### 📖 1. Definition & Core Concept
**${prompt.trim()}** represents key technical principles and software design patterns for building modern, high-throughput software systems.

### 🎯 2. Use Cases & Business Purpose
- Enterprise application development, microservices architecture, and system reliability.
- Improving code maintainability, execution speed, and modular engineering standards.

### 💻 3. Production Code & Practical Example
\`\`\`typescript
// Production code pattern for ${prompt.trim()}
export function executeModule() {
  console.log("Executing module for: ${prompt.trim()}");
  return { status: "success", topic: "${prompt.trim()}", timestamp: new Date().toISOString() };
}

executeModule();
\`\`\`

### 🎙️ 4. Interview Cracking & Senior Engineer Key Takeaways
- Highlight **system scalability**, **defensive error handling**, **Big-O complexity**, and **architecture trade-offs** during technical interviews.`;
  }
}
