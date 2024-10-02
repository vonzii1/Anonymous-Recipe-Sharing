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
});
