import React, { useEffect, useState } from 'react'
import { setBreadcrumbItems } from '../../store/actions'
import { connect } from 'react-redux'
import { Button, Card, CardBody, CardHeader, Col, Row, Input } from 'reactstrap'
import StaffProvider from './StaffProvider'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/Common/DataTable'
import NoData from '../../components/Common/NoData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListActions } from '../../helpers/widgets/ListActions';
import _ from 'lodash';
import { toast } from 'react-toastify'
import Spinners from '../../components/Common/Spinner'
import StaffForm from './StaffForm'

const Staff = (props) => {
    document.title = 'Staff'
    const nav = useNavigate()
    const breadcrumbItems = [{ title: 'Staff', link: '/staff' }]

    const SP = StaffProvider()

    const [loading, setLoading] = useState(true);
    const [createStaff, setCreateStaff] = useState(false)
    const [createEditText, setCreateEditText] = useState('Create')
    const [id, setId] = useState(null)
    const [comeBackFromForm, setComeBackFromForm] = useState(false)
    const [changePage, setChangePage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const [links, setLinks] = useState();
    const [rows, setRows] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [roleButton, setRoleButton] = useState(false)
    const [columns, setColumns] = useState([
        {
            label: 'Status',
            field: 'status',
            width: 150,
        },
        {
            label: 'Name',
            field: 'name',
            sort: 'asc',
            width: 150,
        },
        {
            label: 'Email',
            field: 'email',
            width: 150,
        },
        {
            label: 'Phone',
            field: 'phone',
            width: 150,
        },
        {
            label: 'DOB',
            field: 'dob',
            width: 150,
        },
        {
            label: 'Role',
            field: 'role',
            width: 150,
        },
        {
            label: 'Actions',
            field: 'uuid',
            width: 150,
        },
    ])

    useEffect(() => {
        window.Echo.channel('staff-update')
            .listen('update', (e) => {
                getStaff(searchValue, changePage)
            });
    }, [])

    useEffect(() => {
        getStaff(searchValue, changePage)
    }, [roleButton, changePage])

    // coming back from create/edit form
    useEffect(() => {
        if(comeBackFromForm){
            getStaff()
        }
    }, [comeBackFromForm])

    const getStaff = (search, page) => {
        let params = {
            search: search,
            page: search ? 1 : page
        }
        SP.staffList(params)
            .then((resp) => {
                setRows([])
                setCurrentPage(resp.current_page);
                setLastPage(resp.last_page);
                setLinks(resp.links)

                if (resp.data && resp.data.length > 0) {
                    let data = resp.data
                    data = data.map((item) => {
                        console.log("item", item)
                        return {
                            name: `${item.staff_meta.first_name} ${item.staff_meta.last_name}`,
                            email: item.email,
                            phone: item.phone ? `+${item.phone}` : '-',
                            dob: item.staff_meta.dob,
                            role: item.role,
                            status:(
                                <FontAwesomeIcon
                                    icon="circle"
                                    className={item.deleted_at ? "text-danger" : "text-success"}
                                />
                            ),
                            uuid: (
                                <ListActions
                                    handleEdit={() => {
                                        setCreateStaff(!createStaff)
                                        setCreateEditText('Edit')
                                        setId(item.id)
                                    }}
                                    handleArchive={() => handleArchive(item.uuid)}
                                    isEnabled={!_.isEmpty(item.deleted_at)}
                                />
                            ),
                        }
                    })
                    setRows(data)
                }
            })
            .catch((err) => {
                console.log('staff create err', err)
            }).finally(() => {
                setLoading(false)
            })
    }

    //to enable/disable
    const handleArchive = (uuid) => {
        SP.patch({id: uuid})
            .then(resp => {
                let enableDisable = resp.deleted_at ? "Disabled" : "Enabled";
                toast.success(`${resp.name} ${enableDisable} Successfully!!`)
                getStaff(searchValue, changePage)
            }, (e) => {
                toast.error("Internal server error.")
            })
    }

    return (
        <Card className='parent-component-height'>
            <CardHeader>
                { createStaff
                    ? <h4>
                        <FontAwesomeIcon
                            icon={"arrow-left"}
                            className={"mypointer mr-2 "}
                            onClick={() => {
                                setCreateStaff(!createStaff)
                                setId(null)
                                setComeBackFromForm(!comeBackFromForm)
                            }}
                        />
                        &nbsp; {createEditText} Staff
                    </h4>
                    : <Row className='d-flex justify-content-end'>
                        <Col md={10} lg={10} className="my-1">
                            <form
                                onSubmit={(e) => { e.preventDefault();}}
                                style={{ display: "flex", flexDirection: "row" }}
                            >
                                <Input
                                    onChange={(e) => {
                                        setSearchValue(e.target.value)
                                    } }
                                    className="search-filter-input custom-height"
                                />
                                <Button type="submit" onClick={(e) => { getStaff(searchValue, changePage) }} className="search-filter-button">
                                    <FontAwesomeIcon
                                        icon="fa-search"
                                        className="text-light" />
                                </Button>
                            </form>
                        </Col>
                        <Col>
                            <Button
                                color="primary"
                                onClick={() => {
                                    setCreateStaff(!createStaff)
                                    setId(null)
                                    setComeBackFromForm(!comeBackFromForm)
                                }}
                                className='w-100'
                            >
                                Add Staff
                            </Button>
                        </Col>
                    </Row>
                }
            </CardHeader>
            <CardBody className='h-100 overflow-auto'>
                {loading
                    ? <Spinners setLoading={setLoading} />
                    : (createStaff
                        ? <StaffForm
                            createStaff={createStaff}
                            setCreateStaff={setCreateStaff}
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

export default connect(null, { setBreadcrumbItems })(Staff)
