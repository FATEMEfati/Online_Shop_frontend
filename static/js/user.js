async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  console.log(username, password);

  const url = "http://194.5.193.46:8000/api-v1/login";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (response.ok) {
      const data = await response.json(); // Move this line here

      document.getElementById("message").innerText = "Successfully logged in!";
      const token = data.access; // Get the token after parsing data

      // Store the token in local storage
      localStorage.setItem("jwtToken", token);

      // Fetch user info using the token
      const user_name_response = await fetch(
        "http://194.5.193.46:8000/api-v1/token_info/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        }
      );

      if (user_name_response.ok) {
        const user_data = await user_name_response.json();
        const user_login = user_data.username;
        document.getElementById("userLogin").textContent = user_login;
      }

      // Redirect to the admin panel if `admin_url` is available
      if (data.admin_url) {
        const adminUrlWithToken = new URL(data.admin_url);
        adminUrlWithToken.searchParams.append("token", token);
        window.location.href = adminUrlWithToken; // Redirect to the admin panel
      }

      displayAuthState(); // Call this function if needed
    } else {
      document.getElementById("message").innerText =
        "Error: " + response.statusText + " " + "Invalid username or password";
    }
  } catch (error) {
    document.getElementById("message").innerText =
      "An error occurred: " + error.message;
  }
}

async function isLoggedIn() {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      "http://194.5.193.46:8000/api-v1/token_info/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    console.log(data.expiration);
    // Assuming the API response contains a field 'isValid' and 'isExpired'
    if (data.expiration) {
      return true;
    } else {
      return false; // Token is either invalid or expired
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return false; // Return false if there is an error with the API call
  }
}

async function displayAuthState() {
  const loggedIn = await isLoggedIn(); // Await the result
  if (loggedIn) {
    document.getElementById("userPanel").style.display = "block";
    document.getElementById("authPanel").style.display = "none";
  } else {
    document.getElementById("userPanel").style.display = "none";
    document.getElementById("authPanel").style.display = "block";
  }
  console.log(loggedIn); // Log the actual boolean value
}

function logout() {
  localStorage.removeItem("jwtToken");
  displayAuthState();
}

window.onload = function () {
  displayAuthState();
};

function register(event) {
  event.preventDefault();

  const formData = {
    first_name: document.getElementById("first_name_r").value,
    last_name: document.getElementById("last_name_r").value,
    gender: document.getElementById("gender_r").value,
    phone_number: document.getElementById("phone_number_r").value,
    email: document.getElementById("email_r").value,
    date_of_birth: document.getElementById("date_of_birth_r").value,
    username: document.getElementById("username_register").value,
    password: document.getElementById("password_register").value,
    confirmPassword: document.getElementById("confirmPassword").value,
  };

  console.log(JSON.stringify(formData));
  const password = document.getElementById("password_register").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  fetch("http://194.5.193.46:8000/api-v1/register_users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          // Extract the error message from the response
          throw new Error(err.message || "An error occurred");
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      alert("Registration successful!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message);
    });
}

async function handleotp(event) {
  event.preventDefault();

  const email = document.getElementById("email_user").value;

  console.log(email);

  const url = "http://194.5.193.46:8000/api-v1/generate-code/";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    if (response.ok) {
      await showSection("send_code");
      alert("The code has been successfully sent to your email address");
      const data = await response.json();
      const token = data.access;

      document.getElementById("user_email").value = email;
    }
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

async function send_code(event) {
  event.preventDefault(); // Prevent form submission

  const email = document.getElementById("user_email").value;
  const code = document.getElementById("code").value;

  const url = "http://194.5.193.46:8000/api-v1/validate-code/";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, code: code }),
    });

    if (response.ok) {
      await showSection("send_code");
      alert("You have successfully logged in");
      const data = await response.json();
      const token = data.access;

      const user_name = await fetch(
        "http://194.5.193.46:8000/api-v1/token_info/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        }
      );
      if (user_name.ok) {
        const user_data = await user_name.json();
        const user_login = user_data.username;
        console.log(user_login);
        document.getElementById("userLogin").textContent = user_login;
      }
      localStorage.setItem("jwtToken", token);
      displayAuthState();
    } else {
      alert("Invalid or expired code");
    }
  } catch (error) {
    document.getElementById("message").innerText =
      "An error occurred: " + error.message;
  }
}

