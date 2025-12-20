import { SkillSeedData } from "../../types";

export const hadoopSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Hadoop",
      skillNormalized: "hadoop",
      aliases: ["apache hadoop"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Hadoop component stores massive data sets across commodity hardware?",
        options: ["HDFS", "YARN", "MapReduce", "Hive"],
        correctAnswer: "HDFS",
        explanation:
          "Hadoop Distributed File System (HDFS) replicates blocks across nodes to provide fault-tolerant storage.",
      },
      associatedSkills: ["hadoop"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What is the role of YARN in a Hadoop cluster?",
        options: [
          "Resource management and job scheduling",
          "Storing data blocks",
          "Defining table schemas",
          "Serving data over REST",
        ],
        correctAnswer: "Resource management and job scheduling",
        explanation:
          "Yet Another Resource Negotiator (YARN) coordinates resources and schedules tasks across the cluster.",
      },
      associatedSkills: ["hadoop"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command copies a file from local disk to HDFS?",
        options: [
          "hdfs dfs -put localfile /data/",
          "hdfs dfs -cat /data/localfile",
          "hdfs dfs -rm /data/localfile",
          "yarn jar localfile",
        ],
        correctAnswer: "hdfs dfs -put localfile /data/",
        explanation:
          "The -put command uploads data from local storage into an HDFS directory.",
      },
      associatedSkills: ["hadoop"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which layer executes user code in a traditional Hadoop job?",
        options: ["MapReduce", "YARN", "Zookeeper", "Hue"],
        correctAnswer: "MapReduce",
        explanation:
          "MapReduce provides the programming model (map and reduce functions) that processes data stored in HDFS.",
      },
      associatedSkills: ["hadoop"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What happens when an HDFS DataNode fails?",
        options: [
          "Blocks are re-replicated from remaining copies",
          "The NameNode stops accepting writes",
          "Jobs immediately fail",
          "All metadata is lost",
        ],
        correctAnswer: "Blocks are re-replicated from remaining copies",
        explanation:
          "Because HDFS stores multiple block replicas, the system can re-replicate lost blocks from healthy nodes.",
      },
      associatedSkills: ["hadoop"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which command shows the usage statistics of the HDFS cluster?",
        options: [
          "hdfs dfsadmin -report",
          "hdfs dfs -du /",
          "yarn application -list",
          "mapred job -status",
        ],
        correctAnswer: "hdfs dfsadmin -report",
        explanation:
          "dfsadmin -report prints capacity, used space, and node health for the entire HDFS cluster.",
      },
      associatedSkills: ["hadoop"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which file format is splittable and efficient for MapReduce processing?",
        options: ["SequenceFile", "Gzip-compressed text", "Avro container without sync markers", "PDF"],
        correctAnswer: "SequenceFile",
        explanation:
          "SequenceFiles are binary, splittable, and support key/value pairs—ideal for MapReduce pipelines.",
      },
      associatedSkills: ["hadoop"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which Hadoop ecosystem tool provides SQL-on-Hadoop capabilities?",
        options: ["Hive", "Oozie", "Sqoop", "Flume"],
        correctAnswer: "Hive",
        explanation:
          "Apache Hive compiles SQL (HiveQL) queries into MapReduce or Tez jobs to run on Hadoop data.",
      },
      associatedSkills: ["hadoop"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How do you minimize data skew when running a large reduce-side join?",
        options: [
          "Use a salted key or map-side join when possible",
          "Increase the replication factor",
          "Disable speculative execution",
          "Run the job on the NameNode",
        ],
        correctAnswer: "Use a salted key or map-side join when possible",
        explanation:
          "Salting or performing a map-side join helps balance reducer load by avoiding a single hot key.",
      },
      associatedSkills: ["hadoop"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which feature lets HDFS store small files efficiently without overwhelming the NameNode?",
        options: [
          "HDFS Federation or HAR files",
          "Lowering replication factor to 1",
          "Running more JournalNodes",
          "Placing files on local disk",
        ],
        correctAnswer: "HDFS Federation or HAR files",
        explanation:
          "HDFS Federation and Hadoop Archives (HAR) mitigate small file problems by spreading metadata or bundling files together.",
      },
      associatedSkills: ["hadoop"],
    },
  ],
};
