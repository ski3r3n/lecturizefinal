"use client"
import React, { useEffect, useState } from 'react';

const UserData = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/userInfo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include credentials if your API requires authentication
                        'Credentials': 'include'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                setError(error.message);
                console.error("Fetching data failed:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {userData ? (
                <div>
                    <h1>User Data</h1>
                    <pre>{JSON.stringify(userData, null, 2)}</pre>
                </div>
            ) : (
                <p>No user data found or error fetching data: {error}</p>
            )}
        </div>
    );
};

export default UserData;
