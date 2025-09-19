
# Super Prompt: Build the TrackRay Customer E-commerce Portal

**Objective:** To build a complete, self-service e-commerce portal for TrackRay customers (named "Thonket"). This portal will allow both individual and business customers to browse products, create orders, manage their accounts, and track their deliveries. The portal must maintain the existing TrackRay branding, color scheme, fonts, and overall UI style, using Next.js and ShadCN components.

---

### **1. User Authentication & Onboarding**

Create a new set of pages for customer authentication.

**A. Login Page (`/customer/login`):**
*   A simple login form with fields for "Phone Number" and "Password".
*   A link below the form: "Don't have an account? **Sign Up**" which navigates to the registration page.

**B. Registration Page (`/customer/register`):**
*   This page should have a user type selector at the top.
    *   **User Type:** A `RadioGroup` with two options: "**Individual**" and "**Business**". The form fields below should change dynamically based on this selection.

*   **If "Individual" is selected:**
    *   `fullName`: Text input for the user's full name.
    *   `phoneNumber`: Input for a single phone number.
    *   `password`: Password input field.
    *   `shopLocation`: A section with a "Use My Current Location" button. Clicking this should use the browser's Geolocation API to fetch the user's current `lat` and `lng` and display the address (or coordinates) on the screen. There should also be a small map preview showing the marked location.

*   **If "Business" is selected:**
    *   `businessName`: Text input for the business name.
    *   `businessOwnerName`: Text input for the owner's name.
    *   `phoneNumbers`: An interface to add one or more phone numbers.
    *   `password`: Password input field.
    *   `shopLocation`: Same GPS location functionality as the individual form.

*   **Submit Button:** A "Create Account" button to submit the form.

---

### **2. Customer Dashboard Layout**

Once authenticated, the user should be redirected to `/customer/dashboard`. Create a new layout for the customer portal that includes a sidebar for navigation.

*   **Sidebar Navigation:** The sidebar should contain the following links:
    1.  **Browse & Order** (`/customer/dashboard` or `/customer/shop`): The main landing page.
    2.  **My Cart** (`/customer/cart`): Shows items added to the current order.
    3.  **My Orders** (`/customer/orders`): History of past and active orders.
    4.  **My Profile** (`/customer/profile`): To view and edit account details.
    5.  **Customer Service** (`/customer/support`): A page with contact info or a support form.

---

### **3. Core Features & Pages**

**A. Browse Shop & Create Order Page (`/customer/dashboard`):**
*   **UI:** Display products in a grid layout using `Card` components.
*   **Product Data:** The products should be popular Ghanaian food items (e.g., Nestlé Milo, Cowbell Milk, various brands of rice, Frytol Cooking Oil, Gino Tomato Mix, etc.). Each product needs a `name`, `unitPrice`, and an image.
*   **Functionality:**
    *   Each product card should have an "Add to Cart" button and a quantity selector (`Input` with + and - buttons).
    *   When a user adds an item, it should be added to a "cart" state. A badge on the "My Cart" navigation link in the sidebar should update with the number of items in the cart.

**B. My Cart Page (`/customer/cart`):**
*   **UI:** Display a table or list of all items the user has added to their cart.
*   **Fields to Display:** Item Name, Quantity, Unit Price, Total Price (`quantity * unitPrice`).
*   **Functionality:**
    *   Allow users to edit the quantity of each item or remove it from the cart.
    *   Display a "Subtotal" of all items.
    *   **Discount Logic:** If the customer is a frequent buyer (for demo purposes, assume any Business customer gets a 10% discount), show a "Loyalty Discount" line item and subtract it from the subtotal.
    *   Display the final "Total Amount".

*   **Order Placement Section:** Below the cart summary, include the following fields:
    1.  **Drop-off Point:** Default to the user's saved `shopLocation`, but allow them to "Select a Different Location" using a map interface.
    2.  **Schedule Delivery:** Use a `Calendar` component (`react-day-picker`) to allow the user to select a desired delivery date.
    3.  **Payment Preference:** A `RadioGroup` for payment options.
        *   **Important:** If the user is an **Individual**, this should ONLY show "Prepaid".
        *   If the user is a **Business**, it should show both "Prepaid" and "Pay On Credit".
    4.  A "**Place Order**" button. Clicking this should "create" the order and redirect the user to the "My Orders" page.

**C. My Orders Page (`/customer/orders`):**
*   **UI:** Use a `Table` to display a list of the customer's past and present orders.
*   **Tabs:** Use `Tabs` to separate "Active Deliveries" from "Order History".
*   **Information to Display:** Order ID, Date Placed, Scheduled Delivery Date, Total Amount, and Status (`Pending Assignment`, `Out for Delivery`, `Delivered`).
*   Each active order should have a "Track on Map" button.

**D. User Profile Page (`/customer/profile`):**
*   Display the user's information (Name, Business Name, Phone, Location).
*   Include an "Edit" button to allow them to update their details.
