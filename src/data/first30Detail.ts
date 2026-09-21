/** Fully detailed coaching content for the first 30 curriculum problems. */
export interface FullDetail {
  tmpl: string
  code: string
  tests: { input: string; output: string }[]
  con?: string[]
}

export const FIRST30: Record<string, FullDetail> = {
  'Two Sum': {
    tmpl: `class Solution {
    public int[] twoSum(int[] nums, int target) {

    }
}`,
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) return new int[] { seen.get(need), i };
            seen.put(nums[i], i);
        }
        throw new IllegalArgumentException("no answer");
    }
}`,
    tests: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    con: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'exactly one valid answer exists'],
  },
  'Contains Duplicate': {
    tmpl: `class Solution {
    public boolean containsDuplicate(int[] nums) {

    }
}`,
    code: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x)) return true;
        }
        return false;
    }
}`,
    tests: [
      { input: '[1,2,3,1]', output: 'true' },
      { input: '[1,2,3,4]', output: 'false' },
    ],
    con: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
  },
  'Valid Anagram': {
    tmpl: `class Solution {
    public boolean isAnagram(String s, String t) {

    }
}`,
    code: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }
}`,
    tests: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
    con: ['0 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters'],
  },
  'Group Anagrams': {
    tmpl: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {

    }
}`,
    code: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(groups.values());
    }
}`,
    tests: [
      { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: '[""]', output: '[[""]]' },
    ],
    con: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
  },
  'Product of Array Except Self': {
    tmpl: `class Solution {
    public int[] productExceptSelf(int[] nums) {

    }
}`,
    code: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        answer[0] = 1;
        for (int i = 1; i < n; i++) answer[i] = answer[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= suffix;
            suffix *= nums[i];
        }
        return answer;
    }
}`,
    tests: [
      { input: '[1,2,3,4]', output: '[24,12,8,6]' },
      { input: '[-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    con: ['2 <= nums.length <= 10^5', 'division is forbidden'],
  },
  'Longest Consecutive Sequence': {
    tmpl: `class Solution {
    public int longestConsecutive(int[] nums) {

    }
}`,
    code: `class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) set.add(x);
        int best = 0;
        for (int x : set) {
            if (set.contains(x - 1)) continue; // not a run start
            int len = 1;
            while (set.contains(x + len)) len++;
            best = Math.max(best, len);
        }
        return best;
    }
}`,
    tests: [
      { input: '[100,4,200,1,3,2]', output: '4' },
      { input: '[0,3,7,2,5,8,4,6,0,1]', output: '9' },
      { input: '[]', output: '0' },
    ],
    con: ['0 <= nums.length <= 10^5', 'must run in O(n)'],
  },
  'Valid Palindrome': {
    tmpl: `class Solution {
    public boolean isPalindrome(String s) {

    }
}`,
    code: `class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;
            left++;
            right--;
        }
        return true;
    }
}`,
    tests: [
      { input: '"A man, a plan, a canal: Panama"', output: 'true' },
      { input: '"race a car"', output: 'false' },
      { input: '" "', output: 'true' },
    ],
    con: ['1 <= s.length <= 2 * 10^5'],
  },
  '3Sum': {
    tmpl: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {

    }
}`,
    code: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> out = new ArrayList<>();
        for (int i = 0; i < nums.length - 2 && nums[i] <= 0; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum < 0) left++;
                else if (sum > 0) right--;
                else {
                    out.add(List.of(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                }
            }
        }
        return out;
    }
}`,
    tests: [
      { input: '[-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: '[0,0,0,0]', output: '[[0,0,0]]' },
    ],
    con: ['3 <= nums.length <= 3000', 'answer must not contain duplicate triplets'],
  },
  'Container With Most Water': {
    tmpl: `class Solution {
    public int maxArea(int[] height) {

    }
}`,
    code: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1, best = 0;
        while (left < right) {
            best = Math.max(best, Math.min(height[left], height[right]) * (right - left));
            if (height[left] < height[right]) left++;
            else right--;
        }
        return best;
    }
}`,
    tests: [
      { input: '[1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: '[1,1]', output: '1' },
    ],
    con: ['2 <= height.length <= 10^5'],
  },
  'Best Time to Buy and Sell Stock': {
    tmpl: `class Solution {
    public int maxProfit(int[] prices) {

    }
}`,
    code: `class Solution {
    public int maxProfit(int[] prices) {
        int minSoFar = Integer.MAX_VALUE, best = 0;
        for (int price : prices) {
            best = Math.max(best, price - minSoFar);
            minSoFar = Math.min(minSoFar, price);
        }
        return best;
    }
}`,
    tests: [
      { input: '[7,1,5,3,6,4]', output: '5' },
      { input: '[7,6,4,3,1]', output: '0' },
    ],
    con: ['1 <= prices.length <= 10^5'],
  },
  'Longest Substring Without Repeating Characters': {
    tmpl: `class Solution {
    public int lengthOfLongestSubstring(String s) {

    }
}`,
    code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] last = new int[128];
        Arrays.fill(last, -1);
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (last[c] >= left) left = last[c] + 1;
            last[c] = right;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
    tests: [
      { input: '"abcabcbb"', output: '3' },
      { input: '"bbbbb"', output: '1' },
      { input: '"pwwkew"', output: '3' },
    ],
    con: ['0 <= s.length <= 5 * 10^4'],
  },
  'Minimum Window Substring': {
    tmpl: `class Solution {
    public String minWindow(String s, String t) {

    }
}`,
    code: `class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128], have = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int required = t.length(), formed = 0, left = 0;
        int bestLen = Integer.MAX_VALUE, bestStart = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (need[c] > 0 && have[c] < need[c]) formed++;
            have[c]++;
            while (formed == required) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestStart = left;
                }
                char d = s.charAt(left);
                if (have[d] <= need[d] && need[d] > 0) formed--;
                have[d]--;
                left++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}`,
    tests: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
      { input: 's = "a", t = "aa"', output: '""' },
    ],
    con: ['1 <= s.length, t.length <= 10^5'],
  },
  'Valid Parentheses': {
    tmpl: `class Solution {
    public boolean isValid(String s) {

    }
}`,
    code: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            switch (c) {
                case '(' -> stack.push(')');
                case '[' -> stack.push(']');
                case '{' -> stack.push('}');
                default -> {
                    if (stack.isEmpty() || stack.pop() != c) return false;
                }
            }
        }
        return stack.isEmpty();
    }
}`,
    tests: [
      { input: '"()[]{}"', output: 'true' },
      { input: '"([)]"', output: 'false' },
      { input: '"("', output: 'false' },
    ],
    con: ['1 <= s.length <= 10^4'],
  },
  'Daily Temperatures': {
    tmpl: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {

    }
}`,
    code: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] answer = new int[n];
        Deque<Integer> stack = new ArrayDeque<>(); // indices, temps decreasing
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
                int idx = stack.pop();
                answer[idx] = i - idx;
            }
            stack.push(i);
        }
        return answer;
    }
}`,
    tests: [
      { input: '[73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
      { input: '[30,40,50,60]', output: '[1,1,1,0]' },
    ],
    con: ['1 <= temperatures.length <= 10^5'],
  },
  'Binary Search': {
    tmpl: `class Solution {
    public int search(int[] nums, int target) {

    }
}`,
    code: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}`,
    tests: [
      { input: '[-1,0,3,5,9,12], target = 9', output: '4' },
      { input: '[-1,0,3,5,9,12], target = 2', output: '-1' },
    ],
    con: ['1 <= nums.length <= 10^4', 'nums is sorted ascending, values distinct'],
  },
  'Search in Rotated Sorted Array': {
    tmpl: `class Solution {
    public int search(int[] nums, int target) {

    }
}`,
    code: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) { // left half sorted
                if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else { // right half sorted
                if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
}`,
    tests: [
      { input: '[4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: '[4,5,6,7,0,1,2], target = 3', output: '-1' },
    ],
    con: ['1 <= nums.length <= 5000', 'all values distinct'],
  },
  'Reverse Linked List': {
    tmpl: `class Solution {
    public ListNode reverseList(ListNode head) {

    }
}`,
    code: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
    tests: [
      { input: '1 -> 2 -> 3 -> 4 -> 5', output: '5 -> 4 -> 3 -> 2 -> 1' },
      { input: 'null', output: 'null' },
    ],
    con: ['0 <= list length <= 5000'],
  },
  'Merge Two Sorted Lists': {
    tmpl: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {

    }
}`,
    code: `class Solution {
    public ListNode mergeTwoLists(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        return dummy.next;
    }
}`,
    tests: [
      { input: '1 -> 2 -> 4, 1 -> 3 -> 4', output: '1 -> 1 -> 2 -> 3 -> 4 -> 4' },
      { input: 'null, null', output: 'null' },
    ],
    con: ['0 <= list lengths <= 50'],
  },
  'Linked List Cycle': {
    tmpl: `class Solution {
    public boolean hasCycle(ListNode head) {

    }
}`,
    code: `class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
    tests: [
      { input: '1 -> 2 -> 3 -> 4 with 4.next = 2', output: 'true' },
      { input: '1 -> 2', output: 'false' },
    ],
    con: ['0 <= list length <= 10^4', 'O(1) memory requested'],
  },
  'Maximum Depth of Binary Tree': {
    tmpl: `class Solution {
    public int maxDepth(TreeNode root) {

    }
}`,
    code: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
    tests: [
      { input: '[3,9,20,null,null,15,7]', output: '3' },
      { input: '[]', output: '0' },
    ],
    con: ['0 <= nodes <= 10^4'],
  },
  'Invert Binary Tree': {
    tmpl: `class Solution {
    public TreeNode invertTree(TreeNode root) {

    }
}`,
    code: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
}`,
    tests: [
      { input: '[4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
      { input: '[]', output: '[]' },
    ],
    con: ['0 <= nodes <= 100'],
  },
  'Binary Tree Level Order Traversal': {
    tmpl: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {

    }
}`,
    code: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<>();
        if (root == null) return out;
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            out.add(level);
        }
        return out;
    }
}`,
    tests: [
      { input: '[3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: '[]', output: '[]' },
    ],
    con: ['0 <= nodes <= 2000'],
  },
  'Kth Largest Element in an Array': {
    tmpl: `class Solution {
    public int findKthLargest(int[] nums, int k) {

    }
}`,
    code: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>(); // min-heap of size k
        for (int x : nums) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();
        }
        return heap.peek();
    }
}`,
    tests: [
      { input: '[3,2,1,5,6,4], k = 2', output: '5' },
      { input: '[3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
    ],
    con: ['1 <= k <= nums.length <= 10^5', 'solve without full sorting'],
  },
  Subsets: {
    tmpl: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {

    }
}`,
    code: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> out = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), out);
        return out;
    }

    private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> out) {
        out.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1, path, out);
            path.remove(path.size() - 1);
        }
    }
}`,
    tests: [
      { input: '[1,2,3]', output: '[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]' },
      { input: '[0]', output: '[[],[0]]' },
    ],
    con: ['1 <= nums.length <= 10', 'all elements distinct'],
  },
  'Combination Sum': {
    tmpl: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {

    }
}`,
    code: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> out = new ArrayList<>();
        Arrays.sort(candidates);
        backtrack(candidates, target, 0, new ArrayList<>(), out);
        return out;
    }

    private void backtrack(int[] candidates, int remaining, int start, List<Integer> path, List<List<Integer>> out) {
        if (remaining == 0) { out.add(new ArrayList<>(path)); return; }
        for (int i = start; i < candidates.length && candidates[i] <= remaining; i++) {
            path.add(candidates[i]);
            backtrack(candidates, remaining - candidates[i], i, path, out); // i: reuse allowed
            path.remove(path.size() - 1);
        }
    }
}`,
    tests: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
      { input: 'candidates = [2], target = 1', output: '[]' },
    ],
    con: ['1 <= candidates.length <= 30', 'all values distinct'],
  },
  'Number of Islands': {
    tmpl: `class Solution {
    public int numIslands(char[][] grid) {

    }
}`,
    code: `class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    sink(grid, r, c);
                }
            }
        }
        return count;
    }

    private void sink(char[][] grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        sink(grid, r + 1, c);
        sink(grid, r - 1, c);
        sink(grid, r, c + 1);
        sink(grid, r, c - 1);
    }
}`,
    tests: [
      { input: '[[1,1,0],[1,0,0],[0,0,1]]', output: '2' },
      { input: '[[1,1],[1,1]]', output: '1' },
    ],
    con: ['1 <= m, n <= 300', 'grid values are \'0\' or \'1\''],
  },
  'Clone Graph': {
    tmpl: `class Solution {
    public Node cloneGraph(Node node) {

    }
}`,
    code: `class Solution {
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        Map<Node, Node> copies = new HashMap<>();
        return clone(node, copies);
    }

    private Node clone(Node node, Map<Node, Node> copies) {
        Node copy = copies.get(node);
        if (copy != null) return copy;
        copy = new Node(node.val);
        copies.put(node, copy);
        for (Node neighbor : node.neighbors) {
            copy.neighbors.add(clone(neighbor, copies));
        }
        return copy;
    }
}`,
    tests: [
      { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: 'deep copy, same structure' },
      { input: 'adjList = []', output: 'null' },
    ],
    con: ['0 <= nodes <= 100', 'graph is connected when non-empty'],
  },
  'Course Schedule': {
    tmpl: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {

    }
}`,
    code: `class Solution {
    public boolean canFinish(int n, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indegree = new int[n];
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]); // b before a
            indegree[p[0]]++;
        }
        Queue<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (indegree[i] == 0) queue.offer(i);
        int processed = 0;
        while (!queue.isEmpty()) {
            int node = queue.poll();
            processed++;
            for (int next : adj.get(node)) {
                if (--indegree[next] == 0) queue.offer(next);
            }
        }
        return processed == n;
    }
}`,
    tests: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false' },
    ],
    con: ['1 <= numCourses <= 2000'],
  },
  'Climbing Stairs': {
    tmpl: `class Solution {
    public int climbStairs(int n) {

    }
}`,
    code: `class Solution {
    public int climbStairs(int n) {
        int a = 1, b = 1; // ways to reach step 0 and 1
        for (int i = 2; i <= n; i++) {
            int next = a + b;
            a = b;
            b = next;
        }
        return b;
    }
}`,
    tests: [
      { input: 'n = 2', output: '2' },
      { input: 'n = 3', output: '3' },
      { input: 'n = 1', output: '1' },
    ],
    con: ['1 <= n <= 45'],
  },
  'House Robber': {
    tmpl: `class Solution {
    public int rob(int[] nums) {

    }
}`,
    code: `class Solution {
    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;
        for (int x : nums) {
            int take = Math.max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = take;
        }
        return prev1;
    }
}`,
    tests: [
      { input: '[1,2,3,1]', output: '4' },
      { input: '[2,7,9,3,1]', output: '12' },
      { input: '[2,1,1,2]', output: '4' },
    ],
    con: ['1 <= nums.length <= 100'],
  },
}
