const express = require('express');
const router = express.Router();

// Mock favorites data
const mockFavorites = [
  {
    _id: '1',
    title: 'Quick Sort Algorithm',
    code: 'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.slice(1).filter(x => x < pivot);\n  const right = arr.slice(1).filter(x => x >= pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}',
    language: 'javascript',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    tags: ['algorithm', 'sorting', 'efficiency']
  },
  {
    _id: '2',
    title: 'Binary Search',
    code: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
    language: 'python',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    tags: ['algorithm', 'search', 'efficiency']
  }
];

router.get('/', async (req, res) => {
  try {
    // In a real implementation, this would fetch from database
    // For now, return mock data
    res.json(mockFavorites);
  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    
    // In a real implementation, this would delete from database
    // For now, just return success
    res.json({ success: true, message: 'Favorite deleted successfully' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
});

module.exports = router;
