// Problem 1: Walking Matrix Turtle Problem
// Complete solution for all three sub-problems

class MatrixTurtle {
  matrix: number[][];
  rows: number;
  cols: number;
  constructor(matrix: number[][]) {
    this.matrix = matrix;
    this.rows = matrix.length;
    this.cols = matrix[0].length;
  }

  // Problem 1.1: Zig-zag traversal starting from (0,0)
  zigZagTraversal(): string {
    const result: number[] = [];

    for (let col = 0; col < this.cols; col++) {
      if (col % 2 === 0) {
        // Even columns: go from top to bottom (S direction)
        for (let row = 0; row < this.rows; row++) {
          result.push(this.matrix[row][col]);
        }
      } else {
        // Odd columns: go from bottom to top (N direction)
        for (let row = this.rows - 1; row >= 0; row--) {
          result.push(this.matrix[row][col]);
        }
      }
    }

    return result.join(",");
  }

  // Problem 1.2: Spiral traversal from given point to center (clockwise)
  spiralTraversal(startX: number, startY: number): string {
    const result: number[] = [];
    const visited = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(false));

    const startingRow = startX; // Remember the starting row (Y position)

    let x = startX;
    let y = startY;

    // Start by adding the starting position
    visited[x][y] = true;
    result.push(this.matrix[x][y]);

    // Direction: 0=East(Right), 1=South(Down), 2=West(Left), 3=North(Up)
    let direction = 0;
    const directions = [
      [0, 1], // East (Right)
      [1, 0], // South (Down)
      [0, -1], // West (Left)
      [-1, 0], // North (Up)
    ];

    while (true) {
      let moved = false;

      // Try to move in current direction
      let dx = directions[direction][0];
      let dy = directions[direction][1];

      // Keep moving in current direction while possible
      while (true) {
        let nextX = x + dx;
        let nextY = y + dy;

        // Check bounds
        if (
          nextX < 0 ||
          nextX >= this.rows ||
          nextY < 0 ||
          nextY >= this.cols
        ) {
          break;
        }

        // Check if already visited
        if (visited[nextX][nextY]) {
          break;
        }

        // Special rule: when going North (up), stop at starting row
        if (direction === 3 && nextX <= startingRow) {
          break;
        }

        // Move to next position
        x = nextX;
        y = nextY;
        visited[x][y] = true;
        result.push(this.matrix[x][y]);
        moved = true;
      }

      // If we moved, continue with next direction (clockwise)
      if (moved) {
        direction = (direction + 1) % 4;
        continue;
      }

      // If we can't move in current direction, try turning clockwise
      let foundDirection = false;
      for (let i = 0; i < 4; i++) {
        direction = (direction + 1) % 4;
        dx = directions[direction][0];
        dy = directions[direction][1];
        let nextX = x + dx;
        let nextY = y + dy;

        if (
          nextX >= 0 &&
          nextX < this.rows &&
          nextY >= 0 &&
          nextY < this.cols &&
          !visited[nextX][nextY]
        ) {
          // Special rule: when going North (up), stop at starting row
          if (direction === 3 && nextX <= startingRow) {
            continue; // Try next direction
          }

          foundDirection = true;
          break;
        }
      }

      // If no direction works, we're done
      if (!foundDirection) {
        break;
      }
    }

