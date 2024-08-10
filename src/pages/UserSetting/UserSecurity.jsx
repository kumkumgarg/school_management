import React, { useEffect, useRef, useState } from 'react'
import { setBreadcrumbItems } from '../../store/actions'
import { connect } from 'react-redux'
import { Formik, Form, Field } from 'formik';
import { Card, CardBody, CardHeader, Button, Row, Col, Label, FormGroup, Input, FormFeedback} from 'reactstrap'
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Formik validation
import * as Yup from 'yup'
import UserProvider from '../../providers/UserProvider';
import { toast } from 'react-toastify'

const UserSecurity = (props) => {

    document.title = 'User Security'
    const breadcrumbItems = [{ title: 'User Security', link: '/user-setting/security' }]

    const [isPasswordChange,setIsPasswordChange]=useState(false)

    const [loading, setLoading] = useState(false)

    const UP = UserProvider();

    useEffect(() => {
        props.setBreadcrumbItems('User Security', breadcrumbItems)
    }, [])

    const submitResetPassword = (values) => {
        setLoading(true)
        const data = {
            ...values,
        }
        UP.update(data)
            .then(resp => {
                toast.success("Password Updated Successfully")
                setIsPasswordChange(false);

            })
            .catch((error) => {
                toast.warning("Unauthorized or Password Mismatched")
            })
            .finally(() => {
                setLoading(false)
            })
    }


    const ResetPasswordSchema = Yup.object().shape({
        old_password: Yup
            .string()
            .required("Required"),

        password: Yup
            .string()
            .required("Required"),

        password_confirmation: Yup
            .string()
            .oneOf([Yup.ref('password'), null], "Password field did not match."
            )
            .required("Required")
    });


    return (
        <Card className='parent-component-height'>
            <CardHeader>
               <h5>Password Management</h5>
            </CardHeader>
            <CardBody className='h-100 overflow-auto'>
                    <div className='d-flex justify-content-between my-3'>
                        <h5 className='text-secondary'>
                            2-Step Verification
                        </h5>
                        <div className='form-check form-switch form-switch-lg'>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="customSwitchsizelg"
                                defaultChecked
                                // onClick={e => {
                                //     settoggleSwitchSize(!toggleSwitchSize)
                                // }}

                            />
                        </div>
                    </div>
                    <hr />
                    <div className='d-flex justify-content-between'>
                        <h5 className='text-secondary'>
                           Change Password
                        </h5>
                        <Button
                            onClick={() => setIsPasswordChange(!isPasswordChange)}
                        >
                            {isPasswordChange ? "Back" : "Expand"}
                        </Button>
                    </div>
                    {isPasswordChange &&
                        <Formik
                            initialValues={{
                                old_password:'',
                                password: '',
                                password_confirmation: ''
                            }}
                            validationSchema={ResetPasswordSchema}
                            onSubmit={submitResetPassword}
                        >
                            {({ errors, touched }) => (
                                <Form>
                                    <FormGroup className="mb-3">
                                        <Label>
                                            Old Password
                                        </Label>
                                        <Field
                                            as={Input}
                                            type="password"
                                            name="old_password"
                                            placeholder={
                                                "Old Password"
                                            }
                                            invalid={
                                                touched.old_password && !_.isEmpty(errors.old_password)
                                            } />
                                        {
                                            touched.password && errors.password
                                                ? <FormFeedback valid={false}>{errors.password}</FormFeedback>
                                                : null
                                        }
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <Label>
                                            New Password
                                        </Label>
                                        <Field
                                            as={Input}
                                            type="password"
                                            name="password"
                                            placeholder={
                                                "Password"
                                            }
                                            invalid={
                                                touched.password && !_.isEmpty(errors.password)
                                            } />
                                        {
                                            touched.password && errors.password
                                                ? <FormFeedback valid={false}>{errors.password}</FormFeedback>
                                                : null
                                        }
                                    </FormGroup>

                                    <FormGroup className="mb-3">
                                        <Label>
                                            Confirm Password
                                        </Label>
                                        <Field
                                            as={Input}
                                            type="password"
                                            name="password_confirmation"
                                            placeholder={
                                                "Confirm Password"
                                            }
                                            invalid={
                                                touched.password_confirmation && !_.isEmpty(errors.password_confirmation)
                                            } />
                                        {
                                            touched.password_confirmation && errors.password_confirmation
                                                ? <FormFeedback valid={false}>{errors.password_confirmation}</FormFeedback>
                                                : null
                                        }
                                    </FormGroup>
                                    <Row className="mt-2 d-flex align-items-center">
                                        <Col xs="6" className="text-right">
                                        <Button type="submit" color="primary" className="ms-1" disabled={loading}>
                                        { loading && <FontAwesomeIcon icon={'spinner'} transform="left-5 down-1" spin /> }
                                            Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Formik>
                    }
            </CardBody>
        </Card>
    )
}

export default connect(null, { setBreadcrumbItems })(UserSecurity)
