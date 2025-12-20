import "server-only";
import { SkillSeedData } from "../../types";
import { sqlSeed } from "./sql";
import { rSeed } from "./r";
import { matlabSeed } from "./matlab";
import { machineLearningSeed } from "./machine-learning";
import { visualizationSeed } from "./visualization";
import { tableauSeed } from "./tableau";
import { powerBiSeed } from "./power-bi";
import { matplotlibSeed } from "./matplotlib";
import { seabornSeed } from "./seaborn";
import { plotlySeed } from "./plotly";
import { lookerSeed } from "./looker";
import { airflowSeed } from "./airflow";
import { dbtSeed } from "./dbt";
import { apacheSparkSeed } from "./apache-spark";
import { hadoopSeed } from "./hadoop";
import { snowflakeSeed } from "./snowflake";
import { bigquerySeed } from "./bigquery";
import { redshiftSeed } from "./redshift";
import { pandasSeed } from "./pandas";
import { numpySeed } from "./numpy";
import { scikitLearnSeed } from "./scikit-learn";
import { tensorflowSeed } from "./tensorflow";
import { pytorchSeed } from "./pytorch";

// Aggregate all data analyst skills and questions
export const dataAnalystSeed: SkillSeedData = {
  skills: [
    ...sqlSeed.skills,
    ...rSeed.skills,
    ...matlabSeed.skills,
    ...machineLearningSeed.skills,
    ...visualizationSeed.skills,
    ...tableauSeed.skills,
    ...powerBiSeed.skills,
    ...matplotlibSeed.skills,
    ...seabornSeed.skills,
    ...plotlySeed.skills,
    ...lookerSeed.skills,
    ...airflowSeed.skills,
    ...dbtSeed.skills,
    ...apacheSparkSeed.skills,
    ...hadoopSeed.skills,
    ...snowflakeSeed.skills,
    ...bigquerySeed.skills,
    ...redshiftSeed.skills,
    ...pandasSeed.skills,
    ...numpySeed.skills,
    ...scikitLearnSeed.skills,
    ...tensorflowSeed.skills,
    ...pytorchSeed.skills,
  ],
  questions: [
    ...sqlSeed.questions,
    ...rSeed.questions,
    ...matlabSeed.questions,
    ...machineLearningSeed.questions,
    ...visualizationSeed.questions,
    ...tableauSeed.questions,
    ...powerBiSeed.questions,
    ...matplotlibSeed.questions,
    ...seabornSeed.questions,
    ...plotlySeed.questions,
    ...lookerSeed.questions,
    ...airflowSeed.questions,
    ...dbtSeed.questions,
    ...apacheSparkSeed.questions,
    ...hadoopSeed.questions,
    ...snowflakeSeed.questions,
    ...bigquerySeed.questions,
    ...redshiftSeed.questions,
    ...pandasSeed.questions,
    ...numpySeed.questions,
    ...scikitLearnSeed.questions,
    ...tensorflowSeed.questions,
    ...pytorchSeed.questions,
  ],
};
