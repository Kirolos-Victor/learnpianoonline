# Learn Piano Online

A comprehensive e-learning platform for online piano lessons with subscription management, real-time messaging, and multi-role authorization.

## Features

### User Roles & Authorization
- **Four-layer authorization system:**
  - **Parents**: Manage student profiles, purchase subscriptions, communicate with instructors
  - **Students**: View sessions, track progress, chat with instructors
  - **Instructors**: Manage assigned students, mark session completion, add notes and screenshots
  - **Admins**: Full platform management, analytics, user and instructor assignment

### Subscription & Payment Management
- **Stripe payment integration** for secure checkout
- **Flexible subscription plans:**
  - Monthly: 30 days, 4 sessions
  - Yearly: 360 days, 48 sessions
- **Multi-student discounts**: 10% off for additional students
- **Cumulative subscriptions**: New subscriptions extend existing periods
- **Automated session generation** upon successful payment
- **Webhook handling** for payment status updates

### Shopping Cart & Order Management
- Add multiple students to cart for batch subscription
- Real-time pricing calculation with discounts
- Pricing preview for 1-5 students
- Payment status tracking (pending, completed, failed)

### Session Management
- Automatic weekly session scheduling
- Session status tracking: pending, completed, cancelled, missed
- **Instructor features:**
  - Mark sessions as completed/missed/cancelled
  - Add session notes and screenshots
  - Create replacement sessions for cancelled lessons
- **Parent/Student features:**
  - View upcoming and past sessions
  - Track sessions remaining
  - Session history with notes

### Real-Time Communication
- Built-in messaging system between students and instructors
- Parent-instructor communication through student profiles
- Conversation history and message polling
- Real-time updates

### Admin Dashboard
- **Comprehensive analytics:**
  - User statistics (total, active, inactive)
  - Instructor and student metrics
  - Session tracking (pending, completed)
  - Revenue analytics and subscription trends
  - Date-range filtering for reports
- **User management:**
  - Activate/restrict user access
  - Manage instructor availability
  - Assign instructors to students
  - Handle pending subscriber queue

### Additional Features
- Email verification and password reset
- Timezone-aware scheduling
- Location-based timezone detection
- Instructor availability management
- Automated daily sitemap generation
- Subscription expiration processing
- Mobile-responsive design with Tailwind CSS

## Tech Stack

### Backend
- **Framework**: Laravel 12.0
- **Language**: PHP 8.2+
- **Database**: PostgreSQL (configurable)
- **Authentication**: Laravel Sanctum
- **Payments**: Stripe API
- **Queue System**: Laravel Queue with database driver
- **Task Scheduling**: Laravel Scheduler

### Frontend
- **Framework**: React 19 with TypeScript
- **SSR**: Inertia.js 2.0
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Build Tool**: Vite 6
- **HTTP Client**: Axios

### Third-Party Integrations
- **Stripe**: Payment processing and webhooks
- **Spatie Sitemap**: SEO sitemap generation

## Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- PostgreSQL (or MySQL/SQLite)
- Stripe account for payment processing

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd learnpianoonline
```

### Step 2: Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### Step 3: Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 4: Configure Environment Variables
Edit `.env` file and configure the following:

#### Application Settings
```
APP_NAME="Your App Name"
APP_ENV=local
APP_URL=http://localhost
APP_DEBUG=true
APP_TIMEZONE=UTC
```

#### Pricing Configuration
```
MONTHLY_SUBSCRIBE_PRICE=99
YEARLY_SUBSCRIBE_PRICE=999
DISCOUNT_PERCENTAGE=10
```

#### Database Configuration
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

#### Stripe Configuration
```
STRIPE_KEY=pk_test_your_publishable_key
STRIPE_SECRET=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Mail Configuration
```
MAIL_MAILER=smtp
MAIL_HOST=your_mail_host
MAIL_PORT=587
MAIL_USERNAME=your_mail_username
MAIL_PASSWORD=your_mail_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

#### Session & Cache Configuration
```
SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=database
QUEUE_CONNECTION=database
```

#### Support Contact
```
SUPPORT_EMAIL=support@example.com
SUPPORT_PHONE=+1234567890
```

### Step 5: Database Setup
```bash
# Run migrations
php artisan migrate

