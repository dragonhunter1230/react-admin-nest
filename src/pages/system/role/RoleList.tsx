import React, { FC, useEffect, useState } from 'react';
import { Button, Table, Modal, message, Tag, Alert } from 'antd';
import './RoleList.less';
import { getallrole, deleterole, getUsersByRoleCode, findAllMenu, getMenusByRoleCode } from 'api/nest-admin/Rbac';
import RoleEditModal from './RoleEditModal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ChecksUsersModal from 'pages/commponents/modalmessage/ChecksUsersModal';
import { findalluser } from 'api/nest-admin/User';
import ChecksMenusModal from 'pages/commponents/modalmessage/ChecksMenusModal';
const { confirm } = Modal;
const RoleList: FC = () => {
  const [userslist, setUserslist] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setID] = useState(null);
  const [visible, setVisible] = useState(false);
  const [role, setRole] = useState({});
  const [allUser, setAllUser] = useState([]);
  const [changeUser, setChangeUser] = useState([]);
  const [checksUserVisible, setchecksUserVisible] = useState(false);

  //่ๅๆจกๅ
  const [allMenu, setAllMenu] = useState([]);
  const [changeMenu, setChangeMenu] = useState([]);
  const [checksMenuVisible, setChecksMenuVisible] = useState(false);

  useEffect(() => {
    findAll();
    findalluser({}).then(result => {
      if (result.data.code === 200) {
        setAllUser(result.data.data || []);
      }
    });
    findAllMenu({ isdeleted: 0 }).then((result: any) => {
      if (result.data.code === 200) {
        setAllMenu(result.data.data || []);
      }
    });
  }, []);
  const findAll = () => {
    getallrole({}).then(result => {
      if (result.data.code === 200) {
        setUserslist(result.data.data || []);
      }
    });
  };
  const willGiveUser = (record: any) => {
    getUsersByRoleCode({ roleCode: record.roleCode }).then(result => {
      if (result.data.code === 200) {
        setRoleCode(record.roleCode);
        setChangeUser(result.data.data || []);
        setchecksUserVisible(true);
      }
    });
  };
  // ๅ้่ๅ
  const willGiveMenu = (record: any) => {
    getMenusByRoleCode({ roleCode: record.roleCode }).then(result => {
      if (result.data.code === 200) {
        setRoleCode(record.roleCode);
        setChangeMenu(result.data.data || []);
        setChecksMenuVisible(true);
      }
    });
  };

  const changeDelStasus = (item: any) => {
    showDeleteConfirm(item);
  };
  const showDeleteConfirm = (item: any) => {
    confirm({
      title: 'ๆ็คบ',
      icon: <ExclamationCircleOutlined />,
      content: (
        <span style={{ color: 'red', fontSize: '19px' }}>{`ๆฏๅฆ${item.isdeleted ? 'ๅฏ็จ' : '็ฆ็จ'}่ฏฅ็จๆท๏ผ`}</span>
      ),
      okText: '็กฎๅฎ',
      okType: 'danger',
      cancelText: 'ๅๆถ',
      onOk: async () => {
        const result = await deleterole({ ...item, isdeleted: item.isdeleted === 0 ? 1 : 0 });
        if (result.data.code === 200) {
          message.info('ๆไฝๆๅ');
          findAll();
          return;
        }
        message.info('ๆไฝๅคฑ่ดฅ');
      },
      onCancel() {}
    });
  };

  const columns: any = [
    {
      title: '่ง่ฒๅ็งฐ',
      dataIndex: 'name'
    },
    {
      title: '่ง่ฒไปฃ็?',
      dataIndex: 'roleCode',
      responsive: ['lg']
    },
    {
      title: 'ๅคๆณจ',
      dataIndex: 'remarks',
      responsive: ['lg']
    },
    {
      title: 'ๆๅบ',
      dataIndex: 'sort',
      responsive: ['lg']
    },
    {
      title: '็ถๆ',
      dataIndex: 'isdeleted',
      render: (item: any) => {
        if (item) {
          return (
            <Tag color="#f50">
              <span>็ฆ็จ</span>
            </Tag>
          );
        }
        return (
          <Tag color="#2db7f5">
            <span>ๅฏ็จ</span>
          </Tag>
        );
      }
    },
    {
      title: 'ๆไฝ',
      render: (item: any) => {
        return (
          <div>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                willGiveUser(item);
              }}
              style={{ marginRight: '10px' }}
            >
              ๅ้ไบบๅ
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                willGiveMenu(item);
              }}
              style={{ marginRight: '10px' }}
            >
              ๅ้่ๅ
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                roleEdit(item);
              }}
              style={{ marginRight: '10px' }}
            >
              ็ผ่พ
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                changeDelStasus(item);
              }}
            >
              {item.isdeleted === 0 ? '็ฆ็จ' : 'ๅฏ็จ'}
            </Button>
          </div>
        );
      }
    }
  ];

  const addOneRole = () => {
    setVisible(true);
    setIsEdit(false);
    setID(null);
  };
  const roleEdit = (item: any) => {
    setVisible(true);
    setIsEdit(true);
    setRole(item);
    setID(item.id);
  };

  const [roleCode, setRoleCode] = useState('-1');
  const usercallback = (flag: boolean) => {
    if (flag) {
      findAll();
    }
    setchecksUserVisible(false);
    setChecksMenuVisible(false);
    setVisible(false);
  };

  return (
    <div className="users-list-page">
      <Alert
        message={
          <h1>
            ๆๅไปฌ,ๅฑไปฌๅฐฝ้ๅซๆนๅจ {<span style={{ fontSize: '15px', color: 'red' }}>qkstat</span>}{' '}
            ็ๆ้ๅ่ๅ๏ผๅ?ไธบๆฐไบบ็ป้่ฟๆฅ้ฝๆฏ่ฟไธช่ดฆๅท๏ผ็ฅๅคงๅฎถไฝ้ชๆๅฟซ๏ผๆ้ฎ้ขๅฏไปฅๆ{' '}
            {<span style={{ fontSize: '15px', color: 'red' }}>issues</span>} ,ๆไผๅๆถๅๅคๆจ็ใ
          </h1>
        }
        type="success"
      />
      <Button type="primary" onClick={addOneRole}>
        ๆทปๅ?่ง่ฒ
      </Button>
      <RoleEditModal visible={visible} isEdit={isEdit} id={id} initRoleItem={role} pendingCallback={usercallback} />
      <Table columns={columns} dataSource={userslist} rowKey={(record: any) => record.id}></Table>
      <ChecksUsersModal
        allUser={allUser}
        changeUser={changeUser}
        visible={checksUserVisible}
        roleCode={roleCode}
        pendingCallback={usercallback}
      />
      <ChecksMenusModal
        allMenu={allMenu}
        changeMenu={changeMenu}
        roleCode={roleCode}
        visible={checksMenuVisible}
        pendingCallback={usercallback}
      />
    </div>
  );
};

export default RoleList;
