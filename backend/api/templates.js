const express = require('express');
const router = express.Router();

// Mock templates data
const mockTemplates = {
  algorithms: {
    python: [
      {
        id: '1',
        name: 'Binary Search',
        category: 'algorithms',
        language: 'python',
        code: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
        description: 'Efficient search algorithm for sorted arrays'
      },
      {
        id: '2',
        name: 'Quick Sort',
        category: 'algorithms',
        language: 'python',
        code: 'def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)',
        description: 'Efficient sorting algorithm'
      }
    ],
    javascript: [
      {
        id: '3',
        name: 'Quick Sort',
        category: 'algorithms',
        language: 'javascript',
        code: 'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.slice(1).filter(x => x < pivot);\n  const right = arr.slice(1).filter(x => x >= pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}',
        description: 'Efficient sorting algorithm in JavaScript'
      }
    ],
    java: [
      {
        id: '4',
        name: 'Binary Search',
        category: 'algorithms',
        language: 'java',
        code: 'public static int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}',
        description: 'Binary search implementation in Java'
      }
    ]
  },
  'data-structures': {
    python: [
      {
        id: '5',
        name: 'Stack Implementation',
        category: 'data-structures',
        language: 'python',
        code: 'class Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        self.items.append(item)\n    \n    def pop(self):\n        if not self.is_empty():\n            return self.items.pop()\n    \n    def is_empty(self):\n        return len(self.items) == 0',
        description: 'Simple stack implementation'
      }
    ],
    java: [
      {
        id: '6',
        name: 'Queue Implementation',
        category: 'data-structures',
        language: 'java',
        code: 'import java.util.LinkedList;\nimport java.util.Queue;\n\npublic class QueueExample {\n    public static void main(String[] args) {\n        Queue<Integer> queue = new LinkedList<>();\n        queue.add(1);\n        queue.add(2);\n        queue.add(3);\n        System.out.println(queue.remove()); // 1\n    }\n}',
        description: 'Queue implementation using LinkedList'
      }
    ]
  }
};

router.get('/', async (req, res) => {
  try {
    const { category = 'algorithms', language = 'python' } = req.query;
    
    // Get templates for category and language
    const templates = mockTemplates[category]?.[language] || [];
    
    res.json(templates);
  } catch (error) {
    console.error('Templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

module.exports = router;
