var numberToGuess = Math.floor(Math.random() * 2) + 1;
var maxAttempts = 3;
// console.log(numberToGuess)
for (var attempt = 0; attempt < maxAttempts; attempt++) {
    var userGuess = prompt("Zadejte číslo od 1 do 10:");
    // console.log(userGuess, numberToGuess)
    // console.log(typeof(userGuess), typeof(numberToGuess))
    if (parseInt(userGuess) == numberToGuess) {
        alert("Gratuluji, uhodl jste číslo!");
        break;
    } else {
        alert("Bohužel, neuhodl jste. Zkuste to znovu.");
    }
}

if (attempt == maxAttempts) {
    alert("Bohužel, neuhodl jste číslo. Správné číslo bylo " + numberToGuess + ".");
}