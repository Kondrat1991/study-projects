

function properSearchString(string) {
    const firstStep = string.split(/\s+/);
    const secondStep = firstStep.map(elem => `(?:|\\s)${elem}`);
    const thirdStep = secondStep.join("|");

    return thirdStep;
}

let testArr2 = [
    {
        title: "Optimum protein Nutrition"
    },
    {
        title: "Optimum protein"
    },
    {
        title: "протеїн Nutrition"
    },
    {
        title: "Optimum "
    },

    {
        title: "Optimum протеїн"
    },
    {
        title: "  протеїн новий  Optimum"
    },
    {
        title: "протеїн новий"
    }

];


let goodName = "протеїн Optimum Nutrition";
let goodName2 = "Optimum";
let goodName3 = "протеїн";

let searchWord = "протеїн Optimum Nutrition";

searchQuery = new RegExp(properSearchString(goodName3), "gi");
console.log("searchQuery", searchQuery);

function generalSearchForGoodsMod(searchQuery, arr) {
    console.log("reg expression", searchQuery);
    let sortedByLength = arr.map(good => {
        let itemLength = good.title.match(searchQuery);
        good.itemMatchLength = itemLength.length;
        return good;
    });
    const sortedArr = sortedByLength.sort(
        (a, b) => b.itemMatchLength - a.itemMatchLength
    );
    // array sorted by relevance condition
    return (sortedArr);
}

let relevantArr = generalSearchForGoodsMod(searchQuery, testArr2);

console.log("relevantArr", relevantArr);


/*const unicodeWord = XRegExp('^\\pL+$');*/
/*let result = unicodeWord.test(testWord);
console.log("unicode test",result);*/
/*const word = searchQuery;*/


