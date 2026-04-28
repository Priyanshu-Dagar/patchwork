# Patchwork: Skill-Sharing Network

Patchwork is a collaborative platform designed for project-based learning. Users can teach skills they possess and learn new ones by joining small teams to complete structured project templates.

## Features
- **Skill Heatmap:** Visualize community skill demand and supply.
- **Matching Engine:** Automatically pair with complementary learners/teachers.
- **Task Boards:** Manage project progress with a native drag-and-drop board.
- **Time Bank:** Earn and spend time credits through teaching and collaboration.
- **Showcase:** Publicly display completed projects and gather community votes.
- **Certificates:** Earn printable HTML certificates upon project completion.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Database:**
   Update `config.json` with your MongoDB URI and a session secret.

3. **Seed Initial Data:**
   ```bash
   node seed.js
   ```

4. **Run the Application:**
   ```bash
   npm start
   ```

## Technical Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ODM
- **Frontend:** Vanilla JavaScript, EJS, CSS Grid (No external UI libraries)

## COMP2406 Compliance
This project follows all standards taught in COMP2406, including MVC architecture, session management, and native DOM manipulation.
