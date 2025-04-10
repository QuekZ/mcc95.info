let myWords = [
    " Web Design ",
    " Graphic Design ",
    " Computer Graphics ",
    " Web Development",
    " Fighting Games",
    " Drawing",
    " Computers",
    " Programming",
    " Fitness",
    " JavaScript"
];


setInterval(
    function generateWord() {
        let randomWord = myWords[Math.floor(Math.random() * myWords.length)];
        document.getElementById("changeWord").innerHTML = randomWord;
        document.getElementById("changeWord").style.backgroundColor = "#000020";
        document.getElementById("changeWord").style.color = "#fff";
    },
    3000
);