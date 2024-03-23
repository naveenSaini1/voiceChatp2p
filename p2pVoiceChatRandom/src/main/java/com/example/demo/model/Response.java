package com.example.demo.model;

public class Response {
	private String callerId;
	private String receiverId;
	private String activeUser;
	private String type;
	private String data;
	
	
	
	
	
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getActiveUser() {
		return activeUser;
	}
	public void setActiveUser(String activeUser) {
		this.activeUser = activeUser;
	}
	public String getCallerId() {
		return callerId;
	}
	public void setCallerId(String callerId) {
		this.callerId = callerId;
	}
	public String getReceiverId() {
		return receiverId;
	}
	public void setReceiverId(String receiverId) {
		this.receiverId = receiverId;
	}
	

}
