# Portfolio Project Comprehensive Exploration Report

## Project Overview
This is a React-based personal portfolio website for Sergiu Pop, a Software Developer. The project uses React Router for navigation, styled-components for styling, and Material-UI for icons.

---

## COMPONENT STRUCTURE & CONTENT

### 1. HOME PAGE (`/src/components/homePage/`)
**Files:** 
- `home.component.jsx`
- `home.styles.jsx`

**Content & Information:**
- **Personal Details:**
  - First Name: Sergiu (purple #7e72c0)
  - Last Name: Pop (orange #ffa501)
  - Title: Software Developer

- **Social Links & Contact:**
  - LinkedIn: https://www.linkedin.com/in/sergiualexandrupop/
  - GitHub: https://github.com/SergiuAlexandruPop
  - Email: sergiualexandrupop@gmail.com (with tooltip)
  - Facebook: https://www.facebook.com/PopSergiuu
  - Instagram: https://www.instagram.com/popsergiuu/

- **Assets Used:**
  - rocket.gif (animated, shaking animation)

- **UI Elements:**
  - Header component with navigation
  - Divider separator
  - Footer with social media icons
  - Responsive design with multiple breakpoints

---

### 2. HEADER COMPONENTS
Two header variations exist for different page contexts:

#### A. Main Header (`/src/components/header/`)
**Files:**
- `header.component.jsx`
- `header.styles.jsx`

**Navigation Links:**
- About me (`/aboutme`)
- Blog (`/blog`)
- Résumé (`/resume`)
- Portofolio (note: typo "Portofolio" instead of "Portfolio")

**Styling:** Purple gradient background (#7e72c0), rounded button style

#### B. Modified Header (`/src/components/modifiedHeader/`)
**Files:**
- `modifiedHeader.component.jsx`
- `modifiedHeader.styles.jsx`

**Content:**
- Home link with animated rocket icon
- Same navigation as Main Header
- White background with black text navigation
- More compact for inner pages

**Assets:** rocket.gif

---

### 3. ABOUT ME PAGE (`/src/components/aboutme/`)
**Files:**
- `aboutMe.component.jsx`
- `aboutMe.styles.jsx`
- `courses.data.js`

**Personal Bio:**
"Just your usual story. A guy found out he doesn't like what he's doing, gave up on the medical career and started learning code when he had 0 knowledge. Spamed out the old IT friends from highschool for advices and then took a deep dive on Udemy (9 courses). Then I took the turtle's plan from 'The Rabbit and the turtle' story and here we are."

**Assets:**
- Profilepic.jpg (circular profile picture)
- turtle.jpg (referenced in bio about "The Rabbit and the Turtle")

**Education Data (11 Udemy/FreeCodeCamp Courses - Listed in Reverse Order):**
1. Complete React Hooks Course 2020: A-Z (Scratch to React)
   - https://www.udemy.com/course/react-hooks-course

2. Complete React Developer in 2020 (w/ Redux, Hooks, GraphQL)
   - https://www.udemy.com/course/complete-react-developer-zero-to-mastery/

3. The Modern React Bootcamp (Hooks, Context, NextJS, Router)
   - https://www.udemy.com/course/modern-react-bootcamp/

4. Modern React with Redux {2020 Update}
   - https://www.udemy.com/course/react-redux/

5. The Complete Web Developer in 2020: Zero to Mastery
   - https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/

6. JavaScript, The Advanced Concepts
   - https://www.udemy.com/course/advanced-javascript-concepts/

7. JavaScript, Understanding the Weird Parts
   - https://www.udemy.com/course/understand-javascript/

8. The Complete JavaScript Course 2020: Build Real Projects!
   - https://www.udemy.com/course/the-complete-javascript-course/

9. Advanced CSS and Sass: Flexbox, Grid, Animations and More!
   - https://www.udemy.com/course/advanced-css-and-sass/

10. Build Responsive Real World Websites with HTML5 and CSS3
    - https://www.udemy.com/course/design-and-develop-a-killer-website-with-html5-and-css3/

11. All Front-End content from FreeCodeCamp (not really a course)
    - https://www.freecodecamp.org/learn

---

### 4. PORTFOLIO PAGE (`/src/components/portfolio/`)
**Files:**
- `portfolio.component.jsx`
- `portfolio.styles.jsx`

**Project Showcased:**

**Clothing Website**
- Type: FRONT-END PROJECT
- Live Link: https://sergiu-clothing-app.herokuapp.com/ (commented out/disabled)
- GitHub: https://github.com/SergiuAlexandruPop/crwn-clothing

**Technologies Used:**
- React.js
- Redux
- Context
- Hooks
- React-Lazy
- Firebase
- Stripe
- CSS-in-JS
- Redux-thunk (previously)
- Redux-saga (present)

**Assets:**
- ClothingGif.gif (project demo animation)

---

### 5. RESUME PAGE (`/src/components/resume/`)
**Files:**
- `resume.component.jsx`
- `resume.styles.jsx`

**Content:**
- Resume displayed as an image (resume.jpg)
- Download button for PDF version
- Warning: "For clickable links download the pdf version"

**Assets:**
- resume.jpg (image version)
- resume.pdf (downloadable)

---

### 6. BLOG SECTION (`/src/components/blog/`)

#### Main Blog Page (`mainBlogPage/`)
**Files:**
- `mainBlogPage.component.jsx`
- `mainBlogPage.styles.jsx`

**Published Blog Posts:**
1. "Hello World!" - Posted 04.07.2020
   - Route: `/first-post`
   
2. "How to become a web developer" - Posted 01.12.2022
   - Route: `/learn-front-end`
   
3. "How to live the best life" - Posted 05.04.2023
   - Route: `/health`

**Commented Out (Not Published):**
- "Who am I?" - Route: `/who-am-I`

---

#### Blog Post 1: "Hello World!" (`FirstPost/`)
**Files:**
- `FirstPost.component.jsx`
- `FirstPost.styles.jsx`

**Date:** 04.07.2020

**Content Summary:**
Career transition story - from Pharmacy to IT

**Key Points:**
- Started in highschool wanting to code but had wrong teacher
- Completed 5-year Pharmacy degree at UMF Cluj-Napoca
- Pharmacy profession jumped from respectable to less respected
- Self-taught coding from scratch
- Couldn't afford $2000 bootcamp, used Udemy & online resources
- Took 8 months to reach job-ready level
- Procrastinated on job searching

**Assets:**
- PharmacyToIT.png (Periodic table reference)
- JobSearchingDog.jpeg

---

#### Blog Post 2: "Who am I?" (`WhoAmI/`)
**Files:**
- `WhoAmI.component.jsx`
- `WhoAmI.styles.jsx`

**Date:** 04.07.2020 (same as First Post)

**Status:** Currently commented out on blog page

**Content Summary:**
Personal identity and lifestyle information

**Short Version:**
- Health-educated person
- Nerd
- Daily reader
- Yoga enthusiast
- Fitness focused
- "Body is your temple" philosophy
- Nice guy to meet
- Politics curious (especially Romania)
- Economics curious, future investor
- "Only cold showers" advocate
- Now called by family for medicine/health AND computer help

**Long Version Topics:**
- Pharmacy education (learning the iceberg bottom for top use)
- Daily reading (30 minutes - 36 books in 3 years)
  - Top 5 Books: Atomic Habits, 21 Lessons for the 21st Century, Sapiens, Homo Deus, Unshakeable
- Yoga practice (resolves back/leg pain, feels like Greek god)
- 5-year fitness obsession (muscle importance for self-esteem)
- Supplements curiosity (not whey protein, focusing on mind)
- Helping others philosophy
- Politics interest (especially Romania)
- Investment philosophy (escalator analogy - The Morning Brew newsletter)
- Cold showers (2-3 weeks to adapt, comfort zone challenge)

**Referenced People/Resources:**
- Cosmin Rusu (https://www.rusu.io/) - for cold shower research and Morning Brew newsletter

**Assets:**
- Iceberg.jpg
- GreekGod.jpg
- escalatorFail.gif

---

#### Blog Post 3: "How to become a web developer" (`LearnFrontEnd/`)
**Files:**
- `LearnFrontEnd.component.jsx`
- `LearnFrontEnd.styles.jsx`

**Date:** 01.12.2022

**Status:** Published

**Content Structure:** Extremely comprehensive 9-month learning roadmap

**Author Background:**
- Graduated Pharmacy from UMF Cluj
- Currently 28 years old
- 2 years of web development experience
- Transitioned from medical field to programming

**Key Claims:**
- No money required from following this guide
- No previous programming background required
- 4 months with 1-1.5 hours/day = internship readiness
- 6-8 months for junior job
- 90% of starters never finish (discipline issue, not difficulty)
- Budget: ~60 euros
- Online learning > bootcamps (500-2000 euros, 90% ineffective)

**Learning Myths Debunked:**
1. Must be good at math (only need a+b addition)
2. Must have IT background (didn't know a line of code)
3. Ruined eyesight (from netflix too if no breaks)
4. Must be very smart (smart people make Google/Tesla - exception)
5. Need college degree (no)
6. Need a teacher (no)
7. Takes years (only if study 10 min/day)
8. Must be computer rat (so everyone 9-5 is a rat?)

**Detailed Learning Path (Steps 1-9):**

**Step 1:** FreeCodeCamp - HTML & CSS basics
- https://www.freecodecamp.org/learn/2022/responsive-web-design/

**Step 2:** Udemy - The Complete Web Developer in 2023: Zero to Mastery
- https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/
- Stop after: "Career Of A Web Developer"

**Step 3:** Udemy - Build Responsive Real-World Websites with HTML and CSS
- https://www.udemy.com/course/design-and-develop-a-killer-website-with-html5-and-css3/
- Stop after: "Layouts: Floats, Flexbox, CSS Grid Fundamentals" (minimum)
- Extended: Stop after "Omnifood Project - Responsive Web Design" (+2 weeks)

**Step 4:** FreeCodeCamp - JavaScript
- https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/
- Stop after: ES6

**Step 5:** Udemy - The Complete JavaScript Course 2023: From Zero to Expert!
- https://www.udemy.com/course/the-complete-javascript-course/
- Do ALL
- Skip: "Numbers, Dates, Intl and Timers", "Advanced DOM and Events"
- Note: Most complete course, masterpiece, instructor one of best in world
- Takes ~30 hours but essential
- After this: ready for internship or lucky job

**Step 6:** Return to Udemy - The Complete Web Developer in 2023: Zero to Mastery
- https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/
- Stop after: "FINAL PROJECT: SmartBrain Front-End"
- At this point: equal to 90% of 2-month internships

**Step 7:** Udemy - The Coding Interview Bootcamp: Algorithms + Data Structures
- https://www.udemy.com/course/coding-interview-bootcamp-algorithms-and-data-structure/
- Stop after: "Runtime Complexity in Practice - Fibonacci"
- Tests JavaScript logical thinking
- Most enjoyable course in list

**Step 8:** Udemy - Modern React with Redux [2023 Update]
- https://www.udemy.com/course/react-redux/
- Instructor: Stephen Grider (one of best for theory)
- Do ALL (~30 hours)
- Don't skip lessons
- Recently remade in 2022 - masterpiece
- Covers high-end modern topics

**Step 9:** Udemy - Complete React Developer in 2023 (w/ Redux, Hooks, GraphQL)
- https://www.udemy.com/course/complete-react-developer-zero-to-mastery/
- Start at: "Capstone Project: Intro + Setup"
- Makes junior dev into REALLY GOOD junior dev
- Watched 3 times by author, learned something new each time
- Not for absolute React beginners
- Puts puzzle pieces together

**Post-Hiring Learning:**
- Advanced CSS and Sass
- Clean Code
- React and TypeScript
- Material-UI
- JavaScript: The Advanced Concepts
- Learning to Learn [Efficient Learning]
- Complete Web & Mobile Designer (UI/UX, Figma)

**Full Stack Learning (after 1 year working):**
- Node.js, Express, MongoDB & More: The Complete Bootcamp
- MERN Stack React Node Ecommerce
- SQL and PostgreSQL: The Complete Developer's Guide
- The Complete Junior to Senior Web Developer Roadmap

**Key Teaching Points:**
- Learning like language learning (write, speak, understand, make sentences, essay)
- Practice by doing what instructors do
- Takes 4-5 months to feel natural with syntax
- Desperation at 3-month mark is normal
- 45 min everyday > 5 hours one day
- Brain concentrates ~2 hours/day
- Must learn 5+ days/week
- Ideal: 40-60 min daily of net learning time
- Learn to figure things out (essential programmer attribute)
- Organize with Notion app
- Information repeats across resources (helps understanding grow)
- Interview questions test understanding better than courses
- Break the chain never (even 10 min video counts)

**Health/Learning Optimization (via Andrew Huberman):**
- Neuroplasticity Super-Protocol
- Toolkit for Sleep
- Foundational Fitness Protocol
- Build or Break Habits Using Science-Based Tools
- Tools to Manage Dopamine and Improve Motivation
- 5 Science-Based Steps to Improve Your Workspace

**Interview Question Resources:**
- Top 50 HTML Interview Questions
- Top 50 CSS Interview Questions
- Top 50 JavaScript Interview Questions
- Top 50 React Interview Questions
- Javascript Questions (GitHub)
- Front-End Interviews (FrontEndMasters)
- ZeroToMastery Resources

**Facebook Group:**
- Private learning community mentioned
- Selection: Must complete all courses mentioned
- Results (7 months): 4 hired, 2 internships, 2 near hiring (none had programming background)

**Videos Embedded:**
1. Frontend Development explained in 2 minutes
   - https://www.youtube.com/embed/qyHyFsT7Hig

2. Backend Development explained in 2 minutes
   - https://www.youtube.com/embed/cbSrsYiRamo

3. Frontend vs Backend vs Fullstack Web Development
   - https://www.youtube.com/embed/pkdgVYehiTE

4. A REAL Day in the Life of a Software Engineer
   - https://www.youtube.com/embed/j1fc0FlCjyI

5. A Realistic Week in the Life of a Software Engineer
   - https://www.youtube.com/embed/fGMesOdqZuA

6. Notion Tutorial for Organization
   - https://www.youtube.com/embed/ONG26-2mIHU

**Key Resources:**
- Cal Newport's Deep Work book (about concentrated learning)
- Steve Griffith YouTube channel (for daily learning habit)
- Andrew Huberman (health optimization for learning)

**Assets:**
- No images in this post, only embedded videos

---

#### Blog Post 4: "How to live the best life" (`DailyHealth/`)
**Files:**
- `DailyHealth.component.jsx`
- `DailyHealth.styles.jsx`

**Date:** 05.04.2023

**Status:** Published

**Author Background:**
- Pharmacy graduate from UMF Cluj-Napoca
- Passion for programming
- 3 years as front-end React developer
- Applies medical knowledge to health optimization

**Disclaimer:** "Not intended to replace personal doctor advice. For healthy individuals. Always consult doctor."

**Short Version (11 Key Points):**
1. Sleep: 8 hours nightly
2. Sunlight: 15 min in morning to boost cortisol
3. Coffee: Avoid first 2 hours & last 10 hours of day
4. Eating: Eat less without hunger, avoid sugar/fried
5. Smoking: Don't smoke (heart killer)
6. Hydration: Water with electrolytes
7. Supplements: Vitamin D3+K2, multivitamins, creatine
8. Alcohol: Avoid last 12 hours
9. Exercise: 15 min cardio + 40 min strength + 5 min stretching daily
10. Challenge: Do hard thing daily (cold shower, meditate, hard workout)
11. Don't stress about perfection

**Long Version - Comprehensive Health Guide:**

**Medical Check-ups:**
- Annual doctor visits minimum
- Cardiovascular ultrasound with cardiologist
- Thyroid examination with endocrinologist
- Abdominal check with internal medicine/urologist/gynecologist
- Complete blood panel every 6 months

**Key Blood Work Metrics:**
- HbA1c: <5% (blood sugar over 90 days)
- Uric Acid: <5.5mg/dL (protein metabolite)
- ApoLipoprotein a1/b: <0.6g/L (genetic cholesterol markers)
- TGO/TGP: Liver health
- Seric Creatinine: Kidney function
- T3/T4/TSH: Thyroid function
- Total Testosterone (men): 700-1200ng/dL ideal
- Free Testosterone (men): 2%+ of total

**Sleep Optimization:**
- Target: 7-9 hours nightly
- Consequences of < 7 hours: poor thinking, mental fog, impaired judgment, fatigue, Alzheimer's risk, reduced testosterone, memory issues
- REM sleep: processes trauma
- Deep sleep: long-term memory

**Sleep Tips:**
- Consistent sleep/wake times
- Cool bedroom (17-21°C)
- Earplugs for noise
- Avoid bright lights before bed
- Check nasal passages with ORL doctor
- Don't eat 3 hours before bed
- Limit alcohol before sleep
- Avoid melatonin supplements
- Try: Magnesium bisglycinate, theanine (sparingly)

**Morning Sunlight (Most Powerful Habit):**
- 15 minutes direct sunlight upon waking
- Triggers cortisol release (essential hormone)
- Resets circadian clock
- Works even on cloudy days
- Don't use sunglasses/car windows
- Sunset exposure helps sleep prep

**Coffee:**
- Wait 2 hours after waking
- Avoid last 8-10 hours before bed
- Take 3-7 day breaks monthly
- Prevents Alzheimer's disease

**Eating Habits:**
- Avoid first hour after waking
- Don't eat last 3 hours before sleep
- Watch carbs (whole grains, fruits, veggies)
- Limit sugar/fried food
- Protein: 2g per kg body weight
- Stay hydrated
- Avoid constant snacking

**Supplementation:**
- Water + electrolytes (especially pre-workout ~0.5-1g sodium per workout)
- Vitamin D3: 1000+ UI (most people deficient)
- Vitamin K2: Works with D3 (arteriosclerosis protection)
- Low-dose multivitamins (longevity studies)
- Creatine (muscle building + cognitive function)

**Exercise:**
- Best time: Morning (or evening alternative)
- Minimum: 15 min cardio, strength training, stretching
- Cardio: 120 min/week ideal, minimum 15 min zone 2 daily
- Resting heart rate: <60 bpm ideal
- Heart rate tracking: Apple products or Huawei
- Strength training: 40 min best for bones, weight loss, staying young
- Lift consistently moderate weight > occasional heavy weight
- Leg day: Monday (boosts testosterone)
- Don't ignore pain (physiotherapist)
- Sauna: 15-20 min sessions (cardiovascular prevention, reduces inflammation, improves sleep)

**Dopamine Management:**
- Stack dopamine peaks = addiction cycle
- Work hard FOR dopamine (healthy for brain)
- Cold shower/hard workout dopamine = no crash
- Social media + food + soda simultaneously = large crash

**Challenge Yourself Daily:**
- Brain needs adaptation challenge
- Examples: tough workout, cold shower, sauna, 10km run
- Builds resilience
- Makes annoying circumstances easier to handle

**Learning Optimization (via Andrew Huberman):**
- Best times: Morning and afternoon in 90-minute intervals
- Break into 2-3 sessions, learn different things
- Use different methods: reading, listening, hands-on
- End with adrenaline boost (cold shower, meditation, coffee)
- Daily dose critical (even 10 min video keeps habit)
- Consistency > intensity

**Health Resource Channels:**
- Dr. Andrew Huberman's YouTube (General Health)
- Dr. Andrew Huberman's Newsletter (Neural Network)
- MD Peter Attia's YouTube (Cardiovascular + Training)
- Dr. Rhonda Patrick's YouTube (Nutrition - FoundMyFitness)
- Dr. Layne Norton's YouTube (Training + Nutrition)
- Dr. Andy Galpin's YouTube (Best Training Resource)

**Assets:**
- No images in this post

---

## TECHNICAL STACK & ARCHITECTURE

### Framework & Libraries:
- React with Hooks
- React Router for navigation
- styled-components for CSS-in-JS styling
- Material-UI for icons (@material-ui/icons, @material-ui/core)

### Component Architecture:
- Lazy loading for all major route components (HomePage, AboutMe, Portfolio, etc.)
- Error Boundary for error handling
- Spinner component for fallback during loading
- Modified Header for inner pages, Main Header for home

### Styling Approach:
- styled-components throughout
- Global styles (global.styles.js)
- Component-specific styles files
- Responsive design with multiple media query breakpoints
- Custom animations (rocket shaking animation)
- Color scheme:
  - Primary Purple: #7e72c0, #8B80C6
  - Secondary Orange: #ffa501
  - Accent Purple: #6558ad
  - Text: #3a3f3f
  - Links: #577baa
  - Warning: #d31541

---

## ASSETS INVENTORY

### Images:
1. **Profilepic.jpg** - Profile picture (circular)
2. **turtle.jpg** - Turtle reference image (About Me)
3. **PharmacyToIT.png** - Periodic table image (First Post)
4. **JobSearchingDog.jpeg** - Dog image (First Post)
5. **Iceberg.jpg** - Iceberg image (Who Am I post)
6. **GreekGod.jpg** - Greek god image (Who Am I post)
7. **resume.jpg** - Resume image display
8. **ReduxHooks.png** - Redux/Hooks image (commented out in About Me)

### GIFs:
1. **rocket.gif** - Animated rocket (header, home page)
2. **ClothingGif.gif** - Clothing project demo
3. **escalatorFail.gif** - Escalator fail reference (Who Am I post)

### Documents:
1. **resume.pdf** - Downloadable resume

---

## ROUTING MAP

```
/ 
├── /aboutme
├── /blog
│   ├── /first-post
│   ├── /who-am-I (commented out)
│   ├── /learn-front-end
│   └── /health
├── /resume
└── /portfolio
```

Note: Route path `/First-Post` defined in App.js but main blog page links to `/first-post`

---

## KEY PERSONAL INFORMATION SUMMARY

### Name & Title:
- Sergiu Pop
- Software Developer

### Contact:
- Email: sergiualexandrupop@gmail.com
- LinkedIn: https://www.linkedin.com/in/sergiualexandrupop/
- GitHub: https://github.com/SergiuAlexandruPop
- Facebook: https://www.facebook.com/PopSergiuu
- Instagram: https://www.instagram.com/popsergiuu/

### Education & Background:
- Pharmacy degree from UMF Cluj-Napoca (5 years)
- Age: 28 years old (as of blog post December 2022)
- Self-taught programmer via 11 Udemy courses + FreeCodeCamp
- ~9 months to job-ready level
- ~2-3 years professional web development experience

### Current Skills:
- React.js
- Redux
- Hooks
- Context API
- Firebase
- Stripe integration
- CSS-in-JS
- Redux-saga
- Algorithms & Data Structures
- TypeScript familiarity

### Project Portfolio:
- Clothing E-commerce Website
  - GitHub: https://github.com/SergiuAlexandruPop/crwn-clothing
  - Live: https://sergiu-clothing-app.herokuapp.com/ (disabled)

### Interests & Philosophy:
- Health optimization (pharmacy + programming background)
- Continuous learning
- Fitness and yoga
- Cold showers
- Reading (30 min daily)
- Supplements and biohacking
- Personal development
- Teaching others programming

---

## HARDCODED DATA NOTES

1. **Courses List:** All 11 course entries with URLs in `courses.data.js`
2. **Portfolio Project:** Single project hardcoded in portfolio component
3. **Blog Posts:** Limited to 3 active posts + 1 inactive
4. **Social Links:** All hardcoded in home page component
5. **Learning Roadmap:** Entire detailed guide in LearnFrontEnd blog post
6. **Health Information:** Detailed health tips in DailyHealth blog post
7. **Email:** Contact email in home page component

---

## OBSERVATIONS & NOTES

1. **Typo:** "Portofolio" instead of "Portfolio" in navigation
2. **Route Mismatch:** App.js has `/First-Post` but blog page links to `/first-post`
3. **Inactive Post:** "Who am I?" post is commented out on main blog page
4. **Commented Code:** Some unused sections in About Me and Home components
5. **Live Link Disabled:** Clothing project live link is commented out in Portfolio
6. **Extensive Blog Content:** LearnFrontEnd post is extremely comprehensive (9-month roadmap)
7. **Health Focus:** Significant emphasis on health optimization in latest blog post
8. **Material-UI Usage:** Only icons imported, minimal Material-UI usage overall
9. **Responsive Design:** Extensive media queries for mobile optimization
10. **Animation Details:** Rocket component has custom shake animation defined in home.styles

---

## STRUCTURE FOR MIGRATION PLANNING

This portfolio contains:
- **7 Main Components** (Home, About, Blog, Portfolio, Resume, Header variants)
- **4 Blog Posts** (3 published, 1 draft)
- **8 Images** + **3 GIFs** + **1 PDF resume**
- **11+ Course links** (external)
- **5 Social media profiles** (external)
- **1 Project showcase** (GitHub + Heroku)
- **Extensive written content** (3 blog posts totaling thousands of words)
- **Detailed learning roadmap** (9-step programming curriculum)
- **Health & wellness guide** (comprehensive daily habits)

**Critical Content to Preserve:**
- All blog post text (especially the detailed learning guide)
- All social/contact links
- Project information (Clothing app)
- Resume data (PDF + image)
- Course learning path
- All personal information and stories
