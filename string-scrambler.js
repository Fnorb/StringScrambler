function StringScrambler() {
    this.strList = []; //array of at least two different strings
    this.scrambleSpeed = 100; //speed at which letters change in MS
    this.currentString = ""; //string between transitions
    this.currentStringId = -1; //id of the string transitioning from
    this.targetStringId = 0; //id of the string transitioning to
    this.randomIdOrder = true; //go through the string array randomly
    this.sleepTime = 0; //break after complete transitions in ms
    this.diffLetters = []; //array of letters that still need to be changed to complete transition
    this.intervallID = 0; //id of the interval doing the transition
    this.outputElement;
    //this.stopCondition = -1; //when the scrambling stops for good. values: -1 = never, 0 = after each string has been scrambled once, >0 = after that many scrambles

    this.go = function() {
        var readyToGo = true;

        if(this.outputElement == undefined) {
            console.log("outputElement variable needs an Element. Current content: ",this.outputElement);
            readyToGo = false;
        }

        if(this.strList.length < 2) {
            console.log("strList variable needs at least two different Strings. Current content: ", this.strList);
            readyToGo = false;
        }
        else if(this.strList[0] == this.strList[1] && this.strList.length == 2) {
            console.log("strList variable needs at least two different Strings. Current content: ", this.strList);
            readyToGo = false;
        }

        if(readyToGo) {

            if(this.randomIdOrder) {
                this.targetStringId = Math.floor(Math.random() * this.strList.length);
            }
            this.currentString = this.strList[0];

            this.generateNewIds();
            this.intervallID = setInterval(this.tick, this.scrambleSpeed);
        }
    };

    this.tick = function() {
        if(this.currentString == this.strList[this.targetStringId]) {
            this.generateNewIds();
            this.diffLetters = [];
            this.sleep();
        }
        else {
            this.adjustStringContent();
            this.adjustStringSize();

            this.outputElement.innerHTML = this.currentString;
        }

    }.bind(this);

    this.generateNewIds = function() {
        this.currentStringId = this.targetStringId;

        if(this.randomIdOrder) {
            this.targetStringId = Math.floor(Math.random() * this.strList.length);
            while(this.currentStringId == this.targetStringId) {
                this.targetStringId = Math.floor(Math.random() * this.strList.length);
            }
        }
        else {
            this.targetStringId++;

            if(this.targetStringId == this.strList.length) {
                this.targetStringId = 0;
            }
        }
    };

    this.adjustStringContent = function() {
        var letters = [];
        var targetString = this.strList[this.targetStringId];

        for(var i = 0; i < this.currentString.length; i++) {
            if(i < targetString.length) {
                if(this.currentString[i] != targetString[i]) {
                    letters.push({letter: targetString.substr(i, 1), id: i});
                }
            }
        }
        this.diffLetters = letters;

        var chosenLetter = letters[Math.floor(Math.random() * letters.length)];
        if(chosenLetter) {
            var newString = this.currentString.substr(0, chosenLetter.id) + chosenLetter.letter + this.currentString.substr(chosenLetter.id + 1)
            this.currentString = newString;
        }
    };

    this.adjustStringSize = function() {
        var targetString = this.strList[this.targetStringId];
        if(this.shouldWeAlterTheStringLength()) {
            var sizeDiff = this.currentString.length - targetString.length;

            if(sizeDiff > 0) {
                this.currentString = this.currentString.substr(0, this.currentString.length - 1);
            }
            else {
                this.currentString += targetString.substr(this.currentString.length, 1);
            }

        }

    };

    this.shouldWeAlterTheStringLength = function() {
        var targetString = this.strList[this.targetStringId];
        var sizeDiff = this.currentString.length - targetString.length;
        var letterDiffCount = this.diffLetters.length;

        if(sizeDiff != 0) {
            var prob = 1;
            for(var i = 0; i < letterDiffCount; i++) {
                prob *= 0.7;
            }

            if(Math.random() < prob) {
                return true;
            }
        }
        return false;
    };

    this.sleep = function() {
        if(this.sleepTime > 0) {
            clearInterval(this.intervallID);

            setTimeout(function() {
                this.intervallID = setInterval(this.tick, this.scrambleSpeed);
            }.bind(this), this.sleepTime);
        }
    };
}