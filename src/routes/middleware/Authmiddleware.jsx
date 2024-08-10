import React from 'react'
import { Navigate } from 'react-router-dom'

const Authmiddleware = (props) => {
    if (!window.authenticated) {
        return (
            <Navigate
                to={{ pathname: '/login', state: { from: props.location } }}
            />
        )
    }
    return <React.Fragment>{props.children}</React.Fragment>
}

export default Authmiddleware
