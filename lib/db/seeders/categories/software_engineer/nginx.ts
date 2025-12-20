import { SkillSeedData } from "../../types";

export const nginxSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Nginx",
      skillNormalized: "nginx",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file typically defines the main Nginx configuration on Linux?",
        options: ["/etc/nginx/nginx.conf", "/usr/local/nginx.conf", "/etc/httpd/nginx.conf", "/etc/apache2/nginx.conf"],
        correctAnswer: "/etc/nginx/nginx.conf",
        explanation:
          "Most distributions store the primary config at /etc/nginx/nginx.conf, which includes conf.d or sites-enabled directories.",
      },
      associatedSkills: ["nginx"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Nginx block defines an HTTP virtual server?",
        options: ["server { ... }", "virtualhost { ... }", "site { ... }", "listen { ... }"],
        correctAnswer: "server { ... }",
        explanation:
          "server blocks configure listen directives, server_name, locations, and upstream proxies.",
      },
      associatedSkills: ["nginx"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directive proxies traffic to an upstream application?",
        options: [
          "proxy_pass http://app;",
          "reverse_proxy http://app;",
          "proxy_to http://app;",
          "backend http://app;",
        ],
        correctAnswer: "proxy_pass http://app;",
        explanation:
          "proxy_pass inside a location forwards requests to upstream servers defined by IP, domain, or upstream blocks.",
      },
      associatedSkills: ["nginx"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command tests the Nginx configuration for syntax errors?",
        options: ["nginx -t", "nginx test", "systemctl test nginx", "nginx --check"],
        correctAnswer: "nginx -t",
        explanation:
          "nginx -t validates configuration files; if successful you can reload safely.",
      },
      associatedSkills: ["nginx"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directive serves static files from a directory?",
        options: ["root /var/www/html;", "serve /var/www/html;", "static /var/www/html;", "files /var/www/html;"],
        correctAnswer: "root /var/www/html;",
        explanation:
          "root defines the filesystem path for requests handled in that location block.",
      },
      associatedSkills: ["nginx"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the location block that redirects HTTP to HTTPS.",
        segments: [
          { text: "server {\n  listen 80;\n  server_name example.com;\n  return 301 ", block: false },
          { text: "https://", block: true },
          { text: "$host$request_uri;\n}\n", block: false },
        ],
        blocks: ["https://", "http://", "$scheme://"],
        correctAnswer: ["https://"],
        explanation:
          "Returning 301 https://$host$request_uri enforces HTTPS while preserving path/query.",
      },
      associatedSkills: ["nginx"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which module enables load balancing across multiple upstream servers?",
        options: [
          "upstream block with proxy_pass",
          "stream module only",
          "http2 module",
          "geoip module",
        ],
        correctAnswer: "upstream block with proxy_pass",
        explanation:
          "You define upstream backend { server app1; server app2; } and reference it via proxy_pass http://backend;",
      },
      associatedSkills: ["nginx"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which directive limits request body size to protect upstream services?",
        options: [
          "client_max_body_size 5m;",
          "limit_request_body 5m;",
          "max_body 5m;",
          "proxy_body_limit 5m;",
        ],
        correctAnswer: "client_max_body_size 5m;",
        explanation:
          "client_max_body_size rejects uploads larger than the specified size before hitting upstream servers.",
      },
      associatedSkills: ["nginx"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How do you enable zero-downtime reloads when updating configuration?",
        options: [
          "Run nginx -s reload after testing configuration",
          "Stop nginx then start",
          "Restart the OS",
          "Apply config via GUI only",
        ],
        correctAnswer: "Run nginx -s reload after testing configuration",
        explanation:
          "nginx -s reload gracefully reloads workers, applying new configs without dropping active connections.",
      },
      associatedSkills: ["nginx"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which directive enables HTTP/2 support on TLS listeners?",
        options: [
          "listen 443 ssl http2;",
          "http2 on;",
          "enable_http2 true;",
          "listen http2;",
        ],
        correctAnswer: "listen 443 ssl http2;",
        explanation:
          "Adding http2 to the listen directive enables HTTP/2 for that TLS server block.",
      },
      associatedSkills: ["nginx"],
    },
  ],
};
