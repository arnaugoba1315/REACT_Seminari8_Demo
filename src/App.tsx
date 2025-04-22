import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { User } from './types';
import Form from './components/Form';
import UsersList from './components/UsersList';
import EditUserForm from './components/EditUserForm';
import { fetchUsers, LogIn } from './services/usersService';
import Login from './components/Login';

interface AppState {
    currentUser: User | null;
    users: User[];
    newUsersNumber: number;
    isLoggedIn: boolean;
}

interface UIState {
    isDarkMode: boolean;
    showNotification: boolean;
    notificationMessage: string;
    isEditing: boolean;
    selectedUser: User | null;
}

function App() {
    const [users, setUsers] = useState<AppState['users']>([]);
    const [newUsersNumber, setNewUsersNumber] = useState<AppState['newUsersNumber']>(0);
    const [isLoggedIn, setIsLoggedIn] = useState<AppState['isLoggedIn']>(false);
    const [currentUser, setCurrentUser] = useState<AppState['currentUser']>(null);

    const [uiState, setUiState] = useState<UIState>({
        isDarkMode: false,
        showNotification: false,
        notificationMessage: '',
        isEditing: false,
        selectedUser: null,
    });

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await fetchUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error loading users:', error);
                setUsers([]);
            }
        };
        if (isLoggedIn) {
            loadUsers();
        }
    }, [newUsersNumber, isLoggedIn]);

    useEffect(() => {
        if (uiState.showNotification) {
            const timer = setTimeout(() => {
                setUiState((prev) => ({
                    ...prev,
                    showNotification: false,
                }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [uiState.showNotification]);

    const handleNewUser = (newUser: User): void => {
        setNewUsersNumber((n) => n + 1);
        setUiState((prev) => ({
            ...prev,
            notificationMessage: `User ${newUser.name} has been created successfully!`,
            showNotification: true,
        }));
    };

    const handleSelectUser = (user: User) => {
        setUiState(prev => ({
            ...prev,
            isEditing: true,
            selectedUser: user
        }));
    };

    const handleCancelEdit = () => {
        setUiState(prev => ({
            ...prev,
            isEditing: false,
            selectedUser: null
        }));
    };

    const handleUserUpdated = (updatedUser: User) => {
        // Actualizar la lista de usuarios
        setUsers(prevUsers => 
            prevUsers.map(user => 
                user._id === updatedUser._id ? { ...updatedUser } : user
            )
        );
        
        setUiState(prev => ({
            ...prev,
            isEditing: false,
            selectedUser: null,
            showNotification: true,
            notificationMessage: `User ${updatedUser.name} has been updated successfully!`
        }));
    };

    const toggleDarkMode = () => {
        setUiState((prev) => {
            const newMode = !prev.isDarkMode;

            if (divRef.current) {
                divRef.current.style.backgroundColor = newMode ? '#333333' : '#ffffff';
                divRef.current.style.color = newMode ? '#ffffff' : '#000000';
            }

            return { ...prev, isDarkMode: newMode };
        });
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const user = await LogIn(email, password);
            console.log('User logged in:', user);
            setCurrentUser(user);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    const renderContent = () => {
        if (!isLoggedIn) {
            return (
                <Login
                    onLogin={({ email, password }) => handleLogin(email, password)}
                />
            );
        }

        if (uiState.isEditing && uiState.selectedUser) {
            return (
                <EditUserForm 
                    user={uiState.selectedUser}
                    onUserUpdated={handleUserUpdated}
                    onCancel={handleCancelEdit}
                />
            );
        }

        return (
            <>
                <UsersList 
                    users={users} 
                    onSelectUser={handleSelectUser} 
                />
                <p>New users: {newUsersNumber}</p>
                <Form onNewUser={handleNewUser} />
            </>
        );
    };

    return (
        <div className="App" ref={divRef}>
            {/* Notification Popup */}
            {uiState.showNotification && (
                <div className={`notification ${uiState.isDarkMode ? 'dark' : 'light'}`}>
                    {uiState.notificationMessage}
                </div>
            )}

            <button onClick={toggleDarkMode} className="toggleButton">
                {uiState.isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className="content">
                {isLoggedIn && <h2>Bienvenido, {currentUser?.name}!</h2>}
                {renderContent()}
            </div>
        </div>
    );
}

export default App;