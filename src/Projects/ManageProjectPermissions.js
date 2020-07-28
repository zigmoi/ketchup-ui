import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Form, Input, Tag, Select } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ManageProjectPermissions() {
    const Option = Select.Option;

    const { projectResourceId, userId } = useParams();

    const [iconLoading, setIconLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [userName, setUserName] = useState(userId || "");
    const [projectResourceIdentifier, setProjectResourceIdentifier] = useState(projectResourceId || "");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);


    useEffect(() => {
        document.title = "Manage Project Permissions";
        initColumns();
        setProjectResourceIdentifier(projectResourceId || "");
        setUserName(userId || "");
        loadAllUsers();
        loadAllProjects();
        if (projectResourceId && userId) {
            loadPermissions();
        } else {
            setDataSource([]);
        }
    }, [projectResourceId, userId]);

    function initColumns() {
        const columns = [{
            title: '#',
            key: '#',
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        }, {
            title: 'Permission',
            dataIndex: 'permission',
            key: 'id',
        }, {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                record.status ? <Tag color="blue">ALLOWED</Tag> : <Tag color="red">NOT ALLOWED</Tag>
            )
        }];
        setColumns(columns);
    }

    function loadPermissions() {
        if (userName === ""){
            message.error("Please select a User!");
            return;
        }
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceIdentifier}/user/${userName}/permissions`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function assignSelectedPermissions() {
        if (userName === "") {
            message.error("Please provide a valid userName!");
            return;
        }
        if (projectResourceIdentifier === "") {
            message.error("Please provide a valid project ID!");
            return;
        }
        if ((selectedPermissions.indexOf("create-project") > -1 || selectedPermissions.indexOf("assign-create-project") > -1)
            && projectResourceIdentifier != "*") {
            message.error("create-project and assign-create-project permissions can be assigned for ALL projects and not for specific project!");
            return;
        }

        setIconLoading(true);
        var data = {
            identity: userName,
            projectResourceId: projectResourceIdentifier,
            permissions: selectedPermissions
        };
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/project/assign/permissions`, data)
            .then((response) => {
                setIconLoading(false);
                loadPermissions();
                message.success('Permission assigned successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function revokeSelectedPermissions() {
        if (userName === "") {
            message.error("Please provide a valid userName!");
            return;
        }
        if (projectResourceIdentifier === "") {
            message.error("Please provide a valid project ID!");
            return;
        }
        if ((selectedPermissions.indexOf("create-project") > -1 || selectedPermissions.indexOf("assign-create-project") > -1)
            && projectResourceIdentifier != "*") {
            message.error("create-project and assign-create-project permissions can be revoked for ALL projects and not for specific project!");
            return;
        }
        setIconLoading(true);
        var data = {
            identity: userName,
            projectResourceId: projectResourceIdentifier,
            permissions: selectedPermissions
        };
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/project/revoke/permissions`, data)
            .then((response) => {
                setIconLoading(false);
                loadPermissions();
                message.success('Permission revoked successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function assignSelectedPermissionsOnAllProjects() {
        if (userName === "") {
            message.error("Please provide a valid userName!");
            return;
        }

        setIconLoading(true);
        var data = {
            identity: userName,
            projectResourceId: "*",
            permissions: selectedPermissions
        };
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/project/assign/permissions`, data)
            .then((response) => {
                setIconLoading(false);
                loadPermissions();
                message.success('Permission assigned successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function revokeSelectedPermissionsOnAllProjects() {
        if (userName === "") {
            message.error("Please provide a valid userName!");
            return;
        }

        setIconLoading(true);
        var data = {
            identity: userName,
            projectResourceId: "*",
            permissions: selectedPermissions
        };
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/project/revoke/permissions`, data)
            .then((response) => {
                setIconLoading(false);
                loadPermissions();
                message.success('Permission revoked successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function setMultiSelectedRows(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setSelectedPermissions(selectedRowKeys);
    }

    function loadAllUsers() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/users`)
            .then((response) => {
                setIconLoading(false);
                setUsers(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function loadAllProjects() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/projects`)
            .then((response) => {
                setIconLoading(false);
                setProjects(response.data);
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="start" align="middle" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
                <Col span={11} offset={1}>
                    <Row type="flex" justify="start" align="middle">
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Project Permissions</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <Col span={22}>
                    <Form style={{ backgroundColor: 'white' }}>
                        <Row type="flex" justify="start" align="middle">
                            <Col>
                                <Select style={{ fontSize: 12, width: 200 }}
                                    size="small"
                                    showSearch
                                    value={projectResourceIdentifier}
                                    onChange={(e) => { setProjectResourceIdentifier(e); setDataSource([]) }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>
                                    {projects.map(project => <Option key={project.id.resourceId}>{project.id.resourceId}</Option>)}
                                </Select>
                            </Col>
                            <Divider type="vertical" />
                            <Col>
                                <Select style={{ fontSize: 12, width: 200 }}
                                    size="small"
                                    showSearch
                                    value={userName}
                                    onChange={(e) => { setUserName(e); setDataSource([]) }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>
                                    {users.map(user => <Option key={user.userName}>{user.userName}</Option>)}
                                </Select>
                            </Col>
                            <Divider type="vertical" />
                            <Col>
                                <Button type="primary"
                                    size="small"
                                    htmlType="button"
                                    onClick={() => loadPermissions()}>Load Permissions</Button>
                            </Col>
                        </Row>
                        <br />
                        <Row type="flex" justify="start" align="middle">

                            <Button size="small" type="primary" htmlType="button" onClick={() => assignSelectedPermissions()}>Assign Permissions</Button>
                            <Divider type="vertical" />
                            <Button size="small" type="primary" htmlType="button" onClick={() => revokeSelectedPermissions()}>Revoke Permissions</Button>
                            <Divider type="vertical" />
                            <Button size="small" type="danger" htmlType="button" onClick={() => assignSelectedPermissionsOnAllProjects()}>Assign Permissions on ALL Projects</Button>
                            <Divider type="vertical" />
                            <Button size="small" type="danger" htmlType="button" onClick={() => revokeSelectedPermissionsOnAllProjects()}>Revoke Permissions on ALL Projects</Button>

                        </Row>
                    </Form>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 10 }}
                        columns={columns}
                        rowSelection={{ onChange: setMultiSelectedRows }}
                        size="small" rowKey={record => record.permission} />
                </Col>
            </Row>
        </div>
    );
}

export default ManageProjectPermissions;