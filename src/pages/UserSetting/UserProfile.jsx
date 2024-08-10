import React, { useEffect, useRef, useState } from 'react'
import { setBreadcrumbItems } from '../../store/actions'
import { connect } from 'react-redux'
import { Formik, Form, Field } from 'formik';
import { Card, CardBody, CardHeader, Button, Row, Col, Label, FormGroup, Input, FormFeedback, Modal, Spinner} from 'reactstrap'
import UserProvider from '../../providers/UserProvider';
import _ from 'lodash';
import * as Yup from 'yup'
import { default as AvatarPreview } from 'react-avatar'
import { default as AvatarEditor } from 'react-avatar-edit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector, useDispatch } from "react-redux";
import { fetchUserRequest } from "../../store/actions";
import { toast } from 'react-toastify'
import PhoneInput from 'react-phone-input-2'

const UserProfile = (props) => {
    const UP = UserProvider()
    const dispatch = useDispatch();
    const userDetails = useSelector(({user}) => user.user);

    const [userData, setUserData] = useState()
    const [loading, setLoading] =useState(true)
    const [loadingButton, setLoadingButton] =useState(false)
    const [userName, setUserName] =useState('')
    const [image, setImage] = useState(null)
    const [imageFile, setImageFile] = useState('')
    const [modal_center, setmodal_center] = useState(false)
    const [deleteProfilePic, setDeleteProfilePic] = useState(false)

    useEffect(() => {
        //Runs only on the first render
        getUserData();
    }, [userDetails]);

    const getUserData = () => {
        if(userDetails){
            setUserData(userDetails)
            setUserName(userDetails.name)
            if (userDetails && userDetails.profile_pic) {
                setImage(`/profile-pic/${userDetails.profile_pic}`)
            }
            setLoading(false)
        }
    }

    const submitButton = (values) => {
        values.phone = values.phone.replace('+', '')
        setLoadingButton(true)
        const formData = new FormData();

        // loop to add values in formData
        Object.keys(values).forEach((key) => {
            formData.append(key, values[`${key}`]);
        });
        // add profile and delete
        image && imageFile? formData.append("profile_pic", imageFile): null
        deleteProfilePic? formData.append("delete_pic", deleteProfilePic): null

        UP.update(formData)
            .then(resp => {
                dispatch(fetchUserRequest());  // to update user profile using redux
                toast.success("User Data Updated")
            })
            .catch((error) => {
                toast.error("Error occured")
            })
            .finally(()=> {setLoadingButton(false)})
    }

    const Validation = Yup.object().shape({
        first_name: Yup
            .string()
            .required("First Name is required"),
        last_name: Yup
            .string()
            .required("Last Name is required"),

        dob: Yup
            .date()
            .max(new Date(), "Date of birth must be in the past")
            .required("Date of birth is required"),

        email: Yup
            .string()
            .email("Invalid email address")
            .required("Email is required"),

        phone: Yup
            .string()
            // .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")  // inserting phone number only 10 digits
            .required("Phone number is required"),
    });

    const onCrop = (ImageURL) => {
        let block = ImageURL.split(";");

        // Get the content type of the image
        let contentType = block[0].split(":")[1];// In this case "image/gif"

        // get the real base64 content of the file
        let realData = block[1].split(",")[1];
        let blob = b64toBlob(realData, contentType);
        let file = new File([blob], "image.png", { type: "image/png", lastModified: new Date() });
        setImageFile(file);
        setImage(ImageURL);
    }

    const b64toBlob = (b64Data, contentType, sliceSize) => {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    const tog_center = () => {
        setmodal_center(!modal_center)
        removeBodyCss()
    }

    const removeBodyCss = () => {
        document.body.classList.add("no_padding")
    }

    return ( loading
        ? <div className='text-center'>
            <Spinner size={'lg'}/>
        </div>
        : <Card>
            <CardBody>
                <Formik
                    initialValues={{
                        first_name:userData && userData.first_name ? userData.first_name:'',
                        last_name:userData && userData.last_name ? userData.last_name:'',
                        dob: userData && userData.dob ? userData.dob:'',
                        email: userData && userData.email ? userData.email:'',
                        phone: userData && userData.phone ? userData.phone:'',
                        address: userData && userData.address ? userData.address:'',
                    }}
                    validationSchema={Validation}
                    onSubmit={submitButton}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <Form>
                            <Row>
                                <Col sm={6} md={6}>
                                    <div className="text-center mb-3">
                                        <AvatarPreview
                                            maxInitials={2}
                                            size="200"
                                            name={userName}
                                            src={image}
                                            className="rounded-circle avatar-sm"
                                        />
                                    </div>
                                    <div className='text-center'>
                                        { image
                                            ? <Button
                                                className='btn btn-danger'
                                                style={{width:'8vw'}}
                                                onClick={() =>{
                                                    setDeleteProfilePic(true)
                                                    setImage(null)
                                                }}
                                            >
                                                Delete
                                            </Button>
                                            : <Button
                                                type="button"
                                                className="btn btn-primary ms-1"
                                                onClick={() => {tog_center()}}
                                            >
                                                Upload Image
                                            </Button>
                                        }
                                    </div>
                                    <Modal
                                        isOpen={modal_center}
                                        toggle={() => {tog_center()}}
                                        centered={true}
                                    >
                                        <div className="modal-body avatar-editor text-center">
                                            <AvatarEditor
                                                width={"inherit"}
                                                height={295}
                                                onCrop={onCrop}
                                            />
                                            <Button onClick={() =>{tog_center()}} className='mt-3'>
                                                Okay
                                            </Button>
                                        </div>
                                    </Modal>
                                </Col>
                                <Col lg="6" md="6">
                                    <FormGroup className="mb-3">
                                        <Label>
                                            First Name
                                        </Label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="first_name"
                                            placeholder={"First Name"}
                                            invalid={touched.first_name && !_.isEmpty(errors.first_name)}
                                        />
                                        { touched.first_name && errors.first_name && <FormFeedback valid={false}>{errors.first_name}</FormFeedback> }
                                    </FormGroup>

                                    <FormGroup className="mb-3">
                                        <Label>
                                            Last Name
                                        </Label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="last_name"
                                            placeholder={"Last Name"}
                                            invalid={touched.last_name && !_.isEmpty(errors.last_name)}
                                        />
                                        { touched.last_name && errors.last_name && <FormFeedback valid={false}>{errors.last_name}</FormFeedback> }
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <Label>
                                            DOB
                                        </Label>
                                        <Field
                                            as={Input}
                                            type="date"
                                            name="dob"
                                            invalid={touched.dob && !_.isEmpty(errors.dob)}
                                        />
                                        { touched.dob && errors.dob && <FormFeedback valid={false}>{errors.dob}</FormFeedback>}
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <Label>
                                            E-mail Address
                                        </Label>
                                        <Field
                                            as={Input}
                                            type="email"
                                            name="email"
                                            placeholder={"Enter Email"}
                                            invalid={touched.email && !_.isEmpty(errors.email)}
                                        />
                                        { touched.email && errors.email && <FormFeedback valid={false}>{errors.email}</FormFeedback>}
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <Label>
                                            Contact
                                        </Label>
                                        <PhoneInput
                                            specialLabel={false}
                                            autoFormat={false}
                                            country={'ca'}
                                            name="phone"
                                            value={userData.phone}
                                            dropdownClass="text-dark"
                                            onChange={(ph) => {
                                                setFieldValue(
                                                    'phone',
                                                    ph
                                                )
                                            }}
                                            inputStyle={{
                                                padding: '22.09px 46px',
                                            }}
                                            inputProps={{
                                                name: 'phone',
                                            }}
                                            placeholder={'+123214412'}
                                            inputClass={`w-100 ${
                                                touched.phone &&
                                                errors.phone
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            containerClass={` ${
                                                touched.phone &&
                                                errors.phone
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                        />
                                        {touched.phone && errors.phone ? (<FormFeedback valid={false}>{errors.phone}</FormFeedback>) : null}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col className="text-end">
                                    <Button type="submit" color="primary" className="ms-1" block disabled={loadingButton}>
                                        { loadingButton && <FontAwesomeIcon icon={'spinner'} transform="left-5 down-1" spin /> }
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                     </Form>
                    )}
                </Formik>
            </CardBody>
        </Card>
    )
}

export default connect(null, { setBreadcrumbItems })(UserProfile)
