import React, { useState, useEffect } from 'react';
import './LeetCodeDashboard.css';
import LeetCodeContestHistory from './LeetCodeContestHistory';
import SideNavbar from './SideNavbar';

function LeetCodeDashboard() {
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [userData,setUserData]=useState(null);
  const [timeFrame, setTimeFrame] = useState('all'); // 'all', 'year', 'month', 'week'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // You can get userData from your existing profile fetching logic
  // Similar to what you have in SocialProfile.jsx and LeetCodeDashboard.jsx
  
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };
  
  // Fetch user profile to get the LeetCode username
  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Authentication token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://codefolio-4.onrender.com/api/user/profile", {
          method: 'GET',
          credentials: 'include',
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();

        // Check for leetcode username
        if (data && data.user) {
          if (data.user.leetcode) {
            setLeetcodeUsername(data.user.leetcode);
            setUserData(data.user)
          } else if (data.user.socialLinks && data.user.socialLinks.leetcode) {
            setLeetcodeUsername(data.user.socialLinks.leetcode);
            setUserData(data.user)
          } else {
            setError("No LeetCode username found in profile");
            setLoading(false);
          }
        } else {
          setError("Unable to retrieve user profile data");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to fetch user profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch LeetCode stats once we have the username
  useEffect(() => {
    if (!leetcodeUsername) return;

    const fetchLeetCodeStats = async () => {
      try {
        const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${leetcodeUsername}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error("Failed to fetch LeetCode activity data");
        }

        const data = await response.json();
        setLeetcodeData(data);
      } catch (error) {
        console.error("Error fetching LeetCode stats:", error);
        setError("Error connecting to LeetCode API");
      } finally {
        setLoading(false);
      }
    };

    fetchLeetCodeStats();
  }, [leetcodeUsername]);

  // Calculate total questions attempted
  const getTotalAttempted = () => {
    if (!leetcodeData) return 0;
    return leetcodeData.totalSolved + ((leetcodeData.totalSubmissions[0]?.count || 0) - leetcodeData.totalSolved);
  };

  // Calculate active days from submissionCalendar
  const getActiveDays = () => {
    if (!leetcodeData || !leetcodeData.submissionCalendar) return 0;
    return Object.keys(leetcodeData.submissionCalendar).length;
  };

  // Calculate current streak
  const getCurrentStreak = () => {
    if (!leetcodeData || !leetcodeData.submissionCalendar) return 0;

    const today = Math.floor(Date.now() / 1000 / 86400) * 86400;
    let streak = 0;
    let currentDay = today;

    while (leetcodeData.submissionCalendar[currentDay]) {
      streak++;
      currentDay -= 86400;
    }

    return streak;
  };

  // Calculate max streak
  const getMaxStreak = () => {
    if (!leetcodeData || !leetcodeData.submissionCalendar) return 0;

    const days = Object.keys(leetcodeData.submissionCalendar).sort((a, b) => parseInt(a) - parseInt(b));
    let maxStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < days.length; i++) {
      const diff = parseInt(days[i]) - parseInt(days[i - 1]);

      if (diff === 86400) { // One day difference
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    return maxStreak;
  };

  // Generate the activity heatmap data
  const getActivityHeatmap = () => {
    if (!leetcodeData || !leetcodeData.submissionCalendar) return [];

    const submissionCalendar = leetcodeData.submissionCalendar;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const result = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      const year = currentDate.getFullYear() - (currentDate.getMonth() < i ? 1 : 0);

      const monthData = {
        month: months[monthIndex],
        days: []
      };

      // Generate days for this month (simplifying to 35 days grid like GitHub)
      for (let j = 0; j < 35; j++) {
        const day = {
          active: false,
          intensity: 0,
          submissions: 0
        };

        // Find if there's a matching day in submission calendar
        for (const timestamp in submissionCalendar) {
          const date = new Date(parseInt(timestamp) * 1000);

          if (date.getMonth() === monthIndex && date.getFullYear() === year) {
            const submissions = submissionCalendar[timestamp];

            // If this is within our simplified grid
            if (date.getDate() - 1 === j % 31) {
              day.active = true;
              day.submissions = submissions;

              // Assign intensity based on submission count
              if (submissions === 0) day.intensity = 0;
              else if (submissions <= 3) day.intensity = 1;
              else if (submissions <= 6) day.intensity = 2;
              else if (submissions <= 10) day.intensity = 3;
              else day.intensity = 4;
            }
          }
        }

        monthData.days.push(day);
      }

      result.push(monthData);
    }

    return result;
  };

  // Calculate problem solving stats
  const getProblemStats = () => {
    if (!leetcodeData) return { easy: 0, medium: 0, hard: 0, total: 0 };

    return {
      easy: leetcodeData.easySolved || 0,
      medium: leetcodeData.mediumSolved || 0,
      hard: leetcodeData.hardSolved || 0,
      total: leetcodeData.totalSolved || 0
    };
  };

  // Calculate total submissions
  const getTotalSubmissions = () => {
    if (!leetcodeData || !leetcodeData.totalSubmissions || leetcodeData.totalSubmissions.length === 0) return 0;

    return leetcodeData.totalSubmissions[0].submissions || 0;
  };

  // Calculate acceptance rate
  const getAcceptanceRate = () => {
    if (!leetcodeData || !leetcodeData.totalSubmissions || leetcodeData.totalSubmissions.length === 0) return "0%";

    const accepted = leetcodeData.totalSubmissions[0].count || 0;
    const total = leetcodeData.totalSubmissions[0].submissions || 1;

    return Math.round((accepted / total) * 100) + "%";
  };

  // Calculate daily average
  const getDailyAverage = () => {
    if (!leetcodeData || !leetcodeData.submissionCalendar) return 0;

    const totalDays = Object.keys(leetcodeData.submissionCalendar).length || 1;
    const totalSolved = leetcodeData.totalSolved || 0;

    return (totalSolved / totalDays).toFixed(1);
  };

  if (loading) {
    return (
      <div className="leetcode-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leetcode-dashboard error">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!leetcodeData) {
    return (
      <div className="leetcode-dashboard no-data">
        <p>No LeetCode data available for {leetcodeUsername}</p>
        <button className="connect-button">Connect LeetCode Account</button>
      </div>
    );
  }

  const problemStats = getProblemStats();
  const activityData = getActivityHeatmap();
  const maxStreak = getMaxStreak();
  const currentStreak = getCurrentStreak();
  console.log("User Data:", userData);


  return (
    <div className="leetcode-dashboard">
      {/* Header Section with Username and Time Frame Selector */}
      <SideNavbar 
        user={userData} 
      />

      {/* Stats Cards */}
      <>


          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-title">Total Solved</div>
              <div className="stat-value">{problemStats.total}</div>
              <div className="stat-subtitle">out of {leetcodeData.totalQuestions}</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Acceptance Rate</div>
              <div className="stat-value">{getAcceptanceRate()}</div>
              <div className="stat-subtitle">{getTotalSubmissions()} submissions</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Active Days</div>
              <div className="stat-value">{getActiveDays()}</div>
              <div className="stat-subtitle">Avg. {getDailyAverage()} problems/day</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Streaks</div>
              <div className="stat-value">{currentStreak}</div>
              <div className="stat-subtitle">Max streak: {maxStreak} days</div>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="section-card">
            <h2 className="section-title">Submission Activity</h2>
            <div className="activity-heatmap">
              {activityData.map((month, idx) => (
                <div key={idx} className="month-column">
                  <div className="month-label">{month.month}</div>
                  <div className="days-grid">
                    {month.days.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        className={`day-cell ${day.active ? `active intensity-${day.intensity}` : ''}`}
                        title={day.active ? `${day.submissions} submissions` : 'No submissions'}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="heatmap-legend">
              <div className="legend-item"><span className="legend-square intensity-0"></span> 0</div>
              <div className="legend-item"><span className="legend-square intensity-1"></span> 1-3</div>
              <div className="legend-item"><span className="legend-square intensity-2"></span> 4-6</div>
              <div className="legend-item"><span className="legend-square intensity-3"></span> 7-10</div>
              <div className="legend-item"><span className="legend-square intensity-4"></span> 10+</div>
            </div>
          </div>

          {leetcodeData && <LeetCodeContestHistory username={leetcodeUsername} />}


          {/* Dashboard Body */}
          <div className="dashboard-body">
            <div className="dashboard-column">
              <div className="section-card">
                <h2 className="section-title">Problem Difficulty Breakdown</h2>
                <div className="problems-chart">
                  <div className="donut-chart">
                    <div className="donut-slice easy" style={{
                      transform: `rotate(0deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((problemStats.easy / problemStats.total) * 2 * Math.PI)}% ${50 - 50 * Math.sin((problemStats.easy / problemStats.total) * 2 * Math.PI)}%, 50% 50%)`
                    }}></div>
                    <div className="donut-slice medium" style={{
                      transform: `rotate(${(problemStats.easy / problemStats.total) * 360}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((problemStats.easy + problemStats.medium) / problemStats.total) * 2 * Math.PI)}% ${50 - 50 * Math.sin(((problemStats.easy + problemStats.medium) / problemStats.total) * 2 * Math.PI)}%, 50% 50%)`
                    }}></div>
                    <div className="donut-slice hard" style={{
                      transform: `rotate(${((problemStats.easy + problemStats.medium) / problemStats.total) * 360}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%, 50% 50%)`
                    }}></div>
                    <div className="donut-center">{problemStats.total}</div>
                  </div>

                  <div className="problem-stats">
                    <div className="problem-type easy">
                      <span className="problem-label">Easy</span>
                      <div className="problem-progress">
                        <div className="progress-bar" style={{ width: `${(problemStats.easy / leetcodeData.totalEasy) * 100}%` }}></div>
                      </div>
                      <span className="problem-count">{problemStats.easy}/{leetcodeData.totalEasy}</span>
                    </div>
                    <div className="problem-type medium">
                      <span className="problem-label">Medium</span>
                      <div className="problem-progress">
                        <div className="progress-bar" style={{ width: `${(problemStats.medium / leetcodeData.totalMedium) * 100}%` }}></div>
                      </div>
                      <span className="problem-count">{problemStats.medium}/{leetcodeData.totalMedium}</span>
                    </div>
                    <div className="problem-type hard">
                      <span className="problem-label">Hard</span>
                      <div className="problem-progress">
                        <div className="progress-bar" style={{ width: `${(problemStats.hard / leetcodeData.totalHard) * 100}%` }}></div>
                      </div>
                      <span className="problem-count">{problemStats.hard}/{leetcodeData.totalHard}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h2 className="section-title">Contribution & Reputation</h2>
                <div className="contribution-section">
                  <div className="contribution-item">
                    <div className="contribution-label">Contribution Points</div>
                    <div className="contribution-value">{leetcodeData.contributionPoint || 0}</div>
                  </div>
                  <div className="contribution-item">
                    <div className="contribution-label">Reputation</div>
                    <div className="contribution-value">{leetcodeData.reputation || 0}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="stat-card bg-white p-4 border border-white shadow-lg rounded-lg">
                  <h2 className="section-title">Ranking</h2>
                  <div className="contribution-value text-gray-500"># {leetcodeData.ranking || 'N/A'}</div>
                </div>
              </div>

            </div>




            <div className="dashboard-column">
              <div className="section-card">
                <h2 className="section-title">Recent Activity</h2>
                <div className="recent-activity">
                  {leetcodeData.recentSubmissions && leetcodeData.recentSubmissions.slice(0, 5).map((submission, index) => (
                    <div key={index} className="activity-item">
                      <div className={`activity-status ${submission.statusDisplay.toLowerCase().replace(' ', '-')}`}>
                        {submission.statusDisplay}
                      </div>
                      <div className="activity-details">
                        <div className="activity-title">{submission.title}</div>
                        <div className="activity-date">{new Date(submission.timestamp * 1000).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-card recommendations-card">
                <h2 className="section-title">Recommended Focus</h2>
                <div className="recommendations">
                  {problemStats.easy / leetcodeData.totalEasy < 0.2 && (
                    <div className="recommendation-item">
                      <div className="recommendation-icon easy">E</div>
                      <div className="recommendation-text">
                        <div className="recommendation-title">Focus on Easy Problems</div>
                        <div className="recommendation-description">
                          You've solved {Math.round((problemStats.easy / leetcodeData.totalEasy) * 100)}% of easy problems. Try to reach at least 20%.
                        </div>
                      </div>
                    </div>
                  )}

                  {problemStats.medium / leetcodeData.totalMedium < 0.15 && (
                    <div className="recommendation-item">
                      <div className="recommendation-icon medium">M</div>
                      <div className="recommendation-text">
                        <div className="recommendation-title">Tackle More Medium Problems</div>
                        <div className="recommendation-description">
                          You've solved {Math.round((problemStats.medium / leetcodeData.totalMedium) * 100)}% of medium problems. Aim for at least 15%.
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStreak < 3 && (
                    <div className="recommendation-item">
                      <div className="recommendation-icon streak">S</div>
                      <div className="recommendation-text">
                        <div className="recommendation-title">Build Your Streak</div>
                        <div className="recommendation-description">
                          Your current streak is {currentStreak} days. Try to solve at least one problem daily.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* If none of the above issues, show this */}
                  {(problemStats.easy / leetcodeData.totalEasy >= 0.2 &&
                    problemStats.medium / leetcodeData.totalMedium >= 0.15 &&
                    currentStreak >= 3) && (
                      <div className="recommendation-item">
                        <div className="recommendation-icon hard">H</div>
                        <div className="recommendation-text">
                          <div className="recommendation-title">Challenge Yourself</div>
                          <div className="recommendation-description">
                            You're doing great! Try tackling more hard problems to further improve your skills.
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </>
      </div>

  );
}

export default LeetCodeDashboard;