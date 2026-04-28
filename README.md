# Patchwork: Skill-Sharing Network

Patchwork is a collaborative platform designed for project-based learning. Users can teach skills they possess and learn new ones by joining small teams to complete structured project templates.

/////////////////////////////////////////////////////////////
Features

- Skill Heatmap: Visualize community skill demand and supply.
- Matching Engine: Automatically pair with complementary learners/teachers.
- Task Boards: Manage project progress with a native drag-and-drop board.
- Time Bank: Earn and spend time credits through teaching and collaboration.
- Showcase: Publicly display completed projects and gather community votes.
- Certificates: Earn printable HTML certificates upon project completion.
  /////////////////////////////////////////////////////////////
  Setup Instructions

open cmd
locate to project file :

1. Install Dependencies:
   cmd : npm install

2. Configure Database:
   Update cmd :`config.json` with your MongoDB URI and a session secret.

3. Seed Initial Data:

   cmd :node seed.js

4. Run the Application:

   cmd :npm start

then go to http://localhost:3000/

/////////////////////////////////////////////////////////////

Technical Stack

- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose ODM
- Frontend: Vanilla JavaScript, EJS, CSS Grid
