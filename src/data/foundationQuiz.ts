/** Java Foundations quiz: "which method / what does this do?" */
export interface FoundationQuestion {
  q: string
  options: string[]
  correct: number
  why: string
}

export const FOUNDATION_QUESTIONS: FoundationQuestion[] = [
  {
    q: 'You need to check whether a String s reads the same backwards. What is the typical first move?',
    options: ['s.reverse()', 's.toCharArray() (or two pointers)', 'new String(s)', 's.sort()'],
    correct: 1,
    why: 'Strings in Java are immutable — reverse the char array or walk two pointers inward.',
  },
  {
    q: 'How do you keep only letters and digits from "a1! b2"?',
    options: [
      's.replaceAll("[^a-zA-Z0-9]", "")',
      's.replace(nonLetters)',
      's.filter(c -> isAlnum(c))',
      's.substring(0, s.length())',
    ],
    correct: 0,
    why: 'replaceAll takes a regex; the negated character class [^a-zA-Z0-9] strips everything else.',
  },
  {
    q: 'What does Integer x = 1000; Integer y = 1000; System.out.println(x == y); print?',
    options: ['true', 'false', 'compile error', 'depends on JVM version'],
    correct: 1,
    why: '== compares references. Only -128..127 are cached; beyond that two Integers are different objects. Use .equals().',
  },
  {
    q: 'Fastest way to count each letter\'s frequency in a word?',
    options: [
      'int[] count = new int[26]; count[c - \'a\']++',
      'sort the string first',
      'List<Character> then contains()',
      'nested loops comparing chars',
    ],
    correct: 0,
    why: 'A fixed counter array with char arithmetic is O(n) with zero boxing overhead.',
  },
  {
    q: 'Which is a correct BFS queue declaration?',
    options: [
      'Stack<int[]> q = new Stack<>()',
      'Queue<int[]> q = new LinkedList<>()',
      'Queue<int[]> q = new ArrayDeque<>()',
      'ArrayList<int[]> q = new ArrayList<>()',
    ],
    correct: 2,
    why: 'ArrayDeque is the fastest general deque and works as stack AND queue. (LinkedList also works but is slower.)',
  },
  {
    q: 'What is the default behavior of PriorityQueue in Java?',
    options: ['max-heap', 'min-heap', 'unordered', 'sorted list'],
    correct: 1,
    why: 'A natural-order min-heap. For a max-heap pass Collections.reverseOrder() or a custom comparator.',
  },
  {
    q: 'How do you remove the VALUE 5 (not index 5) from a List<Integer>?',
    options: [
      'list.remove(5)',
      'list.remove(Integer.valueOf(5))',
      'list.delete(5)',
      'list.drop(5)',
    ],
    correct: 1,
    why: 'remove(int) removes by index; boxing the value selects the Object overload.',
  },
  {
    q: 'Why does backtracking code use new ArrayList<>(path) when recording an answer?',
    options: [
      'It is faster',
      'path keeps mutating — you must snapshot it',
      'required by the compiler',
      'it sorts the elements',
    ],
    correct: 1,
    why: 'The constructor copies the current contents; the live path continues to add/remove during recursion.',
  },
  {
    q: 'What is (7 + 2) / 2 in Java, and what is the correct integer ceiling of 7/2?',
    options: ['3 and 4 via (7 + 2 - 1) / 2', '4 and 4', '3.5 and 4', '4 and 3'],
    correct: 0,
    why: 'Integer division truncates. The ceil idiom for a/b is (a + b - 1) / b.',
  },
  {
    q: 'You must sort intervals by their end value. Which line is correct and safe?',
    options: [
      'Arrays.sort(intervals, (a, b) -> a[1] - b[1])',
      'Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]))',
      'Arrays.sort(intervals, a[1], b[1])',
      'Arrays.compare(intervals)',
    ],
    correct: 1,
    why: 'Integer.compare avoids the overflow that a - b can hit on extreme values, and sorts ascending by column 1.',
  },
  {
    q: 'map.get(key) for a missing key returns null. What is the safe counting idiom?',
    options: [
      'try/catch around get',
      'map.getOrDefault(key, 0) + 1',
      'map.get(key) + 1',
      'map.put(key, map.size())',
    ],
    correct: 1,
    why: 'getOrDefault avoids the NullPointerException from unboxing null. map.merge(key, 1, Integer::sum) is the one-call version.',
  },
  {
    q: 'What does s.length() vs arr.length vs list.size() tell you about Java?',
    options: [
      'inconsistent APIs — memorize all three',
      'they are interchangeable',
      'only length() exists',
      'arrays have length(), lists have .length',
    ],
    correct: 0,
    why: 'String: s.length(). Array: arr.length (no parens). List: list.size(). A classic OA time-waster.',
  },
  {
    q: 'Why is StringBuilder preferred over String += inside loops?',
    options: [
      'it looks cleaner',
      'Strings are immutable — += copies each time, StringBuilder appends in O(1) amortized',
      'compiler forbids +=',
      'it sorts as you build',
    ],
    correct: 1,
    why: 'Each += allocates a new String (O(n) copy). StringBuilder grows a backing array — O(n) total instead of O(n²).',
  },
  {
    q: 'Which call splits "a,b;;c" on any run of non-letters?',
    options: [
      's.split(",")',
      's.split("[^a-zA-Z]+")',
      's.split(".", -1)',
      's.trim()',
    ],
    correct: 1,
    why: 'split also takes a regex; [^a-zA-Z]+ matches runs of non-letters and swallows ;; in one go.',
  },
  {
    q: 'What is Arrays.fill(memo, -1) used for?',
    options: [
      'sorting the array',
      'initializing a memoization table with a "not computed" sentinel',
      'resetting memory to zero',
      'creating a new array',
    ],
    correct: 1,
    why: 'DP top-down memo tables start as -1 (or another out-of-domain value) to mean "no answer computed yet".',
  },
  {
    q: 'Which imports do HashMap, HashSet, ArrayDeque, PriorityQueue need?',
    options: [
      'java.lang.*',
      'java.util.*',
      'java.io.*',
      'none — they are primitives',
    ],
    correct: 1,
    why: 'All collections live in java.util. In many OA editors you can rely on java.util.* imports being present.',
  },
  {
    q: 'You see while (left < right) with left++/right-- moving inward. Which family is this?',
    options: ['sliding window', 'two pointers', 'binary search', 'backtracking'],
    correct: 1,
    why: 'Two pointers converging from both ends — palindromes, sorted pair sums, container problems.',
  },
  {
    q: 'What is the fastest way to test "was this value seen before?" while scanning an array?',
    options: [
      'scan the array again each time',
      'Set.add(x) and check its boolean return',
      'sort then binary search',
      'store in a List and use contains',
    ],
    correct: 1,
    why: 'HashSet.add returns false when the element already exists — duplicate detection in one line, O(1) average.',
  },
]
