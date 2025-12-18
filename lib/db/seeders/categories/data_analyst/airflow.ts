import { SkillSeedData } from "../../types.js";

export const airflowSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Airflow",
      skillNormalized: "airflow",
      aliases: ["apache airflow"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "In Airflow, what does a DAG represent?",
        options: [
          "A Directed Acyclic Graph describing task order",
          "A Dockerfile that builds worker images",
          "A database table that stores task logs",
          "A permission group inside the UI",
        ],
        correctAnswer: "A Directed Acyclic Graph describing task order",
        explanation:
          "Every Airflow workflow is modeled as a Directed Acyclic Graph (DAG) that declares the tasks and their dependencies.",
      },
      associatedSkills: ["airflow"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which operator lets you execute a Python callable inside an Airflow task?",
        options: ["PythonOperator", "BashOperator", "EmailOperator", "DummyOperator"],
        correctAnswer: "PythonOperator",
        explanation:
          "PythonOperator is designed to wrap a Python callable, making it the standard way to run Python code inside a task.",
      },
      associatedSkills: ["airflow"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which DAG argument controls how often the workflow should run?",
        options: ["schedule_interval", "default_args", "dag_id", "tags"],
        correctAnswer: "schedule_interval",
        explanation:
          "The schedule_interval argument defines the cadence for the DAG (cron string, timedelta, or preset).",
      },
      associatedSkills: ["airflow"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI command lists all registered DAGs in an Airflow environment?",
        options: [
          "airflow dags list",
          "airflow tasks run",
          "airflow webserver",
          "airflow info",
        ],
        correctAnswer: "airflow dags list",
        explanation:
          "The airflow dags list command prints every DAG the scheduler knows about, making it a quick health check.",
      },
      associatedSkills: ["airflow"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you typically define retry counts and other shared task defaults?",
        options: [
          "Inside the default_args dictionary",
          "In airflow.cfg",
          "In the metadata database",
          "Inside the logs folder",
        ],
        correctAnswer: "Inside the default_args dictionary",
        explanation:
          "default_args is a Python dict passed to the DAG so all tasks inherit settings like retries, owner, or email.",
      },
      associatedSkills: ["airflow"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which DAG setting prevents Airflow from creating historical runs for missed schedules?",
        options: ["catchup=False", "depends_on_past=True", "max_active_runs=1", "schedule_interval=None"],
        correctAnswer: "catchup=False",
        explanation:
          "Setting catchup to False tells the scheduler to only create the latest run, skipping backfills for past periods.",
      },
      associatedSkills: ["airflow"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which sensor waits for the presence of a specific object inside Amazon S3?",
        options: ["S3KeySensor", "ExternalTaskSensor", "TimeDeltaSensor", "SqlSensor"],
        correctAnswer: "S3KeySensor",
        explanation:
          "S3KeySensor keeps poking S3 for a given bucket/key combo and marks the task successful once the object exists.",
      },
      associatedSkills: ["airflow"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "What Airflow feature lets you create parallel tasks from an iterable using the TaskFlow API?",
        options: ["Task mapping", "Branching", "Pools", "SLAs"],
        correctAnswer: "Task mapping",
        explanation:
          "Task mapping (available in the TaskFlow API) lets you fan out tasks dynamically based on an iterable at runtime.",
      },
      associatedSkills: ["airflow"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How can you guarantee that only one DAG run executes at a time even if new schedules arrive?",
        options: [
          "Set max_active_runs=1 on the DAG",
          "Disable the scheduler",
          "Enable catchup",
          "Raise retries to a higher number",
        ],
        correctAnswer: "Set max_active_runs=1 on the DAG",
        explanation:
          "max_active_runs limits concurrent DAG runs, so the scheduler waits for the in-progress run before scheduling another.",
      },
      associatedSkills: ["airflow"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which practice helps reduce DAG parsing time when you import heavy Python libraries?",
        options: [
          "Import heavy libraries inside task callables instead of globally",
          "Increase the number of webserver workers",
          "Disable the DagBag",
          "Set depends_on_past=True",
        ],
        correctAnswer: "Import heavy libraries inside task callables instead of globally",
        explanation:
          "Large imports during DAG parsing slow the scheduler; moving them inside the task keeps parsing light and only loads them when needed.",
      },
      associatedSkills: ["airflow"],
    },
  ],
};
