import config from '../config/loacal.json'

export default {
    name: 'init',
    sayHi: function (name) {
        console.log(config.greetText)
        console.log(this)
        this.name = name || config.greetText
    }
}
