// menu variables
var scenarioTitle;
var noGuarantee;

// game constant arrays
var vaxDifficulty;
var transmissionDifficulty;
var recoveryDifficulty;
var independentOutbreakDifficulty;
var refuserDifficulty;

// cookies
var unlocks;
var saves;
var scores;
var unlockRequirement = 50;

// actual game constants
var graph;
var numberOfIndividuals;
var numberOfRefusers;
var numberOfVaccines;
var independentOutbreaks;
var transmissionRate;
var recoveryRate;
var speed = false;

// jquery-ui accordion function that draws difficulty buttons in each panel
$(function() {
    $( "#accordion" ).accordion();
    });
$( "#accordion" ).accordion({ heightStyle: "auto" });


// vax logo, top left
d3.select("body").append("div")
    .attr("class", "scenarioVaxLogoDiv")
    .text("VAX!")
    .style("cursor", "pointer")
    .on("click", function() {
        window.location.href = 'http://vax.herokuapp.com/'
    })

// scenario title above jquery-ui accordion
d3.select("body").append("div")
    .attr("class", "scenarioTitle")
    .text("Scenarios")
    .style("position", "absolute")
    .style("top", "170px")
    .style("left", "200px")
    .style("font-family", "Nunito")
    .style("font-size", "32px")
    .style("font-weight", "400")
    .style("color" , "#707070")


function selectScenario(difficulty) {
    noGuarantee = true;
    // when called, it will record the current active header title (scenario title)
    scenarioTitle = $(".ui-accordion-header-active").text();

    // conditional statements determine which scenario we're in and which constant to choose, given difficulty input
    // graph is then drawn to spec
    if (scenarioTitle == "Workplace / School") {
        numberOfIndividuals = 87;
        vaxDifficulty = [25,18,15];
        transmissionDifficulty = [0.08, 0.10, 0.15];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [3,4,5];
        refuserDifficulty = [3,7,14];
    }
    if (scenarioTitle == "Movie Theater / Lecture Hall") {
        numberOfIndividuals = 48;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,5,10];
    }
    if (scenarioTitle == "Restaurant") {
        numberOfIndividuals = 30;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,3,8];
    }
    if (scenarioTitle == "Organization") {
        numberOfIndividuals = 50;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,5,10];
    }
    if (scenarioTitle == "Endless Queue") {
        numberOfIndividuals = 25;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,3,8];
    }

    if (scenarioTitle == "Random Networks") {
        numberOfIndividuals = 25;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,3,8];
    }


    // now that the difficulty values have been chosen based on scenario, we set them based on difficulty
    setDifficultyConstants(scenarioTitle, difficulty);


    // remove accordion & title + move logo down

    d3.select("#accordion").remove()
    d3.select(".scenarioVaxLogoDiv").attr("class", "gameVaxLogoDiv").style("left", "0px")
    d3.select(".scenarioTitle").remove()

    //init footer nad move it down
    initFooter();
    d3.select(".gameMenuBox")
        .transition()
        .duration(100)
        .style("right", "0px")


    // reset onClick for development purposes
    d3.select(".gameMenuBox")
        .on("click", function() {
            window.location.href = 'http://0.0.0.0:3000/scenario'
        })

    window.setTimeout(function() {window.location.href = 'http://0.0.0.0:3000/scenarioGame'}, 500)
}

function createUnlocksCookie() {
    // object of unlocks for first scenario & random
    var initial = {easy: true, medium: false, hard:false};
    // object of unlocks for all the rest
    var locked = {easy: false, medium: false, hard:false};


    // unlocks object, to be strified into JSON cookie
    var unlocks = {work: {difficulty: initial}, theater: {difficulty:locked}, restaurant: {difficulty:locked}, club:  {difficulty:locked}, shop:  {difficulty:locked}, original:  {difficulty:initial}}

    // create JSON unlocks cookie
    $.cookie.json = true;
    var stringifiedUnlocks = JSON.stringify(unlocks);
    $.cookie('vaxUnlocks', stringifiedUnlocks, { expires: 365, path: '/' })
    unlocks = $.cookie('vaxUnlocks')
    console.log($.cookie('vaxUnlocks'))

}

function checkUnlockables() {
    $.cookie.json = true;
    unlocks = $.cookie('vaxUnlocks')
    if (unlocks == undefined) createUnlocksCookie();
    else modifyMenuByUnlocks();

    checkSavesCookie();
    checkScoresCookie();

}

