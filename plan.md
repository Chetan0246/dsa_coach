# MASTER BUILD PROMPT — PATTERNPILOT

Build a complete, production-quality but lightweight web application called **PatternPilot**.

PatternPilot is a personal **AI-powered DSA/OA training system for Java**, designed around one core principle:

> **Pattern recognition first. Solution memorization second.**

The app is intended for a 3rd-year IT student preparing for coding assessments, internships, and campus placements over the next 40–60 days.

The product should be inspired by the *learning workflow* of modern AI coding coaches, especially the progressive "think → hint → pattern → optimize → implement" approach, but must have its own branding, layout, copy, implementation, and visual identity.

Do NOT copy any website's source code, branding, assets, exact UI, text, or proprietary content.

---

# 1. PRODUCT GOAL

PatternPilot should act like a personal DSA mentor.

The user should NOT simply open a problem, read a solution, and submit it.

Instead the app should coach the student through:

**Problem → Understand → Think → Brute Force → Find Bottleneck → Recognize Pattern → Optimize → Code → Test → Review**

The application should train the user's ability to answer:

> "I've never seen this exact problem before. What pattern is hiding here?"

This is more important than simply increasing solved-problem count.

---

# 2. CORE PRODUCT PRINCIPLES

Follow these rules throughout the application.

### Rule 1 — Pattern First

Every problem must have an associated DSA pattern.

Examples:

* HashMap lookup
* Frequency counting
* Two pointers
* Sliding window
* Binary search
* Monotonic stack
* Fast/slow pointers
* DFS
* BFS
* Topological sort
* Union-Find
* Backtracking
* Greedy
* 1-D DP
* 2-D DP
* Prefix sum
* Heap / top-K
* Intervals
* Bit manipulation

The application should repeatedly connect individual problems to reusable patterns.

---

### Rule 2 — Don't Reveal Solutions Immediately

The AI coach must behave like a mentor, not a solution generator.

When the user opens a problem, the full solution must NOT be immediately visible.

The user should first attempt the problem.

Available assistance:

* "I'm stuck"
* "Give me a smaller hint"
* "Help me understand"
* "Show the bottleneck"
* "Show the pattern"
* "Show implementation guidance"
* "Reveal solution"

Hints must become progressively stronger.

---

### Rule 3 — Every Solution Must Teach Reuse

After solving a problem, show:

**Pattern**

**Why this pattern fits**

**Recognition signals**

**Common trap**

**Java tools used**

**Time complexity**

**Space complexity**

**How this pattern appears in another problem**

This turns every solved problem into reusable knowledge.

---

### Rule 4 — Track Learning Quality

Do not only track "solved".

Track:

* attempted
* solved
* failed
* time spent
* hints used
* pattern recognized
* confidence
* retries
* review status

Calculate a simple **Pattern Recognition Score**.

Example concept:

High score:

* solved quickly
* no hints
* correctly identified pattern

Lower score:

* required multiple hints
* needed solution reveal
* took multiple retries

This is strictly a **learning metric**, not a judgment about intelligence or ability.

---

# 3. TECH STACK

Keep the stack lightweight.

Preferred:

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Lucide icons
* localStorage / IndexedDB where appropriate

Avoid heavy infrastructure.

Do NOT require:

* Supabase
* Firebase
* PostgreSQL
* authentication
* Redis
* external backend
* microservices

for the MVP.

The application must work entirely client-side.

---

# 4. OPTIONAL AI ARCHITECTURE

Design the application so a real AI API can be connected later.

Create an abstraction such as:

```ts
interface AIProvider {
  getCoachResponse(input: CoachInput): Promise<CoachResponse>;
  analyzeAttempt(input: AttemptInput): Promise<AnalysisResponse>;
  generateHint(input: HintInput): Promise<string>;
}
```

Implement:

```ts
MockAIProvider
```

for the MVP.

The UI should behave as if a real AI coach is present.

Later a provider can be added for:

* OpenAI
* Gemini
* Claude
* OpenRouter
* local Ollama
* local llama.cpp

Do NOT hard-code API keys.

Provide environment variable placeholders such as:

```env
VITE_AI_PROVIDER=
VITE_AI_API_KEY=
VITE_AI_BASE_URL=
VITE_AI_MODEL=
```

Never expose secrets in source control.

---

# 5. APPLICATION STRUCTURE

Create the following main sections.

## Dashboard

Route:

```text
/
```

Dashboard should show:

### Header

"PatternPilot"

Subtitle:

"Train your pattern recognition. Not your memory."

### Today's Focus

Display:

* today's problem
* pattern
* estimated duration
* difficulty
* progress

