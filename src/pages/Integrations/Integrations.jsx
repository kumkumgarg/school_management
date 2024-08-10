import React, { useEffect, useState } from 'react'
import { setBreadcrumbItems } from '../../store/actions'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardTitle, Col, Row } from 'reactstrap'
const Integrations = (props) => {
    document.title = 'Integrations'

    const breadcrumbItems = [{ title: 'Integrations', link: '/integrations' }]
    const nav = useNavigate()
    const [integration, setIntegration] = useState(false)

    useEffect(() => {
        props.setBreadcrumbItems('Integrations', breadcrumbItems)
    }, [])

    const checkIntegration = () => {
       console.log("inside check Integration")
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            {/* integrations list here */}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(Integrations)
