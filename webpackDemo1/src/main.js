/**
 * Created by Zhang Junwei on 2017/11/4.
 */
import Greeter from './js/greeter'
import moment from 'moment'

import './css/main.css'

Greeter.sayHi('jack')
console.log(Greeter.name)
document.querySelector('#user').innerHTML = 'hi: ' + Greeter.name + ' at ' + moment().format('yyyy-MM-dd')