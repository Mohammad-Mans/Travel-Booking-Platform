# Travel and Accommodation Booking Platform :luggage::flight_departure::earth_americas:

Welcome to Vista Voyage, a cutting-edge web application designed for booking travel and accommodation effortlessly. Built with React TypeScript and leveraging the power of Vite for fast development cycles, Vista Voyage offers a seamless user experience for travelers worldwide.


## :pushpin: Table of Contents
- [Features](#star2-features)
- [Technologies](#gear-technologies)
- [How to Access the Project](#man_technologist-how-to-access-the-project)
- [How to Use the Project](#rocket-how-to-use-the-project)
- [References](#books-references)
- [Acknowledgment](#stars-acknowledgment)
- [License](#balance_scale-license)

## :star2: Features 

The website has a wide range of features aimed to enhance the booking experience.:

- *Login Page*: Secure login with separate access for users and administrators.
- *Home Page*: Includes robust search functionality, featured deals, recently visited hotels, and trending destination highlights.
- *Search Results Page*: Offers comprehensive search filters and hotel listings.
- *Hotel Page*: Features a visual gallery, detailed hotel information with a map showing the hotel's location, available rooms.
- *Secure Checkout and Confirmation*: For user information and payment, with options to print or save the confirmation as a PDF.
- *Admin Page for Easy Management*: With functional left navigation, admin search bar, detailed grids for cities, hotels, and rooms, create button, and entity update form.

## :gear: Technologies

Below are the frontend technologies utilized in this project:

- **Frontend:**
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/) - A lightning-fast build and development server for modern web applications.

- **UI Components:**
  - [MUI](https://mui.com/) - A comprehensive library of pre-built React components based on Material-UI.

- **Form Handling:**
  - [Formik](https://formik.org/) - A powerful and flexible form management library for React.
  - [Yup](https://www.npmjs.com/package/yup) - A schema-based validation library for JavaScript.

- **Server Calls:**
  - [Axios](https://www.npmjs.com/package/axios) - A popular promise-based HTTP client for making API requests.

- **Routing:**
  - [React Router DOM](https://reactrouter.com/en/main) - A collection of libraries for routing in React applications.

- **Date/Time Handling:**
  - [dayjs](https://day.js.org/) - A minimalist JavaScript library that parses, validates, manipulates, and displays dates and times.

- **PDF Generation:**
  - [jsPDF](https://www.npmjs.com/package/jspdf) - A JavaScript library for generating PDF documents in the browser.

- **Printing:**
  - [react-to-print](https://www.npmjs.com/package/react-to-print) - A React hook for handling printing in web applications.

- **Map Integration:**
  - [Google Maps](https://developers.google.com/maps) - Embed interactive maps and geospatial features in your web applications.

- **Testing:**
  - [Vitest](https://vitest.dev/guide/migration.html) - A lightning-fast unit test framework powered by Vite.
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) - A set of testing utilities specifically designed for React applications.


## :man_technologist: How to Access the Project

- To view and explore the project, you can simply visit the following link:
  
  [https://vistavoyage.netlify.app/](https://vistavoyage.netlify.app/)

  This link will take you to the live version of the project, where you can browse through my work and experience interactive elements and responsive layouts.

- To execute this project on your machine, take these simple steps:
  - **Prerequisites:**
    
    Node.js and npm (or yarn) installed on your system.

  - **Steps:**

     - **Clone the repository:**
       ```bash
         git clone  git clone https://github.com/Mohammad-Mans/vista-voyage.git
       ```
       
     - **Install npm packages:**
       
       Navigate to the project directory and install the required dependencies.
       ```bash
         npm install
       ```
      
     - **Run the project:**
       ```bash
         npm run dev
       ```
       
## :rocket: How to Use the Project

Upon opening the project, you will land on the login page. There are two login options available: user and admin.

### :closed_lock_with_key: For Users:

1. **Login as User:**
   - Enter the following credentials:
     - Username: user
     - Password: user

2. **Explore Home Page:**
   - Upon logging in, you will land on the home page.
   - Explore featured deals, trending destination highlights, and recently visited hotels directly from the home page.
   - Click on any featured deal or recently visited hotel to view detailed information.
   - Click on trending destinations to search for hotels based on the selected location.

3. **Search for Hotels:**
   - Use the search bar on the home page to enter criteria such as city name, check-in and check-out dates, number of rooms, and number of adults or children.
   - Press the search button to navigate to the search page.
   - Refine your search using filters available on the search page.
   - Alternatively, click on a trending location from the home page to initiate a search based on that location.

4. **View Hotel Details:**
   - Click on a hotel from the home page to view detailed information, including room availability and selection.
   - Alternatively, click on the "View Hotel" button on the search results page to access hotel details.

5. **Secure Checkout:**
   - After selecting a hotel and room, proceed to checkout by clicking the "Book" button.
   - Enter necessary booking and payment information on the checkout page.
   - Optionally provide special requests.
   - Upon clicking checkout, a confirmation page will appear displaying booking details.
   - From the confirmation page, you can choose to print or download the confirmation as a PDF.

### :closed_lock_with_key: For Admins:

1. **Login as Admin:**
   - Enter following credentials:
     - Username: admin
     - Password: admin

2. **Access Admin Page:**
   - Once logged in, Navigate through various sections such as cities, hotels, and rooms from the navigation menu.
   - Use the search bar to search for cities, hotels, or rooms based on the section you are in.

3. **Manage Entities:**
   - Sliding window will appear from the right when clicking create button to create a new entity or when clicking on a grid row to update a certain entity.
   - Delete entity by clicking on the trash icon located at the end of each row.

## :books: References
- [React Login, Registration, and Authentication](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd)
- [React Material UI Tutorial](https://www.youtube.com/playlist?list=PLC3y8-rFHvwh-K9mDlrrcDywl7CeVL2rO)
- [Use Formik and Yup With MUI](https://www.youtube.com/watch?v=MV9NC3FoCmM&list=LL&index=12)
- [Getting Started with Google Maps API in React.js](https://medium.com/@yukthihettiarachchissck/getting-started-with-google-maps-api-in-react-js-1390b19d18f0)
- [React to Pdf Printing](https://www.youtube.com/watch?v=Do7T8LDKy0Q&list=LL&index=2)
- [An effective ‘Cancel’ dialog confirmation on Web](https://medium.com/@joaopegb/ux-writing-an-effective-cancel-dialog-confirmation-on-web-539b73a39929)
- [Checkboxes vs. Switches](https://uxplanet.org/checkbox-vs-toggle-switch-7fc6e83f10b8)
- [Checkboxes vs. Radio Buttons](https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/)

## :stars: Acknowledgment
Special thanks to [**Foothill Technology Solutions**](https://www.foothillsolutions.com/) for the opportunity to work on this project during my internship. The experience and knowledge gained have been invaluable.

## :balance_scale: License

This project is licensed under the [MIT License](https://opensource.org/license/mit/). Feel free to use, modify, and distribute the code as long as you retain the original license notice.

