async function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        resetInputs(section);
        section.style.display = 'none';
    });
    updateNumber()

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

function resetInputs(section) {
    const inputs = section.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea');
    currentPage = 1;
    inputs.forEach(input => {
        input.value = '';
    });
}


async function updateNumber() {
    const number = await fetch('http://127.0.0.1:8000/api-v1/number_of_product/', {
        method: 'GET', // Specify the method if necessary
        credentials: 'include' // Include credentials for session management
    });
    const number_of_product = await number.json();
    console.log(number_of_product)
    const dynamicNumberElement = document.getElementById('dynamic-number');
    const dynamicNumberElement_login = document.getElementById('dynamic-number_login');
    dynamicNumberElement.textContent = number_of_product; // Update the span with the new number
    dynamicNumberElement_login.textContent = number_of_product
}

async function add_to_cart(event) {
    event.preventDefault();

    const productId = document.getElementById('product-id').value;
    const quantity = document.getElementById('var-value').innerText;
    const size = document.getElementById('size-select').value;
    const color = document.getElementById('color-select').value;

    const data = {
        "product_id": productId,
        "quantity": parseInt(quantity, 10),
        "size": size,
        "color": color 
    };

    console.log(JSON.stringify(data));

    const apiUrl = 'http://127.0.0.1:8000/api-v1/add_to_cart/';

    fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                // If the response is not ok, throw an error with the message from the server
                throw new Error(data.message || 'Something went wrong');
            }
            return data;
        });
    })
    .then(data => {
        updateNumber();
        console.log('Success:', data);
        // Optionally, display a success message to the user
        alert('Product added to cart successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        // Display the error message to the user
        alert(`Error: ${error.message}`);
    });
}

// Show the home section by default
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
});



async function sendProductData(productId) {
    console.log(productId)
    await showSection('product');
    const apiBaseUrl = 'http://127.0.0.1:8000/api-v1/';
    const product_detailData = {};

    try {
        const productResponse = await fetch(`${apiBaseUrl}product_details/${productId}/`);
        if (!productResponse.ok) {
            throw new Error(`Product fetch failed: ${productResponse.statusText}`);
        }
        const productData = await productResponse.json();
        product_detailData.product_details = productData;

        const product_key_value_Response = await fetch(`${apiBaseUrl}product_attribute_details/${productId}/`);
        if (!product_key_value_Response.ok) {
            throw new Error(`Product fetch failed: ${product_key_value_Response.statusText}`);
        }
        const product_keyvalue_Data = await product_key_value_Response.json();
        console.log(product_keyvalue_Data)
        product_detailData.product_key_value = product_keyvalue_Data;

        const productAttributeResponse = await fetch(`${apiBaseUrl}product_diversity_details/${productId}/`);
        if (!productAttributeResponse.ok) {
            throw new Error(`Product fetch failed: ${productAttributeResponse.statusText}`);
        }
        const productAttributeData = await productAttributeResponse.json();
        product_detailData.product_attribute = productAttributeData;

        const photosResponse = await fetch(`${apiBaseUrl}galery/`);
        if (!photosResponse.ok) {
            throw new Error(`Photo fetch failed: ${photosResponse.statusText}`);
        }
        const photosData = await photosResponse.json();
        product_detailData .photos = photosData;

        // Call the function to render product data
        renderProduct_detailData(product_detailData);
    } catch (error) {
        console.error(error);
    }
    
}



