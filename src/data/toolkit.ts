/** Java quick-reference snippets for the Java Toolkit page. */
export interface ToolkitSection {
  id: string
  title: string
  note?: string
  snippets: { label?: string; code: string }[]
}

export const TOOLKIT_SECTIONS: ToolkitSection[] = [
  {
    id: 'hashmap',
    title: 'HashMap',
    snippets: [
      {
        code: `Map<Integer, Integer> map = new HashMap<>();
map.put(key, value);
map.get(key);            // null if absent
map.containsKey(key);
map.getOrDefault(key, 0);`,
      },
    ],
  },
  {
    id: 'hashset',
    title: 'HashSet',
    snippets: [
      {
        code: `Set<Integer> set = new HashSet<>();
set.add(x);
set.contains(x);
set.remove(x);`,
      },
    ],
  },
  {
    id: 'arraylist',
    title: 'ArrayList',
    snippets: [
      {
        code: `List<Integer> list = new ArrayList<>();
list.add(x);
list.get(i);
list.remove(i);
list.size();`,
      },
    ],
  },
  {
    id: 'arraydeque',
    title: 'ArrayDeque',
    note: 'Preferred stack / queue: faster than Stack and LinkedList.',
    snippets: [
      {
        code: `Deque<Integer> dq = new ArrayDeque<>();

// as a stack
dq.push(x);
dq.pop();
dq.peek();

// as a queue
dq.offer(x);
dq.poll();
dq.peek();`,
      },
    ],
  },
  {
    id: 'priorityqueue',
    title: 'PriorityQueue',
    snippets: [
      {
        label: 'min-heap (default)',
        code: `PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(x);
pq.poll();
pq.peek();`,
      },
      {
        label: 'max-heap',
        code: `PriorityQueue<Integer> pq =
    new PriorityQueue<>(Collections.reverseOrder());`,
      },
    ],
  },
  {
    id: 'arrays-sort',
    title: 'Arrays.sort',
    snippets: [
      {
        code: `Arrays.sort(nums);

// sort by second element of pairs
Arrays.sort(pairs, (a, b) -> Integer.compare(a[1], b[1]));`,
      },
    ],
  },
  {
    id: 'stringbuilder',
    title: 'StringBuilder',
    snippets: [
      {
        code: `StringBuilder sb = new StringBuilder();
sb.append("a");
sb.reverse();
sb.toString();`,
      },
    ],
  },
]
