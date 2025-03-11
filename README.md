

## This is the frontend for an online store application built with Django. It serves as the user interface for customers to browse products, view details, and make purchases. The backend for this project is available at [online_shop_backend](https://github.com/yourusername/online_shop_backend).

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
## Features

- User-friendly interface for browsing products
- Product detail pages
- Shopping cart functionality 
- Responsive design for mobile and desktop views
- Dockerized for easy deployment

## Technologies Used

- Django
- HTML5 & CSS3
- JavaScript
- Bootstrap (or any other CSS framework used)
- Git (for version control)

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/online_store_frontend.git

2. Navigate to the project directory:
   ```bash
   cd online_store_frontend

4. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`

5.  Install the required packages:
    ```bash
    requarments.txt

6. Run the development server 8001:
   ```bash
   python manage.py runserver
After launching the online_shop_backend application Open your browser and go to http://127.0.0.1:8001/ to view the application.

## Docker Installation

If you prefer to run the project using Docker, you can do so by following these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FATEMEfati/Online_Shop_backend.git
   cd online_shop_backend

2. **Build the Docker containers:**
   ```bash
   docker-compose build

3. **Run the Docker containers:**
   ```bash
   docker-compose up
## Usage
   After cloning the project, all IPs used in index.html, base.html, user.js, custom.js and views.py files must be changed.
   Navigate through the homepage to view available products.
   Click on a product to see its details.
   Add products to your cart and proceed to checkout (if functionality is implemented).
   For further interaction, refer to the backend documentation available in
   online_shop_backend

## Contributing
   Contributions are welcome! If you have suggestions for improvements or want to report a bug, please create an issue or submit a pull request.

   Fork the repository
   Create a new branch (git checkout -b feature/YourFeature)
   Make your changes and commit them (git commit -m 'Add new feature')
   Push to the branch (git push origin feature/YourFeature)
   Open a pull request
