<h1 style="color:yellow;"># Anonymous Recipe Sharing Platform by H3101_Group8</h1>

<h2 style="color:orange;"><em><strong>Overview</strong></em></h2>
This project is a recipe sharing platform where users can browse posts, view images, and interact with posts by liking, disliking, commenting, adding to favorites, and reporting them.

<h2 style="color:orange;"><em><strong>Project Structure</strong></em></h2>
- **index.html**: The main HTML file that structures the webpage.
- **styles/**
  - **style.css**: CSS file that handles the styling of the website including layout, buttons, and responsiveness.
- **scripts/**
  - **script.js**: JavaScript file for handling interactions such as likes, dislikes, comments, modal images, and "see more" content expansion.
- **images/**: Contains the images used in the posts, user avatars, and the logo.

<h2 style="color:orange;"><em><strong>Features</strong></em></h2>
- **Like/Dislike Posts**: Users can like and dislike posts, with the count displayed dynamically.
- **Comment Button**: Shows the total number of comments. (Static for now, but can be expanded later.)
- **Image Viewer**: Clicking on any post image opens a modal for a larger view of the image.
- **See More Content**: Users can click "see more" to expand the text content of posts.
- **Add to Favorites**: Users can mark posts as favorites, and the button text dynamically changes to indicate the status.
- **Report Posts**: Users can report posts, which triggers a confirmation prompt.

<h2 style="color:orange;"><em><strong>How to Run the Project</strong></em></h2>
1. Download the project files and extract them to your desired location.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, etc.).
3. The webpage will display with posts, images, and interactive elements.
4. Ensure that the CSS and JavaScript files are properly linked to enable full functionality.

<h2 style="color:orange;"><em><strong>Technologies Used</strong></em></h2>
- **HTML5**: The structure of the website is built using semantic HTML.
- **CSS3**: The website is styled using custom CSS for layout, buttons, hover effects, and responsiveness.
- **JavaScript (Vanilla)**: JavaScript handles user interactions (e.g., liking posts, opening modals).
- **Font Awesome**: Icons for buttons (like, dislike, comment, favorite, report) are provided by Font Awesome.

<h2 style="color:orange;"><em><strong>Future Enhancements</strong></em></h2>
- **JavaScript Integration**: Use AJAX to save user interactions (like, dislike, report) to a backend database.
- **Comment System**: Allow users to leave comments on posts and view them in real-time.
- **Responsive Design**: Integrate Bootstrap to enhance responsiveness on various screen sizes.

<h2 style="color:orange;"><em><strong>Instructions for Developers</strong></em></h2>
1. **Prepare for JavaScript Integration**:
   - Placeholders for AJAX calls have been added where backend interactions can be implemented in the future (e.g., saving likes, comments).
   - Comments in the `script.js` file outline where future functionality can be added.
2. **Prepare for Bootstrap Integration**:
   - The structure of the website is flexible and prepared for future integration of JavaScript components to improve responsiveness and layout.
3. **Customizing the Project**:
   - You can add more posts by editing the HTML or loading them dynamically with JavaScript.
   - To change the design, modify the `style.css` file or add new CSS classes.

<h2 style="color:orange;"><em><strong>Future Technology Integrations</strong></em></h2>
- **JavaScript**: JavaScript can be used to make the website responsive and to replace custom styles with pre-built components.
