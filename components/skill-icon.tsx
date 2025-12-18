"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * Normalize SVG code to ensure proper viewBox and scaling
 * Adds viewBox if missing, ensures preserveAspectRatio is set correctly
 */
export function normalizeSvgForIcon(svgCode: string): string {
  // If it's not an SVG, return as-is
  if (!svgCode.trim().startsWith("<svg")) {
    return svgCode;
  }

  // Parse the SVG to check for viewBox
  const viewBoxMatch = svgCode.match(/viewBox=["']([^"']+)["']/i);
  const preserveAspectRatioMatch = svgCode.match(
    /preserveAspectRatio=["']([^"']+)["']/i
  );

  let normalized = svgCode;

  // Add viewBox if missing (default to 0 0 24 24 for icon compatibility)
  if (!viewBoxMatch) {
    // Try to extract width and height to create viewBox
    const widthMatch = svgCode.match(/width=["']([^"']+)["']/i);
    const heightMatch = svgCode.match(/height=["']([^"']+)["']/i);

    let viewBox = "0 0 24 24"; // Default icon viewBox
    if (widthMatch && heightMatch) {
      const width = widthMatch[1].replace(/[^\d.]/g, "");
      const height = heightMatch[1].replace(/[^\d.]/g, "");
      if (width && height) {
        viewBox = `0 0 ${width} ${height}`;
      }
    }

    // Insert viewBox after <svg
    normalized = normalized.replace(
      /<svg([^>]*)>/i,
      `<svg$1 viewBox="${viewBox}">`
    );
  }

  // Ensure preserveAspectRatio is set for proper scaling
  if (!preserveAspectRatioMatch) {
    // Insert preserveAspectRatio after viewBox or in the opening tag
    normalized = normalized.replace(
      /(<svg[^>]*viewBox=["'][^"']+["'][^>]*)>/i,
      `$1 preserveAspectRatio="xMidYMid meet">`
    );
    // If no viewBox was added, add preserveAspectRatio after <svg
    if (!normalized.includes("preserveAspectRatio=")) {
      normalized = normalized.replace(
        /(<svg[^>]*)>/i,
        `$1 preserveAspectRatio="xMidYMid meet">`
      );
    }
  } else {
    // Ensure it's set to meet (object-contain behavior)
    normalized = normalized.replace(
      /preserveAspectRatio=["'][^"']*["']/i,
      'preserveAspectRatio="xMidYMid meet"'
    );
  }

  // Remove width and height attributes to let CSS control sizing
  normalized = normalized.replace(/\s+width=["'][^"']+["']/gi, "");
  normalized = normalized.replace(/\s+height=["'][^"']+["']/gi, "");

  // Ensure SVG preserves its original colors and doesn't inherit text color from parent
  // Add style to prevent color inheritance - this preserves explicit stroke/fill colors
  if (!normalized.includes("style=")) {
    normalized = normalized.replace(
      /<svg([^>]*)>/i,
      '<svg$1 style="color: initial;">'
    );
  } else {
    // Append color: initial to existing style to prevent inheritance
    normalized = normalized.replace(
      /style=["']([^"']*)["']/i,
      (match, existingStyle) => {
        if (!existingStyle.includes("color:")) {
          return `style="${existingStyle}; color: initial;"`;
        } else {
          // Replace existing color with initial to prevent inheritance
          return `style="${existingStyle.replace(/color:\s*[^;]+/gi, "color: initial")}"`;
        }
      }
    );
  }

  // Fix clip-path on <g> elements to prevent color rendering issues
  normalized = normalized.replace(/<g([^>]*)>/gi, (match, attrs) => {
    // Check if g element has clip-path attribute
    if (attrs.includes("clip-path=")) {
      // Add or update style to include clip-path: revert
      if (attrs.includes("style=")) {
        return match.replace(
          /style=["']([^"']*)["']/i,
          (styleMatch, existingStyle) => {
            if (!existingStyle.includes("clip-path:")) {
              return `style="${existingStyle}; clip-path: revert;"`;
            }
            return styleMatch;
          }
        );
      } else {
        return `<g${attrs} style="clip-path: revert;">`;
      }
    }
    return match;
  });

  return normalized;
}

