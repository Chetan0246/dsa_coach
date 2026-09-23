export interface ReferenceBook {
  id: string
  title: string
  author: string
  source: string
  url: string
  pdfUrl?: string
  format: 'PDF' | 'Web & PDF' | 'Interactive Cheatsheet'
  license: string
  description: string
  keyTopics: string[]
  recommendedFor: string
}

export const REFERENCE_BOOKS: ReferenceBook[] = [
  {
    id: 'cses-handbook',
    title: "Competitive Programmer's Handbook",
    author: 'Antti Laaksonen (University of Helsinki)',
    source: 'CSES Official Release',
    url: 'https://cses.fi/book/book.pdf',
    pdfUrl: 'https://cses.fi/book/book.pdf',
    format: 'PDF',
    license: 'Creative Commons BY-NC-SA 4.0 (Free)',
    description:
      'The modern gold-standard algorithmic problem-solving book. Teaches pattern-oriented techniques concisely with rigorous time complexity analysis and mathematical intuition.',
    keyTopics: [
      'Two Pointers & Amortized Analysis',
      'Binary Search on Answer Space',
      '1-D & 2-D Dynamic Programming',
      'Tree & Graph Algorithms (DFS, BFS, Dijkstra, Kruskal)',
      'Bit Manipulation & Bitmasks',
      'Range Queries & Sliding Window',
    ],
    recommendedFor: 'Deep understanding of algorithm patterns and search-space optimization.',
  },
  {
    id: 'open-data-structures-java',
    title: 'Open Data Structures (in Java)',
    author: 'Pat Morin (Carleton University)',
    source: 'Open Data Structures Project',
    url: 'https://opendatastructures.org/ods-java.pdf',
    pdfUrl: 'https://opendatastructures.org/ods-java.pdf',
    format: 'PDF',
    license: 'Creative Commons Attribution (Free)',
    description:
      'A comprehensive, mathematically rigorous textbook implementing data structures specifically tailored to the Java Collections Framework (ArrayDeque, HashMap, Skiplist, Heaps).',
    keyTopics: [
      'ArrayDeque & Ring Buffers',
      'Hash Tables (Linear Probing vs Chaining)',
      'Binary Heaps & Priority Queues',
      'Balanced BSTs & Treaps',
      'Graph Representations & Adjacency Lists',
    ],
    recommendedFor: 'Mastering Java Collections internals and memory overhead in technical interviews.',
  },
  {
    id: 'princeton-algorithms-cheatsheet',
    title: 'Algorithms 4th Edition Java Cheatsheet',
    author: 'Robert Sedgewick & Kevin Wayne (Princeton University)',
    source: 'Princeton University Computer Science',
    url: 'https://algs4.cs.princeton.edu/cheatsheet/',
    format: 'Interactive Cheatsheet',
    license: 'Educational / Public Access',
    description:
      'The authoritative reference for asymptotic performance in Java: memory footprint of Java objects/primitives, sorting bounds, priority queues, symbol tables, and graph algorithms.',
    keyTopics: [
      'Java Object & Array Memory Footprints',
      'Sorting Time & Space Lower Bounds',
      'Symbol Table Implementations (BST, Red-Black, Hash)',
      'Graph Search & Minimum Spanning Trees',
      'String Sorting & Tries',
    ],
    recommendedFor: 'Exact memory and complexity verification during problem reflection.',
  },
  {
    id: 'tech-interview-handbook-cheatsheet',
    title: 'Tech Interview Handbook Algorithm Cheatsheet',
    author: 'Yangshun Tay (Meta)',
    source: 'Tech Interview Handbook',
    url: 'https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/',
    format: 'Web & PDF',
    license: 'Free / Community Maintained',
    description:
      'A battle-tested interview cheatsheet with pattern identification tips, corner cases to consider for each data structure, and step-by-step problem-solving templates.',
    keyTopics: [
      'Pattern Identification Heuristics',
      'Edge Case Checklists (Arrays, Trees, Graphs, DP)',
      'Step-by-Step Coding Interview Framework',
      'Common Pitfalls in Technical OAs',
    ],
    recommendedFor: 'Quick pre-interview revision and edge-case sanity checks.',
  },
]

export interface PatternDecisionRule {
  signal: string
  pattern: string
  dataStructure: string
  timeComplexity: string
  spaceComplexity: string
  exampleProblem: string
}

