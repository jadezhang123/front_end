/**
 * Created by Zhang Junwei on 2017/11/4.
 */
import Greeter from './js/greeter'
import moment from 'moment'
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'

Greeter.sayHi('jack')
console.log(Greeter.name)
$('#user').html('hi,' + Greeter.name + ' at ' + moment().format('yyyy-MM-dd'))
