# Super Prompt: Build the TrackRay Driver App Frontend with Expo

**Objective:** To build a complete, production-quality, **frontend-only** mobile application for TrackRay drivers using **Expo** and **React Native**. This app will serve as the driver's primary tool for managing deliveries. The backend will be integrated later, so all data must be mocked.

**Guiding Principles:**
*   **Mobile-First & Native:** The UI must be optimized for mobile devices with large touch targets, high contrast for readability, and a native feel. Use core React Native components.
*   **Component-Based:** Create reusable components for elements like order cards, status badges, and detail items.
*   **TypeScript:** The entire application must be written in TypeScript.
*   **Stateless & Mocked:** The app should be stateless and rely entirely on mock data provided within this prompt. No actual API calls should be made.

---

### **1. Project Setup & Core Libraries**

*   **Framework:** Expo (latest SDK).
*   **Language:** TypeScript.
*   **Navigation:** Use **React Navigation** to set up the app's routing structure.
*   **Styling:** Use React Native's `StyleSheet.create()` for all styling. Do not use CSS-in-JS libraries. Adhere to the TrackRay color scheme.

---

### **2. Mock Data & Types**

Create a file `src/lib/mock-data.ts` to store all mock data and types.

*   **`Order` Type:** Define a comprehensive `Order` type that includes all necessary fields: `id`, `status` ('Pending', 'Moving', 'Delivered', 'Returning'), `recipientName`, `destination` (with `address` string and `coords` object), `items` (an array of products), `createdAt` (ISO string), `paymentType` ('Prepaid', 'Pay on Credit'), etc.
*   **Mock Orders:** Create an array of at least 5-6 mock `Order` objects. Ensure there is:
    *   One order with status `'Moving'`.
    *   Multiple orders with status `'Pending'`.
    *   At least one completed order (`'Delivered'`) and one returned order (`'Returning'`) for the history screen.
    *   Vary the `createdAt` timestamps to test the urgency indicators.

---

### **3. App Navigation Structure**

Set up the navigation using **React Navigation**.

1.  **Auth Flow (Stack Navigator):**
    *   **Login Screen:** The initial screen of the app. On successful login, navigate to the `MainApp` flow and replace the history so the user can't go back.

2.  **Main App Flow (Bottom Tab Navigator):**
    *   This is the main interface after login. It should contain two tabs:
        *   **"Deliveries" Tab:** The primary screen showing active orders. Icon: `List`.
        *   **"History" Tab:** Shows completed and returned orders. Icon: `History`.

3.  **Deliveries Stack Navigator:**
    *   The "Deliveries" tab should itself be a Stack Navigator containing:
        *   **`ActiveDeliveriesScreen`:** The list of pending and moving orders.
        *   **`OrderDetailsScreen`:** The detailed view of a single order.
        *   **`ConfirmationPhotoScreen`:** A screen for taking photo proof of delivery.

---

### **4. Screen Implementation**

**A. Login Screen (`/screens/LoginScreen.tsx`)**
*   **UI:**
    *   "TrackRay Driver" title.
    *   Input field for "Driver ID".
    *   Input field for "Password".
    *   A large "Sign In" button.
*   **Functionality:**
    *   On press of "Sign In", navigate to the main `MainApp` tab navigator. (No actual authentication logic needed).

**B. Active Deliveries Screen (`/screens/ActiveDeliveriesScreen.tsx`)**
This is the default screen in the "Deliveries" tab.
*   **UI:**
    *   Use a `FlatList` to display the active orders (`'Pending'` or `'Moving'`).
    *   The single `'Moving'` order must always be displayed at the top, highlighted.
    *   All `'Pending'` orders are listed below it, sorted by `createdAt` (oldest first).
*   **Order Card Component (`/components/OrderCard.tsx`):**
    *   **Urgency Indicator:** The card should have a colored left border to indicate urgency based on `createdAt`:
        *   **Green (0-24 hours):** On Schedule
        *   **Amber (24-36 hours):** Approaching Deadline
        *   **Red (>36 hours):** High Priority / Overdue
    *   **Content:** Display `Order ID`, `Destination Address`, `Status Badge`, and remaining time (e.g., "18 hours left").
    *   **Locked State:** If there is an active `'Moving'` order, all `'Pending'` orders should be visually "locked" (e.g., reduced opacity and a lock icon) and not pressable. This is a critical UX feature.
*   **Functionality:**
    *   Tapping an (unlocked) order card navigates to the `OrderDetailsScreen`, passing the `orderId`.

**C. Order Details Screen (`/screens/OrderDetailsScreen.tsx`)**
*   **UI:**
    *   Display all order details fetched using the `orderId` from navigation params.
    *   **Recipient Info:** Show recipient name and phone number.
    *   **Destination:** Show the full destination address and a map preview.
        *   **Map Preview:** Use **`react-native-maps`** to show a non-interactive map with a marker at the destination `coords`.
    *   **Payment Info:** Clearly show payment type (`Prepaid` or `Pay on Credit`) and the total order value. If `Pay on Credit`, display the amount to be collected.
    *   **Items List:** A list of all products in the delivery, with quantity and name.
*   **Action Buttons:**
    *   If status is `'Pending'`, show a large "Start Delivery" button.
    *   If status is `'Moving'`, show two buttons: "Mark as Delivered" and "Initiate Return".
*   **Native Feature: Live Map for `Moving` orders:**
    *   If the order status is `'Moving'`, display a live-tracking map.
    *   Use the **`expo-location`** library to get the user's current GPS location.
    *   Use `react-native-maps` to display the driver's location and the destination, with a polyline drawn between them showing the route.

**D. Delivery Confirmation (Part of OrderDetailsScreen flow)**
*   **Functionality:**
    *   When "Mark as Delivered" is pressed, simulate a success state. If the order requires photo confirmation, first navigate to the `ConfirmationPhotoScreen`. Otherwise, just navigate back.
*   **Photo Confirmation Screen (`/screens/ConfirmationPhotoScreen.tsx`):**
    *   This screen should be pushed onto the stack.
    *   Use the **`expo-camera`** library to show a full-screen camera view.
    *   Provide a button to take a picture.
    *   After taking the picture, show a preview of the image with two buttons: "**Confirm**" and "**Retake**".
    *   On "Confirm", navigate back to the details screen, which should then show a "Completed" message before popping back to the list. On "Retake", the camera view should be shown again.

**E. Order History Screen (`/screens/OrderHistoryScreen.tsx`)**
*   **UI:**
    *   This screen is in the "History" tab.
    *   Use a `FlatList` to display all orders with status `'Delivered'`, `'Returning'`, or `'Cancelled'`.
    *   Sort the list by `completedAt` timestamp (most recent first).
    *   Each row should show `Order ID`, `Destination`, final `Status`, and the date of completion.
*   **Functionality:**
    *   Tapping an item can navigate to the `OrderDetailsScreen` to view the details of the past order (in a read-only state). Action buttons should be hidden.