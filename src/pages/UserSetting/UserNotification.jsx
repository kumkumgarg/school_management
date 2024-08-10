import React, { useEffect, useRef, useState } from 'react'
import { setBreadcrumbItems } from '../../store/actions'
import { connect } from 'react-redux'
import classnames from "classnames";
import { Card, CardHeader, CardBody, Col, Row} from 'reactstrap'

const UserNotification = (props) => {
    document.title = 'User Notifications'
    const breadcrumbItems = [{ title: 'User Notifications', link: '/user-setting/notifications' }]

    useEffect(() => {
        props.setBreadcrumbItems('User Notifications', breadcrumbItems)
    }, [])

    return (
        <Card className='parent-component-height'>
            <CardHeader>
                <h5> Notifications</h5>
            </CardHeader>
            <CardBody className='h-100 overflow-auto font-weight-bold'>
                <div
                className="form-check form-switch form-switch-lg mb-3 d-flex justify-content-between"
                >
                <label
                    className="form-check-label"
                    htmlFor="customSwitchsizelg"
                >
                    Security alerts
                    </label>
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="customSwitchsizelg"
                    defaultChecked
                    onClick={e => {
                        settoggleSwitchSize(!toggleSwitchSize)
                        }}
                />
                </div>

                <div
                className="form-check form-switch form-switch-lg mb-3 d-flex justify-content-between"
                >
                <label
                    className="form-check-label"
                    htmlFor="customSwitchsizelg"
                >
                    E-mail notification
                    </label>
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="customSwitchsizelg"
                    defaultChecked
                />
                </div>

                <div
                className="form-check form-switch form-switch-lg mb-3 d-flex justify-content-between"
                >
                <label
                    className="form-check-label"
                    htmlFor="customSwitchsizelg"
                >
                    New staff notification
                    </label>
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="customSwitchsizelg"
                    defaultChecked
                />
                </div>

                <div
                className="form-check form-switch form-switch-lg mb-3 d-flex justify-content-between"
                >
                <label
                    className="form-check-label"
                    htmlFor="customSwitchsizelg"
                >
                    New user login
                    </label>
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="customSwitchsizelg"
                    defaultChecked
                />
                </div>
            </CardBody>
        </Card>
    )
}

export default connect(null, { setBreadcrumbItems })(UserNotification)