async function renderProduct_detailData(product_detailData) {
    const productDetailContainer = document.getElementById('product_detail_container');
    productDetailContainer.innerHTML = '';
    console.log(product_detailData);
    
    // Create a mapping of sizes to colors
    const sizeToColorsMap = {};
    product_detailData.product_attribute.forEach(attr => {
        const size = attr.size;
        const color = attr.color;
        if (!sizeToColorsMap[size]) {
            sizeToColorsMap[size] = [];
        }
        sizeToColorsMap[size].push(color);
    });

    const productHTML = `
    <section class="bg-light">
        <div class="container pb-5">
            <div class="row">
                <div class="col-lg-5 mt-5">
                    <div class="card mb-3">
                        ${product_detailData.photos.map(photo => `
                            ${photo.product === product_detailData.product_details[0].id && photo.banner ? `
                                <img class="card-img img-fluid product_picture" src="${photo.picture.startsWith('http') ? photo.picture : '/static' + photo.picture}" id="product-detail">
                            ` : ''}
                        `).join('')}
                    </div>
                    <div class="row">
                        <div class="col-1 align-self-center">
                            <a href="#multi-item-example" role="button" data-bs-slide="prev">
                                <i class="text-dark fas fa-chevron-left"></i>
                                <span class="sr-only">Previous</span>
                            </a>
                        </div>
                        <div id="multi-item-example" class="col-10 carousel slide carousel-multi-item" data-bs-ride="carousel">
                            <div class="carousel-inner product-links-wap" role="listbox">
                                    ${product_detailData.photos.map((photo, index) => `
                                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                            <div class="row">
                                                <div class="col-4">
                                                <a href="#">
                                                    ${photo.product === product_detailData.product_details[0].id ? `
                                                        <img class="card-img img-fluid" src="${photo.picture.startsWith('http') ? photo.picture : '/static' + photo.picture}" id="product-detail">
                                                    ` : ''}
                                                </a>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                            </div>
                        </div>
                        <div class="col-1 align-self-center">
                            <a href="#multi-item-example" role="button" data-bs-slide="next">
                                <i class="text-dark fas fa-chevron-right"></i>
                                <span class="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-7 mt-5">
                    <div class="card">
                        <div class="card-body">
                            <h1 class="h2">${product_detailData.product_details[0].product_name}</h1>
                            <p class="h3 py-2">
                                ${product_detailData.product_details[0].is_discount 
                                    ? `<span style="text-decoration: line-through;">$${product_detailData.product_details[0].price}</span><br>` 
                                    : ''
                                }
                                $${product_detailData.product_details[0].is_discount ? product_detailData.product_details[0].price_after_discount : product_detailData.product_details[0].price}
                            </p>
                            <h6>Description:</h6>
                            <p>${product_detailData.product_details[0].description}</p>
                            <h6>Quality:</h6>
                            ${product_detailData.product_key_value.map(key_value => `
                                <p>${key_value.key}: ${key_value.value}</p>
                            `).join('')}
                            <form onsubmit="add_to_cart(event)" id="product-form" method="GET">
                            <h6>Available size:</h6>
                            <select id="size-select" class="form-select" onchange="updateColorOptions()">
                                <option value="">Select Size</option>
                                ${Object.keys(sizeToColorsMap).map(size => `
                                    <option value="${size}">${size}</option>
                                `).join('')}
                            </select>

                            <h6>Available Colors:</h6>
                            <select id="color-select" class="form-select" disabled>
                                <option value="">Select Color</option>
                            </select>
                                <div class="row">
                                    <div class="col-auto">
                                        <ul class="list-inline pb-3">
                                            <li class="list-inline-item text-right">Quantity</li>
                                            <button type="button" class="list-inline-item no-box-button">
                                                <span class="btn btn-success" id="btn-minus" onclick="decreaseQuantity()">-</span>
                                            </button>
                                            <li class="list-inline-item">
                                                <span class="badge bg-secondary" id="var-value">1</span>
                                            </li>
                                            <button type="button" class="list-inline-item no-box-button">
                                                <span class="btn btn-success" id="btn-plus" onclick="increaseQuantity()">+</span>
                                            </button>
                                        </ul>
                                    </div>
                                </div>
                                <input type="hidden" id="product-id" value="${product_detailData.product_details[0].id}" />
                                <div class="row pb-3">
                                    <div class="col d-grid">
                                        <button type="submit" class="btn btn-success btn-lg" id="submit-button">Add To Cart</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;
    // Append the generated HTML to the container
    productDetailContainer.innerHTML = productHTML;

    // Function to update color options based on selected size
    window.updateColorOptions = function() {
        const sizeSelect = document.getElementById('size-select');
        const colorSelect = document.getElementById('color-select');
        const selectedSize = sizeSelect.value;

        // Clear previous color options
        colorSelect.innerHTML = '<option value="">Select Color</option>';
        colorSelect.disabled = true;

        if (selectedSize && sizeToColorsMap[selectedSize]) {
            sizeToColorsMap[selectedSize].forEach(color => {
                colorSelect.innerHTML += `<option value="${color}">${color}</option>`;
            });
            colorSelect.disabled = false; // Enable color select
        }
    };
}
     

