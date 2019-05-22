'use strict';

const AV = require('leanengine');
const UserComponent = require('../../prototype/userComponent');
const IError = require('../../prototype/errorComponent');


class AdminHandle extends UserComponent {
    constructor() {
        super();
    }
    //用户名密码登录
    async loginWithUsername(req, res, next) {
        const {username, password} = req.body;
        try {
            if (!username) {
                throw new IError(400, '用户名参数错误');
            } else if (!password) {
                throw new IError(400, '密码参数错误');
            }
            const user = await AV.User.logIn(username, password);
            const sysUser_query = new AV.Query('SysUser');
            sysUser_query.equalTo('userId', user);
            sysUser_query.include('roleId');
            sysUser_query.ascending('roleId.roleLevel');
            let sysUsers = await sysUser_query.find({user: user});
            if (sysUsers.length <= 0) {
                throw new IError(403, '权限错误');
            }
            res.saveCurrentUser(user);
            res.json({
                status: 'success',
                userId: user.getObjectId()
            });
        } catch (error) {
            if(error.message.startsWith('The username and password mismatch.')) {
                error.message = '用户名或密码错误'
            }
            next(error);
        }
    }

    //添加角色
    async addRole(req, res, next) {
        const {
            roleName,
            roleNickName,
            roleACLArray,
            roleFollower,
            parentRole,
            user = req.currentUser
        } = req.body;
        try {
            if (!roleName) {
                throw new IError(400, '角色名参数错误');
            } else if (!roleNickName) {
                throw new IError(400, '角色昵称参数错误');
            } else if (!roleACLArray) {
                throw new IError(400, '角色操作权限参数错误');
            }
            let roleACL = new AV.ACL();

            //设置默认读写权限
            roleACL.setPublicWriteAccess(false);
            roleACL.setPublicReadAccess(true);

            roleACL.setRoleReadAccess('Administrator', true);
            roleACL.setRoleWriteAccess('Administrator', true);

            //设置用户设定读写权限
            roleACLArray.forEach((roleACLER) => {
                switch (roleACLER.roleSet) {
                    case 'r':
                        break;
                    case 'w':`  `
                        roleACL.setRoleWriteAccess(roleACLER.roleNameSet, true);
                        break;
                    case 'rw':
                        roleACL.setRoleWriteAccess(roleACLER.roleNameSet, true);
                }
            });

            /**
             * 新建角色*/
            const newRole = new AV.Role(roleName, roleACL);
            newRole.set('nickName', roleNickName);
            let role = await newRole.save(null, {user: user});
            // 创建成功
            if (roleFollower !== []) {
                let followerArray = [];
                roleFollower.forEach(t => {
                    let follower = AV.Object.createWithoutData('_Role', t);
                    followerArray.push(follower);
                });
                role.getRoles().add(followerArray);
            }
            if (typeof parentRole !== 'undefined' && parentRole !== '') {
                role.set('parentRole', AV.Object.createWithoutData('_Role', parentRole));
            }
            role.save(null, {user: user}).then(userForRole => {
                res.json(userForRole);
            }).catch(error => {

                role.destroy({user: user}).then(result => {
                    next(error);
                }).catch(function (error) {
                    error.message = error.message + '添加角色出现错误,删除角色出现错误!';
                    next(error);
                });
            });
        } catch(error) {
            if(error.message.startsWith('A unique field was given a value that is already taken')) {
                error.message = '角色已存在'
            }
            next(error);
        }
    }

    //删除角色
    async delRole(req, res, next) {
        const {roleId, user = req.currentUser} = req.body;
        try {
            if (!roleId) {
                throw new IError(400, '角色Id参数错误');
            }
            const roleQuery = new AV.Query('_Role');
            const role = await roleQuery.get(roleId, {user: user});

            if (!role) {
                throw new IError(400, '未找到此角色')
            } else {
                let delSuccess = await role.destroy({user: user});
                res.json({
                    status: 'success',
                    message: delSuccess
                });
            }
        } catch (error) {
            next(error);
        }
    }

