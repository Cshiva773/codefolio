import React, { useEffect, useState } from 'react';
import SideNavbar from './SideNavbar';
import Header from './Header';
import { GitBranch, Star, AlertCircle, Book, Users, Code, GitCommit, GitPullRequest, Github, Lock, Unlock } from 'lucide-react';

function GithubDashboard() {
  const [userData, setUserData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState({});
  const [timeFrame, setTimeFrame] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    stars: 0,
    forked: 0,
    public: 0,
    private: 0
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Authentication token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
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

        // Check for GitHub username
        if (data && data.user) {
          setUserData(data.user);
          
          // Check if GitHub username exists in user data
          const githubUsername = data.user.github || 
            (data.user.socialLinks && data.user.socialLinks.github);
            
          if (githubUsername) {
            // Fetch GitHub profile data
            fetchGithubData(githubUsername);
          } else {
            setError("No GitHub username found in profile");
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

    const fetchGithubData = async (username) => {
      try {
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        
        if (!userResponse.ok) {
          throw new Error("Failed to fetch GitHub user data");
        }
        
        const userData = await userResponse.json();
        setGithubData(userData);
        
        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        
        if (!reposResponse.ok) {
          throw new Error("Failed to fetch GitHub repositories");
        }
        
        const reposData = await reposResponse.json();
        
        // Calculate stars, forks, public/private counts
        const starCount = reposData.reduce((total, repo) => total + repo.stargazers_count, 0);
        const forkedCount = reposData.filter(repo => repo.fork).length;
        const publicCount = reposData.filter(repo => !repo.private).length;
        const privateCount = reposData.filter(repo => repo.private).length;
        
        setStats({
          stars: starCount,
          forked: forkedCount,
          public: publicCount,
          private: privateCount
        });
        
        // Extract languages
        const languageMap = {};
        
        reposData.forEach(repo => {
          if (repo.language) {
            if (languageMap[repo.language]) {
              languageMap[repo.language]++;
            } else {
              languageMap[repo.language] = 1;
            }
          }
        });
        
        // Sort languages by frequency
        const sortedLanguages = Object.entries(languageMap)
          .sort((a, b) => b[1] - a[1])
          .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
          }, {});
        
        setLanguages(sortedLanguages);
        
        // Set recent repositories 
        setRepos(reposData.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        setError("Failed to fetch GitHub data");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Generate colors for language chart
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      C: '#555555',
      'C++': '#f34b7d',
      'C#': '#178600',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Rust: '#dea584',
      Dart: '#00B4AB',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Shell: '#89e051'
    };
    
    return colors[language] || '#6e6e6e';
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <SideNavbar user={userData} />
        <div className="leetcode-dashboard loading">
          <div className="loading-spinner"></div>
          <p>Loading GitHub data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <SideNavbar user={userData} />
        <div className="leetcode-dashboard error">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Mock data for the activity heatmap
  const generateMockHeatmapData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map(month => {
      // Generate 4 weeks (28 days) of activity data for each month
      const days = Array(28).fill().map(() => {
        const intensity = Math.floor(Math.random() * 5); // 0-4 intensity
        return { active: intensity > 0, intensity: intensity };
      });
      
      return { month, days };
    });
  };

  const heatmapData = generateMockHeatmapData();
  
  // Calculate total repos for percentages
  const totalLanguageRepos = Object.values(languages).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <Header />
      <div className="dashboard-layout">
        <SideNavbar user={userData} />
        <div className="leetcode-dashboard">
          {githubData && (
            <>
              <div className="dashboard-header">
                <div className="username-section">
                  <h1>{githubData.name || githubData.login}</h1>
                  <div className="ranking">@{githubData.login} • {githubData.bio}</div>
                </div>
                
                {/* <div className="time-frame-selector">
                  <span 
                    className={timeFrame === 'week' ? 'active' : ''} 
                    onClick={() => setTimeFrame('week')}
                  >
                    Week
                  </span>
                  <span 
                    className={timeFrame === 'month' ? 'active' : ''} 
                    onClick={() => setTimeFrame('month')}
                  >
                    Month
                  </span>
                  <span 
                    className={timeFrame === 'year' ? 'active' : ''} 
                    onClick={() => setTimeFrame('year')}
                  >
                    Year
                  </span>
                  <span 
                    className={timeFrame === 'all' ? 'active' : ''} 
                    onClick={() => setTimeFrame('all')}
                  >
                    All Time
                  </span>
                </div> */}
              </div>
              
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-title">Repositories</div>
                  <div className="stat-value">{githubData.public_repos}</div>
                  <div className="stat-subtitle">Public Projects</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-title">Followers</div>
                  <div className="stat-value">{githubData.followers}</div>
                  <div className="stat-subtitle">People following you</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-title">Following</div>
                  <div className="stat-value">{githubData.following}</div>
                  <div className="stat-subtitle">People you follow</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-title">Joined</div>
                  <div className="stat-value">{new Date(githubData.created_at).getFullYear()}</div>
                  <div className="stat-subtitle">Member since {new Date(githubData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                </div>
              </div>
              <div className="section-card">
                <h2 className="section-title">Languages</h2>
                <div style={{ marginBottom: '24px' }}>
                  {Object.keys(languages).length > 0 ? (
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        height: '24px', 
                        width: '100%', 
                        borderRadius: '8px', 
                        overflow: 'hidden' 
                      }}>
                        {Object.entries(languages).map(([language, count], index) => {
                          const percentage = (count / totalLanguageRepos) * 100;
                          // Only show languages that make up at least 3% of the total
                          if (percentage < 3) return null;
                          
                          return (
                            <div 
                              key={language}
                              style={{ 
                                width: `${percentage}%`, 
                                backgroundColor: getLanguageColor(language),
                                height: '100%'
                              }}
                              title={`${language}: ${count} repositories (${percentage.toFixed(1)}%)`}
                            />
                          );
                        })}
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '16px', 
                        marginTop: '16px',
                        justifyContent: 'center'
                      }}>
                        {Object.entries(languages)
                          .filter(([_, count]) => (count / totalLanguageRepos) * 100 >= 1)
                          .map(([language, count]) => {
                            const percentage = (count / totalLanguageRepos) * 100;
                            
                            return (
                              <div key={language} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                fontSize: '14px'
                              }}>
                                <div style={{ 
                                  width: '12px', 
                                  height: '12px', 
                                  borderRadius: '50%', 
                                  backgroundColor: getLanguageColor(language) 
                                }} />
                                <span>{language} ({percentage.toFixed(1)}%)</span>
                              </div>
                            );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p style={{ textAlign: 'center', color: '#666' }}>No language data available</p>
                  )}
                </div>
                
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Most Used Languages</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(languages)
                    .slice(0, 5)
                    .map(([language, count]) => {
                      const percentage = (count / totalLanguageRepos) * 100;
                      
                      return (
                        <div key={language} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '80px', fontSize: '14px' }}>{language}</div>
                          <div style={{ 
                            flex: '1', 
                            height: '8px', 
                            backgroundColor: '#f3f4f6', 
                            borderRadius: '4px', 
                            overflow: 'hidden' 
                          }}>
                            <div style={{ 
                              height: '100%', 
                              width: `${percentage}%`, 
                              backgroundColor: getLanguageColor(language), 
                              borderRadius: '4px' 
                            }} />
                          </div>
                          <div style={{ width: '50px', fontSize: '14px', textAlign: 'right' }}>
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              
              <div className="section-card">
                <h2 className="section-title">Contribution Activity</h2>
                <div className="activity-heatmap">
                  {heatmapData.map((monthData, index) => (
                    <div className="month-column" key={index}>
                      <div className="month-label">{monthData.month}</div>
                      <div className="days-grid">
                        {monthData.days.map((day, dayIndex) => (
                          <div 
                            key={dayIndex} 
                            className={`day-cell ${day.active ? 'active intensity-' + day.intensity : ''}`}
                            title={`${day.active ? day.intensity : 0} contributions on ${monthData.month} ${dayIndex + 1}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="heatmap-legend">
                  <div className="legend-item">
                    <span className="legend-square intensity-0"></span>
                    <span>0 contributions</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-square intensity-1"></span>
                    <span>1-3 contributions</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-square intensity-2"></span>
                    <span>4-6 contributions</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-square intensity-3"></span>
                    <span>7-9 contributions</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-square intensity-4"></span>
                    <span>10+ contributions</span>
                  </div>
                </div>
              </div>

              <div className="section-card contest-history-card">
                <h2 className="section-title">GitHub Stats</h2>
                <div className="contest-stats">
                  <div className="contest-stat-item">
                    <div className="stat-label">Stars</div>
                    <div className="stat-value">
                      <div className="flex items-center justify-center">
                        <Star size={16} className="mr-1" /> {stats.stars}
                      </div>
                    </div>
                  </div>
                  <div className="contest-stat-item">
                    <div className="stat-label">Forked</div>
                    <div className="stat-value">
                      <div className="flex items-center justify-center">
                        <GitBranch size={16} className="mr-1" /> {stats.forked}
                      </div>
                    </div>
                  </div>
                  <div className="contest-stat-item">
                    <div className="stat-label">Public</div>
                    <div className="stat-value">
                      <div className="flex items-center justify-center">
                        <Unlock size={16} className="mr-1" /> {stats.public}
                      </div>
                    </div>
                  </div>
                  
                  <div className="contest-stat-item">
                    <div className="stat-label">GitHub URL</div>
                    <div className="stat-value">
                      <a 
                        href={githubData.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '14px', color: '#4f46e5' }}
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-body">
                <div className="dashboard-column">
                  <div className="section-card">
                    <h2 className="section-title">Repository Breakdown</h2>
                    <div className="problems-chart">
                      <div className="donut-chart">
                        <div className="donut-slice easy" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)' }}></div>
                        <div className="donut-slice medium" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0, 50% 50%)' }}></div>
                        <div className="donut-slice hard" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 100%, 50% 50%)' }}></div>
                        <div className="donut-center">{githubData.public_repos}</div>
                      </div>
                      <div className="problem-stats">
                        <div className="problem-type easy">
                          <div className="problem-label">Public</div>
                          <div className="problem-progress">
                            <div className="progress-bar" style={{ width: '70%' }}></div>
                          </div>
                          <div className="problem-count">{Math.floor(githubData.public_repos * 0.7)}</div>
                        </div>
                        <div className="problem-type medium">
                          <div className="problem-label">Forked</div>
                          <div className="problem-progress">
                            <div className="progress-bar" style={{ width: '20%' }}></div>
                          </div>
                          <div className="problem-count">{Math.floor(githubData.public_repos * 0.2)}</div>
                        </div>
                        <div className="problem-type hard">
                          <div className="problem-label">Private</div>
                          <div className="problem-progress">
                            <div className="progress-bar" style={{ width: '10%' }}></div>
                          </div>
                          <div className="problem-count">{Math.floor(githubData.public_repos * 0.1)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="section-card">
                    <h2 className="section-title">Contribution Summary</h2>
                    <div className="contribution-section">
                      <div className="contribution-item">
                        <div className="contribution-label">Commits</div>
                        <div className="contribution-value">248</div>
                      </div>
                      <div className="contribution-item">
                        <div className="contribution-label">Pull Requests</div>
                        <div className="contribution-value">32</div>
                      </div>
                      <div className="contribution-item">
                        <div className="contribution-label">Issues</div>
                        <div className="contribution-value">17</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="section-card">
                    <h2 className="section-title">Recent Activity</h2>
                    <div className="recent-activity">
                      <div className="activity-item">
                        <div className="activity-status accepted">Commit</div>
                        <div className="activity-details">
                          <div className="activity-title">Update README.md in project-dashboard</div>
                          <div className="activity-date">2 days ago</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-status time-limit-exceeded">PR Opened</div>
                        <div className="activity-details">
                          <div className="activity-title">Add new feature to user authentication</div>
                          <div className="activity-date">4 days ago</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-status wrong-answer">Issue</div>
                        <div className="activity-details">
                          <div className="activity-title">Bug in login functionality</div>
                          <div className="activity-date">1 week ago</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-status accepted">Commit</div>
                        <div className="activity-details">
                          <div className="activity-title">Fixed styling issues in mobile view</div>
                          <div className="activity-date">1 week ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="dashboard-column">
                  <div className="section-card">
                    <h2 className="section-title">Recent Repositories</h2>
                    <div className="recent-activity">
                      {repos.map(repo => (
                        <div className="activity-item" key={repo.id}>
                          <div className={`activity-status ${repo.language ? 'accepted' : 'runtime-error'}`}>
                            {repo.language || 'No Lang'}
                          </div>
                          <div className="activity-details">
                            <div className="activity-title">
                              <a 
                                href={repo.html_url}
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ color: 'inherit', textDecoration: 'none' }}
                              >
                                {repo.name}
                              </a>
                            </div>
                            <div className="activity-date">
                              ⭐ {repo.stargazers_count} • 🍴 {repo.forks_count} • Updated {new Date(repo.updated_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="section-card recommendations-card">
                    <h2 className="section-title">Recommendations</h2>
                    <div className="recommendations">
                      <div className="recommendation-item easy">
                        <div className="recommendation-icon easy">
                          <Star size={18} />
                        </div>
                        <div className="recommendation-text">
                          <div className="recommendation-title">Star more repositories</div>
                          <div className="recommendation-description">
                            Star repositories you find interesting to build your network and discover new projects.
                          </div>
                        </div>
                      </div>
                      
                      <div className="recommendation-item medium">
                        <div className="recommendation-icon medium">
                          <GitPullRequest size={18} />
                        </div>
                        <div className="recommendation-text">
                          <div className="recommendation-title">Open more pull requests</div>
                          <div className="recommendation-description">
                            Contributing to open source projects will help you improve your skills and build your portfolio.
                          </div>
                        </div>
                      </div>
                      
                      <div className="recommendation-item hard">
                        <div className="recommendation-icon hard">
                          <GitCommit size={18} />
                        </div>
                        <div className="recommendation-text">
                          <div className="recommendation-title">Commit more consistently</div>
                          <div className="recommendation-description">
                            Try to make at least one commit per day to improve your GitHub activity graph.
                          </div>
                        </div>
                      </div>
                      
                      <div className="recommendation-item streak">
                        <div className="recommendation-icon streak">
                          <Github size={18} />
                        </div>
                        <div className="recommendation-text">
                          <div className="recommendation-title">Complete your profile</div>
                          <div className="recommendation-description">
                            Add a bio, location, and website to make your GitHub profile more professional.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              
              
              
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default GithubDashboard;