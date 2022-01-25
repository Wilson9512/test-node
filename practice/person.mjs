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

console.log('./person.mjs');
export const f6 = a => a*a*a;
// const p1 = new Person('W', 23);
// console.log(p1.sayHello())

export default Person;