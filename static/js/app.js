/**
 * Instagram URL Cleaner - Main Application Logic
 * Handles URL cleaning, validation, and clipboard operations
 */

class InstagramURLCleaner {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupRealTimeValidation();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.originalUrlInput = document.getElementById('originalUrl');
        this.cleanedUrlInput = document.getElementById('cleanedUrl');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.resultsCard = document.getElementById('resultsCard');
        this.errorAlert = document.getElementById('errorAlert');
        this.successAlert = document.getElementById('successAlert');
        this.errorMessage = document.getElementById('errorMessage');
        this.removedParams = document.getElementById('removedParams');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Input events
        this.originalUrlInput.addEventListener('input', this.handleUrlInput.bind(this));
        this.originalUrlInput.addEventListener('paste', this.handlePaste.bind(this));
        
        // Button events
        this.copyBtn.addEventListener('click', this.handleCopy.bind(this));
        this.clearBtn.addEventListener('click', this.handleClear.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    /**
     * Setup real-time validation
     */
    setupRealTimeValidation() {
        let timeout;
        this.originalUrlInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.validateAndCleanUrl(e.target.value.trim());
            }, 300); // Debounce for 300ms
        });
    }

    /**
     * Handle URL input
     */
    handleUrlInput(event) {
        const url = event.target.value.trim();
        if (url) {
            this.validateAndCleanUrl(url);
        } else {
            this.hideResults();
        }
    }

    /**
     * Handle paste event
     */
    handlePaste(event) {
        setTimeout(() => {
            const url = event.target.value.trim();
            if (url) {
                this.validateAndCleanUrl(url);
            }
        }, 100);
    }

    /**
     * Validate if URL is a valid Instagram URL
     */
    isValidInstagramUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            
            // Check if it's an Instagram domain
            const validDomains = [
                'instagram.com',
                'www.instagram.com',
                'm.instagram.com',
                'instagr.am',
                'www.instagr.am'
            ];
            
            return validDomains.includes(hostname);
        } catch (error) {
            return false;
        }
    }

    /**
     * Clean Instagram URL by removing tracking parameters
     */
    cleanInstagramUrl(url) {
        try {
            const urlObj = new URL(url);
            
            // Remove everything after /? in the pathname
            const pathParts = urlObj.pathname.split('/?');
            const cleanPath = pathParts[0];
            
            // Create clean URL with just the essential parts
            const cleanUrl = `${urlObj.protocol}//${urlObj.hostname}${cleanPath}`;
            
            // Determine what was removed
            const originalParams = url.includes('/?') ? url.split('/?')[1] : '';
            const removedContent = originalParams ? `/?${originalParams}` : 'No tracking parameters found';
            
            return {
                cleanUrl: cleanUrl,
                removed: removedContent,
                wasModified: originalParams.length > 0
            };
        } catch (error) {
            throw new Error('Failed to parse URL');
        }
    }

    /**
     * Validate and clean the provided URL
     */
    validateAndCleanUrl(url) {
        this.hideAlerts();
        
        if (!url) {
            this.hideResults();
            return;
        }

        // Validate Instagram URL
        if (!this.isValidInstagramUrl(url)) {
            this.showError('Please enter a valid Instagram URL (e.g., https://www.instagram.com/...)');
            this.hideResults();
            return;
        }

        try {
            // Clean the URL
            const result = this.cleanInstagramUrl(url);
            
            // Show results
            this.showResults(result);
            
        } catch (error) {
            this.showError('Invalid URL format. Please check your Instagram URL and try again.');
            this.hideResults();
        }
    }

    /**
     * Show cleaning results
     */
    showResults(result) {
        this.cleanedUrlInput.value = result.cleanUrl;
        this.removedParams.textContent = result.removed;
        this.resultsCard.classList.remove('d-none');
        
        // Add visual feedback for modified URLs
        if (result.wasModified) {
            this.cleanedUrlInput.classList.add('border-success');
        } else {
            this.cleanedUrlInput.classList.remove('border-success');
            this.removedParams.textContent = 'URL was already clean';
        }
    }

    /**
     * Hide results section
     */
    hideResults() {
        this.resultsCard.classList.add('d-none');
        this.cleanedUrlInput.classList.remove('border-success');
    }

    /**
     * Show error message
     */
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorAlert.classList.remove('d-none');
    }

    /**
     * Hide all alerts
     */
    hideAlerts() {
        this.errorAlert.classList.add('d-none');
        this.successAlert.classList.add('d-none');
    }

    /**
     * Handle copy to clipboard
     */
    async handleCopy() {
        const cleanedUrl = this.cleanedUrlInput.value;
        
        if (!cleanedUrl) {
            return;
        }

        try {
            // Use modern Clipboard API if available
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(cleanedUrl);
            } else {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(cleanedUrl);
            }
            
            this.showCopySuccess();
            
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showError('Failed to copy to clipboard. Please copy manually.');
        }
    }

    /**
     * Fallback copy method for older browsers
     */
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    /**
     * Show copy success feedback
     */
    showCopySuccess() {
        // Show success alert
        this.successAlert.classList.remove('d-none');
        
        // Change button appearance temporarily
        const originalHTML = this.copyBtn.innerHTML;
        this.copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
        this.copyBtn.classList.add('btn-copy-success');
        
        // Reset after 2 seconds
        setTimeout(() => {
            this.copyBtn.innerHTML = originalHTML;
            this.copyBtn.classList.remove('btn-copy-success');
            this.successAlert.classList.add('d-none');
        }, 2000);
    }

    /**
     * Handle clear button
     */
    handleClear() {
        this.originalUrlInput.value = '';
        this.hideResults();
        this.hideAlerts();
        this.originalUrlInput.focus();
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(event) {
        // Ctrl/Cmd + K to focus input
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            this.originalUrlInput.focus();
            this.originalUrlInput.select();
        }
        
        // Escape to clear
        if (event.key === 'Escape') {
            this.handleClear();
        }
        
        // Ctrl/Cmd + C when cleaned URL is focused to copy
        if ((event.ctrlKey || event.metaKey) && event.key === 'c' && 
            document.activeElement === this.cleanedUrlInput) {
            event.preventDefault();
            this.handleCopy();
        }
    }
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Instagram URL Cleaner
    new InstagramURLCleaner();
    
    // Add some example URLs for testing (in development mode)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Instagram URL Cleaner loaded successfully!');
        console.log('Try these example URLs:');
        console.log('- https://www.instagram.com/reel/DMaaOuDK_Bk/?igsh=dHFkZW9ycmh1cnQz');
        console.log('- https://www.instagram.com/p/ABC123/?utm_source=ig_web_copy_link');
        console.log('- https://instagram.com/stories/username/123456789/?utm_medium=share_sheet');
    }
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states for better perceived performance
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
        });
    });
});

/**
 * Service Worker registration for offline functionality (optional)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Only register service worker in production
        if (window.location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        }
    });
}
