import type { DsaPattern } from '../types'

/** Ordered list of the core DSA patterns PatternPilot trains. */
export const PATTERNS: DsaPattern[] = [
  {
    id: 'hashmap-lookup',
    name: 'HashMap Lookup',
    whatItSolves:
      'Problems that need repeated lookups of previously seen values: complements, duplicates, grouping, counting.',
    recognitionSignals: [
      'need lookup of previous values',
      'counting frequency',
      'pair / complement',
      'grouping by property',
      'duplicate detection',
    ],
    mentalTrigger: 'Do I need to remember something I have already seen?',
    javaTemplate: `Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) {
        return new int[] { seen.get(need), i };
    }
    seen.put(nums[i], i);
}`,
    commonTraps: [
      'checking the map before inserting the current element (self-pairing)',
      'using containsKey vs get without null checks',
      'forgetting getOrDefault when counting',
    ],
    representativeProblemTitles: ['Two Sum', 'Contains Duplicate', 'Group Anagrams'],
  },
  {
    id: 'frequency-count',
    name: 'Frequency Counting',
    whatItSolves:
      'Counting occurrences to compare, group, or rank items; often a HashMap of counts feeding another decision.',
    recognitionSignals: [
      'how many times does X appear',
      'compare character or value counts',
      'top / most frequent K items',
      'anagram or permutation checks',
    ],
    mentalTrigger: 'Am I really asking "how many of each"?',
    javaTemplate: `Map<Character, Integer> count = new HashMap<>();
for (char c : s.toCharArray()) {
    count.merge(c, 1, Integer::sum);
}`,
    commonTraps: [
      'off-by-one when a count must be inclusive',
      'forgetting that counts can overflow int in huge inputs',
      'comparing maps when comparing sorted keys would be simpler',
    ],
    representativeProblemTitles: ['Valid Anagram', 'Find Median From Data Stream', 'Task Scheduler'],
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    whatItSolves:
      'Pair or range relationships on sorted or structured input using two moving indices instead of nested loops.',
    recognitionSignals: [
      'sorted array or can sort without losing meaning',
      'pair relationship (sum, difference, symmetry)',
      'opposite ends moving inward',
      'remove / skip duplicates in place',
    ],
    mentalTrigger: 'Can two moving positions replace nested loops?',
    javaTemplate: `int left = 0, right = nums.length - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return true;
    if (sum < target) left++;
    else right--;
}`,
    commonTraps: [
      'moving the wrong pointer when sums compare equal',
      'not skipping duplicates, producing repeated answers',
      'forgetting the array must be sorted first',
    ],
    representativeProblemTitles: ['Two Sum II', '3Sum', 'Valid Palindrome'],
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    whatItSolves:
      'Longest / shortest / count of contiguous subarrays or substrings while maintaining a running condition.',
    recognitionSignals: [
      'contiguous subarray or substring',
      'longest / shortest / count of valid ranges',
      'condition changes as the range expands or shrinks',
      'nested loop recomputes overlapping ranges',
    ],
    mentalTrigger: 'Can I maintain a moving range instead of recomputing it?',
    javaTemplate: `int left = 0;
for (int right = 0; right < s.length(); right++) {
    // add s.charAt(right) to window state
    while (/* window invalid */) {
        // remove s.charAt(left) from state
        left++;
    }
    // update best with window size right - left + 1
}`,
    commonTraps: [
      'forgetting to remove the outgoing element',
      'updating the answer at the wrong moment (before vs after shrinking)',
      'window boundaries off by one',
    ],
    representativeProblemTitles: [
      'Longest Substring Without Repeating Characters',
      'Minimum Window Substring',
      'Permutation in String',
    ],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    whatItSolves:
      'Search spaces that are sorted or monotonic: half can be discarded at every step, including search-on-answer problems.',
    recognitionSignals: [
      'sorted data (or answer space is monotonic)',
      'minimize the maximum / maximize the minimum',
      'O(log n) explicitly requested or implied by constraints',
      'boundary between true and false',
    ],
    mentalTrigger: 'Can I eliminate half the possibilities each step?',
    javaTemplate: `int lo = 0, hi = nums.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;`,
    commonTraps: [
      'infinite loops from wrong lo/hi updates',
      'mid overflow with (lo + hi) / 2 in other languages — use lo + (hi - lo) / 2',
      'boundary choices: <= vs < must match the update rule',
    ],
    representativeProblemTitles: [
      'Binary Search',
      'Koko Eating Bananas',
      'Find Minimum in Rotated Sorted Array',
    ],
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack',
    whatItSolves:
      'Next greater / smaller element questions: keep a stack whose values stay increasing or decreasing.',
    recognitionSignals: [
      'next greater / previous smaller element',
      'temperature, span, or wait-day questions',
      'bars, histograms, or visibility problems',
      'brute force scans backward for each element',
    ],
    mentalTrigger: 'Which elements are still waiting for their answer?',
    javaTemplate: `Deque<Integer> stack = new ArrayDeque<>();
for (int i = 0; i < nums.length; i++) {
    while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
        int idx = stack.pop();
        // nums[i] is the next greater for nums[idx]
    }
    stack.push(i);
}`,
    commonTraps: [
      'storing values when you need indices',
      'wrong comparison direction (strict vs non-strict)',
      'forgetting leftover stack items have no answer',
    ],
    representativeProblemTitles: ['Daily Temperatures', 'Largest Rectangle in Histogram'],
  },
  {
    id: 'fast-slow-pointers',
    name: 'Fast/Slow Pointers',
    whatItSolves:
      'Cycle detection and middle-finding on linked structures with O(1) space.',
    recognitionSignals: [
      'detect a cycle without extra memory',
      'find the middle of a list',
      'cycle entry point',
      'floyd cycle ideas on sequences',
    ],
    mentalTrigger: 'Can two speeds reveal a cycle or midpoint?',
    javaTemplate: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true; // cycle
}
return false;`,
    commonTraps: [
      'moving fast before checking nulls',
      'using slow == fast at start (they begin equal)',
      'forgetting to reset one pointer to find the entry node',
    ],
    representativeProblemTitles: ['Linked List Cycle', 'Find the Duplicate Number', 'Happy Number'],
  },
  {
    id: 'dfs',
    name: 'DFS',
    whatItSolves:
      'Fully exploring connected structures: trees, grids, graphs, components, and path existence.',
    recognitionSignals: [
      'explore every connected structure',
      'count islands / components',
      'tree recursion',
      'path existence or any-path questions',
    ],
    mentalTrigger: 'Can I fully explore one path before trying another?',
    javaTemplate: `void dfs(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length
            || c >= grid[0].length
            || grid[r][c] != '1') return;
    grid[r][c] = '0'; // mark visited
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}`,
    commonTraps: [
      'missing the visited mark, causing infinite recursion',
      'forgetting all four directions (or eight when needed)',
      'stack overflow on very deep graphs — consider BFS or iterative DFS',
    ],
    representativeProblemTitles: ['Number of Islands', 'Max Area of Island', 'Clone Graph'],
  },
  {
    id: 'bfs',
    name: 'BFS',
    whatItSolves:
      'Shortest steps or nearest state in unweighted graphs, level-by-level processing, and multi-source spreads.',
    recognitionSignals: [
      'shortest path in an unweighted graph or grid',
      'minimum number of steps / moves / minutes',
      'level order processing',
      'spread that grows outward each tick (rotting, burning)',
    ],
    mentalTrigger: 'Do I need to explore outward level by level?',
    javaTemplate: `Queue<int[]> queue = new ArrayDeque<>();
