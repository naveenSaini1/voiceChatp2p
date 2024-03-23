package com.example.demo.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

import com.example.demo.model.Room;


@RestController
public class RooCallingController {
	public static List<Room> activeRooms=new ArrayList<>();
	
	public final SimpMessagingTemplate messagingTemplate;
	
	public RooCallingController(SimpMessagingTemplate simpMessagingTemplate) {
		this.messagingTemplate=simpMessagingTemplate;
		
	}

	
	@MessageMapping("/createRoom")
	public void createRoom(@Payload Room room) {
		activeRooms.add(room);
		System.out.println(room.getRoomName()+" ===== ");
		messagingTemplate.convertAndSend("/topic/createdRooms",room);
	}
	
	@MessageMapping("/room/join")
	public void sendTheSigling(@Payload Map<Object,Object> object){
		String roomName=(String) object.get("roomName");
		String userName=(String)object.get("callerId");
		System.out.println(roomName+"room joind===> "+userName);
		messagingTemplate.convertAndSend("/topic/room/"+roomName,object);
		
	}
	
	
	@MessageMapping("/room/user")
	public void sendTheSiglingToUser(@Payload Map<Object,Object> object){
		String userName=(String) object.get("activeUser");
		String callerId=(String)object.get("callerId");
		String reciveId=(String)object.get("receiverId");
		String type=(String)object.get("type");
		System.out.println("caller name==> "+callerId+" receiveId "+reciveId+" active user"+userName+" type "+type);
		messagingTemplate.convertAndSend("/topic/room/user/"+userName,object);
		
	}
	
	
	

}
