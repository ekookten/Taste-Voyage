import React, { useEffect, useState } from 'react';

const SecretRecipes = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsersAndRecipes = async () => {
            try {
                const response = await fetch('/api/users'); // Adjust the API endpoint as needed
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users and recipes:', error);
            }
        };

        fetchUsersAndRecipes();
    }, []);

    return (
        <div>
            <h1>Secret Recipes</h1>
            {users.map(user => (
                <div key={user.id}>
                    <h2>{user.name}</h2>
                    <ul>
                        {user.secretRecipes.map(recipe => (
                            <li key={recipe.id}>{recipe.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default SecretRecipes;