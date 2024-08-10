
const sessionAuthManager = () => {

    let authenticated = false;

    const setAuth = (status) => {
        authenticated = status;

        if(!authenticated) {
            let event = new Event("login-expired");
            document.body.dispatchEvent(event);
        }
    }

    const getAuth = () => {
        if (window.authenticated != undefined) {
            authenticated = window.authenticated
            delete window.authenticated
        }

        return authenticated
    }

    const isLoggedIn = () => {
        return authenticated
    }

    return {
        setAuth,
        getAuth,
        isLoggedIn
    }
}

export default sessionAuthManager()