Button:

**Start Practice**

---

### Progress Overview

Cards:

```text
Problems
23 / 150
```

```text
Patterns
8 / 18
```

```text
Streak
6 days
```

```text
Accuracy
74%
```

---

### Learning Metrics

Show:

* solved without hints
* solved with hints
* average solve time
* pattern recognition score
* strongest pattern
* weakest pattern

---

### Current Phase

Example:

```text
Phase 2
Pattern Recognition

██████████░░░░

18 / 30 completed
```

---

### Recent Activity

Show recent problems with:

* problem
* pattern
* result
* time
* hints used

---

# 6. SIDEBAR NAVIGATION

Desktop sidebar:

```text
PatternPilot

Dashboard
Roadmap
Practice
Patterns
Review
Notes

────────────

Java Toolkit
Settings
```

On mobile use a bottom navigation or collapsible menu.

---

# 7. ROADMAP

Create a dedicated Roadmap page.

Display the complete **150-problem curriculum**.

Group problems into pattern families.

Recommended roadmap:

### Phase 1 — Arrays & Hashing

Examples:

* Two Sum
* Contains Duplicate
* Valid Anagram
* Group Anagrams
* Top K Frequent Elements
* Product of Array Except Self
* Valid Sudoku
* Encode and Decode Strings
* Longest Consecutive Sequence

---

### Phase 2 — Two Pointers

Examples:

* Valid Palindrome
* Two Sum II
* 3Sum
* Container With Most Water
* Trapping Rain Water

---

### Phase 3 — Sliding Window

Examples:

* Best Time to Buy and Sell Stock
* Longest Substring Without Repeating Characters
* Longest Repeating Character Replacement
* Permutation in String
* Minimum Window Substring
* Sliding Window Maximum

---

### Phase 4 — Stack

Examples:

* Valid Parentheses
* Min Stack
* Evaluate Reverse Polish Notation
* Generate Parentheses
* Daily Temperatures
* Car Fleet
* Largest Rectangle in Histogram

---

### Phase 5 — Binary Search

Examples:

* Binary Search
* Search a 2D Matrix
* Koko Eating Bananas
* Find Minimum in Rotated Sorted Array
* Search in Rotated Sorted Array
* Time Based Key-Value Store
* Median of Two Sorted Arrays

---

### Phase 6 — Linked List

Examples:

* Reverse Linked List
* Merge Two Sorted Lists
* Linked List Cycle
* Reorder List
* Remove Nth Node From End
* Copy List With Random Pointer
* Add Two Numbers
* Find the Duplicate Number
* LRU Cache
* Merge K Sorted Lists
* Reverse Nodes in K-Group

---

### Phase 7 — Trees

Examples:

* Maximum Depth of Binary Tree
* Same Tree
* Invert Binary Tree
* Binary Tree Maximum Path Sum
* Diameter of Binary Tree
* Balanced Binary Tree
* Subtree of Another Tree
* Lowest Common Ancestor of a BST
* Binary Tree Level Order Traversal
* Binary Tree Right Side View
* Count Good Nodes
* Validate BST
* Kth Smallest Element in a BST
* Construct Binary Tree from Preorder and Inorder
* Serialize and Deserialize Binary Tree

---

### Phase 8 — Heap / Priority Queue

Examples:

* Kth Largest Element in an Array
* Last Stone Weight
* K Closest Points to Origin
* Task Scheduler
* Design Twitter
* Find Median From Data Stream

---

### Phase 9 — Backtracking

Examples:

* Subsets
* Combination Sum
* Combination Sum II
* Permutations
* Subsets II
* Word Search
* Palindrome Partitioning
* Letter Combinations of a Phone Number
* N-Queens

---

### Phase 10 — Tries

Examples:

* Implement Trie
* Design Add and Search Words
* Word Search II

---

### Phase 11 — Graphs

Examples:

* Number of Islands
* Clone Graph
* Max Area of Island
* Pacific Atlantic Water Flow
* Surrounded Regions
* Rotting Oranges
* Walls and Gates
* Course Schedule
* Course Schedule II
* Graph Valid Tree
* Number of Connected Components
* Redundant Connection
* Word Ladder

---

### Phase 12 — Advanced Graphs

Examples:

* Reconstruct Itinerary
* Min Cost to Connect All Points
* Network Delay Time
* Swim in Rising Water
* Alien Dictionary
* Cheapest Flights Within K Stops

Include algorithms/patterns such as:

* BFS
* DFS
* topological sort
* Dijkstra
* Union-Find
* minimum spanning tree

---

### Phase 13 — 1-D Dynamic Programming

Examples:

