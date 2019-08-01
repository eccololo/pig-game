<<<<<<< HEAD

=======
/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
- The player loses his entire score when he hits two times number 6.
*/

/*
Debugging:

/*

POMYSLY NA ULEPSZENIE:

*/
>>>>>>> Update of app, adding few things

var scores, roundScore, activePlayer, gamePlaying, hitsHistory, maxScore, qAndA, timerCounter, myTimeout;

var numOfOnes, hitsHistory2Players, numOf2Times6, numOfAnswersCorrect,numOfAnswersWrong;    

//Kiedy klikamy na Roll
document.querySelector('.btn-roll').addEventListener('click', function(){
    
    if(gamePlaying){
            //1. Get a random number.
            var dice = Math.floor(Math.random() * 6) + 1;
            var dice1 = Math.floor(Math.random() * 6) + 1;
           
            hitsHistory.push(dice);
            hitsHistory.push(dice1);
        
            //Zliczamy sume wypadnietych liczb zeby obliczyc srednia arytmetyczna
            hitsHistory2Players[activePlayer].push(dice);
            hitsHistory2Players[activePlayer].push(dice1);
            
            //Jesli oddalismy co najmniej dwa rzuty kostka
            //i ostatni i przed ostatni rzut wyniosl 6 zerujemy wynik
            if((hitsHistory.length >= 2) && 
               (hitsHistory[hitsHistory.length-1] === 6) && (hitsHistory[hitsHistory.length-2] === 6)){   
               
                //Zliczamy ilosc wypadnietych podwojnych 6-tek
                numOf2Times6[activePlayer] += 1;
                console.log("Player " + (activePlayer+1) + " num of double 6: " + numOf2Times6[activePlayer]);
                
                //Wpisujemy logi i pokazujemy graczowi komunikat.
                console.log("Gracz " + (activePlayer+1) + " wyrzucil dwie 6-tki."); 
               $(".player-info").text("Player "  + (activePlayer+1) + " roll 6 two times. Lose all points.").fadeIn(30).fadeOut(1900);
                    
               // Zerujemy perm wynik gracza
               document.getElementById('score-' + activePlayer).textContent = 0;
               scores[activePlayer] = 0;
               nextPlayer();
            }else{

                    //2. Display the result.
                    var diceDOM = document.querySelector('.dice'); 
                    diceDOM.style.display = 'block';
                    diceDOM.src = 'img/dice-' + dice + '.png';
                
                    var dice1DOM = document.querySelector('.dice1'); 
                    dice1DOM.style.display = 'block';
                    dice1DOM.src = 'img/dice-' + dice1 + '.png';

                    //3. Update the round score if the number was NOT 1.
                    if(dice !== 1 && dice1 !== 1){
                        //Add score
                        roundScore += (dice + dice1);
                        document.getElementById('current-'+activePlayer).textContent = roundScore;    
                    }else{
                        //Zliczamy ilosc wypadnietych jedynek 
                        numOfOnes[activePlayer] += 1;
                        console.log("Player " + (activePlayer+1) + " num of 1: " + numOfOnes[activePlayer]);
                        
                        //Dajemy graczowi szanse zadajac mu pytanie, jesli odpowie poprawnie
                        //zachowuje punkty, jesli zle traci je
                        //Mamy 33% szans ze pojawi sie nam pytanie
                        var chanceToShow = Math.floor(Math.random() * 3) + 1;
                        //25% szans na pytanie i uratowanie punktow 
                        if(chanceToShow === 1){
                            //szansa dla gracza
                            var randomQuestionIndex = Math.floor(Math.random() * 19) + 1;
                            var randomQuestion = qAndA[randomQuestionIndex][0];
                            var answer = qAndA[randomQuestionIndex][1];

                            //przekazujemy text pytania do GUI i wyswietlamy block
                            $('.qanda-div').fadeIn(400);
                            document.querySelector('.overlay').style.display = "block";
                            document.getElementById('question').textContent = randomQuestion;

                            //Po 5 sekundach znika wszystko
                            myTimeout = setInterval(incrementTimer, 500);

                            //Programujemy handlery obslugujace buttony true i false kiedy mamy pytanie
                $("#answer_true").unbind("click").click(function(){ 
                                    checkIfCorrectAnswer(answer, true);

                             });
                $("#answer_false").unbind("click").click(function(){
                                    checkIfCorrectAnswer(answer, false);
                            });


                        }else{
                            //Next player jesli pytanie sie nie pojawilo
                            //console.log("Gracz " + (activePlayer+1) + " wyrzucil 1-ke.");
                            $(".player-info").text("Roll 1. Next player turn.").fadeIn(20).fadeOut(2600);
                            nextPlayer();   
                        }    
                    }
        }
    }
});

//Programujemy button zatrzymania punktów 
document.querySelector('.btn-hold').addEventListener('click',function(){
    
    if(gamePlaying){
            //1. Przepisujemy wynik tymczasowy punktow do wyniku stalego
            scores[activePlayer] += roundScore;  
            console.log("Gracz " + (activePlayer+1) + " uzyskal " + roundScore + " punktow.");

            //2. Updateujemy UI
            document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
            
                                               
            //3. Check if player won the game
            checkIfIsWin(); 
    }
});

