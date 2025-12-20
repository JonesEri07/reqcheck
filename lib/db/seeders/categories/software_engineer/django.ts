import { SkillSeedData } from "../../types";

export const djangoSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Django",
      skillNormalized: "django",
      aliases: ["djangorestframework"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command creates a new Django project skeleton?",
        options: [
          "django-admin startproject mysite",
          "python manage.py startproject mysite",
          "django-admin startapp mysite",
          "django-admin init mysite",
        ],
        correctAnswer: "django-admin startproject mysite",
        explanation:
          "django-admin startproject scaffolds manage.py, settings, URLs, and WSGI files for a new project.",
      },
      associatedSkills: ["django"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file registers URL patterns for the entire project?",
        options: ["project/urls.py", "settings.py", "apps.py", "wsgi.py"],
        correctAnswer: "project/urls.py",
        explanation:
          "urls.py includes path() or re_path() definitions and can delegate to app-specific URL configs.",
      },
      associatedSkills: ["django"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which ORM method returns a single object or raises DoesNotExist?",
        options: ["get()", "filter()", "all()", "values()"],
        correctAnswer: "get()",
        explanation:
          "Model.objects.get(...) fetches exactly one row; filter returns QuerySets of zero or more rows.",
      },
      associatedSkills: ["django"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you add INSTALLED_APPS entries for new apps?",
        options: ["settings.py", "urls.py", "manage.py", "__init__.py"],
        correctAnswer: "settings.py",
        explanation:
          "settings.py holds INSTALLED_APPS, telling Django which app configs to load at startup.",
      },
      associatedSkills: ["django"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which template tag safely escapes HTML by default?",
        options: ["{{ variable }}", "{% autoescape off %}", "{% safe variable %}", "{% raw %}"],
        correctAnswer: "{{ variable }}",
        explanation:
          "Variable interpolation escapes HTML, preventing XSS unless the safe filter is applied.",
      },
      associatedSkills: ["django"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which middleware is responsible for CSRF protection in Django?",
        options: [
          "django.middleware.csrf.CsrfViewMiddleware",
          "django.middleware.security.SecurityMiddleware",
          "django.middleware.clickjacking.XFrameOptionsMiddleware",
          "django.contrib.sessions.middleware.SessionMiddleware",
        ],
        correctAnswer: "django.middleware.csrf.CsrfViewMiddleware",
        explanation:
          "Enabling CsrfViewMiddleware enforces CSRF tokens and integrates with the {% csrf_token %} tag.",
      },
      associatedSkills: ["django"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the class-based view import and definition.",
        segments: [
          { text: "from django.views.generic import ", block: true },
          { text: "\nfrom .models import Article\n\nclass ArticleDetail(", block: false },
          { text: "DetailView", block: true },
          { text: "):\n    model = Article\n", block: false },
        ],
        blocks: ["DetailView", "ListView", "TemplateView"],
        correctAnswer: ["DetailView", "DetailView"],
        explanation:
          "Importing DetailView and subclassing it gives you an object detail page with minimal boilerplate.",
      },
      associatedSkills: ["django"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "When using Django REST Framework, which class turns a model into JSON representation?",
        options: [
          "Serializer",
          "ViewSet",
          "APIView",
          "Router",
        ],
        correctAnswer: "Serializer",
        explanation:
          "Serializers define fields and validation, turning model instances or querysets into Python primitives ready for JSON rendering.",
      },
      associatedSkills: ["django"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which caching backend provides distributed caching via Memcached in production?",
        options: [
          "django.core.cache.backends.memcached.MemcachedCache",
          "django.core.cache.backends.locmem.LocMemCache",
          "django.core.cache.backends.db.DatabaseCache",
          "django.core.cache.backends.filebased.FileBasedCache",
        ],
        correctAnswer: "django.core.cache.backends.memcached.MemcachedCache",
        explanation:
          "MemcachedCache connects to Memcached servers and is better for multi-process deployments than locmem or file caches.",
      },
      associatedSkills: ["django"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "A migration must run custom Python both before and after schema changes. Which operation lets you do this?",
        options: [
          "RunPython",
          "RunSQL",
          "AlterField",
          "SeparateDatabaseAndState",
        ],
        correctAnswer: "RunPython",
        explanation:
          "RunPython accepts callable references for forward and reverse operations, letting you safely backfill or clean data during migration.",
      },
      associatedSkills: ["django"],
    },
  ],
};
