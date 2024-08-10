import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { Button, Card, CardBody, CardHeader, FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'
import * as Yup from 'yup'
import RoleProvider from '../../providers/RoleProvider'
import PermissionList from './PermissionList'
import permissionProvider from '../../providers/PermissionProvider'
import { toast } from 'react-toastify'

export default function RoleForm(props) {
    const {
        createRole,
        setCreateRole,
        id,
        setId,
        comeBackFromForm,
        setComeBackFromForm
    } = props

    const Role = RoleProvider()
    const Permission = permissionProvider()

    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState(null)
    const [permissions, setPermissions] = useState([])
    const [isRoleFormSubmitted, setIsRoleFormSubmitted] = useState(false)

    useEffect(() => {
        if (id) {
            getRoleData();
        } else {
            getPermissionList();
        }
    }, [id])

    const getPermissionList = () => {
        setLoading(true)
        Permission.getPermissionsList()
            .then((resp) => {
                const data = { ...resp };
                delete data['service_staff'];
                setPermissions(data);
            })
            .catch((e) => {
                console.error('[Devlog] Error fetching permission list:', e);
            })
            .finally(() => {
                setLoading(false)
            });
    };

    const getRoleData = () => {
        Role.getRoleData({id: id})
            .then(resp => {
                setRole(resp.role);
                setPermissions(resp.permissions);

                const data = { ...resp.permissions };
                setPermissions(data);
            })
            .catch((e) => {
                console.error('[Devlog] Error fetching role data:', e);
            })
            .finally(() => {
                setLoading(false)
            });
    }

    const handleRoleForm = (data) => {
        setLoading(!loading)
        data.permissions = permissions
        if (id) {
            data.id = id;
            updateRole(data)
        } else {
            addRole(data)
        }
    }

    const addRole = (data) => {
        Role.create(data)
            .then(resp => {
                toast.success("Role Created Successfully")
                setIsRoleFormSubmitted(true)
            })
            .catch((e) => {
                toast.error("Error in create role")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const updateRole = (data) => {
        Role.update(data)
            .then(resp => {
                toast.success("Role Updated Successfully")
                setIsRoleFormSubmitted(true)
            })
            .catch((e) => {
                toast.error("Error in update role")
                console.error('[Devlog] Error in update role:', e);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    if (isRoleFormSubmitted) {
        setCreateRole(!createRole)
        setId(null)
        setComeBackFromForm(!comeBackFromForm)
    }

    return (
        <div>
            {loading
                ? <FontAwesomeIcon icon={'spinner'} transform="left-5 down-1" spin />
                : <Formik
                    initialValues={{
                        name: role ? role : '',
                    }}
                    validationSchema={RoleFormSchema}
                    onSubmit={handleRoleForm}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Label className='fw-bold'>
                                Role Name
                            </Label>
                            <Field
                                as={Input}
                                name="name"
                                placeholder={"Enter name of role"}
                                    invalid={touched.name && errors && Object.keys(errors.name).length > 0}
                            />
                            {touched.name && errors.name && <FormFeedback valid={false}>{errors.name}</FormFeedback> }

                            <Label className='mt-3 fw-bold'>
                                    Permissions
                            </Label>
                            <PermissionList
                                id = {id}
                                permissions = {permissions}
                                setPermissions = {setPermissions}
                                loading = {loading}
                            />

                            <Button color="primary" type={"submit"} className={"d-none d-sm-block mb-3"} size="lg" disabled={loading}>
                                { loading && <FontAwesomeIcon icon={'spinner'} transform="left-5 down-1" spin /> }
                                Save
                            </Button>
                        </Form>
                    )}
                </Formik>
            }
        </div>
    )
}

const RoleFormSchema = Yup.object().shape({
    name: Yup
        .string()
        .min(2, "Atleast 2 charactor required")
        .required("Name required")
});
