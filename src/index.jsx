import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import './i18n'
import { Provider } from 'react-redux'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import store from './store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../resources/js/bootstrap'

library.add(fas);
const root = ReactDOM.createRoot(document.getElementById('app'))

root.render(
    <Provider store={store}>
        <>
            <BrowserRouter>
                <App />
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={true} />
            </BrowserRouter>
        </>
    </Provider>
)

serviceWorker.unregister()
