import type { FactoryOutputFormat } from '../types';

export interface AIDepartmentSpec {
  id: string;
  number: number;
  code: string;
  name: string;
  shortName: string;
  buildingPos: [number, number, number];
  checkpointPos: [number, number, number];
  buildingSize: [number, number]; // width (x), depth (z)
  facingAngle: number; // Car yaw angle facing the facility entrance
  prevDeptId: string | null;
  nextDeptId: string | null;
  whatItDoes: string;
  whyNeeded: string;
  howItWorks: string[];
  subProcesses: string[];
  technologies: string[];
  architectureNodes: { title: string; detail: string }[];
  realWorldExample: string;
  exampleInput: string;
  exampleOutput: string;
  liveMetrics: { label: string; value: string }[];
  tourSummary: string;
  routeWaypoints: [number, number][]; // Road path leading smoothly into checkpointPos
}

export const AI_FACTORY_BOUNDS = {
  minX: 90,
  maxX: 266,
  minZ: -90,
  maxZ: 90,
};

export const AI_DEPARTMENTS: AIDepartmentSpec[] = [
  {
    id: 'dept-01',
    number: 1,
    code: '01',
    name: 'DATA COLLECTION GATEWAY',
    shortName: 'Data Collection',
    buildingPos: [104, 0, -22],
    checkpointPos: [117, 0, -22],
    buildingSize: [12, 16],
    facingAngle: -Math.PI / 2,
    prevDeptId: null,
    nextDeptId: 'dept-02',
    whatItDoes:
      'Captures heterogeneous multimodal raw knowledge from enterprise documents, media streams, live APIs, transactional databases, and interactive user prompts into unified intake bays.',
    whyNeeded:
      'Foundation models cannot natively access private company repositories or real-time events without structured collection across disparate formats.',
    howItWorks: [
      'Multi-source intake gateways monitor PDFs, images, text files, audio, video, REST/GraphQL APIs, SQL/NoSQL stores, and user prompt streams.',
      'Each payload receives a cryptographic source fingerprint, MIME classification, and timestamp tag on entry.',
      'Source containers are color-coded by modality and dispatched onto high-speed primary intake conveyors.',
    ],
    subProcesses: ['PDF Documents', 'Images', 'Text Files', 'Audio', 'Video', 'APIs', 'Databases', 'User Prompts'],
    technologies: ['Kafka Event Bus', 'S3 Object Storage', 'Webhook Gateways', 'Debezium CDC', 'Multimodal Collectors'],
    architectureNodes: [
      { title: '8 Source Gateways', detail: 'PDF, Image, Audio, Video, API, DB, Prompt' },
      { title: 'Format Tagger', detail: 'MIME detection + SHA-256 fingerprint' },
      { title: 'Intake Conveyor', detail: 'Queues payloads to Ingestion Terminal' },
    ],
    realWorldExample:
      'A fintech support platform continuously pulls helpdesk PDFs, call recordings, Postgres ticket rows, and live user questions into one intake stream.',
    exampleInput: '{ source: "s3://docs/q4_architecture.pdf", type: "application/pdf", size: "4.8MB" }',
    exampleOutput: '{ job_id: "col_88412", modality: "PDF", priority: "HIGH", status: "QUEUED_FOR_INGESTION" }',
    liveMetrics: [
      { label: 'SOURCES ACTIVE', value: '8 / 8 ONLINE' },
      { label: 'INGESTION RATE', value: '14,280 DOCS/MIN' },
      { label: 'THROUGHPUT', value: '1.84 GB/S' },
    ],
    tourSummary: 'Welcome to Stage 01 right at the Factory Entrance: eight intake chutes capture PDFs, images, audio, video, APIs, databases, and user prompts.',
    routeWaypoints: [
      [104, 0],
      [117, 0],
      [117, -22],
    ],
  },
  {
    id: 'dept-02',
    number: 2,
    code: '02',
    name: 'DATA INGESTION TERMINAL',
    shortName: 'Data Ingestion',
    buildingPos: [112, 0, -64],
    checkpointPos: [112, 0, -49],
    buildingSize: [14, 10],
    facingAngle: Math.PI,
    prevDeptId: 'dept-01',
    nextDeptId: 'dept-03',
    whatItDoes:
      'Orchestrates automated connectors, crawlers, document loaders, batch workers, and streaming pipelines that safely bring raw data inside the AI factory.',
    whyNeeded:
      'Raw external endpoints have rate limits, network flakiness, and mixed throughput patterns; dedicated ingestion decouples extraction from heavy AI compute.',
    howItWorks: [
      'Streaming adapters handle real-time webhook/CDC events with backpressure buffers, while batch workers pull scheduled warehouse snapshots.',
      'Web crawlers respect robots directives, follow canonical links, and snapshot dynamic HTML.',
      'Document loaders and DB connectors normalize payloads into immutable raw staging frames.',
    ],
    subProcesses: ['File Ingestion', 'API Ingestion', 'Database Connectors', 'Web Crawlers', 'Document Loaders', 'Batch Processing', 'Streaming Ingestion'],
    technologies: ['Airbyte', 'LlamaIndex Loaders', 'Firecrawl', 'Apache Spark', 'Redis Streams'],
    architectureNodes: [
      { title: 'Dual Intake Hoppers', detail: 'Batch scheduler + Realtime stream' },
      { title: 'Connector Pool', detail: 'SQL, REST API, File, Web Crawlers' },
      { title: 'Staging Buffer', detail: 'Backpressure-safe event queue' },
    ],
    realWorldExample:
      'Nightly batch jobs sync Confluence wikis and Postgres tables while streaming workers ingest new GitHub PR docs within 3 seconds.',
    exampleInput: 'CONNECTOR_JOB { uri: "https://docs.company.io/v3", mode: "CRAWL+STREAM", depth: 3 }',
    exampleOutput: 'INGEST_FRAME { batch_id: "ing_309", records: 412, latency_ms: 118, status: "READY_TO_CLEAN" }',
    liveMetrics: [
      { label: 'STREAM WORKERS', value: '24 ACTIVE' },
      { label: 'BATCH QUEUE', value: '99.4% SYNCED' },
      { label: 'RETRY RATE', value: '0.12%' },
    ],
    tourSummary: 'Automated connectors, web crawlers, document loaders, batch workers, and stream pipelines channel raw feeds northward.',
    routeWaypoints: [
      [117, -42],
      [112, -49],
    ],
  },
  {
    id: 'dept-03',
    number: 3,
    code: '03',
    name: 'DATA CLEANING & PREPROCESSING',
    shortName: 'Data Cleaning',
    buildingPos: [144, 0, -64],
    checkpointPos: [144, 0, -49],
    buildingSize: [14, 10],
    facingAngle: Math.PI,
    prevDeptId: 'dept-02',
    nextDeptId: 'dept-04',
    whatItDoes:
      'Scrubs duplicate records, strips HTML/boilerplate noise, fixes broken character encodings, handles missing fields, validates schemas, and diverts corrupted files onto the rejection belt.',
    whyNeeded:
      'Garbage-in guarantees hallucinations out: duplicate or corrupted text skews embedding similarity and wastes expensive LLM context tokens.',
    howItWorks: [
      'MinHash / content hashing detects exact and near-duplicate documents and routes repeats out of the main flow.',
      'Noise filters strip navigation headers, tracking pixels, corrupt UTF-8 mojibake, and normalize whitespace/Unicode (NFKC).',
      'Validation gates check mandatory schema fields and extract structured metadata; invalid payloads exit via the crimson Rejection Conveyor.',
    ],
    subProcesses: ['Duplicate Removal', 'Noise Removal', 'Text Normalization', 'Encoding Correction', 'Missing-Value Handling', 'Data Validation', 'Metadata Extraction'],
    technologies: ['Pydantic Validators', 'ftfy Encoding Fix', 'MinHash LSH', 'Presidio PII Scrub', 'Apache Arrow'],
    architectureNodes: [
      { title: 'Deduplication Drum', detail: 'MinHash LSH + SHA-256 check' },
      { title: 'Normalizer & UTF-8', detail: 'NFKC normalization + noise strip' },
      { title: 'Rejection Splitter', detail: 'Corrupt/invalid docs -> Reject Belt' },
    ],
    realWorldExample:
      'Scrubbing 50,000 scraped product manuals removed 31% boilerplate navbars and duplicate mirrored pages before indexing.',
    exampleInput: '"\\xef\\xbb\\xbf  <div>Nav</div>   RAG   Architecture\n\n\n  [DUPLICATE_HASH] "',
    exampleOutput: '{ text: "RAG Architecture", encoding: "UTF-8", noise_removed: "68%", valid: true, tenant: "core" }',
    liveMetrics: [
      { label: 'PASS RATE', value: '88.6% CLEAN' },
      { label: 'REJECTED BELT', value: '11.4% DIVERTED' },
      { label: 'DEDUP SAVED', value: '34% TOKENS' },
    ],
    tourSummary: 'Mechanical scrubbers deduplicate, normalize Unicode, fix encodings, and divert invalid payloads onto the side Rejection Conveyor.',
    routeWaypoints: [
      [128, -46],
      [144, -49],
    ],
  },
  {
    id: 'dept-04',
    number: 4,
    code: '04',
    name: 'DOCUMENT PARSING & OCR BAY',
    shortName: 'Parsing & OCR',
    buildingPos: [176, 0, -64],
    checkpointPos: [176, 0, -49],
    buildingSize: [14, 10],
    facingAngle: Math.PI,
    prevDeptId: 'dept-03',
    nextDeptId: 'dept-05',
    whatItDoes:
      'Laser-scans complex multi-column PDFs, scanned images, embedded financial tables, diagrams, and audio tracks into crisp structured Markdown and transcripts.',
    whyNeeded:
      'Real enterprise knowledge lives inside scanned invoices, multi-column layouts, tables, and meetings—not clean plain-text files.',
    howItWorks: [
      'Layout detectors segment pages into headings, paragraphs, headers/footers, and bounding boxes for tables and figures.',
      'High-precision OCR and vision encoders read photographed receipts, diagrams, and PDF scans preserving row/column table hierarchy.',
      'Automatic Speech Recognition (ASR) transcribes voice/video audio tracks with speaker diarization timestamps.',
    ],
    subProcesses: ['PDF Parsing', 'Document Extraction', 'Table Extraction', 'OCR', 'Image Understanding', 'Speech-to-Text Transcription'],
    technologies: ['Unstructured / Docling', 'PaddleOCR / Surya', 'Whisper v3 ASR', 'Vision-Language Parser', 'PyMuPDF'],
    architectureNodes: [
      { title: 'Laser Layout Detector', detail: 'Identifies headings, figures, columns' },
      { title: 'OCR & Table Gridder', detail: 'Extracts structured Markdown tables' },
      { title: 'ASR Audio Column', detail: 'Whisper speech-to-text transcripts' },
    ],
    realWorldExample:
      'An engineering invoice PDF with tilted scans and nested pricing tables is parsed cleanly into structured JSON rows and Markdown headings.',
    exampleInput: '[BINARY_SCAN_PAGE_04.png] + [audio_briefing.mp3 (02:14)]',
    exampleOutput: '## Q4 Server Capacity\\n| Tier | GPU Count | Latency |\\n| Core | 64x H100 | 18ms |',
    liveMetrics: [
      { label: 'OCR ACCURACY', value: '99.2% CHARS' },
      { label: 'TABLES PARSED', value: '4,820 / HR' },
      { label: 'ASR REALTIME', value: '32x SPEED' },
    ],
    tourSummary: 'Robotic scanning gantries sweep OCR lasers across PDFs, tables, images, and audio waveforms to produce clean structured text.',
    routeWaypoints: [
      [160, -46],
      [176, -49],
    ],
  },
  {
    id: 'dept-05',
    number: 5,
    code: '05',
    name: 'CHUNKING ENGINE',
    shortName: 'Chunking Engine',
    buildingPos: [208, 0, -64],
    checkpointPos: [208, 0, -49],
    buildingSize: [14, 10],
    facingAngle: Math.PI,
    prevDeptId: 'dept-04',
    nextDeptId: 'dept-06',
    whatItDoes:
      'Slices massive parsed documents into retrieval-sized overlapping semantic blocks while attaching hierarchical section metadata to every piece.',
    whyNeeded:
      'Embedding an entire 80-page manual creates diluted vectors and exceeds prompt budgets; smart chunks let semantic search pinpoint exact paragraphs without losing surrounding context.',
    howItWorks: [
      'Fixed-size splitting cuts uniform token windows (e.g., 512 tokens) quickly with configurable overlap.',
      'Recursive splitting respects natural boundaries in priority order: Headings -> Paragraphs -> Sentences.',
      'Semantic chunking measures embedding shifts between sentences so topic boundaries never slice mid-thought, tagging every block with doc_id, section, and overlap metadata.',
    ],
    subProcesses: ['Fixed-Size Chunking', 'Semantic Chunking', 'Recursive Chunking', 'Chunk Overlap', 'Metadata Assignment'],
    technologies: ['RecursiveCharacterSplitter', 'SemanticPercentileSplitter', 'tiktoken BPE', 'MarkdownHeaderParser'],
    architectureNodes: [
      { title: 'Full Doc Feed', detail: '4,800-token structured Markdown' },
      { title: 'Hydraulic Slicer', detail: 'Recursive + Semantic + 15% overlap' },
      { title: 'Metadata Stamp', detail: 'chunk_id, page, section, token_count' },
    ],
    realWorldExample:
      'A 42-page security compliance policy is split into 118 overlapping 400-token semantic chunks tagged with clause numbers.',
    exampleInput: 'DOC: "Multi-Head Attention applies parallel scaled dot-product heads... Feed-Forward layers project..." (1,450 chars)',
    exampleOutput: '[chk_104: 380 chars | overlap: 64 chars | section: "Transformer Core"] -> [chk_105: ...]',
    liveMetrics: [
      { label: 'AVG CHUNK SIZE', value: '412 TOKENS' },
      { label: 'OVERLAP WINDOW', value: '15% (64 TOK)' },
      { label: 'OUTPUT RATE', value: '38,400 CHUNKS/M' },
    ],
    tourSummary: 'The hydraulic Chunking Engine slices long documents into overlapping semantic blocks tagged with section metadata.',
    routeWaypoints: [
      [192, -46],
      [208, -49],
    ],
  },
  {
    id: 'dept-06',
    number: 6,
    code: '06',
    name: 'EMBEDDING GENERATION LAB',
    shortName: 'Embedding Lab',
    buildingPos: [242, 0, -64],
    checkpointPos: [242, 0, -49],
    buildingSize: [14, 10],
    facingAngle: Math.PI,
    prevDeptId: 'dept-05',
    nextDeptId: 'dept-07',
    whatItDoes:
      'Transforms human-language text chunks through deep neural encoder models into high-dimensional numerical vectors where geometric proximity captures semantic meaning.',
    whyNeeded:
      'Computers cannot measure meaning similarity directly on strings; converting text into dense vectors lets vector databases compare concepts mathematically even when exact keywords differ.',
    howItWorks: [
      'Incoming text chunks pass through a configurable bi-encoder Transformer (e.g., text-embedding-3-large, bge-large, voyage-3).',
      'Mean pooling & L2 normalization compress token representations into a fixed 1536D floating-point coordinate.',
      'Related ideas—like "fuel efficiency" and "mileage per gallon"—cluster closely in the 3D vector space.',
    ],
    subProcesses: ['Text Tokenization', 'Bi-Encoder Inference', 'Vector Normalization', 'Semantic Clustering', 'Configurable Embedding Models'],
    technologies: ['OpenAI text-embedding-3-large', 'BAAI/bge-large-en-v1.5', 'Voyage-3', 'ONNX Runtime / TensorRT'],
    architectureNodes: [
      { title: 'Text Chunk Input', detail: 'Tokenized BPE sequence' },
      { title: 'Neural Encoder', detail: 'L2-normalized bi-encoder inference' },
      { title: '1536-D Vector Cloud', detail: '[0.21, -0.48, 0.91, 0.32, ...]' },
    ],
    realWorldExample:
      '"Car runs out of gas" and "Vehicle tank empty emergency" map to cosine similarity 0.91 inside the lab’s cluster cloud despite zero shared words.',
    exampleInput: 'CHUNK chk_104: "Multi-head attention enables the model to jointly attend to information..."',
    exampleOutput: 'VECTOR(1536d): [0.21, -0.48, 0.91, 0.32, -0.14, 0.67, -0.05, ...]',
    liveMetrics: [
      { label: 'DIMENSIONS', value: '1,536 FLOAT32' },
      { label: 'CLUSTER DENSITY', value: '1,600+ POINTS' },
      { label: 'BATCH LATENCY', value: '11.4 MS / 64' },
    ],
    tourSummary: 'Neural encoders project text chunks into dense numerical vectors [0.21, -0.48, 0.91, 0.32, ...], clustering similar meanings in 3D space.',
    routeWaypoints: [
      [224, -46],
      [242, -49],
    ],
  },
  {
    id: 'dept-07',
    number: 7,
    code: '07',
    name: 'VECTOR DATABASE STORAGE',
    shortName: 'Vector Database',
    buildingPos: [242, 0, -24],
    checkpointPos: [228, 0, -24],
    buildingSize: [12, 16],
    facingAngle: Math.PI / 2,
    prevDeptId: 'dept-06',
    nextDeptId: 'dept-08',
    whatItDoes:
      'Stores millions of dense embedding vectors alongside rich JSON metadata, source document references, and HNSW graph indices for millisecond nearest-neighbor retrieval.',
    whyNeeded:
      'Linearly scanning millions of 1536D vectors on every question is too slow; HNSW & IVF-PQ vector indices enable sub-20ms similarity lookups at massive scale.',
    howItWorks: [
      'Each record binds a unique vector_id, the dense embedding array, the raw chunk text, and filterable metadata.',
      'Distributed server nodes maintain Hierarchical Navigable Small World (HNSW) multi-layer proximity graphs.',
      'Dedicated storage engines across Pinecone, Qdrant, Weaviate, and Chroma partition tenants cleanly with scalar payload indices.',
    ],
    subProcesses: ['Vector Records', 'Embedding Storage', 'Metadata Payloads', 'Document References', 'HNSW Vector Indexing', 'Similarity Search', 'Database Retrieval'],
    technologies: ['Pinecone', 'Qdrant', 'Weaviate', 'Chroma', 'HNSW + Product Quantization'],
    architectureNodes: [
      { title: 'HNSW Index Graph', detail: 'Multi-layer navigable proximity tree' },
      { title: '4 Vector Engines', detail: 'Pinecone · Qdrant · Weaviate · Chroma' },
      { title: 'Metadata Vault', detail: 'Filtered doc refs + raw chunk payload' },
    ],
    realWorldExample:
      'Searching 12 million indexed documentation chunks in Qdrant/Pinecone returns the top-5 closest records filtered by tenant="engineering" in 9ms.',
    exampleInput: 'UPSERT { id: "vec_7741", vector: [0.21, -0.48, 0.91, 0.32], meta: { dept: "llm-core" } }',
    exampleOutput: 'INDEXED { shard: "qdrant-east-02", hnsw_edges: 32, commit_ms: 4.2, status: "DURABLE" }',
    liveMetrics: [
      { label: 'STORED VECTORS', value: '12.4M RECORDS' },
      { label: 'INDEX TYPE', value: 'HNSW (EF=128)' },
      { label: 'LOOKUP P99', value: '14.2 MS' },
    ],
    tourSummary: 'Towering server racks running Pinecone, Qdrant, Weaviate, and Chroma index dense vector cubes with HNSW graphs for instant lookup.',
    routeWaypoints: [
      [224, -42],
      [224, -24],
      [228, -24],
    ],
  },
  {
    id: 'dept-08',
    number: 8,
    code: '08',
    name: 'USER QUERY PROCESSING',
    shortName: 'Query Terminal',
    buildingPos: [242, 0, 18],
    checkpointPos: [228, 0, 18],
    buildingSize: [12, 16],
    facingAngle: Math.PI / 2,
    prevDeptId: 'dept-07',
    nextDeptId: 'dept-09',
    whatItDoes:
      'Receives live natural-language questions from end users, expands or cleans ambiguous phrasing, computes the query embedding in real time, and dispatches the search request.',
    whyNeeded:
      'Raw user prompts contain typos, pronouns, and shorthand; preprocessing and matching the exact same embedding space as indexed chunks guarantees high retrieval recall.',
    howItWorks: [
      '1. Captures the Original User Query verbatim and assigns a trace ID.',
      '2. Preprocesses text: spell-normalization, intent routing, and metadata filter extraction.',
      '3. Generates the dense Query Embedding vector using the exact Dept 06 model, then dispatches an authenticated Search Request & streams live Retrieval Status.',
    ],
    subProcesses: ['Original User Query', 'Query Preprocessing', 'Query Embedding Generation', 'Search Request Dispatch', 'Retrieval Status'],
    technologies: ['Query Rewriter LLM', 'HyDE Expansion', 'Bi-Encoder Inference', 'gRPC Search Client'],
    architectureNodes: [
      { title: '1. Query Intake', detail: 'Captures live prompt & session filters' },
      { title: '2. Preprocess + Embed', detail: 'Rewrite + encode into 1536D vector' },
      { title: '3. Search Dispatch', detail: 'Sends Top-K vector + keyword query' },
    ],
    realWorldExample:
      'User types "why did token latency spike?" -> Preprocessed to "LLM inference token generation latency bottlenecks" -> Embedded -> Dispatched to Dept 09.',
    exampleInput: 'USER: "How does the AI Factory retrieve internal docs and execute safe tools?"',
    exampleOutput: 'SEARCH_REQ { query_vec: [0.34, -0.19, 0.87, ...], top_k: 8, status: "DISPATCHED" }',
    liveMetrics: [
      { label: 'QUERY PREPROC', value: '6.1 MS' },
      { label: 'EMBED TIME', value: '18.5 MS' },
      { label: 'PIPELINE MODE', value: 'INTERACTIVE LIVE' },
    ],
    tourSummary: 'The interactive Query Reception Terminal lets you enter a question, watch preprocessing, query embedding, and live search dispatch.',
    routeWaypoints: [
      [224, 0],
      [224, 18],
      [228, 18],
    ],
  },
  {
    id: 'dept-09',
    number: 9,
    code: '09',
    name: 'SEMANTIC SEARCH & RETRIEVAL',
    shortName: 'Semantic Search',
    buildingPos: [242, 0, 58],
    checkpointPos: [228, 0, 50],
    buildingSize: [14, 12],
    facingAngle: Math.PI / 3,
    prevDeptId: 'dept-08',
    nextDeptId: 'dept-10',
    whatItDoes:
      'Scans vector indices using cosine similarity + metadata filters, retrieves top candidates (Top-K), applies cross-encoder reranking, and dispatches winning chunks onward.',
    whyNeeded:
      'Fast approximate vector search gets the top 25 ballpark candidates; neural rerankers score exact query-chunk relevance so only the sharpest facts enter the LLM prompt.',
    howItWorks: [
      'Computes Cosine Similarity cos(q, v) between query embedding q and filtered candidate vectors.',
      'Selects initial Top-K candidates (e.g., K = 20) balancing semantic closeness and metadata constraints (date, access scope).',
      'A precision Cross-Encoder Reranker scores every pair deeply and selects the top 4–5 chunks to stream toward RAG Context Assembly.',
    ],
    subProcesses: ['Vector Similarity', 'Cosine Similarity', 'Top-K Retrieval', 'Metadata Filtering', 'Cross-Encoder Reranking', 'Relevant Document Selection'],
    technologies: ['Cosine ANN Search', 'Cohere Rerank / BGE-Reranker', 'Reciprocal Rank Fusion (RRF)', 'Hybrid BM25 + Vector'],
    architectureNodes: [
      { title: 'Cosine ANN Radar', detail: 'Top-20 candidate scan across HNSW' },
      { title: 'Metadata Gate', detail: 'Tenant + freshness + tag filter' },
      { title: 'Cross-Encoder Rerank', detail: 'Promotes Top-4 highest precision chunks' },
    ],
    realWorldExample:
      'Out of 12M stored chunks, radar scan retrieves 20 candidates; BGE-Reranker boosts exact RAG & Tool Execution docs to scores 0.96 and 0.92.',
    exampleInput: 'QUERY_VEC [0.34, -0.19, ...] + FILTER { status: "verified" }',
    exampleOutput: '[1] chk_402 (cos: 0.95) "RAG Context Assembly..." | [2] chk_819 (cos: 0.91) "Agent Tools..."',
    liveMetrics: [
      { label: 'COSINE SCAN', value: '9.4 MS' },
      { label: 'TOP-K / RERANK', value: 'K=20 -> TOP 4' },
      { label: 'RECALL@5', value: '96.8%' },
    ],
    tourSummary: 'Volumetric search radar sweeps stored vectors with cosine similarity, metadata filters, and reranking to select the highest-scoring chunks.',
    routeWaypoints: [
      [224, 36],
      [228, 50],
    ],
  },
  {
    id: 'dept-10',
    number: 10,
    code: '10',
    name: 'RAG CONTEXT ASSEMBLY PLANT',
    shortName: 'RAG Assembly',
    buildingPos: [208, 0, 64],
    checkpointPos: [208, 0, 49],
    buildingSize: [14, 10],
    facingAngle: 0,
    prevDeptId: 'dept-09',
    nextDeptId: 'dept-11',
    whatItDoes:
      'Fuses system rules, conversation history, the verified user query, and retrieved Top-K knowledge chunks into an authoritative grounded prompt payload for the LLM Core.',
    whyNeeded:
      'Without Retrieval-Augmented Generation (RAG), models rely strictly on frozen training weights; assembling live external evidence grounds answers in real verifiable facts.',
    howItWorks: [
      'Three converging intake manifolds merge: [A] System Safety & Formatting Instructions, [B] Retrieved Chunks with source citations, and [C] User Query.',
      'Context window budgeter deduplicates overlapping snippets, preserves citations ([src:1], [src:2]), and packs tokens under the context ceiling.',
      'The unified grounded prompt surges straight north along the main conduit into the LLM Intelligence Core.',
    ],
    subProcesses: ['System Instruction Binding', 'Chunk Deduplication', 'Citation Grounding Tags', 'Prompt Template Packing', 'Token Budget Enforcement'],
    technologies: ['Jinja / Structured Prompt Compiler', 'Token Budget Optimizer', 'Citation Mapper', 'LangGraph Context Node'],
    architectureNodes: [
      { title: '3 Intake Conduits', detail: 'System Rules + Top-K Docs + User Query' },
      { title: 'Context Turbine', detail: 'Token budget allocation + dedup merge' },
      { title: 'Grounded Prompt Feed', detail: '1,840 tokens -> LLM Neural Reactor' },
    ],
    realWorldExample:
      'Packs 3 retrieved architecture chunks (1,120 tokens) + strict grounding directive + user question inside a structured XML/Markdown prompt block.',
    exampleInput: 'SYS: "Answer using ONLY sources" + CHUNKS(3) + Q: "How does retrieval + safety work?"',
    exampleOutput: '<system>...</system><context>[src:1] ... [src:2] ...</context><user_query>...</user_query>',
    liveMetrics: [
      { label: 'PROMPT TOKENS', value: '1,842 / 128K' },
      { label: 'SOURCES PACKED', value: '4 VERIFIED' },
      { label: 'ASSEMBLY TIME', value: '2.3 MS' },
    ],
    tourSummary: 'Three transparent intake pipes fuse System Instructions, Top-K Retrieved Chunks, and the User Query inside the RAG Context Assembly machine.',
    routeWaypoints: [
      [218, 46],
      [208, 49],
    ],
  },
  {
    id: 'dept-11',
    number: 11,
    code: '11',
    name: 'LLM INTELLIGENCE CORE',
    shortName: 'LLM Core Reactor',
    buildingPos: [170, 0, 0],
    checkpointPos: [158, 0, 0],
    buildingSize: [18, 26],
    facingAngle: Math.PI / 2,
    prevDeptId: 'dept-10',
    nextDeptId: 'dept-12',
    whatItDoes:
      'The colossal neural brain of the factory: runs deep Transformer self-attention and feed-forward inference over input tokens to autoregressively predict each next output token.',
    whyNeeded:
      'Reasoning, synthesis, summarization, coding, and tool orchestration happen inside Transformer blocks that weigh global relationships across the entire context window.',
    howItWorks: [
      'Tokenization & Token Embeddings map text IDs into vectors plus Positional Encoding (RoPE) so word order matters.',
      'Stacked Transformer Layers run Multi-Head Self-Attention (Query-Key-Value dot products) followed by residual MLP Feed-Forward Networks.',
      'Final softmax logits apply Temperature & Top-P sampling to stream next-token predictions continuously down the output pipeline.',
    ],
    subProcesses: [
      'Transformer Architecture',
      'Tokenization',
      'Token Embeddings',
      'Positional Encoding (RoPE)',
      'Self-Attention',
      'Multi-Head Attention',
      'Feed-Forward Networks',
      'Stacked Transformer Layers',
      'Next-Token Prediction',
      'Model Inference',
      'Context Windows',
      'Temperature & Sampling',
    ],
    technologies: ['Decoder-Only Transformer', 'FlashAttention-3', 'KV-Cache Paging', 'RoPE Positional', 'vLLM / TensorRT-LLM'],
    architectureNodes: [
      { title: 'Tokenizer + RoPE', detail: 'BPE IDs + rotary position embeddings' },
      { title: 'N Transformer Blocks', detail: 'Multi-Head Attention -> FFN MLP' },
      { title: 'Logits & Sampler', detail: 'Temp=0.2, Top-P=0.9 next-token stream' },
    ],
    realWorldExample:
      'Over 80 Transformer layers attend across retrieved RAG citations and stream coherent technical answers at 140 tokens/second using KV-caching.',
    exampleInput: 'PROMPT_TOKENS [15496, 892, ...] (1,842 tokens | Context: 128k | Temp: 0.2)',
    exampleOutput: 'STREAM: "Retrieval pulls Top-K vectors [src:1], assembles grounded context..." (214 output tokens)',
    liveMetrics: [
      { label: 'THROUGHPUT', value: '142 TOKENS / SEC' },
      { label: 'ATTENTION HEADS', value: '64 HEADS · 80 LAYERS' },
      { label: 'TEMPERATURE', value: '0.20 (GROUNDED)' },
    ],
    tourSummary: 'Drive directly inside the Glass Observation Tunnel beneath the towering LLM Neural Reactor to watch Multi-Head Attention & token generation live!',
    routeWaypoints: [
      [152, 46],
      [144, 24],
      [144, 0],
      [158, 0],
    ],
  },
  {
    id: 'dept-12',
    number: 12,
    code: '12',
    name: 'AI AGENT & TOOL EXECUTION CENTER',
    shortName: 'AI Agent Hub',
    buildingPos: [176, 0, 64],
    checkpointPos: [176, 0, 49],
    buildingSize: [14, 10],
    facingAngle: 0,
    prevDeptId: 'dept-11',
    nextDeptId: 'dept-13',
    whatItDoes:
      'Empowers the LLM to act beyond static text: planning multi-step tasks, selecting structured external tools (APIs, DB queries, functions, web search), observing results, and iterating.',
    whyNeeded:
      'Pure text models cannot execute live SQL queries, call booking/payment APIs, or browse fresh web states without deterministic tool-calling feedback loops.',
    howItWorks: [
      'Reasoning Core inspects the goal and decides whether to reply directly or emit a structured JSON Tool Call.',
      'Robotic Tool Stations execute API requests, Database queries, Code/Function calls, or Search/Browser lookups in sandboxed runners.',
      'Tool Observations feed right back into the Agent planning loop across collaborative agent stations until the task goal is verified complete.',
    ],
    subProcesses: ['Tool Calling', 'API Requests', 'Database Queries', 'Function Execution', 'Browser / Search Tools', 'Planning', 'Action Execution', 'Tool Responses', 'Agent Feedback Loops', 'Multi-Agent Handoff'],
    technologies: ['Function Calling JSON', 'ReAct Reason-Act Loop', 'MCP Tool Servers', 'LangGraph State Machine'],
    architectureNodes: [
      { title: 'Planner Station', detail: 'Reason -> Decide tool vs direct reply' },
      { title: 'Robotic Tool Docks', detail: 'API · DB Query · Search · Code Exec' },
      { title: 'Observation Loop', detail: 'Feeds tool output back to Reasoner' },
    ],
    realWorldExample:
      'Customer asks for order ETA -> Agent calls `query_orders_db(id)` + `track_carrier_api()` -> observes live shipping status -> synthesizes verified answer.',
    exampleInput: 'THOUGHT: "Need live pipeline metrics." -> CALL: fetch_telemetry(dept="all", window="5m")',
    exampleOutput: 'OBSERVATION: { error_rate: "0.08%", p95_ms: 412 } -> ACTION: PASS_TO_VALIDATION',
    liveMetrics: [
      { label: 'ROBOTIC STATIONS', value: '4 TOOL BAYS' },
      { label: 'AGENT LOOP STEPS', value: 'AVG 2.4 TURNS' },
      { label: 'TOOL SUCCESS', value: '99.6%' },
    ],
    tourSummary: 'Robotic agent stations pick APIs, SQL queries, functions, and search tools in a live Reason -> Tool -> Observation feedback loop.',
    routeWaypoints: [
      [186, 0],
      [196, 0],
      [196, 46],
      [176, 49],
    ],
  },
  {
    id: 'dept-13',
    number: 13,
    code: '13',
    name: 'VALIDATION & SAFETY QC LAB',
    shortName: 'Safety & QC',
    buildingPos: [148, 0, 64],
    checkpointPos: [148, 0, 49],
    buildingSize: [14, 10],
    facingAngle: 0,
    prevDeptId: 'dept-12',
    nextDeptId: 'dept-14',
    whatItDoes:
      'Audits generated AI outputs through strict JSON schema validation, hallucination/grounding verification against RAG sources, safety & moderation filters, and automated retry loops.',
    whyNeeded:
      'Production AI cannot ship ungrounded claims, malformed JSON, leaked PII, or unsafe completions; deterministic QC guardrails catch failures before users see them.',
    howItWorks: [
      'Schema & Structured JSON gates verify strict types and required keys via Pydantic / JSON Schema.',
      'Faithfulness & Grounding evaluators cross-check every factual claim against the Dept 09 retrieved chunks to block hallucinations.',
      'Safety moderation filters screen toxicity/policy violations; any failed output reverses down the red Retry Loop pipe back to the LLM Core for self-correction.',
    ],
    subProcesses: ['Output Validation', 'Structured JSON Validation', 'Hallucination Checks', 'Grounding Checks', 'Safety Filters', 'Content Moderation', 'Error Handling', 'Retry Mechanisms'],
    technologies: ['NeMo Guardrails', 'JSON Schema / Zod', 'RAGAS Faithfulness Check', 'LlamaGuard Moderation'],
    architectureNodes: [
      { title: 'Gate 1: JSON Schema', detail: 'Validates types, keys, syntax' },
      { title: 'Gate 2: Grounding', detail: 'Verifies claims vs retrieved chunks' },
      { title: 'Gate 3: Safety + Retry', detail: 'Moderation check or loop back to Core' },
    ],
    realWorldExample:
      'If an LLM drafts a response citing a metric missing from context sources, Grounding Gate rejects it and triggers an automatic constrained retry.',
    exampleInput: 'CANDIDATE: { answer: "...", citations: ["chk_402"], schema_v: 2 }',
    exampleOutput: 'QC_VERDICT: { schema: "PASS", grounded: "0.98", safety: "SAFE", action: "APPROVE" }',
    liveMetrics: [
      { label: 'GROUNDING SCORE', value: '98.7% VERIFIED' },
      { label: 'RETRY LOOP RATE', value: '1.9% AUTO-FIXED' },
      { label: 'POLICY BLOCKS', value: '100% ENFORCED' },
    ],
    tourSummary: 'Triple laser gates validate JSON structure, grounding against sources, and safety filters—routing rejected drafts back via the Retry Loop.',
    routeWaypoints: [
      [162, 46],
      [148, 49],
    ],
  },
  {
    id: 'dept-14',
    number: 14,
    code: '14',
    name: 'FINAL RESPONSE GENERATION',
    shortName: 'Final Output',
    buildingPos: [122, 0, 64],
    checkpointPos: [122, 0, 49],
    buildingSize: [14, 10],
    facingAngle: 0,
    prevDeptId: 'dept-13',
    nextDeptId: 'dept-15',
    whatItDoes:
      'Formats, renders, and dispatches the certified AI response across Natural Language, strict JSON, runnable Code, concise Summaries, Structured Data tables, or synthesized Audio.',
    whyNeeded:
      'Different client apps consume intelligence differently—from streaming chat UI and TTS voice assistants to automated microservices expecting clean JSON.',
    howItWorks: [
      'Validated token streams enter multi-format serializers (Markdown prose, AST-checked Code, JSON payloads, or Executive Summaries).',
      'Optional Neural Text-to-Speech converts finalized text into streaming low-latency audio packets.',
      'Certified deliverables render on the giant Holographic Production Screen and ride the glowing Exit Dispatch Conveyor out of the factory.',
    ],
    subProcesses: ['Natural Language', 'JSON Payload', 'Code Synthesis', 'Summaries', 'Structured Data', 'Audio TTS', 'Exit Dispatch Conveyor'],
    technologies: ['SSE Streaming', 'Structured Outputs', 'Neural TTS', 'Syntax Formatters'],
    architectureNodes: [
      { title: 'Format Serializer', detail: 'Prose · JSON · Code · Summary · Audio' },
      { title: 'Holo Cinema Wall', detail: 'Live certified production preview' },
      { title: 'Dispatch Conveyor', detail: 'Delivers finished AI artifact outside' },
    ],
    realWorldExample:
      'The exact same grounded AI synthesis delivers streaming chat prose to a user UI while emitting a structured JSON webhook to analytics.',
    exampleInput: 'CERTIFIED_SYNTHESIS { tokens: 214, format: "MULTI_MODAL_DISPATCH" }',
    exampleOutput: 'FINAL_RESPONSE -> Delivered in 412ms with verified citations & structured payload!',
    liveMetrics: [
      { label: 'OUTPUT FORMATS', value: '6 SUPPORTED' },
      { label: 'TTFT STREAM', value: '185 MS' },
      { label: 'DELIVERIES/MIN', value: '3,410 FINISHED' },
    ],
    tourSummary: 'The massive Holographic Screen renders validated responses in Natural Language, JSON, Code, Summaries, or Audio and ships them out.',
    routeWaypoints: [
      [135, 46],
      [122, 49],
    ],
  },
  {
    id: 'dept-15',
    number: 15,
    code: '15',
    name: 'MONITORING & EVALUATION OPS',
    shortName: 'Monitoring & Eval',
    buildingPos: [98, 0, 60],
    checkpointPos: [104, 0, 46],
    buildingSize: [12, 12],
    facingAngle: -0.45,
    prevDeptId: 'dept-14',
    nextDeptId: 'dept-01',
    whatItDoes:
      'Monitors every AI stage continuously: token economics, latency budgets, retrieval accuracy, error rates, model benchmarks, user feedback, and distributed trace logs.',
    whyNeeded:
      'AI systems degrade silently when data drifts or prompts change; end-to-end observability and automated evals keep quality, safety, and cost continuously optimized.',
    howItWorks: [
      'OpenTelemetry trace pipes stream span durations, input/output token counts, and error codes from all 14 preceding departments.',
      'Automated evaluation runners score retrieval Recall@K, answer faithfulness, and thumbs-up/down user feedback.',
      'Live telemetry spires trigger alerts when latency climbs or grounding drops, feeding improvements back into Collection & Chunking.',
    ],
    subProcesses: ['Token Usage', 'Input/Output Tokens', 'Processing Latency', 'Retrieval Accuracy', 'Error Rates', 'Model Performance', 'User Feedback', 'Evaluation Metrics', 'Logs & Traces'],
    technologies: ['OpenTelemetry', 'Langfuse / Arize Phoenix', 'RAGAS Eval Suite', 'Prometheus + Grafana'],
    architectureNodes: [
      { title: '15-Dept Trace Hub', detail: 'Distributed spans across every stage' },
      { title: 'Telemetry Towers', detail: 'Token cost, p95 latency, error alarms' },
      { title: 'Eval Feedback Loop', detail: 'Continuous dataset & prompt tuning' },
    ],
    realWorldExample:
      'Ops team spots a retrieval precision dip on newly ingested API docs, adjusts Dept 05 chunk overlap from 10% to 15%, and sees Faithfulness jump +9%.',
    exampleInput: 'TRACE_SPAN { trace_id: "ai_9921", in_tok: 1842, out_tok: 214, total_ms: 412, feedback: "+1" }',
    exampleOutput: 'EVAL_REPORT: { faithfulness: 0.98, retrieval_precision: 0.96, p95_latency: "418ms", error: "0.08%" }',
    liveMetrics: [
      { label: 'IN / OUT TOKENS', value: '1,842 / 214' },
      { label: 'END-TO-END P95', value: '418 MS' },
      { label: 'EVAL SCORE', value: '97.4% PASS' },
    ],
    tourSummary: 'The Operations Citadel closes the full loop at South-West Corner, tracking token usage, latency, retrieval accuracy, error rates, and full trace logs.',
    routeWaypoints: [
      [112, 46],
      [104, 46],
    ],
  },
];

