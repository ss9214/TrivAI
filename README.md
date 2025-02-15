## Welcome to [TrivAI](https://www.trivai.co)!

### <ins>Inspiration</ins>
Our inspiration came from playing lots and lots of jackbox, as well as our kahoot days from high school! We know that many high school teachers find it hard to make kahoots for their classes, especially those with hard topics, so we wanted to create an easy, interactive, and scalable way for teachers to quiz their students, not to mention students themselves can use this game to study!
### <ins>What it does</ins>
Our project is called TrivAI. TrivAI is a trivia-based game that allows users to upload a document of any format or a youtube link and create a set amount of trivia questions using the power of GenAI and NLP. Players can join a game with a room code and a player name, similar to jackbox and skribbl.io. Each player gets a set amount of 8000 life points, and the player with the most life points once all the trivia questions are over, or if only 1 person is left, will win the game. However, speed matters! First place will lose 0 life points, and the last person to get it correct will lose 500 life points. Anyone who gets the question wrong will lose 1000 points!
### <ins>How we built it</ins>
We wanted to use React on our frontend, which is great for interactive web-based games. Our goal was to make a clean, detailed, scalable frontend for our game. We decided to use FastAPI with AWS for our backend, for our document, user, and game storage. Our backend handles all of the heavy computation, changes to the game state and player states, as well as any document uploading. Our genAI component was built with OpenAI, Langchain, VertexAI, and pandas. 
### <ins>Challenges we ran into</ins>

### <ins>Accomplishments that we're proud of</ins>

### <ins>What we learned</ins>

### <ins>What's next for TrivAI</ins>
