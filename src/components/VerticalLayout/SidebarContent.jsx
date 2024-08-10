import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';

// Import Scrollbar
import SimpleBar from 'simplebar-react';

// MetisMenu
import MetisMenu from 'metismenujs';
import withRouter from '../../components/Common/withRouter';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// i18n
import { withTranslation } from 'react-i18next';

const SidebarContent = (props) => {
    const ref = useRef();

    // Add sidebar items
    const content = [
        {
            title: 'MAIN',
            type: 'section_title',
        },
        {
            title: 'Dashboard',
            type: 'tab',
            to: '/dashboard',
            icon: "fa-solid fa-house",
        },
        {
            title: 'Staff Management',
            type: 'tab',
            to: '/staff',
            icon: 'fa-solid fa-people-group',
        },
        {
            title: 'School Profile',
            type: 'tab',
            to: '/school-profile',
            icon: 'fa-solid fa-school',
        },
        {
            title: 'Class Management',
            type: 'tab',
            icon: 'fa-solid fa-chalkboard',
            children: [
                {
                    title: 'Classes',
                    to: '/classes',
                    icon: 'fa-solid fa-chalkboard',
                },
                {
                    title: 'Section',
                    to: '/setting/notification',
                    icon: 'fa-solid fa-bell',
                },
                // {
                //     title: 'Role & Permissions',
                //     to: '/setting/role-permission',
                //     icon: 'fa-solid fa-shield',
                // }
            ],
        },
        {
            title: 'General Settings',
            type: 'tab',
            icon: 'fa-solid fa-gear',
            children: [
                {
                    title: 'Security',
                    to: '/setting/security',
                    icon: 'fa-solid fa-lock',
                },
                {
                    title: 'Notification',
                    to: '/setting/notification',
                    icon: 'fa-solid fa-bell',
                },
                {
                    title: 'Role & Permissions',
                    to: '/setting/role-permission',
                    icon: 'fa-solid fa-shield',
                }
            ],
        },
    ];

    const activateParentDropdown = useCallback((item) => {
        item.classList.add('active');
        const parent = item.parentElement;
        const parent2El = parent.childNodes[1];
console.log("fldjl", parent, parent2El)
        if (parent2El && parent2El.id !== 'side-menu') {
            parent2El.classList.add('mm-show');
        }

        if (parent) {
            parent.classList.add('mm-active');
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add('mm-show'); // ul tag

                const parent3 = parent2.parentElement; // li tag

                if (parent3) {
                    parent3.classList.add('mm-active'); // li
                    parent3.childNodes[0].classList.add('mm-active'); // a
                    const parent4 = parent3.parentElement; // ul

                    if (parent4) {
                        parent4.classList.add('mm-show'); // ul
                        const parent5 = parent4.parentElement;

                        if (parent5) {
                            parent5.classList.add('mm-show'); // li
                            parent5.childNodes[0].classList.add('mm-active'); // a tag
                        }
                    }
                }
            }
            scrollElement(item);
            return false;
        }
        scrollElement(item);
        return false;
    }, []);

    const removeActivation = (items) => {
        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            const parent = items[i].parentElement;

            if (item && item.classList.contains('active')) {
                item.classList.remove('active');
            }
            if (parent) {
                const parent2El =
                    parent.childNodes &&
                    parent.childNodes.length &&
                    parent.childNodes[1]
                        ? parent.childNodes[1]
                        : null;
                if (parent2El && parent2El.id !== 'side-menu') {
                    parent2El.classList.remove('mm-show');
                }

                parent.classList.remove('mm-active');
                const parent2 = parent.parentElement;

                if (parent2) {
                    parent2.classList.remove('mm-show');

                    const parent3 = parent2.parentElement;
                    if (parent3) {
                        parent3.classList.remove('mm-active'); // li
                        parent3.childNodes[0].classList.remove('mm-active');

                        const parent4 = parent3.parentElement; // ul
                        if (parent4) {
                            parent4.classList.remove('mm-show'); // ul
                            const parent5 = parent4.parentElement;
                            if (parent5) {
                                parent5.classList.remove('mm-show'); // li
                                parent5.childNodes[0].classList.remove('mm-active'); // a tag
                            }
                        }
                    }
                }
            }
        }
    };

    const activeMenu = useCallback(() => {
        const pathName = window.location.pathname;
        let matchingMenuItem = null;
        const ul = document.getElementById('side-menu');
        const items = ul.getElementsByTagName('a');
        removeActivation(items);

        for (let i = 0; i < items.length; ++i) {
            if (pathName === items[i].pathname) {
                matchingMenuItem = items[i];
                break;
            }
        }
        if (matchingMenuItem) {
            activateParentDropdown(matchingMenuItem);
        }
    }, [window.location.pathname, activateParentDropdown]);

    useEffect(() => {
        ref.current.recalculate();
        new MetisMenu('#side-menu');
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        activeMenu();
    }, [activeMenu]);

    function scrollElement(item) {
        if (item) {
            const currentPosition = item.offsetTop;
            if (currentPosition > window.innerHeight) {
                ref.current.getScrollElement().scrollTop = currentPosition - 300;
            }
        }
    }

    return (
        <React.Fragment>
            <SimpleBar style={{ maxHeight: '100%' }} ref={ref}>
                <div id="sidebar-menu">
                    <ul className="metismenu list-unstyled" id="side-menu">
                        {content.map((element, idx) => {
                            switch (element.type) {
                                case 'section_title':
                                    return (
                                        <li key={idx} className="menu-title">
                                            {props.t(element.title)}
                                        </li>
                                    );
                                case 'tab':
                                    return (
                                        <li key={idx}>
                                            <Link
                                                to={element.to}
                                                className={
                                                    element.children &&
                                                    element.children.length > 0
                                                        ? 'has-arrow waves-effect'
                                                        : 'waves-effect'
                                                }
                                            >
                                                <FontAwesomeIcon icon={element.icon} className='px-2' />
                                                <span>
                                                    {props.t(element.title)}
                                                </span>
                                            </Link>
                                            {(element.children && element.children.length > 0) && (
                                                <ul className="sub-menu">
                                                    {element.children.map((child, idc) => (
                                                        <li key={idc}>
                                                            <Link
                                                                to={child.to}
                                                                className={(child.children && child.children.length > 0)
                                                                    ? 'has-arrow waves-effect'
                                                                    : 'waves-effect'
                                                                }
                                                            >
                                                                <FontAwesomeIcon icon={child.icon} className='px-2' />
                                                                {props.t(child.title)}
                                                            </Link>
                                                            {(child.children && child.children.length > 0) && (
                                                                <ul className="sub-menu">
                                                                    {child.children.map((gchild, id) => (
                                                                        <li key={id}>
                                                                            <Link to={gchild.to}>
                                                                                <FontAwesomeIcon icon={gchild.icon} className='px-2' />
                                                                                {props.t(gchild.title)}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                default:
                                    break;
                            }
                        })}
                    </ul>
                </div>
            </SimpleBar>
        </React.Fragment>
    );
};

SidebarContent.propTypes = {
    location: PropTypes.object,
    t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
