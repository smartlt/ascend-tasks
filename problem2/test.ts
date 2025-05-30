import { SquirrelTreeSolver } from "./squirrel-tree";

function runTests(): void {
  const solver = new SquirrelTreeSolver();

  // Test 1: Main example from the problem
  console.log("Test 1: Main example");
  const input1 = "25,3,ABEG)H)))C)DFIK)L))JM";
  const result1 = solver.solve(input1);
  console.log("Input:", input1);
  console.log("Output:", result1);
  console.log();

  // Test 2: Invalid walnut amount
  console.log("Test 2: Invalid walnut amount");
  const input2 = "0,3,ABC))";
  const result2 = solver.solve(input2);
  console.log("Input:", input2);
  console.log("Output:", result2);
  console.log();

  // Test 3: Invalid hole capacity
  console.log("Test 3: Invalid hole capacity");
  const input3 = "5,0,ABC))";
  const result3 = solver.solve(input3);
  console.log("Input:", input3);
  console.log("Output:", result3);
  console.log();

  // Test 4: Simple tree
  console.log("Test 4: Simple tree");
  const input4 = "6,2,ABC)D))";
  const result4 = solver.solve(input4);
  console.log("Input:", input4);
  console.log("Output:", result4);
  console.log();

  // Test 5: Impossible tree (not enough capacity)
  console.log("Test 5: Tree with insufficient capacity");
  const input5 = "10,1,AB)C))";
  const result5 = solver.solve(input5);
  console.log("Input:", input5);
  console.log("Output:", result5);
  console.log();
}

runTests();