// Map of icon names to their public file paths (supports both images and SVGs)
const FILE_ICON_MAP: Record<string, string> = {};

const SKILL_ICON_MAP: Record<string, string> = {
  javascript: "devicon:javascript",
  typescript: "devicon:typescript",
  python: "devicon:python",
  java: "devicon:java",
  cpp: "devicon:cplusplus",
  cplusplus: "devicon:cplusplus",
  csharp: "devicon:csharp",
  go: "devicon:go",
  rust: "devicon:rust",
  php: "devicon:php",
  ruby: "devicon:ruby",
  swift: "devicon:swift",
  kotlin: "devicon:kotlin",
  dart: "devicon:dart",
  scala: "logos:scala",
  selenium: "logos:selenium",

  react: "devicon:react",
  reactnative: "devicon:react",
  vue: "devicon:vuejs",
  angular: "devicon:angularjs",
  svelte: "devicon:svelte",
  nextjs: "devicon:nextjs",
  nuxtjs: "devicon:nuxtjs",
  remix: "logos:remix-icon",
  gatsby: "devicon:gatsby",
  html: "devicon:html5",
  css: "devicon:css3",
  sass: "devicon:sass",
  less: "logos:less",
  tailwindcss: "devicon:tailwindcss",
  bootstrap: "devicon:bootstrap",

  airflow: "logos:airflow-icon",
  bigquery: "svg:bigquery.svg",
  dbt: "logos:dbt-icon",
  hadoop: "logos:hadoop",
  looker: "logos:looker-icon",
  matlab: "devicon:matlab",
  nodejs: "devicon:nodejs",
  plotly: "devicon:plotly",
  powerbi: "logos:microsoft-power-bi",
  express: "skill-icons:expressjs-dark",
  koajs: "logos:koa",
  hapijs: "logos:hapi",
  fastapi: "logos:fastapi-icon",
  django: "logos:django-icon",
  flask: "skill-icons:flask-dark",
  springboot: "devicon:spring",
  aspnet: "logos:dotnet",
  laravel: "devicon:laravel",
  rails: "devicon:rails",
  elixir: "devicon:elixir",

  postgresql: "devicon:postgresql",
  mysql: "devicon:mysql",
  mongodb: "devicon:mongodb",
  redis: "devicon:redis",
  sqlite: "devicon:sqlite",
  oracle: "devicon:oracle",
  dynamodb: "logos:aws-dynamodb",
  cassandra: "logos:cassandra",
  supabase: "logos:supabase-icon",
  snowflake: "logos:snowflake-icon",
  redshift: "logos:aws-redshift",
  scikitlearn: "devicon:scikitlearn",
  tableau: "logos:tableau-icon",

  aws: "devicon:amazonwebservices",
  azure: "devicon:azure",
  gcp: "devicon:googlecloud",
  cloudformation: "logos:aws-cloudformation",
  docker: "devicon:docker",
  kubernetes: "devicon:kubernetes",
  jenkins: "devicon:jenkins",
  githubactions: "logos:github-actions",
  gitlabci: "logos:gitlab-icon",
  travisci: "logos:travis-ci",
  circleci: "logos:circleci",
  clojure: "logos:clojure",

  git: "devicon:git",
  github: "devicon:github",
  gitlab: "devicon:gitlab",
  jira: "devicon:jira",
  confluence: "devicon:confluence",
  figma: "devicon:figma",
  slack: "devicon:slack",
  flutter: "logos:flutter",
  firebase: "logos:firebase-icon",

  jest: "logos:jest",
  cypress: "logos:cypress-icon",
  testinglibrary: "logos:testing-library",
  playwright: "logos:playwright",
  vitest: "logos:vitest",
  mocha: "logos:mocha",

  pandas: "devicon:pandas",
  numpy: "devicon:numpy",
  tensorflow: "devicon:tensorflow",
  pytorch: "devicon:pytorch",
  seaborn: "logos:seaborn-icon",
  matplotlib: "logos:matplotlib-icon",
  influxdb: "logos:influxdb-icon",
  neo4j: "devicon:neo4j",
  nestjs: "logos:nestjs",
  nginx: "logos:nginx",
  oauth: "logos:oauth",
  perl: "skill-icons:perl",
  pytest: "devicon:pytest",
  redux: "logos:redux",

  linux: "devicon:linux",
  bash: "devicon:bash",
  npm: "devicon:npm",
  yarn: "devicon:yarn",
  webpack: "devicon:webpack",
  vite: "devicon:vitejs",
  graphql: "logos:graphql",
  haskell: "logos:haskell-icon",
  restapi: "mdi:world-wide-web",
  sql: "carbon:sql",
  elasticsearch: "logos:elasticsearch",
  rabbitmq: "logos:rabbitmq-icon",
  kafka: "skill-icons:kafka",
  apache: "logos:apache",
  ionic: "logos:ionic-icon",
  jquery: "skill-icons:jquery",
  junit: "devicon:junit",
  jwt: "logos:jwt-icon",
  mobx: "logos:mobx",
  xamarin: "logos:xamarin",
  zustand: "devicon-plain:zustand",
  r: "devicon:r",
};

