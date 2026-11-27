# Rock Paper Scissors Lizard Spock game ✊ 🖐 ✌️ 🤏 🖖

![HTML](./tech/html.png) ![CSS](./tech/css.png) ![Typescript](./tech/typescript.png) ![Vite](./tech/vite.png) ![React](./tech/react.png) ![Vitest](./tech/vitest.png) ![gitpod](./tech/gitpod.png)

Introducing an enriched iteration of the classic 'Rock Paper Scissors' game, this version introduces two additional variables, elevating the decision-making process to new heights. Players make their selections simultaneously, infusing an element of suspense into each move. While this version is versatile enough for multiple players, this particular application is designed for a captivating two-player interaction. It pits the user against the computer, offering a game tailored for enthusiasts who appreciate pop culture references and delight in playful, social games. Triumph is attained by strategically outsmarting the computer's selections and selecting the icon that counters its choice. In the event of a tied match, a rematch ensues, persisting until a decisive victor emerges.

This tailored application revolves around a user-computer dynamic, providing an experience that appeals to a wide range of age groups, from teenagers to adults who are familiar with the show and its references. A game is won by the first side to win 5 rounds. Drawn rounds don't count towards either score, so a game lasts as many rounds as it takes. Round scores are prominently displayed below the array of game icons, ensuring a clear view of the ongoing battle. Initiating gameplay is effortless: a simple click on the "Play game" button followed by a game icon (✊, 🖐, ✌️, 🤏, 🖖) in the main user interface and the computer will counter with its own randomized choice, culminating in an entertaining clash of wits!

I built this project in stages, starting with HTML and CSS to create the basic layout. I then added JavaScript to handle user interactions and game logic. As the project grew, I introduced TypeScript to improve code reliability and make it easier to maintain. I also switched to Vite for a faster development workflow. Finally, I rebuilt the app using React, which allowed me to break the UI into reusable components and manage state more effectively.

This project is a two-player version of Rock Paper Scissors Lizard Spock, inspired by The Big Bang Theory. The player competes against an AI, with each round producing a clear outcome based on the game rules. Expanding the classic game with extra choices adds more variety and makes the gameplay a bit more strategic, while still keeping it simple and quick to play.

