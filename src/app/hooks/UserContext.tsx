import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface UserContextType {
    user: any; // Specify a more specific type if possible
    setUser: Dispatch<SetStateAction<any>>;
    signOut: () => void;
}
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userIsLoading, setUserIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching user data from API on initial load
        fetch('/api/userInfo')  // Adjust API endpoint as needed
            .then(response => response.json())
            .then(data => {
                setUser(data);
                setUserIsLoading(false);
            });
    }, []);

    const logout = () => {
        setUser(null);  // Reset user on logout
        // Implement actual logout logic with API
    };

    const value = { user, setUser, userIsLoading, signOut: logout };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
