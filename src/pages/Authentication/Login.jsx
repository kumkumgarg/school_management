import React, { useState } from 'react'
import { Container, Row, Col, Card, CardBody, Label, Form, Alert, Input, FormFeedback } from 'reactstrap'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Formik validation
import * as Yup from 'yup'
import { useFormik } from 'formik'
// import withRouter from '/components/Common/withRouter';
import withRouter from '../../components/Common/withRouter'

// actions
import AuthProvider from '../../providers/AuthProvider'
import sessionAuthManager from '../../helpers/sessionAuthManager'

const Login = (props) => {
    document.title = 'Login to SMS'

    const AP = AuthProvider()
    const [auth, setAuth] = useState(sessionAuthManager.isLoggedIn())
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const validation = useFormik({
        // enableReinitialize : use this  flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Please Enter Your Email'),
            password: Yup.string().required('Please Enter Your Password'),
        }),
        onSubmit: (values) => {
            submitForm(values)
        },
    })

    const submitForm = (data) => {
        setLoading(true)
        AP.login(data)
            .then((resp) => {
                setAuth(resp.authenticated)

                if (resp.ref !== '' && resp.ref !== "/") {
                    window.location.replace(resp.ref)
                }
                if(resp.user.default_location_id == null){
                    window.location.replace('/school-profile')
                } else {
                    window.location.replace('/dashboard')
                }
            })
            .catch((err) => {
                setError( `Error logging in. ${err.response.data.error ? err.response.data.error : ''}` )
            })
            .finally(() => {setLoading(false)})
    }

    return (
        <React.Fragment>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="overflow-hidden">
                                <CardBody className="pt-0">
                                    <h3 className="text-center mt-5 mb-4"> SMS </h3>

                                    <div className="p-3">
                                        <h4 className="text-muted font-size-18 mb-1 text-center"> Welcome Back ! </h4>
                                        <p className="text-muted text-center"> Sign in to continue to SMS. </p>
                                        <Form
                                            className="form-horizontal mt-4"
                                            onSubmit={(e) => {
                                                e.preventDefault()
                                                validation.handleSubmit()
                                                return false
                                            }}
                                        >
                                            {error && (
                                                <Alert color="danger">
                                                    {error}
                                                </Alert>
                                            )}
                                            <div className="mb-3">
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
                                                <Input
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="Enter email"
                                                    type="email"
                                                    autoComplete="email"
                                                    onChange={ validation.handleChange }
                                                    onBlur={ validation.handleBlur }
                                                    value={ validation.values.email || '' }
                                                    invalid={(validation.touched.email && validation.errors.email)
                                                        ? true
                                                        : false
                                                    }
                                                />
                                                {validation.touched.email &&
                                                validation.errors.email && (
                                                    <FormFeedback type="invalid">
                                                        { validation.errors.email}
                                                    </FormFeedback>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <Label htmlFor="password">
                                                    Password
                                                </Label>
                                                <Input
                                                    name="password"
                                                    value={ validation.values.password || '' }
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    autoComplete="current-password"
                                                    onChange={ validation.handleChange }
                                                    onBlur={ validation.handleBlur }
                                                    invalid={(validation.touched.password && validation.errors.password)
                                                        ? true
                                                        : false
                                                    }
                                                />
                                                {validation.touched.password &&
                                                validation.errors.password && (
                                                    <FormFeedback type="invalid">
                                                        { validation.errors.password }
                                                    </FormFeedback>
                                                )}
                                            </div>
                                            <Row className="mb-3 mt-4">
                                                <div className="col-6 w-100 text-center">
                                                    <button className="btn btn-primary w-100 w-md waves-effect waves-light" type="submit" disabled={loading}>
                                                        {
                                                            loading && <FontAwesomeIcon icon={'spinner'} transform="left-5 down-1" spin />
                                                        }
                                                        Log In
                                                    </button>
                                                </div>
                                            </Row>
                                            <Row className="form-group mb-0">
                                                <Link to="/forgot-password" className="text-muted"><i className="mdi mdi-lock"></i> Forgot your password?</Link>
                                            </Row>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default withRouter(Login)

Login.propTypes = {
    history: PropTypes.object,
}
