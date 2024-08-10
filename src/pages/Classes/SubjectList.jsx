import React, { useState, useEffect } from 'react';
import { Row, Col, Label, Input, FormGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import SubjectProvider from '../../providers/SubjectProvider';

export default function SubjectList({ subjectIds, setSubjectIds, loading }) {
    const SP = SubjectProvider();

    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        getSubjectList();
    }, []);

    useEffect(() => {
        if (subjects.length > 0) {
            setSubjects(prevSubjects =>
                prevSubjects.map(subject => ({
                    ...subject,
                    selected: subjectIds.includes(subject.id)
                }))
            );
        }
    }, [subjectIds]);

    const getSubjectList = () => {
        SP.get()
            .then(resp => {
                setSubjects(resp.map(subject => ({ ...subject, selected: subjectIds.includes(subject.id) })));
            })
            .catch((e) => {
                console.error('[Devlog] Error fetching category data:', e);
            });
    };

    const handleSubjectChange = (subjectId) => {
        const updatedSubjects = subjects.map(subject =>
            subject.id === subjectId ? { ...subject, selected: !subject.selected } : subject
        );
        setSubjects(updatedSubjects);

        if (subjectIds.includes(subjectId)) {
            setSubjectIds(subjectIds.filter(id => id !== subjectId));
        } else {
            setSubjectIds([...subjectIds, subjectId]);
        }
    };

    const renderSubjects = () => {
        const third = Math.ceil(subjects.length / 3);

        const firstColumn = subjects.slice(0, third);
        const secondColumn = subjects.slice(third, 2 * third);
        const thirdColumn = subjects.slice(2 * third);

        const renderColumn = (entries) => (
            entries.map((subject) => (
                <FormGroup key={subject.id} className="pl-4 mb-3 d-flex justify-content-between align-items-center">
                    <Label check style={{ flexGrow: 1 }}>
                        <Input
                            id={subject.id}
                            type="checkbox"
                            checked={subject.selected}
                            onChange={() => handleSubjectChange(subject.id)}
                            style={{ marginRight: "10px" }}
                        />
                        {subject.name}
                    </Label>
                </FormGroup>
            ))
        );

        return (
            <Row>
                <Col md={4}>
                    {renderColumn(firstColumn)}
                </Col>
                <Col md={4}>
                    {renderColumn(secondColumn)}
                </Col>
                <Col md={4}>
                    {renderColumn(thirdColumn)}
                </Col>
            </Row>
        );
    };

    return (
        <Row>
            <Col>
                {loading
                    ? <div className='d-flex justify-content-center align-items-center'>
                        <FontAwesomeIcon icon={faSpinner} size='2x' spin />
                    </div>
                    : renderSubjects()
                }
            </Col>
        </Row>
    );
}
