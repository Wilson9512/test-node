//類別裡面定義的function就算是物件的方法
class Person {
    constructor(name = 'noname' , age = 0){
        this.name = name;
        this.age = age;
    }
    toJSON(){
        return{ //object
            name: this.name,
             age: this.age,
        }
    }

    sayHello(){
        return `Yo ${this.name}`;
    }

    toString(){
        return JSON.stringify(this.toJSON(), null, 2);
    }
}

// const p1 = new Person('W', 23);
// console.log(p1.sayHello())

module.exports = Person;