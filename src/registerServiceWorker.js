/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updated (registration) {
      console.log('New content is available; please refresh.')
      window.App.$snackbar.open({
        message: 'Nueva versión disponible.',
        position: 'is-top',
        actionText: 'Actualizar',
        indefinite: true,
        onAction: () => {
          window.App.$toast.open({
            message: 'Actualizando...',
            queue: false
          })
          window.location.reload(true)
        }
      })
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
