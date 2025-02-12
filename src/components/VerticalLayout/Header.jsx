import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { connect } from 'react-redux'

import { Link, Navigate } from 'react-router-dom'

// Reactstrap
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap'

// Import menuDropdown
import LanguageDropdown from '../CommonForBoth/TopbarDropdown/LanguageDropdown'
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown'
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu'

// import megamenuImg from "../../assets/images/megamenu-img.png"
import logo from '../../assets/images/logo-sm.png'
import logoLightPng from '../../assets/images/logo-light.png'
import logoDark from '../../assets/images/logo-dark.png'

//i18n
import { withTranslation } from 'react-i18next'

// Redux Store
import {
    showRightSidebarAction,
    toggleLeftmenu,
    changeSidebarType,
} from '../../store/actions'
import AuthProvider from '../../providers/AuthProvider'

const Header = (props) => {
    const [search, setsearch] = useState(false)
    const [createmenu, setCreateMenu] = useState(false)

    // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    function toggleFullscreen() {
        if (
            !document.fullscreenElement &&
            /* alternative standard method */ !document.mozFullScreenElement &&
            !document.webkitFullscreenElement
        ) {
            // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen()
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen()
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(
                    Element.ALLOW_KEYBOARD_INPUT
                )
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen()
            }
        }
    }

    function tToggle() {
        var body = document.body
        body.classList.toggle('vertical-collpsed')
        body.classList.toggle('sidebar-enable')
    }

    return (
        <React.Fragment>
            <header id="page-topbar">
                <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box">
                            <Link to="/" className="logo logo-dark">
                                SMS
                            </Link>
                            <Link to="/" className="logo logo-light">
                                SMS
                            </Link>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                tToggle()
                            }}
                            className="btn btn-sm px-3 font-size-24 header-item waves-effect vertical-menu-btn"
                            id="vertical-menu-btn"
                        >
                            <i className="mdi mdi-menu"></i>
                        </button>
                    </div>
                    <div className="dropdown d-inline-block">
                        <ProfileMenu />
                        <button
                            onClick={() => {
                                props.showRightSidebarAction(
                                    !props.showRightSidebar
                                )
                            }}
                            type="button"
                            className="btn header-item noti-icon right-bar-toggle waves-effect"
                        >
                            {/* <i className="mdi mdi-spin mdi-cog"></i> */}
                            <i className="mdi mdi-cog"></i>
                        </button>
                    </div>
                </div>
            </header>
        </React.Fragment>
    )
}

Header.propTypes = {
    changeSidebarType: PropTypes.func,
    leftMenu: PropTypes.any,
    leftSideBarType: PropTypes.any,
    showRightSidebar: PropTypes.any,
    showRightSidebarAction: PropTypes.func,
    t: PropTypes.any,
    toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = (state) => {
    const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
        state.Layout
    return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
    showRightSidebarAction,
    toggleLeftmenu,
    changeSidebarType,
})(withTranslation()(Header))
