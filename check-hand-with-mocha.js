// http://refactoringjs.com/files/refactoring-javascript.pdf
// pg.68 (94 of 499)

let wish = require('wish');
const deepEqual = require('deep-equal');

function checkHand(hand) {
    if (isTwoPair(hand)) {
        return 'two pairs';
    } else if (isPair(hand)) {
        return 'pair';
    } else if (isFullHouse(hand)) {
        return 'full house';
    } else if (isTriple(hand)) {
        return 'three of a kind';
    } else if (isQuadruple(hand)) {
        return 'four of a kind';
    } else if (isStraightFlush(hand)) {
        return 'straight flush';
    } else if (isFlush(hand)) {
        return 'flush';
    } else if (isStraight(hand)) {
        return 'straight';
    } else {
        return 'high card';
    }
};

function isTwoPair(hand) {
    var theCounts = allCounts(valuesFromHand(hand));
    return (theCounts[0] === 2 && theCounts[1] === 2);
}

function isFullHouse(hand) {
    var theCounts = allCounts(valuesFromHand(hand));
    return (theCounts[0] === 3 && theCounts[1] === 2);
};

function allCounts(values) {
    var counts = {};
    values.forEach(function(value, index) {
        counts[value] = 0;
        if (value == values[0]) {
            counts[value] += 1;
        };
        if (value == values[1]) {
            counts[value] += 1;
        };
        if (value == values[2]) {
            counts[value] += 1;
        };
        if (value == values[3]) {
            counts[value] += 1;
        };
        if (value == values[4]) {
            counts[value] += 1;
        };
    });

    var totalCounts = Object.keys(counts).map(function(key) {
        return counts[key];
    });

    return totalCounts.sort(function(a, b) {return b-a});
};

function isStraightFlush(hand) {
    return isStraight(hand) && isFlush(hand);
};

function isStraight(hand) {
    return cardsInSequence(valuesFromHand(hand));
};

function cardsInSequence(values) {
    var sortedValues = values.sort();
    return fourAway(sortedValues) && noMultiples(values);
};

function fourAway(values) {
    return ((parseInt(values[values.length-1]) - 4 - parseInt(values[0])) === 0);
};

function noMultiples(values) {
    return highestCount(values) === 1;
};

function isFlush(hand) {
    return allTheSameSuit(suitsFor(hand));
};

function allTheSameSuit(suits) {
    var toReturn = true;
    suits.forEach(function(suit) {
        if(suit !== suits[0]) {
            toReturn = false;
        }
    });
    return toReturn;
};

function suitsFor(hand) {
    return hand.map(function(card) {
        return card.split('-')[1];
    });
};

function isQuadruple(hand) {
    return multiplesIn(hand) === 4;
};

function isTriple(hand) {
    return multiplesIn(hand) === 3;
};

function isPair(hand) {
    return multiplesIn(hand) === 2;
};

function multiplesIn(hand) {
    return highestCount(valuesFromHand(hand));
};

function highestCount(values) {
    var counts = {};
    values.forEach(function(value, index) {
        counts[value] = 0;
        if (value == values[0]) {
            counts[value] += 1;
        };
        if (value == values[1]) {
            counts[value] += 1;
        };
        if (value == values[2]) {
            counts[value] += 1;
        };
        if (value == values[3]) {
            counts[value] += 1;
        };
        if (value == values[4]) {
            counts[value] += 1;
        };
    });

    var totalCounts = Object.keys(counts).map(function(key) {
        return counts[key];
    });

    return totalCounts.sort(function(a, b) {return b-a})[0];
};

function valuesFromHand(hand) {
    return hand.map(function(card) {
        return card.split('-')[0];
    });
};

describe('fourAway()', function() {
    it('reports true if first and last element have a difference of 4.', function() {
        var result = fourAway(['2', '6']);
        wish(result);
    })
});

describe('noMultiples()', function() {
    it('reports true when all elements are different', function() {
        var result = noMultiples(['2', '6']);
        wish(result);
    });

    it('reports false when two elements are the same', function () {
        var result = noMultiples(['2', '2']);
        wish(!result);
    })
});

describe('allTheSameSuit()', function() {
    it('reports true if all elements are the same', function() {
        var result = allTheSameSuit(['D', 'D', 'D', 'D', 'D']);
        wish(result);
    });

    it('reports false if elements are not the same', function() {
        var result = allTheSameSuit(['D', 'H', 'D', 'D', 'D']);
        wish(!result);
    });
});

describe('suitsFor()', function() {
    it('returns just the suits from a hand', function() {
        var result = suitsFor(['2-H', '3-C', '4-D', '5-H', '2-C']);
        wish(result, deepEqual(['H', 'C', 'D', 'H', 'C']));
    })
})

describe('valuesFromHand()', function() {
    it('returns just the values from a hand', function() {
        var result = valuesFromHand(['2-H', '3-C', '4-D', '5-H', '2-C']);
        wish(deepEqual(result, ['2', '3', '4', '5', '2']));
    });
});

describe('highestCount()', function() {
    it('returns count of the most common card from array', function() {
        var result = highestCount(['2', '4', '4', '4', '2']);
        wish(result === 3);
    });
});

describe('multiplesIn()', function() {
    it('finds a duplicate', function() {
        var result = multiplesIn(['2-H', '3-C', '4-D', '5-H', '2-C']);
        wish(result === 2);
    })
})

describe('isPair()', function() {
    it('finds a pair', function () {
        var result = isPair(['2-H', '3-C', '4-D', '5-H', '2-C']);
        wish(result);
    });
});

describe('checkHand()', function() {
    it('handles pairs', function() {
        var result = checkHand(['2-H', '3-C', '4-D', '5-H', '2-C']);
        wish(result === 'pair');
    });

    it('handles two pairs', function() {
        var result = checkHand(['2-H', '2-C', '4-D', '4-H', '3-C']);
        wish(result === 'two pairs');
    });

    it('handles three of a kind', function() {
        var result = checkHand(['2-H', '4-C', '4-D', '4-H', '3-C']);
        wish(result === 'three of a kind');
    });

    it('handles four of a kind', function() {
        var result = checkHand(['2-H', '4-C', '4-D', '4-H', '4-C']);
        wish(result === 'four of a kind');
    });

    it('handles high card', function() {
        var result = checkHand(['2-H', '3-C', '8-D', '4-H', '7-C']);
        wish(result === 'high card');
    });

    it('handles flush', function() {
        var result = checkHand(['2-H', '3-H', '4-H', '5-H', '8-H']);
        wish(result === 'flush');
    });

    it('handles straight', function() {
        var result = checkHand(['1-H', '2-H', '3-H', '4-H', '5-D']);
        wish(result === 'straight');
    });

    it('handles straight flush', function () {
        var result = checkHand(['1-H', '2-H', '3-H', '4-H', '5-H']);
        wish(result === 'straight flush');
    });

    it('handles full house', function() {
        var result = checkHand(['2-H', '2-C', '3-D', '3-C', '3-H']);
        wish(result === 'full house');
    });
});