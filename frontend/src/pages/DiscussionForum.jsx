"use client"

import { useState, useEffect } from "react"
import CreatePost from "../components/discussion/CreatePost"
import PostList from "../components/discussion/PostList"
import FilterBar from "../components/discussion/FilterBar"
import SearchBar from "../components/discussion/SearchBar"
import "./discussion-forum.css"
import SideNavbar from "@/components/SideNavbar"
import Header from "@/components/Header"
import { Hourglass } from "lucide-react"

// Define your API base URL here
const API_BASE_URL = "/api" // Change this to match your backend URL (e.g., 'http://localhost:5000/api')

const DiscussionForum = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [companies, setCompanies] = useState([])
  const [industries, setIndustries] = useState([])
  const [userData, setUserData] = useState(null);
  const [filters, setFilters] = useState({
    sort: "most-recent",
    postType: "all",
    company: "all",
    role: "all",
    domain: "all",
    search: "",
  })

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
          }
    
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setError("Failed to fetch user profile");
        } finally {
          setLoading(false);
        }
      };
    
      fetchUserProfile();
    }, []);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  })

  // Helper function to make API requests
  const apiRequest = async (endpoint, options = {}) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      console.log(`Making API request to: ${url}`)

      const response = await fetch(url, options)

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error (${response.status}):`, errorText)
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (err) {
      console.error("API Request Error:", err)
      return { success: false, error: err.message }
    }
  }

  // Fetch posts based on filters
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          sort: filters.sort,
          page: pagination.currentPage.toString(),
          limit: "10",
        })

        if (filters.postType !== "all") queryParams.append("postType", filters.postType)
        if (filters.company !== "all") queryParams.append("company", filters.company)
        if (filters.role !== "all") queryParams.append("role", filters.role)
        if (filters.domain !== "all") queryParams.append("domain", filters.domain)
        if (filters.search) queryParams.append("search", filters.search)

        const result = await apiRequest(`/posts/filter?${queryParams}`)

        if (!result.success) {
          throw new Error(result.error)
        }

        setPosts(result.data.data || [])
        setPagination({
          currentPage: Number.parseInt(result.data.currentPage) || 1,
          totalPages: Number.parseInt(result.data.totalPages) || 1,
          totalPosts: Number.parseInt(result.data.totalPosts) || 0,
        })
      } catch (err) {
        setError(err.message)
        console.error("Error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [filters, pagination.currentPage])

  // Fetch companies and industries on component mount
  useEffect(() => {
    const fetchCompaniesAndIndustries = async () => {
      try {
        const [companiesResult, industriesResult] = await Promise.all([
          apiRequest("/companies"),
          apiRequest("/industries"),
        ])

        if (!companiesResult.success) {
          console.error("Failed to fetch companies:", companiesResult.error)
        } else {
          setCompanies(companiesResult.data.data || [])
        }

        if (!industriesResult.success) {
          console.error("Failed to fetch industries:", industriesResult.error)
        } else {
          setIndustries(industriesResult.data.data || [])
        }
      } catch (err) {
        console.error("Error fetching initial data:", err)
      }
    }

    fetchCompaniesAndIndustries()
  }, [])

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
    setPagination((prev) => ({ ...prev, currentPage: 1 })) // Reset to first page on filter change
  }

  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }))
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }))
  }

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts])
    setShowCreatePost(false)
  }

  const handlePostInteraction = async (postId, action, data = {}) => {
    try {
      const result = await apiRequest(`/posts/${postId}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      // Update the post in the local state
      setPosts((prevPosts) => prevPosts.map((post) => (post._id === postId ? { ...post, ...data.updateData } : post)))

      return result.data
    } catch (err) {
      console.error(`Error during ${action}:`, err)
      throw err
    }
  }

  return (
    <>
      <Header />
      <div className='flex flex-col h-screen'>
        <SideNavbar user={userData}/>
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <Hourglass size={40} className="text-blue-500 animate-pulse" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-3">
        This Feature is Coming Soon!
      </h1>
      <p className="text-lg text-gray-600 mb-6 max-w-md">
        We're putting the finishing touches on this feature to give you the best experience possible. Hang tight — it's almost here!
      </p>
      
    </div>
      </div>
    </>
  )
}

export default DiscussionForum

