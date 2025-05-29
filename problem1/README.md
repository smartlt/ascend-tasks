# Walking Matrix Turtle Problem - Complete Solution

## Overview

This solution implements all three parts of the Walking Matrix Turtle Problem using TypeScript with proper error handling, clean code structure, and comprehensive testing.

## Problems Solved

### Problem 1.1 - Zig-Zag Traversal

- **Description**: Starting from coordinate (0,0), traverse the matrix in zig-zag pattern (S then N alternating by columns)
- **Input**: Matrix only
- **Output**: Comma-separated values in traversal order
- **Example**: `7,8,7,4,6,8,1,5,7,8,4,2,0,8,8,2,7,8,5,8,7,8,6,1,0,9,9,0,0,4,5,7,0,0,3,2,9,3,6,7,2,2`

### Problem 1.2 - Spiral Traversal

- **Description**: From given starting point, traverse matrix in clockwise spiral pattern to center
- **Input**: Matrix + starting coordinates [x,y]
- **Output**: Comma-separated values in spiral order
- **Example**: `8,8,9,0,6,7,2,2,5,4,5,8,1,8,6,4,7,8,7,2,0,1,0,2,9,3,3,9,6,8,4`

### Problem 1.3 - Shortest/Longest Paths

- **Description**: Find shortest and longest single-direction paths from start value to target value
- **Input**: Matrix + [start_value, target_value]
- **Output**: All paths with SHORTEST/LONGEST labels
- **Example**:
  ```
  S 2,4,8
  N 2,8 SHORTEST
  S 2,7,8
  W 2,7,0,8
  W 2,5,4,5,8 LONGEST
  ```

## Architecture

### Core Classes

- **`MatrixTurtle`**: Main class containing all algorithms
  - `zigZagTraversal()`: Implements Problem 1.1
  - `spiralTraversal(x, y)`: Implements Problem 1.2
  - `findPaths(start, target)`: Implements Problem 1.3
  - `findValue(value)`: Helper to find all positions of a value

### Key Features

- ✅ **Type Safety**: Full TypeScript implementation with proper types
- ✅ **Error Handling**: Comprehensive error handling for all edge cases
- ✅ **Clean Code**: Well-structured, readable code with meaningful names
- ✅ **Modular Design**: Separate functions for parsing, solving, and utilities
- ✅ **Efficient Algorithms**: Optimized single-direction pathfinding approach

## File Structure

```
problem1/
├── turtle.ts           # Main implementation with all algorithms
├── main.ts            # Complete test runner for all problems
├── input1-1.txt       # Input file for Problem 1.1
├── input1-2.txt       # Input file for Problem 1.2
├── input1-3.txt       # Input file for Problem 1.3
├── tsconfig.json      # TypeScript configuration
├── package.json       # Node.js dependencies
└── README.md          # This documentation
```

## How to Run

### Prerequisites

- Node.js installed
- TypeScript installed (`npm install typescript`)

### Running the Complete Solution

```bash
npm install
npx ts-node main.ts
```

### Running Individual Problems

```bash
# Test Problem 1.1
npx ts-node -e "
import { solveProblem1_1 } from './turtle';
import * as fs from 'fs';
console.log(solveProblem1_1(fs.readFileSync('input1-1.txt', 'utf-8')));
"

# Test Problem 1.2
npx ts-node -e "
import { solveProblem1_2 } from './turtle';
import * as fs from 'fs';
console.log(solveProblem1_2(fs.readFileSync('input1-2.txt', 'utf-8')));
"

# Test Problem 1.3
npx ts-node -e "
import { solveProblem1_3 } from './turtle';
import * as fs from 'fs';
console.log(solveProblem1_3(fs.readFileSync('input1-3.txt', 'utf-8')));
"
```

## Algorithm Complexity

### Problem 1.1 - Zig-Zag Traversal

- **Time Complexity**: O(n×m) where n=rows, m=columns
- **Space Complexity**: O(n×m) for result storage

### Problem 1.2 - Spiral Traversal

- **Time Complexity**: O(n×m)
- **Space Complexity**: O(n×m) for visited tracking and result

### Problem 1.3 - Pathfinding

- **Time Complexity**: O(k×max(n,m)) where k=number of start positions
- **Space Complexity**: O(p) where p=number of valid paths found

## Input/Output Format

### Input Files

All input files follow the format:

```
[matrix_as_json]
[coordinates_as_json]  # Only for Problems 1.2 and 1.3
```

### Output Format

- **Problem 1.1**: Single line of comma-separated values
- **Problem 1.2**: Single line of comma-separated values
- **Problem 1.3**: Multiple lines with direction, path, and type (SHORTEST/LONGEST)

## Testing Results

The solution has been tested with the provided input files and produces correct outputs matching the expected format. All edge cases are handled appropriately with proper error messages.

## Author

Solution developed for Programming and Algorithm Test (rel:202501)
