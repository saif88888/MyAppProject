# Instagram URL Cleaner

## Overview

A web application built with Flask that removes tracking parameters from Instagram URLs to enhance privacy when sharing links. The application provides a clean, user-friendly interface for users to paste Instagram URLs and receive cleaned versions without tracking parameters.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5 with dark theme support
- **Icon Library**: Font Awesome for consistent iconography
- **Design Pattern**: Single-page application with progressive enhancement
- **Styling Approach**: CSS custom properties for Instagram-inspired theming with gradient accents
- **JavaScript Architecture**: Class-based ES6 approach with modular event handling

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Application Structure**: Simple single-file Flask application with template rendering
- **Session Management**: Flask sessions with configurable secret key via environment variables
- **Logging**: Built-in Python logging for debugging and monitoring
- **Deployment**: Configured for Replit hosting (0.0.0.0:5000)

### Core Features
- **URL Processing**: Real-time Instagram URL validation and parameter removal
- **User Interface**: Responsive design with clipboard integration
- **Error Handling**: Client-side validation with user-friendly error messages
- **Accessibility**: Dark theme support with proper contrast ratios

### Development Patterns
- **Configuration**: Environment-based configuration for secrets
- **File Organization**: Standard Flask structure with templates and static assets
- **Error Management**: Comprehensive client-side validation and user feedback

## External Dependencies

### Frontend Dependencies
- **Bootstrap 5**: UI framework via Replit CDN for consistent styling
- **Font Awesome 6.4.0**: Icon library via CDN for visual elements
- **Replit Bootstrap Theme**: Custom dark theme implementation

### Backend Dependencies
- **Flask**: Core web framework for Python
- **Python Standard Library**: Logging and OS modules for basic functionality

### Development Tools
- **Replit Environment**: Hosting and development platform
- **Browser APIs**: Clipboard API for copy functionality
- **Environment Variables**: For configuration management