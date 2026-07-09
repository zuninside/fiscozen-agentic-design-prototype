import { createApp } from 'vue'
import { setupFzStyle } from '@fiscozen/style'

import App from './App.vue'
import { router } from './router'

import './style.css'

const app = createApp(App)
setupFzStyle(app)
app.use(router).mount('#app')
