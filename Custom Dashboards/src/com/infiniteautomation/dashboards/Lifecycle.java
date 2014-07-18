/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */
package com.infiniteautomation.dashboards;

import java.util.LinkedList;

import org.apache.commons.lang3.StringUtils;

import com.serotonin.m2m2.Common;
import com.serotonin.m2m2.db.dao.UserDao;
import com.serotonin.m2m2.module.LifecycleDefinition;
import com.serotonin.m2m2.vo.User;
import com.serotonin.m2m2.vo.permission.DataPointAccess;
import com.serotonin.util.properties.ReloadingProperties;

/**
 * @author Terry Packer
 * 
 */

public class Lifecycle extends LifecycleDefinition {
	public static ReloadingProperties props;
	public static String webPath;
	public static String userDBPath;
	public static String moduleName;

	@Override
	public void preInitialize() {
		props = new ReloadingProperties("dglux",
				Lifecycle.class.getClassLoader());
	}

	@Override
	public void postDatabase() {

		// Check if there is a public username.
		String publicUsername = props.getString("publicUser.username");
		if (!StringUtils.isBlank(publicUsername)) {
			// Check if the user already exists.
			UserDao userDao = new UserDao();
			User user = userDao.getUser(publicUsername);
			if (user == null) {
				// Not found. Create.
				user = new User();
				user.setId(Common.NEW_ID);
				user.setUsername(publicUsername);
				user.setPassword(Common.encrypt(props.getString(
						"publicUser.password", "")));
				user.setEmail(Common.encrypt(props.getString(
						"publicUser.email", "")));
				user.setAdmin(false);
				user.setDisabled(false);
				user.setDataSourcePermissions(new LinkedList<Integer>());
				user.setDataPointPermissions(new LinkedList<DataPointAccess>());
				new UserDao().saveUser(user);
			}
		}

		webPath = Common.MA_HOME + getModule().getDirectoryPath() + "/web/";
		userDBPath = webPath + "userdb/";
	}
	
}
