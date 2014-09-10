/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */
package com.infiniteautomation.dashboards;

import com.serotonin.m2m2.Common;
import com.serotonin.m2m2.module.LifecycleDefinition;
import com.serotonin.util.properties.ReloadingProperties;

/**
 * @author Terry Packer
 * 
 */

public class Lifecycle extends LifecycleDefinition {
	public static ReloadingProperties props;
	public static String webPath;
	public static String moduleName;

	@Override
	public void preInitialize() {
//		props = new ReloadingProperties("dashboards",
//				Lifecycle.class.getClassLoader());
	}

	@Override
	public void postDatabase() {
		webPath = Common.MA_HOME + getModule().getDirectoryPath() + "/web/";
	}
	
}
