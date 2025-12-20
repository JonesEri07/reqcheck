import { SkillSeedData } from "../../types";

export const jwtSeed: SkillSeedData = {
  skills: [
    {
      skillName: "JWT",
      skillNormalized: "jwt",
      aliases: ["json web token", "jsonwebtoken"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which three components make up a standard JWT?",
        options: [
          "Header, Payload, Signature",
          "Key, Payload, Footer",
          "User, Token, Secret",
          "Scope, Claim, Issuer",
        ],
        correctAnswer: "Header, Payload, Signature",
        explanation:
          "A JWT encodes header and payload as base64url strings and appends a signature or MAC.",
      },
      associatedSkills: ["jwt"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which claim indicates token expiration time?",
        options: ["exp", "iat", "nbf", "aud"],
        correctAnswer: "exp",
        explanation:
          "The exp (expiration) claim is a Unix timestamp after which the token is no longer valid.",
      },
      associatedSkills: ["jwt"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which algorithm is symmetric and requires the same secret for signing and verification?",
        options: ["HS256", "RS256", "ES256", "PS256"],
        correctAnswer: "HS256",
        explanation:
          "HS256 uses HMAC with SHA-256, requiring both parties to share the same secret key.",
      },
      associatedSkills: ["jwt"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where should JWTs be stored in browsers to avoid XSS theft?",
        options: [
          "HTTP-only secure cookies",
          "localStorage only",
          "IndexedDB",
          "Global window variables",
        ],
        correctAnswer: "HTTP-only secure cookies",
        explanation:
          "HTTP-only cookies mitigate XSS token theft, though CSRF protections must complement them.",
      },
      associatedSkills: ["jwt"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which claim identifies the principal subject of the token?",
        options: ["sub", "iss", "aud", "jti"],
        correctAnswer: "sub",
        explanation:
          "sub (subject) typically holds the user ID or entity this token represents.",
      },
      associatedSkills: ["jwt"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the Node.js snippet that signs a JWT with a one-hour expiration.",
        segments: [
          { text: "const token = jwt.sign({ userId }, process.env.JWT_SECRET, {\n  ", block: false },
          { text: "expiresIn", block: true },
          { text: ": \"1h\",\n});", block: false },
        ],
        blocks: ["expiresIn", "exp", "ttl"],
        correctAnswer: ["expiresIn"],
        explanation:
          "jsonwebtoken uses the expiresIn option to set relative expiration durations.",
      },
      associatedSkills: ["jwt"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which best practice prevents attackers from replacing alg header with 'none'?",
        options: [
          "Whitelist accepted algorithms when verifying tokens",
          "Allow algorithm negotiation",
          "Disable signature validation",
          "Store tokens in plain text",
        ],
        correctAnswer: "Whitelist accepted algorithms when verifying tokens",
        explanation:
          "Verification libraries should explicitly limit algorithms to expected values to block alg=none or algorithm downgrades.",
      },
      associatedSkills: ["jwt"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which claim helps prevent replay across multiple services by identifying the intended audience?",
        options: ["aud", "nbf", "exp", "iat"],
        correctAnswer: "aud",
        explanation:
          "aud (audience) restricts tokens to specific APIs; servers must verify it matches expected values.",
      },
      associatedSkills: ["jwt"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To implement key rotation for RS256 JWTs, what should your server provide?",
        options: [
          "JWKS (JSON Web Key Set) endpoint with kid identifiers",
          "Static public key only",
          "Symmetric secret distribution",
          "Configurable algorithm via client",
        ],
        correctAnswer: "JWKS (JSON Web Key Set) endpoint with kid identifiers",
        explanation:
          "Exposing a JWKS URL lets clients fetch public keys keyed by kid header values, enabling smooth rotation.",
      },
      associatedSkills: ["jwt"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which mitigation handles JWT revocation before expiry in stateless systems?",
        options: [
          "Maintain a token blacklist/allowlist or shortened lifetimes plus refresh tokens",
          "Rely solely on exp claim",
          "Encode password hash in payload",
          "Store tokens in caches forever",
        ],
        correctAnswer:
          "Maintain a token blacklist/allowlist or shortened lifetimes plus refresh tokens",
        explanation:
          "Because JWTs are stateless, revocation requires tracking token IDs (jti) or reducing token TTL and issuing refresh tokens tied to server state.",
      },
      associatedSkills: ["jwt"],
    },
  ],
};
