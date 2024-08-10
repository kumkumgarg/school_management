import React from 'react';
import { Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function permissions({ permissions, setPermissions, loading }) {

    const handlePermissionChange = (permission) => {
        const updatedPermissionList = { ...permissions };
        updatedPermissionList[permission] = !updatedPermissionList[permission];
        setPermissions(updatedPermissionList);
    };

    const formatLabel = (label) => {
        return label.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    };

    return (
        <Row>
            <Col>
                {loading
                    ? <div className='d-flex justify-content-center align-item-center'>
                        <FontAwesomeIcon icon={'spinner'} size={'2x'} transform="left-5 down-1" spin />
                    </div>
                    : Object.entries(permissions).map((subEntry) => {
                        const [subKey, subValue] = subEntry;                        
                        return (
                            <FormGroup key={subKey} className="pl-4 mb-3 d-flex align-items-center">
                                <Label check>
                                    <Input
                                        id={subKey}
                                        type="checkbox"
                                        checked={subValue}
                                        onClick={() => handlePermissionChange(subKey)}
                                        style={{ position: "relative", marginRight: "10px" }}
                                    />
                                    {formatLabel(subKey)}
                                </Label>
                            </FormGroup>
                        );
                    })
                }
            </Col>
        </Row>
    );
}