function checkScoresCookie() {
    $.cookie.json = true;
    scores = $.cookie('vaxScores')
    if (scores == undefined) createScoresCookie();
    else postHighScores();

}

function postHighScores() {


    // this will read the high scores cookie and write the relevant hiScore next-to/below/whatevs the easy/med/hard text

}

function createScoresCookie() {
    // create empty score array
    var emptyScoreArray = [];

    // create an object that differentiates between real time and turn-based
    var emptyScoreObject = {
        realTime: {easy:emptyScoreArray, medium:emptyScoreArray, hard:emptyScoreArray},
        turnBased: {easy:emptyScoreArray, medium:emptyScoreArray, hard:emptyScoreArray}
    }

    // create the master object that is separated by scenario
    var scenarioScores = {
        work: emptyScoreObject,
        theater: emptyScoreObject,
        restaurant: emptyScoreObject,
        club: emptyScoreObject,
        shop: emptyScoreObject,
        original: emptyScoreObject
    }

    // write the cookie
    $.cookie.json = true;
    var stringifiedScores = JSON.stringify(scenarioScores);
    $.cookie('vaxScores', stringifiedScores, { expires: 365, path: '/' })
}

function checkSavesCookie() {
    saves = $.cookie('vaxSaves')
    if (saves == undefined) {
        var initSaves = 0;
        $.cookie('vaxSaves', initSaves, { expires: 365, path: '/' })
    }
}

function modifyMenuByUnlocks() {
    drawLocks();
    disableDropdowns();
    disableDifficultyText();
}

function disableDropdowns() {
    if (unlocks.work.difficulty.easy == false) {
        $("#work").addClass( "ui-state-disabled" );
    }
    else {
        d3.select(".workLockIcon").attr("opacity", 0)
        $("#work").removeClass( "ui-state-disabled" );

    }

    if (unlocks.theater.difficulty.easy == false) {
        $("#theater").addClass( "ui-state-disabled" );
    }
    else {
        d3.select(".theaterLockIcon").attr("opacity", 0)
        $("#theater").removeClass( "ui-state-disabled" );
    }


    if (unlocks.restaurant.difficulty.easy == false) {
        $("#restaurant").addClass( "ui-state-disabled" );
    }
    else {
        d3.select(".restaurantLockIcon").attr("opacity", 0)
        $("#restaurant").removeClass( "ui-state-disabled" );

    }


    if (unlocks.club.difficulty.easy == false) {
        $("#club").addClass( "ui-state-disabled" );
    }
    else {
        d3.select(".clubLockIcon").attr("opacity", 0)
        $("#club").removeClass( "ui-state-disabled" );

    }


    if (unlocks.shop.difficulty.easy == false) {
        $("#shop").addClass( "ui-state-disabled" );
    }
    else {
        d3.select(".shopLockIcon").attr("opacity", 0)
        $("#shop").removeClass( "ui-state-disabled" );

    }

    if (unlocks.original.difficulty.easy == false) {
        $("#original").addClass( "ui-state-disabled" );
    }
    else {
        d3.select(".originalLockIcon").attr("opacity", 0)
        $("#original").removeClass( "ui-state-disabled" );

    }


}

function disableDifficultyText() {
    // array of shortcuts to object storing unlock states
    var scenarios = [unlocks.work, unlocks.theater, unlocks.restaurant, unlocks.club, unlocks.shop, unlocks.original]

    // arrays of selector classes for each of the easy/medium/hard texts.
    var easyTexts = [".workEasy", ".theaterEasy", ".restaurantEasy", ".clubEasy", "shopEasy", ".originalEasy"]
    var mediumTexts = [".workMedium", ".theaterMedium", ".restaurantMedium", ".clubMedium", "shopMedium", ".originalMedium"]
    var hardTexts = [".workHard", ".theaterHard", ".restaurantHard", ".clubHard", "shopHard", ".originalHard"]

    // loop over all texts selection classes and modify cursor, mouseover color & disable onClick
    for (var i = 0; i < easyTexts.length; i++) {
        if (scenarios[i].difficulty.easy == false) {
            d3.select(easyTexts[i])
                .style("cursor", "no-drop")
                .on("click", function(){})
                .on("mouseover", function() {
                     d3.select(this).style("fill", "#707070")
                }
            )
        }
    }

    for (var i = 0; i < mediumTexts.length; i++) {
        if (scenarios[i].difficulty.medium == false) {
            d3.select(mediumTexts[i])
                .on("click", function(){})
                .style("cursor", "no-drop")
                .on("mouseover", function() {
                    d3.select(this).style("fill", "#707070")
                }
            )
        }
    }

    for (var i = 0; i < hardTexts.length; i++) {
        if (scenarios[i].difficulty.hard == false) {
            d3.select(hardTexts[i])
                .on("click", function(){})
                .style("cursor", "no-drop")
                .on("mouseover", function() {
                    d3.select(this).style("fill", "#707070")
                }
            )
        }
    }
}