queue.offer(start);
boolean[][] visited = new boolean[rows][cols];
visited[start[0]][start[1]] = true;
while (!queue.isEmpty()) {
    int[] cur = queue.poll();
    for (int[] d : DIRS) {
        int nr = cur[0] + d[0], nc = cur[1] + d[1];
        if (valid(nr, nc) && !visited[nr][nc]) {
            visited[nr][nc] = true;
            queue.offer(new int[] { nr, nc });
        }
    }
}`,
    commonTraps: [
      'marking visited when dequeuing instead of enqueuing (duplicates blow up)',
      'forgetting multi-source BFS seeds all sources first',
      'not tracking depth per level when distance matters',
    ],
    representativeProblemTitles: ['Rotting Oranges', 'Word Ladder', 'Walls and Gates'],
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    whatItSolves:
      'Ordering tasks with dependencies (DAGs): course schedules, build orders, alien alphabets.',
    recognitionSignals: [
      'prerequisites / before-after relations',
      'is the ordering possible',
      'produce a valid order',
      'directed edges with no cycles allowed',
    ],
    mentalTrigger: 'What can I do next once its prerequisites are done?',
    javaTemplate: `int[] indegree = new int[n];
List<List<Integer>> adj = buildAdjacency();
Queue<Integer> queue = new ArrayDeque<>();
for (int i = 0; i < n; i++) if (indegree[i] == 0) queue.offer(i);
int seen = 0;
while (!queue.isEmpty()) {
    int node = queue.poll();
    seen++;
    for (int next : adj.get(node)) {
        if (--indegree[next] == 0) queue.offer(next);
    }
}
return seen == n; // false means a cycle`,
    commonTraps: [
      'building adjacency in the wrong direction (prereq -> course vs course -> prereq)',
      'forgetting the cycle check (seen count)',
      'assuming a unique order when many are valid',
    ],
    representativeProblemTitles: ['Course Schedule', 'Course Schedule II', 'Alien Dictionary'],
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    whatItSolves:
      'Single-source shortest paths with non-negative weights: networks, delays, and bottleneck-path questions.',
    recognitionSignals: [
      'weighted graph, shortest or cheapest path',
      'minimum time / cost for a signal to spread',
      'minimize the maximum edge or node cost along a path',
      'non-negative weights are explicitly given',
    ],
    mentalTrigger: 'Which unsettled node has the cheapest known path so far?',
    javaTemplate: `Map<Integer, Integer> dist = new HashMap<>();
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
dist.put(source, 0);
pq.offer(new int[] { source, 0 });
while (!pq.isEmpty()) {
    int[] top = pq.poll();
    int node = top[0], d = top[1];
    if (d > dist.getOrDefault(node, Integer.MAX_VALUE)) continue;
    for (int[] edge : adj.get(node)) {
        int next = edge[0], w = edge[1];
        int nd = d + w;
        if (nd < dist.getOrDefault(next, Integer.MAX_VALUE)) {
            dist.put(next, nd);
            pq.offer(new int[] { next, nd });
        }
    }
}`,
    commonTraps: [
      'using it with negative weights (it breaks)',
      'skipping the stale-entry check when popping the heap',
      'stopping before all needed nodes are settled',
    ],
    representativeProblemTitles: ['Network Delay Time', 'Swim in Rising Water'],
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford',
    whatItSolves:
      'Shortest paths with negative weights, or path-length-limited routing such as at-most-K-stop flight pricing.',
    recognitionSignals: [
      'negative weights or negative cycles mentioned',
      'at most k edges / stops / hops allowed',
      'round-by-round relaxation is natural',
      'Dijkstra assumptions explicitly broken',
    ],
    mentalTrigger: 'Do I need to relax every edge a fixed number of rounds?',
    javaTemplate: `long[] dist = new long[n];
Arrays.fill(dist, Long.MAX_VALUE);
dist[src] = 0;
for (int round = 0; round <= k; round++) {
    long[] next = dist.clone(); // snapshot enforces the hop budget
    for (int[] e : edges) {
        if (dist[e[0]] == Long.MAX_VALUE) continue;
        next[e[1]] = Math.min(next[e[1]], dist[e[0]] + e[2]);
    }
    dist = next;
}`,
    commonTraps: [
      'relaxing in place when a hop budget exists (allows extra stops)',
      'int overflow on sums — use long',
      'missing the unreachable-node sentinel check',
    ],
    representativeProblemTitles: ['Cheapest Flights Within K Stops'],
  },
  {
    id: 'mst',
    name: 'Minimum Spanning Tree (Prim)',
    whatItSolves:
      'Connecting every node with minimum total edge weight: network cabling, point connectivity, cost clustering.',
    recognitionSignals: [
      'connect all points / nodes with minimum cost',
      'spanning structure',
      'every node must be included exactly once',
      'complete-graph geometry favors Prim over Kruskal',
    ],
    mentalTrigger: 'Which cheapest edge grows my tree by one new node?',
    javaTemplate: `boolean[] inTree = new boolean[n];
long[] minEdge = new long[n];
Arrays.fill(minEdge, Long.MAX_VALUE);
minEdge[0] = 0;
long total = 0;
for (int round = 0; round < n; round++) {
    int best = -1;
    for (int i = 0; i < n; i++) {
        if (!inTree[i] && (best == -1 || minEdge[i] < minEdge[best])) best = i;
    }
    inTree[best] = true;
    total += minEdge[best];
    for (int j = 0; j < n; j++) {
        long w = weight(best, j);
        if (!inTree[j] && w < minEdge[j]) minEdge[j] = w;
    }
}`,
    commonTraps: [
      'building all n² edges explicitly for a dense graph',
      'marking nodes in the tree before taking the minimum',
      'forgetting disconnected graphs need a component check',
    ],
    representativeProblemTitles: ['Min Cost to Connect All Points'],
  },
  {
    id: 'union-find',
    name: 'Union-Find',
    whatItSolves:
      'Dynamic connectivity: merging groups and querying whether two nodes are connected, or counting components.',
    recognitionSignals: [
      'are these connected',
      'count groups after merging edges',
      'redundant edge that closes a cycle',
      'incremental union of elements',
    ],
    mentalTrigger: 'Can I merge groups instead of re-traversing the graph?',
    javaTemplate: `int[] parent = IntStream.range(0, n).toArray();

int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]]; // path halving
        x = parent[x];
    }
    return x;
}

boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false; // already connected
    parent[ra] = rb;
    return true;
}`,
    commonTraps: [
      'skipping path compression, degrading to O(n) finds',
      'comparing nodes instead of roots',
      'not counting how many unions actually merged',
    ],
    representativeProblemTitles: [
      'Number of Connected Components',
      'Graph Valid Tree',
      'Redundant Connection',
    ],
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    whatItSolves:
      'Enumerating all combinations, permutations, subsets, or boards where choices must be made and undone.',
    recognitionSignals: [
      'all combinations / permutations / subsets',
      'generate every valid arrangement',
      'choose-explore-unchoose structure',
      'n is tiny (usually <= 20) but options explode',
    ],
    mentalTrigger: 'Can I build candidates step by step and undo bad choices?',
    javaTemplate: `void backtrack(int start, List<Integer> path) {
    result.add(new ArrayList<>(path)); // record a candidate
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(i + 1, path);
        path.remove(path.size() - 1); // undo
    }
}`,
    commonTraps: [
      'adding the live path list instead of a copy',
      'wrong start index (i vs i + 1) causing permutations instead of combinations',
      'forgetting to undo state before returning',
    ],
    representativeProblemTitles: ['Subsets', 'Permutations', 'Combination Sum'],
  },
  {
    id: 'greedy',
    name: 'Greedy',
    whatItSolves:
      'Problems where a locally best choice provably leads to a global optimum: intervals, jumps, resource assignment.',
    recognitionSignals: [
      'maximize / minimize with simple choices',
      'sort by some key then take in order',
      'reachability or coverage questions',
      'exchange argument works for counterexamples',
    ],
    mentalTrigger: 'Does the best local move guarantee the best outcome?',
    javaTemplate: `Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
int taken = 0;
long lastEnd = Long.MIN_VALUE;
for (int[] interval : intervals) {
    if (interval[0] >= lastEnd) {
        taken++;
        lastEnd = interval[1];
    }
}`,
    commonTraps: [
      'greedy rule that fails on a counterexample — try to prove or break it',
      'sorting by the wrong key',
      'needing DP when the greedy proof does not hold',
    ],
    representativeProblemTitles: ['Jump Game', 'Partition Labels', 'Maximum Subarray'],
  },
  {
    id: 'dp-1d',
    name: '1-D Dynamic Programming',
    whatItSolves:
      'Sequences where each state depends on a few earlier states: stairs, robbing, coins, decoding.',
    recognitionSignals: [
      'repeated subproblems over one index',
      'min / max / count ways to reach position i',
      'choices at each step with overlapping recomputation',
      'brute force recursion is exponential but states are linear',
    ],
    mentalTrigger: 'Am I solving the same smaller problem repeatedly?',
    javaTemplate: `int[] dp = new int[n + 1];
dp[0] = baseCase;
for (int i = 1; i <= n; i++) {
    dp[i] = /* combine dp[i - 1], dp[i - 2], ... */;
}`,
    commonTraps: [
      'wrong base cases',
      'iteration order that reads states not yet computed',
      'missing states like "robbed last house vs not"',
    ],
    representativeProblemTitles: ['Climbing Stairs', 'House Robber', 'Coin Change'],
  },
  {
    id: 'dp-2d',
    name: '2-D Dynamic Programming',
    whatItSolves:
      'Two moving indexes or two sequences: grids, string matching, subsequences, and interval DP.',
    recognitionSignals: [
      'two strings or two indexes interact',
      'grid path questions',
      'edit distance style comparisons',
      'state = (i, j) pair',
    ],
    mentalTrigger: 'What does a state made of two positions remember?',
    javaTemplate: `int[][] dp = new int[m + 1][n + 1];
for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        if (a.charAt(i - 1) == b.charAt(j - 1)) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
}`,
    commonTraps: [
      'off-by-one between string index and dp index',
      'initializing the first row/column incorrectly',
      'wrong dependency direction for in-place updates',
    ],
    representativeProblemTitles: ['Unique Paths', 'Longest Common Subsequence', 'Edit Distance'],
  },
  {
    id: 'prefix-sum',
    name: 'Prefix Sum',
    whatItSolves:
      'Repeated range-sum queries and subarray-sum targets using running accumulations.',
    recognitionSignals: [
      'sum of any range, many times',
      'subarray with sum equal to K',
      'count subarrays meeting a sum condition',
      'brute force re-adds the same ranges',
    ],
    mentalTrigger: 'Can a running total answer range questions in O(1)?',
    javaTemplate: `long[] prefix = new long[n + 1];
for (int i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}
// sum of nums[l..r] = prefix[r + 1] - prefix[l]`,
    commonTraps: [
      'prefix array off by one (prefix[i] means sum of first i items)',
      'int overflow — use long',
      'forgetting count-with-HashMap needs prefix - k lookups',
    ],
    representativeProblemTitles: [
      'Product of Array Except Self',
      'Range Sum Query',
      'Subarray Sum Equals K',
    ],
  },
  {
    id: 'heap-topk',
    name: 'Heap / Top-K',
    whatItSolves:
      'Repeatedly extracting the smallest or largest item: K-th elements, streaming medians, scheduling.',
    recognitionSignals: [
      'K largest / smallest / closest / most frequent',
      'repeatedly take the best current item',
      'median of a stream',
      'merge many sorted sources',
    ],
    mentalTrigger: 'Do I always need the current best item?',
    javaTemplate: `// min-heap of size k keeps the k largest
PriorityQueue<Integer> heap = new PriorityQueue<>();
for (int x : nums) {
    heap.offer(x);
    if (heap.size() > k) heap.poll();
}
return heap.peek(); // k-th largest`,
    commonTraps: [
      'using a max-heap where a min-heap keeps only K items',
      'forgetting Java PriorityQueue is a min-heap by default',
      'polling everything when only the peek is needed',
    ],
    representativeProblemTitles: [
      'Kth Largest Element in an Array',
      'Find Median From Data Stream',
      'Task Scheduler',
    ],
  },
  {
    id: 'intervals',
    name: 'Intervals',
    whatItSolves:
      'Ranges on a line: merging, overlapping counts, insertion, and room scheduling after sorting by start or end.',
    recognitionSignals: [
      'input given as [start, end] ranges',
      'merge overlapping ranges',
      'minimum rooms / arrows / removals',
      'overlap of meetings or bookings',
    ],
    mentalTrigger: 'If I sort by start, when do two ranges touch?',
    javaTemplate: `Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
List<int[]> merged = new ArrayList<>();
for (int[] in : intervals) {
    if (!merged.isEmpty() && in[0] <= merged.get(merged.size() - 1)[1]) {
        merged.get(merged.size() - 1)[1] =
            Math.max(merged.get(merged.size() - 1)[1], in[1]);
    } else {
        merged.add(in);
    }
}`,
    commonTraps: [
      'sorting by start but comparing ends (or vice versa) inconsistently',
      'overlapping vs touching boundaries (<= vs <)',
      'mutating input arrays when the caller expects them intact',
    ],
    representativeProblemTitles: ['Merge Intervals', 'Meeting Rooms II', 'Insert Interval'],
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    whatItSolves:
      'XOR tricks, counting bits, single-number isolation, and compact state packing.',
    recognitionSignals: [
      'every element appears twice but one',
      'no extra memory allowed',
      'count set bits',
      'numbers as binary state',
    ],
    mentalTrigger: 'What does XOR, a mask, or a shift remember for me?',
    javaTemplate: `int x = 0;
for (int num : nums) x ^= num; // pairs cancel
int bits = Integer.bitCount(n);
int lowestSet = n & (-n);`,
    commonTraps: [
      'confusing & with &&, | with ||',
      'sign issues with >>> vs >> on negatives',
      'forgetting XOR is its own inverse',
    ],
    representativeProblemTitles: ['Single Number', 'Number of 1 Bits', 'Counting Bits'],
  },
]

export const PATTERN_BY_NAME: Record<string, DsaPattern> = Object.fromEntries(
  PATTERNS.map((p) => [p.name, p]),
)

/** Fuzzy-ish lookup: map a problem's pattern string to a library pattern. */
export function patternForName(name: string): DsaPattern | undefined {
  return PATTERN_BY_NAME[name]
}
