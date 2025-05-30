// ============ INTERFACES (Abstraction) ============
interface ITreeNode {
  getName(): string;
  getCapacity(): number;
  getStored(): number;
  getDepth(): number;
  getPathFromRoot(): string;
  isLeaf(): boolean;
  isFull(): boolean;
  canStore(): boolean;
  storeWalnut(): boolean;
  addChild(child: ITreeNode): void;
  getChildren(): ITreeNode[];
  getParent(): ITreeNode | null;
}

interface ITreeBuilder {
  buildTree(treeString: string, capacity: number): ITreeNode;
}

interface IHoleFinder {
  findHoles(root: ITreeNode): IHole[];
}

interface IHole extends ITreeNode {
  getPriority(): number;
  compareTo(other: IHole): number;
}

interface IWalnutStorage {
  storeWalnuts(holes: IHole[], walnutCount: number): string[];
}

interface IInputValidator {
  validateInput(input: string): ValidationResult;
}

// ============ VALUE OBJECTS ============
class ValidationResult {
  constructor(
    private readonly _isValid: boolean,
    private readonly _errorMessage: string,
    private readonly _walnuts: number = 0,
    private readonly _capacity: number = 0,
    private readonly _treeString: string = ""
  ) {}

  get isValid(): boolean {
    return this._isValid;
  }
  get errorMessage(): string {
    return this._errorMessage;
  }
  get walnuts(): number {
    return this._walnuts;
  }
  get capacity(): number {
    return this._capacity;
  }
  get treeString(): string {
    return this._treeString;
  }

  static success(
    walnuts: number,
    capacity: number,
    treeString: string
  ): ValidationResult {
    return new ValidationResult(true, "", walnuts, capacity, treeString);
  }

  static error(message: string): ValidationResult {
    return new ValidationResult(false, message);
  }
}

// ============ ABSTRACT BASE CLASSES ============
abstract class AbstractTreeNode implements ITreeNode {
  protected children: ITreeNode[] = [];
  protected parent: ITreeNode | null = null;
  protected stored: number = 0;

  constructor(
    protected readonly name: string,
    protected readonly capacity: number
  ) {}

  getName(): string {
    return this.name;
  }
  getCapacity(): number {
    return this.capacity;
  }
  getStored(): number {
    return this.stored;
  }
  getChildren(): ITreeNode[] {
    return [...this.children];
  }
  getParent(): ITreeNode | null {
    return this.parent;
  }

  addChild(child: ITreeNode): void {
    (child as AbstractTreeNode).parent = this;
    this.children.push(child);
  }

  isLeaf(): boolean {
    return this.children.length === 0;
  }

  isFull(): boolean {
    return this.stored >= this.capacity;
  }

  abstract canStore(): boolean;

  storeWalnut(): boolean {
    if (this.canStore() && !this.isFull()) {
      this.stored++;
      return true;
    }
    return false;
  }

  getDepth(): number {
    if (!this.parent) return 0;
    return this.parent.getDepth() + 1;
  }

  getPathFromRoot(): string {
    if (!this.parent) return this.name;
    return this.parent.getPathFromRoot() + this.name;
  }
}

// ============ CONCRETE NODE CLASSES (Inheritance & Polymorphism) ============
class RootNode extends AbstractTreeNode {
  constructor(name: string) {
    super(name, 0); // Root has no storage capacity
  }

  canStore(): boolean {
    return false; // Root cannot store walnuts
  }
}

class StorageNode extends AbstractTreeNode implements IHole {
  constructor(name: string, capacity: number) {
    super(name, capacity);
  }

  canStore(): boolean {
    return true; // All non-root nodes can store walnuts
  }

  getPriority(): number {
    // Lower number = higher priority (closer to root first)
    return (
      this.getDepth() * 1000 +
      this.getPathFromRoot().charCodeAt(this.getPathFromRoot().length - 1)
    );
  }

  compareTo(other: IHole): number {
    const depthDiff = this.getDepth() - other.getDepth();
    if (depthDiff !== 0) return depthDiff;
    return this.getPathFromRoot().localeCompare(other.getPathFromRoot());
  }
}

// ============ BUILDER PATTERN ============
class TreeBuilder implements ITreeBuilder {
  buildTree(treeString: string, capacity: number): ITreeNode {
    if (!treeString || treeString.length === 0) {
      throw new Error("Empty tree string");
    }

    const nodeStack: ITreeNode[] = [];
    const root = new RootNode(treeString[0]);
    nodeStack.push(root);

    for (let i = 1; i < treeString.length; i++) {
      const char = treeString[i];

      if (char === ")") {
        if (nodeStack.length <= 1) {
          throw new Error("Invalid tree structure");
        }
        nodeStack.pop();
      } else {
        if (nodeStack.length === 0) {
          throw new Error("Invalid tree structure");
        }
        const newNode = new StorageNode(char, capacity);
        const currentParent = nodeStack[nodeStack.length - 1];
        currentParent.addChild(newNode);
        nodeStack.push(newNode);
      }
    }

    return root;
  }
}