export const AI_DEPARTMENT_MAP: Record<string, AIDepartmentSpec> = Object.fromEntries(
  AI_DEPARTMENTS.map((d) => [d.id, d])
);

export interface PipeConnection {
  id: string;
  points: [number, number, number][];
  color: string;
  radius?: number;
}

// Physical transparent overhead & inter-department conduit pipes linking Depts 01 -> 15 + feedback loops
export const AI_PIPELINE_CONDUITS: PipeConnection[] = [
  // 01 (Entrance Left) -> 02 (NW Corner) -> 03 -> 04 -> 05 -> 06 (NE Corner)
  { id: 'pipe-01-02', points: [[104, 4.4, -30], [106, 6.2, -46], [112, 4.4, -59]], color: '#ef4444', radius: 0.26 },
  { id: 'pipe-02-03', points: [[119, 4.2, -62], [128, 5.2, -62], [137, 4.2, -62]], color: '#f97316' },
  { id: 'pipe-03-04', points: [[151, 4.2, -62], [160, 5.2, -62], [169, 4.2, -62]], color: '#ef4444' },
  { id: 'pipe-04-05', points: [[183, 4.2, -62], [192, 5.2, -62], [201, 4.2, -62]], color: '#f97316' },
  { id: 'pipe-05-06', points: [[215, 4.2, -62], [225, 5.2, -62], [235, 4.2, -62]], color: '#ef4444' },
  // 06 -> 07 -> 08 -> 09 (East Vector & Search Corridor)
  { id: 'pipe-06-07', points: [[242, 4.2, -57], [244, 5.8, -42], [242, 4.2, -31]], color: '#f97316' },
  { id: 'pipe-07-08', points: [[242, 4.4, -15], [245, 5.8, 0],   [242, 4.4, 9]],   color: '#ef4444' },
  { id: 'pipe-08-09', points: [[242, 4.4, 27],  [244, 5.5, 42],  [242, 4.2, 51]],  color: '#f97316' },
  // 09 -> 10 (South Retrieval Wing)
  { id: 'pipe-09-10', points: [[234, 4.2, 60], [224, 5.2, 62], [215, 4.2, 62]], color: '#ef4444' },
  // 10 -> 11 (Grand RAG Feed arching high straight into LLM Reactor Core)
  { id: 'pipe-10-11', points: [[204, 4.8, 59], [192, 8.6, 32], [174, 7.2, 12]], color: '#fb923c', radius: 0.32 },
  // 11 -> 12 (LLM Core to AI Agents Hub)
  { id: 'pipe-11-12', points: [[170, 6.8, 12], [173, 8.2, 34], [176, 4.6, 57]], color: '#ef4444', radius: 0.28 },
  // 12 -> 13 -> 14 -> 15 (Agents -> QC -> Output -> Ops)
  { id: 'pipe-12-13', points: [[169, 4.2, 62], [162, 5.2, 62], [155, 4.2, 62]], color: '#f97316' },
  { id: 'pipe-13-14', points: [[141, 4.2, 62], [135, 5.2, 62], [129, 4.2, 62]], color: '#ef4444' },
  { id: 'pipe-14-15', points: [[115, 4.2, 62], [110, 5.2, 62], [104, 4.2, 60]], color: '#fbbf24' },
  // Feedback & Retry Loop (13 -> 11 High Overhead Return Arch)
  { id: 'pipe-13-11-retry', points: [[148, 6.0, 58], [156, 11.2, 32], [164, 9.0, 10]], color: '#fb7185', radius: 0.22 },
  // Ops Monitoring Spire Link (15 <-> 11 Core Reactor)
  { id: 'pipe-15-11-ops', points: [[102, 7.2, 54], [132, 12.2, 26], [162, 10.5, 4]], color: '#f59e0b', radius: 0.22 },
];

