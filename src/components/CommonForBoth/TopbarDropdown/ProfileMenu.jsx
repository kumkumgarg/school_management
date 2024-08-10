import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"

// Redux
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import withRouter from "../../../components/Common/withRouter"

// users
import UserProvider from "../../../providers/UserProvider"
import { useSelector } from "react-redux";
import { default as AvatarPreview } from 'react-avatar'

const ProfileMenu = props => {
    const UP = UserProvider()

    const userDetails = useSelector(({user}) => user.user)

    const [menu, setMenu] = useState(false)
    const [userName, setUserName] = useState('')
    const [image, setImage] = useState(null)

    useEffect(() => {
        //Runs only on the first render
        // this used to get user data from redux
        getUserData();
    }, [userDetails]);

    const getUserData = () => {
        if(userDetails){
            setUserName(`${userDetails.first_name} ${userDetails.last_name}`);

            if (userDetails && userDetails.profile_pic) {
                setImage(`/profile-pic/${userDetails.profile_pic}`)
            } else{
                setImage(null)
            }
        }
    }
    return (
        <React.Fragment>
        <Dropdown
            isOpen={menu}
            toggle={() => setMenu(!menu)}
            className="d-inline-block"
        >
            <DropdownToggle
            className="btn header-item waves-effect"
            id="page-header-user-dropdown"
            tag="button"
            >
            <AvatarPreview
                maxInitials={2}
                size="40"
                name={userName}
                src={image}
                className="rounded-circle header-profile-user"
            />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
            <Link to="/profile" className="dropdown-item">
                <i className="mdi mdi-account-circle font-size-17 text-muted align-middle me-1" />
                {props.t("Profile")}
            </Link>
            <Link to="#" className="dropdown-item text-danger" onClick={UP.logout}>
                <i className="mdi mdi-power font-size-17 text-muted align-middle me-1 text-danger" />
                <span>Logout</span>
            </Link>
            </DropdownMenu>
        </Dropdown>
        </React.Fragment>
    )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)