* Climbing Stairs
* Min Cost Climbing Stairs
* House Robber
* House Robber II
* Longest Palindromic Substring
* Palindromic Substrings
* Decode Ways
* Coin Change
* Maximum Product Subarray
* Word Break
* Longest Increasing Subsequence
* Partition Equal Subset Sum

---

### Phase 14 — 2-D Dynamic Programming

Examples:

* Unique Paths
* Longest Common Subsequence
* Best Time to Buy and Sell Stock with Cooldown
* Coin Change II
* Target Sum
* Interleaving String
* Longest Increasing Path
* Distinct Subsequences
* Edit Distance
* Burst Balloons
* Regular Expression Matching

---

### Phase 15 — Greedy

Examples:

* Maximum Subarray
* Jump Game
* Jump Game II
* Gas Station
* Hand of Straights
* Merge Triplets
* Partition Labels
* Valid Parenthesis String

---

### Phase 16 — Intervals

Examples:

* Insert Interval
* Merge Intervals
* Non-overlapping Intervals
* Meeting Rooms
* Meeting Rooms II
* Minimum Interval to Include Each Query

---

### Phase 17 — Math & Geometry

Examples:

* Rotate Image
* Spiral Matrix
* Set Matrix Zeroes
* Happy Number
* Plus One
* Pow(x, n)
* Multiply Strings
* Detect Squares

---

### Phase 18 — Bit Manipulation

Examples:

* Single Number
* Number of 1 Bits
* Counting Bits
* Reverse Bits
* Missing Number
* Sum of Two Integers
* Reverse Integer

---

# 8. IMPORTANT: 150-PROBLEM DATA MODEL

Create a typed data structure.

Example:

```ts
export interface Problem {
  id: string;
  title: string;
  slug: string;
  category: string;
  pattern: string;
  difficulty: "Easy" | "Medium" | "Hard";

  shortDescription: string;

  constraints?: string[];

  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];

  recognitionSignals: string[];

  bruteForceIdea: string;

  bottleneck: string;

  patternHint: string;

  optimizationHint: string;

  javaConcepts: string[];

  javaTemplate?: string;

  solutionOutline?: string;

  complexity: {
    time: string;
    space: string;
  };

  commonMistakes: string[];

  estimatedMinutes: number;

  leetcodeUrl?: string;

  tags: string[];

  phase: number;
}
```

Populate the curriculum with 150 problems.

Important:

Do not copy long copyrighted problem statements from LeetCode or other sites.

Use **short original summaries** written specifically for this application.

---

# 9. PROBLEM WORKSPACE

Route:

```text
/practice/:problemId
```

This is the main learning screen.

Use a three-column desktop layout.

### Left

Problem:

```text
Two Sum

Easy

Pattern:
HashMap / Complement Lookup
```

Then:

* description
* examples
* constraints
* notes

---

### Center

Java workspace.

Show:

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {

    }
}
```

Include:

* editor
* Run
* Submit
* Reset
* Copy
* Format

A lightweight textarea-based editor is acceptable for MVP.

Do not require Monaco unless it provides clear value.

---

### Right

AI Coach.

Example:

```text
AI COACH

Step 1 / 6
Understand

Before coding:

What are we given?

What must we return?

What happens if the answer does not exist?

