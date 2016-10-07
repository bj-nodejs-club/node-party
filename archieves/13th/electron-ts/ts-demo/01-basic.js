class Greeter {
    sayHello() {
        console.log("Hello " + this.name);
    }
}
function sortByName(p) {
    var result = p.slice(0);
    result.sort((x, y) => {
        return x.name.localeCompare(y.name);
    });
    return result;
}
var a = [];
sortByName(a).slice(0)[0];
sortByName([{
        name: "33",
        age: 233
    }]);
