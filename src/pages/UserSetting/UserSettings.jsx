import React, { useEffect, useState } from 'react';
import { setBreadcrumbItems } from '../../store/actions';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Card, Nav, NavLink, NavItem, TabContent, TabPane } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import UserSecurity from './UserSecurity';
import UserNotification from './UserNotification';
import RolesList from '../RolePermissions/RolesList';

const TABS = [
    { id: '1', label: 'Security', component: <UserSecurity /> },
    { id: '2', label: 'Notification', component: <UserNotification /> },
    { id: '3', label: 'Role and Permission', component: <RolesList /> }
];

const UserSetting = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || '1';

    const breadcrumbItems = [{ title: 'User Setting' }];
    const [activeTab, setActiveTab] = useState(initialTab);
    const [breadcrumbValue, setBreadcrumbValue] = useState(TABS.find(tab => tab.id === initialTab)?.label || TABS[0].label);

    useEffect(() => {
        props.setBreadcrumbItems('User Setting', [{ title: 'User Setting' }, { title: breadcrumbValue }]);
    }, [props, breadcrumbValue]);

    useEffect(() => {
        const updatedBreadcrumbItems = [...breadcrumbItems, { title: breadcrumbValue }];
        props.setBreadcrumbItems('User Setting', updatedBreadcrumbItems);
    }, [breadcrumbValue]);

    const toggleTab = (tab, label) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            setBreadcrumbValue(label);
            navigate(`${location.pathname}?tab=${tab}`);
        }
    };

    return (
        <Card className='parent-component-height'>
            <Nav tabs justified className='nav-tabs-custom'>
                {TABS.map(tab => (
                    <NavItem key={tab.id}>
                        <NavLink
                            className={classnames({ active: activeTab === tab.id })}
                            onClick={() => toggleTab(tab.id, tab.label)}
                        >
                            <span className='d-none d-sm-block'>{tab.label}</span>
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <TabContent activeTab={activeTab} className='h-100'>
                {TABS.map(tab => (
                    <TabPane tabId={tab.id} key={tab.id} style={{ height: '90%' }} className='p-3 overflow-auto'>
                        {tab.component}
                    </TabPane>
                ))}
            </TabContent>
        </Card>
    );
};

export default connect(null, { setBreadcrumbItems })(UserSetting);