# (Optional) Seed database with sample data
php artisan db:seed
```

### Step 6: Storage Setup
```bash
# Create storage symlink for public file access
php artisan storage:link
```

### Step 7: Build Frontend Assets
```bash
# For development (with hot reload)
npm run dev

# For production
npm run build
```

### Step 8: Configure Stripe Webhooks
1. Go to your Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/payment/webhook`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET` in `.env`

### Step 9: Start the Application
```bash
# Start Laravel development server
php artisan serve

# In a separate terminal, start the queue worker
php artisan queue:work

# In another terminal, start Vite dev server (if using npm run dev)
npm run dev
```

### Step 10: Configure Task Scheduler
For automated tasks (subscription expiration, sitemap generation), add to your crontab:
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Or run manually:
```bash
# Process expired subscriptions (runs daily at 23:59)
php artisan subscriptions:process-expired

# Generate sitemap (runs daily at 02:30)
php artisan sitemap:generate
```

### Step 11: Create Admin User
```bash
# Access the application and register
# Then update the user role in database:
php artisan tinker
```
```php
$user = User::where('email', 'admin@example.com')->first();
$user->role = 'admin';
$user->is_active = true;
$user->save();
```

## Development

### Running Tests
```bash
# Run PHPUnit tests
php artisan test
```

### Code Quality
```bash
# Run Laravel Pint (code formatter)
./vendor/bin/pint

# Run ESLint
npm run lint
```

### Building for Production
```bash
# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build frontend assets
npm run build
```

## File Structure

```
├── app/
│   ├── Http/Controllers/      # Application controllers
│   ├── Models/                # Eloquent models
│   ├── Services/              # Business logic services
│   └── Jobs/                  # Queue jobs
├── database/
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders
├── resources/
│   ├── js/
│   │   ├── components/        # React components
│   │   ├── pages/             # Inertia pages
│   │   └── types/             # TypeScript types
│   └── css/                   # Styles
├── routes/
│   ├── web.php                # Web routes
│   ├── auth.php               # Authentication routes
│   ├── admin.php              # Admin routes
│   └── instructor.php         # Instructor routes
└── public/                    # Public assets
```

## Key Routes

### Public Routes
- `/` - Home page
- `/about` - About page
- `/pricing` - Pricing plans
- `/contact` - Contact page

### Authentication
- `/register` - User registration
- `/login` - User login

### Parent Dashboard
- `/parent/dashboard` - Parent dashboard
- `/parent/students` - Manage students
- `/parent/subscription` - Subscription management

### Instructor Dashboard
- `/instructor/dashboard` - Instructor dashboard
- `/instructor/students` - View assigned students
- `/instructor/chat` - Message interface

### Admin Dashboard
- `/admin/dashboard` - Admin analytics
- `/admin/parents` - Manage parents
- `/admin/instructors` - Manage instructors
- `/admin/students` - Manage all students

## Configuration

### Timezone Management
The platform automatically detects user timezone based on location during registration. Configure default timezone:
```
PREFERRED_TIMEZONE="GMT+3"
```

### Session Scheduling
Configure instructor availability time slots:
```
START_TIME="5PM"
END_TIME="3AM"
AVAILABLE_DAYS=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"]
```

### Broadcasting (Optional)
For real-time features using Laravel Reverb:
```
BROADCAST_DRIVER=reverb
REVERB_APP_ID=your_app_id
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_app_secret
```

## Troubleshooting

### Queue Jobs Not Running
```bash
# Check queue worker is running
php artisan queue:work

# Restart queue worker after code changes
php artisan queue:restart
```

### Stripe Webhook Fails
- Verify webhook secret matches Stripe dashboard
- Check webhook endpoint is publicly accessible
- Review logs: `tail -f storage/logs/laravel.log`

### Frontend Not Updating
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

### Permission Issues
```bash
# Fix storage and cache permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## License

[Add your license information here]

## Support

For issues or questions:
- Email: ${SUPPORT_EMAIL}
- Phone: ${SUPPORT_PHONE}