    //删除上传log设备
    async deldevicelog(req, res, next) {
        const {DevicesSN, user = req.currentUser} = req.body;
        try {
            if (!DevicesSN) {
                throw new IError(400, '角色Id参数错误');
            }
            const roleQuery = new AV.Query('DeviceLog_SN');
            const role = await roleQuery.get(DevicesSN, {user: user});

            if (!role) {
                throw new IError(400, '未找到此角色')
            } else {
                let delSuccess = await role.destroy({user: user});
                res.json({
                    status: 'success',
                    message: delSuccess
                });
            }
        } catch (error) {
            next(error);
        }
    }

    //删除上传语音log设备
    async delSpeechDeviceLog(req, res, next) {
        const {DevicesSN, user = req.currentUser} = req.body;
        try {
            if (!DevicesSN) {
                throw new IError(400, '参数错误');
            }
            const roleQuery = new AV.Query('SpeechLog_SN');
            const role = await roleQuery.get(DevicesSN, {useMasterKey:true});

            if (!role) {
                throw new IError(400, '未找到此角色')
            } else {
                let delSuccess = await role.destroy({useMasterKey:true});
                res.json({
                    status: 'success',
                    message: delSuccess
                });
            }
        } catch (error) {
            next(error);
        }
    }

    //获取角色
    async getRoles(req, res, next) {
        const {searchText, pageSize = 10, pageNumber = 1, user = req.currentUser} = req.query;
        try {
            //查询角色
            let query = new AV.Query('_Role');
            if (searchText) {
                query.contains('nickName', searchText);
            }
            query.notEqualTo('roleLevel', null);
            query.limit(pageSize);
            query.ascending('name');
            query.skip((pageNumber - 1) * pageSize);
            let roles = await query.find({user: user});

            roles = roles.map(function (role, index) {
                return role.toJSON();
            });

            //查询总数
            if (searchText) {
                let total = new AV.Query('_Role');
                total.contains('nickName', searchText);
                total.notEqualTo('roleLevel', null);
                let count = await total.count({user: user});
                res.json({
                    total: count,
                    rows: roles
                });
            } else {
                let total = new AV.Query('_Role');
                total.notEqualTo('roleLevel', null);
                let count = await total.count({user: user});
                res.json({
                    total: count,
                    rows: roles
                });
            }
        } catch (error) {
            next(error);
        }
    }

    //获取查询log的设备
    async getDevicelog(req, res, next) {
        const {searchText, pageSize = 10, pageNumber = 1, user = req.currentUser} = req.query;
        try {
            //查询log的设备
            let query = new AV.Query('DeviceLog_SN');
            if (searchText) {
                query.contains('DeviceSN', searchText);
            }
            query.limit(pageSize);
            query.descending('createdAt');
            query.skip((pageNumber - 1) * pageSize);
            let roles = await query.find({user: user});

            roles = roles.map(function (role, index) {
                return role.toJSON();
            });

            //查询总数
            if (searchText) {
                let total = new AV.Query('DeviceLog_SN');
                total.contains('DeviceSN', searchText);
                let count = await total.count({user: user});
                res.json({
                    total: count,
                    rows: roles
                });
            } else {
                let total = new AV.Query('DeviceLog_SN');
                let count = await total.count({user: user});
                res.json({
                    total: count,
                    rows: roles
                });
            }
        } catch (error) {
            next(error);
        }
    }

    //获取查询log的设备
    async getSpeechDevicelog(req, res, next) {
        const {searchText, pageSize = 10, pageNumber = 1, user = req.currentUser} = req.query;
        try {
            //查询log的设备
            let query = new AV.Query('SpeechLog_SN');
            if (searchText) {
                query.contains('DeviceSN', searchText);
            }
            query.limit(pageSize);
            query.descending('createdAt');
            query.skip((pageNumber - 1) * pageSize);
            let roles = await query.find({useMasterKey:true});

            roles = roles.map(function (role, index) {
                return role.toJSON();
            });

            //查询总数
            if (searchText) {
                let total = new AV.Query('SpeechLog_SN');
                total.contains('DeviceSN', searchText);
                let count = await total.count({useMasterKey:true});
                res.json({
                    total: count,
                    rows: roles
                });
            } else {
                let total = new AV.Query('SpeechLog_SN');
                let count = await total.count({useMasterKey:true});
                res.json({
                    total: count,
                    rows: roles
                });
            }
        } catch (error) {
            next(error);
        }
    }