const productData = {}
async function sendCategoryData(categoryId) {
    await showSection('category_item');
    const apiBaseUrl = 'http://127.0.0.1:8000/api-v1/';
    // const productData = {};

    try {
        // Fetch category information
        const categoryResponse = await fetch(`${apiBaseUrl}categories/${categoryId}/`);
        if (!categoryResponse.ok) {
            throw new Error(`Category fetch failed: ${categoryResponse.statusText}`);
        }
        const categoryData = await categoryResponse.json();
        productData.subcategories = categoryData;
        console.log('Category Data:', categoryData);

        // Fetch products for category
        const productResponse = await fetch(`${apiBaseUrl}product_for_cat/${categoryId}/`);
        if (!productResponse.ok) {
            throw new Error(`Product fetch failed: ${productResponse.statusText}`);
        }
        const productsData = await productResponse.json();
        productData.product = productsData;

        // Fetch photos
        const photosResponse = await fetch(`${apiBaseUrl}galery/`);
        if (!photosResponse.ok) {
            throw new Error(`Photo fetch failed: ${photosResponse.statusText}`);
        }
        const photosData = await photosResponse.json();
        productData.photos = photosData;

        // Call the function to render product data
        renderProductData(productData);
    } catch (error) {
        console.error(error);
    }
}


let currentPage = 1;
const productsPerPage = 3; 

