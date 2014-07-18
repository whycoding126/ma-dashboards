/**
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */
package com.infiniteautomation.dashboards;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.serotonin.m2m2.module.DefaultPagesDefinition;
import com.serotonin.m2m2.vo.User;

/**
 * @author Terry Packer
 *
 */
public class DefaultPagesDef extends DefaultPagesDefinition {
	
	
	@Override
    public String getLoginPageUri(HttpServletRequest request, HttpServletResponse response) {
    	
    	if(Lifecycle.props != null){
	    	return Lifecycle.props.getString("loginPage", "/login.htm");
    	}else{
    		return "/login.htm";
    	}
    }
    @Override
    public String getLoggedInPageUri(HttpServletRequest request, HttpServletResponse response, User user) {
	     
    	return Lifecycle.props.getString("loggedInPage", "/data_point_details.shtm");

    }
}
