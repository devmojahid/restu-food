# Restu Food - Restaurant Delivery Platform

## About

Restu Food is a Laravel 11-based restaurant food ordering and delivery platform with a dynamic page builder, real-time features, and a comprehensive admin panel.

## Key Features

- Restaurant listings and management
- Food ordering and delivery tracking
- Real-time notifications using Laravel Reverb
- Multi-user roles (Admin, Restaurant, Kitchen Staff, Delivery, Customer)
- Mobile-friendly responsive design
- Dynamic homepage builder

## Technical Stack

- **Backend**: Laravel 11 with streamlined application structure
- **Frontend**: Inertia.js with React
- **UI**: Tailwind CSS + Shadcn UI Components
- **Real-time**: Laravel Reverb
- **Authentication**: Laravel Breeze

## Page Builder

The platform includes a powerful drag-and-drop page builder for customizing the homepage layout and content.

### Page Builder Features

- Modular section-based layout
- Live preview of changes
- Global styling options
- Image uploads and gallery management
- Responsive design settings
- Hero slider configuration

### Page Builder Documentation

Detailed documentation is available for the page builder:

- [User Guide](resources/js/Pages/Admin/Appearance/Homepage/Docs/PageBuilderGuide.md) - For content managers
- [Developer Guide](resources/js/Pages/Admin/Appearance/Homepage/Docs/DeveloperGuide.md) - For developers extending the system

## Getting Started

### Prerequisites

- PHP 8.1+
- Composer
- Node.js 16+ and NPM
- MySQL 8.0+ or PostgreSQL 13+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/restu-food.git
   cd restu-food
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install JavaScript dependencies:
   ```bash
   npm install
   ```

4. Copy the environment file and configure your database:
   ```bash
   cp .env.example .env
   # Edit .env file to set database credentials
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Run migrations with seed data:
   ```bash
   php artisan migrate --seed
   ```

7. Link storage:
   ```bash
   php artisan storage:link
   ```

8. Build assets:
   ```bash
   npm run build
   ```

9. Start the development server:
   ```bash
   php artisan serve
   ```

10. Start Reverb WebSocket server (for real-time features):
    ```bash
    php artisan reverb:start
    ```

## Development Guidelines

### Error Handling

All components should implement robust error handling with:

1. Type checking using utility functions from `useArraySafety` hook
2. Default fallback values for missing data
3. Try/catch blocks for asynchronous operations
4. Error boundaries for React components

### Code Organization

- Controllers should be thin, delegating business logic to services
- Use dedicated services for complex business logic
- Follow PSR-12 coding standards
- Use Laravel's type declarations and return types

### Frontend Components

- Implement null safety checks in all components
- Use early returns for invalid data
- Follow the mobile-first responsive design approach
- Keep business logic separate from UI components

## Common Issues & Solutions

See our [Troubleshooting Guide](docs/troubleshooting.md) for solutions to common issues.

## Testing

Run tests with:

```bash
php artisan test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
