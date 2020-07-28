import { Button, Col, Form, Input, message, Row, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AdditionalInfo from '../AdditionalInfo';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

function EditProject(props) {
    document.title = "Edit Project";
    const { getFieldDecorator, validateFieldsAndScroll } = props.form;

    const [iconLoading, setIconLoading] = useState(false);
    const [resourceId, setResourceId] = useState("");
    const [description, setDescription] = useState("");
    const [createdOn, setCreatedOn] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);
    const [lastUpdatedOn, setLastUpdatedOn] = useState(null);
    const [lastUpdatedBy, setLastUpdatedBy] = useState(null);

    let history = useHistory();
    const { projectResourceId } = useParams();

    useEffect(() => {
        loadDetails();
    }, [projectResourceId]);


    function loadDetails() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setResourceId(response.data.id.resourceId);
                setDescription(response.data.description);
                setCreatedOn(response.data.createdOn);
                setCreatedBy(response.data.createdBy);
                setLastUpdatedOn(response.data.lastUpdatedOn);
                setLastUpdatedBy(response.data.lastUpdatedBy);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function update(e) {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                setIconLoading(true);
                axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${resourceId}/${values.description}`)
                    .then((response) => {
                        setIconLoading(false);
                        message.success('Project updated successfully.', 5);
                        history.push(`/app/projects`);
                    })
                    .catch((error) => {
                        setIconLoading(false);
                    });
            }
        });
    }

    let extraInfo = (
        <AdditionalInfo
            createdOn={createdOn}
            createdBy={createdBy}
            lastUpdatedOn={lastUpdatedOn}
            lastUpdatedBy={lastUpdatedBy} />
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                <Col span={24}>
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >Edit Project</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form onSubmit={update} style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="Project ID:">
                            <Input readOnly value={resourceId} suffix={extraInfo} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Description:" hasFeedback>
                            {getFieldDecorator('description', {
                                initialValue: description,
                                rules: [
                                    {
                                        max: 100,
                                        message: 'Only 100 characters are allowed!',
                                    },
                                ],
                            })(<Input.TextArea placeholder="Description" autosize={{ minRows: 2, maxRows: 5 }} />)}
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="center" align="middle">
                                <Col>
                                    <Button type="primary" loading={iconLoading} htmlType="submit" >Submit</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

const WrappedComponent = Form.create({ name: 'edit-project' })(EditProject);
export default WrappedComponent;