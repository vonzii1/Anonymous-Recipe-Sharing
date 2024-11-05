document.addEventListener('DOMContentLoaded', () => {
    // Like button functionality
    document.querySelectorAll('.like-btn').forEach(likeBtn => {
        likeBtn.addEventListener('click', () => {
            const likeCount = likeBtn.querySelector('.like-count');
            let count = parseInt(likeCount.innerText.replace('k', ''));
            likeCount.innerText = `${++count}k`;
        });
    });

    // Dislike button functionality
    document.querySelectorAll('.dislike-btn').forEach(dislikeBtn => {
        dislikeBtn.addEventListener('click', () => {
            const dislikeCount = dislikeBtn.querySelector('.dislike-count');
            let count = parseInt(dislikeCount.innerText.replace('k', ''));
            dislikeCount.innerText = `${++count}k`;
        });
    });

    // See more functionality
    document.querySelectorAll('.see-more').forEach(seeMoreLink => {
        seeMoreLink.addEventListener('click', (e) => {
            e.preventDefault();
            const postMore = seeMoreLink.previousElementSibling;
            postMore.style.display = 'inline';
            seeMoreLink.style.display = 'none';
        });
    });

    // Image viewing modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeModal = document.querySelector('.close');

    document.querySelectorAll('.view-image').forEach(image => {
        image.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = image.src;
            captionText.innerHTML = image.alt;
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Report functionality
    document.querySelectorAll('.report-btn').forEach(reportBtn => {
        reportBtn.addEventListener('click', () => {
            const confirmReport = confirm("Are you sure you want to report this post?");
            if (confirmReport) {
                alert('Thank you for reporting this post.');
            }
        });
    });

    // Favorite functionality
    document.querySelectorAll('.favorite-btn').forEach(favoriteBtn => {
        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('favorited');
            if (favoriteBtn.classList.contains('favorited')) {
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Favorited';
            } else {
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Add to Favorite';
            }
        });
    });

    const recipes = [
        "Vegan Tacos",
        "All-Meat Burger",
        "Korean Kimchi",
        "Adobo Chicken",
        "Banana Pancakes",
        "Vegan Smoothie",
        "Spicy Ramen",
        "Garlic Butter Shrimp",
        "Baked Salmon",
        "Pinakbet"
    ];

    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Function to display search results
    function displayResults(matches) {
        searchResults.innerHTML = ''; // Clear previous results

        if (matches.length === 0) {
            searchResults.innerHTML = '<li class="no-result">No matching recipes found</li>';
            return;
        }

        matches.forEach(recipe => {
            const li = document.createElement('li');
            li.textContent = recipe;
            li.classList.add('recipe-item');
            searchResults.appendChild(li);
        });
    }

    // Event listener for input change
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const matches = recipes.filter(recipe => recipe.toLowerCase().includes(query));
        displayResults(matches);
    });
    function openChat(user) {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = `
            <div class="message left"><strong>${user}:</strong> Hello! How are you?</div>
            <div class="message right"><strong>You:</strong> I'm good! How about you?</div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    document.getElementById('send-message-btn').addEventListener('click', function () {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();

        if (message === "") return;

        const chatMessages = document.getElementById('chat-messages');
        const newMessage = document.createElement('div');
        newMessage.classList.add('message', 'right');
        newMessage.innerHTML = `<strong>You:</strong> ${message}`;
        chatMessages.appendChild(newMessage);

        messageInput.value = ''; // Clear input field
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the bottom
    });

    window.onload = function () {
        const currentPage = window.location.pathname.split("/").pop(); // Get the current filename
    
        // Map page names to their respective buttons
        const pageToButtonMap = {
            'index.html': 'home-btn',
            'inbox.html': 'inbox-btn',
            'chat.html': 'chat-btn'
        };
    
        // Get the button ID for the current page
        const activeButtonId = pageToButtonMap[currentPage];
    
        // Apply the 'active' class to the corresponding button
        if (activeButtonId) {
            document.getElementById(activeButtonId).classList.add('active');
        }
    };

    window.onload = function () {
        const currentPage = window.location.pathname.split("/").pop(); // Get the current filename
    
        // Map page names to their respective buttons
        const pageToButtonMap = {
            'index.html': 'home-btn',
            'inbox.html': 'inbox-btn',
            'chat.html': 'chat-btn'
        };
    
        // Get the button ID for the current page
        const activeButtonId = pageToButtonMap[currentPage];
    
        // Apply the 'active' class to the corresponding button
        if (activeButtonId) {
            document.getElementById(activeButtonId).classList.add('active');
        }
    };

    const conversations = {
        AllMeat: `<p><strong>AllMeat Chat:</strong> Welcome to the AllMeat community! Here we share our favorite meat recipes!</p>`,
        Vegan: `<p><strong>Vegan Chat:</strong> Welcome to the Vegan community! Share your plant-based recipes here.</p>`,
        Weekend: `<p><strong>Weekend Chat:</strong> Welcome to the Weekend community! Plan your weekend meals here.</p>`,
        Korean: `<p><strong>Korean Chat:</strong> Share your favorite Korean recipes and tips in this community!</p>`
    };
    
    // Function to update the conversation based on the hovered community
    function showConversation(communityName) {
        const title = document.getElementById('community-title');
        const conversation = document.getElementById('community-conversation');
    
        title.textContent = communityName + ' Community Chat';
        conversation.innerHTML = conversations[communityName] || '<p>No conversation available.</p>';
    }

    let currentSlideIndexes = [0, 0, 0]; // Adjust this array for the number of posts (1st is for post 1, 2nd for post 2, etc.)
    let startX = 0; // Starting X position for touch gestures
    
    function moveSlide(n, postIndex) {
        let carousels = document.querySelectorAll('.carousel');
        let slides = carousels[postIndex].querySelectorAll('.carousel-image');
        
        currentSlideIndexes[postIndex] += n;
    
        // Wrap around the slides
        if (currentSlideIndexes[postIndex] >= slides.length) {
            currentSlideIndexes[postIndex] = 0;
        }
        if (currentSlideIndexes[postIndex] < 0) {
            currentSlideIndexes[postIndex] = slides.length - 1;
        }
    
        // Calculate the new position for the carousel
        carousels[postIndex].style.transform = `translateX(-${currentSlideIndexes[postIndex] * 100}%)`;
    }
    
    // Function to handle swipe gestures
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
    }
    
    function handleTouchEnd(e, postIndex) {
        let endX = e.changedTouches[0].clientX;
        let deltaX = endX - startX;
    
        if (deltaX > 50) {
            moveSlide(-1, postIndex); // Swipe right
        } else if (deltaX < -50) {
            moveSlide(1, postIndex); // Swipe left
        }
    }
    
    // Attach touch event listeners for each carousel
    document.querySelectorAll('.carousel-container').forEach((carousel, index) => {
        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchend', (e) => handleTouchEnd(e, index), { passive: true });
    });
    
    // Function to open a community chat on hover
function openCommunityChat(communityName) {
    const chatTitle = document.getElementById('community-chat-title');
    const chatMessages = document.getElementById('chat-messages');

    // Update chat title and clear previous messages
    chatTitle.textContent = `Community Chat - ${communityName}`;
    chatMessages.innerHTML = `
        <div class="message">
            <strong>Welcome to ${communityName} Chat!</strong>
            <div class="reactions">
                <span class="reaction"><i class="fas fa-thumbs-up reaction-icon" data-reaction="like"></i> <span class="reaction-count">0</span></span>
                <span class="reaction"><i class="fas fa-thumbs-down reaction-icon" data-reaction="dislike"></i> <span class="reaction-count">0</span></span>
                <span class="reaction"><i class="fas fa-surprise reaction-icon" data-reaction="wow"></i> <span class="reaction-count">0</span></span>
                <span class="reaction"><i class="fas fa-heart reaction-icon" data-reaction="heart"></i> <span class="reaction-count">0</span></span>
            </div>
        </div>`;

    // Attach reactions to messages
    attachReactions(chatMessages);
}

// Function to attach reactions to messages
function attachReactions(chatMessages) {
    chatMessages.querySelectorAll('.reaction-icon').forEach(icon => {
        icon.addEventListener('click', function () {
            const reactionType = this.getAttribute('data-reaction');
            const reactionCount = this.nextElementSibling;
            const currentCount = parseInt(reactionCount.textContent);
            reactionCount.textContent = currentCount + 1;
        });
    });
}

});