export const PATTERN_DECISION_RULES: PatternDecisionRule[] = [
  {
    signal: 'Contiguous subarray / substring with optimization or condition',
    pattern: 'Sliding Window',
    dataStructure: 'int left = 0, right = 0; int[] freq or Map',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k) or O(1)',
    exampleProblem: 'Longest Substring Without Repeating Characters',
  },
  {
    signal: 'Sorted array / list looking for pairs, triples, or palindromes',
    pattern: 'Two Pointers',
    dataStructure: 'int left = 0, right = n - 1',
    timeComplexity: 'O(n) or O(n log n)',
    spaceComplexity: 'O(1)',
    exampleProblem: 'Two Sum II, 3Sum, Container With Most Water',
  },
  {
    signal: 'Linked list cycle, middle element, or palindrome verification',
    pattern: 'Fast & Slow Pointers',
    dataStructure: 'ListNode slow = head, fast = head',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    exampleProblem: 'Linked List Cycle, Find the Duplicate Number',
  },
  {
    signal: 'Next greater element, next smaller element, or histogram bounds',
    pattern: 'Monotonic Stack',
    dataStructure: 'Deque<Integer> stack = new ArrayDeque<>()',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    exampleProblem: 'Daily Temperatures, Largest Rectangle in Histogram',
  },
  {
    signal: 'Sorted sequence, or "minimize maximum" / "maximize minimum" answer',
    pattern: 'Binary Search',
    dataStructure: 'int low = min, high = max; while (low <= high)',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    exampleProblem: 'Koko Eating Bananas, Search in Rotated Sorted Array',
  },
  {
    signal: 'Top K frequent, Kth largest, or stream median maintenance',
    pattern: 'Heap / Priority Queue',
    dataStructure: 'PriorityQueue<Integer> pq = new PriorityQueue<>()',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    exampleProblem: 'Kth Largest Element in an Array, Top K Frequent Elements',
  },
  {
    signal: 'Tree level-order, shortest path in unweighted graph/grid',
    pattern: 'Tree / Graph BFS',
    dataStructure: 'Queue<TreeNode> q = new ArrayDeque<>()',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    exampleProblem: 'Binary Tree Level Order Traversal, Word Ladder',
  },
  {
    signal: 'Exhaustive search of combinations, permutations, or subsets',
    pattern: 'Backtracking',
    dataStructure: 'List<Integer> path; recurse(); path.remove(size - 1)',
    timeComplexity: 'O(2^n) or O(n!)',
    spaceComplexity: 'O(n) recursion',
    exampleProblem: 'Subsets, Permutations, Combination Sum, Word Search',
  },
  {
    signal: 'Connected components, cycle in undirected graph, dynamic connectivity',
    pattern: 'Union-Find (Disjoint Set)',
    dataStructure: 'int[] parent, rank; find(i) with path compression',
    timeComplexity: 'O(E · α(V)) ≈ O(E)',
    spaceComplexity: 'O(V)',
    exampleProblem: 'Number of Connected Components, Redundant Connection',
  },
  {
    signal: 'Course prerequisites, build order, directed cycle detection',
    pattern: 'Topological Sort',
    dataStructure: 'int[] inDegree, Queue<Integer> q (Kahn’s algorithm)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    exampleProblem: 'Course Schedule, Course Schedule II, Alien Dictionary',
  },
  {
    signal: 'Overlapping intervals, scheduling, merge time blocks',
    pattern: 'Intervals',
    dataStructure: 'Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]))',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    exampleProblem: 'Merge Intervals, Non-overlapping Intervals, Meeting Rooms',
  },
  {
    signal: 'Subarray sum equals K, or counting subarrays with exact condition',
    pattern: 'Prefix Sum + HashMap',
    dataStructure: 'Map<Integer, Integer> map; map.put(0, 1)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    exampleProblem: 'Subarray Sum Equals K, Continuous Subarray Sum',
  },
  {
    signal: 'Optimal substructure with overlapping subproblems, decisions at each step',
    pattern: 'Dynamic Programming',
    dataStructure: 'int[] dp = new int[n + 1] (or rolling variables)',
    timeComplexity: 'O(n) or O(n · m)',
    spaceComplexity: 'O(n) or O(1)',
    exampleProblem: 'Climbing Stairs, Coin Change, Longest Increasing Subsequence',
  },
  {
    signal: 'Duplicate numbers, pair cancellation, power of two, bitmask state',
    pattern: 'Bit Manipulation',
    dataStructure: 'int x = 0; x ^= n; n & (n - 1); 1 << k',
    timeComplexity: 'O(1) or O(n)',
    spaceComplexity: 'O(1)',
    exampleProblem: 'Single Number, Number of 1 Bits, Counting Bits, Reverse Bits',
  },
]