export interface LiveQuerySimulation {
  originalQuery: string;
  preprocessedQuery: string;
  detectedIntents: string[];
  queryVector: number[];
  retrievedChunks: { id: string; source: string; score: number; snippet: string }[];
  outputsByFormat: Record<FactoryOutputFormat, string>;
}

export function runLiveQuerySimulation(rawQuery: string): LiveQuerySimulation {
  const clean = rawQuery.trim() || 'How does the AI Factory retrieve internal docs and execute safe tools?';
  const words = clean.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const hashSeed = words.reduce((acc, w, idx) => acc + w.charCodeAt(0) * (idx + 7), 137);

  // Deterministic pseudo-embedding for interactive preview
  const queryVector = Array.from({ length: 8 }, (_, i) => {
    const val = Math.sin(hashSeed * 0.13 + i * 1.47) * 0.92;
    return Number(val.toFixed(2));
  });

  const intents: string[] = [];
  if (/vector|search|retriev|rag|embed|doc|chunk/.test(clean.toLowerCase())) intents.push('RAG_RETRIEVAL');
  if (/tool|agent|api|db|search|exec/.test(clean.toLowerCase())) intents.push('AGENT_TOOL_USE');
  if (/safe|valid|hallucin|json|guard/.test(clean.toLowerCase())) intents.push('SAFETY_QC');
  if (/llm|token|attention|transformer|model/.test(clean.toLowerCase())) intents.push('LLM_INFERENCE');
  if (intents.length === 0) intents.push('GENERAL_AI_PIPELINE');

  const preprocessedQuery = words.filter((w) => !['the', 'a', 'an', 'is', 'does', 'how', 'to', 'what'].includes(w)).join(' ') || clean;

  const retrievedChunks = [
    {
      id: 'chk_09_402',
      source: 'architecture/rag_retrieval_spec.md',
      score: 0.95,
      snippet: 'Cosine ANN search retrieves Top-20 HNSW vectors; cross-encoder reranking promotes Top-4 grounded snippets to RAG Context Assembly.',
    },
    {
      id: 'chk_11_819',
      source: 'core/transformer_attention.md',
      score: 0.91,
      snippet: 'Multi-Head Self-Attention processes packed prompt tokens [System + Sources + User Query] to generate grounded next-token logits.',
    },
    {
      id: 'chk_12_305',
      source: 'agents/tool_validation_loop.md',
      score: 0.88,
      snippet: 'Agents select deterministic API/DB tools, validate schemas & grounding in Dept 13 QC, and retry if unsupported claims appear.',
    },
  ];

  const outputsByFormat: Record<FactoryOutputFormat, string> = {
    text: `Based on retrieved specs [chk_09_402, chk_11_819, chk_12_305], your query ("${clean}") is normalized, embedded into a 1536-D vector ([${queryVector.slice(0, 4).join(', ')}...]), matched via HNSW cosine search + cross-encoder reranking, fused into a grounded prompt inside Dept 10, reasoned across Transformer Multi-Head Attention in the Dept 11 LLM Core, optionally routed to API/DB tools in Dept 12, and verified in Dept 13 QC before dispatch.`,
    json: JSON.stringify(
      {
        status: 'VERIFIED',
        query: clean,
        intents,
        embedding_preview: queryVector,
        top_k_sources: retrievedChunks.map((c) => ({ id: c.id, score: c.score })),
        llm_tokens: { prompt: 1842, completion: 168, temperature: 0.2 },
        safety_qc: { json_valid: true, grounded_score: 0.98 },
      },
      null,
      2
    ),
    code: `async function runAIPipeline(query: string) {\n  const vec = await embedModel.encode(normalize(query));\n  const topK = await vectorDB.cosineSearch(vec, { k: 20, filter: { verified: true } });\n  const reranked = await reranker.selectTop(query, topK, 4);\n  const draft = await llmCore.generate({ system: GROUNDED_RULES, context: reranked, query });\n  return safetyQC.verifyGrounding(draft, reranked);\n}`,
    summary: `• Query Preprocessed & Embedded -> Vector [${queryVector.slice(0, 4).join(', ')}]\n• Semantic Search & Rerank selected 3 chunks (Top Cosine: 0.95)\n• RAG Context + LLM Core generated grounded synthesis at 142 tok/s\n• Dept 13 QC verified 98% source grounding with zero policy flags`,
    audio: `🔊 VOICE STREAM READY (Neural TTS · 24kHz PCM · 6.4s): "To answer '${clean}', the Semantic Search Engine retrieved three verified architecture chunks with 0.95 similarity, grounded the Transformer prompt, and verified zero hallucinations."`,
  };

  return {
    originalQuery: clean,
    preprocessedQuery,
    detectedIntents: intents,
    queryVector,
    retrievedChunks,
    outputsByFormat,
  };
}

