import { SkillSeedData } from "../../types";

export const websocketsSeed: SkillSeedData = {
  skills: [
    {
      skillName: "WebSockets",
      skillNormalized: "websockets",
      aliases: ["socket.io", "ws"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which browser API establishes a WebSocket connection?",
        options: ["new WebSocket(url)", "fetch(url)", "EventSource", "XMLHttpRequest"],
        correctAnswer: "new WebSocket(url)",
        explanation:
          "Calling new WebSocket('wss://example.com/socket') opens a bidirectional TCP connection.",
      },
      associatedSkills: ["websockets"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which protocol prefix indicates an encrypted WebSocket?",
        options: ["wss://", "ws://", "httpsws://", "tcp://"],
        correctAnswer: "wss://",
        explanation:
          "wss:// is the secure WebSocket protocol (TLS); ws:// is unencrypted.",
      },
      associatedSkills: ["websockets"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which event handler listens for incoming messages in the browser?",
        options: ["socket.onmessage = (event) => {}", "socket.addEvent('message')", "socket.on('data')", "socket.message()"],
        correctAnswer: "socket.onmessage = (event) => {}",
        explanation:
          "Browser WebSocket instances fire message events containing event.data.",
      },
      associatedSkills: ["websockets"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Node.js library provides a low-level WebSocket server?",
        options: ["ws", "socket.io", "express-ws", "koa-ws"],
        correctAnswer: "ws",
        explanation:
          "The ws package implements the WebSocket protocol at a low level for Node.js servers.",
      },
      associatedSkills: ["websockets"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which higher-level library adds rooms/broadcasting on top of WebSockets?",
        options: ["Socket.IO", "Express", "Axios", "gRPC"],
        correctAnswer: "Socket.IO",
        explanation:
          "Socket.IO builds on WebSockets/long polling and provides namespaces, rooms, and fallbacks.",
      },
      associatedSkills: ["websockets"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the Node.js ws server snippet.",
        segments: [
          { text: "const wss = new WebSocketServer({ port: 8080 });\nwss.on('connection', (socket) => {\n  socket.", block: false },
          { text: "send", block: true },
          { text: "('hello');\n});", block: false },
        ],
        blocks: ["send", "write", "emit"],
        correctAnswer: ["send"],
        explanation:
          "WebSocket connections expose socket.send() for sending frames to clients.",
      },
      associatedSkills: ["websockets"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which heartbeat strategy keeps connections alive behind proxies?",
        options: [
          "Send periodic ping/pong frames",
          "Disable TLS",
          "Use HTTP keep-alive",
          "Set buffer size to zero",
        ],
        correctAnswer: "Send periodic ping/pong frames",
        explanation:
          "Sending ping/pong frames ensures proxies don't close idle WebSocket connections.",
      },
      associatedSkills: ["websockets"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which HTTP header upgrades an HTTP request to WebSocket?",
        options: [
          "Upgrade: websocket",
          "Connection: keep-alive",
          "Sec-Fetch-Mode: cors",
          "X-Requested-With: WebSocket",
        ],
        correctAnswer: "Upgrade: websocket",
        explanation:
          "The initial handshake uses Upgrade: websocket and Connection: Upgrade headers.",
      },
      associatedSkills: ["websockets"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which scaling strategy handles millions of WebSocket connections?",
        options: [
          "Deploy a message broker (Redis/NATS) with pub/sub fan-out",
          "Run a single Node.js process",
          "Use HTTP/2 server push",
          "Disable TLS",
        ],
        correctAnswer:
          "Deploy a message broker (Redis/NATS) with pub/sub fan-out",
        explanation:
          "Large deployments use shared message buses so multiple WebSocket nodes can broadcast messages to all subscribed clients.",
      },
      associatedSkills: ["websockets"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which approach secures WebSocket connections?",
        options: [
          "Use WSS with JWT/bearer token validation during handshake",
          "Disable CORS",
          "Use HTTP basic auth only",
          "Send credentials via query string without TLS",
        ],
        correctAnswer: "Use WSS with JWT/bearer token validation during handshake",
        explanation:
          "Authenticating via tokens/cookies over TLS (wss://) ensures transport security and access control.",
      },
      associatedSkills: ["websockets"],
    },
  ],
};
