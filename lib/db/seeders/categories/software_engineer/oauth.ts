import { SkillSeedData } from "../../types.js";

export const oauthSeed: SkillSeedData = {
  skills: [
    {
      skillName: "OAuth",
      skillNormalized: "oauth",
      aliases: ["oauth2"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which OAuth 2.0 flow is intended for server-side web apps?",
        options: [
          "Authorization Code Grant",
          "Implicit Grant",
          "Client Credentials Grant",
          "Resource Owner Password Credentials",
        ],
        correctAnswer: "Authorization Code Grant",
        explanation:
          "Authorization Code is the recommended flow for server apps because the client secret stays on the server and tokens are exchanged securely.",
      },
      associatedSkills: ["oauth"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which endpoint issues access tokens in OAuth?",
        options: ["Token endpoint", "Authorization endpoint", "Discovery endpoint", "Revocation endpoint"],
        correctAnswer: "Token endpoint",
        explanation:
          "Clients send grant data to the token endpoint to obtain access tokens (and optionally refresh tokens).",
      },
      associatedSkills: ["oauth"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which parameter prevents CSRF in OAuth authorization requests?",
        options: ["state", "scope", "response_type", "audience"],
        correctAnswer: "state",
        explanation:
          "The state parameter must be validated on response to ensure the request wasn't tampered with.",
      },
      associatedSkills: ["oauth"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does PKCE add to public client flows?",
        options: [
          "Code challenge / verifier to prevent code interception",
          "Additional scopes",
          "Refresh tokens only",
          "Client secrets",
        ],
        correctAnswer: "Code challenge / verifier to prevent code interception",
        explanation:
          "PKCE (Proof Key for Code Exchange) binds the authorization code to the client, mitigating interception.",
      },
      associatedSkills: ["oauth"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which claim typically identifies the intended API for a token?",
        options: ["aud", "sub", "iss", "jti"],
        correctAnswer: "aud",
        explanation:
          "aud (audience) tells resource servers whether the token is meant for them.",
      },
      associatedSkills: ["oauth"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the Authorization Code URL example.",
        segments: [
          { text: "https://auth.example.com/authorize?response_type=code&client_id=123&redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback&", block: false },
          { text: "scope", block: true },
          { text: "=openid%20profile&state=abc123", block: false },
        ],
        blocks: ["scope", "audience", "prompt"],
        correctAnswer: ["scope"],
        explanation:
          "scope expresses requested permissions (e.g., openid profile email) and is required for most providers.",
      },
      associatedSkills: ["oauth"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which grant type is recommended for machine-to-machine APIs?",
        options: [
          "Client Credentials",
          "Authorization Code with PKCE",
          "Resource Owner Password",
          "Implicit",
        ],
        correctAnswer: "Client Credentials",
        explanation:
          "Client Credentials uses a client ID/secret to obtain tokens without user interaction, ideal for service-to-service calls.",
      },
      associatedSkills: ["oauth"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which standard builds identity information on top of OAuth 2.0?",
        options: ["OpenID Connect", "SAML", "JWT", "FIDO2"],
        correctAnswer: "OpenID Connect",
        explanation:
          "OIDC extends OAuth with ID tokens, well-defined scopes, and discovery for authentication use cases.",
      },
      associatedSkills: ["oauth"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How should refresh tokens be handled in SPAs to reduce theft risk?",
        options: [
          "Use short-lived refresh tokens stored in HTTP-only cookies combined with rotating refresh tokens",
          "Store refresh tokens in localStorage",
          "Expose refresh tokens via query parameters",
          "Disable refresh tokens entirely",
        ],
        correctAnswer:
          "Use short-lived refresh tokens stored in HTTP-only cookies combined with rotating refresh tokens",
        explanation:
          "Rotating refresh tokens and secure cookie storage mitigate XSS/token theft compared to storing long-lived tokens in web storage.",
      },
      associatedSkills: ["oauth"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To revoke compromised tokens, which endpoint should clients call?",
        options: ["RFC 7009 token revocation endpoint", "UserInfo endpoint", "JWKS endpoint", "Discovery endpoint"],
        correctAnswer: "RFC 7009 token revocation endpoint",
        explanation:
          "OAuth 2.0 defines a revocation endpoint where clients can invalidate tokens (access or refresh) using client authentication.",
      },
      associatedSkills: ["oauth"],
    },
  ],
};