async function user_info() {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.error("No token found");
    return false;
  }

  try {
    const userResponse = await fetch(
      "http://194.5.193.46:8000/api-v1/token_info/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      }
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userData = await userResponse.json();
    const userId = userData.user_id;

    const user_info_response = await fetch(
      `http://194.5.193.46:8000/api-v1/user_info/${userId}`,
      {
        method: "GET", // Assuming you use PUT or PATCH for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (!user_info_response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfoData = await user_info_response.json();
    console.log(userInfoData[0].email);

    // Create a form
    createForm(userInfoData);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function createForm(userInfoData) {
  const form_info = `
    <form id="form_info">
        <label for="username">Username:</label>
        <input type="text" id="username" class="login_input" name="username" value="${
          userInfoData[0].username || ""
        }" required><br>

        <label for="first_name">First Name:</label>
        <input type="text" class="login_input" id="first_name" name="first_name" value="${
          userInfoData[0].first_name || ""
        }" required><br>

        <label for="last_name">Last Name:</label>
        <input type="text" class="login_input" id="last_name" name="last_name" value="${
          userInfoData[0].last_name || ""
        }" required><br>

        <label for="gender">Gender:</label>
        <select id="gender" class="login_input" name="gender" required>
            <option value="" disabled ${
              !userInfoData[0].gender ? "selected" : ""
            }>Select Gender</option>
            <option value="m" ${
              userInfoData[0].gender === "male" ? "selected" : ""
            }>Male</option>
            <option value="f" ${
              userInfoData[0].gender === "female" ? "selected" : ""
            }>Female</option>
            <option value="u" ${
              userInfoData[0].gender === "uncertain" ? "selected" : ""
            }>uncertain</option>
        </select><br>

        <label for="date_of_birth">Date of Birth:</label>
        <input type="date" class="login_input" id="date_of_birth" name="date_of_birth" value="${
          userInfoData[0].date_of_birth || ""
        }" required><br>

        <label for="email">Email:</label>
        <input type="email" class="login_input" id="email" name="email" value="${
          userInfoData[0].email || ""
        }" required><br>

        <label for="mobile_number">Mobile Number:</label>
        <input type="tel" class="login_input" id="mobile_number" name="mobile_number" value="${
          userInfoData[0].phone_number || ""
        }" required><br>

        <button type="submit" class="login_button">Submit</button>
    </form>
    <h6>point:${userInfoData[0].point}</h6>
    <button  class="login_button" onclick="user_change_password(${
      userInfoData[0].id
    })">change your password</button>
    `;

  document.getElementById("create_user_info_form").innerHTML = form_info;

  // Add event listener to the form
  const form = document.getElementById("form_info");
  form.onsubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = {
      username: form.username.value,
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      gender: form.gender.value,
      date_of_birth: form.date_of_birth.value,
      email: form.email.value,
      phone_number: form.mobile_number.value,
    };

    await submit_user_info(formData, userInfoData[0].id); // Pass user ID here
  };
}

async function submit_user_info(formData, userId) {
  console.log(JSON.stringify(formData));
  try {
    const updateResponse = await fetch(
      `http://194.5.193.46:8000/api-v1/update_user_info/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json(); // Get the error message from the response
      throw new Error(errorData.message || "Failed to update user info"); // Use the message from the backend if available
    }

    const updateData = await updateResponse.json();
    console.log("User info updated successfully:", updateData);
    alert("User info updated successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

async function user_info_show() {
  showSection("user_info");
  user_info();
}
async function user_change_password(user_id) {
  console.log("i am here");
  showSection("change_password");
  const pass_info = `
                    <form id="userForm_pass" onsubmit="change_pass_backend(event)">
                        
                        <input type="hidden" id="user_id" class="login_input" name="user_id" value="${user_id}" required><br><br>
                        <label for="password">Password:</label>
                        <input type="password" id="password_update" class="login_input" name="password" required><br><br>
                        <label for="confirmPassword">confirmPassword:</label>
                        <input type="password" id="confirmPasswordUpdate" class="login_input" name="confirmPassword" required><br><br>
                        <button type="submit" class="login_button">Submit</button>
                    </form>
                `;

  document.getElementById("create_user_pass_form").innerHTML = pass_info;
}

async function change_pass_backend(event) {
  event.preventDefault();

  const formData = {
    password: document.getElementById("password_update").value,
    confirmPassword: document.getElementById("confirmPasswordUpdate").value,
  };
  const user_id = document.getElementById("user_id").value;
  console.log(JSON.stringify(formData));
  const password = document.getElementById("password_update").value;
  const confirmPassword = document.getElementById(
    "confirmPasswordUpdate"
  ).value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  console.log(JSON.stringify(formData));
  fetch(`http://194.5.193.46:8000/api-v1/update_user_pass/${user_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      alert("update successful!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("update failed, please try again.");
    });
}

async function addresses_show() {
  showSection("addresses");
  await show_address();
}

async function show_orders() {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.error("No token found");
    return false;
  }

  try {
    const userId = await fetchUserId(token);
    if (!userId) return;

    // Clear previous order details
    order_detail_container.innerHTML = "";
    const orderDataResponse = await fetch(
      `http://194.5.193.46:8000/api-v1/orders/${userId}`,
      {
        method: "GET", // Assuming you use PUT or PATCH for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (!orderDataResponse.ok) {
      throw new Error(`Order fetch failed: ${orderDataResponse.statusText}`);
    }

    const orderData = await orderDataResponse.json();

    if (!Array.isArray(orderData)) {
      throw new Error("Order data is not in expected format");
    }

    // Render each order
    for (const item of orderData) {
      await renderOrderDetailData(item);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function renderOrderDetailData(item) {
  const orderDetailContainer = document.getElementById(
    "order_detail_container"
  );

  // Determine the send status description
  let sendStatusDescription;
  switch (item.send_status) {
    case "p":
      sendStatusDescription = "Processing";
      break;
    case "c":
      sendStatusDescription = "Canceled";
      break;
    case "l":
      sendStatusDescription = "Leaving the warehouse";
      break;
    default:
      sendStatusDescription = "Unknown status";
  }

  // Determine if the payment button should be displayed
  let paymentButtonHTML = "";
  if (item.pay_status === "progressing") {
    paymentButtonHTML = `<button class="login_button" onclick="pay_order(${JSON.stringify(
      item
    )})">Pay</button>`;
  }

  const orderHTML = `
        <div>
            <h4>Total Price: ${item.total_price}</h4>
            <h6>Created At: ${item.created_at}</h6>
            <h6>Pay Status: ${item.pay_status}</h6>
            <h6>Send Status: ${sendStatusDescription}</h6>
            ${paymentButtonHTML}
            <button class="login_button" onclick="delete_order(${item.id})">Cancel</button>
            <button class="login_button" onclick="orderItems(${item.id})">Detail</button>
        </div>
    `;

  // Append the generated HTML to the container
  orderDetailContainer.insertAdjacentHTML("beforeend", orderHTML);
}

async function orderItems(item) {
  showSection("order-item");
  try {
    orderitem_detail_container.innerHTML = "";
    const orderDataResponse = await fetch(
      `http://194.5.193.46:8000/api-v1/orderItem/${item}`,
      {
        method: "GET", // Assuming you use PUT or PATCH for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (!orderDataResponse.ok) {
      throw new Error(`Order fetch failed: ${orderDataResponse.statusText}`);
    }

    const orderData = await orderDataResponse.json();

    if (!Array.isArray(orderData)) {
      throw new Error("Order data is not in expected format");
    }

    for (const item of orderData) {
      await renderOrderItemDetailData(item);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function renderOrderItemDetailData(item) {
  const orderDetailContainer = document.getElementById(
    "orderitem_detail_container"
  );

  const orderitemHTML = `
        <div>
            <h6>Price: ${item.price_at_order}</h6>
            <h6>quantity: ${item.quantity}</h6>
            <button class="login_button" onclick="sendProductData(${item.item})">Detail</button>
        </div>
    `;

  // Append the generated HTML to the container
  orderDetailContainer.insertAdjacentHTML("beforeend", orderitemHTML);
}

async function pay_order(item) {
  showSection("change_address");
  const addressInfo = createAddressForm(item);
  document.getElementById("create_update_address_form").innerHTML = addressInfo;

  // Add event listener to the form
  const form = document.getElementById("address_info");
  form.onsubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = gatherFormData(form, item);
    await submit_address_info(formData, item.id); // Pass user ID here
  };
}

async function delete_order(item) {
  try {
    const updateResponse = await fetch(
      `http://194.5.193.46:8000/api-v1/delete_order/${item}`,
      {
        method: "GET", // Assuming you use PUT or PATCH for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Failed to delete order");
    }

    console.log("Order deleted successfully:");
    alert("Order deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting the order.");
  }
}

async function show_address() {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.error("No token found");
    return false;
  }

  try {
    const userId = await fetchUserId(token);
    if (!userId) return;

    address_detail_container.innerHTML = `<button class="login_button" onclick="showSection('add_address')">Add New Address</button>`;
    const addressDataResponse = await fetch(
      `http://194.5.193.46:8000/api-v1/address_for_user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (!addressDataResponse.ok) {
      throw new Error(
        `Address fetch failed: ${addressDataResponse.statusText}`
      );
    }

    const addressData = await addressDataResponse.json();

    if (!Array.isArray(addressData)) {
      throw new Error("Address data is not in expected format");
    }

    // Render each address
    for (const item of addressData) {
      await renderAddressDetailData(item);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function renderAddressDetailData(item) {
  const addressDetailContainer = document.getElementById(
    "address_detail_container"
  );

  // Escape the item object to safely use it in an onclick attribute
  const itemString = JSON.stringify(item)
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");

  const addressHTML = `
        <div>
            <h4>city: ${item.city}</h4>
            <h6>street name: ${item.street_name}</h6>
            <h6>postal code: ${item.postal_code}</h6>
            <h6>description: ${item.description}</h6>
            <button class="login_button" onclick='change_address(${itemString})'>change</button>
            <button class="login_button" onclick="delete_address(${itemString})">delete</button>
        </div>
    `;

  // Append the generated HTML to the container
  addressDetailContainer.insertAdjacentHTML("beforeend", addressHTML);
}

async function change_address(item) {
  showSection("change_address");
  const addressInfo = createAddressForm(item);
  document.getElementById("create_update_address_form").innerHTML = addressInfo;

  // Add event listener to the form
  const form = document.getElementById("address_info");
  form.onsubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = gatherFormData(form, item);
    await submit_address_info(formData, item.id);
  };
}

async function submit_address_info(formData, addressId) {
  try {
    const updateResponse = await fetch(
      `http://194.5.193.46:8000/api-v1/address_for_user/${formData.user}`,
      {
        method: "PUT", // Assuming you use PUT or PATCH for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(formData),
      }
    );

    // Check the response status
    if (!updateResponse.ok) {
      // Parse the error response and throw it
      const errorData = await updateResponse.json();
      throw new Error(errorData.message || "Failed to update address info");
    }

    const updateData = await updateResponse.json();
    console.log("Address info updated successfully:", updateData);
    alert("Address info updated successfully!");
  } catch (error) {
    console.error(error);
    alert(`An error occurred while updating address info: ${error.message}`);
  }
}

async function fetchUserId(token) {
  try {
    const userResponse = await fetch(
      "http://194.5.193.46:8000/api-v1/token_info/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      }
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userData = await userResponse.json();
    return userData.user_id;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function createAddressForm(item) {
  return `
    <form id="address_info">
        <label for="city">City:</label>
        <input type="text" id="city" class="login_input" name="city" value="${
          item.city || ""
        }" required><br>
        <label for="street_name">Street Name:</label>
        <input type="text" class="login_input" id="street_name" name="street_name" value="${
          item.street_name || ""
        }" required><br>
        <label for="postal_code">Postal Code:</label>
        <input type="text" class="login_input" id="postal_code" name="postal_code" value="${
          item.postal_code || ""
        }" required><br>
        <label for="description">Description:</label>
        <input type="text" class="login_input" id="description" name="description" value="${
          item.description || ""
        }" required><br>
        <button type="submit" class="login_button">Submit</button>
    </form>
    `;
}

function gatherFormData(form, item) {
  return {
    id: item.id,
    is_delete: false,
    deleted_at: null,
    created_at: item.created_at,
    updated_at: item.updated_at,
    city: form.city.value,
    street_name: form.street_name.value,
    postal_code: form.postal_code.value,
    description: form.description.value,
    user: item.user,
  };
}

async function add_address_sub(event) {
  event.preventDefault();

  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.error("No token found");
    return false;
  }

  try {
    const userId = await fetchUserId(token);
    if (!userId) return;

    const formData = {
      city: document.getElementById("city").value,
      street_name: document.getElementById("street_name").value,
      postal_code: document.getElementById("postal_code").value,
      description: document.getElementById("description").value,
      user: userId,
    };

    const addressResponse = await fetch(
      "http://194.5.193.46:8000/api-v1/create_address_for_user/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token if needed
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await addressResponse.json(); // Parse response once

    if (!addressResponse.ok) {
      // If response is not OK, show the message received from the backend
      const errorMessage = data.message || "An unknown error occurred";
      console.error("Error:", errorMessage);
      alert(`Operation failed: ${errorMessage}`);
      return; // Exit the function
    }

    // If successful, handle success response
    console.log("Success:", data);
    alert("Address added successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert("Operation failed, please try again.");
  }
}

async function delete_address(item) {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.error("No token found");
    return false;
  }
  const formData = {
    id: item.id,
    is_delete: true,
    deleted_at: item.deleted_at,
    created_at: item.created_at,
    updated_at: item.updated_at,
    city: item.city,
    street_name: item.street_name,
    postal_code: item.postal_code,
    description: item.description,
    user: item.user,
  };

  try {
    const updateResponse = await fetch(
      `http://194.5.193.46:8000/api-v1/address_for_user/${item.user}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Failed to delete address");
    }

    const updateData = await updateResponse.json();
    console.log("Address deleted successfully:", updateData);
    alert("Address deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting the address.");
  }
}

async function orders_show() {
  showSection("orders");
  await show_orders();
}
