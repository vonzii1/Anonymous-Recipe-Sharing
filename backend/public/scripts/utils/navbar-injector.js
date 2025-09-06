/**
 * Navbar Injector Utility
 * 
 * This script handles the injection of the navbar component into all pages
 * and initializes its functionality.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inject navbar into the page
  injectNavbar().then(() => {
    // Initialize navbar functionality after injection
    initializeNavbar();
    
    // Update active link based on current page
    updateActiveLink();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Setup event listeners
    setupEventListeners();
  });
});

/**
 * Injects the navbar HTML into the page
 */
async function injectNavbar() {
  // Check if navbar is already injected
  if (document.querySelector('.navbar')) {
    console.log('Navbar already exists in the DOM');
    return Promise.resolve();
  }
  
  try {
    // Fetch the navbar component
    const response = await fetch('/components/navbar.html');
    if (!response.ok) {
      throw new Error('Failed to load navbar component');
    }
    
    const navbarHTML = await response.text();
    
    // Create a temporary container to hold the navbar
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = navbarHTML.trim();
    const navbarElement = tempDiv.firstChild;
    
    // Insert the navbar at the beginning of the body
    document.body.insertBefore(navbarElement, document.body.firstChild);
    
    // Add padding to the body to account for fixed navbar
    document.documentElement.style.setProperty('--navbar-height', '80px');
    document.body.style.paddingTop = 'var(--navbar-height)';
    
    console.log('Navbar injected successfully');
  } catch (error) {
    console.error('Error injecting navbar:', error);
  }
}

/**
 * Initializes navbar functionality
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
    if (!navbar.contains(event.target) && !event.target.matches('.navbar-toggler')) {
      if (navbarNav) navbarNav.classList.remove('show');
      if (navbarToggler) navbarToggler.setAttribute('aria-expanded', 'false');
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

/**
 * Initializes Bootstrap tooltips
 */
function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl, {
      trigger: 'hover',
      placement: 'bottom',
      animation: true
    });
  });
}

/**
 * Sets up event listeners for the navbar
 */
function setupEventListeners() {
  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll('.nav-link');
  const navbarNav = document.querySelector('.navbar-nav');
  const navbarToggler = document.querySelector('.navbar-toggler');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close mobile menu if open
      if (navbarNav && navbarNav.classList.contains('show')) {
        navbarNav.classList.remove('show');
        if (navbarToggler) {
          navbarToggler.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      }
    });
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    // Clear the timeout on resize
    clearTimeout(resizeTimer);
    
    // Set a new timeout
    resizeTimer = setTimeout(function() {
      // Close mobile menu on desktop view
      if (window.innerWidth >= 992 && navbarNav) {
        navbarNav.classList.remove('show');
        if (navbarToggler) {
          navbarToggler.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      }
    }, 250);
  });
}

// Export functions for use in other scripts
window.navbarUtils = {
  injectNavbar,
  initializeNavbar,
  updateActiveLink,
  initializeTooltips
};
