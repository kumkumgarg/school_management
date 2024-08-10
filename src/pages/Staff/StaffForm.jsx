import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setBreadcrumbItems } from '../../store/actions';
import StaffProvider from './StaffProvider';
import RoleProvider from '../../providers/RoleProvider';
import {
    Button,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row,
    Col,
    Spinner,
} from 'reactstrap';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Spinners from '../../components/Common/Spinner';
import PhoneInput from 'react-phone-input-2';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

function StaffForm(props) {
    const {
        createStaff,
        setCreateStaff,
        id,
        setId,
        comeBackFromForm,
        setComeBackFromForm
    } = props

    const SP = StaffProvider();
    const Role = RoleProvider();

    const userDetails = useSelector(({ user }) => user.user);

    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState({});
    const [isStaffFormSubmitted, setIsStaffFormSubmitted] = useState(false)
    const [rolesArray, setRolesArray] = useState([]);

    useEffect(() => {
        if (userDetails) {
            getRoles();
        }
        if (id) {
            getDetails();
        }
    }, [userDetails]);

    const getRoles = () => {
        setLoading(true);
        Role.getRoleData({ user_id: userDetails.user_id })
            .then(resp => {
                if (resp.data.length === 0) {
                    toast.warning("Create Role First");
                } else {
                    setRolesArray(resp.data);
                }
            })
            .finally(() => {
                if (!id) {
                    setLoading(false);
                }
            });
    };

    const getDetails = () => {
        SP.details({ id: id })
            .then((resp) => {
                setStaff(resp);
            })
            .catch((err) => {
                console.log('staff details err', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSubmit = (data, { setSubmitting }) => {
        setSubmitting(true);
        setLoading(true);
        data.phone = data.phone.replace('+', '');
        if (id) {
            data['id'] = staff.uuid;
            staffUpdate(data);
        } else {
            staffCreate(data);
        }
    };

    const staffUpdate = (data) => {
        SP.update(data)
            .then((resp) => {
                setIsStaffFormSubmitted(true)
                getDetails();
                setLoading(false);
                setSubmitting(false);
            })
            .catch((err) => {
                toast.error(err.response.data.message ? err.response.data.message : "Error Occurred");
                setLoading(false);
                setSubmitting(false);
            });
    };

    const staffCreate = (data) => {
        SP.create(data)
            .then((resp) => {
                setIsStaffFormSubmitted(true)
                setLoading(false);
                setSubmitting(false);
            })
            .catch((err) => {
                toast.error(err.response.data.message ? err.response.data.message : "Error Occurred");
                setLoading(false);
                setSubmitting(false);
            });
    };

    useEffect(() => {
        if (isStaffFormSubmitted) {
            setCreateStaff(!createStaff)
            setId(null)
            setComeBackFromForm(!comeBackFromForm)
        }
    }, [isStaffFormSubmitted]);

    return (
        <div>
            {loading
                ? <Spinners setLoading={setLoading} />
                : staff && (rolesArray.length > 0) && (
                    <Formik
                        onSubmit={handleSubmit}
                        initialValues={{
                            first_name: staff && id ? staff.staff_meta.first_name : '',
                            last_name: staff && id ? staff.staff_meta.last_name : '',
                            dob: staff && id ? staff.staff_meta.dob : '',
                            email: staff && id ? staff.email : '',
                            phone: staff && id ? staff.phone : '',
                            role: staff && id ? staff.role : '',
                        }}
                        validationSchema={Yup.object({
                            first_name: Yup.string().required(
                                'Please enter staff first name.'
                            ),
                            last_name: Yup.string().required(
                                'Please enter your last name.'
                            ),
                            email: Yup.string()
                                .email('Invalid email format')
                                .required(
                                    'Please enter staff email.'
                                ),
                            phone: Yup.string().required(
                                'Please Enter Your phone'
                            ),
                            role: Yup.string().required(
                                'Please select staff role.'
                            ),
                            dob: Yup.date()
                                .max(new Date(), "Date of birth must be in the past")
                                .required("Date of birth is required"),
                        })}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            isSubmitting,
                            setFieldValue,
                            initialValues,
                        }) => (
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>First Name</Label>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="first_name"
                                                placeholder="--enter first name--"
                                                invalid={!!(touched.first_name && errors.first_name)}
                                            />
                                            {touched.first_name && errors.first_name &&
                                                <FormFeedback valid={false}>
                                                    {errors.first_name}
                                                </FormFeedback>
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Last Name</Label>
                                            <Field
                                                as={Input}
                                                type="text"
                                                name="last_name"
                                                placeholder="--enter last name--"
                                                invalid={!!(touched.last_name && errors.last_name)}
                                            />
                                            {touched.last_name &&
                                                errors.last_name && (
                                                    <FormFeedback valid={false}>
                                                        {errors.last_name}
                                                    </FormFeedback>
                                                )}
                                        </FormGroup>
                                        <FormGroup className="mb-3">
                                            <Label>
                                                DOB
                                            </Label>
                                            <Field
                                                as={Input}
                                                type="date"
                                                name="dob"
                                                invalid={touched.dob && errors.dob}
                                            />
                                            {touched.dob && errors.dob && <FormFeedback valid={false}>{errors.dob}</FormFeedback>}
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Email</Label>
                                            <Field
                                                as={Input}
                                                type="email"
                                                name="email"
                                                placeholder="--enter email--"
                                                invalid={!!(touched.email && errors.email)}
                                                disabled={id ? true : false}
                                            />
                                            {touched.email && errors.email && (
                                                <FormFeedback valid={false}>
                                                    {errors.email}
                                                </FormFeedback>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Phone</Label>
                                            <PhoneInput
                                                specialLabel={false}
                                                autoFormat={false}
                                                country={'ca'}
                                                name="phone"
                                                value={staff.phone}
                                                dropdownClass="text-dark"
                                                onChange={(ph) => { setFieldValue('phone', ph) }}
                                                inputProps={{ name: 'phone' }}
                                                inputClass={`w-100 ${
                                                    touched.phone &&
                                                        errors.phone ? 'is-invalid' : ''
                                                }`}
                                                containerClass={` ${
                                                    touched.phone &&
                                                        errors.phone ? 'is-invalid' : ''
                                                }`}
                                            />
                                            {touched.phone && errors.phone && (
                                                <FormFeedback valid={false}>
                                                    {errors.phone}
                                                </FormFeedback>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Role</Label>
                                            <Field
                                                as={Input}
                                                type="select"
                                                name="role"
                                                placeholder="role"
                                                invalid={
                                                    touched.role &&
                                                    errors.role &&
                                                    errors.role.trim() !== ''
                                                }
                                            >
                                                <option disabled value={''}>
                                                    --select staff role--
                                                </option>
                                                {rolesArray.map((ele, idx) => {
                                                    return <option key={idx} value={ele.value}>
                                                        {ele.name}
                                                    </option>
                                                })}
                                            </Field>
                                            {touched.role && errors.role && errors.role.trim() !== '' && (
                                                <FormFeedback valid={false}>
                                                    {errors.role}
                                                </FormFeedback>
                                            )}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Button
                                    disabled={isSubmitting}
                                    color="primary"
                                    type="submit"
                                    className='mt-3'
                                >
                                    {isSubmitting
                                        ? <Spinner size={"sm"} />
                                        : id ? 'Update' : 'Create'
                                    }
                                </Button>
                            </Form>
                        )}
                    </Formik>
                )
            }
        </div>
    );
}

export default connect(null, { setBreadcrumbItems })(StaffForm);
