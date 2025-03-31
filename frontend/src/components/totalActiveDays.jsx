import React, { useEffect } from 'react'

function totalActiveDays({name}) {
    useEffect(()=>{
        const fetchActiveDays = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/user/active-days", {
                    method: 'GET',
                    credentials: 'include', // Include cookies if available
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                        "Content-Type": "application/json"
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Active Days:", data);
                } else {
                    console.error("Failed to fetch active days");
                }
            } catch (error) {
                console.error("Error fetching active days:", error);
            }
        };
        fetchActiveDays();
    },[])
  return (
    <div>totalActiveDays</div>
  )
}

export default totalActiveDays