[Check my understanding]
[I'm stuck]
```

---

# 10. SIX-STAGE AI COACH

Implement these exact stages.

## Stage 1 — Understand

Goal:

Make the student restate:

* input
* output
* constraints
* edge cases

Coach should ask questions.

Do not solve the problem.

---

## Stage 2 — Intuition

Ask:

"What changes as you scan the input?"

or

"What information would help you make the next decision?"

or

"Can you describe what you're looking for?"

---

## Stage 3 — Brute Force

Ask the user to develop the simplest correct solution.

Coach may discuss:

* loops
* nested loops
* recursion
* straightforward simulation

---

## Stage 4 — Bottleneck

Ask:

"What makes this approach too slow?"

Then connect:

```text
Brute force
↓
Too many repeated operations
↓
Can we remember useful information?
```

---

## Stage 5 — Pattern

Only now reveal the relevant pattern.

Example:

```text
Pattern Signal

You need to repeatedly check whether a previously
seen value can help you solve the current value.

Think:
"Have I seen the thing I need before?"

Pattern:
HashMap lookup
```

---

## Stage 6 — Optimize + Implement

Help the student convert the idea to Java.

Show:

* data structure choice
* Java syntax
* complexity
* implementation structure

Then allow:

**Reveal solution**

---

# 11. HINT SYSTEM

Implement progressive hints.

Button:

```text
I'm stuck
```

opens:

```text
Hint 1
Think about what information
you could remember while scanning.
```

Second click:

```text
Hint 2
Can you store previously seen
values for constant-time lookup?
```

Third:

```text
Pattern
HashMap / Complement Lookup
```

Fourth:

```text
Implementation
Use HashMap<Integer, Integer>.
For each number x, check whether
target - x is already present.
```

Only after explicit selection:

```text
Reveal Solution
```

show complete implementation.

Track hint usage.

---

# 12. SUBMISSION FLOW

When the user presses Submit:

Do not immediately display "Correct".

First show:

```text
Before we evaluate:

What pattern did you use?

What is your time complexity?

What is your space complexity?
```

Provide selectors/text inputs.

Example:

```text
Pattern:
[ HashMap ]

Time:
[ O(n) ]

Space:
[ O(n) ]
```

Then evaluate.

---

# 13. MVP CODE EXECUTION

Because this is a lightweight local-first application, a fully secure Java compiler is NOT required initially.

For MVP:

Provide mocked/local test evaluation.

Example:

```text
✓ Test 1 passed
✓ Test 2 passed
✗ Test 3 failed
```

Architect the execution layer:

```ts
interface CodeRunner {
  run(code: string, testCases: TestCase[]): Promise<RunResult>;
}
```

Implement:

```ts
MockCodeRunner
```

Later this can connect to:

* Judge0
* local Java process
* remote sandbox
* custom execution service

Do not create a backend for MVP.

---

# 14. POST-SOLVE ANALYSIS

After successful submission show:

```text
SOLVED

Pattern:
Sliding Window

Time:
O(n)

Space:
O(1)

Hints used:
1

Confidence:
4 / 5
```

Then:

### Pattern Transfer

Show:

```text
You just used:

SLIDING WINDOW

Recognition signals:

• contiguous subarray / substring
• maintain a moving range
• condition changes as window expands/shrinks
```

Then show:

```text
Try next:
Minimum Window Substring
Longest Repeating Character Replacement
Permutation in String
```

---

# 15. PRACTICE MODES

Create these modes.

## Guided Mode

AI coach fully active.

Best for learning.

---

## Timed Mode

Example:

```text
20:00
```

No hints initially.

Best for OA simulation.

---

## Blind Mode

The UI should hide:

* pattern
* tags
* recognition signals

The user sees only the problem.

After submission, reveal the pattern.

This is critical for pattern recognition training.

---

## Review Mode

Only previously failed or low-confidence problems.

---

# 16. PATTERN LIBRARY

Route:

```text
/patterns
```

Create reusable pattern cards.

Each card should contain:

### Pattern name

Example:

**Sliding Window**

### What it solves

Problems involving contiguous ranges.

### Recognition signals

* contiguous substring/subarray
* maintain current range
* expand / shrink
* optimize nested loops

### Mental trigger

```text
"Can I maintain a moving window instead of recalculating?"
```

### Template

Provide a concise Java template.

Example:

```java
int left = 0;

for (int right = 0; right < nums.length; right++) {

    while (/* invalid */) {
        left++;
    }

    // process window
}
```

### Common traps

* forgetting to remove outgoing elements
* incorrect window boundaries
* updating answer at wrong time

### Representative problems

List linked problems.

---

# 17. PATTERN RECOGNITION TRAINER

Create a dedicated feature:

```text
Pattern Drill
```

The app presents a problem description WITHOUT the title/pattern.

Example:

```text
A string is given.
Find the longest substring with no repeated characters.

What pattern do you recognize?
```

Choices:

```text
A. Binary Search
B. Sliding Window
C. DFS
D. Greedy
```

The user chooses.

Then explain:

```text
Why?

The problem asks for a contiguous substring.
The range expands/shrinks while maintaining a condition.

→ Sliding Window
```

This should be one of the core features.

---

# 18. REVIEW SYSTEM

Route:

```text
/review
```

Track problems that should be revisited.

Each review card:

```text
Problem
Pattern
Last attempt
Confidence
Next review
```

Use simple spaced repetition.

Suggested intervals:

```text
Again → 1 day
Hard → 2 days
Good → 4 days
Easy → 7 days
Mastered → 14 days
```

Store timestamps locally.

---

# 19. ERROR / MISTAKE LOG

Create:

```text
/mistakes
```

Allow the user to record:

```text
Mistake type:

Logic
Complexity
Java syntax
Collections
Edge case
Off-by-one
Pattern recognition
Implementation
```

Show analytics:

```text
Your recurring mistakes

Pattern recognition     6
Java Collections        4
Edge cases              3
Off-by-one              3
Complexity              2
```

---

# 20. JAVA TOOLKIT

Create:

```text
/java-toolkit
```

Include quick references.

Sections:

### HashMap

```java
Map<Integer, Integer> map = new HashMap<>();

map.put(key, value);

map.get(key);

map.containsKey(key);

map.getOrDefault(key, 0);
```

---

### HashSet

```java
Set<Integer> set = new HashSet<>();

set.add(x);
set.contains(x);
set.remove(x);
```

---

### ArrayList

```java
List<Integer> list = new ArrayList<>();

list.add(x);
list.get(i);
list.remove(i);
list.size();
```

---

### ArrayDeque

Use this as the preferred stack/queue reference.

```java
Deque<Integer> dq = new ArrayDeque<>();

dq.push(x);
dq.pop();
dq.peek();

dq.offer(x);
dq.poll();
dq.peek();
```

---

### PriorityQueue

```java
PriorityQueue<Integer> pq =
    new PriorityQueue<>();

pq.offer(x);
pq.poll();
pq.peek();
```

Max heap:

```java
PriorityQueue<Integer> pq =
    new PriorityQueue<>(Collections.reverseOrder());
```

---

### Arrays.sort

```java
Arrays.sort(nums);
```

---

### StringBuilder

```java
StringBuilder sb = new StringBuilder();

sb.append("a");
sb.reverse();
sb.toString();
```

Keep the toolkit extremely compact.

---

# 21. SEARCH / COMMAND PALETTE

Implement:

```text
Ctrl + K
```

or:

```text
Cmd + K
```

Search:

```text
Find a problem
Find a pattern
Open roadmap
Open review
Open Java toolkit
Start today's practice
```

Make this fast.

---

# 22. LOCAL DATA STORAGE

No login.

Persist all user progress locally.

Use a structure similar to:

```ts
interface UserProgress {
  solvedProblems: string[];
  attemptedProblems: string[];
  failedProblems: string[];

  problemStats: Record<string, ProblemStats>;

  patternStats: Record<string, PatternStats>;

  reviewQueue: ReviewItem[];

  mistakes: Mistake[];

  notes: Record<string, string>;

  streak: number;

  lastPracticeDate: string | null;
}
```

Use localStorage initially.

Create:

```ts
storage.ts
```

with helpers:

```ts
loadProgress()
saveProgress()
resetProgress()
exportProgress()
importProgress()
```

---

# 23. EXPORT / IMPORT

Settings page must support:

```text
Export Progress
```

Download JSON.

Also:

```text
Import Progress
```

Allow importing JSON.

Validate schema before loading.

Also provide:

```text
Reset All Progress
```

with confirmation modal.

---

# 24. THEME

Support:

* Dark
* Light
* System

Default:

Dark.

Do not use excessive gradients.

Use:

* neutral dark background
* cards
* borders
* subtle shadows
* one primary accent
* one success accent

Keep it clean.

---

# 25. VISUAL DESIGN

The application should feel like:

**developer tool + study dashboard + AI mentor**

NOT:

* gaming dashboard
* flashy SaaS landing page
* overly animated AI website
* generic admin dashboard

Design principles:

* compact
* readable
* high information density
* keyboard-friendly
* responsive
* fast

Typography:

Use a modern sans-serif.

Use monospace for:

* Java code
* complexity
* patterns
* commands

---

# 26. RESPONSIVE DESIGN

Desktop:

```text
Sidebar | Main Content | AI Coach
```

Tablet:

```text
Sidebar + stacked content
```

Mobile:

```text
Top bar
Problem
Coach
Editor
Bottom navigation
```

AI Coach should become a collapsible drawer on mobile.

---

# 27. ANIMATIONS

Use very little animation.

Acceptable:

* progress bar transitions
* modal fade
* panel expand
* hover

Avoid:

* particles
* animated backgrounds
* huge gradients
* unnecessary motion
* expensive canvas effects

Performance matters.

---

# 28. ACCESSIBILITY

Implement:

* semantic HTML
* keyboard navigation
* visible focus states
* proper buttons
* aria labels where needed
* sufficient contrast

The application should be usable without a mouse.

---

# 29. DATA / SEED CONTENT

Populate at least 150 problem records.

For every record include:

* title
* category
* pattern
* difficulty
* short original description
* 1–3 example cases
* recognition signals
* brute force idea
* bottleneck
* pattern hint
* optimization hint
* Java concepts
* complexity
* common mistakes
* estimated time

Do NOT paste large copyrighted problem statements.

Write concise original descriptions.

Use real well-known DSA/OA problems.

Prefer a structure inspired by high-value interview curriculums such as NeetCode-style problem coverage, but make PatternPilot's categorization and coaching content original.

---

# 30. FIRST 30 PROBLEMS TO FULLY DETAIL

These must be fully populated with excellent coaching content.

1. Two Sum
2. Contains Duplicate
3. Valid Anagram
4. Group Anagrams
5. Product of Array Except Self
6. Longest Consecutive Sequence
7. Valid Palindrome
8. 3Sum
9. Container With Most Water
10. Best Time to Buy and Sell Stock
11. Longest Substring Without Repeating Characters
12. Minimum Window Substring
13. Valid Parentheses
14. Daily Temperatures
15. Binary Search
16. Search in Rotated Sorted Array
17. Reverse Linked List
18. Merge Two Sorted Lists
19. Linked List Cycle
20. Maximum Depth of Binary Tree
21. Invert Binary Tree
22. Binary Tree Level Order Traversal
23. Kth Largest Element in an Array
24. Subsets
25. Combination Sum
26. Number of Islands
27. Clone Graph
28. Course Schedule
29. Climbing Stairs
30. House Robber

Then fill the remaining roadmap to 150.

---

# 31. PROBLEM PAGE UX EXAMPLE

The experience should look approximately like:

```text
──────────────────────────────────────────────────────

Two Sum                         Easy
Pattern: HashMap

Find two numbers whose sum equals target.

Examples
...

Constraints
...

──────────────────────────────────────────────────────

YOUR APPROACH

[Java editor]

class Solution {
    public int[] twoSum(int[] nums, int target) {

    }
}

[Run] [Submit] [Reset]

──────────────────────────────────────────────────────

AI COACH

Step 2 / 6

INTUITION

What information would help you determine
whether the current number has a matching
number you've already seen?

[I'm stuck]

──────────────────────────────────────────────────────
```

---

# 32. COACH PERSONALITY

The AI coach should behave like a strong technical mentor.

Personality:

* calm
* concise
* Socratic
* encouraging
* technically precise
* never condescending

Avoid:

"Great job!!! 🎉🔥🚀"

Prefer:

"You're on the right track. What information would let you check a previous element in constant time?"

The coach should ask questions before giving answers.

---

# 33. COACH RESPONSE LENGTH

Default AI responses:

1–5 sentences.

Avoid huge explanations.

Allow:

```text
Explain deeper
```

for expanded explanations.

This keeps practice focused.

---

# 34. PATTERN RECOGNITION SIGNALS

Every pattern must have explicit "signals".

Example:

### HashMap

Signals:

* need lookup of previous values
* counting frequency
* pair/complement
* grouping
* duplicate detection

Mental trigger:

> "Do I need to remember something I've already seen?"

---

### Two Pointers

Signals:

* sorted array
* pair relationship
* opposite ends
* remove/skip duplicates

Mental trigger:

> "Can two moving positions replace nested loops?"

---

### Sliding Window

Signals:

* contiguous subarray
* contiguous substring
* longest/shortest valid range
* condition changes as range moves

Mental trigger:

> "Can I maintain a moving range instead of recomputing?"

---

### Binary Search

Signals:

* sorted data
* monotonic condition
* search space can be halved

Mental trigger:

> "Can I eliminate half the possibilities?"

---

### BFS

Signals:

* shortest path in unweighted graph
* levels
* nearest state
* grid distance

Mental trigger:

> "Do I need to explore outward level by level?"

---

### DFS

Signals:

* explore connected structure
* recursion
* trees
* graph traversal
* components

Mental trigger:

> "Can I fully explore one path before moving to another?"

---

### Dynamic Programming

Signals:

* repeated subproblems
* choices
* optimal result
* state depends on previous states

Mental trigger:

> "Am I solving the same smaller problem repeatedly?"

Create similar recognition signals for every major pattern.

---

# 35. DAILY PRACTICE SYSTEM

Dashboard should generate a daily plan.

Example:

```text
TODAY

1 Pattern Drill
2 New Problems
1 Review Problem
```

Example:

```text
Today's pattern:
Sliding Window

New:
Longest Substring Without Repeating Characters

Review:
Best Time to Buy and Sell Stock
```

Allow:

```text
Start Today's Session
```

---

# 36. SESSION MODE

Create a focused practice session.

Session states:

```text
Warm-up
↓
Problem 1
↓
Pattern Drill
↓
Problem 2
↓
Review
↓
Session Summary
```

At end:

```text
SESSION COMPLETE

Problems solved: 3
Hints used: 2
Patterns recognized: 2
Average time: 18 min

Pattern to revisit:
Sliding Window

Tomorrow:
Review Sliding Window
```

---

# 37. O/A SIMULATION

Create:

```text
OA Mode
```

Allow configuration:

```text
Duration:
30 / 45 / 60 / 90 minutes

Problems:
1 / 2 / 3 / 4

Difficulty:
Mixed

Hints:
OFF
```

Then start a clean testing environment.

At the end show a factual performance summary:

```text
Time used
Problems attempted
Problems completed
Test cases passed
Patterns identified
```

Do NOT make exaggerated claims such as:

"You're ready for FAANG."

---

# 38. ANALYTICS

Create a lightweight analytics page.

Show:

```text
Problems solved over time
```

```text
Pattern distribution
```

```text
Average solve time
```

```text
Hints per problem
```

```text
Confidence vs outcome
```

```text
Weak patterns
```

Use simple CSS/SVG charts rather than importing a huge chart library unless necessary.

---

# 39. NOTES

Allow notes for every problem.

Example:

```text
My mistake:

Forgot to shrink the window when duplicate
was detected.

Remember:
Sliding Window = expand + repair.
```

Persist notes.

---

# 40. OFFLINE-FIRST

The application should work without internet after the application loads.

All:

* roadmap
* patterns
* problems
* progress
* notes
* reviews

must be available locally.

AI features use mock responses when no AI provider exists.

Show:

```text
AI Provider:
Local Demo
```

rather than pretending a real model is active.

---

# 41. ARCHITECTURE

Organize code cleanly.

Suggested:

```text
src/
  components/
  pages/
  data/
    problems.ts
    patterns.ts
  lib/
    storage.ts
    ai/
      provider.ts
      mockProvider.ts
    runner/
      runner.ts
      mockRunner.ts
  hooks/
  types/
  utils/
  styles/
```

Use reusable components.

Avoid one giant component.

---

# 42. IMPORTANT STATE MANAGEMENT RULE

Do not over-engineer state management.

Start with:

* React state
* Context where useful
* localStorage

Do NOT add Redux unless there is a clear need.

---

# 43. EMPTY STATES

Design useful empty states.

Example:

### Review

```text
Nothing to review yet.

Problems you struggle with will appear here.
```

### Mistakes

```text
No mistakes logged.

Your first failed attempt will create your review history.
```

### Dashboard

If no progress:

```text
Your roadmap is waiting.

Start with Problem #1:
Two Sum
```

---

# 44. ERROR HANDLING

Handle:

* malformed import JSON
* localStorage failure
* missing problem
* invalid route
* mock runner failures

Do not allow the entire application to crash.

Create friendly error states.

---

# 45. PERFORMANCE

Optimize for low-end laptops.

Avoid:

* massive bundles
* unnecessary dependencies
* continuous polling
* heavy animations
* huge images
* large UI frameworks

The app should feel instant.

---

# 46. LANDING EXPERIENCE

Do not create a huge marketing page.

The root should immediately feel like the student's workspace.

Example header:

```text
PatternPilot
DSA practice built around pattern recognition.
```

Then show:

```text
Continue Practice
```

and the roadmap.

---

# 47. BRANDING

Name:

**PatternPilot**

Tagline:

**Train the pattern. Solve the problem.**

Alternative supporting text:

**A lightweight AI DSA coach for Java OA preparation.**

Use a subtle symbol/icon representing:

```text
pattern → direction → solution
```

Do not use copied branding from any reference website.

---

# 48. INITIAL USER JOURNEY

First launch:

```text
Welcome to PatternPilot

Your goal:
150 problems
40–60 days
Pattern-first preparation

Your language:
Java

Your daily target:
2 problems

[Start Roadmap]
```

Then take user to:

```text
Problem 1 — Two Sum
```

---

# 49. FIRST PROBLEM EXPERIENCE

For Two Sum, the initial coach message should be similar in spirit to:

```text
STEP 1 — UNDERSTAND

Before we think about code:

What are the inputs?

What must the function return?

Can the same element be used twice?

Give me your understanding first.
```

Do not immediately mention HashMap.

Once the user progresses:

```text
STEP 5 — PATTERN

You're repeatedly asking:

"Have I already seen the value I need?"

That is a classic lookup pattern.

Think HashMap.
```

Only then provide Java details.

---

# 50. COMPLEXITY TRAINING

After every problem make the user identify:

```text
Time complexity:
O(?)

Space complexity:
O(?)
```

Then explain why.

Make complexity part of the learning workflow, not an optional afterthought.

---

# 51. JAVA IMPLEMENTATION TEACHING

When the coach reaches implementation stage, teach only the Java syntax required.

Example:

Instead of a huge Collections lecture:

```text
Today you need HashMap.

Remember:

put
get
containsKey
getOrDefault
```

Then continue solving.

This is deliberate.

---

# 52. NO SOLUTION MEMORIZATION

The app should explicitly warn against:

```text
"I remember this exact problem."
```

Instead teach:

```text
"I recognize this pattern."
```

Add a post-solve prompt:

```text
Could you solve a different problem
using the same pattern?
```

Then present a related problem.

---

# 53. INTER-PROBLEM CONNECTIONS

Every problem should be connected to 2–4 other problems using the same pattern.

Example:

```text
Two Sum
↓
HashMap

Related:
Group Anagrams
Top K Frequent Elements
Longest Consecutive Sequence
```

Show:

```text
Same pattern, different surface problem.
```

---

# 54. DESIGN FOR ITERATION

The codebase must make these later additions easy:

* real AI API
* Java compiler execution
* authentication
* cloud sync
* leaderboard
* browser extension
* VS Code extension
* mobile app

But DO NOT implement those now.

Keep the MVP focused.

---

# 55. TESTING

Before considering the app complete, verify:

### Navigation

* Dashboard
* Roadmap
* Practice
* Patterns
* Review
* Notes
* Java Toolkit
* Settings

### Problem workflow

* open problem
* start timer
* use hint
* progress through coach steps
* submit
* enter complexity
* mark solved
* confidence
* review scheduling

### Persistence

* refresh page
* progress remains
* notes remain
* timer state behaves correctly
* export works
* import works
* reset works

### Responsive

Test:

* desktop
* tablet
* mobile

---

# 56. QUALITY BAR

Do not stop at generating placeholder screens.

The app should be actually usable.

Avoid:

* fake buttons
* dead navigation
* lorem ipsum
* placeholder charts
* empty mock pages
* "coming soon" everywhere

At least the core loop must function completely:

```text
Dashboard
→ Roadmap
→ Problem
→ Attempt
→ AI Coach
→ Hint
→ Code
→ Submit
→ Complexity
→ Solve
→ Review
→ Dashboard updated
```

---

# 57. FINAL IMPLEMENTATION PRIORITIES

Prioritize in this exact order:

### Priority 1

Core practice loop.

### Priority 2

Problem + pattern dataset.

### Priority 3

Progress tracking.

### Priority 4

AI coach interface.

### Priority 5

Pattern library.

### Priority 6

Review system.

### Priority 7

Java toolkit.

### Priority 8

Analytics.

Do not waste time making the landing page fancy.

---

# 58. FINAL ACCEPTANCE TEST

The project is complete only when a user can do this:

1. Open PatternPilot.
2. See today's problem.
3. Open Two Sum.
4. Read the problem.
5. Attempt it.
6. Start a timer.
7. Ask the AI for a hint.
8. Receive a small hint.
9. Ask for another hint.
10. Identify the pattern.
11. Write Java code.
12. Run mock tests.
13. Submit.
14. Enter complexity.
15. Mark confidence.
16. Finish the problem.
17. See pattern explanation.
18. See related problems.
19. Have progress saved.
20. See the problem appear in review when appropriate.

Everything above must work locally.

---

# 59. BUILD PHILOSOPHY

Do not build this as a generic AI wrapper.

Build a genuine **learning system**.

The key loop is:

```text
Attempt
   ↓
Question
   ↓
Hint
   ↓
Pattern
   ↓
Optimization
   ↓
Implementation
   ↓
Reflection
   ↓
Review
   ↓
Pattern mastery
```

The interface should constantly reinforce:

> **Don't memorize Two Sum. Learn the lookup pattern.**

> **Don't memorize Sliding Window problems. Learn when a moving window applies.**

> **Don't memorize Java syntax. Learn the minimum tool needed to implement the pattern.**

The application should feel like a personal coach that gradually makes itself less necessary as the student's pattern recognition improves.

---

# 60. IMPLEMENTATION INSTRUCTION TO ANTIGRAVITY

Start by creating the complete project structure.

Then implement the application in this order:

1. routing + layout
2. problem/pattern data
3. dashboard
4. roadmap
5. practice workspace
6. AI coach
7. progress tracking
8. review system
9. Java toolkit
10. analytics
11. settings/import/export
12. responsive polish
13. testing and bug fixing

Do not stop after scaffolding.

Write the actual working code.

Use sensible defaults instead of repeatedly asking questions.

When a design decision is ambiguous, prefer:

**lighter + simpler + faster + local-first**

over:

**more features + more dependencies + more infrastructure**

Final result:

A polished, fast, responsive, local-first application named **PatternPilot** that helps a student master DSA patterns through guided practice rather than solution memorization.
