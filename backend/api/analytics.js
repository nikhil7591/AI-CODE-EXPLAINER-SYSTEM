const express = require('express');
const router = express.Router();

// Generate realistic analytics data
function generateAnalyticsData() {
  const now = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      analyses: Math.floor(Math.random() * 50) + 10,
      users: Math.floor(Math.random() * 20) + 5,
      errors: Math.floor(Math.random() * 5)
    };
  });

  const languages = [
    { name: 'Python', count: Math.floor(Math.random() * 200) + 100, percentage: 35 },
    { name: 'JavaScript', count: Math.floor(Math.random() * 150) + 80, percentage: 28 },
    { name: 'Java', count: Math.floor(Math.random() * 100) + 50, percentage: 18 },
    { name: 'C++', count: Math.floor(Math.random() * 80) + 30, percentage: 12 },
    { name: 'Other', count: Math.floor(Math.random() * 50) + 20, percentage: 7 }
  ];

  const bugCategories = [
    { category: 'Syntax Errors', count: Math.floor(Math.random() * 30) + 10, severity: 'high' },
    { category: 'Logic Errors', count: Math.floor(Math.random() * 25) + 15, severity: 'medium' },
    { category: 'Performance Issues', count: Math.floor(Math.random() * 20) + 10, severity: 'medium' },
    { category: 'Style Issues', count: Math.floor(Math.random() * 40) + 20, severity: 'low' },
    { category: 'Security Issues', count: Math.floor(Math.random() * 10) + 5, severity: 'high' }
  ];

  const performance = {
    avgAnalysisTime: Math.random() * 2 + 0.5, // 0.5-2.5 seconds
    totalAnalyses: Math.floor(Math.random() * 1000) + 500,
    successRate: Math.random() * 10 + 90, // 90-100%
    avgCodeLength: Math.floor(Math.random() * 100) + 50 // 50-150 lines
  };

  const userActivity = {
    activeUsers: Math.floor(Math.random() * 100) + 50,
    newUsers: Math.floor(Math.random() * 20) + 5,
    returningUsers: Math.floor(Math.random() * 80) + 40,
    avgSessionDuration: Math.floor(Math.random() * 300) + 120 // 2-7 minutes
  };

  return {
    overview: {
      totalAnalyses: performance.totalAnalyses,
      activeUsers: userActivity.activeUsers,
      avgAnalysisTime: performance.avgAnalysisTime.toFixed(2),
      successRate: performance.successRate.toFixed(1)
    },
    dailyStats: last30Days,
    languageDistribution: languages,
    bugAnalysis: bugCategories,
    performance,
    userActivity,
    trends: {
      analysesGrowth: Math.floor(Math.random() * 20) + 5, // 5-25% growth
      userGrowth: Math.floor(Math.random() * 15) + 3, // 3-18% growth
      errorRate: (Math.random() * 5 + 1).toFixed(1) // 1-6% error rate
    }
  };
}

router.get('/', async (req, res) => {
  try {
    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const analytics = generateAnalyticsData();
    
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get specific analytics category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const analytics = generateAnalyticsData();
    
    switch (category) {
      case 'overview':
        res.json(analytics.overview);
        break;
      case 'languages':
        res.json(analytics.languageDistribution);
        break;
      case 'bugs':
        res.json(analytics.bugAnalysis);
        break;
      case 'performance':
        res.json(analytics.performance);
        break;
      case 'users':
        res.json(analytics.userActivity);
        break;
      case 'trends':
        res.json(analytics.trends);
        break;
      default:
        res.status(400).json({ error: 'Invalid category' });
    }
  } catch (error) {
    console.error('Analytics category error:', error);
    res.status(500).json({ error: 'Failed to fetch category analytics' });
  }
});

// Get real-time stats
router.get('/realtime', async (req, res) => {
  try {
    const realtime = {
      timestamp: new Date().toISOString(),
      activeAnalyses: Math.floor(Math.random() * 10) + 1,
      queueLength: Math.floor(Math.random() * 5),
      serverLoad: Math.random() * 100, // 0-100%
      memoryUsage: Math.random() * 100, // 0-100%
      responseTime: Math.random() * 500 + 100 // 100-600ms
    };
    
    res.json(realtime);
  } catch (error) {
    console.error('Realtime stats error:', error);
    res.status(500).json({ error: 'Failed to fetch realtime stats' });
  }
});

module.exports = router;
