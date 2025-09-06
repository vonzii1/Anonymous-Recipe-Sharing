/**
 * Navbar Component
 * Handles the dynamic loading and functionality of the navbar
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load the navbar HTML
    fetch('/components/navbar.html')
        .then(response => response.text())
        .then(html => {
            // Add the navbar to the placeholder
            document.getElementById('navbar-placeholder').innerHTML = html;
            
            // Initialize navbar functionality
            initializeNavbar();
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
});

/**
 * Initialize navbar functionality
 */
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Mobile menu toggle
    const navbarToggler = navbar.querySelector('.navbar-toggler');
    const navbarNav = navbar.querySelector('.navbar-nav');
    
    if (navbarToggler && navbarNav) {
        navbarToggler.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navbarNav.classList.toggle('show');
            
            // Toggle body scroll lock when mobile menu is open
            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navbarNav && navbarToggler && !navbar.contains(event.target) && !event.target.matches('.navbar-toggler')) {
            navbarNav.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // Handle dropdown toggles
    const dropdownToggles = navbar.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.closest('.dropdown');
            const menu = dropdown?.querySelector('.dropdown-menu');
            
            if (!menu) return;
            
            // Close other open dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) m.classList.remove('show');
            });
            
            // Toggle current dropdown
            menu.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.dropdown-toggle')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
    
    // Search toggle functionality
    const searchToggle = navbar.querySelector('.search-toggle');
    const mobileSearch = document.querySelector('.mobile-search');
    
    if (searchToggle && mobileSearch) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mobileSearch.classList.toggle('show');
        });
    }
    
    // Notification panel toggle
    const notificationBell = navbar.querySelector('.notification-bell');
    const notificationPanel = navbar.querySelector('.notification-panel');
    
    if (notificationBell && notificationPanel) {
        notificationBell.addEventListener('click', function(e) {
            e.preventDefault();
            notificationPanel.classList.toggle('show');
            
            // Mark notifications as read when opening the panel
            if (notificationPanel.classList.contains('show')) {
                const badge = this.querySelector('.notification-badge');
                if (badge) badge.style.display = 'none';
            }
        });
    }
    
    // Logout functionality
    const logoutBtn = navbar.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your logout logic here
            console.log('Logout clicked');
            // Example: window.location.href = '/logout';
        });
    }
    
    // Add scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 10) {
            navbar.classList.add('scrolled');
            
            // Hide navbar on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Update active link based on current page
    updateActiveLink();
}

/**
 * Updates the active link in the navbar based on current page
 */
function updateActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref && currentPage.includes(linkHref.replace('.html', ''))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}
