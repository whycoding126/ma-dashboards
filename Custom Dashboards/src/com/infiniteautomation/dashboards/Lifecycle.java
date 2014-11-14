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
	
	public static String webPath; //Full path to module web dir
	
	public static String publicUrlPrefix; //URL Mapping prefix
	public static String publicFilesLocation; //Folder within web folder
	
	public static String privateUrlPrefix; //URL Mapping prefix
	public static String privateFilesLocation; //folder within web folder
	
	public static String iconLocation; //Location of Icon file for mango toolbar
	public static String iconDestination; //Location to link to on-click of icon
	
	
	public static String moduleName;

	@Override
	public void preInitialize() {
		props = new ReloadingProperties("customDashboards-config",
				Lifecycle.class.getClassLoader());
		
		publicUrlPrefix = props.getString("publicPrefix","/public-files");
		publicFilesLocation = props.getString("publicLocation", "/web/public/");
		privateUrlPrefix = props.getString("privatePrefix", "/private-files");
		privateFilesLocation = props.getString("privateLocation", "/web/private/");
		iconLocation = props.getString("iconLocation", "web/img/dashboards.png");
		iconDestination = props.getString("iconDestination");

	}

	@Override
	public void postDatabase() {
		webPath = Common.MA_HOME + getModule().getDirectoryPath() + "/web/";
	}
	
}