function renderProductData(productData) {
    const subcategoryContainer = document.getElementById('product_container');
    subcategoryContainer.innerHTML = ''; 
    
    const subcategorySection = document.createElement('section');
    subcategorySection.innerHTML = `
        <div class="row">
            ${productData.subcategories.map(category => `
                <div class="col-12 col-md-4 p-5 mt-3">
                    <h5 class="text-center mt-3 mb-3">
                        <button onclick="sendCategoryData(${category.id})" class="header_butten">${category.category_name}</button>
                    </h5>
                </div>
            `).join('')}
        </div>
    `;
    subcategoryContainer.appendChild(subcategorySection);

    const totalProducts = productData.product.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToRender = productData.product.slice(startIndex, endIndex);
    
    const productSection = document.createElement('section');
    productSection.classList.add('bg-light');
    productSection.innerHTML = `
        <div class="container py-5">
            <div class="row">
                ${productsToRender.map(product => `
                    <div class="col-md-4">
                        <div class="card mb-4 product-wap rounded-0">
                            <div class="card rounded-0">
                                ${productData.photos.map(photo => `
                                    ${photo.product === product.id && photo.banner ? `
                                        <img src="${photo.picture.startsWith('http') ? photo.picture : '/static' + photo.picture}" class="card-img-top product_picture" alt="..."> 
                                    ` : ''}
                                `).join('')}
                                <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul class="list-unstyled">
                                        <button onclick="sendProductData(${product.id})" class="btn btn-success text-white mt-2">Show Details</button>
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body">
                                <a href="shop-single.html" class="h3 text-decoration-none">${product.product_name}</a>
                                <p class="text-center mb-0">
                                    ${product.is_discount ? `
                                        <span class="text-danger">Special</span><br>
                                        <span style="text-decoration: line-through;">$${product.price}</span><br>
                                        <span class="font-weight-bold">$${product.price_after_discount}</span>
                                    ` : `
                                        <span>$${product.price}</span>
                                    `}
                                </p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="row">
                <div class="col-12 text-center">
                    <button onclick="changePage(-1)" class="btn btn-primary" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                    <span class="mx-2">Page ${currentPage} of ${totalPages}</span>
                    <button onclick="changePage(1)" class="btn btn-primary" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        </div>
        <style>
        .product_picture {
            width: 300px; /* Set the desired width */
            height: 300px; /* Set the desired height */
            object-fit: cover; /* Ensures the image covers the entire area */
            border-radius: 10px; /* Optional: adds rounded corners */
            display: block; /* Makes sure it behaves as a block element */
            margin: 0 auto; /* Centers the image horizontally if needed */
            }
        </style>
    `;
    subcategoryContainer.appendChild(productSection);
}

function changePage(direction) {
    console.log(productData)
    const totalProducts = productData.product.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    console.log("hello")
    
    currentPage += direction;

    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    
    renderProductData(productData);
}

const discountdata = {}
async function discountData() {

    await showSection('discounts');


    try {
        const response = await fetch('http://127.0.0.1:8000/api-v1/products/?is_discount=true');

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const photosResponse = await fetch(`http://127.0.0.1:8000/api-v1/galery/`);
        if (!photosResponse.ok) {
            throw new Error(`Photo fetch failed: ${photosResponse.statusText}`);
        }
        const photosData = await photosResponse.json();
        discountdata.photos = photosData;

        const results = await response.json();
        discountdata.product =results
        display_discount(discountdata);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

function display_discount(discountdata) {
    
    const productContainer = document.getElementById('discount_con');
    productContainer.innerHTML = ''; 

    const totalProducts = discountdata.product.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, totalProducts);

    const featuredProducts = discountdata.product.slice(startIndex, endIndex);

    const featuredSection = `
        <div class="container py-5">
            <div class="row text-center py-3">
                <div class="col-lg-6 m-auto">
                    <h1 class="h1">Special products</h1>
                    <p>Discounted products</p>
                </div>
            </div>
            <div class="row">
                ${featuredProducts.map(pro => {
                    // Find the corresponding photo for the product
                    const productPhotos = discountdata.photos.filter(photo => photo.product === pro.id && photo.banner);
                    const productImage = productPhotos.length > 0 ? productPhotos[0].picture : 'placeholder.jpg';

                    return `
                        <div class="col-md-4">
                            <div class="card mb-4 product-wap rounded-0">
                                <div class="card rounded-0">
                                    <img src="${productImage}" class="card-img-top product_picture" alt="${pro.product_name}"> 
                                    <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                        <button onclick="sendProductData(${pro.id})" class="btn btn-success text-white mt-2">Show Details</button>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <a href="shop-single.html" class="h3 text-decoration-none">${pro.product_name}</a>
                                    <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                                        <li class="pt-2">
                                            <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                            <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                            <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                            <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                            <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                        </li>
                                    </ul>
                                    ${pro.is_discount ? `
                                        <span class="text-danger">Special</span><br>
                                        <span style="text-decoration: line-through;" class="text-center mb-0">$${pro.price}</span><br>
                                        <span class="font-weight-bold text-center mb-0">$${pro.price_after_discount}</span>
                                    ` : `
                                        <p class="text-center mb-0">$${pro.price}</p>
                                    `}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="row">
                <div class="col text-center">
                    <button onclick="changePage_discount(-1)" class="btn btn-primary" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                    <span class="mx-2">Page ${currentPage} of ${totalPages}</span>
                    <button onclick="changePage_discount(1)" class="btn btn-primary" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        </div>
    `;

    productContainer.innerHTML = featuredSection;
}
    
function changePage_discount(direction) {
    const totalProducts = discountdata.product.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    console.log("hello")
    
    currentPage += direction;

    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    
    display_discount(discountdata);
}


const mostpdata = {};
async function sendMostPData() {

    await showSection('mostp');


    try {
        const response = await fetch('http://127.0.0.1:8000/api-v1/top_product/?limit=25');

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const photosResponse = await fetch(`http://127.0.0.1:8000/api-v1/galery/`);
        if (!photosResponse.ok) {
            throw new Error(`Photo fetch failed: ${photosResponse.statusText}`);
        }
        const photosData = await photosResponse.json();
        mostpdata.photos = photosData;

        const results = await response.json();
        mostpdata.product =results
        display_mostp(mostpdata);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

function display_mostp(mostpdata) {
    console.log('most_p');
    const productContainer = document.getElementById('most_p_con');
    productContainer.innerHTML = ''; 

    const totalProducts = mostpdata.product.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    // Determine the start and end indices for the current page
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, totalProducts);

    const featuredProducts = mostpdata.product.slice(startIndex, endIndex);

    const featuredSection = `
        <div class="container py-5">
            <div class="row text-center py-3">
                <div class="col-lg-6 m-auto">
                    <h1 class="h1">Featured Product</h1>
                    <p>Best selling products of the month</p>
                </div>
            </div>
            <div class="row">
                ${featuredProducts.map(pro => {
                    // Find the corresponding photo for the product
                    const productPhotos = mostpdata.photos.filter(photo => photo.product === pro.product_id && photo.banner);
                    const productImage = productPhotos.length > 0 ? productPhotos[0].picture : 'placeholder.jpg';

                    return `
                        <div class="col-md-4">
                            <div class="card mb-4 product-wap rounded-0">
                                <div class="card rounded-0">
                                    <img src="${productImage}" class="card-img-top product_picture" alt="${pro.product_name}"> 
                                    <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                        <button onclick="sendProductData(${pro.product_id})" class="btn btn-success text-white mt-2">Show Details</button>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <a href="shop-single.html" class="h3 text-decoration-none">${pro.product_name}</a>
                                    <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                                        <li class="pt-2">
                                            <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                            <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                            <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                            <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                            <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                        </li>
                                    </ul>
                                    ${pro.is_discount ? `
                                        <span class="text-danger">Special</span><br>
                                        <span style="text-decoration: line-through;" class="text-center mb-0">$${pro.price}</span><br>
                                        <span class="font-weight-bold text-center mb-0">$${pro.price_after_discount}</span>
                                    ` : `
                                        <p class="text-center mb-0">$${pro.price}</p>
                                    `}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="row">
                <div class="col text-center">
                    <button onclick="changePage_mostp(-1)" class="btn btn-primary" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                    <span class="mx-2">Page ${currentPage} of ${totalPages}</span>
                    <button onclick="changePage_mostp(1)" class="btn btn-primary" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        </div>
    `;

    productContainer.innerHTML = featuredSection;
}
    
function changePage_mostp(direction) {
    const totalProducts = mostpdata.product.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    console.log("hello")
    
    currentPage += direction;

    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    
    display_mostp(mostpdata);
}

const products_detailData = {};
async function performSearch() {

    await showSection('category_item');

    const query = document.getElementById('search-input').value;

    try {
        const response = await fetch(`http://127.0.0.1:8000/api-v1/search?q=${encodeURIComponent(query)}`);

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const photosResponse = await fetch(`http://127.0.0.1:8000/api-v1/galery/`);
        if (!photosResponse.ok) {
            throw new Error(`Photo fetch failed: ${photosResponse.statusText}`);
        }
        const photosData = await photosResponse.json();
        products_detailData .photos = photosData;

        const results = await response.json();
        products_detailData .product =results
        displayResults(products_detailData);
    } catch (error) {
        console.error('Error fetching search results:', error);
        const resultsDiv = document.getElementById('search-results');
        resultsDiv.innerHTML = '<p>An error occurred while fetching results. Please try again later.</p>';
    }
}


