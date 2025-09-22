# Super Prompt: Build the TrackRay Driver Mobile App Experience

**Objective:** To build a complete, mobile-first web application for TrackRay drivers. This app will be their primary tool for managing deliveries, navigating, and communicating status updates. The interface must be optimized for mobile use, with large touch targets, clear information hierarchy, and high-contrast visuals for readability in various lighting conditions. While it's a web app, it should feel like a native application.

---

### **1. Driver Dashboard & Assigned Orders**

The main screen after login. It should immediately present the driver with their list of assigned orders.

*   **UI:** Use a list or card-based layout.
*   **Order Sorting:** Orders must be sorted logically:
    1.  The single **"Moving"** order (if one exists) should always be at the top, highlighted.
    2.  All **"Pending"** orders below it.
*   **Order Card Information:** Each card in the list should display essential, at-a-glance information:
    *   Order ID (e.g., "ORD-101").
    *   Destination (e.g., "Tema Community 1").
    *   A prominent status badge (`Moving`, `Pending`).
    *   **Urgency Indicator.**

---

### **2. Order Urgency Indicator**

To meet the 48-hour delivery promise, drivers need a visual cue for urgency.

*   **Functionality:**
    *   Calculate the time elapsed since the order was created.
    *   Display a color-coded indicator on the order card based on the elapsed time:
        *   **Green (0-24 hours):** "On Schedule"
        *   **Amber (24-36 hours):** "Approaching Deadline"
        *   **Red (36-48 hours):** "High Priority"
        *   **Flashing Red (>48 hours):** "Overdue"
    *   Show the remaining time in a human-readable format (e.g., "22 hours left").

---

### **3. Order Details View**

Tapping on an order card should navigate to a detailed view of that specific order. This screen must be comprehensive.

*   **A. Recipient & Location Details:**
    *   **Recipient Name:** Clearly display the name (e.g., "Melcome Shop" or "Ama Badu").
    *   **Drop-off Point (Destination):**
        *   Show the full address.
        *   Use the Google Maps Geocoding API to get the specific, verified name of the location (e.g., "MaxMart at 37") to avoid confusion.
    *   **Interactive Map:** Display a small map preview showing the destination pin. Tapping it should open a larger map view for navigation.

*   **B. Order & Payment Status:**
    *   **Payment Status:** A clear badge indicating **"Prepaid"** (in green) or **"Pay on Credit"** (in amber).
    *   **Total Order Value:** Display the total value of the goods being transported.
    *   **Order Invoice:** A button to "View Invoice" (This will just show a placeholder, as it's sent from management).

*   **C. Product Details:**
    *   A list of all products in the delivery. Each item should show:
        *   `Item Name` (e.g., "Royal Aroma Rice")
        *   `Quantity` (e.g., "50 Bags")
        *   `Specifics` (e.g., "Grade: A, Size: 25kg")
        *   `Unit Price` and `Total Price` for that item.

---

### **4. SOS Alert System**

A persistent, easily accessible SOS button should be available on all screens.

*   **UI:** A floating action button (FAB) or a prominent button in the header/footer.
*   **Functionality:**
    *   Tapping the button opens a dialog with predefined issue categories (e.g., "Mechanical Fault," "Heavy Traffic," "Medical Emergency").
    *   Selecting an issue immediately sends an alert to the admin dashboard with the driver's ID, issue type, and current GPS location.

---

### **5. Delivery Actions**

On the Order Details screen, the driver must be able to update the order status.

*   If status is **`Pending`**: A large "Start Delivery" button should be visible. Tapping it changes the status to `Moving`.
*   If status is **`Moving`**: Two buttons should be visible:
    1.  **"Mark as Delivered":** Opens a confirmation step (e.g., signature capture, photo proof).
    2.  **"Initiate Return":** Opens a dialog to select the reason for the return.
*   Once an order is completed or returned, it should disappear from the active list and move to an "Order History" section.
