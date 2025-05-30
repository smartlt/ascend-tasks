import {
  SquirrelTreeSolver,
  BreadthFirstHoleFinder,
  TreeBuilder,
  ITreeNode,
  IHole,
} from "./squirrel-tree";

console.log("🌊 BFS vs DFS Comparison for Squirrel Tree Problem");
console.log("=".repeat(60));

const input = "25,3,ABEG)H)))C)DFIK)L))JM";
const [walnutStr, capacityStr, treeStr] = input.split(",");
const walnuts = parseInt(walnutStr);
const capacity = parseInt(capacityStr);

// Build the tree
const builder = new TreeBuilder();
const root = builder.buildTree(treeStr, capacity);

console.log("\n🌳 Tree Structure:");
printTree(root, 0);

console.log("\n🔍 BFS Hole Discovery (Level by Level):");

// Create BFS finder
const bfsFinder = new BreadthFirstHoleFinder();
const bfsHoles = bfsFinder.findHoles(root);

// Show BFS processing order
const queue: ITreeNode[] = [root];
let level = 0;

while (queue.length > 0) {
  const levelSize = queue.length;
  const currentLevelHoles: IHole[] = [];

  for (let i = 0; i < levelSize; i++) {
    const node = queue.shift()!;

    if (node.canStore()) {
      currentLevelHoles.push(node as IHole);
    }

    for (const child of node.getChildren()) {
      queue.push(child);
    }
  }

  if (currentLevelHoles.length > 0) {
    // Sort level alphabetically
    currentLevelHoles.sort((a, b) =>
      a.getPathFromRoot().localeCompare(b.getPathFromRoot())
    );

    console.log(
      `\n📍 Level ${level} (depth ${level}): ${currentLevelHoles.length} holes`
    );
    currentLevelHoles.forEach((hole, idx) => {
      console.log(
        `   ${
          idx + 1
        }. ${hole.getPathFromRoot()} (capacity: ${hole.getCapacity()})`
      );
    });
  }

  level++;
}

console.log("\n🎯 Final BFS Order (Optimal for 'Closest First'):");
bfsHoles.forEach((hole, idx) => {
  console.log(
    `${(idx + 1).toString().padStart(2)}. ${hole
      .getPathFromRoot()
      .padEnd(6)} (depth: ${hole.getDepth()})`
  );
});

console.log("\n💡 Why BFS is Better:");
console.log("✅ Processes closest holes first (depth 1, then 2, then 3, etc.)");
console.log("✅ Natural level-by-level traversal matches problem requirement");
console.log("✅ No sorting needed - holes come out in optimal order!");
console.log("✅ Early termination possible when enough capacity found");
console.log("✅ Better cache locality (processes related nodes together)");

console.log("\n⚡ Performance Benefits:");
console.log(`• Tree has ${countNodes(root)} total nodes`);
console.log(`• Found ${bfsHoles.length} storage holes`);
console.log(`• BFS: O(n) traversal + O(k log k) per-level sorting`);
console.log(`• Old DFS: O(n) traversal + O(k log k) global sorting`);
console.log(
  `• With early termination: Can stop when sufficient capacity found!`
);

// Test with early termination
console.log("\n🚀 Early Termination Demo:");
console.log(`Need to store ${walnuts} walnuts...`);

let totalCapacity = 0;
let levelsNeeded = 0;
const queueET: ITreeNode[] = [root];
let levelET = 0;

while (queueET.length > 0 && totalCapacity < walnuts) {
  const levelSize = queueET.length;
  const currentLevelHoles: IHole[] = [];

  for (let i = 0; i < levelSize; i++) {
    const node = queueET.shift()!;

    if (node.canStore()) {
      currentLevelHoles.push(node as IHole);
    }

    for (const child of node.getChildren()) {
      queueET.push(child);
    }
  }

  if (currentLevelHoles.length > 0) {
    const levelCapacity = currentLevelHoles.reduce(
      (sum, hole) => sum + hole.getCapacity(),
      0
    );
    totalCapacity += levelCapacity;
    levelsNeeded = levelET;

    console.log(
      `Level ${levelET}: +${levelCapacity} capacity (total: ${totalCapacity})`
    );

    if (totalCapacity >= walnuts) {
      console.log(
        `🎉 Found sufficient capacity! Only need ${
          levelsNeeded + 1
        } levels instead of all ${level - 1} levels.`
      );
      break;
    }
  }

  levelET++;
}

function printTree(node: ITreeNode, depth: number): void {
  const indent = "  ".repeat(depth);
  const nodeType = node.getCapacity() === 0 ? "root" : "storage";
  console.log(
    `${indent}${node.getName()} (${nodeType}, capacity: ${node.getCapacity()})`
  );

  for (const child of node.getChildren()) {
    printTree(child, depth + 1);
  }
}

function countNodes(node: ITreeNode): number {
  let count = 1;
  for (const child of node.getChildren()) {
    count += countNodes(child);
  }
  return count;
}
