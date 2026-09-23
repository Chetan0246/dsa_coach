export interface ReferenceBook {
  id: string
  title: string
  author: string
  source: string
  url: string
  pdfUrl?: string
  format: 'PDF' | 'Web & PDF' | 'Interactive Cheatsheet' | 'Open Source Handbook'
  license: string
  description: string
  keyTopics: string[]
  recommendedFor: string
  quickLinks?: { label: string; url: string }[]
}

export interface ExternalResource {
  id: string
  title: string
  provider: string
  url: string
  category: 'Cheatsheet' | 'Visualizer' | 'Problem List' | 'Video Guide'
  description: string
}

export const REFERENCE_BOOKS: ReferenceBook[] = [
  {
    id: 'dsa-handbook-interviews',
    title: 'DSA Handbook for Coding Interviews',
    author: 'Tharun Kumar Reddy Polu',
    source: 'GitHub Open Source (MIT License)',
    url: 'https://github.com/TharunKumarReddyPolu/DSA-Handbook-for-Coding-Interviews',
    format: 'Open Source Handbook',
    license: 'MIT License (Free & Open Source)',
    description:
      'A comprehensive, high-impact DSA handbook tailored for last-minute coding interview prep. Each topic covers pattern recognition guides ("When to Use" indicators & "When NOT to Use"), edge cases & pitfalls, multi-language implementations (Java, Python, C++), complexity tables, and curated LeetCode problem tiers.',
    keyTopics: [
      'Pattern Recognition: When to Use & Indicators',
      'When NOT to Use (Common Misconceptions)',
      'Multi-Language Code: Java, Python & C++',
      'Edge Cases & Anti-Patterns Checklist',
      'Parametric Binary Search (Search on Answer)',
      'Cyclic Sort, Monotonic Stack & Intervals',
      'Dynamic Programming & Backtracking Frameworks',
    ],
    recommendedFor: 'Pattern-based decision making, edge-case checklists, and multi-language implementation references.',
    quickLinks: [
      {
        label: 'Binary Search',
        url: 'https://github.com/TharunKumarReddyPolu/DSA-Handbook-for-Coding-Interviews/blob/main/Topics/binary-search.md',
      },
      {
        label: 'Dynamic Programming',
        url: 'https://github.com/TharunKumarReddyPolu/DSA-Handbook-for-Coding-Interviews/blob/main/Topics/dynamic-programming.md',
      },
      {
        label: 'Tree & Trie',
        url: 'https://github.com/TharunKumarReddyPolu/DSA-Handbook-for-Coding-Interviews/blob/main/Topics/tree.md',
      },
      {
        label: 'Graph & Topo Sort',
        url: 'https://github.com/TharunKumarReddyPolu/DSA-Handbook-for-Coding-Interviews/blob/main/Topics/graph.md',
      },
      {
        label: 'Intervals',
        url: 'https://github.com/TharunKumarReddyPolu/DSA-Handbook-for-Coding-Interviews/blob/main/Topics/intervals.md',
      },
      {
        label: 'Cyclic Sort',
        url: 'https://github.com/TharunKumarReddyPolu/DSA-Handbook-for-Coding-Interviews/blob/main/Topics/cyclic-sort.md',
      },
      {
        label: 'Heap & Priority Queue',
        url: 'https://github.com/TharunKumarReddyPolu/DSA-Handbook-for-Coding-Interviews/blob/main/Topics/heap-pq.md',
      },
      {
        label: 'Backtracking',
        url: 'https://github.com/TharunKumarReddyPolu/DSA-Handbook-for-Coding-Interviews/blob/main/Topics/backtracking.md',
      },
      {
        label: 'Stack & Monotonic Stack',
        url: 'https://github.com/TharunKumarReddyPolu/DSA-Handbook-for-Coding-Interviews/blob/main/Topics/stack.md',
      },
    ],
  },
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

export const EXTERNAL_RESOURCES: ExternalResource[] = [
  {
    id: 'algomonster-keywords',
    title: 'AlgoMonster: Keyword to Algo',
    provider: 'AlgoMonster',
    url: 'https://algo.monster/problems/keyword_to_algo',
    category: 'Cheatsheet',
    description:
      'Maps common problem prompt keywords directly to their algorithmic patterns and templates.',
  },
  {
    id: 'sean-prashad-patterns',
    title: 'Sean Prashad LeetCode Patterns',
    provider: 'Sean Prashad',
    url: 'https://seanprashad.com/leetcode-patterns/',
    category: 'Problem List',
    description:
      '178 curated interview questions grouped strictly by pattern with difficulty tiers and completion tracking.',
  },
  {
    id: 'algomaster-animations',
    title: 'AlgoMaster DSA Animations',
    provider: 'AlgoMaster',
    url: 'https://algomaster.io/animations/dsa',
    category: 'Visualizer',
    description:
      '600+ interactive animations demonstrating pointer motions, heap shifts, tree balances, and graph traversals.',
  },
  {
    id: 'big-o-cheatsheet',
    title: 'Big-O Algorithm Complexity Cheat Sheet',
    provider: 'Free Code Camp / BigOCheatSheet',
    url: 'https://www.bigocheatsheet.com/',
    category: 'Cheatsheet',
    description:
      'Visual asymptotic chart of time and space complexities for all primary data structures and sorting algorithms.',
  },
  {
    id: 'neetcode-roadmap',
    title: 'NeetCode 150 Pattern Roadmap',
    provider: 'NeetCode',
    url: 'https://neetcode.io/roadmap',
    category: 'Video Guide',
    description:
      'Interactive visual roadmap and video walkthroughs for the top 150 pattern-based interview problems.',
  },
]

export interface PatternDecisionRule {
  signal: string
  pattern: string
  dataStructure: string
  timeComplexity: string
  spaceComplexity: string
  exampleProblem: string
  whenNotToUse?: string
}

export const PATTERN_DECISION_RULES: PatternDecisionRule[] = [
  {
    signal: 'Contiguous subarray / substring with optimization or condition',
    pattern: 'Sliding Window',
    dataStructure: 'int left = 0, right = 0; int[] freq or Map',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k) or O(1)',
    exampleProblem: 'Longest Substring Without Repeating Characters',
    whenNotToUse:
      'Array contains negative numbers with target sum constraints (window sum is not monotonic — use Prefix Sum + HashMap instead).',
  },
  {
    signal: 'Sorted array / list looking for pairs, triples, or palindromes',
    pattern: 'Two Pointers',
    dataStructure: 'int left = 0, right = n - 1',
    timeComplexity: 'O(n) or O(n log n)',
    spaceComplexity: 'O(1)',
    exampleProblem: 'Two Sum II, 3Sum, Container With Most Water',
    whenNotToUse:
      'Array is unsorted and sorting is too slow or destroys original indices required by the problem return value.',
  },
  {
    signal: 'Linked list cycle, middle element, or palindrome verification',
    pattern: 'Fast & Slow Pointers',
    dataStructure: 'ListNode slow = head, fast = head',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    exampleProblem: 'Linked List Cycle, Find the Duplicate Number',
    whenNotToUse:
      'Arbitrary node jumping or multi-branch tree/graph structures (use standard BFS/DFS with a visited Set).',
  },
  {
    signal: 'Next greater element, next smaller element, or histogram bounds',
    pattern: 'Monotonic Stack',
    dataStructure: 'Deque<Integer> stack = new ArrayDeque<>()',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    exampleProblem: 'Daily Temperatures, Largest Rectangle in Histogram',
    whenNotToUse:
      'Arbitrary dynamic range queries without monotonic ordering (use Segment Tree or Fenwick Tree).',
  },
  {
    signal: 'Sorted sequence, or "minimize maximum" / "maximize minimum" answer',
    pattern: 'Binary Search',
    dataStructure: 'int low = min, high = max; while (low <= high)',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    exampleProblem: 'Koko Eating Bananas, Search in Rotated Sorted Array',
    whenNotToUse:
      'Predicate does not have monotonic behavior, or dataset is unsorted and cannot be sorted cheaply.',
  },
  {
    signal: 'Top K frequent, Kth largest, or stream median maintenance',
    pattern: 'Heap / Priority Queue',
    dataStructure: 'PriorityQueue<Integer> pq = new PriorityQueue<>()',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    exampleProblem: 'Kth Largest Element in an Array, Top K Frequent Elements',
    whenNotToUse:
      'Need frequent random lookups or arbitrary element search (Heap search is O(n); use TreeMap/BST).',
  },
  {
    signal: 'Tree level-order, shortest path in unweighted graph/grid',
    pattern: 'Tree / Graph BFS',
    dataStructure: 'Queue<TreeNode> q = new ArrayDeque<>()',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    exampleProblem: 'Binary Tree Level Order Traversal, Word Ladder',
    whenNotToUse:
      'Graph has weighted edges (BFS gives incorrect shortest path — use Dijkstra or 0-1 BFS).',
  },
  {
    signal: 'Exhaustive search of combinations, permutations, or subsets',
    pattern: 'Backtracking',
    dataStructure: 'List<Integer> path; recurse(); path.remove(size - 1)',
    timeComplexity: 'O(2^n) or O(n!)',
    spaceComplexity: 'O(n) recursion',
    exampleProblem: 'Subsets, Permutations, Combination Sum, Word Search',
    whenNotToUse:
      'Constraint n > 25 (exponential blowup — check for Dynamic Programming, Greedy, or Math).',
  },
  {
    signal: 'Numbers in range [1, n] or [0, n], find missing or duplicate numbers in O(1) space',
    pattern: 'Cyclic Sort',
    dataStructure: 'while (i < n) { int correct = arr[i] - 1; if (arr[i] != arr[correct]) swap(arr, i, correct); else i++; }',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    exampleProblem: 'Find the Missing Number, Find All Duplicates in an Array',
    whenNotToUse:
      'Numbers are outside the 1..n range, or array is read-only / immutable.',
  },
  {
    signal: 'Prefix matching, autocomplete, dictionary search, wildcard word match',
    pattern: 'Trie (Prefix Tree)',
    dataStructure: 'class TrieNode { TrieNode[] children = new TrieNode[26]; boolean isWord; }',
    timeComplexity: 'O(L) per operation',
    spaceComplexity: 'O(N · L)',
    exampleProblem: 'Implement Trie (Prefix Tree), Design Add and Search Words Data Structure',
    whenNotToUse:
      'Exact full-string lookups only without any prefix or substring queries (HashSet is simpler and faster).',
  },
  {
    signal: 'Connected components, cycle in undirected graph, dynamic connectivity',
    pattern: 'Union-Find (Disjoint Set)',
    dataStructure: 'int[] parent, rank; find(i) with path compression',
    timeComplexity: 'O(E · α(V)) ≈ O(E)',
    spaceComplexity: 'O(V)',
    exampleProblem: 'Number of Connected Components, Redundant Connection',
    whenNotToUse:
      'Graph edges are frequently deleted dynamically, or directed path reachability is required.',
  },
  {
    signal: 'Course prerequisites, build order, directed cycle detection',
    pattern: 'Topological Sort',
    dataStructure: 'int[] inDegree, Queue<Integer> q (Kahn’s algorithm)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    exampleProblem: 'Course Schedule, Course Schedule II, Alien Dictionary',
    whenNotToUse:
      'Graph is undirected, or the graph is guaranteed to have cycles where a valid ordering is impossible.',
  },
  {
    signal: 'Overlapping intervals, scheduling, merge time blocks',
    pattern: 'Intervals',
    dataStructure: 'Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]))',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    exampleProblem: 'Merge Intervals, Non-overlapping Intervals, Meeting Rooms',
    whenNotToUse:
      'High-throughput dynamic insertions/deletions on streaming intervals (use Interval Tree / Segment Tree).',
  },
  {
    signal: 'Subarray sum equals K, or counting subarrays with exact condition',
    pattern: 'Prefix Sum + HashMap',
    dataStructure: 'Map<Integer, Integer> map; map.put(0, 1)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    exampleProblem: 'Subarray Sum Equals K, Continuous Subarray Sum',
    whenNotToUse:
      'Elements are strictly non-negative and memory must be O(1) (use 2-pointer Sliding Window).',
  },
  {
    signal: 'Optimal substructure with overlapping subproblems, decisions at each step',
    pattern: 'Dynamic Programming',
    dataStructure: 'int[] dp = new int[n + 1] (or rolling variables)',
    timeComplexity: 'O(n) or O(n · m)',
    spaceComplexity: 'O(n) or O(1)',
    exampleProblem: 'Climbing Stairs, Coin Change, Longest Increasing Subsequence',
    whenNotToUse:
      'Subproblems do not overlap (e.g. Merge Sort divide & conquer), or greedy locally optimal choice is provably optimal.',
  },
  {
    signal: 'Duplicate numbers, pair cancellation, power of two, bitmask state',
    pattern: 'Bit Manipulation',
    dataStructure: 'int x = 0; x ^= n; n & (n - 1); 1 << k',
    timeComplexity: 'O(1) or O(n)',
    spaceComplexity: 'O(1)',
    exampleProblem: 'Single Number, Number of 1 Bits, Counting Bits, Reverse Bits',
    whenNotToUse:
      'Number of states exceeds 60 without BigInteger, or bit arithmetic obscures code with minimal speed benefit.',
  },
  {
    signal: 'Maximum or minimum in every sliding window of fixed size K',
    pattern: 'Sliding Window + Monotonic Deque',
    dataStructure: 'Deque<Integer> dq = new ArrayDeque<>() // stores indices in monotonic order',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    exampleProblem: 'Sliding Window Maximum',
    whenNotToUse:
      'Window size is variable and non-monotonic, or queries require arbitrary kth element inside window.',
  },
]
