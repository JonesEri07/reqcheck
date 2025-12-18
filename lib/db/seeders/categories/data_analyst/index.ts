import { SkillSeedData } from "../../types.js";
import { sqlSeed } from "./sql.js";
import { rSeed } from "./r.js";
import { matlabSeed } from "./matlab.js";
import { machineLearningSeed } from "./machine-learning.js";
import { visualizationSeed } from "./visualization.js";
import { tableauSeed } from "./tableau.js";
import { powerBiSeed } from "./power-bi.js";
import { matplotlibSeed } from "./matplotlib.js";
import { seabornSeed } from "./seaborn.js";
import { plotlySeed } from "./plotly.js";
import { lookerSeed } from "./looker.js";
import { airflowSeed } from "./airflow.js";
import { dbtSeed } from "./dbt.js";
import { apacheSparkSeed } from "./apache-spark.js";
import { hadoopSeed } from "./hadoop.js";
import { snowflakeSeed } from "./snowflake.js";
import { bigquerySeed } from "./bigquery.js";
import { redshiftSeed } from "./redshift.js";
import { pandasSeed } from "./pandas.js";
import { numpySeed } from "./numpy.js";
import { scikitLearnSeed } from "./scikit-learn.js";
import { tensorflowSeed } from "./tensorflow.js";
import { pytorchSeed } from "./pytorch.js";

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