You can play the game on the live site [here](https://sasantazayoni.github.io/rock-paper-scissors-lizard-spock/).

![Rock paper scissors lizard spock game on various devices](documentation/responsiveness.png)

## Table of Contents

- [User Experience](#user-experience)
  - [User stories](#user-stories)
  - [Design](#design)
    - [Overall feel](#overall-feel)
    - [Colour Scheme](#colour-scheme)
    - [Typography](#typography)
  - [Wireframes](#wireframes)
- [Features](#features)
  - [Current features](#current-features)
  - [Accessibility](#accessibility)
  - [Future features](#future-features)
- [Technologies used](#technologies-used)
  - [Languages & tools used](#languages--tools-used)
  - [Frameworks, libraries and programs used](#frameworks-libraries-and-programs-used)
- [Testing](#testing)
  - [Automated tests](#automated-tests)
  - [Validator testing](#validator-testing)
  - [Testing User Stories from (UX) section](#testing-user-stories-from-ux-section)
  - [Personal testing](#personal-testing)
  - [Lighthouse testing](#lighthouse-testing)
  - [PowerMapper Compatibility](#powermapper-compatibility)
  - [Bugs](#bugs)
- [Deployment](#deployment)
  - [Running locally](#running-locally)
- [Credits](#credits)

## User Experience

### User stories

- As a user, I want to immediately understand what the game is about and how it works.
- As a user, I want to play the game as soon as possible.
- As a user, I want a clear indication of my current score and to know my round result each time I play a round.
- As a user, I want to be able to keep a record of and track how many games I have won or lost overall.
- As a user, I want to be able to check the game instructions in case I forget how the game works.
- As a user, I want to be able to reset the record of game results.

### Design

#### Overall feel

Embodying a modern and captivating aesthetic, this application offers an overall ambience that is both contemporary and visually pleasing. While its primary role is to provide entertainment, it also serves as a valuable tool for resolving disagreements when consensus proves elusive.

#### Colour scheme

![Color Swatches](documentation/colours.png)

This carefully curated color combination blends bold contrasts and soothing shades to enhance user experience, infuse energy, and maintain visual clarity in our web application.

#### Typography

'Exo 2' is the font of choice in this application with a fallback of the font-stack 'Arial, Helvetica, sans-serif'. This was a deliberate decision to align with the game's dynamic and modern aesthetic. With its geometric letterforms and clean lines, Exo 2 effectively captures the energy and excitement that our game offers. Its legibility and versatility ensure that players can navigate effortlessly while being immersed in the vibrant experience we've crafted.

#### Wireframes

Comprehensive wireframes were developed to cater to all screen sizes. The decision to create single wireframes, without the need for variations in different screen sizes, was driven by the minimal impact on design elements beyond font and icon sizes. Explore the wireframes here:

The main game UI: <br>

![The main game UI](documentation/main-ui-wframe.jpg) <br>

The rules modal: <br>

![The rules modal](documentation/rules-modal-wframe.jpg) <br>

The game scores modal: <br>

![The game scores modal](documentation/scores-modal-wframe.jpg) <br>

The main game UI with an open modal: <br>

![The main game UI with an open modal](documentation/main-ui-with-open-modal-wframe.jpg) <br>

## Features

### Current features

- The application is designed using Responsive Design and is fully responsive on all devices. This includes the modals and their content.
- All buttons have a neon glow effect when hovered over for an enhanced user experience: <br>
  - Buttons: <br>

  ![The reset button](documentation/resetbtn.jpg)
  ![The open-rules button](documentation/openrulesbtn.jpg)
  ![The open-scores button](documentation/openscoresbtn.jpg)
  ![The close-rules button](documentation/closerulesbtn.jpg)
  ![The close-scores button](documentation/closescoresbtn.jpg)
  - Buttons with hover effects: <br>

  ![The reset button with hover](documentation/resetbtnhover.jpg)
  ![The open-rules button with hover](documentation/openrulesbtnhover.jpg)
  ![The open-scores button with hover](documentation/openscoresbtnhover.jpg)
  ![The close-rules button with hover](documentation/closerulesbtnhover.jpg)
  ![The close-scores button with hover](documentation/closescoresbtnhover.jpg)

- The reset button has an additional ripple effect that spreads out from where it is clicked, to make it clear that the game has been reset: <br>

  ![The reset button ripple effect](documentation/resetbtnpulse.jpg)

- Clicking on the "See rules" button opens the rules modal (can be done at any time): <br>

  ![The rules modal](documentation/rulesmodal.jpg)

- Clicking on the "Wins & losses" button opens the game scores modal (can be done at any time): <br>

  ![The game scores modal](documentation/scoresmodal.jpg)

- Modals can be closed by clicking on the button corresponding to the modal, by clicking on the dimmed background around it or by pressing Escape. While a modal is open, the rest of the page can't be used.
- The game icons have a hover effect on them indicating that they can be interacted with: <br>

  ![The game icons](documentation/icons.jpg)

- Whenever an icon is clicked, it is compared against the computer's choice (which is random) and the UI is updated accordingly.
  - When the player wins, the round score of the player is incremented by 1 and the player's chosen icon is displayed with maximum opacity and slightly enlarged in the space beneath the player's round score while the computer's choice is displayed with partial opacity in the space beneath the computer's round score: <br>

  ![Winning a round](documentation/win.jpg)
  - When the player loses, the round score of the computer is incremented by 1 and the computer's chosen icon is displayed with maximum opacity and slightly enlarged in the space beneath the computer's round score while the player's choice is displayed with partial opacity in the space beneath the player's round score: <br>

  ![Losing a round](documentation/lose.jpg)
  - In the case of a draw, neither round is incremented and both chosen icons display with partial opacity beneath the respective scores

  ![Drawing a round](documentation/draw.jpg)

- After each round, the results are recorded both in the round scores and in the UI so that the player can see their previous choices as well as the computer's. For each round played, the icons selected will appear on top of the icons selected in the previous round (i.e. Older rounds will get pushed down the page). The viewport will extend in size if there are many round played:

  ![Multiple rounds played](documentation/multiround.jpg)

- The game ends when either the player or the computer has 5 round wins. This increments the game scores in the scores modal and is stored in local storage in case the player closes their browser. If the browser blocks local storage, the totals still count for the current visit. Text is dynamically inserted into the scores modal depending on whether the player has won or lost the game and then removed when the modal is closed:

  ![End of game text](documentation/dynamictext.jpg)

- When the modal is closed after a game end, the round scores reset to 0 for both the player and the computer and all added icons are removed from the page (the game is reset).
- The reset button in the main UI resets everything: the current game (round scores and the icons from previous rounds) and the overall wins and losses.

### Accessibility

- The modals are native dialogs. While one is open, the page behind it can't be used, Escape closes it, and keyboard focus moves into it and returns to where it was when it closes.
- Each round's result is announced to screen readers, for example "Round 2: you chose Paper, the computer chose Scissors. The computer wins the round. Score: you 1, computer 1."
- The icons in the round history have spoken names, such as "Rock, won the round", instead of being read out as emoji.
- The game icons show a clear outline when they are reached with the keyboard.
- Text and score colours meet the WCAG AA contrast ratio of at least 4.5:1.
- Every button's accessible name matches its visible text, so voice-control users can say what they see.

### Future features

- A voice recognition can be introduced for a better user experience. This should be able to open the rules, check the scores, close modals, reset and play the game by saying simple commands like "Rules" or "Scores" or "Lizard".
- A feature can be added to allow multiple players to play against each other.

## Technologies used

### Languages & tools used

- HTML5
- CSS3
- TypeScript
- React
- Vite
- Vitest, React Testing Library and jsdom (automated tests)
- ESLint (code linting)

### Frameworks, libraries and programs used

- [Primer Octicons](https://primer.style/octicons/) used for the GitHub icon (MIT licence).
- [Coolors](https://coolors.co/) used to display colour palette used on the website.
- [Google Fonts](https://fonts.google.com/) used to import 'Exo 2' font.
- [Github](https://github.com/) used to host repository.
- [Github pages](https://pages.github.com/) used to host the application.
- [GitHub Actions](https://github.com/features/actions) used to test, build and deploy the application.
- [Gitpod](https://www.gitpod.io/) used to develop project and organise version control.
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) used for performance review.
- [Caniuse](https://caniuse.com/) used to check compatibility of code syntax with other browsers.
- [PowerMapper](https://www.powermapper.com/) used to check compatibility of website with other browsers.
- [Am I Responsive](https://amiresponsive.co.uk/) used to display website on the most common devices.
- [StackOverflow](https://stackoverflow.com/) used to problem solve and deal with queries.
- [Getemoji](https://getemoji.com/) used to obtain game icons.
- [Seekpng](https://www.seekpng.com/) used to obtain rules modal image.
- [Favicon.io](https://favicon.io/) used to generate favicon.

## Testing

### Automated tests

The game has a suite of automated tests written with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), running in a simulated browser ([jsdom](https://github.com/jsdom/jsdom)). They cover:

- all 25 matchups of the game rules, checked against an independently written list of the 10 winning pairs
- scoring, game over at 5 wins, and ignoring clicks once a game is over
- saving and loading total wins and losses, including corrupted data and browsers that block storage
- the modals: opening, closing with the buttons, the background or Escape, and where keyboard focus goes
- the screen-reader announcements and the round history

Run them with `npm test` (see [Running locally](#running-locally)). They also run automatically before every deployment, so a failing test stops a broken version from going live.

### Validator testing

I used the following websites to check my code for syntax errors:

- [HTML validator](https://validator.w3.org/)
- [CSS validator](https://jigsaw.w3.org/css-validator/)

The TypeScript code is checked by the TypeScript compiler and by [ESLint](https://eslint.org/) (`npm run lint`), which also run before every deployment.

### Testing User Stories from (UX) section

- As a user, I want to immediately understand what the game is about and how it works.
  - Upon opening the application the rules modal is already open. This explains the rules of the game and how to play.
  - Screenshot of the view when the application is opened: <br>

    ![The rules modal](documentation/rulesmodal.jpg) <br>

- As a user, I want to play the game as soon as possible.
  - The "play game" button (see previous screenshot) is clearly visible within the rules modal and on clicking gives access to the main game UI.
  - Alternatively, clicking the dimmed background or pressing Escape closes the modal and gives access to the main game UI. <br>
- As a user, I want a clear indication of my current score and to know my round result each time I play a round.
  - The scores are clearly indicated in the main UI: <br>

    ![The round scores](documentation/roundresult.jpg) <br>

- As a user, I want to be able to keep a record of and track how many games I have won or lost overall.
  - Clicking the "Wins & losses" button in the main UI will display the game scores modal: <br>

    ![The game scores modal](documentation/scoresmodal.jpg) <br>

- As a user, I want to be able to check the game instructions in case I forget how the game works.
  - Clicking the "See rules" button in the main UI will open a modal that displays the rules: <br>

    ![The rules modal](documentation/rulesmodal.jpg) <br>

- As a user, I want to be able to reset the record of game results.
  - Clicking the "Reset" button on the main UI which is visible in the main UI will achieve this: <br>

    ![The reset button](documentation/resetbtn.jpg) <br>

### Personal testing

- Samsung Galaxy S9
  - Samsung Internet
  - Microsoft Edge
  - Mozilla Firefox
  - Google Chrome
- iPhone 6
  - Safari
- iPhone SE
  - Safari
  - Google Chrome
- iPhone 12 Mini
  - Safari
- iPhone 14
  - Safari
- iPad 11" Pro
  - Safari
- Aorus 7
  - Google Chrome
  - Mozilla Firefox
  - Microsoft Edge
  - Opera
  - Brave

### Lighthouse testing

Lighthouse was a helpful tool for checking where the website was experiencing the most issues.

![Lighthouse performance test](documentation/lighthouse.jpg)

The results show that the web application stands as an example of meticulous development, boasting exceptional scores across key criteria. With an unwavering commitment to inclusivity, the application achieves a perfect 100% for accessibility, ensuring that all users can seamlessly engage with its content. Fast loading times contribute to an impeccable 100% performance rating, enhancing the user experience. A strong 100% SEO score reflects the dedication to visibility and discoverability on the web. While the commitment to best practices is evident with a commendable 92%, the relentless pursuit of excellence in every facet is evident. This holistic approach culminates in an application that embodies both cutting-edge technology and user-centric design.

### PowerMapper Compatibility

![PowerMapper compatibility test](documentation/powermapper.jpg)

As the results show, the application is highly compatible across all browsers.

### Bugs

- On a horizontal mobile view with specific phones, it is possible that the rules modal will not allow scrolling throughout the entire height of the modal (i.e. it may be possible that the title of the rules modal and the "Play game" button are inaccessible). This has been fixed by limiting the height of the rules modal ("max-height: 80vh;", or "70vh" on smaller screens) and letting it scroll ("overflow-y: auto;") in the ".rules-modal" CSS rule. The modal also opens scrolled to the top, so its title is always visible first.
- Emojis on iPhones exhibit varying formatting and can occupy a relatively larger width, particularly noticeable on smaller iPhone models with narrower viewport widths. Consequently, on these devices, emojis positioned at the extremities might experience partial cropping due to the spacing between them. Moving forward, I intend to exercise greater prudence when incorporating emojis in my future applications, taking into consideration these potential formatting and spacing issues.

## Deployment

The site is deployed to GitHub Pages by a GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)). On every push to the `main` branch it:

1. installs the dependencies with `npm ci`
2. runs ESLint and the automated tests
3. builds the site with Vite into the `dist/` folder
4. publishes `dist/` to GitHub Pages

If linting or any test fails, nothing is deployed and the live site stays as it was.

To deploy your own copy:

1. Fork or copy the repository on [GitHub](https://github.com/).
2. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. If your repository has a different name, change `base` in [vite.config.ts](vite.config.ts) to `/<your-repository-name>/`, and update the site address in [index.html](index.html) and [public/sitemap.xml](public/sitemap.xml).
4. Push to `main`. The workflow's progress is shown in the **Actions** tab, and the site address appears in **Settings → Pages** once it has finished.

### Running locally

You need [Node.js](https://nodejs.org/) 22.13 or later.

```bash
npm install       # install dependencies
npm run dev       # start the development server
npm test          # run the tests (re-runs on file changes)
npm run lint      # check the code with ESLint
npm run build     # type-check and build the site into dist/
npm run preview   # serve the built site locally
```

## Credits

- Thanks to [Kevin Powell](https://www.youtube.com/@KevinPowell) from YouTube for neon button hover-effect.
- Thanks to [WebDevSimplified](https://www.youtube.com/@WebDevSimplified) from YouTube for inspiration to build this project.
- Thanks to my friends and family for thoroughly testing out my web application and giving useful suggestions.
- Thanks to my mentor Antonio Rodriguez for the helpful direction in starting this project and all of the helpful resources provided that helped throughout.
