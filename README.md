# Kathir's(KD) Logbook  

The idea behind the website was to have a way for me to keep logs of everything I would want to revisit in the future.  
The primary use case is for me to keep tracks of comics that I have read, favourtie movies that I have watched and restaurants and countries I have visited. 
However, if I ever feel the need to log anything else then it is also possible to create new categories.
Each category is capable of creating items that store basic information I would want logged.
It is also possible to edit and delete the items and categories. 

You can navigate to the deployed version of the website through this link - https://reading-journal-topa.onrender.com/home 

## How to install and run the project:  

- Clone the git repo using the command `git clone https://github.com/Kathir-Subramaniam/reading-journal.git`.
- Set up MongoDB.
- Set up a `.env` file with `.env.example` as a reference. 
- Open terminal on the root folder.
- Run `npm install` to install dependencies.
- Use `npm start` to start the server.
- Server starts on `http://localhost:3000/` by default.  

## How to use the project:

- There are two parts that are dynamic, the categories and the items which belong to the categories.
- Create categories first to be able to create items related to it.
- You can edit and delete the categories once you go into them.
- You can edit and delete the items once you go into the item.
- Creating both categories and items require you to fill all the fields.
- The image field requires you to input an URL to an image.

## Work In Progress Features / Known Bugs:
- Currently the website is only for 1 user but support for multiple users is in the work.
- A review system is also in the works.

## Technologies Used in this Project:
- Express
- NodeJS
- MongoDB Atlas
- Mongoose
- Git
- Render.com to deploy the website

