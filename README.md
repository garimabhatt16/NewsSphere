📰 NewsSphere – Your AI Journalist

NewsSphere is a full-stack AI-powered news application that scrapes the latest headlines from ANI News, generates AI-powered summaries, stores the processed news in MongoDB Atlas, and displays them through a React interface.

🚀 Features
📰 Scrapes news articles from ANI News
🤖 Generates concise AI-powered summaries
🗄️ Stores processed news in MongoDB Atlas
⚡ Express REST API for serving news
🎨 React-based news interface
🖼️ Consistent news card layout
🛡️ Error handling for scraping and AI failures
🛠️ Tech Stack
Frontend: React, Vite, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB Atlas, Mongoose
Scraping: Axios, Cheerio
AI: OpenRouter API
🏗️ How It Works
ANI News → Web Scraper → AI Summary → MongoDB
                                      ↓
                              Express API
                                      ↓
                               React UI
📂 Project Structure
NewsSphere/
├── API/
├── Client/
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
⚙️ Getting Started
1. Clone & Install
git clone https://github.com/garimabhatt16/NewsSphere.git
cd NewsSphere
npm install
cd Client
npm install
cd ..
2. Environment Variables

Create a .env file in the root directory:

MONGO=your_mongodb_connection_string
API=your_openrouter_api_key

Never commit your .env file or expose your API keys.

3. Run the Backend

In API/index.js, uncomment scrapeNewsList(urlToScrape[0]) to fetch articles.

node API/index.js

After fetching the articles, comment the scraper call again.

4. Run the Frontend
cd Client
npm run dev

Open http://localhost:5173 in your browser.

🔌 API
Get Breaking News
GET /breaking

The endpoint retrieves processed news articles from MongoDB for display in the React frontend.

🧠 AI Summarization

Article content is sent to the OpenRouter API, which generates concise summaries.
These summaries are stored in MongoDB and displayed as part of each news card.

🛡️ Error Handling

The application handles failed article requests, unavailable content, and AI summarization failures.
If one article fails, the remaining articles can continue processing.

🔮 Future Improvements
🔍 Search and news categories
⏱️ Automatic news updates
⭐ Bookmark articles
🌙 Dark mode
📱 Improved mobile responsiveness
👩‍💻 Author

Garima Bhatt
B.Tech Computer Science & Engineering
GitHub: https://github.com/garimabhatt16

📄 License

This project is created for educational and development purposes.