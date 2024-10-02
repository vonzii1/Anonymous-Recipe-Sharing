# _**Anonymous Recipe Sharing Platform by H3101_Group4**_

## _**Overview**_
This project is a recipe-sharing platform where users can:
- Browse posts.
- View images and interact with posts by:
  - Liking, disliking, and commenting.
  - Adding posts to favorites.
  - Reporting posts.
  - Creating new posts.
- Search for recipes.
- View profile and notifications.
- Reply to chats.

## _**Project Structure**_
- **index.html**: The main HTML file structuring the webpage.
- **styles/**
  - **style.css**: Handles website styling, including layout, buttons, and responsiveness.
- **scripts/**
  - **scripts.js**: Manages interactions such as likes, dislikes, comments, modal images, and "see more" content expansion.
- **images/**: Contains post images, user avatars, and the site logo.

## _**Features**_
- **Like/Dislike Posts**: Users can like or dislike posts with dynamic counts displayed.
- **Comment Button**: Displays the total number of comments (currently static but can be expanded).
- **Image Viewer**: Clicking on a post image opens a modal for a larger view.
- **See More Content**: Users can expand post content by clicking "see more."
- **Add to Favorites**: Allows users to mark posts as favorites, with a button that dynamically reflects the status.
- **Report Posts**: Users can report posts, triggering a confirmation prompt.

## _**How to Run the Project**_
1. Download and extract the project files to your local machine.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, etc.).
3. The webpage will display posts, images, and interactive elements.
4. Ensure that the CSS and JavaScript files are correctly linked to enable full functionality.

## _**Technologies Used**_
- **HTML5**: Semantic HTML structures the website.
- **CSS3**: Custom CSS handles layout, buttons, hover effects, and responsiveness.
- **JavaScript (Vanilla)**: JavaScript manages user interactions like post likes, modal openings, and more.
- **Font Awesome**: Provides icons for buttons like like, dislike, comment, favorite, and report.

## _**Future Enhancements**_
- **JavaScript Integration**: Use JavaScript to save user interactions (like, dislike, report).
- **Comment System**: Enable real-time commenting and display.
- **Responsive Design**: Introduce JavaScript or other responsive frameworks for better adaptability across screen sizes.

## _**Instructions for Developers**_
1. **Prepare for JavaScript Integration**:
   - Placeholders for AJAX calls are provided to enable future backend interaction (e.g., saving likes and comments).
   - Inline comments in `scripts.js` indicate where future functionality can be added.
2. **Customizing the Project**:
   - Additional posts can be added directly in HTML or loaded dynamically via JavaScript.
   - Modify `style.css` for design changes or add new styles.

## _**Future Technology Integrations**_
- **JavaScript**: Further JavaScript functionality can be added to enhance responsiveness and interactivity, and you may consider replacing custom styles with pre-built components for faster development.
