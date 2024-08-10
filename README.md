# Getting Started

## Prerequisites

- PHP version 8.3 or higher
- Composer version 2.7.2 or higher
- Node version 16.16.0 or higher
- npm version 8.13.2 or higher
- mysql version 8.0.30 or higher

## Installation and Setup

1. Clone the repository:

    ```
    git clone https://github.com/AH-V-Software/school_management.git
    ```

2. Install the necessary PHP dependencies using Composer:

    ```
    composer install
    ```

3. To install the required dependencies for both the client and server, run the following command in the root directory:

    ```
    npm install --legacy-peer-deps
    ```

   *This will install all the required dependencies, including `bootstrap-table-next` and `react-toastify`, along with any peer dependencies required by those packages.*

4. Copy the `.env.example` file to `.env` and update the database credentials with your values. Open the `.env` file and modify the following fields according to your database setup:

    ```
    DB_CONNECTION=mysql
    DB_HOST=your_database_host
    DB_PORT=your_database_port
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
    ```

   Update the mail settings in the `.env` file to reflect your email setup. Modify the following fields:

    ```
    MAIL_MAILER="your mail service eg. smtp"
    MAIL_HOST=your_mail_host
    MAIL_PORT=your_mail_port
    MAIL_USERNAME=your_mail_username
    MAIL_PASSWORD=your_mail_password
    MAIL_ENCRYPTION=your_mail_encryption
    MAIL_FROM_ADDRESS=your_email_password
    ```

5. Migrate the database:

    ```
    php artisan migrate
    ```

6. Seed the database with sample data (optional):

    ```
    php artisan db:seed
    ```

7. Start the application by running the Server command in the root directory.

    ```
    php artisan serve 
    ```

    ```
    npm run dev
    ```
