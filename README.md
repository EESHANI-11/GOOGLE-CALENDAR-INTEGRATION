# Google Calendar Integration App

This is a **Google Calendar Integration Web App** built using React and Google APIs. The app allows users to securely sign in using Google, view their public calendar events, export events to a CSV file, and more. Below are the key features and instructions for usage.

---

## **Features**
1. **Google Single Sign-On (SSO) Login**
   - Users can securely log in using their Google account.
   
2. **View Calendar Events**
   - Displays the user's **public Google Calendar events** in a tabular format.
   - Events are **sorted in descending order** by date for easy readability.

3. **Search Functionality**
   - Users can search for events by their name using a search bar.

4. **Filter Events by Date**
   - A date picker allows users to filter events based on a specific date.

5. **Pagination**
   - Events are displayed with pagination to improve usability when viewing a large number of events.

6. **Export Events to CSV**
   - Users can export their displayed events to a **CSV file** for offline usage.

7. **Create New Event**
   - A feature to create new events directly from the app is available.

---

## **Prerequisites**
1. **Google Calendar Setup:**
   - Users must ensure their **Google Calendar is public** for the app to fetch and display events.
   - Follow these steps to make your calendar public:
     - Go to your Google Calendar.
     - Select the calendar you want to share from the list on the left.
     - Click on **Settings and Sharing**.
     - Under **Access permissions for events**, enable **Make available to public**.

2. **Google API Client ID:**
   - Replace the `CLIENT_ID` in the app with your own Google OAuth Client ID.

---

## **Setup Instructions**
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
2.    ```bash
       npm install
       npm start
