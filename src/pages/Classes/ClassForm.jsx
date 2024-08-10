import React, { useEffect, useState } from 'react';
import { Button, Label, Input, Form, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import ClassProvider from '../../providers/ClassProvider';
import ClassCategoryProvider from '../../providers/ClassCategoryProvider';
import SubjectList from './SubjectList';

export default function ClassForm(props) {
    const {
        createClass,
        setCreateClass,
        createEditText,
        id,
        setId,
        comeBackFromForm,
        setComeBackFromForm
    } = props;

    const userDetails = useSelector(({ user }) => user.user);

    const CP = ClassProvider();
    const CPP = ClassCategoryProvider();

    const [loading, setLoading] = useState(true);
    const [classData, setClassData] = useState(null);
    const [subjectIds, setSubjectIds] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [isClassFormSubmitted, setIsClassFormSubmitted] = useState(false);
    const [formState, setFormState] = useState({
        name: '',
        class_category_id: '',
    });

    useEffect(() => {
        getCategoryList();
    }, []);

    useEffect(() => {
        if (id) {
            getClassData();
        } else {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (classData) {
            setFormState({
                name: classData.name || '',
                class_category_id: classData.class_category_id || '',
            });
        }
    }, [classData]);

    const getCategoryList = () => {
        CPP.get()
            .then(resp => {
                setCategoryList(resp);
            })
            .catch((e) => {
                console.error('[Devlog] Error fetching category data:', e);
            });
    };

    const getClassData = () => {
        CP.getClassData({ id: id })
            .then(resp => {
                setClassData(resp);
                setSubjectIds(resp.subjectIds)
            })
            .catch((e) => {
                console.error('[Devlog] Error fetching class data:', e);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    // Submit form
    const handleClassForm = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = { ...formState, user_id: userDetails.user_id, subjectIds: subjectIds };
        if (id) {
            data.id = id;
            updateClass(data);
        } else {
            addClass(data);
        }
    };

    const addClass = (data) => {
        CP.create(data)
            .then(resp => {
                toast.success("Class Created Successfully");
                setIsClassFormSubmitted(true);
            })
            .catch((e) => {
                toast.error("Error in creating class");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const updateClass = (data) => {
        CP.update(data)
            .then(resp => {
                toast.success("Class Updated Successfully");
                setIsClassFormSubmitted(true);
            })
            .catch((e) => {
                toast.error("Error in update");
                console.error('[Devlog] Error in update:', e);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // When form is submitted successfully
    useEffect(() => {
        if (isClassFormSubmitted) {
            setCreateClass(!createClass);
            setId(null);
            setComeBackFromForm(!comeBackFromForm);
        }
    }, [isClassFormSubmitted]);

    return (
        <div>
            {loading
                ? <div className='d-flex justify-content-center align-item-center'>
                    <FontAwesomeIcon icon={'spinner'} size={'2x'} transform="left-5 down-1" spin />
                </div>
                : <Form onSubmit={handleClassForm}>
                    <Row>
                        <Col md={6}>
                            <Label className='fw-bold'>
                                Name
                            </Label>
                            <Input
                                type="text"
                                name="name"
                                placeholder={"Enter name of class"}
                                value={formState.name}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <Label>Class Category</Label>
                            <Input
                                type="select"
                                name="class_category_id"
                                placeholder="Select class category"
                                className="mb-3"
                                value={formState.class_category_id}
                                onChange={handleChange}
                            >
                                <option disabled value={''}>
                                    --select class category--
                                </option>
                                {categoryList.map((ele, idx) => (
                                    <option key={idx} value={ele.id}>
                                        {ele.name}
                                    </option>
                                ))}
                            </Input>
                        </Col>
                    </Row>
                    <Row>
                        <Label className='mt-3 fw-bold'>
                            Subjects
                        </Label>
                        <SubjectList
                            classId={id}
                            subjectIds={subjectIds}
                            setSubjectIds={setSubjectIds}
                            loading={loading}
                        />
                    </Row>
                    <Button color="primary" type={"submit"} className={"mt-3"} size="lg" disabled={loading}>
                        {loading && <FontAwesomeIcon icon={'spinner'} transform="left-5 down-1" spin />}
                        Save
                    </Button>
                </Form>
            }
        </div>
    );
}
