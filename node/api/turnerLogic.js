// @TODO shuffleArray?
// @TODO turner in a single word (Trespassing)

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * From http://stackoverflow.com
 */
//function shuffleArray(array) {
//    var currentIndex = array.length, temporaryValue, randomIndex;
//
//    // While there remain elements to shuffle...
//    while (0 !== currentIndex) {
//
//        // Pick a remaining element...
//        randomIndex = Math.floor(Math.random() * currentIndex);
//        currentIndex -= 1;
//
//        // And swap it with the current element.
//        temporaryValue = array[currentIndex];
//        array[currentIndex] = array[randomIndex];
//        array[randomIndex] = temporaryValue;
//    }
//
//    return array;
//}


//var originalText = "Tell me! Trespassing. I want to listen. What you have to say?To me;";


exports.turnerLogic = function(originalText) {
    var placeholderChar = "__x__";

    var regexAlphanumericCharacters = /\w+/;
    var separtorSentences = /([^\s*\w*\s*])/; //not alphanumeric characters with possible white spaces
    var separtorWords = /\s/; // white space
    var separatorAnyVowels = /([aeoui])/i;
    var separatorWordVowels = /([aeoui]\w*)/i;
    //var separatorWordVowels = /([aeoui]*[az&&[^aeiou]+)/i; //vowels followed by consonants

    var turnedText = "";
    var resultSentence= "";
    var consonants = [];


    var sentences = originalText.split(separtorSentences);

    //for every sentence
    for (var i = 0; i < sentences.length; i++) {
        consonants = [];
        resultSentence = "";

        var words = sentences[i].split(separtorWords);

        //for every word
        for (var n = 0; n < words.length; n++) {
            var letters = words[n].split(separatorWordVowels);

            //for every letter
            for (var k = 0; k < letters.length; k++) {
                // if current letters contain consonants, replace them with a placeholder and store them in a separate array
                // otherwise write the letters to the result string
                if (!separatorAnyVowels.test(letters[k]) && regexAlphanumericCharacters.test(letters[k])) {
                    consonants.push(letters[k]);
                    resultSentence += placeholderChar;
                } else {
                    resultSentence += letters[k];
                }
            }

            resultSentence += " "; // white space after words

        }

        // @TODO randomize?
        //consonants = shuffleArray(consonants);
        var resultS = resultSentence.replace(new RegExp(placeholderChar, 'g'), function (s) {
            return consonants.pop();
        });

        // concat result
        turnedText += resultS.trim().toLowerCase().capitalizeFirstLetter();

        //white spaces after sentences
        if ((i + 1) % 2 === 0) { // index is even
            turnedText += " ";
        }
    }

    return turnedText.trim();
};

//console.log(turnerLogic(originalText));