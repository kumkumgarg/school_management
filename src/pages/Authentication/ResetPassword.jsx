import React, {useState} from 'react'
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { Card, CardBody, Alert, Row, Col, Container, FormGroup, FormFeedback, Input, Label, Button } from 'reactstrap';
import withRouter from '../../components/Common/withRouter';
// Formik Validation
import * as Yup from "yup";
import { Formik, Form, Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UserProvider from '../../providers/UserProvider';
import { useParams, useLocation } from 'react-router-dom';
import _ from 'lodash';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = props => {
    const query = useQuery();
	const User = UserProvider();

	const [loading, setLoading] = useState(false)
    const [resetDone, setResetDone] = useState(false)

	const submitResetPassword = (values) => {
        setLoading(true);
        const queryData = {
            token: query.get('token'),
            email: query.get('email')
        };
        const data = {
            ...values,
            ...queryData // Spread queryData into data
        };
        User.reset(data)
            .then(resp => {
                setResetDone(true);
            })
            .finally(() => setLoading(false));
    }

  	return (
    	<React.Fragment>
			<div className="account-pages my-5 pt-sm-5">
				<Container>
					<Row className="justify-content-center">
						<Col md={8} lg={6} xl={5}>
							<Card className="overflow-hidden">
                				<CardBody className="pt-0">
									<h3 className="text-center mt-5 mb-4">
										<Link to="/" className="d-block auth-logo">
                                            SMS
										</Link>
									</h3>
									<div className="p-3">
										<h4 className="text-muted font-size-18 mb-3 text-center">Reset Password</h4>
										{resetDone
											? <Alert className={"animate fadeIn"} color="success">
                                                Password reset successfully. You may now
                                                <Link to={"/login"}>
                                                    &nbsp;Login
                                                </Link>
                                            </Alert>
											:<Formik
												initialValues={{
													email: '',
												}}
                                                validationSchema={ResetPasswordSchema}
                                                onSubmit={submitResetPassword}
											>
												{({ errors, touched }) => (
                                                    <Form>
                                                        <FormGroup className="mb-3">
                                                            <Field
                                                                as={Input}
                                                                type="password"
                                                                name="password"
                                                                placeholder="Password"
                                                                invalid={
                                                                touched.password && !_.isEmpty(errors.password)
                                                                }
                                                            />
                                                            {touched.password && errors.password &&
                                                                <FormFeedback valid={false}>{errors.password}</FormFeedback>
                                                            }
                                                        </FormGroup>

                                                        <FormGroup className="mb-3">
                                                            <Field
                                                                as={Input}
                                                                type="password"
                                                                name="password_confirmation"
                                                                placeholder="Confirm Password"
                                                                invalid={
                                                                touched.password_confirmation && !_.isEmpty(errors.password_confirmation)
                                                                }
                                                            />
                                                            {touched.password_confirmation && errors.password_confirmation &&
                                                                <FormFeedback valid={false}>{errors.password_confirmation}</FormFeedback>
                                                            }
                                                        </FormGroup>
                                                        <Row className="mt-2 d-flex align-items-center">
                                                            <Col xs="6">
                                                                <Button
                                                                    type={"submit"}
                                                                    color="primary"
                                                                    disabled={loading}
                                                                    >
                                                                    {loading && <FontAwesomeIcon icon={'spinner'} transform="left-5 down-1" spin />}
                                                                    Reset
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </Form>
												)}
											</Formik>
										}
										<div className={"float-left w-100 text-center p-3"}>
											<Link to={"/login"}>
												Back to Login
											</Link>
										</div>
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

const ResetPasswordSchema = Yup.object().shape({
    password: Yup
    .string()
    .required("Required"),

    password_confirmation: Yup
    .string()
    .oneOf([ Yup.ref('password'), null ], "Password field did not match.")
    .required("Required")
});

ResetPassword.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ResetPassword);
