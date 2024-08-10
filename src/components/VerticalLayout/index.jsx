import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { connect } from 'react-redux'
import { Col, Container, Row } from 'reactstrap'
import withRouter from '../../components/Common/withRouter'
import {
    changeLayout,
    changeSidebarTheme,
    changeSidebarType,
    changeTopbarTheme,
    changeLayoutWidth,
    changeColor,
    showRightSidebarAction,
    changeMode,
} from '../../store/actions'

import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from 'reselect'
import { fetchUserRequest } from "../../store/actions";

// Layout Related Components
import Header from './Header'
import Sidebar from './Sidebar'
import Rightbar from '../CommonForBoth/Rightbar'
//Import Breadcrumb
import Breadcrumb from '../../components/Common/Breadcrumb'
import '@mdi/font/css/materialdesignicons.min.css'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap'
import Spinners from '../../components/Common/Spinner'
import LocationProvider from '../../providers/LocationProvider'
import { toast } from 'react-toastify';
import SchoolSetting from '../../pages/School/SchoolProfile'

const Layout = (props) => {
    const dispatch = useDispatch()
    const selectLayoutState = (state) => state.Layout

    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout) => ({
            leftSideBarTheme: layout.leftSideBarTheme,
            layoutWidth: layout.layoutWidth,
            leftSideBarType: layout.leftSideBarType,
            topbarTheme: layout.topbarTheme,
            layoutColor: layout.layoutColor,
            layoutMode: layout.layoutMode,
        })
    )

    const {
        leftSideBarTheme: leftSideBarThemeState,
        layoutWidth: layoutWidthState,
        leftSideBarType: leftSideBarTypeState,
        topbarTheme: topbarThemeState,
        layoutColor: layoutColorState,
        layoutMode: layoutModeState,
    } = useSelector(selectLayoutProperties)

    const userDetails = useSelector(({ user }) => user.user)

    const [loading, setLoading] = useState(true)
    const [createLocation, setCreateLocation] = useState(null)
    const [location, setLocation] = useState(null)
    const [modal, setModal] = useState(false)

    const toggle = () => {
        setModal(!modal)
    }

    useEffect(() => {
        // Runs only on the first render
        // This is used to get user data from redux
        getUserData()
    }, [userDetails])

    const getUserData = () => {
        console.log('[Devlog] user details', userDetails)
        if (userDetails) {
            if (userDetails && userDetails.default_location_id) {
                setCreateLocation(false)
            } else {
                setCreateLocation(true)
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        const hideRightbar = (event) => {
            var rightbar = document.getElementById('right-bar')
            // if clicked inside right bar, then do nothing
            if (rightbar && rightbar.contains(event.target)) {
                return
            } else {
                // if clicked outside of rightbar then fire action for hide rightbar
                dispatch(showRightSidebarAction(false))
            }
        }

        // Init body click event for toggle rightbar
        document.body.addEventListener('click', hideRightbar, true)

        // Cleanup the event listener on component unmount
        return () => {
            document.body.removeEventListener('click', hideRightbar, true)
        }
    }, [dispatch])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        dispatch(changeLayout('vertical'))
    }, [dispatch])

    useEffect(() => {
        if (leftSideBarThemeState) {
            dispatch(changeSidebarTheme(leftSideBarThemeState))
        }
    }, [leftSideBarThemeState, dispatch])

    useEffect(() => {
        if (layoutWidthState) {
            dispatch(changeLayoutWidth(layoutWidthState))
        }
    }, [layoutWidthState, dispatch])

    useEffect(() => {
        if (layoutModeState) {
            dispatch(changeMode(layoutModeState))
        }
    }, [layoutModeState, dispatch])

    useEffect(() => {
        if (leftSideBarTypeState) {
            dispatch(changeSidebarType(leftSideBarTypeState))
        }
    }, [leftSideBarTypeState, dispatch])

    useEffect(() => {
        if (topbarThemeState) {
            dispatch(changeTopbarTheme(topbarThemeState))
        }
    }, [topbarThemeState, dispatch])

    useEffect(() => {
        if (layoutColorState) {
            dispatch(changeColor(layoutColorState))
        }
    }, [layoutColorState, dispatch])

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    const toggleMenuCallback = () => {
        if (leftSideBarTypeState === 'default') {
            dispatch(changeSidebarType('condensed', isMobile))
        } else if (leftSideBarTypeState === 'condensed') {
            dispatch(changeSidebarType('default', isMobile))
        }
    }

    const handleLocationAdded = () => {
        setCreateLocation(false);
    }

    return (
        <React.Fragment>
            {loading ? (
                <Spinners setLoading={setLoading} />
            ) : createLocation ? (
                <SchoolSetting />
            ) : (
                <div id="layout-wrapper">
                    <Header toggleMenuCallback={toggleMenuCallback} />
                    <Sidebar
                        theme={props.leftSideBarTheme}
                        type={props.leftSideBarType}
                        isMobile={props.isMobile}
                    />
                    <div className="main-content">
                        <div className="page-content">
                            {/* <Container fluid> */}
                            {props.children}

                                {/* <Breadcrumb />
                                <Row>
                                    <Col sm={12} md={12} lg={12}>
                                        {props.children}
                                    </Col>
                                </Row> */}
                            {/* </Container> */}
                        </div>
                    </div>
                </div>
            )}
            {props.showRightSidebar ? <Rightbar /> : null}
        </React.Fragment>
    )
}

Layout.propTypes = {
    changeLayoutWidth: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired,
    changeMode: PropTypes.func.isRequired,
    changeSidebarTheme: PropTypes.func.isRequired,
    changeSidebarType: PropTypes.func.isRequired,
    changeTopbarTheme: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired,
    isPreloader: PropTypes.bool,
    layoutWidth: PropTypes.string,
    leftSideBarTheme: PropTypes.string,
    leftSideBarType: PropTypes.string,
    location: PropTypes.object,
    showRightSidebar: PropTypes.bool,
    topbarTheme: PropTypes.string,
}

const mapStatetoProps = (state) => {
    return {
        ...state.Layout,
    }
}

export default connect(mapStatetoProps, {
    changeLayout,
    changeColor,
    changeMode,
    changeSidebarTheme,
    changeSidebarType,
    changeTopbarTheme,
    changeLayoutWidth,
})(withRouter(Layout))

export const LocationFieldForm = ({ onLocationAdded }) => {
    const dispatch = useDispatch();
    const Location = LocationProvider()

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target).entries());

        Location.create(data)
            .then(resp => {
                dispatch(fetchUserRequest());
                onLocationAdded();
                toast.success("Location created successfully");
            })
            .catch((e) => {
                if (e.response.data.error == "not_available") {
                    toast.error("Multiple locations not available in current plan.")
                } else {
                    toast.error("Internal Server Error")
                }
            })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label>
                    Location Name
                </Label>
                <Input
                    name={"name"}
                    placeholder={"Location Name"}
                    required />
            </FormGroup>
            <Button type={"submit"} color={"success"}>
                Add
            </Button>
        </Form>
    )
}
