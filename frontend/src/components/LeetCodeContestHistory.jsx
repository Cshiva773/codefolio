import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function LeetCodeContestHistory({ username }) {
  const [contestData, setContestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    
    const fetchContestHistory = async () => {
      try {
        const graphqlQuery = {
          query: `{
            userContestRankingHistory(username: "${username}") {
              contest {
                title
                startTime
              }
              ranking
              rating
            }
          }`
        };
        
        const response = await fetch('https://codefolio-4.onrender.com/api/leetcode', {  // Use your backend server URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(graphqlQuery),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch contest history');
        }
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'GraphQL error');
        }
        
        const history = result.data.userContestRankingHistory || [];
        
        // Format data for recharts
        const formattedData = history.map(entry => ({
          contestName: entry.contest.title.replace('Weekly Contest ', 'WC ').replace('Biweekly Contest ', 'BC '),
          date: new Date(entry.contest.startTime * 1000).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: '2-digit'
          }),
          rating: entry.rating,
          ranking: entry.ranking,
          timestamp: entry.contest.startTime
        }));
        
        // Sort by contest date (ascending)
        formattedData.sort((a, b) => a.timestamp - b.timestamp);
        
        setContestData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contest history:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchContestHistory();
  }, [username]);

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="contest-tooltip">
          <p className="contest-name">{payload[0].payload.contestName}</p>
          <p className="contest-date">{payload[0].payload.date}</p>
          <p className="contest-rating">Rating: <strong>{payload[0].value}</strong></p>
          <p className="contest-ranking">Rank: #{payload[0].payload.ranking}</p>
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="contest-history-loading">
        <div className="loading-spinner"></div>
        <p>Loading contest history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contest-history-error">
        <p>Error loading contest history: {error}</p>
      </div>
    );
  }

  if (!contestData || contestData.length === 0) {
    return (
      <div className="contest-history-empty">
        <p>No contest history available for {username}.</p>
      </div>
    );
  }

  return (
    <div className="section-card contest-history-card">
      <h2 className="section-title">Contest Rating History</h2>
      <div className="contest-history-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={contestData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={false} />
            <YAxis 
              domain={['dataMin - 100', 'dataMax + 100']}
              label={{ angle: -90, position: 'insideLeft' }}
              tickValues={[1600, 1700, 1800, 1900, 2000, 2100, 2200]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Contest Rating"
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="contest-stats">
          <div className="contest-stat-item">
            <div className="stat-label">Current Rating</div>
            <div className="stat-value">{contestData[contestData.length - 1]?.rating || 'N/A'}</div>
          </div>
          <div className="contest-stat-item">
            <div className="stat-label">Highest Rating</div>
            <div className="stat-value">
              {Math.max(...contestData.map(item => item.rating))}
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default LeetCodeContestHistory;