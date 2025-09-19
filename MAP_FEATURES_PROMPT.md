# Super Prompt: Implement Advanced Map Features for Thonket Customer Portal

**Objective:** To create two key map-based features for the Thonket customer portal using `@vis.gl/react-google-maps`. These features are critical for a modern e-commerce experience and must be intuitive and reliable.

---

### **1. Drop-off Location Selector with Geocoding**

This feature will be used in two places:
1.  During user registration (`/customer/register`) to set the default shop/home location.
2.  On the "My Cart" page (`/customer/cart`) to allow users to select a one-time delivery location.

**A. Component & UI:**
*   Create a reusable component, perhaps named `LocationPickerMap`.
*   The UI should consist of:
    *   A main map view that fills the component's container.
    *   A search bar at the top of the map (`Input` component with a `Search` icon).
    *   A draggable marker on the map, which is placed at the center by default.
    *   A "Confirm Location" button below the map.
    *   A text area or card that displays the human-readable address of the marker's current position.

**B. Functionality:**
*   **Search & Geocoding:**
    *   When a user types an address into the search bar, use the Google Maps Geocoding API to provide autocomplete suggestions.
    *   When an address is selected from the suggestions (or a search is submitted), the map should pan and zoom to that location, and the marker should move there.
*   **Reverse Geocoding:**
    *   When the user drags the marker on the map, its `lat` and `lng` coordinates should be captured.
    *   Use the Geocoding API (in reverse) to convert these coordinates back into a human-readable address.
    *   This address should be displayed live in the text area below the map, so the user gets immediate feedback.
*   **Current Location:**
    *   Include a "Use My Current Location" button (perhaps with a `LocateFixed` icon).
    *   Clicking this should use the browser's `navigator.geolocation.getCurrentPosition()` API to get the user's current coordinates.
    *   The map should then center on this location, place the marker there, and perform a reverse geocode to show the address.
*   **State Management:**
    *   The component should manage its internal state (marker position, current address text).
    *   When "Confirm Location" is clicked, it should call an `onLocationConfirm` prop, passing back a `Location` object containing both the `address` string and the `coords` (`lat`, `lng`).

---

### **2. Live Order Tracking Map**

This feature will be displayed on the "My Orders" page (`/customer/orders`) when a user clicks a "Track on Map" button for an order with the status `Out for Delivery`.

**A. Component & UI:**
*   Create a component named `OrderTrackingMap`.
*   The map should display two key markers:
    1.  **Customer's Drop-off Point:** A static marker representing the delivery destination.
    2.  **Driver's Location:** A dynamic marker representing the driver's current position. This marker should use a custom icon (e.g., a small truck icon).
*   A line (polyline) should be drawn on the map showing the suggested route from the driver's current location to the drop-off point.
*   Display an information card next to or below the map showing:
    *   Estimated Time of Arrival (ETA).
    *   Remaining Distance.

**B. Functionality:**
*   **Data Fetching:** The component will need the order's `destination` coordinates.
*   **Live Driver Location:**
    *   To simulate live tracking for the demo, create a mock service that provides a series of coordinates along a route from a starting point to the destination.
    *   Use a `useEffect` hook with a `setInterval` to periodically fetch the "new" driver location from this mock service.
    *   The driver's truck marker should smoothly animate or update its position on the map every few seconds.
*   **Directions & ETA:**
    *   Use the Google Maps Directions Service (`@vis.gl/react-google-maps` has helpers for this) to calculate the route between the driver's current location and the customer's destination.
    *   The Directions Service response will provide the polyline for the route, as well as the ETA and distance, which should be displayed in the info card.
    *   The route and ETA should be recalculated every time the driver's location is updated to provide a "live" feel.