function displayResults(data) {
    console.log(data.product.length)
    // Display the results in the results container
    

    const subcategoryContainer = document.getElementById('product_container');
    subcategoryContainer.innerHTML = ''; // Clear existing content

    // Render subcategories
    const subcategorySection = document.createElement('section');


    // Render products
    const productSection = document.createElement('section');
    const totalProducts = data.product.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToRender = data.product.slice(startIndex, endIndex);
    productSection.classList.add('bg-light');
    
    productSection.innerHTML = `
        <div class="container py-5">
            <div class="row">
                ${productsToRender.map(product => `
                    <div class="col-md-4">
                        <div class="card mb-4 product-wap rounded-0">
                            <div class="card rounded-0">
                                ${data.photos.map(photo => `
                                    ${photo.product === product.id && photo.banner ? `
                                        <img src="${photo.picture.startsWith('http') ? photo.picture : '/static' + photo.picture}" class="card-img-top product_picture" alt="..."> 
                                    ` : ''}
                                `).join('')}
                                <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul class="list-unstyled">
                                            <button onclick="sendProductData(${product.id})"  class="btn btn-success text-white mt-2">Show Details</button>
                                        
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body">
                                <a href="shop-single.html" class="h3 text-decoration-none">${product.product_name}</a>
                                <p class="text-center mb-0">$${product.price}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="row">
                <div class="col-12 text-center">
                    <button onclick="changePage_search(-1)" class="btn btn-primary" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                    <span class="mx-2">Page ${currentPage} of ${totalPages}</span>
                    <button onclick="changePage_search(1)" class="btn btn-primary" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        </div>
    `;
    subcategoryContainer.appendChild(productSection);
}

function changePage_search(direction) {
    console.log(products_detailData)
    const totalProducts = products_detailData.product.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    currentPage += direction;

    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    
    displayResults(products_detailData);
}

function increaseQuantity() {
    event.preventDefault();
    // Get the current value
    const quantityElement = document.getElementById('var-value');
    let currentValue = parseInt(quantityElement.innerText);
    
    // Increment the value and update the display
    quantityElement.innerText = currentValue + 1;
}

// Function to decrease the quantity
function decreaseQuantity() {
    event.preventDefault();
    const quantityElement = document.getElementById('var-value');
    let currentValue = parseInt(quantityElement.innerText);
    
    
    if (currentValue > 1) {
        quantityElement.innerText = currentValue - 1;
    }
}

async function show_cart() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('No token found');
        return false; 
    }
    console.log(token);
    await showSection('cart');
    cart_detail_container.innerHTML = '';
    const apiBaseUrl = 'http://127.0.0.1:8000/api-v1/';
    const product_detailData = {};

    try {
        // Fetch cart data
        const cart_data_response = await fetch(`${apiBaseUrl}show_cart/`,{ 
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization' : `Bearer ${token}`, // Change here
                'Content-Type': 'application/json', 
            },
        });

        const cart_data = await cart_data_response.json(); 
        
        if (!Array.isArray(cart_data)) {
            throw new Error("Cart data is not in expected format");
        }

        for (const item of cart_data) {
            const productId = item.id;
            const quantity = item.quantity;
            const size = item.size;
            const color = item.color;
            
            product_detailData.size = size;
            product_detailData.color = color;

            // Fetch product details for each item
            const product_response = await fetch(`${apiBaseUrl}product_details/${productId}/`);
            if (!product_response.ok) {
                throw new Error(`Product fetch failed for ID ${productId}: ${product_response.statusText}`);
            }
            try {
                const productData = await product_response.json();
                product_detailData.product_details = productData;

                const product_key_value_Response = await fetch(`${apiBaseUrl}product_attribute_details/${productId}/`);
                if (!product_key_value_Response.ok) {
                    throw new Error(`Product fetch failed: ${product_key_value_Response.statusText}`);
                }
                const product_keyvalue_Data = await product_key_value_Response.json();
                console.log(product_keyvalue_Data);
                product_detailData.product_key_value = product_keyvalue_Data;

                const productAttributeResponse = await fetch(`${apiBaseUrl}product_diversity_details/${productId}/`);
                if (!productAttributeResponse.ok) {
                    throw new Error(`Product fetch failed: ${productAttributeResponse.statusText}`);
                }
                const productAttributeData = await productAttributeResponse.json();
                product_detailData.product_attribute = productAttributeData;

                const photosResponse = await fetch(`${apiBaseUrl}galery/`);
                if (!photosResponse.ok) {
                    throw new Error(`Photo fetch failed: ${photosResponse.statusText}`);
                }
                const photosData = await photosResponse.json();
                product_detailData.photos = photosData;

                // Call the function to render product data
                rendercart_detailData(product_detailData, quantity);
            } catch (error) {
                console.error(error);
            }
        }
        
        total_price();
    } catch (error) {
        console.error("Error:", error);
    }
}


async function rendercart_detailData(product_detailData,quantity) {
        const cartDetailContainer = document.getElementById('cart_detail_container');
        const productHTML = `
            <section class="bg-light">
                <div class="container pb-5">
                    <div class="row">
                        <div class="col-lg-5 mt-5">
                            <div class="card mb-3">
                            ${product_detailData.photos.map(photo => `
                                    ${photo.product === product_detailData.product_details[0].id && photo.banner ? `
                                <img class="card-img img-fluid" src="${photo.picture.startsWith('http') ? photo.picture : '/static' + photo.picture}" id="product-detail" style="width: 345px; height: auto;">
                                ` : ''}
                                `).join('')}
                            </div>
                               
                        </div>
                        <div class="col-lg-7 mt-5">
                            <div class="card">
                                <div class="card-body">
                                    <h1 class="h2">${product_detailData.product_details[0].product_name}</h1>
                                    <p class="h3 py-2">$${product_detailData.product_details[0].price}</p>
                                    <h6>Color:${product_detailData.color}</h6>
                                    <h6>Size:${product_detailData.size}</h6>
                                    
                                    
                                <ul class="list-inline pb-3">
                                        <li class="list-inline-item text-right">Quantity</li>
                                        <button type="button" class="list-inline-item no-box-button">
                                        <span class="btn btn-success" id="btn-minus" onclick="decreaseQuantity_cart(${product_detailData.product_details[0].id},${product_detailData.size},'${product_detailData.color}')">-</span>
                                        </button>
                                        <li class="list-inline-item">
                                            <span class="badge bg-secondary" id="var-value${product_detailData.product_details[0].id}">${quantity}</span>
                                        </li>
                                        <button type="button" class="list-inline-item no-box-button">
                                        <span class="btn btn-success" id="btn-plus" onclick="increaseQuantity_cart(${product_detailData.product_details[0].id},${product_detailData.size},'${product_detailData.color}')">+</span>
                                        </button>
                                        </ul>
                                        <div class="row pb-3">
                                            <div class="col d-grid">
                                                <button  class="btn btn-success btn-lg" name="submit" onclick = "sendProductData(${product_detailData.product_details[0].id})">show details</button>
                                            </div>
                                            <div class="col d-grid">
                                                <button  class="btn btn-success btn-lg" name="submit" onclick = "delete_from_cart(${product_detailData.product_details[0].id},${product_detailData.size},'${product_detailData.color}')">delete from cart</button>
                                            </div>
                                        </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    
        // Append the generated HTML to the container
        cartDetailContainer.insertAdjacentHTML('beforeend', productHTML);
    }



