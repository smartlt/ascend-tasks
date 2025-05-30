# Squirrel Tree Problem Solution (Advanced OOP Implementation)

This TypeScript solution demonstrates **advanced Object-Oriented Programming principles** while solving the squirrel tree walnut storage problem.

## Problem Description

A squirrel needs to store walnuts in holes within a tree structure. The squirrel:

- Starts at the root with all walnuts
- Can only carry one walnut per trip
- Prefers leftmost branches first
- Stores walnuts in the closest holes first
- Returns to root after each storage

## 🎯 OOP Features Demonstrated

### **Four Pillars of OOP**

- **Encapsulation**: Private fields with controlled access via getters
- **Abstraction**: Interfaces define clear contracts (`ITreeNode`, `IHole`, etc.)
- **Inheritance**: `RootNode` and `StorageNode` extend `AbstractTreeNode`
- **Polymorphism**: Different node types behave differently (`canStore()` method)

### **SOLID Principles**

- **S**ingle Responsibility: Each class has one clear purpose
- **O**pen/Closed: Extensible via interfaces, closed for modification
- **L**iskov Substitution: Subtypes are fully substitutable
- **I**nterface Segregation: Small, focused interfaces
- **D**ependency Inversion: Depends on abstractions, not concretions

### **Design Patterns**

- **Strategy Pattern**: `IHoleFinder` allows different hole-finding algorithms
- **Builder Pattern**: `TreeBuilder` constructs complex tree structures
- **Factory Pattern**: `SquirrelTreeSolverFactory` creates configured instances
- **Facade Pattern**: `SquirrelTreeSolver` provides simple interface to complex system

## Usage

### Prerequisites

- Node.js installed
- TypeScript compiler (optional, for development)

### Running the Solution

1. **With input file**: Place your input in `input.txt` and run:

   ```bash
   npm install
   npm run build
   npm start
   ```

2. **Direct execution**: The solution will use the example input if no file is found.

3. **For development/testing**:
   ```bash
   npm install
   npm run dev
   ```

### Advanced Usage (OOP Features)

```typescript
import {
  SquirrelTreeSolverFactory,
  InputValidator,
  TreeBuilder,
  DepthFirstHoleFinder,
  OptimalWalnutStorage,
} from "./squirrel-tree";

// Use factory for simple creation
const solver = SquirrelTreeSolverFactory.createBasicSolver();

// Or create with custom components (Dependency Injection)
const customSolver = SquirrelTreeSolverFactory.createCustomSolver(
  new InputValidator(),
  new TreeBuilder(),
  new DepthFirstHoleFinder(),
  new OptimalWalnutStorage()
);

const result = solver.solve("25,3,ABEG)H)))C)DFIK)L))JM");
```

### Input Format

```
walnuts,capacity,tree_string
```

Example: `25,3,ABEG)H)))C)DFIK)L))JM`

- 25 walnuts to store
- Each hole can store up to 3 walnuts
- Tree structure encoded as string

### Tree String Format

- Letters represent nodes
- `)` represents moving back up the tree
- Root node has no storage capacity

### Output Format

Shows the path for each walnut:

```
1AB 2AB 3AB 4AC 5AC 6AC 7AD 8AD 9AD 10ABE 11ABE 12ABE 13ADF 14ADF 15ADF 16ABEG 17ABEG 18ABEG 19ABEH 20ABEH 21ABEH 22ADFI 23ADFI 24ADFI 25ADFJ
```

### Error Handling

- `INVALID WALNUT AMOUNT`: Walnut count ≤ 0
- `INVALID HOLE CAPACITY`: Hole capacity ≤ 0
- `IMPOSSIBLE TREE`: Tree structure invalid or insufficient capacity

## Algorithm

1. **Input Validation**: Using `InputValidator` with proper error handling
2. **Tree Construction**: `TreeBuilder` creates polymorphic node hierarchy
3. **Hole Discovery**: `DepthFirstHoleFinder` implements strategy pattern
4. **Optimal Storage**: `OptimalWalnutStorage` handles walnut placement logic
