import React, { useState, useEffect } from 'react'
import { setBreadcrumbItems } from '../../store/actions'
import { connect } from 'react-redux'
import { Button, Card, CardHeader, CardBody } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RoleForm from './RoleForm';
import RoleProvider from '../../providers/RoleProvider'
import { toast } from 'react-toastify'
import DataTable from '../../components/Common/DataTable'
import Spinners from '../../components/Common/Spinner';
import NoData from '../../components/Common/NoData'

const RolesList = (props) => {
    document.title = 'Role & Permissions'

    const Role = RoleProvider()

    const [loading, setLoading] = useState(false)
    const [createRole, setCreateRole] = useState(false)
    const [createEditText, setCreateEditText] = useState('Create')
    const [changePage, setChangePage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const [links, setLinks] = useState();
    const [id, setId] = useState(null)
    const [comeBackFromForm, setComeBackFromForm] = useState(false)
    const [roleButton, setRoleButton] = useState(false)
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([
        {
            label: 'Name',
            field: 'name',
            sort: 'asc',
            width: 75,
        },
        {
            label: 'Action',
            field: 'id',
        },
    ])

    useEffect(() => {
        fetchData(changePage)
    }, [roleButton, changePage])  // after deleting role

    // coming back from create/edit form
    useEffect(() => {
        if(comeBackFromForm){
            fetchData()
        }
    }, [comeBackFromForm])

    const fetchData = (page) => {
        let params = {
            page: page,
        }
        setLoading(true)
        Role.getRoleData(params)
            .then(resp => {
                setCurrentPage(resp.current_page);
                setLastPage(resp.last_page);
                setLinks(resp.links)

                if (resp.data && resp.data.length > 0) {
                    let data = resp.data
                    data = data.map((item) => {
                        return {
                            name: item.name,
                            id: (
                                <div className="d-flex justify-content-evenly align-items-center w-25" >
                                    <Button
                                        color="info"
                                        onClick={() =>{
                                            setCreateRole(!createRole)
                                            setCreateEditText('Edit')
                                            setId(item.id)
                                        }}
                                    >
                                        <i className="mdi mdi-account-edit"></i>
                                    </Button>
                                    <Button
                                        color="danger"
                                        onClick={() => roleDelete(item.id)}
                                    >
                                        <i className="mdi mdi-trash-can"></i>
                                    </Button>
                                </div>
                            ),
                        }
                    })
                    setRows(data)
                }
                setComeBackFromForm(false)
            })
            .catch((e) => {
                console.error('Error fetching role list:', e);
            })
            .finally(() => setLoading(false))
            setRoleButton(false)
    }

    const roleDelete = (id) =>{
        Role.delete({ id: id})
            .then(resp => {
                toast.success(resp.message)
                setRoleButton(true)
            })
            .catch((err) => {
                toast.error(err.response.data)
            })
    }

    return (
        <Card className='parent-component-height'>
            <CardHeader className={`${createRole ? '' : 'd-flex justify-content-end mb-3'}`}>
                {createRole
                    ? <h4>
                        <FontAwesomeIcon
                            icon={"arrow-left"}
                            className={"mypointer mr-2 "}
                            onClick={() => {
                                setCreateRole(!createRole)
                                setId(null)
                                setComeBackFromForm(!comeBackFromForm)
                            }}
                        />
                        &nbsp; {createEditText} Role
                    </h4>
                    : <Button
                        onClick={() => {
                            setCreateRole(!createRole)
                            setCreateEditText('Create')
                            setId(null)
                        }}
                        className={"ml-2 d-flex align-items-center"}
                        color="primary">

                        <FontAwesomeIcon icon="plus" className={"mr-2"} />
                        &nbsp; Create Role
                    </Button>
                }
            </CardHeader>
            <CardBody className='h-100 overflow-auto'>
                { loading
                    ? <Spinners setLoading={setLoading} />
                    : (createRole
                        ? <RoleForm
                            createRole={createRole}
                            setCreateRole={setCreateRole}
                            id = {id}
                            setId = {setId}
                            comeBackFromForm = {comeBackFromForm}
                            setComeBackFromForm = {setComeBackFromForm}
                        />
                        : (rows && rows.length > 0 && columns && columns.length > 0)
                        ? (
                            <DataTable
                                rows={rows}
                                columns={columns}
                                links={links}
                                lastPage={lastPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                setChangePage={setChangePage}
                            />
                        ) : (
                            <NoData />
                        )
                    )
                }
            </CardBody>
        </Card>
    )
}

export default connect(null, { setBreadcrumbItems })(RolesList)
