import { SkillSeedData } from "../../types";

export const perlSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Perl",
      skillNormalized: "perl",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which shebang line runs a Perl script on Unix systems?",
        options: [
          "#!/usr/bin/env perl",
          "#!/usr/bin/env python",
          "#!/bin/bash perl",
          "#!/usr/local/perl3",
        ],
        correctAnswer: "#!/usr/bin/env perl",
        explanation:
          "Using env ensures the script uses the first perl executable on PATH.",
      },
      associatedSkills: ["perl"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which statement prints text to STDOUT?",
        options: [
          'print "Hello\\n";',
          'puts "Hello";',
          'echo "Hello";',
          'console.log("Hello");',
        ],
        correctAnswer: 'print "Hello\\n";',
        explanation:
          "Perl's print writes to STDOUT; newline must be supplied manually.",
      },
      associatedSkills: ["perl"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which variable stores command-line arguments?",
        options: ["@ARGV", "$ARGV", "%ARGV", "$args"],
        correctAnswer: "@ARGV",
        explanation:
          "@ARGV holds positional command-line arguments; $ARGV[n] accesses individual values.",
      },
      associatedSkills: ["perl"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which syntax declares a scalar variable?",
        options: ["my $name", "$name := value", "var name", "scalar name"],
        correctAnswer: "my $name",
        explanation:
          "Scalars start with $, arrays with @, hashes with %; my scopes the variable lexically.",
      },
      associatedSkills: ["perl"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which operator performs string concatenation?",
        options: [".", "+", "++", "cat"],
        correctAnswer: ".",
        explanation:
          "Perl uses . for string concatenation, mirroring PHP and other languages.",
      },
      associatedSkills: ["perl"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question:
          "Complete the regex substitution that replaces foo with bar globally.",
        segments: [
          { text: "$text =~ s/foo/bar/", block: false },
          { text: "g", block: true },
          { text: ";", block: false },
        ],
        blocks: ["g", "i", "m"],
        correctAnswer: ["g"],
        explanation:
          "The g modifier applies substitution globally rather than just the first match.",
      },
      associatedSkills: ["perl"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which module manages dependencies and installs packages from CPAN?",
        options: ["cpanm / CPAN", "pip", "npm", "cargo"],
        correctAnswer: "cpanm / CPAN",
        explanation:
          "CPAN shell or cpanm installs Perl modules and their dependencies.",
      },
      associatedSkills: ["perl"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "What does 'use strict;' enforce?",
        options: [
          "Requires variable declarations and forbids symbolic references",
          "Enables warnings",
          "Optimizes regexes",
          "Locks filehandles",
        ],
        correctAnswer:
          "Requires variable declarations and forbids symbolic references",
        explanation:
          "use strict forces lexical declarations and safer code, preventing typos and symbolic references.",
      },
      associatedSkills: ["perl"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which object system library provides modern OO syntax in Perl?",
        options: ["Moose", "Laravel", "Dancer", "Rakudo"],
        correctAnswer: "Moose",
        explanation:
          "Moose (and its lightweight sibling Moo) provide declarative class syntax, roles, and type constraints.",
      },
      associatedSkills: ["perl"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To build asynchronous workflows, which Perl module offers event loops/promises?",
        options: ["AnyEvent", "Tk", "CGI", "DBI"],
        correctAnswer: "AnyEvent",
        explanation:
          "AnyEvent provides a unified interface to various event loops, enabling asynchronous network programs.",
      },
      associatedSkills: ["perl"],
    },
  ],
};
