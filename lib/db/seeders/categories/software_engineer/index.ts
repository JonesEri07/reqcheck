import { SkillSeedData } from "../../types.js";
import { htmlSeed } from "./html.js";
import { cssSeed } from "./css.js";
import { sassSeed } from "./sass.js";
import { lessSeed } from "./less.js";
import { tailwindCssSeed } from "./tailwind-css.js";
import { bootstrapSeed } from "./bootstrap.js";
import { restApiSeed } from "./rest-api.js";
import { sqlSeed } from "./sql.js";
import { postgresqlSeed } from "./postgresql.js";
import { mysqlSeed } from "./mysql.js";
import { mongodbSeed } from "./mongodb.js";
import { redisSeed } from "./redis.js";
import { dynamodbSeed } from "./dynamodb.js";
import { cassandraSeed } from "./cassandra.js";
import { elasticsearchSeed } from "./elasticsearch.js";
import { firebaseSeed } from "./firebase.js";
import { supabaseSeed } from "./supabase.js";
import { sqliteSeed } from "./sqlite.js";
import { oracleSeed } from "./oracle.js";
import { neo4jSeed } from "./neo4j.js";
import { influxdbSeed } from "./influxdb.js";
import { javascriptSeed } from "./javascript.js";
import { typescriptSeed } from "./typescript.js";
import { pythonSeed } from "./python.js";
import { javaSeed } from "./java.js";
import { goSeed } from "./go.js";
import { rustSeed } from "./rust.js";
import { cppSeed } from "./cpp.js";
import { csharpSeed } from "./csharp.js";
import { rubySeed } from "./ruby.js";
import { phpSeed } from "./php.js";
import { swiftSeed } from "./swift.js";
import { kotlinSeed } from "./kotlin.js";
import { scalaSeed } from "./scala.js";
import { dartSeed } from "./dart.js";
import { flutterSeed } from "./flutter.js";
import { elixirSeed } from "./elixir.js";
import { perlSeed } from "./perl.js";
import { haskellSeed } from "./haskell.js";
import { clojureSeed } from "./clojure.js";
import { reactSeed } from "./react.js";
import { reactNativeSeed } from "./react-native.js";
import { reduxSeed } from "./redux.js";
import { zustandSeed } from "./zustand.js";
import { mobxSeed } from "./mobx.js";
import { vueSeed } from "./vue.js";
import { nuxtJsSeed } from "./nuxt-js.js";
import { angularSeed } from "./angular.js";
import { nextjsSeed } from "./nextjs.js";
import { remixSeed } from "./remix.js";
import { gatsbySeed } from "./gatsby.js";
import { svelteSeed } from "./svelte.js";
import { jquerySeed } from "./jquery.js";
import { nodejsSeed } from "./nodejs.js";
import { expressJsSeed } from "./express-js.js";
import { nestjsSeed } from "./nestjs.js";
import { koaJsSeed } from "./koa-js.js";
import { hapiJsSeed } from "./hapi-js.js";
import { djangoSeed } from "./django.js";
import { flaskSeed } from "./flask.js";
import { fastapiSeed } from "./fastapi.js";
import { springBootSeed } from "./spring-boot.js";
import { aspnetSeed } from "./aspnet.js";
import { laravelSeed } from "./laravel.js";
import { graphqlSeed } from "./graphql.js";
import { cloudformationSeed } from "./cloudformation.js";
import { azureSeed } from "./azure.js";
import { gcpSeed } from "./gcp.js";
import { githubActionsSeed } from "./github-actions.js";
import { gitlabCiSeed } from "./gitlab-ci.js";
import { jenkinsSeed } from "./jenkins.js";
import { circleciSeed } from "./circleci.js";
import { travisCiSeed } from "./travis-ci.js";
import { gitSeed } from "./git.js";
import { linuxSeed } from "./linux.js";
import { nginxSeed } from "./nginx.js";
import { apacheSeed } from "./apache.js";
import { jestSeed } from "./jest.js";
import { cypressSeed } from "./cypress.js";
import { playwrightSeed } from "./playwright.js";
import { seleniumSeed } from "./selenium.js";
import { pytestSeed } from "./pytest.js";
import { junitSeed } from "./junit.js";
import { mochaSeed } from "./mocha.js";
import { vitestSeed } from "./vitest.js";
import { testingLibrarySeed } from "./testing-library.js";
import { xamarinSeed } from "./xamarin.js";
import { ionicSeed } from "./ionic.js";
import { oauthSeed } from "./oauth.js";
import { jwtSeed } from "./jwt.js";
import { viteSeed } from "./vite.js";
import { websocketsSeed } from "./websockets.js";
import { rabbitmqSeed } from "./rabbitmq.js";
import { kafkaSeed } from "./kafka.js";

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