    return result.join(",");
  }

  // Problem 1.3: Find shortest and longest paths to target (optimized)
  findPaths(startValue: number, targetValue: number): string {
    const startPositions = this.findValue(startValue);
    const endPositions = this.findValue(targetValue);

    if (startPositions.length === 0 || endPositions.length === 0) {
      return "NO ROUTE";
    }

    // Track paths and lengths efficiently
    const pathsInfo: {
      direction: string;
      startPos: number[];
      endPos: number[];
      length: number;
    }[] = [];
    let shortestLength = Infinity;
    let longestLength = 0;

    // Check each start position against each end position
    for (const startPos of startPositions) {
      for (const endPos of endPositions) {
        const [startRow, startCol] = startPos;
        const [endRow, endCol] = endPos;

        // Check if they share the same row (can go East or West)
        if (startRow === endRow && startCol !== endCol) {
          const direction = startCol < endCol ? "E" : "W";
          const length = Math.abs(endCol - startCol) + 1; // +1 to include both endpoints

          pathsInfo.push({ direction, startPos, endPos, length });
          shortestLength = Math.min(shortestLength, length);
          longestLength = Math.max(longestLength, length);
        }

        // Check if they share the same column (can go North or South)
        if (startCol === endCol && startRow !== endRow) {
          const direction = startRow < endRow ? "S" : "N";
          const length = Math.abs(endRow - startRow) + 1; // +1 to include both endpoints

          pathsInfo.push({ direction, startPos, endPos, length });
          shortestLength = Math.min(shortestLength, length);
          longestLength = Math.max(longestLength, length);
        }
      }
    }

    if (pathsInfo.length === 0) {
      return "NO ROUTE";
    }

    // Sort paths by length (shortest first)
    pathsInfo.sort((a, b) => a.length - b.length);

    const result: string[] = [];

    // Generate full paths only for the results we need
    for (const pathInfo of pathsInfo) {
      const { direction, startPos, endPos, length } = pathInfo;
      const [startRow, startCol] = startPos;
      const [endRow, endCol] = endPos;

      // Generate the actual path
      const path: number[] = [];

      if (startRow === endRow) {
        // Horizontal path
        const step = startCol < endCol ? 1 : -1;
        for (let col = startCol; col !== endCol + step; col += step) {
          path.push(this.matrix[startRow][col]);
        }
      } else {
        // Vertical path
        const step = startRow < endRow ? 1 : -1;
        for (let row = startRow; row !== endRow + step; row += step) {
          path.push(this.matrix[row][startCol]);
        }
      }

      let suffix = "";
      if (length === shortestLength) {
        suffix = " SHORTEST";
      } else if (length === longestLength) {
        suffix = " LONGEST";
      }

      result.push(`${direction} ${path.join(",")}${suffix}`);
    }

    return result.join("\n");
  }

  findValue(value: number): number[][] {
    const positions: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.matrix[i][j] === value) {
          positions.push([i, j]);
        }
      }
    }
    return positions;
  }

  // Alternative: Ultra-fast path existence check (when you only need to know if paths exist)
  hasPath(startValue: number, targetValue: number): boolean {
    const startPositions = this.findValue(startValue);
    const endPositions = this.findValue(targetValue);

    if (startPositions.length === 0 || endPositions.length === 0) {
      return false;
    }

    // Early termination - return true as soon as we find any valid path
    for (const startPos of startPositions) {
      for (const endPos of endPositions) {
        const [startRow, startCol] = startPos;
        const [endRow, endCol] = endPos;

        // Same row or same column = valid path exists
        if (
          (startRow === endRow && startCol !== endCol) ||
          (startCol === endCol && startRow !== endRow)
        ) {
          return true; // Early exit!
        }
      }
    }

    return false;
  }

  // Memory-efficient version for very large matrices
  findPathsLazy(startValue: number, targetValue: number): string {
    // For huge matrices, you could also optimize findValue() by:
    // 1. Using a hash map to pre-index positions by value
    // 2. Breaking early if you find enough paths
    // 3. Processing in chunks for memory-constrained environments

    return this.findPaths(startValue, targetValue); // Falls back to optimized version
  }
}

function parseMatrixFromFile(content: string): {
  matrix: number[][];
  coords: number[] | null;
} {
  try {
    const lines = content.trim().split("\n");
    const matrixStr = lines[0];
    const matrix = JSON.parse(matrixStr);

    const coords = lines.length > 1 ? JSON.parse(lines[1]) : null;

    return { matrix, coords };
  } catch (error: any) {
    throw new Error("Invalid input format");
  }
}

function solveProblem1_1(inputContent: string): string {
  try {
    const { matrix } = parseMatrixFromFile(inputContent);
    const turtle = new MatrixTurtle(matrix);
    return turtle.zigZagTraversal();
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

function solveProblem1_2(inputContent: string): string {
  try {
    const { matrix, coords } = parseMatrixFromFile(inputContent);
    if (!coords || coords.length !== 2) {
      throw new Error("Invalid coordinates format");
    }

    const turtle = new MatrixTurtle(matrix);
    // coords should be [x, y] format for spiral traversal
    return turtle.spiralTraversal(coords[0], coords[1]);
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

function solveProblem1_3(inputContent: string): string {
  try {
    const { matrix, coords } = parseMatrixFromFile(inputContent);
    if (!coords || coords.length !== 2) {
      throw new Error("Invalid coordinates format");
    }

    const turtle = new MatrixTurtle(matrix);
    return turtle.findPaths(coords[0], coords[1]);
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

export { MatrixTurtle, solveProblem1_1, solveProblem1_2, solveProblem1_3 };
