import "server-only";
import { SkillSeedData } from "../../types";
import { htmlSeed } from "./html";
import { cssSeed } from "./css";
import { sassSeed } from "./sass";
import { lessSeed } from "./less";
import { tailwindCssSeed } from "./tailwind-css";
import { bootstrapSeed } from "./bootstrap";
import { restApiSeed } from "./rest-api";
import { sqlSeed } from "./sql";
import { postgresqlSeed } from "./postgresql";
import { mysqlSeed } from "./mysql";
import { mongodbSeed } from "./mongodb";
import { redisSeed } from "./redis";
import { dynamodbSeed } from "./dynamodb";
import { cassandraSeed } from "./cassandra";
import { elasticsearchSeed } from "./elasticsearch";
import { firebaseSeed } from "./firebase";
import { supabaseSeed } from "./supabase";
import { sqliteSeed } from "./sqlite";
import { oracleSeed } from "./oracle";
import { neo4jSeed } from "./neo4j";
import { influxdbSeed } from "./influxdb";
import { javascriptSeed } from "./javascript";
import { typescriptSeed } from "./typescript";
import { pythonSeed } from "./python";
import { javaSeed } from "./java";
import { goSeed } from "./go";
import { rustSeed } from "./rust";
import { cppSeed } from "./cpp";
import { csharpSeed } from "./csharp";
import { rubySeed } from "./ruby";
import { phpSeed } from "./php";
import { swiftSeed } from "./swift";
import { kotlinSeed } from "./kotlin";
import { scalaSeed } from "./scala";
import { dartSeed } from "./dart";
import { flutterSeed } from "./flutter";
import { elixirSeed } from "./elixir";
import { perlSeed } from "./perl";
import { haskellSeed } from "./haskell";
import { clojureSeed } from "./clojure";
import { reactSeed } from "./react";
import { reactNativeSeed } from "./react-native";
import { reduxSeed } from "./redux";
import { zustandSeed } from "./zustand";
import { mobxSeed } from "./mobx";
import { vueSeed } from "./vue";
import { nuxtJsSeed } from "./nuxt-js";
import { angularSeed } from "./angular";
import { nextjsSeed } from "./nextjs";
import { remixSeed } from "./remix";
import { gatsbySeed } from "./gatsby";
import { svelteSeed } from "./svelte";
import { jquerySeed } from "./jquery";
import { nodejsSeed } from "./nodejs";
import { expressJsSeed } from "./express-js";
import { nestjsSeed } from "./nestjs";
import { koaJsSeed } from "./koa-js";
import { hapiJsSeed } from "./hapi-js";
import { djangoSeed } from "./django";
import { flaskSeed } from "./flask";
import { fastapiSeed } from "./fastapi";
import { springBootSeed } from "./spring-boot";
import { aspnetSeed } from "./aspnet";
import { laravelSeed } from "./laravel";
import { graphqlSeed } from "./graphql";
import { cloudformationSeed } from "./cloudformation";
import { azureSeed } from "./azure";
import { gcpSeed } from "./gcp";
import { githubActionsSeed } from "./github-actions";
import { gitlabCiSeed } from "./gitlab-ci";
import { jenkinsSeed } from "./jenkins";
import { circleciSeed } from "./circleci";
import { travisCiSeed } from "./travis-ci";
import { gitSeed } from "./git";
import { linuxSeed } from "./linux";
import { nginxSeed } from "./nginx";
import { apacheSeed } from "./apache";
import { jestSeed } from "./jest";
import { cypressSeed } from "./cypress";
import { playwrightSeed } from "./playwright";
import { seleniumSeed } from "./selenium";
import { pytestSeed } from "./pytest";
import { junitSeed } from "./junit";
import { mochaSeed } from "./mocha";
import { vitestSeed } from "./vitest";
import { testingLibrarySeed } from "./testing-library";
import { xamarinSeed } from "./xamarin";
import { ionicSeed } from "./ionic";
import { oauthSeed } from "./oauth";
import { jwtSeed } from "./jwt";
import { viteSeed } from "./vite";
import { websocketsSeed } from "./websockets";
import { rabbitmqSeed } from "./rabbitmq";
import { kafkaSeed } from "./kafka";

