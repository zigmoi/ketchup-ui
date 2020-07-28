import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Table, message, Spin, Divider, Popconfirm, Input, Select } from 'antd';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function ManageProjectMembers() {
    const Option = Select.Option;
    const [iconLoading, setIconLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [memberName, setMemberName] = useState("");
    const [users, setUsers] = useState([]);
    const { projectResourceId } = useParams();

    useEffect(() => {
        document.title = "Manage Project Members";
        initColumns();
        loadAll();
        loadAllUsers();
    }, [projectResourceId]);

    function initColumns() {
        const columns = [{
            title: '#',
            key: '#',
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        }, {
            title: 'Name',
            dataIndex: '',
            key: 'id',
        }, {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" size="small">
                        <Link to={`/app/project/${projectResourceId}/permissions/${record}`}>Permissions</Link>
                    </Button>
                    <Divider type="vertical" />
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => removeProjectMember(record)}>
                        <Button type="danger" size="small">Remove</Button>
                    </Popconfirm>
                </span>
            )
        }];

        setColumns(columns);
    }

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceId}/members`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
                if (response.data.length == 0) {
                    message.info("No members found!");
                }
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }


    function removeProjectMember(selectedRecord) {
        setIconLoading(true);
        let memberName = selectedRecord;
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceId}/member/${memberName}/remove`)
            .then((response) => {
                setIconLoading(false);
                setMemberName("");
                reloadTabularData();
                message.success('Member removed successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }

    function addMember() {
        if (memberName === "") {
            message.error("Please provide a valid user name to add as member!");
            return;
        }
        setIconLoading(true);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceId}/member/${memberName}/add`)
            .then((response) => {
                setIconLoading(false);
                reloadTabularData();
                message.success('Member added successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
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

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="start" align="middle" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
                <Col span={11} offset={1}>
                    <Row type="flex" justify="start" align="middle">
                        <label style={{ fontWeight: 'bold', fontSize: 18 }} > Manage Project Members</label>
                        <span>&nbsp;&nbsp;</span>
                        <Spin spinning={iconLoading} />
                    </Row>
                </Col>
            </Row>
            <br />
            <Row type="flex" justify="center" align="middle">
                <Col span={22}>
                    <Row type="flex" justify="start" align="middle">
                        <Col>
                            <Select style={{ fontSize: 12, width: 200 }}
                                size="small"
                                showSearch
                                value={memberName}
                                onChange={(e) => { setMemberName(e) }}
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
                                onClick={() => addMember()}>Add Member</Button>
                        </Col>
                    </Row>
                    <Table dataSource={dataSource}
                        pagination={{ defaultPageSize: 8 }}
                        columns={columns}
                        size="middle" rowKey={record => record} />
                </Col>
            </Row>
        </div>
    );
}

export default ManageProjectMembers;