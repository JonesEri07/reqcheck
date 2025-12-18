import { SkillSeedData } from "../../types.js";

export const apacheSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Apache",
      skillNormalized: "apache",
      aliases: ["apache http server"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Apache configuration file defines virtual hosts on Debian-based systems?",
        options: [
          "/etc/apache2/sites-available/000-default.conf",
          "/etc/httpd/conf/httpd.conf",
          "/etc/nginx/nginx.conf",
          "~/.bashrc",
        ],
        correctAnswer: "/etc/apache2/sites-available/000-default.conf",
        explanation:
          "On Debian/Ubuntu, virtual hosts live under sites-available and are enabled via a2ensite.",
      },
      associatedSkills: ["apache"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command enables a site configuration on Ubuntu?",
        options: ["a2ensite example.conf", "systemctl enable apache", "a2enmod example", "apachectl configtest"],
        correctAnswer: "a2ensite example.conf",
        explanation:
          "a2ensite creates the symlink from sites-available to sites-enabled, activating the vhost on reload.",
      },
      associatedSkills: ["apache"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directive sets the document root for a virtual host?",
        options: ["DocumentRoot /var/www/html", "ServerName example.com", "ProxyPass /api", "Listen 80"],
        correctAnswer: "DocumentRoot /var/www/html",
        explanation:
          "DocumentRoot tells Apache where to serve static files for that virtual host.",
      },
      associatedSkills: ["apache"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which process restarts Apache after configuration changes?",
        options: [
          "systemctl restart apache2",
          "service nginx restart",
          "systemctl reload mysql",
          "docker restart httpd",
        ],
        correctAnswer: "systemctl restart apache2",
        explanation:
          "On Debian-based systems, Apache service is named apache2 and can be restarted via systemctl or service.",
      },
      associatedSkills: ["apache"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which module must be enabled to use .htaccess rewrites?",
        options: ["mod_rewrite", "mod_proxy", "mod_ssl", "mod_php"],
        correctAnswer: "mod_rewrite",
        explanation:
          "mod_rewrite powers RewriteRule and RewriteCond directives inside .htaccess files or server config.",
      },
      associatedSkills: ["apache"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which directive forces HTTP requests to redirect to HTTPS within a virtual host?",
        options: [
          "RewriteEngine On / RewriteCond %{HTTPS} off / RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]",
          "ProxyPass / https://backend/",
          "AllowOverride None",
          "SSLCipherSuite HIGH",
        ],
        correctAnswer:
          "RewriteEngine On / RewriteCond %{HTTPS} off / RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]",
        explanation:
          "Using mod_rewrite to check HTTPS and redirect ensures browsers switch to TLS.",
      },
      associatedSkills: ["apache"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which directive limits access to a directory based on IP address?",
        options: [
          "<Directory \"/var/www/private\"> Require ip 10.0.0.0/8 </Directory>",
          "ProxyPass /private",
          "Redirect /private",
          "SSLEngine On",
        ],
        correctAnswer:
          "<Directory \"/var/www/private\"> Require ip 10.0.0.0/8 </Directory>",
        explanation:
          "Within Directory blocks you can use Require directives to allow or deny by IP subnet, user, or group.",
      },
      associatedSkills: ["apache"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which module enables Apache to reverse proxy requests to an upstream application?",
        options: [
          "mod_proxy (and mod_proxy_http)",
          "mod_security",
          "mod_status",
          "mod_authnz_ldap",
        ],
        correctAnswer: "mod_proxy (and mod_proxy_http)",
        explanation:
          "mod_proxy handles proxying HTTP/HTTPS, balancing, and rewriting requests to backend services.",
      },
      associatedSkills: ["apache"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which command validates Apache configuration syntax without restarting?",
        options: [
          "apachectl configtest",
          "nginx -t",
          "systemctl status apache2",
          "httpd -l",
        ],
        correctAnswer: "apachectl configtest",
        explanation:
          "apachectl configtest (or apache2ctl) parses configuration files and reports syntax errors before reload.",
      },
      associatedSkills: ["apache"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which Multi-Processing Module (MPM) optimizes Apache for event-driven, high-concurrency workloads?",
        options: ["event MPM", "prefork MPM", "worker MPM", "itk MPM"],
        correctAnswer: "event MPM",
        explanation:
          "event MPM keeps keep-alive connections in dedicated threads, improving scalability compared to prefork.",
      },
      associatedSkills: ["apache"],
    },
  ],
};