export function resolveSkillIcon(name: string): string {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (SKILL_ICON_MAP[normalized]) {
    return SKILL_ICON_MAP[normalized];
  }
  for (const [key, icon] of Object.entries(SKILL_ICON_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }
  return "material-symbols:code";
}

interface SkillIconProps {
  name: string;
  className?: string;
  customIconUrl?: string | null;
  iconSvg?: string | null;
}

export function SkillIcon({
  name,
  className,
  customIconUrl,
  iconSvg,
}: SkillIconProps) {
  // Priority 1: If custom SVG is provided (from client skill iconSvg), normalize and render it
  // This allows custom icons to override system icons
  if (iconSvg) {
    // Normalize SVG to ensure proper viewBox and scaling
    const normalizedSvg = normalizeSvgForIcon(iconSvg);

    return (
      <span
        className={cn("inline-flex items-center justify-center", className)}
      >
        <div
          dangerouslySetInnerHTML={{ __html: normalizedSvg }}
          className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain [&>svg_g[clip-path]]:[clip-path:revert] [&>svg_*]:[color:initial]"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            isolation: "isolate", // Create new stacking context to prevent color inheritance
          }}
        />
      </span>
    );
  }

  // Priority 2: If custom icon URL is provided, use it
  if (customIconUrl) {
    return (
      <span
        className={cn("inline-flex items-center justify-center", className)}
      >
        <Image
          src={customIconUrl}
          alt={name}
          width={24}
          height={24}
          className="object-contain"
        />
      </span>
    );
  }

  // Priority 3: Try to resolve from built-in icon map
  const iconName = resolveSkillIcon(name);
  const isImageIcon =
    iconName.startsWith("image:") || iconName.startsWith("svg:");

  // If we found a built-in icon, use it
  if (iconName !== "material-symbols:code") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center",
          iconName,
          className
        )}
      >
        {isImageIcon ? (
          <Image
            src={
              FILE_ICON_MAP[iconName.replace(/^(image|svg):/, "")] ||
              `/images/icons/${iconName.replace(/^(image|svg):/, "")}`
            }
            alt={name}
            width={24}
            height={24}
          />
        ) : (
          <Icon icon={iconName} className="w-full h-full" />
        )}
      </span>
    );
  }

  // Priority 4: Last resort - placeholder icon
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "material-symbols:code",
        className
      )}
    >
      <Icon icon="material-symbols:code" className="w-full h-full" />
    </span>
  );
}
