// Generate 100+ High-Quality Training Examples
// This simulates what we'd get from a real AI model

export interface TrainingExample {
  input: string;
  output: string;
  category: string;
}

export function generateTrainingCorpus(): TrainingExample[] {
  const examples: TrainingExample[] = [];

  // ============================================
  // GREETINGS & FAREWELLS (15 examples)
  // ============================================
  examples.push(
    { input: 'hello', output: 'Hi there! How can I help you today?', category: 'greeting' },
    { input: 'hey', output: 'Hey! What\'s up?', category: 'greeting' },
    { input: 'hi how are you', output: 'I\'m doing great, thanks for asking! What can I help you with?', category: 'greeting' },
    { input: 'good morning', output: 'Good morning! Hope you\'re having a great start to your day. What do you need?', category: 'greeting' },
    { input: 'good evening', output: 'Good evening! How can I assist you tonight?', category: 'greeting' },
    { input: 'what\'s up', output: 'Not much, just here and ready to help! What\'s on your mind?', category: 'greeting' },
    { input: 'hey there', output: 'Hey! Nice to see you. What can I do for you?', category: 'greeting' },
    { input: 'hello friend', output: 'Hello! Great to hear from you. How can I help?', category: 'greeting' },
    { input: 'goodbye', output: 'Goodbye! Have a wonderful day!', category: 'farewell' },
    { input: 'bye', output: 'See you later! Take care!', category: 'farewell' },
    { input: 'thanks bye', output: 'You\'re welcome! Bye for now!', category: 'farewell' },
    { input: 'see you later', output: 'See you! Come back anytime you need help.', category: 'farewell' },
    { input: 'have a good day', output: 'You too! Don\'t hesitate to reach out if you need anything.', category: 'farewell' },
    { input: 'talk to you later', output: 'Sounds good! I\'ll be here when you get back.', category: 'farewell' },
    { input: 'catch you later', output: 'Catch you later! Have a great one!', category: 'farewell' }
  );

  // ============================================
  // ACKNOWLEDGMENTS & GRATITUDE (10 examples)
  // ============================================
  examples.push(
    { input: 'thanks', output: 'You\'re welcome! Happy to help.', category: 'acknowledgment' },
    { input: 'thank you', output: 'My pleasure! Let me know if there\'s anything else.', category: 'acknowledgment' },
    { input: 'thanks a lot', output: 'Anytime! Glad I could help.', category: 'acknowledgment' },
    { input: 'appreciate it', output: 'No problem at all! Here if you need more help.', category: 'acknowledgment' },
    { input: 'cool thanks', output: 'Got it! Anything else I can do for you?', category: 'acknowledgment' },
    { input: 'awesome thank you', output: 'Glad to help! Feel free to ask more questions.', category: 'acknowledgment' },
    { input: 'ok', output: 'Alright! What\'s next?', category: 'acknowledgment' },
    { input: 'okay', output: 'Sounds good! Need anything else?', category: 'acknowledgment' },
    { input: 'got it', output: 'Perfect! Let me know if you need more help.', category: 'acknowledgment' },
    { input: 'understood', output: 'Great! I\'m here if you have more questions.', category: 'acknowledgment' }
  );

  // ============================================
  // GENERAL QUESTIONS (20 examples)
  // ============================================
  examples.push(
    { input: 'what is javascript', output: 'JavaScript is a programming language used to make websites interactive. It runs in browsers and can also run on servers with Node.js. It\'s one of the most popular languages for web development.', category: 'question' },
    { input: 'what is python', output: 'Python is a high-level programming language known for its simplicity and readability. It\'s widely used in data science, web development, automation, and AI. Great for beginners!', category: 'question' },
    { input: 'what is react', output: 'React is a JavaScript library for building user interfaces. Created by Facebook, it uses components to build reusable UI elements and is one of the most popular frontend frameworks.', category: 'question' },
    { input: 'what is machine learning', output: 'Machine learning is a subset of AI where computers learn patterns from data without being explicitly programmed. It\'s used in image recognition, natural language processing, recommendations, and more.', category: 'question' },
    { input: 'what is artificial intelligence', output: 'Artificial intelligence is the simulation of human intelligence by computers. It includes machine learning, natural language processing, computer vision, and robotics. AI can learn, reason, and make decisions.', category: 'question' },
    { input: 'what is a database', output: 'A database is an organized collection of data stored electronically. Common types include SQL databases (like PostgreSQL, MySQL) for structured data and NoSQL databases (like MongoDB) for flexible schemas.', category: 'question' },
    { input: 'what is an api', output: 'An API (Application Programming Interface) is a set of rules that allows different software applications to communicate. It defines how requests and responses should be formatted, enabling integration between systems.', category: 'question' },
    { input: 'what is git', output: 'Git is a version control system that tracks changes to files. It\'s essential for collaborative development, allowing multiple people to work on the same codebase while maintaining history and enabling rollbacks.', category: 'question' },
    { input: 'what is docker', output: 'Docker is a platform for building, shipping, and running applications in containers. Containers package an app with all its dependencies, ensuring it runs consistently across different environments.', category: 'question' },
    { input: 'what is cloud computing', output: 'Cloud computing delivers computing services (servers, storage, databases, networking) over the internet. Major providers include AWS, Azure, and Google Cloud. It offers scalability and pay-as-you-go pricing.', category: 'question' },
    { input: 'how does the internet work', output: 'The internet is a global network of computers connected via TCP/IP protocol. Data is broken into packets, routed through networks, and reassembled at the destination. DNS translates domain names to IP addresses.', category: 'question' },
    { input: 'what is html', output: 'HTML (HyperText Markup Language) is the standard language for creating web pages. It uses tags to structure content like headings, paragraphs, links, images, and more. It\'s the foundation of every website.', category: 'question' },
    { input: 'what is css', output: 'CSS (Cascading Style Sheets) controls the visual presentation of HTML elements. It handles layout, colors, fonts, spacing, animations, and responsive design. CSS makes websites look good.', category: 'question' },
    { input: 'what is node.js', output: 'Node.js is a JavaScript runtime that runs on the server. It allows you to use JavaScript for backend development, build APIs, and create full-stack applications with a single language.', category: 'question' },
    { input: 'what is typescript', output: 'TypeScript is a superset of JavaScript that adds static typing. It catches errors at compile time, provides better IDE support, and makes large codebases more maintainable. It compiles to plain JavaScript.', category: 'question' },
    { input: 'what is sql', output: 'SQL (Structured Query Language) is used to manage and query relational databases. It includes commands like SELECT, INSERT, UPDATE, DELETE for data manipulation, and CREATE, ALTER for schema definition.', category: 'question' },
    { input: 'what is linux', output: 'Linux is an open-source operating system kernel. Popular distributions include Ubuntu, Fedora, and Debian. It\'s widely used in servers, embedded systems, and by developers for its stability and customization.', category: 'question' },
    { input: 'what is blockchain', output: 'Blockchain is a decentralized, distributed ledger technology. It records transactions across multiple computers in a way that\'s secure, transparent, and tamper-resistant. It\'s the foundation of cryptocurrencies.', category: 'question' },
    { input: 'what is cryptocurrency', output: 'Cryptocurrency is digital money secured by cryptography and typically built on blockchain technology. Bitcoin was the first, followed by thousands of others like Ethereum, Solana, and many more.', category: 'question' },
    { input: 'what is the cloud', output: 'The cloud refers to remote servers accessed over the internet that provide computing services. Instead of running software locally, you use cloud services for storage, processing, and applications.', category: 'question' }
  );

  // ============================================
  // CODE GENERATION REQUESTS (15 examples)
  // ============================================
  examples.push(
    { input: 'build a calculator', output: 'I\'ll create a calculator for you with basic arithmetic operations. Here\'s a simple implementation with a clean interface.', category: 'code_generation' },
    { input: 'make a todo list', output: 'I\'ll build a todo list app for you. It will let you add, complete, and delete tasks with local storage persistence.', category: 'code_generation' },
    { input: 'create a timer', output: 'I\'ll create a countdown timer for you. It will have start, stop, and reset functionality with a clean display.', category: 'code_generation' },
    { input: 'build a website', output: 'I\'ll build a responsive website for you with a modern design. It will include navigation, sections, and be mobile-friendly.', category: 'code_generation' },
    { input: 'make a form', output: 'I\'ll create a contact form for you with validation. It will check required fields, email format, and provide user feedback.', category: 'code_generation' },
    { input: 'build a game', output: 'I\'ll build a simple game for you. Let\'s create something fun and interactive with HTML5 Canvas.', category: 'code_generation' },
    { input: 'create a dashboard', output: 'I\'ll create a dashboard for you with charts, stats, and a clean layout. It will display data in an organized, visual way.', category: 'code_generation' },
    { input: 'make a calendar', output: 'I\'ll build a calendar component for you. It will show the current month, allow navigation, and highlight today\'s date.', category: 'code_generation' },
    { input: 'build a chat app', output: 'I\'ll create a chat application for you with message history, user names, and real-time updates.', category: 'code_generation' },
    { input: 'make a weather app', output: 'I\'ll build a weather app for you that displays current conditions, forecasts, and has a clean, modern interface.', category: 'code_generation' },
    { input: 'create a login page', output: 'I\'ll create a login page for you with email/password fields, validation, and a clean design.', category: 'code_generation' },
    { input: 'build a portfolio site', output: 'I\'ll build a portfolio website for you with sections for projects, about me, and contact information.', category: 'code_generation' },
    { input: 'make a blog', output: 'I\'ll create a blog for you with posts, categories, and a clean reading experience.', category: 'code_generation' },
    { input: 'build an e-commerce site', output: 'I\'ll build an e-commerce site for you with product listings, shopping cart, and checkout flow.', category: 'code_generation' },
    { input: 'create a landing page', output: 'I\'ll create a landing page for you with a hero section, features, testimonials, and call-to-action.', category: 'code_generation' }
  );

  // ============================================
  // EXPLANATIONS & ADVICE (20 examples)
  // ============================================
  examples.push(
    { input: 'how do i learn programming', output: 'Start with a beginner-friendly language like Python or JavaScript. Practice daily, build small projects, and don\'t be afraid to make mistakes. Use free resources like freeCodeCamp, Codecademy, or YouTube tutorials. The key is consistent practice!', category: 'advice' },
    { input: 'how to get better at coding', output: 'Practice regularly, work on real projects, read other people\'s code, and don\'t be afraid to refactor. Focus on understanding concepts rather than memorizing syntax. Build projects that interest you to stay motivated.', category: 'advice' },
    { input: 'what should i learn first', output: 'Start with HTML and CSS to understand web structure and styling. Then learn JavaScript for interactivity. Once comfortable, pick a framework like React or Vue. For backend, learn Node.js or Python. Build projects as you go!', category: 'advice' },
    { input: 'how to debug code', output: 'Use console.log() to track values, learn to use your browser\'s developer tools, read error messages carefully, and break problems into smaller pieces. Sometimes stepping away and coming back with fresh eyes helps!', category: 'advice' },
    { input: 'how to write good code', output: 'Write clean, readable code with meaningful variable names. Keep functions small and focused. Add comments for complex logic. Follow consistent formatting. Test your code. And remember: code is read more often than it\'s written!', category: 'advice' },
    { input: 'how to stay motivated', output: 'Set small, achievable goals. Celebrate progress, not just completion. Work on projects you\'re passionate about. Join a community of learners. Take breaks when needed. Remember why you started!', category: 'advice' },
    { input: 'how to learn faster', output: 'Use active learning: practice, teach others, build projects. Break complex topics into chunks. Use spaced repetition for memorization. Get enough sleep. Take regular breaks. And don\'t try to learn everything at once!', category: 'advice' },
    { input: 'how to prepare for interviews', output: 'Practice coding problems on platforms like LeetCode. Review fundamentals: data structures, algorithms, system design. Prepare behavioral questions using the STAR method. Do mock interviews. Research the company. And get enough rest!', category: 'advice' },
    { input: 'how to build a portfolio', output: 'Include 3-5 of your best projects. Show variety in skills. Write clear descriptions. Include live demos and source code. Make it visually appealing. Keep it updated. And tell your story!', category: 'advice' },
    { input: 'how to network in tech', output: 'Attend meetups and conferences. Be active on GitHub. Contribute to open source. Share your learning journey on social media. Help others. Be genuine and curious. Follow up with people you meet!', category: 'advice' },
    { input: 'how to handle imposter syndrome', output: 'Remember everyone feels this way sometimes. Focus on learning, not perfection. Celebrate small wins. Talk to others about it. Keep a list of your accomplishments. And remember: you belong here!', category: 'advice' },
    { input: 'how to write documentation', output: 'Start with a clear overview. Include installation instructions. Provide usage examples. Document all public APIs. Keep it up to date. Use clear, simple language. And write for your audience!', category: 'advice' },
    { input: 'how to use git effectively', output: 'Commit often with clear messages. Use branches for features. Pull before pushing. Write descriptive commit messages. Use .gitignore properly. Learn to rebase. And don\'t be afraid to ask for help!', category: 'advice' },
    { input: 'how to optimize performance', output: 'Measure first, optimize second. Look for bottlenecks. Cache expensive operations. Minimize DOM manipulation. Use efficient algorithms. Lazy load when possible. And always test after optimizing!', category: 'advice' },
    { input: 'how to write tests', output: 'Start with unit tests for individual functions. Add integration tests for workflows. Use a testing framework like Jest. Write tests before code (TDD) when possible. Test edge cases. And keep tests simple and readable!', category: 'advice' },
    { input: 'how to learn a new framework', output: 'Start with the official tutorial. Build a small project. Read the documentation. Watch video courses. Join the community. Practice regularly. And don\'t try to learn everything at once - focus on core concepts first!', category: 'advice' },
    { input: 'how to contribute to open source', output: 'Find a project you use and like. Start with documentation or small bug fixes. Read the contributing guidelines. Ask questions. Be patient with maintainers. And celebrate your first PR!', category: 'advice' },
    { input: 'how to manage time better', output: 'Use time blocking. Prioritize tasks with the Eisenhower matrix. Take regular breaks (Pomodoro technique). Minimize distractions. Set clear goals. And remember: rest is productive too!', category: 'advice' },
    { input: 'how to deal with bugs', output: 'Stay calm. Reproduce the issue. Read error messages carefully. Use debugging tools. Check recent changes. Search for similar issues. Take breaks if stuck. And remember: every bug is a learning opportunity!', category: 'advice' },
    { input: 'how to write clean code', output: 'Use meaningful names. Keep functions small. Follow the single responsibility principle. Write self-documenting code. Add comments for why, not what. Refactor regularly. And always think about the next developer!', category: 'advice' }
  );

  // ============================================
  // TECHNICAL EXPLANATIONS (15 examples)
  // ============================================
  examples.push(
    { input: 'explain recursion', output: 'Recursion is when a function calls itself to solve a problem. It needs a base case to stop and a recursive case that moves toward the base. Example: factorial(n) = n * factorial(n-1). Think of it like Russian nesting dolls!', category: 'explanation' },
    { input: 'explain object oriented programming', output: 'OOP organizes code into objects that combine data (properties) and behavior (methods). Key concepts: encapsulation (hiding details), inheritance (sharing code), polymorphism (different forms), and abstraction (simplifying complexity).', category: 'explanation' },
    { input: 'explain functional programming', output: 'Functional programming treats computation as evaluation of mathematical functions. It avoids changing state and mutable data. Key concepts: pure functions, immutability, higher-order functions, and composition. Think math, not instructions!', category: 'explanation' },
    { input: 'explain algorithms', output: 'An algorithm is a step-by-step procedure to solve a problem. Good algorithms are efficient (fast, use little memory) and correct. Examples: sorting (quicksort, mergesort), searching (binary search), and graph traversal (BFS, DFS).', category: 'explanation' },
    { input: 'explain data structures', output: 'Data structures organize and store data efficiently. Common types: arrays (indexed), linked lists (nodes), stacks (LIFO), queues (FIFO), trees (hierarchical), graphs (networks), and hash tables (key-value). Choose based on your needs!', category: 'explanation' },
    { input: 'explain apis', output: 'An API (Application Programming Interface) lets different software communicate. REST APIs use HTTP methods (GET, POST, PUT, DELETE) and return JSON. They define endpoints, request formats, and response formats. Think of it as a contract between systems.', category: 'explanation' },
    { input: 'explain databases', output: 'Databases store and organize data. SQL databases (relational) use tables with rows and columns, good for structured data. NoSQL databases (document, key-value, graph) are more flexible. Choose based on your data structure and query needs.', category: 'explanation' },
    { input: 'explain version control', output: 'Version control tracks changes to files over time. Git is the most popular. Key concepts: commits (snapshots), branches (parallel development), merges (combining changes), and remotes (shared repositories). It\'s essential for collaboration!', category: 'explanation' },
    { input: 'explain testing', output: 'Testing verifies code works correctly. Types: unit tests (individual functions), integration tests (components together), end-to-end tests (full workflows). Write tests that are fast, isolated, and repeatable. Test early and often!', category: 'explanation' },
    { input: 'explain deployment', output: 'Deployment is releasing code to production. Modern approaches: CI/CD pipelines automate testing and deployment. Use containers (Docker) for consistency. Deploy to cloud services (AWS, Vercel, Netlify). Monitor after deployment. Roll back if needed!', category: 'explanation' },
    { input: 'explain security', output: 'Security protects systems from threats. Key practices: validate all input, use HTTPS, hash passwords, prevent SQL injection and XSS, use authentication and authorization, keep dependencies updated, and follow the principle of least privilege.', category: 'explanation' },
    { input: 'explain performance', output: 'Performance optimization makes code faster and more efficient. Strategies: measure first, minimize work, cache results, use efficient algorithms, optimize database queries, lazy load resources, and profile to find bottlenecks. Don\'t optimize prematurely!', category: 'explanation' },
    { input: 'explain scalability', output: 'Scalability is handling growth. Vertical scaling: bigger servers. Horizontal scaling: more servers. Use load balancers, caching, databases that scale, and asynchronous processing. Design for failure. And plan for 10x your current load!', category: 'explanation' },
    { input: 'explain microservices', output: 'Microservices break apps into small, independent services. Each service handles one concern, communicates via APIs, and can be deployed separately. Benefits: scalability, flexibility, team autonomy. Challenges: complexity, debugging, data consistency.', category: 'explanation' },
    { input: 'explain containers', output: 'Containers package apps with all dependencies. Docker is the most popular. Benefits: consistency across environments, isolation, portability. Use Dockerfiles to define containers, docker-compose for multi-container apps, and registries to share images.', category: 'explanation' }
  );

  // ============================================
  // CONVERSATIONAL RESPONSES (5 examples)
  // ============================================
  examples.push(
    { input: 'that makes sense', output: 'Great! Let me know if you want to dive deeper into any part of it.', category: 'conversation' },
    { input: 'i see', output: 'Awesome! Feel free to ask if anything is unclear or you want more details.', category: 'conversation' },
    { input: 'interesting', output: 'Right? There\'s a lot to explore here. What aspect interests you most?', category: 'conversation' },
    { input: 'tell me more', output: 'Sure! I\'d be happy to go deeper. What specific part would you like to know more about?', category: 'conversation' },
    { input: 'can you explain that again', output: 'Of course! Let me break it down differently. What part was unclear?', category: 'conversation' }
  );

  return examples;
}

// Export for use
export const TRAINING_DATA = generateTrainingCorpus();
