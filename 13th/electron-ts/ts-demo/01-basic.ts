interface Person {
    name: string;
    age: number;
}
interface Person1 {
    name: string;
    age: number;
}

class Greeter {
    name: string;
    sayHello() {
        console.log("Hello " + this.name);
    }
}

function sortByName<T extends { name:string }>(p:T[]):T[] {
    var result = p.slice(0);
    result.sort((x, y) => {
        return x.name.localeCompare(y.name);
    });
    return result;
}

var a:Person[] = []

sortByName(a).slice(0)[0];

sortByName([{
    name:"33",
    age:233
}]);