function increaseQuantity_cart(product_id,size,color) {
        const quantityElementId = `var-value${product_id}`;
        const quantityElement = document.getElementById(quantityElementId);
        let currentValue = parseInt(quantityElement.innerText);
        const apiUrl = 'http://127.0.0.1:8000/api-v1/add_to_cart/';
        const data = {"product_id":product_id,"quantity":1,"size":size,"color":color}
        console.log(JSON.stringify(data))
    
        fetch(apiUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            updateNumber()
            console.log('Success:', data);
            
        })
        .then(data => {
            // Update the quantity display
            quantityElement.innerText = currentValue + 1;

            // Call total_price after updating quantity
            total_price();
            
            console.log('Success:', data);
        })
        
    }
    
    // Function to decrease the quantity
    function decreaseQuantity_cart(product_id,size,color) {
        const quantityElementId = `var-value${product_id}`;
        const quantityElement = document.getElementById(quantityElementId);
        let currentValue = parseInt(quantityElement.innerText);
    
        if (currentValue > 1) {
            const apiUrl = 'http://127.0.0.1:8000/api-v1/remove_from_cart/';
            const data = { "product_id": product_id, "quantity": 1,"size":size,"color":color };
            console.log(JSON.stringify(data));
    
            fetch(apiUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Update the quantity display
                quantityElement.innerText = currentValue - 1;
    
                // Call total_price after updating quantity
                total_price();
                
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
    }
    

    function delete_from_cart(product_id, size, color) {
        console.log("Deleting from cart...");
        const apiUrl = 'http://127.0.0.1:8000/api-v1/delete_from_cart/';
        const data = { "product_id": product_id, "size": size, "color": color };
        console.log(JSON.stringify(data));
    
        fetch(apiUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            updateNumber(); // Assuming this function updates the number of items in the cart
            show_cart(); // Assuming this function refreshes the cart view
            total_price(); // Fetch and update the total price after deleting an item
        })
        .catch(error => {
            console.error('Error deleting from cart:', error);
            // Optionally, you can show an error message to the user here
        });
    }
    
async function total_price() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('No token found');
        return false; 
    }
        try {
            const total_price_response = await fetch('http://127.0.0.1:8000/api-v1/total_price/', {
                method: 'GET',
                credentials: 'include',
                    headers: {
                        'Authorization' : `Bearer ${token}`, 
                        'Content-Type': 'application/json', 
                    },
                });
    
            if (!total_price_response.ok) {
                throw new Error(`HTTP error! status: ${total_price_response.status}`);
            }
    
            const totalPriceData = await total_price_response.json();
            console.log(totalPriceData);
    
            const cartDetailContainers = document.querySelectorAll('.total_price');
            cartDetailContainers.forEach(container => {
                container.innerText = `Total Price: ${totalPriceData}$`; // Assuming the response contains the total price directly
                console.log(container.innerText); 
            });
        } catch (error) {
            console.error('Error fetching total price:', error);
            const cartDetailContainer = document.getElementById('total_price');
            if (cartDetailContainer) {
                cartDetailContainer.innerText = 'Error fetching total price'; // Display an error message
            }
        }
    }


