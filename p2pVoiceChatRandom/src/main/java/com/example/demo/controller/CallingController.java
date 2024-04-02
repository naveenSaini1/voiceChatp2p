package com.example.demo.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.demo.model.Response;


@RestController
public class CallingController {
	
	private final SimpMessagingTemplate messagingTemplate;
	private static List<String>  connectedUser=new ArrayList<>();
	private static Map<String, ByteArrayOutputStream> voice_data=new HashMap<>();

	 public CallingController(SimpMessagingTemplate messagingTemplate) {
		 this.messagingTemplate=messagingTemplate;
	 }
	 
	
	 
	
	
	@GetMapping("/")
	public String getFirstData() {
		return "hello";
	}
	
	@PostMapping("/stopRecoding")
	public void stopRecoding(@RequestParam("name") String name) throws IOException, InterruptedException {
		System.out.println("stoprecoding "+name);
		if(voice_data.containsKey(name)) {
			ByteArrayOutputStream stream=voice_data.remove(name);
			System.out.println("size of file list  "+stream.toByteArray().length);
			saveFile(stream.toByteArray(), name);
		}	
		
	}
	 
	@PostMapping("/upload")
	public void getTheBlob(@RequestParam("file") MultipartFile file,@RequestParam("name") String name) throws IOException {
		System.out.println("running "+file.getContentType());
		System.out.println("running "+file.getBytes().length+"file name "+name);
		ByteArrayOutputStream bytes	=null;
		if(!voice_data.containsKey(name)) {
			bytes=new ByteArrayOutputStream();
			bytes.write(file.getBytes());
			voice_data.put(name, bytes);
		}
		else {
			
			bytes=voice_data.get(name);
			bytes.write(file.getBytes());
			voice_data.put(name, bytes);
			
		}	
	}
	
	public void saveFile(byte[] bytes,String name) throws IOException {
		 String uploadDir = "/home/naveen/Documents/";

         // Create the directory if it doesn't exist
         File directory = new File(uploadDir);
         if (!directory.exists()) {
             directory.mkdirs();
         }

         // Get the file bytes and save it to disk
         String filePath = uploadDir + name+".mp4";
         Path path = Paths.get(filePath);
         Files.write(path, bytes);
		
	}
	@MessageMapping("/makeCall")
	public void firstMakeCall(@Payload Map<String,String> object,SimpMessageHeaderAccessor headerAccessor){
		System.out.println(object.get("email"));
		connectedUser.add(object.get("email"));
		System.out.println(connectedUser+" conseed user list makecall method ================== ");

		String sessionId=headerAccessor.getSessionId();
		headerAccessor.getSessionAttributes().put(sessionId+"email", object.get("email"));
		List<Response> result=makeRandomUserList(connectedUser);
		for(Response res:result) {
			System.out.println(res.getCallerId()+" caller ===");
			messagingTemplate.convertAndSend("/topic/call/"+res.getCallerId(),res);
		}
		
	}
	@MessageMapping("/call")
	public void calling(@Payload Map<Object,Object> response){
		System.out.println(response.get("callerId")+" calling method ================== ");
		
		messagingTemplate.convertAndSend("/topic/call/"+response.get("activeUser"),response);
		
	}
	
	public List<Response> makeRandomUserList(List<String> list){
		List<Response> response_List=new ArrayList<>();
		String oddUser=null;

		if(list.size()==1) {
			System.out.println("if=== ");
			return response_List;
		}
		if(list.size()%2!=0) {
			oddUser =	list.get(list.size()-1);
		 list.remove(list.size()-1);
		 
		 
	 
		}
		for(int i=0;i<list.size();i+=2) {
			System.out.println("loop "+list.get(i)+" == "+list.get(i+1));
			Response response=new Response();
			response.setCallerId(list.get(i));
			response.setReceiverId(list.get(i+1));
			response.setType("call");
			response_List.add(response);
		}
		connectedUser=new ArrayList<>();
		if(oddUser!=null) {
			connectedUser.add(oddUser);
		}
		
		
		return response_List;
	}
	
	 @EventListener
	    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) throws Exception {
		  System.out.println("someone is disconnected");
	        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
	        String sessionId=headerAccessor.getSessionId();
	        String emailId = (String) headerAccessor.getSessionAttributes().get(sessionId+"email");
	        if (emailId != null) {
	            connectedUser.remove(emailId);
	            System.out.println("========= "+ headerAccessor.getSessionAttributes());
	            System.out.println(connectedUser);
	            
	        }
	    }

}
