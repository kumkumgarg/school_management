import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

export const ListActions = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>

            <DropdownToggle
                tag="a"
                className="nav-link p-1"
                style={{
                    width: 20,
                    cursor: 'pointer',
                    float: 'left',
                    textAlign: 'center'
                }}
            >
                <FontAwesomeIcon icon={"ellipsis-v"} />
            </DropdownToggle>

            <DropdownMenu>
                { props.handleDetail &&
                    <DropdownItem onClick={props.handleDetail}>
                        <FontAwesomeIcon icon={"arrow-right"} />
                        {" "} Details
                    </DropdownItem>
                }

                { props.handleEdit &&
                    <DropdownItem onClick={props.handleEdit}>
                        <FontAwesomeIcon icon={"pen"} />
                        {" "} Edit
                    </DropdownItem>
                }

                { props.handleChat &&
                    <DropdownItem onClick={props.handleChat}>
                        <FontAwesomeIcon icon={"comment-dots"} />
                        {" "} Chat
                    </DropdownItem>
                }

                { props.handleDelete &&
                    <DropdownItem onClick={props.handleDelete}>
                        <FontAwesomeIcon icon={"trash"} />
                        {" "} Delete
                    </DropdownItem>
                }

                {props.handleArchive ?
                    <DropdownItem onClick={props.handleArchive}>
                        <FontAwesomeIcon icon={"hand-paper"} />
                        {" "}
                        {
                            props.isEnabled
                                ? "Enable"
                                : "Disable"
                        }
                    </DropdownItem>
                    : null
                }

            </DropdownMenu>

        </Dropdown>
    );
}