// ============ STRATEGY PATTERN ============
class BreadthFirstHoleFinder implements IHoleFinder {
  findHoles(root: ITreeNode): IHole[] {
    const holes: IHole[] = [];
    const queue: ITreeNode[] = [root];

    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevelHoles: IHole[] = [];

      // Process entire current level
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;

        // If this node can store walnuts, add to current level
        if (node.canStore()) {
          currentLevelHoles.push(node as IHole);
        }

        // Add children for next level
        for (const child of node.getChildren()) {
          queue.push(child);
        }
      }

      // Sort current level alphabetically (leftmost first within same depth)
      currentLevelHoles.sort((a, b) =>
        a.getPathFromRoot().localeCompare(b.getPathFromRoot())
      );

      // Add current level holes to result (already in optimal order!)
      holes.push(...currentLevelHoles);
    }

    return holes;
  }
}

class OptimalWalnutStorageWithEarlyTermination implements IWalnutStorage {
  storeWalnuts(holes: IHole[], walnutCount: number): string[] {
    const results: string[] = [];
    let walnutNumber = 1;

    for (const hole of holes) {
      while (!hole.isFull() && walnutNumber <= walnutCount) {
        if (hole.storeWalnut()) {
          results.push(`${walnutNumber}${hole.getPathFromRoot()}`);
          walnutNumber++;
        }
      }

      // Early termination - stop when all walnuts are stored
      if (walnutNumber > walnutCount) break;
    }

    return results;
  }
}

// ============ ADVANCED BFS WITH INTEGRATED EARLY TERMINATION ============
class IntegratedBFSWalnutProcessor implements IWalnutStorage {
  storeWalnuts(holes: IHole[], walnutCount: number): string[] {
    // Note: This method expects holes to be in BFS order already
    // For even better performance, we could integrate hole finding and walnut storage
    return this.storeWalnutsDirectly(holes, walnutCount);
  }

  // Alternative: Integrated BFS that finds holes and stores walnuts in one pass
  storeWalnutsFromTree(root: ITreeNode, walnutCount: number): string[] {
    const results: string[] = [];
    const queue: ITreeNode[] = [root];
    let walnutNumber = 1;

    while (queue.length > 0 && walnutNumber <= walnutCount) {
      const levelSize = queue.length;
      const currentLevelHoles: IHole[] = [];

      // Process entire current level
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;

        // If this node can store walnuts, add to current level
        if (node.canStore()) {
          currentLevelHoles.push(node as IHole);
        }

        // Add children for next level
        for (const child of node.getChildren()) {
          queue.push(child);
        }
      }

      // Sort current level alphabetically (leftmost first within same depth)
      currentLevelHoles.sort((a, b) =>
        a.getPathFromRoot().localeCompare(b.getPathFromRoot())
      );

      // Store walnuts in current level immediately
      for (const hole of currentLevelHoles) {
        while (!hole.isFull() && walnutNumber <= walnutCount) {
          if (hole.storeWalnut()) {
            results.push(`${walnutNumber}${hole.getPathFromRoot()}`);
            walnutNumber++;
          }
        }

        // Early termination - stop when all walnuts are stored
        if (walnutNumber > walnutCount) {
          return results;
        }
      }

      // Early termination - check if we have enough capacity in remaining levels
      const remainingWalnuts = walnutCount - walnutNumber + 1;
      if (remainingWalnuts <= 0) {
        break;
      }
    }

    return results;
  }

  private storeWalnutsDirectly(holes: IHole[], walnutCount: number): string[] {
    const results: string[] = [];
    let walnutNumber = 1;

    for (const hole of holes) {
      while (!hole.isFull() && walnutNumber <= walnutCount) {
        if (hole.storeWalnut()) {
          results.push(`${walnutNumber}${hole.getPathFromRoot()}`);
          walnutNumber++;
        }
      }

      // Early termination
      if (walnutNumber > walnutCount) break;
    }

    return results;
  }
}