    //修改角色权限
    async authority(req, res, next) {
        const {roleId, menuNodes, user = req.currentUser} = req.body;
        try {
            if (!roleId) {
                throw new IError(400, '角色Id参数错误');
            } else if (!menuNodes) {
                throw new IError(400, '角色权限参数错误');
            }
            const role_query = new AV.Query('_Role');
            const role = await role_query.get(roleId);

            const acl = new AV.ACL();
            acl.setRoleReadAccess('Administrator', true);
            acl.setRoleWriteAccess('Administrator', true);
            acl.setRoleReadAccess(role, true);

            //查询父节点是否已绑定
            const menu_query = new AV.Query('SysWebMenuRelation');
            menu_query.equalTo('roleId', role);
            const menu = await menu_query.find({user: user});
            if (menu.length > 0){
                await AV.Object.destroyAll(menu, {user: user});
            }
            let menuObjs = [];
            menuNodes.forEach((node, index) => {
                //有子节点的菜单
                if (typeof node.childMenu != 'undefined' && node.childMenu != [] && node.childMenu.length != 0) {
                    const mainNode = new AV.Object('SysWebMenuRelation');
                    mainNode.setACL(acl);
                    mainNode.set('roleId', role);
                    mainNode.set('menuId', AV.Object.createWithoutData('SysWebMenu', node.objectId));
                    return node.childMenu.forEach((child, index) => {
                        const childNode = new AV.Object('SysWebMenuRelation');
                        childNode.setACL(acl);
                        childNode.set('roleId', role);
                        childNode.set('menuId', AV.Object.createWithoutData('SysWebMenu', child));
                        childNode.set('parentId', mainNode);
                        menuObjs.push(childNode);
                    });
                } else {
                    //无子节点的菜单
                    const mainNode1 = new AV.Object('SysWebMenuRelation');
                    mainNode1.setACL(acl);
                    mainNode1.set('roleId', role);
                    mainNode1.set('menuId', AV.Object.createWithoutData('SysWebMenu', node.objectId));
                    menuObjs.push(mainNode1);
                }
            });
            await AV.Object.saveAll(menuObjs, {user: user});
            res.json({
                status: 'success',
                message: '更新成功'
            })
        } catch (error) {
            next(error);
        }
    }

    //获取系统菜单
    async getAllMenu(req, res, next) {
        const {level, parentId, user = req.currentUser} = req.query;
        try {
            const menu_query = new AV.Query('SysWebMenu');
            if (req.query.level && req.query.level == '1') {
                menu_query.equalTo('nodeLevel', 1);
            } else if (req.query.level && req.query.level == '2') {
                menu_query.equalTo('nodeLevel', 2);
                if (req.query.parentId) {
                    menu_query.equalTo('parentNode', AV.Object.createWithoutData('SysWebMenu', req.query.parentId));
                }
            }
            menu_query.include('parentNode');
            menu_query.ascending('weight');
            menu_query.find({user: user}).then(function (menus) {
                res.json(menus);
            });
        } catch (error) {
            next(error);
        }
    }