// Aggregate all software engineer skills and questions
export const softwareEngineerSeed: SkillSeedData = {
  skills: [
    ...htmlSeed.skills,
    ...cssSeed.skills,
    ...sassSeed.skills,
    ...lessSeed.skills,
    ...tailwindCssSeed.skills,
    ...bootstrapSeed.skills,
    ...restApiSeed.skills,
    ...sqlSeed.skills,
    ...postgresqlSeed.skills,
    ...mysqlSeed.skills,
    ...mongodbSeed.skills,
    ...redisSeed.skills,
    ...dynamodbSeed.skills,
    ...cassandraSeed.skills,
    ...elasticsearchSeed.skills,
    ...firebaseSeed.skills,
    ...supabaseSeed.skills,
    ...sqliteSeed.skills,
    ...oracleSeed.skills,
    ...neo4jSeed.skills,
    ...influxdbSeed.skills,
    ...javascriptSeed.skills,
    ...typescriptSeed.skills,
    ...pythonSeed.skills,
    ...javaSeed.skills,
    ...goSeed.skills,
    ...rustSeed.skills,
    ...cppSeed.skills,
    ...csharpSeed.skills,
    ...rubySeed.skills,
    ...phpSeed.skills,
    ...swiftSeed.skills,
    ...kotlinSeed.skills,
    ...scalaSeed.skills,
    ...dartSeed.skills,
    ...flutterSeed.skills,
    ...elixirSeed.skills,
    ...perlSeed.skills,
    ...haskellSeed.skills,
    ...clojureSeed.skills,
    ...reactSeed.skills,
    ...reactNativeSeed.skills,
    ...reduxSeed.skills,
    ...zustandSeed.skills,
    ...mobxSeed.skills,
    ...vueSeed.skills,
    ...nuxtJsSeed.skills,
    ...angularSeed.skills,
    ...nextjsSeed.skills,
    ...remixSeed.skills,
    ...gatsbySeed.skills,
    ...svelteSeed.skills,
    ...jquerySeed.skills,
    ...nodejsSeed.skills,
    ...expressJsSeed.skills,
    ...nestjsSeed.skills,
    ...koaJsSeed.skills,
    ...hapiJsSeed.skills,
    ...djangoSeed.skills,
    ...flaskSeed.skills,
    ...fastapiSeed.skills,
    ...springBootSeed.skills,
    ...aspnetSeed.skills,
    ...laravelSeed.skills,
    ...graphqlSeed.skills,
    ...cloudformationSeed.skills,
    ...azureSeed.skills,
    ...gcpSeed.skills,
    ...githubActionsSeed.skills,
    ...gitlabCiSeed.skills,
    ...jenkinsSeed.skills,
    ...circleciSeed.skills,
    ...travisCiSeed.skills,
    ...gitSeed.skills,
    ...linuxSeed.skills,
    ...nginxSeed.skills,
    ...apacheSeed.skills,
    ...jestSeed.skills,
    ...cypressSeed.skills,
    ...playwrightSeed.skills,
    ...seleniumSeed.skills,
    ...pytestSeed.skills,
    ...junitSeed.skills,
    ...mochaSeed.skills,
    ...vitestSeed.skills,
    ...testingLibrarySeed.skills,
    ...xamarinSeed.skills,
    ...ionicSeed.skills,
    ...oauthSeed.skills,
    ...jwtSeed.skills,
    ...viteSeed.skills,
    ...websocketsSeed.skills,
    ...rabbitmqSeed.skills,
    ...kafkaSeed.skills,
  ],
  questions: [
    ...htmlSeed.questions,
    ...cssSeed.questions,
    ...sassSeed.questions,
    ...lessSeed.questions,
    ...tailwindCssSeed.questions,
    ...bootstrapSeed.questions,
    ...restApiSeed.questions,
    ...sqlSeed.questions,
    ...postgresqlSeed.questions,
    ...mysqlSeed.questions,
    ...mongodbSeed.questions,
    ...redisSeed.questions,
    ...dynamodbSeed.questions,
    ...cassandraSeed.questions,
    ...elasticsearchSeed.questions,
    ...firebaseSeed.questions,
    ...supabaseSeed.questions,
    ...sqliteSeed.questions,
    ...oracleSeed.questions,
    ...neo4jSeed.questions,
    ...influxdbSeed.questions,
    ...javascriptSeed.questions,
    ...typescriptSeed.questions,
    ...pythonSeed.questions,
    ...javaSeed.questions,
    ...goSeed.questions,
    ...rustSeed.questions,
    ...cppSeed.questions,
    ...csharpSeed.questions,
    ...rubySeed.questions,
    ...phpSeed.questions,
    ...swiftSeed.questions,
    ...kotlinSeed.questions,
    ...scalaSeed.questions,
    ...dartSeed.questions,
    ...flutterSeed.questions,
    ...elixirSeed.questions,
    ...perlSeed.questions,
    ...haskellSeed.questions,
    ...clojureSeed.questions,
    ...reactSeed.questions,
    ...reactNativeSeed.questions,
    ...reduxSeed.questions,
    ...zustandSeed.questions,
    ...mobxSeed.questions,
    ...vueSeed.questions,
    ...nuxtJsSeed.questions,
    ...angularSeed.questions,
    ...nextjsSeed.questions,
    ...remixSeed.questions,
    ...gatsbySeed.questions,
    ...svelteSeed.questions,
    ...jquerySeed.questions,
    ...nodejsSeed.questions,
    ...expressJsSeed.questions,
    ...nestjsSeed.questions,
    ...koaJsSeed.questions,
    ...hapiJsSeed.questions,
    ...djangoSeed.questions,
    ...flaskSeed.questions,
    ...fastapiSeed.questions,
    ...springBootSeed.questions,
    ...aspnetSeed.questions,
    ...laravelSeed.questions,
    ...graphqlSeed.questions,
    ...cloudformationSeed.questions,
    ...azureSeed.questions,
    ...gcpSeed.questions,
    ...githubActionsSeed.questions,
    ...gitlabCiSeed.questions,
    ...jenkinsSeed.questions,
    ...circleciSeed.questions,
    ...travisCiSeed.questions,
    ...gitSeed.questions,
    ...linuxSeed.questions,
    ...nginxSeed.questions,
    ...apacheSeed.questions,
    ...jestSeed.questions,
    ...cypressSeed.questions,
    ...playwrightSeed.questions,
    ...seleniumSeed.questions,
    ...pytestSeed.questions,
    ...junitSeed.questions,
    ...mochaSeed.questions,
    ...vitestSeed.questions,
    ...testingLibrarySeed.questions,
    ...xamarinSeed.questions,
    ...ionicSeed.questions,
    ...oauthSeed.questions,
    ...jwtSeed.questions,
    ...viteSeed.questions,
    ...websocketsSeed.questions,
    ...rabbitmqSeed.questions,
    ...kafkaSeed.questions,
  ],
};