// ============ VALIDATOR (Single Responsibility) ============
class InputValidator implements IInputValidator {
  validateInput(input: string): ValidationResult {
    const parts = input.split(",");
    if (parts.length !== 3) {
      return ValidationResult.error("INVALID INPUT FORMAT");
    }

    // Validate walnuts
    const walnutCount = parseInt(parts[0]);
    if (isNaN(walnutCount) || walnutCount <= 0) {
      return ValidationResult.error("INVALID WALNUT AMOUNT");
    }

    // Validate capacity
    const capacity = parseInt(parts[1]);
    if (isNaN(capacity) || capacity <= 0) {
      return ValidationResult.error("INVALID HOLE CAPACITY");
    }

    // Validate tree string
    const treeString = parts[2];
    if (!treeString || treeString.length === 0) {
      return ValidationResult.error("IMPOSSIBLE TREE");
    }

    return ValidationResult.success(walnutCount, capacity, treeString);
  }
}

// ============ MAIN SOLVER (Facade Pattern) ============
class SquirrelTreeSolver {
  private readonly validator: IInputValidator;
  private readonly treeBuilder: ITreeBuilder;
  private readonly holeFinder: IHoleFinder;
  private readonly walnutStorage: IWalnutStorage;

  constructor(
    validator?: IInputValidator,
    treeBuilder?: ITreeBuilder,
    holeFinder?: IHoleFinder,
    walnutStorage?: IWalnutStorage
  ) {
    // Dependency Injection with defaults
    this.validator = validator || new InputValidator();
    this.treeBuilder = treeBuilder || new TreeBuilder();
    this.holeFinder = holeFinder || new BreadthFirstHoleFinder();
    this.walnutStorage = walnutStorage || new IntegratedBFSWalnutProcessor();
  }

  solve(input: string): string {
    try {
      // Step 1: Validate input
      const validation = this.validator.validateInput(input);
      if (!validation.isValid) {
        return validation.errorMessage;
      }

      // Step 2: Build tree
      const root = this.treeBuilder.buildTree(
        validation.treeString,
        validation.capacity
      );

      // Step 3: Find available holes
      const holes = this.holeFinder.findHoles(root);
      if (holes.length === 0) {
        return "IMPOSSIBLE TREE";
      }

      // Step 4: Check capacity
      const totalCapacity = holes.reduce(
        (sum, hole) => sum + hole.getCapacity(),
        0
      );
      if (totalCapacity < validation.walnuts) {
        return "IMPOSSIBLE TREE";
      }

      // Step 5: Store walnuts
      const results = this.walnutStorage.storeWalnuts(
        holes,
        validation.walnuts
      );
      return results.join(" ");
    } catch (error) {
      return "IMPOSSIBLE TREE";
    }
  }
}

// ============ FACTORY PATTERN ============
class SquirrelTreeSolverFactory {
  static createBasicSolver(): SquirrelTreeSolver {
    return new SquirrelTreeSolver();
  }

  static createCustomSolver(
    validator: IInputValidator,
    treeBuilder: ITreeBuilder,
    holeFinder: IHoleFinder,
    walnutStorage: IWalnutStorage
  ): SquirrelTreeSolver {
    return new SquirrelTreeSolver(
      validator,
      treeBuilder,
      holeFinder,
      walnutStorage
    );
  }
}

// ============ LEGACY ALIASES FOR BACKWARD COMPATIBILITY ============
// These are exported to maintain compatibility with existing tests
const TreeNode = AbstractTreeNode;
const DepthFirstHoleFinder = BreadthFirstHoleFinder; // Legacy alias
const OptimalWalnutStorage = OptimalWalnutStorageWithEarlyTermination; // Legacy alias

// ============ MAIN FUNCTION ============
function solveSquirrelTree(): void {
  const fs = require("fs");
  const path = require("path");

  try {
    const inputFile = path.join(__dirname, "input.txt");
    let input: string;

    if (fs.existsSync(inputFile)) {
      input = fs.readFileSync(inputFile, "utf8").trim();
    } else {
      input = "25,3,ABEG)H)))C)DFIK)L))JM";
    }

    const solver = SquirrelTreeSolverFactory.createBasicSolver();
    const result = solver.solve(input);
    console.log(result);
  } catch (error) {
    console.log("IMPOSSIBLE TREE");
  }
}

// ============ EXPORTS ============
export {
  ITreeNode,
  IHole,
  SquirrelTreeSolver,
  SquirrelTreeSolverFactory,
  RootNode,
  StorageNode,
  TreeBuilder,
  BreadthFirstHoleFinder,
  OptimalWalnutStorageWithEarlyTermination,
  IntegratedBFSWalnutProcessor,
  InputValidator,
  TreeNode, // For backward compatibility
  DepthFirstHoleFinder, // Legacy alias pointing to BFS
  OptimalWalnutStorage, // Legacy alias with early termination
};

// Run if this file is executed directly
if (require.main === module) {
  solveSquirrelTree();
}
