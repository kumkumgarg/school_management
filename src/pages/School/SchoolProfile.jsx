import React, { useState, useEffect } from 'react';
import { Col, Row, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SettingProvider from '../../providers/SettingProvider';
import { toast } from 'react-toastify';

const SchoolProfile = () => {
    const Setting = SettingProvider();
    const type = "location";

    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({});
    const [settingsValue, setSettingsValue] = useState({});
    const [image, setImage] = useState(null);

    useEffect(() => {
        getSettingList();
    }, []);

    const getSettings = () => {
        let params = {
            type: type
        };
        Setting.getSettings(params)
            .then((resp) => {
                setSettingsValue(resp);
                if (resp.school_logo && resp.school_logo.value !== null && resp.school_logo.value !== "") {
                    setImage(`/business_logos/${resp.school_logo.value}`);
                }
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getSettingList = () => {
        let params = {
            type: type,
        };
        Setting.getSettingList(params)
            .then((resp) => {
                setSettings(resp);
                getSettings();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());

        let formData = new FormData();

        Object.keys(data).map(item => {
            formData.append(item, data[item]);
        });

        Setting.saveSetting(formData)
            .then((resp) => {
                if (settingsValue.location == null) {
                    toast.success("Saved successfully");
                    window.location.replace('/dashboard');
                } else {
                    toast.success("Updated successfully");
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const renderFormFields = (settings, parentKey = '') => {
        return Object.entries(settings).map(([key, value]) => {
            if (value && typeof value === 'object' && 'type' in value) {
                if (value.type === 'file') {
                    return (
                        <FormGroup key={key}>
                            <Label for={key}>{value.display_name}</Label>
                            {image !== null ? (
                                <div id="image-box" className="d-flex flex-row flex-wrap">
                                    <div
                                        className="m-1"
                                        style={{
                                            position: "relative",
                                        }}
                                    >
                                        <img src={image} width={100} alt="school-logo" />
                                        <FontAwesomeIcon
                                            icon={"times"}
                                            className="cross-icon"
                                            style={{
                                                position: "absolute",
                                                top: "-13px",
                                                right: "-8px",
                                                color: "#ff0000",
                                                cursor: "pointer",
                                                fontSize: "1.7rem",
                                            }}
                                            onClick={() => {
                                                setImage(null);
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <Input
                                    type="file"
                                    name={parentKey ? `${parentKey}.${key}` : key}
                                    id={key}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setImage(event.target.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    required
                                />
                            )}
                        </FormGroup>
                    );
                } else {
                    return (
                        <FormGroup key={key}>
                            <Label for={key}>{value.display_name}</Label>
                            <Input
                                type={value.type}
                                name={parentKey ? `${parentKey}.${key}` : key}
                                id={key}
                                defaultValue={settingsValue[key]}
                                placeholder={value.description}
                                required
                            />
                        </FormGroup>
                    );
                }
            } else if (value && typeof value === 'object' && !('type' in value)) {
                return (
                    <div key={key}>
                        <h5>{value.display_name || key}</h5>
                        {renderFormFields(value, parentKey ? `${parentKey}.${key}` : key)}
                    </div>
                );
            } else {
                return null;
            }
        });
    };

    const renderFormColumns = (settings) => {
        const settingsArray = Object.entries(settings);
        const midPoint = Math.ceil(settingsArray.length / 2);

        const leftColumn = settingsArray.slice(0, midPoint);
        const rightColumn = settingsArray.slice(midPoint);

        return (
            <Row>
                <Col md={6}>
                    {renderFormFields(Object.fromEntries(leftColumn))}
                </Col>
                <Col md={6}>
                    {renderFormFields(Object.fromEntries(rightColumn))}
                </Col>
            </Row>
        );
    };

    return (
        <Card className='parent-component-height'>
            <CardHeader>
                <h4>
                    School Profile
                </h4>
            </CardHeader>
            <CardBody className='h-100 overflow-auto font-weight-bold'>
                {loading
                    ? <Col style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
                        <FontAwesomeIcon icon={"spinner"} spin size={"4x"} />
                    </Col>
                    : (settings) &&
                    <Form onSubmit={handleSave}>
                        {renderFormColumns(settings)}
                        <Button
                            color="primary"
                            type="submit"
                        >
                            Save
                        </Button>
                    </Form>
                }
            </CardBody>
        </Card>
    );
};

export default connect(null, {})(SchoolProfile);
