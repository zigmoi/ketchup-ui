import { Empty, Icon, Popover, Tag } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

function AdditionalInfo({createdOn, createdBy, lastUpdatedOn, lastUpdatedBy }) {
    let detailsView;
    if (createdOn || createdBy || lastUpdatedOn || lastUpdatedBy) {
        detailsView = (
            <React.Fragment>
                {lastUpdatedOn ?
                    <React.Fragment>
                        <label style={{ fontWeight: 'bold' }}>Last Updated On: </label>
                        <Tag color="#2f54eb">{moment(lastUpdatedOn).format("LLL")}</Tag>
                        <br /><br />
                    </React.Fragment>
                    : null
                }
                {lastUpdatedBy ?
                    <React.Fragment>
                        <label style={{ fontWeight: 'bold' }}>Last Updated By: </label>
                        <Tag color="#eb2f96">{lastUpdatedBy}</Tag>
                        <br /><br />
                    </React.Fragment>
                    : null
                }
                {createdOn ?
                    <React.Fragment>
                        <label style={{ fontWeight: 'bold' }}>Created On: </label>
                        <Tag color="#2f54eb">{moment(createdOn).format("LLL")}</Tag>
                        <br /><br />
                    </React.Fragment>
                    : null
                }
                {createdBy ?
                    <React.Fragment>
                        <label style={{ fontWeight: 'bold' }}>Created By: </label>
                        <Tag color="#eb2f96">{createdBy}</Tag>
                    </React.Fragment>
                    : null
                }
            </React.Fragment>);
    } else {
        detailsView = (
            <Empty description={"No Information Found!"} />
        );
    }
    return (
        <Popover placement="bottomRight"
            content={detailsView}>
            <Icon type="info-circle" />
        </Popover>
    );
}

AdditionalInfo.propTypes ={
    createdOn: PropTypes.string,
    createdBy: PropTypes.string,
    lastUpdatedOn: PropTypes.string,
    lastUpdatedBy: PropTypes.string
}

export default AdditionalInfo;