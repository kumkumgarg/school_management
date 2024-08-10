import React, { useEffect } from 'react'
import { connect } from 'react-redux'
//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from '../../store/actions'

const Dashboard = (props) => {
    document.title = 'Dashboard'

    const breadcrumbItems = [{ title: 'Dashboard', link: '/dashboard' }]

    useEffect(() => {
        props.setBreadcrumbItems('Dashboard', breadcrumbItems)
    })

    return (
        <React.Fragment>
            <div>SMS Dashboard</div>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(Dashboard)
