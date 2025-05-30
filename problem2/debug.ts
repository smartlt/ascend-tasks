import {
  SquirrelTreeSolver,
  ITreeNode,
  IHole,
  RootNode,
  StorageNode,
} from "./squirrel-tree";

class DebugSquirrelTreeSolver extends SquirrelTreeSolver {
  debugSolve(input: string): void {
    console.log("=== DEBUGGING SQUIRREL TREE ===");
    console.log("Input:", input);

    const parts = input.split(",");
    const walnuts = parseInt(parts[0]);
    const capacity = parseInt(parts[1]);
    const treeString = parts[2];

    console.log("Walnuts:", walnuts);
    console.log("Capacity per hole:", capacity);
    console.log("Tree string:", treeString);

    try {
      // Parse tree manually for debugging
      const root = this.debugParseTree(treeString, capacity);
      console.log("\n=== TREE STRUCTURE ===");
      this.printTree(root, 0);

      // Find holes
      const holes: IHole[] = [];
      this.debugCollectLeafNodes(root, holes);

      console.log("\n=== HOLES FOUND ===");
      holes.forEach((hole, index) => {
        console.log(
          `Hole ${
            index + 1
          }: ${hole.getPathFromRoot()} (depth: ${hole.getDepth()}, capacity: ${hole.getCapacity()})`
        );
      });

      // Sort holes
      holes.sort((a, b) => {
        const depthDiff = a.getDepth() - b.getDepth();
        if (depthDiff !== 0) return depthDiff;
        return a.getPathFromRoot().localeCompare(b.getPathFromRoot());
      });

      console.log("\n=== SORTED HOLES ===");
      holes.forEach((hole, index) => {
        console.log(
          `${index + 1}. ${hole.getPathFromRoot()} (depth: ${hole.getDepth()})`
        );
      });

      const totalCapacity = holes.reduce(
        (sum, hole) => sum + hole.getCapacity(),
        0
      );
      console.log("\nTotal capacity:", totalCapacity);
      console.log("Required walnuts:", walnuts);

      if (totalCapacity >= walnuts) {
        console.log("\n=== WALNUT STORAGE SIMULATION ===");
        const results = this.debugStoreWalnuts(holes, walnuts);
        console.log("Result:", results);
      } else {
        console.log("INSUFFICIENT CAPACITY");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  private debugParseTree(treeString: string, capacity: number): ITreeNode {
    let index = 0;
    const nodeStack: ITreeNode[] = [];

    const root = new RootNode(treeString[0]); // Use concrete RootNode class
    nodeStack.push(root);
    index++;

    console.log(`\nParsing tree: ${treeString}`);
    console.log(`Step 0: Created root '${root.getName()}'`);

    while (index < treeString.length) {
      const char = treeString[index];

      if (char === ")") {
        if (nodeStack.length <= 1) {
          throw new Error("Invalid tree structure");
        }
        const popped = nodeStack.pop();
        console.log(
          `Step ${index}: ')' - Going back from '${popped?.getName()}' to '${nodeStack[
            nodeStack.length - 1
          ]?.getName()}'`
        );
      } else {
        if (nodeStack.length === 0) {
          throw new Error("Invalid tree structure");
        }
        const newNode = new StorageNode(char, capacity); // Use concrete StorageNode class
        const currentParent = nodeStack[nodeStack.length - 1];
        currentParent.addChild(newNode);
        nodeStack.push(newNode);
        console.log(
          `Step ${index}: Added '${char}' as child of '${currentParent.getName()}'`
        );
      }
      index++;
    }

    return root;
  }

  private printTree(node: ITreeNode, depth: number): void {
    const indent = "  ".repeat(depth);
    console.log(
      `${indent}${node.getName()} (capacity: ${node.getCapacity()}, leaf: ${node.isLeaf()})`
    );
    for (const child of node.getChildren()) {
      this.printTree(child, depth + 1);
    }
  }

  private debugCollectLeafNodes(node: ITreeNode, holes: IHole[]): void {
    // All non-root nodes can store walnuts (not just leaves)
    if (node.getParent() !== null) {
      // Root has no parent, so exclude it
      holes.push(node as IHole);
      console.log(
        `Found hole: ${node.getName()} at path ${node.getPathFromRoot()} (leaf: ${node.isLeaf()})`
      );
    }

    for (const child of node.getChildren()) {
      this.debugCollectLeafNodes(child, holes);
    }
  }

  private debugStoreWalnuts(holes: IHole[], totalWalnuts: number): string {
    const results: string[] = [];
    let walnutNumber = 1;

    for (const hole of holes) {
      console.log(`\nProcessing hole: ${hole.getPathFromRoot()}`);
      while (!hole.isFull() && walnutNumber <= totalWalnuts) {
        const path = `${walnutNumber}${hole.getPathFromRoot()}`;
        results.push(path);
        hole.storeWalnut(); // Use the proper OOP method
        console.log(
          `  Walnut ${walnutNumber}: ${path} (hole now has ${hole.getStored()}/${hole.getCapacity()})`
        );
        walnutNumber++;
      }

      if (walnutNumber > totalWalnuts) break;
    }

    return results.join(" ");
  }
}

// Run debug
const debugSolver = new DebugSquirrelTreeSolver();
debugSolver.debugSolve("25,3,ABEG)H)))C)DFIK)L))JM");
