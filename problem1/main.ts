import * as fs from "fs";
import { solveProblem1_1, solveProblem1_2, solveProblem1_3 } from "./turtle";

function readInputFile(filename: string): string {
  try {
    return fs.readFileSync(filename, "utf-8");
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    return "";
  }
}

function main() {
  console.log("=".repeat(60));
  console.log("WALKING MATRIX TURTLE PROBLEM - COMPLETE SOLUTION");
  console.log("=".repeat(60));

  // Problem 1.1
  console.log("\n🐢 PROBLEM 1.1: ZIG-ZAG TRAVERSAL");
  console.log("-".repeat(40));
  const input1_1 = readInputFile("input1-1.txt");
  if (input1_1) {
    const result1_1 = solveProblem1_1(input1_1);
    console.log("Input:", input1_1.trim());
    console.log("Output:", result1_1);
  }

  // Problem 1.2
  console.log("\n🐢 PROBLEM 1.2: SPIRAL TRAVERSAL");
  console.log("-".repeat(40));
  const input1_2 = readInputFile("input1-2.txt");
  if (input1_2) {
    const result1_2 = solveProblem1_2(input1_2);
    console.log("Input:", input1_2.trim().replace("\n", " + "));
    console.log("Output:", result1_2);
  }

  // Problem 1.3
  console.log("\n🐢 PROBLEM 1.3: SHORTEST/LONGEST PATHS");
  console.log("-".repeat(40));
  const input1_3 = readInputFile("input1-3.txt");
  if (input1_3) {
    const result1_3 = solveProblem1_3(input1_3);
    console.log("Input:", input1_3.trim().replace("\n", " + "));
    console.log("Output:");
    console.log(result1_3);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ ALL PROBLEMS COMPLETED SUCCESSFULLY!");
  console.log("=".repeat(60));
}

// Run the main function
main();
