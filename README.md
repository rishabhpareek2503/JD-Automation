# JD Assistant - AI Job Description Generator

A simple and smart tool that helps you create professional job descriptions using AI technology. Perfect for HR teams, recruiters, and small businesses who want to write better job postings without the hassle.

## What Does It Do?

JD Assistant makes writing job descriptions easy and fast. Just enter a job title, add some basic details, and let AI create a complete, professional job description for you. You can save all your job descriptions in one place and download them whenever you need.

## Key Features

- **AI-Powered Generation**: Creates professional job descriptions using OpenAI
- **Smart Skills Suggestions**: Get relevant skills for any job title
- **Company Details**: Add company info, location, and work mode
- **Local Storage**: Save and manage job descriptions in browser
- **Export Options**: Download as text or HTML files

## AI Logic

The app uses OpenAI's GPT model to generate job descriptions based on:
- Job title and company details
- Selected skills and requirements
- Custom company overview (preserved as-is)
- Professional HR writing patterns

## How to Set It Up

### What You Need

- A computer with internet
- Basic knowledge of running simple commands
- An OpenAI account (required for AI features)

### Getting Started

**Step 1: Set Up the Backend**

\`\`\`bash
cd backend
npm install
\`\`\`

Create `.env` file:
\`\`\`
OPENAI_API_KEY=your_openai_key_here
PORT=5000
\`\`\`

Start backend:
\`\`\`bash
npm start
\`\`\`

**Step 2: Set Up the Frontend**

\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

Open `http://localhost:3000` in your browser.

**Requirements**: Node.js and valid OpenAI API key
\`\`\`

### How to Use It

### Creating Your First Job Description

1. **Enter Job Title**: Type the position you're hiring for (like "Marketing Manager")

2. **Add Company Details** (optional):
   - Company name
   - Location
   - Work mode (Remote, On-site, or Hybrid)
   - Company description

3. **Get Skill Suggestions**: Click the "Get Suggested Skills" button to see relevant skills

4. **Add Skills**: Click on suggested skills or add your own custom skills

5. **Generate**: Click "Generate JD" and watch AI create your job description

6. **Save or Download**: Save to your library or download as a file

### Managing Your Job Descriptions

- **View Library**: Click "Library" to see all your saved job descriptions
- **Search**: Find specific job descriptions by title or skills
- **Download**: Get any job description as a text or HTML file
- **Delete**: Remove job descriptions you no longer need


## Technology Used

- **Frontend**: React (for the user interface)
- **Backend**: Node.js with Express (for the server)
- **AI**: OpenAI API (for generating content)
- **Storage**: Your browser's local storage (no database needed)
- **Styling**: Custom CSS (clean and modern design)

## Important Notes

### About the OpenAI Key

- You need a valid OpenAI API key for the app to work
- Get your API key from openai.com
- Your key is stored locally and never shared
- Make sure you have credits in your OpenAI account

### Data Storage

- All your job descriptions are saved in your browser
- No data is sent to external servers (except OpenAI for generation)
- Clear your browser data will remove saved job descriptions
- Consider exporting important job descriptions as backup

### Troubleshooting

**Backend won't start:**
- Make sure you're in the backend folder
- Check if Node.js is installed: `node --version`
- Try deleting `node_modules` and running `npm install` again

**Frontend won't start:**
- Make sure you're in the frontend folder
- Check if the backend is running first
- Try a different port if 3000 is busy

**AI not working:**
- Check your OpenAI API key in the `.env` file
- Make sure you have credits in your OpenAI account
- Verify your API key is valid and active

## Customization Ideas

- Change colors and fonts in the CSS files
- Modify the AI prompts for different writing styles
- Add new fields like salary range or benefits
- Create custom export formats

## Getting Help

If you run into problems:

1. Check this README file first
2. Look at the error messages in your terminal
3. Make sure all packages are installed correctly
4. Verify your OpenAI key is correct
5. Try restarting both frontend and backend

## Future Improvements

Some ideas for making this even better:

- Add user accounts and cloud storage
- Include more job description templates
- Add team collaboration features
- Create mobile apps
- Add integration with job boards
- Include analytics and reporting

## License and Usage

This project is open source and free to use. Feel free to modify it for your needs, share it with others, or use it in your business. No attribution required, but always appreciated!

---

**Happy hiring!** 🎉

Made with care for HR teams and recruiters who want to create better job descriptions faster.
