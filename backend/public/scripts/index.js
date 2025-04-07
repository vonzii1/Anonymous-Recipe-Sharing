
        const apiKey = 'd9e9ad16df8d4e959c8d5b35432f4592';

        document.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.warn("❌ No token found. Redirecting to login page...");
            window.location.href = 'login.html';
        } else {
            console.log("✅ Token found. User is logged in.");
            fetchUserInfo(token);
            fetchRandomRecipes();
            fetchSavedRecipes();
        }
    });

    function fetchRandomRecipes() {
    fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=5`)
        .then(response => response.json())
        .then(data => {
            console.log("🍝 Random Recipes API Response:", data);
            const postsContainer = document.getElementById('posts-container');

            if (!data.recipes || data.recipes.length === 0) {
                postsContainer.innerHTML = "<p>No recipes found from Spoonacular.</p>";
                return;
            }

            data.recipes.forEach(recipe => {
                const title = recipe.title || "Untitled Recipe";
                const image = recipe.image || "images/fallback.jpg";
                const instructions = recipe.instructions || "No instructions provided.";

                const postElement = document.createElement('div');
                postElement.className = 'card mb-4';
                postElement.innerHTML = `
                    <div class="card-header d-flex align-items-center">
                        <span class="author-initials me-2">AI</span>
                        <strong class="me-2">Posted by API</strong>
                    </div>
                    <div class="card-body">
                        <img src="${image}" class="card-img-top mb-3" alt="${title}">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${instructions}</p>
                        <div class="post-actions d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <button class="btn btn-outline-primary"><i class="fas fa-thumbs-up"></i></button>
                                <button class="btn btn-outline-secondary"><i class="fas fa-thumbs-down"></i></button>
                                <button class="btn btn-outline-dark"><i class="fas fa-comment"></i></button>
                            </div>
                            <div>
                                <button class="btn btn-outline-danger"><i class="fas fa-heart"></i> Favorite</button>
                                <button class="btn btn-outline-warning"><i class="fas fa-flag"></i> Report</button>
                            </div>
                        </div>
                    </div>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('❌ Error fetching Spoonacular recipes:', error);
            const postsContainer = document.getElementById('posts-container');
            postsContainer.innerHTML = `<p style="color:red;">Failed to load recipes. Check API key or network.</p>`;
        });
}


        function searchRecipes() {
            const query = document.getElementById('search-query').value;
            fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`)
                .then(response => response.json())
                .then(data => {
                    const postsContainer = document.getElementById('posts-container');
                    postsContainer.innerHTML = ''; // Clear previous results
                    data.results.forEach(recipe => {
                        const postElement = document.createElement('div');
                        postElement.className = 'card mb-3';
                        postElement.innerHTML = `
                            <div class="card-body">
                                <h5 class="card-title">${recipe.title}</h5>
                                <img src="${recipe.image}" alt="${recipe.title}" class="card-img-top">
                                <button onclick="viewRecipe(${recipe.id})">View Recipe</button>
                                <button onclick="saveRecipe('${recipe.title}', '${recipe.image}', '${recipe.instructions}')">Save Recipe</button>
                            </div>
                        `;
                        postsContainer.appendChild(postElement);
                    });
                })
                .catch(error => console.error('Error searching recipes:', error));
        }
        

        function viewRecipe(recipeId) {
            fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    alert(`Title: ${data.title}\nIngredients: ${data.extendedIngredients.map(ing => ing.original).join(', ')}\nInstructions: ${data.instructions}`);
                })
                .catch(error => console.error('Error fetching recipe details:', error));
        }

        function saveRecipe(title, image, instructions) {
            fetch('http://localhost:5000/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    ingredients: [], // Add ingredients if available
                    instructions,
                    author_id: 'api' // Indicate that this is an API-sourced recipe
                })
            })
            .then(response => response.json())
            .then(data => {
                alert('Recipe saved successfully!');
                location.reload();
            })
            .catch(error => console.error('Error saving recipe:', error));
        }

        function fetchUserInfo(token) {
    fetch('http://localhost:5000/api/user-info', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            console.log("👤 Logged in as:", data.user.name);

            const initials = data.user.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

            const profileIcon = document.querySelector('.profile-icon');
            if (profileIcon) {
                profileIcon.innerText = initials;
            }
        }
    })
    .catch(err => {
        console.error('❌ Error fetching user info:', err);
    });
}

function fetchSavedRecipes() {
    fetch('http://localhost:5000/api/recipes')
        .then(response => response.json())
        .then(data => {
            const postsContainer = document.getElementById('posts-container');
            data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'card mb-4';
                postElement.innerHTML = `
                    <div class="card-header d-flex align-items-center">
                        <span class="author-initials me-2">${post.author_id.slice(0, 2).toUpperCase()}</span>
                        <strong class="me-2">Posted by ${post.author_id}</strong>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text"><strong>Ingredients:</strong> ${post.ingredients.join(', ')}</p>
                        <p class="card-text"><strong>Instructions:</strong> ${post.instructions}</p>
                        <div class="post-actions d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <button class="btn btn-outline-primary" onclick="likeRecipe('${post.recipe_id}')"><i class="fas fa-thumbs-up"></i></button>
                                <button class="btn btn-outline-secondary" onclick="dislikeRecipe('${post.recipe_id}')"><i class="fas fa-thumbs-down"></i></button>
                                <button class="btn btn-outline-dark" onclick="commentRecipe('${post.recipe_id}')"><i class="fas fa-comment"></i></button>
                            </div>
                            <div>
                                <button class="btn btn-outline-danger" onclick="favoriteRecipe('${post.recipe_id}')"><i class="fas fa-heart"></i> Favorite</button>
                                <button class="btn btn-outline-warning" onclick="reportRecipe('${post.recipe_id}')"><i class="fas fa-flag"></i> Report</button>
                                <button class="btn btn-outline-info" onclick="editRecipe('${post.recipe_id}')">Edit</button>
                                <button class="btn btn-outline-danger" onclick="deleteRecipe('${post.recipe_id}')">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error fetching saved recipes:', error));
}


        function deleteRecipe(recipeId) {
            fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                location.reload();
            })
            .catch(error => console.error('Error deleting recipe:', error));
        }

        function editRecipe(recipeId) {
            const newTitle = prompt("Enter new title:");
            const newIngredients = prompt("Enter new ingredients (comma separated):");
            const newInstructions = prompt("Enter new instructions:");

            if (newTitle && newIngredients && newInstructions) {
                fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: newTitle,
                        ingredients: newIngredients.split(','),
                        instructions: newInstructions
                    })
                })
                .then(response => response.json())
                .then(data => {
                    alert('Recipe updated successfully!');
                    location.reload();
                })
                .catch(error => console.error('Error updating recipe:', error));
            } else {
                alert('All fields are required!');
            }
        }

        function likeRecipe(recipeId) {
            fetch(`http://localhost:5000/api/recipes/${recipeId}/like`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                alert('Recipe liked successfully!');
                location.reload();
            })
            .catch(error => console.error('Error liking recipe:', error));
        }

        function dislikeRecipe(recipeId) {
            fetch(`http://localhost:5000/api/recipes/${recipeId}/dislike`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                alert('Recipe disliked successfully!');
                location.reload();
            })
            .catch(error => console.error('Error disliking recipe:', error));
        }

        function commentRecipe(recipeId) {
            const comment = prompt("Enter your comment:");
            if (comment) {
                fetch(`http://localhost:5000/api/recipes/${recipeId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ comment })
                })
                .then(response => response.json())
                .then(data => {
                    alert('Comment added successfully!');
                    location.reload();
                })
                .catch(error => console.error('Error adding comment:', error));
            } else {
                alert('Comment cannot be empty!');
            }
        }

        function favoriteRecipe(recipeId) {
            fetch(`http://localhost:5000/api/recipes/${recipeId}/favorite`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                alert('Recipe added to favorites successfully!');
                location.reload();
            })
            .catch(error => console.error('Error adding to favorites:', error));
        }

        function reportRecipe(recipeId) {
            fetch(`http://localhost:5000/api/recipes/${recipeId}/report`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                alert('Recipe reported successfully!');
                location.reload();
            })
            .catch(error => console.error('Error reporting recipe:', error));
        }

        if (!token) {
    window.location.href = 'login.html';
} else {
    fetchUserInfo(token);
}