function setDifficultyConstants(scenarioTitle, difficulty) {
    var index;

    if (scenarioTitle != "Random Networks") {
        if (difficulty == "easy") {
            index = 0;
            numberOfRefusers = refuserDifficulty[0];
            numberOfVaccines = vaxDifficulty[0];
            independentOutbreaks = independentOutbreakDifficulty[0];
            transmissionRate = transmissionDifficulty[0];
            recoveryRate = recoveryDifficulty[0];
        }
        if (difficulty == "medium") {
            index = 1;
            numberOfRefusers = refuserDifficulty[1];
            numberOfVaccines = vaxDifficulty[1];
            independentOutbreaks = independentOutbreakDifficulty[1];
            transmissionRate = transmissionDifficulty[1];
            recoveryRate = recoveryDifficulty[1];
        }
        if (difficulty == "hard") {
            index = 2;
            numberOfRefusers = refuserDifficulty[2];
            numberOfVaccines = vaxDifficulty[2];
            independentOutbreaks = independentOutbreakDifficulty[2];
            transmissionRate = transmissionDifficulty[2];
            recoveryRate = recoveryDifficulty[2];
        }
    }

    //  print the constants out for troubleshooting down the road
    console.log("difficulty: " + difficulty)
    console.log("refuser count: " + numberOfRefusers)
    console.log("vax count: " + numberOfVaccines)
    console.log("outbreak count: " + independentOutbreaks)
    console.log("transmission rate: " + transmissionRate)
    console.log("recovery rate: " + recoveryRate)
    console.log("speed mode: " + speed)


    // save the constants as a JSON cookie for access on the game page
    $.cookie.json = true;
    var currentGameCookie = {scenario: scenarioTitle, difficulty: difficulty, speedMode:speed, refusers: numberOfRefusers, vax: numberOfVaccines, outbreaks: independentOutbreaks, transmissionRate: transmissionRate, recoveryRate: recoveryRate}
    $.cookie('vaxCurrentGame', JSON.stringify(currentGameCookie), { expires: 365, path: '/' })
    console.log($.cookie('vaxCurrentGame'))


}

var buttonsDrawn = false;

window.setTimeout(function() {
    drawButtons();
    checkUnlockables();
}, 100)

