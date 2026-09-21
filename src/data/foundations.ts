/** Java Foundations — the pre-DSA toolkit: strings, cleaning, arrays, collections, idioms. */
export interface FoundationEntry {
  /** method or syntax signature */
  sig: string
  desc: string
}

export interface FoundationSection {
  id: string
  title: string
  intro: string
  entries: FoundationEntry[]
  code?: string
  dsaNote: string
}

export const FOUNDATIONS: FoundationSection[] = [
  {
    id: 'strings',
    title: 'Strings & Characters',
    intro: 'Most interview problems start as string gymnastics. These are the methods you will reach for daily.',
    entries: [
      { sig: 's.toCharArray()', desc: 'String → char[]. The starting move for frequency counting and two pointers.' },
      { sig: 's.charAt(i)', desc: 'O(1) character access without building a char array.' },
      { sig: 's.length()', desc: 'String length — with parentheses. Arrays use .length with NO parentheses. Classic confusion.' },
      { sig: 's.substring(a, b)', desc: 'Slice from index a (inclusive) to b (exclusive). substring(a) goes to the end.' },
      { sig: 's.toLowerCase() / toUpperCase()', desc: 'Normalize case before comparing characters.' },
      { sig: 's.trim()', desc: 'Removes leading/trailing whitespace.' },
      { sig: 's.indexOf(c) / s.contains(sub)', desc: 'Search within a string. indexOf returns -1 when absent.' },
      { sig: 's.equals(t)', desc: 'Compare CONTENT. Never use == on strings — it compares references. The #1 Java trap.' },
      { sig: 's.compareTo(t)', desc: 'Dictionary-order comparison: negative / 0 / positive. Useful for sorting strings.' },
      { sig: 'Integer.parseInt(s) / String.valueOf(x)', desc: 'Convert string → int and int → String.' },
      { sig: "c - 'a'", desc: 'Char arithmetic: maps a lowercase letter to a 0–25 index for an int[26] counter.' },
      { sig: 'Character.isLetterOrDigit(c)', desc: 'Per-character classification: isLetter, isDigit, isWhitespace, toLowerCase.' },
    ],
    code: `String s = "A man, a plan!";
String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase(); // "amanaplan"

int[] count = new int[26];
for (char c : clean.toCharArray()) {
    count[c - 'a']++;               // frequency per letter
}

boolean isDigit = Character.isDigit('7');   // true
int seven = '7' - '0';                       // 7`,
    dsaNote: 'Anagrams, palindromes, and frequency problems all start with these five lines.',
  },
  {
    id: 'cleaning',
    title: 'Cleaning Input with Regex',
    intro: '"Remove anything that is not a character" and friends — the preprocessing layer for many problems.',
    entries: [
      { sig: 's.replaceAll("[^a-zA-Z0-9]", "")', desc: 'Keep ONLY letters and digits — drops spaces, punctuation, symbols.' },
      { sig: 's.replaceAll("[^a-zA-Z]", "")', desc: 'Letters only. Use "[^0-9]" for digits only.' },
      { sig: 's.replaceAll("\\\\s+", " ").trim()', desc: 'Collapse every whitespace run into one space.' },
      { sig: 's.split("\\\\s+")', desc: 'Split a sentence into words on any whitespace run.' },
      { sig: 's.split("\\\\.")', desc: 'Regex metacharacters (. * + ? [] {} () ^ $ |) must be escaped with a backslash.' },
      { sig: 's.replace("a", "b")', desc: 'Literal replacement — NOT regex. replaceAll IS regex. Pick deliberately.' },
      { sig: 's.matches("[0-9]+")', desc: 'Whole-string regex test: "is this entirely digits?"' },
    ],
    code: `// "A man, a plan, a canal: Panama" -> "amanaplanacanalpanama"
String s = "A man, a plan, a canal: Panama";
String normalized = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();

// "hello   world  foo" -> ["hello", "world", "foo"]
String[] words = "hello   world  foo".trim().split("\\\\s+");`,
    dsaNote: 'Valid Palindrome becomes trivial once the input is normalized. Clean first, then solve.',
  },
  {
    id: 'arrays',
    title: 'Arrays',
    intro: 'The raw material of DSA. java.util.Arrays supplies most of what you need.',
    entries: [
      { sig: 'int[] a = new int[n];', desc: 'Created zero-filled — ready to use as a counter or DP table.' },
      { sig: 'int[] a = {1, 2, 3};', desc: 'Array literal.' },
      { sig: 'a.length', desc: 'Length WITHOUT parentheses (strings and lists use methods).' },
      { sig: 'Arrays.sort(a)', desc: 'Ascending sort of primitives — O(n log n). Also Arrays.sort(a, from, to) for a range.' },
      { sig: 'Arrays.sort(grid, (x, y) -> Integer.compare(x[1], y[1]))', desc: 'Sort rows of a 2D array by their second column.' },
      { sig: 'Arrays.fill(memo, -1)', desc: 'Fill with a sentinel — the standard init for memoization tables.' },
      { sig: 'Arrays.copyOf(a, n) / copyOfRange(a, from, to)', desc: 'Clone or slice an array.' },
      { sig: 'Arrays.toString(a)', desc: 'Debug printing: [1, 2, 3]. For 2D use Arrays.deepToString(grid).' },
      { sig: 'int[][] grid = new int[r][c];', desc: '2D array; grid.length = rows, grid[0].length = columns.' },
      { sig: 'int[] vs Integer[]', desc: 'Primitives cannot be null and cannot go into collections. Integer[] can — needed for comparators on objects.' },
    ],
    code: `int[] nums = {5, 3, 1, 4};
Arrays.sort(nums);                 // [1, 3, 4, 5]

int[] memo = new int[n + 1];
Arrays.fill(memo, -1);             // -1 = "not computed yet"

int[][] dp = new int[m + 1][n + 1]; // grid DP table, zero-filled`,
    dsaNote: 'int[26] counters, int[] dp arrays, and boolean[][] visited grids are the workhorses of the whole curriculum.',
  },
  {
    id: 'hashmap',
    title: 'HashMap — the #1 DSA tool',
    intro: 'Key → value storage with O(1) average operations. If a brute force repeats work, a map usually removes it.',
    entries: [
      { sig: 'Map<K, V> map = new HashMap<>();', desc: 'Creation. Imports: java.util.Map, java.util.HashMap.' },
      { sig: 'map.put(k, v) / map.get(k)', desc: 'Insert / read. get returns null when absent — dangerous for primitives.' },
      { sig: 'map.getOrDefault(k, 0)', desc: 'Read with a default — the counting idiom: map.merge(c, 1, Integer::sum).' },
      { sig: 'map.containsKey(k)', desc: 'Membership test — the complement-lookup in Two Sum.' },
      { sig: 'map.merge(k, 1, Integer::sum)', desc: 'Count upsert in one call: absent → 1, present → old + 1.' },
      { sig: 'map.computeIfAbsent(k, x -> new ArrayList<>()).add(v)', desc: 'Grouping idiom: build a Map<String, List<String>> in one line.' },
      { sig: 'map.remove(k) / map.size() / map.isEmpty()', desc: 'Standard mutators. Removing while shrinking a window is common.' },
      { sig: 'for (var e : map.entrySet())', desc: 'Iterate pairs: e.getKey(), e.getValue(). Also keySet() and values().' },
      { sig: 'new TreeMap<>(map)', desc: 'Sorted-key variant: firstKey(), lastKey(), floorKey(k), ceilingKey(k).' },
    ],
    code: `// Two Sum complement lookup
Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) return new int[] { seen.get(need), i };
    seen.put(nums[i], i);
}

// Frequency counting
Map<Character, Integer> freq = new HashMap<>();
for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);`,
    dsaNote: 'HashMap Lookup, Frequency Counting, and grouping problems — the most reused structure in interviews.',
  },
  {
    id: 'hashset',
    title: 'HashSet — membership in O(1)',
    intro: 'When you only need "have I seen this?", a set is simpler and faster than a map.',
    entries: [
      { sig: 'Set<Integer> set = new HashSet<>();', desc: 'Creation. TreeSet keeps keys sorted; LinkedHashSet keeps insertion order.' },
      { sig: 'set.add(x)', desc: 'Returns boolean — false means x was already present. Duplicate detection in one line.' },
      { sig: 'set.contains(x)', desc: 'O(1) average membership test.' },
      { sig: 'set.remove(x)', desc: 'Removal — used by sliding windows that track "in window" values.' },
      { sig: 'for (int x : set)', desc: 'Iteration order is undefined. Do not rely on it.' },
    ],
    code: `// Contains Duplicate
Set<Integer> seen = new HashSet<>();
for (int x : nums) {
    if (!seen.add(x)) return true;   // add returned false → already present
}
return false;

// Longest Consecutive: only count from run starts
for (int x : set) {
    if (!set.contains(x - 1)) { /* x starts a run — walk upward */ }
}`,
    dsaNote: 'Seen-sets power duplicate detection, visited tracking, and O(n) consecutive-run counting.',
  },
  {
    id: 'list',
    title: 'ArrayList — the default list',
    intro: 'Resizable array. Every "return all combinations" answer is built from ArrayLists.',
    entries: [
      { sig: 'List<Integer> list = new ArrayList<>();', desc: 'Always declare the interface (List), instantiate the implementation (ArrayList).' },
      { sig: 'list.add(x) / add(i, x)', desc: 'Append / insert at index.' },
      { sig: 'list.get(i) / list.set(i, x)', desc: 'Read / overwrite by index.' },
      { sig: 'list.size()', desc: 'Element count.' },
      { sig: 'list.remove(i)', desc: 'Removes by INDEX. To remove by value: list.remove(Integer.valueOf(x)). Trap!' },
      { sig: 'new ArrayList<>(other)', desc: 'COPY a list. Backtracking must record copies — the live path keeps mutating.' },
      { sig: 'Collections.sort(list)', desc: 'In-place sort; or list.sort(Comparator) for custom ordering.' },
      { sig: 'List.of(1, 2, 3)', desc: 'Immutable list literal — fine for answers, not for building.' },
      { sig: 'List<int[]>', desc: 'Lists of primitives ARE allowed as element types (int[] is an object); List<int> is not.' },
    ],
    code: `// Backtracking skeleton — copy on record, mutate + undo
List<List<Integer>> result = new ArrayList<>();
void backtrack(int start, List<Integer> path) {
    result.add(new ArrayList<>(path));          // copy!
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(i + 1, path);
        path.remove(path.size() - 1);           // undo
    }
}`,
    dsaNote: 'Subsets, Permutations, Combination Sum — every one is an ArrayList dance: add, recurse, remove.',
  },
  {
    id: 'deque',
    title: 'ArrayDeque — stack AND queue',
    intro: 'One fast class covers stacks, queues, BFS, and monotonic deques. Never use legacy Stack or LinkedList for this.',
    entries: [
      { sig: 'Deque<Integer> dq = new ArrayDeque<>();', desc: 'Creation. Imports: java.util.Deque, java.util.ArrayDeque.' },
      { sig: 'dq.push(x) / dq.pop() / dq.peek()', desc: 'As a STACK (LIFO): push, pop, peek top.' },
      { sig: 'dq.offer(x) / dq.poll() / dq.peek()', desc: 'As a QUEUE (FIFO): offer at tail, poll from head.' },
      { sig: 'dq.isEmpty()', desc: 'Always check before pop/poll — empty deque throws NoSuchElementException.' },
      { sig: 'dq.peekFirst() / peekLast()', desc: 'Both ends — the extra power behind monotonic window problems.' },
    ],
    code: `// Stack: valid parentheses
Deque<Character> stack = new ArrayDeque<>();
stack.push(c);
char open = stack.pop();

// Queue: BFS
Queue<int[]> queue = new ArrayDeque<>();
queue.offer(new int[] { r, c });
int[] cell = queue.poll();

// Monotonic deque (sliding window maximum): evict from the back
while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();`,
    dsaNote: 'Valid Parentheses, BFS, Daily Temperatures, Sliding Window Maximum — one class, four patterns.',
  },
  {
    id: 'priorityqueue',
    title: 'PriorityQueue — heaps',
    intro: 'A min-heap by default. Anything with "K largest/smallest/closest" or "repeatedly take the best" lives here.',
    entries: [
      { sig: 'PriorityQueue<Integer> pq = new PriorityQueue<>();', desc: 'MIN-heap by default: poll() yields the smallest.' },
      { sig: 'new PriorityQueue<>(Collections.reverseOrder())', desc: 'MAX-heap: poll() yields the largest.' },
      { sig: 'new PriorityQueue<>((a, b) -> a[1] - b[1])', desc: 'Custom ordering on objects/arrays — see Comparators below.' },
      { sig: 'pq.offer(x) / pq.poll() / pq.peek()', desc: 'Insert / remove best / view best. All O(log n) except peek O(1).' },
      { sig: 'if (pq.size() > k) pq.poll();', desc: 'The bounded top-K idiom: keep k best, root is the k-th.' },
    ],
    code: `// Kth largest: min-heap of size k
PriorityQueue<Integer> heap = new PriorityQueue<>();
for (int x : nums) {
    heap.offer(x);
    if (heap.size() > k) heap.poll();
}
return heap.peek();   // k-th largest

// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());`,
    dsaNote: 'Top-K, Find Median From Data Stream, Task Scheduler, Dijkstra — the heap family.',
  },
  {
    id: 'comparators',
    title: 'Sorting & Comparators',
    intro: 'Intervals, Greedy, and Two Pointers problems usually begin with choosing the right sort key.',
    entries: [
      { sig: '(a, b) -> Integer.compare(a, b)', desc: 'Safe ascending compare. Avoid a - b — it overflows on extreme values.' },
      { sig: '(a, b) -> Integer.compare(b, a)', desc: 'Descending (swap arguments).' },
      { sig: '(a, b) -> Integer.compare(a[1], b[1])', desc: 'Sort int[][] rows by column 1 — the intervals sort.' },
      { sig: 'Comparator.comparingInt((int[] x) -> x[0]).thenComparingInt(x -> x[1])', desc: 'Multi-key sort: by col 0, ties by col 1.' },
      { sig: 'Comparator.comparingInt(String::length)', desc: 'Sort strings by length; .reversed() flips it.' },
      { sig: 'Collections.reverseOrder()', desc: 'Ready-made descending comparator for heaps and sorts.' },
    ],
    code: `// Merge Intervals: sort by start, then sweep
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

// Non-overlapping Intervals: sort by END (greedy activity selection)
Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

// 3Sum: sort values, then two pointers
Arrays.sort(nums);`,
    dsaNote: 'Sorting is half the solution in interval and greedy problems — pick start vs end deliberately.',
  },
  {
    id: 'math',
    title: 'Math, Integer & Character helpers',
    intro: 'The small utilities that show up inside almost every solution.',
    entries: [
      { sig: 'Math.max(a, b) / Math.min(a, b) / Math.abs(a)', desc: 'The trio you will type thousands of times.' },
      { sig: '(a + b - 1) / b', desc: 'Integer ceiling division — Koko Eating Bananas, hour calculations.' },
      { sig: 'Integer.MAX_VALUE / MIN_VALUE', desc: 'Sentinels for "infinity" in DP and Dijkstra. Use Long.MAX_VALUE for big sums.' },
      { sig: 'long', desc: 'Default to long whenever sums or products can exceed ~2.1 billion. Overflow is a real OA trap.' },
      { sig: 'Integer.parseInt(s) vs Integer.valueOf(s)', desc: 'int (primitive) vs Integer (object). Collections need the object.' },
      { sig: "c - '0'", desc: 'Char digit → int value. getNumericValue(c) also works.' },
      { sig: 'Integer.bitCount(n)', desc: 'Number of 1-bits — bit manipulation problems gift-wrapped.' },
      { sig: 'Math.floorDiv / Math.floorMod', desc: 'Division and modulo that respect mathematical flooring (negative-safe).' },
    ],
    code: `int hoursFor(int[] piles, int k) {          // Koko
    int h = 0;
    for (int p : piles) h += (p + k - 1) / k;  // ceil(p / k)
    return h;
}

char digit = '9';
int value = digit - '0';                    // 9`,
    dsaNote: 'Ceil division, overflow guards, and digit arithmetic are silent failure points — learn them before they cost you.',
  },
  {
    id: 'builders',
    title: 'StringBuilder & building output',
    intro: 'Strings are immutable in Java — every + creates a new object. Building in a loop needs StringBuilder.',
    entries: [
      { sig: 'new StringBuilder()', desc: 'Create; optionally new StringBuilder(seed) to start with content.' },
      { sig: 'sb.append(x)', desc: 'Add to the end — any primitive, char, or String. Amortized O(1).' },
      { sig: 'sb.reverse()', desc: 'In-place reversal — palindrome checks and Reverse Integer.' },
      { sig: 'sb.toString()', desc: 'Materialize the final String.' },
      { sig: 'sb.insert(i, s) / deleteCharAt(i) / setCharAt(i, c)', desc: 'Surgical edits — backtracking paths, encoding schemes.' },
      { sig: 'sb.length() / sb.charAt(i)', desc: 'Read access, mirroring String API.' },
      { sig: 'new String(chars) / s.toCharArray()', desc: 'Convert between char[] and String in both directions.' },
    ],
    code: `// Why: this is O(n^2)
String s = "";
for (char c : chars) s += c;

// This is O(n)
StringBuilder sb = new StringBuilder();
for (char c : chars) sb.append(c);
String result = sb.toString();`,
    dsaNote: 'Encoding problems, N-Queens boards, and any assembled output — StringBuilder keeps it linear.',
  },
  {
    id: 'pitfalls',
    title: 'Top Java pitfalls in DSA',
    intro: 'The mistakes that cost the most debugging time in an OA. Read this list the night before.',
    entries: [
      { sig: '== on objects', desc: 'Compares references. Use .equals() for Strings, Integer, etc. Integer values beyond -128..127 break ==.' },
      { sig: 'list.remove(int)', desc: 'Removes by index. For by-value: remove(Integer.valueOf(x)). Ambiguity bites in loops.' },
      { sig: 'Modifying while for-eaching', desc: 'ConcurrentModificationException. Use list.removeIf(...) or an explicit Iterator.' },
      { sig: 'int x = map.get(k)', desc: 'NPE if absent — null autounboxes. Use getOrDefault(k, 0) for counting.' },
      { sig: 'int overflow', desc: 'Sums/products beyond ±2.1B wrap silently. Promote to long early: long sum = 0.' },
      { sig: 'a - b comparators', desc: 'Overflow on extreme ints → wrong order. Use Integer.compare(a, b).' },
      { sig: 'Off-by-one boundaries', desc: 'substring(a, b) is end-EXCLUSIVE; a.length has no parentheses; s.length() does.' },
      { sig: 'Forgetting new ArrayList<>(path)', desc: 'Backtracking records the live, mutating list — every result ends up identical or empty.' },
      { sig: 'Empty-structure access', desc: 'pop/poll/peek on empty deque, get on empty list — check isEmpty() first.' },
      { sig: 'Stack / LinkedList for stacks', desc: 'Legacy and slow. ArrayDeque for stacks, queues, and deques. Always.' },
    ],
    code: `// before (broken for large ints)
Arrays.sort(arr, (a, b) -> a - b);
// after (safe)
Arrays.sort(arr, (a, b) -> Integer.compare(a, b));`,
    dsaNote: 'Ten minutes here saves an hour of silent wrong answers.',
  },
]

export const FOUNDATION_BY_ID: Record<string, FoundationSection> = Object.fromEntries(
  FOUNDATIONS.map((s) => [s.id, s]),
)
