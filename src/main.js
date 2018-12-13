import Vue from 'vue'
import App from './App'
import router from './router'
import {initAMapApiLoader} from 'map-assistant'

initAMapApiLoader({
    key: ''
})

// initAMapApiLoader('GMap', {
//     key: '',
//     libraries: 'drawing,places'
// })

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
