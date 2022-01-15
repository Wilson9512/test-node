class Person {
    constructor(name = 'noanme' , age = 20){
        this.name = name;
        this .age = age;
    }
    toJSON(){
        return{
            name:this.name,
             age:this.age,
        }
    }
    toString(){
        return JSON.stringify(this.toJSON(), null, 2);
    }
}

module.exports = Person;