function drawButtons() {
    if (buttonsDrawn) return;
    else {
        buttonsDrawn = true;
        d3.select("#workAction").append("svg")
            .attr("id", "workSVG")

        d3.selectAll("#workSVG").append("text")
            .attr("class", "workEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#workSVG").append("text")
            .attr("class", "workMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#workSVG").append("text")
            .attr("class", "workHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});




        d3.select("#theaterAction").append("svg")
            .attr("id", "theaterSVG")

        d3.selectAll("#theaterSVG").append("text")
            .attr("class", "theaterEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#theaterSVG").append("text")
            .attr("class", "theaterMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#theaterSVG").append("text")
            .attr("class", "theaterHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});


        d3.select("#restaurantAction").append("svg")
            .attr("id", "restaurantSVG")

        d3.selectAll("#restaurantSVG").append("text")
            .attr("class", "restaurantEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#restaurantSVG").append("text")
            .attr("class", "restaurantMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#restaurantSVG").append("text")
            .attr("class", "restaurantHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});


        d3.select("#clubAction").append("svg")
            .attr("id", "clubSVG")

        d3.selectAll("#clubSVG").append("text")
            .attr("class", "clubEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#clubSVG").append("text")
            .attr("class", "clubMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#clubSVG").append("text")
            .attr("class", "clubHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});


        d3.select("#shopAction").append("svg")
            .attr("id", "shopSVG")

        d3.selectAll("#shopSVG").append("text")
            .attr("class", "shopEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#shopSVG").append("text")
            .attr("class", "shopMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#shopSVG").append("text")
            .attr("class", "shopHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});


        d3.select("#originalAction").append("svg")
            .attr("id", "originalSVG")

        d3.selectAll("#originalSVG").append("text")
            .attr("class", "originalEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#originalSVG").append("text")
            .attr("class", "originalMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#originalSVG").append("text")
            .attr("class", "originalHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});
    }
}

function verifyUnlock(selectedLock) {
    saves = $.cookie('vaxSaves');
    unlocks = $.cookie('vaxUnlocks');

    if (saves < unlockRequirement) {
        // notify to play more & save more for unlocks
        // ok to remove menu

    }
    else {
        d3.select("body").append("div")
            .attr("class","verifyUnlockBox")

        d3.select(".verifyUnlockBox").transition().duration(200).style("top", "150px")

        d3.select(".verifyUnlockBox").append("text")
            .attr("class", "verifyUnlockHeader")
            .text("Unlock Scenario?")

        d3.select(".verifyUnlockBox").append("text")
            .attr("class", "verifyUnlockYes")
            .text("Yes")
            .on("mouseover", function() {
                d3.select(this).style("color", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("color", "white")
            })
            .on("click", function() {
                saves -= 50;
                $.removeCookie('vaxSaves')
                $.cookie('vaxSaves', saves, { expires: 365, path: '/' })

                if (selectedLock == "work") unlocks.work.difficulty.easy = true;
                if (selectedLock == "theater") unlocks.theater.difficulty.easy = true;
                if (selectedLock == "restaurant") unlocks.restaurant.difficulty.easy = true;
                if (selectedLock == "club") unlocks.club.difficulty.easy = true;
                if (selectedLock == "shop") unlocks.shop.difficulty.easy = true;
                if (selectedLock == "original") unlocks.original.difficulty.easy = true;

                d3.select(".verifyUnlockBox").style("top", "-300px")
                window.setTimeout(function() {d3.select('.verifyUnlockBox').remove()}, 200)

                $.removeCookie('vaxUnlocks')
                $.cookie('vaxUnlocks', unlocks, { expires: 365, path: '/' })
                unlocks = $.cookie('vaxUnlocks');
                disableDropdowns();

            })

        d3.select(".verifyUnlockBox").append("text")
            .attr("class", "verifyUnlockNo")
            .text("No")
            .on("mouseover", function() {
                d3.select(this).style("color", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("color", "white")
            })
            .on("click", function() {
                d3.select(".verifyUnlockBox").style("top", "-300px")
                window.setTimeout(function() {d3.select('.verifyUnlockBox').remove()}, 200)

            })

    }

}

function drawLocks() {

    var workSVG = d3.select("#work").append("svg")
        .attr("class", "lock")
        .attr("id", "workLock")
        .style("background", "inherit")

    var workLockIcon = workSVG.selectAll("image").data([0]);
    workLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/assets/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .attr("class", "workLockIcon")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "work";
            verifyUnlock(selectedLock);
        })



    var theaterSVG = d3.select("#theater").append("svg")
        .attr("class", "lock")
        .attr("id", "theaterLock")
        .style("background", "inherit")

    var theaterLockIcon = theaterSVG.selectAll("image").data([0]);
    theaterLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/assets/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .attr("class", "theaterLockIcon")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "theater";
            verifyUnlock(selectedLock);

        })



    var restaurantSVG = d3.select("#restaurant").append("svg")
        .attr("class", "lock")
        .attr("id", "restaurantLock")
        .style("background", "inherit")

    var restaurantLockIcon = restaurantSVG.selectAll("image").data([0]);
    restaurantLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/assets/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .attr("class", "restaurantLockIcon")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "restaurant";
            verifyUnlock(selectedLock);
        })




    var clubSVG = d3.select("#club").append("svg")
        .attr("class", "lock")
        .attr("id", "restaurantLock")
        .style("background", "inherit")

    var clubLockIcon = clubSVG.selectAll("image").data([0]);
    clubLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/assets/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .attr("class", "clubLockIcon")
        .style("cursor", "pointer")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "club";
            verifyUnlock(selectedLock);

        })

    var shopSVG = d3.select("#shop").append("svg")
        .attr("class", "lock")
        .attr("id", "shopLock")
        .style("background", "inherit")

    var shopLockIcon = shopSVG.selectAll("image").data([0]);
    shopLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/assets/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .attr("class", "shopLockIcon")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "shop";
            verifyUnlock(selectedLock);

        })





    var originalSVG = d3.select("#original").append("svg")
        .attr("class", "lock")
        .attr("id", "originalLock")
        .style("background", "inherit")

    var originalLockIcon = originalSVG.selectAll("image").data([0]);
    originalLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/assets/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .attr("class", "originalLockIcon")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "original";
            verifyUnlock(selectedLock);

        })



}