//programujemy inicjalizacje nowej gry
document.querySelector('.btn-new').addEventListener('click',init);
document.querySelector('.btn-new').addEventListener('click',function(){
    document.querySelector('.input-max-score').readOnly = true;
});

//Programujemy zamykanie okna z info o grze oraz jego otwieranie
document.getElementById('close').addEventListener('click',function(){
   $('.game-rules').fadeOut(700);
   document.querySelector('.overlay').style.display = "none";
});
document.getElementById('btn-game-info').addEventListener('click',function(){
   $('.game-rules').fadeIn(700);
   document.querySelector('.overlay').style.display = "block";
});

//Zamykanie okna ze statystykami
document.getElementById('close-stats').addEventListener('click',function(){
   $('.stats-div').fadeOut(700);
   document.querySelector('.overlay').style.display = "none";
});


function nextPlayer(){
        roundScore = 0;
        document.getElementById('current-'+activePlayer).textContent = 0;    
        
        //Przelaczamy players
        activePlayer === 0 ? activePlayer = 1 : activePlayer = 0 ;
        
        //Przelaczamy klase active
        document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active');
        
        //Wylaczamy kostki
        document.querySelector('.dice').style.display = 'none';
        document.querySelector('.dice1').style.display = 'none';
}

function init(){
    scores = [0,0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;
    hitsHistory = new Array();
    maxScore = 200;
    timerCounter = 0;
    numOfOnes = [];
    numOf2Times6 = [];
    numOfAnswersCorrect = [];
    numOfAnswersWrong = [];
    hitsHistory2Players = [[],[]];
    
    numOfOnes[0] = 0;
    numOfOnes[1] = 0;
    numOf2Times6[0] = 0;
    numOf2Times6[1] = 0;
    numOfAnswersCorrect[0] = 0;
    numOfAnswersCorrect[1] = 0;
    numOfAnswersWrong[0] = 0;
    numOfAnswersWrong[1] = 0;
    hitsHistory2Players[0] = [];
    hitsHistory2Players[1] = [];
    
    //Na poczatku maxScore 
    var tryScore = document.querySelector('.input-max-score').value;
    
    //Jesli gracze ustawili inny wynik i jest on liczba
    if(tryScore != 200 && !isNaN(tryScore)){
       //Ustawiamy na taki wynik jaki gracze sobie rzycza
       maxScore = parseInt(tryScore);   
    }
    
    //Zerujemy wyniki gry
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;
    document.getElementById('score-0').textContent = 0;
    document.getElementById('score-1').textContent = 0;

    //Na poczatku kostka nie jest widoczna
    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice1').style.display = 'none';
    
    //resetujemy style i nazwe gracza 
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    
    document.querySelector('.player-0-panel').classList.add('active');
    
    document.querySelector('.input-max-score').value = maxScore; 
    
    document.querySelector('.btn-roll').disabled = false;
    document.querySelector('.btn-hold').disabled = false;
    
    //Tworzymy tablice pytan i odpowiedzi 
    qAndA = [
      ["The capitol of France is Paris ?", true],
      ["We need oxygen to live ?", true],
      ["Dinosaurs lived 10 000 years ago ?", false],
      ["Age of Earth is about 100 milions of years old ?", false],
      ["Stephen Hawking is a scientist who specialise in black holes ?", true],
      ["Michael Faraday was born in rich family ?", false],
      ["Alan Turing was precursor of computers ? ", true],
      ["Australia is a continent ?", true],
      ["Algebra derives from roman language ?", false],
      ["Bacterias can survive without air in space ?",true],
      ["Core of Earth is made from metal ?", true],
      ["Pleiadas is a group of rocks orbiting some star", false],
      ["Speed of light is about 300 000 km/h ?", true],
      ["Albert Einstein was inventor of relativity theory ?", true],
      ["Adolf Histler annected Austria to Germany right before WW2 ?", true],
      ["Still unsolved algorythm problem is the shortest road algorithm ?", true],
      ["Plants needs gamma rays to grow ?", false],
      ["Sun has approximately few milions of year ?", false],
      ["Isaac Newton died as a virgin ?", true],
      ["Cecilia Payne discovered of true matter composition of Sun ?", true],
      ["We don't use Fortran as a programing language anymore ?", true],
      ["Eberstark was a famous linguist who knew many languages ?", true],
      ["If ice from poles will melt giraffas will extinct ?", false]
    ];
}

//Funkcja zwiększająca pasek odliczania
function incrementTimer(){
    timerCounter++;
    switch(timerCounter){
        case 1:
            document.querySelector('.time-counter-inner').style.width = 50 + "px";
            break;
        case 2:
            document.querySelector('.time-counter-inner').style.width = 100 + "px";
            break;
        case 3:
            document.querySelector('.time-counter-inner').style.width = 150 + "px";
            break;
        case 4:
            document.querySelector('.time-counter-inner').style.width = 200 + "px";
            break;
        case 5:
            document.querySelector('.time-counter-inner').style.width = 250 + "px";
            break;
        case 6:
            document.querySelector('.time-counter-inner').style.width = 300 + "px";
            break;
        case 7:
            document.querySelector('.time-counter-inner').style.width = 350 + "px";
            break;
        case 8:
            document.querySelector('.time-counter-inner').style.width = 400 + "px";
            break;
        case 9:
            document.querySelector('.time-counter-inner').style.width = 450 + "px";
            break;
        case 10:
            document.querySelector('.time-counter-inner').style.width = 500 + "px";
            break;
    }
    //Po pieciu sekundach okienko znika.
    if(timerCounter === 10){
         closeAnswerWindow(false);   
    }
   
}

function closeAnswerWindow(fromAnswer){
        
        clearInterval(myTimeout);
        $('.qanda-div').fadeOut(700);
        document.querySelector('.overlay').style.display = "none";
        document.querySelector('.time-counter-inner').style.width = "0";
        timerCounter = 0;
        //Jesli wywolujemy ta funkcje kiedy uplynol czas na odpowiedz
        if(!fromAnswer){
           nextPlayer();    
        }
        
}

function checkIfCorrectAnswer(answer, myAnswer){
     //Sprawdzamy czy odpowiedzielismy poprawnie
     if(answer === myAnswer){
        //Jesli odpowidzielismy pioprawnie zachowuje punkty i przelaczamy gracza 
            //Zliczamy ilosc dobrych odpowiedzi
            numOfAnswersCorrect[activePlayer] += 1;
            
            $(".player-info").text("Correct.").fadeIn(30).fadeOut(1900);;
            closeAnswerWindow(true); 
            nextPlayerButHold();
      }else{
        //Jesli zle traci punkty i przelaczamy gracza
            //Zliczamy ilosc zlych odpowiedzi
            numOfAnswersWrong[activePlayer] += 1;
          
            $(".player-info").text("Wrong.").fadeIn(30).fadeOut(1900);;
            closeAnswerWindow(true); 
            nextPlayer();
        }
}

//Funkcja wywołuje się jeśli odpowiedzieliśmy poprawnie na pytanie
function nextPlayerButHold(){
        //Przepisujemy wynik tymczasowy punktow do wyniku stalego jesli odpowiedzielismy //poprawnie na pytanie
        scores[activePlayer] += roundScore;  
        console.log("Gracz " + (activePlayer+1) + " uzyskal " + roundScore + " punktow.");

        //Updateujemy UI
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        //Zwerujemy temp score i UI score
        roundScore = 0;
        document.getElementById('current-'+activePlayer).textContent = 0; 
       
        checkIfIsWin();
}

//Funkcja sprawdza czy gracz wygral czyli osiagnal lub przekroczyl wymagana ilosc punktow
function checkIfIsWin(){
            //3. Check if player won the game
            if(scores[activePlayer] >= maxScore){
                document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
                document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
                document.getElementById('name-' + activePlayer).textContent = 'Winner!';
                document.querySelector('.dice').style.display = 'none';
                document.querySelector('.dice1').style.display = 'none';
                document.querySelector('.input-max-score').readOnly = false;

                gamePlaying = false;
                document.querySelector('.btn-roll').disabled = true;
                document.querySelector('.btn-hold').disabled = true;
                
                //Konfigurujemy stats div, wpisujemy wartości
                document.getElementById("num-of-ones-0").textContent = numOfOnes[0];
                document.getElementById("num-of-ones-1").textContent = numOfOnes[1];
                document.getElementById("num-of-double6-0").textContent = numOf2Times6[0];
                document.getElementById("num-of-double6-1").textContent = numOf2Times6[1];
                document.getElementById("num-of-correct-0").textContent = numOfAnswersCorrect[0];
                document.getElementById("num-of-correct-1").textContent = numOfAnswersCorrect[1];
                document.getElementById("num-of-wrong-0").textContent = numOfAnswersWrong[0];
                document.getElementById("num-of-wrong-1").textContent = numOfAnswersWrong[1];
                
                //Obliczamy srednia arytmetyczna wyrzuconych punktow
                var average = 0;
                var sum = 0;
                for(var i = 0; i < hitsHistory2Players[0].length; i++ ){
                    sum += hitsHistory2Players[0][i];
                }
                
                average = parseInt(sum / parseInt(hitsHistory2Players[0].length / 2));
                
                document.getElementById("num-of-aver-0").textContent = average ;
                
                average = 0;
                sum = 0;
                for(i = 0; i < hitsHistory2Players[1].length; i++ ){
                    sum += hitsHistory2Players[1][i];
                }
                
                average = parseInt(sum / parseInt(hitsHistory2Players[1].length / 2));
                
                
                document.getElementById("num-of-aver-1").textContent = average;
                
                showStatsDiv();
                
            }else{
                //4. Nastepny gracz
                nextPlayer();
            }    
}

function showStatsDiv(){
    document.querySelector('.overlay').style.display = "block";
    $(".stats-div").fadeIn(1500);
}