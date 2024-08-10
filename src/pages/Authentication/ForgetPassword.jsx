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
import _ from 'lodash';

const ForgetPasswordPage = props => {
	const User = UserProvider();

	const [loading, setLoading] = useState(false)
	const [emailSent, setEmailSent] = useState(false)

	const submitForgotPassword = (values) => {
			setLoading(true)
			User.forgot(values)
				.then(resp => {
					setEmailSent(true);
				})
				.catch((error) => {
					console.error(error.response.data.email[0])
				})
				.finally(() => setLoading(false))
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
										{emailSent
											? <Alert className={"animate fadeIn"} color="success">Please check your email address for further instructions.</Alert>
											:<Formik
												initialValues={{
													email: '',
												}}
												validationSchema={ForgotPasswordSchema}
												onSubmit={submitForgotPassword}
											>
												{({ errors, touched }) => (
													<Form>
														<FormGroup>
															<Label>
																Email
															</Label>
															<Field
																as={Input}
																name="email"
																placeholder="email"
																invalid={ touched.email && !_.isEmpty(errors.email)}
															/>
															{touched.email && errors.email &&
																<FormFeedback valid={false}>{errors.email}</FormFeedback>
															}
														</FormGroup>

														<FormGroup>
															<Button color="primary" type={"submit"} size="lg" block disabled={loading}>
																{ loading && <FontAwesomeIcon icon={'spinner'} transform="left-5 down-1" spin />}
																Reset my password
															</Button>
														</FormGroup>
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

const ForgotPasswordSchema = Yup.object().shape({
	email: Yup
	  .string()
	  .email("Please enter a valid email.")
	  .required("Required")
});

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