    //获取系统管理用户
    async getAllSysUser(req, res, next) {
        const user = req.currentUser;
        try {
            const role_query = new AV.Query('_Role');
            const role = await role_query.get(req.query.roleId, {user: user});
            const relation = role.relation('users');
            const users = await relation.query().find({user: user});
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    //角色添加用户
    async roleAddUser(req, res, next) {
        const {roleName, username, user = req.currentUser} = req.body;
        try {
            if (!roleName) {
                throw new IError(400, '角色名称参数错误');
            } else if (!username) {
                throw new IError(400, '用户名参数错误');
            }
            const userQuery = new AV.Query('_User');
            userQuery.equalTo('username', username);
            const TUser = await userQuery.first({user: user});
                if (TUser) {
                    const roleQuery = new AV.Query('_Role');
                    roleQuery.equalTo('name', roleName);
                    const role = await roleQuery.first({user: user});
                    //角色不包含此用户
                    if (role) {
                        role.getUsers().add(TUser);
                        const acl = new AV.ACL();
                        acl.setPublicReadAccess(true);
                        acl.setPublicWriteAccess(false);
                        acl.setRoleWriteAccess('Administrator', true);
                        const sysUserObj = new AV.Object('SysUser');
                        sysUserObj.setACL(acl);
                        sysUserObj.set({
                            roleId: role,
                            userId: TUser
                        });
                        const {p1, p2} = await Promise.all([
                            role.save(null, {user: user}),
                            sysUserObj.save(null, {user: user})
                        ]);
                        if (p1 != Error && p2 != Error){
                            res.json({
                                status: 'success',
                                message: '添加用户成功'
                            });
                        }
                    } else {
                        //找不到这个角色
                        throw new IError(400, "未找到此角色");
                    }
                } else {
                        throw new IError(400, "未找到此用户");
                }
        } catch (error) {
            next(error);
        }
    }

    //为角色移除用户
    async roleDelUser(req, res, next) {
        const {users, roleName, user = req.currentUser} = req.body;
        try {
            if (users == [] && users.length ==0) {
                throw new IError(400, '用户参数错误');
            } else if (!roleName) {
                throw new IError(400, '角色参数错误');
            }
            const roleQuery = new AV.Query('_Role');
            roleQuery.equalTo('name', roleName);
            const role = await roleQuery.first({user: user});
            if (role) {
                //根据用户删除_Role表中的relation关系,并返回SysUser表的查询Promise组合;
                const sysUsersPromise = users.map((node, index) => {
                    const TUser = AV.Object.createWithoutData('_User', node);
                    role.getUsers().remove(TUser);
                    const sysUser_query = new AV.Query('SysUser');
                    sysUser_query.equalTo('roleId', role);
                    sysUser_query.equalTo('userId', TUser);
                    return sysUser_query.first();
                });
                //查询系统用户(SysUser)
                const sysUsers = await Promise.all(sysUsersPromise);
                const allPromise = [AV.Object.destroyAll(sysUsers, {user: user}), role.save(null, {user: user})];
                await Promise.all(allPromise);
                //有这个角色
                res.json({
                    status: 'success',
                    message: '成功取消授权'
                });
            } else {
                throw new IError(400, '未找到此角色');
            }
        } catch (error) {
            next(error);
        }
    }

    //获取用户
    async getUsers(req, res, next) {
        const {
            searchUsername,
            searchNickname,
            searchPhoneNumber,
            searchGender,
            searchBan,
            searchWechat,
            pageSize = 10,
            pageNumber = 1,
            user = req.currentUser
        } = req.query;
        const user_query = new AV.Query('_User');
        console.log(searchGender)
        if (searchUsername) {
            user_query.contains('username', searchUsername);
        } else if (searchNickname) {
            user_query.contains('nickName', searchNickname);
        } else if (searchPhoneNumber) {
            user_query.equalTo('mobilePhoneNumber', searchPhoneNumber);
        } else if(searchGender) {
            if(searchGender == '男') {
                user_query.equalTo('gender', 1);
            } else if(searchGender == '女') {
                user_query.equalTo('gender', 2);
            }
        } else if(searchBan) {
            user_query.equalTo('isActive', 0);
        } else if(searchWechat) {
            if(searchWechat == 'true') {
                user_query.exists('authData');
            } else if(searchWechat == 'false') {
                user_query.doesNotExist('authData');
            }
        }

        user_query.select(['username', 'nickName', 'gender', 'mobilePhoneVerified', 'email','emailVerifiled', 'isActive']);
        user_query.limit(pageSize);
        user_query.skip((pageNumber - 1) * pageSize);
        user_query.ascending('username');
        let users = await user_query.find({user: user});

        res.json({
            total: users.length,
            rows:users
        });
    }

    //用户封禁
    async banUser(req, res, next) {
        const userId = req.body.userId;
        const user = req.currentUser;
        try {
            if (!userId) {
                throw new IError(400, "用户Id参数错误");
            }
            const user_query = new AV.Query('_User');
            const userTodo = await user_query.get(userId, {user: user});
            if (userTodo) {
                userTodo.set('isActive', 0);
                await userTodo.save(null, {useMasterKey: true});
                res.json({
                    status: 'success',
                    message: '成功封禁'
                });
            } else {
                throw new IError(400, '未找到用户');
            }
        } catch (error) {
            next(error);
        }
    }

    //用户解封
    async unbanUser(req, res, next) {
        const userId = req.body.userId;
        const user = req.currentUser;
        try {
            if (!userId) {
                throw new IError(400, "用户Id参数错误");
            }
            const user_query = new AV.Query('_User');
            const userTodo = await user_query.get(userId, {user: user});
            if (userTodo) {
                userTodo.set('isActive', 1);
                await userTodo.save(null, {useMasterKey: true});
                res.json({
                    status: 'success',
                    message: '成功解封'
                });
            } else {
                throw new IError(400, '未找到用户');
            }
        } catch (error) {
            next(error);
        }
    }

    //获取设备列表
    async getDevices(req, res, next) {
        const {
            searchSN,
            searchIMEI,
            searchMAC,
            searchStatus,
            searchIsActive,
            pageSize = 10,
            pageNumber = 1,
            user = req.currentUser
        } = req.query;

        try {
            let device_query = new AV.Query('DeviceMain');
            let device_total_query = new AV.Query('DeviceMain');
            if(searchSN) {
                device_query.contains('deviceSN', searchSN);
                device_total_query.contains('devcieSN', searchSN);
            } else if(searchIMEI) {
                device_query.contains('deviceIMEI', searchIMEI);
                device_total_query.contains('deviceIMEI', searchIMEI);
            } else if(searchMAC) {
                device_query.contains('deviceMAC', searchMAC);
                device_total_query.contains('deviceMAC', searchMAC);
            } else if(searchStatus) {
                device_query.equalTo('deviceStatus', searchStatus);
                device_total_query.equalTo('deviceStatus', searchStatus);
            } else if(searchIsActive) {
                device_query.equalTo('isActive', searchIsActive);
                device_total_query.equalTo('isActive', searchIsActive);
            }
            device_query.limit(pageSize);
            device_query.skip((pageNumber - 1) * pageSize);

            device_query = device_query.find({user: user});
            device_total_query = device_total_query.count({user: user});
            Promise.all([device_query, device_total_query]).then(([p1, p2]) => {
                res.json({
                    total: p2,
                    rows: p1
                });
            }).catch(error => {
                throw error;
            });
        } catch (error) {
            next(error);
        }
    }

    //获取已经激活的太合设备
    async getTaiheActievd(req, res, next) {
        const {
            searchDeviceSN,
            searchInstallationID,
            searchEndTime,
            pageSize = 15,
            pageNumber = 1,
        } = req.query;
        const activedquery = new AV.Query('TaiHeActive');
        if (searchDeviceSN) {
            activedquery.equalTo('deviceSN', searchDeviceSN);
        } else if (searchInstallationID) {
            activedquery.equalTo('installation', searchInstallationID);
        } else if (searchEndTime) {
            activedquery.equalTo('endTime', searchEndTime);
        }

        activedquery.select(['deviceSN', 'userId', 'installation', 'endTime']);
        activedquery.limit(pageSize);
        activedquery.skip((pageNumber - 1) * pageSize);
        activedquery.include('userId');
        let actived = await activedquery.find({useMasterKey: true});

        // console.log('---actived--'+JSON.stringify(actived));
        res.json({
            total: actived.length,
            rows: actived
        });
    }

}

module.exports = new AdminHandle();