async function createOrderForm() {
        
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('No token found');
            return false; 
        }
    
        try {
            const userResponse = await fetch('http://127.0.0.1:8000/api-v1/token_info/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token })
            });
    
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user info');
            }
    
            const userData = await userResponse.json();
            
            const userId = userData.user_id;
            
    
            // Fetch addresses from the first API
            const addressResponse = await fetch(`http://127.0.0.1:8000/api-v1/address_for_user/${userId}`,{ 
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization' : `Bearer ${token}`, 
                    'Content-Type': 'application/json', 
                },
            });
    
            if (!addressResponse.ok) {
                throw new Error('Failed to fetch addresses');
            }
            
            const addresses = await addressResponse.json();
    
            // Create form HTML
            const formHtml = `
                <h4>Completion of information</h4>
                <form id="orderForm1" onsubmit="sendorderdata(event)">
                    <input class="login_input" type="hidden" id="user" value =${userId}>
                    <label for="address">Address:</label>
                    <select class="login_input" id="address" name="address">
                        ${addresses.map(addr => `<option value="${addr.id}">${addr.postal_code}</option>`).join('')}
                    </select>
                    <br/>
    
                    <label for="recipient">Recipient:</label>
                    <input class="login_input" type="text" id="recipient" name="recipient" >
                    <br/>
    
                    <label for="giftCard">Gift Card:</label>
                    <input class="login_input" type="text" id="giftCard" name="giftCard">
                    <br/>
    
                    <button type="submit" class="login_button" >confirm</button>
                </form>
                <h4 class="total_price">total_price</h4>
                <h7 id="price_ir"></h7>
                <button class="header_button btn btn-success text-white mt-2" onclick = 'pay_ment()'>continue</button>
            `;
            
            // Insert the form into the div
            document.getElementById('create_order_form').innerHTML = formHtml;
            total_price();
        } catch (error) {
            console.error('Error:', error);
        }
    }

async function createOrderandshow() {
    showSection('create_order');
    createOrderForm();
    
}

async function sendorderdata(event) {
    event.preventDefault(); 
    const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('No token found');
            return false; 
        }

    const formData = {
        "address": document.getElementById("address").value,
        "user": document.getElementById('user').value,
        "receiver": document.getElementById('recipient').value,
        "gift_cart": document.getElementById('giftCard').value,
    }
    console.log(JSON.stringify(formData))

    fetch('http://127.0.0.1:8000/api-v1/create_order/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); 
    })
    .then(data => {
        updateNumber();
        total_price = data.total_price
        const cartDetailContainers = document.querySelectorAll('.total_price');
        cartDetailContainers.forEach(container => {
            // Update the innerText of the container
            container.innerText = `Total Price: ${total_price}$`;
            console.log(container.innerText); 
        });
        console.log('Success:', data); 
        alert('order created successful!'); 
    })
    .catch((error) => {
        console.error('Error:', error); 
        alert('Registration failed, please try again.'); 
    })
}
    