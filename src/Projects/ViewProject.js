import { Col, Form, Icon, Input, Row, Spin, Tooltip } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdditionalInfo from '../AdditionalInfo';

function ViewProject() {
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

    const [iconLoading, setIconLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [createdOn, setCreatedOn] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);
    const [lastUpdatedOn, setLastUpdatedOn] = useState(null);
    const [lastUpdatedBy, setLastUpdatedBy] = useState(null);

    const { projectResourceId } = useParams();

    useEffect(() => {
        document.title = "Project Details";
        loadProject();
    }, []);

    function loadProject() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceId}`)
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                setName(response.data.id.resourceId);
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

    let editLink;
    editLink = (
        <Link to={`/app/project/${projectResourceId}/edit`}>
            <Tooltip title="Edit">
                <Icon type="edit" />
            </Tooltip>
        </Link>
    );

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
                    <label style={{ fontWeight: 'bold', fontSize: 18 }} >View Project: General Details{editLink}</label>
                    <span>&nbsp;&nbsp;</span>
                    <Spin spinning={iconLoading} />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={24}  >
                    <Form style={{ backgroundColor: 'white' }}>
                        <FormItem {...formItemLayout} label="Name:">
                            <Input value={name} readOnly suffix={extraInfo} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="Description:">
                        <Input.TextArea 
                            placeholder="Description"
                            readOnly 
                            value={description} 
                            autosize={{ minRows: 2, maxRows: 5 }} />
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default ViewProject;