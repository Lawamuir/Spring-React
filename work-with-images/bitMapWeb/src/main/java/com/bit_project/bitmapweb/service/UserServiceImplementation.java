package com.bit_project.bitmapweb.service;

import com.bit_project.bitmapweb.entity.ExportedMessages;
import com.bit_project.bitmapweb.entity.InsertedMessages;
import com.bit_project.bitmapweb.entity.User;
import com.bit_project.bitmapweb.entity.UserData;
import com.bit_project.bitmapweb.repository.ExportedMessagesRepository;
import com.bit_project.bitmapweb.repository.InsertedMessagesRepository;
import com.bit_project.bitmapweb.repository.UserDataRepository;
import com.bit_project.bitmapweb.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImplementation {
    UserRepository userRepository;
    UserDataRepository userDataRepository;
    ExportedMessagesRepository exportedMessagesRepository;
    InsertedMessagesRepository insertedMessagesRepository;

    public void CreteNewUser(User user){
        userRepository.save(user);
    }

    public User findUser(String login, String pass){
        return userRepository.findUserByLoginAndPass(login,pass);
    }

    public Optional<User> findById(Long id){
        return userRepository.findById(id);
    }

    public void updateUserData(User user){
        userRepository.save(user);
    }
    public User updateUserPath(String path, Long id){
        Optional<User> user = findById(id);
        if(user.isPresent()){
            user.get().setPath(path);
            return userRepository.save(user.get());
        }
        return null;
    }

    public User updateMode(Integer mode, Long id){
        Optional<User> user = findById(id);
        if(user.isPresent()){
            user.get().setMode(mode);
            return userRepository.save(user.get());
        }
        return null;
    }

    public User updateUserWorkPath(Integer mode, String path, Long id){
        Optional<User> user = findById(id);
        if(user.isPresent()){
            user.get().setMode(mode);
            user.get().setUpdatedPath(path);
            return userRepository.save(user.get());
        }
        return null;
    }


    public void addNewImageInfo(UserData data){
        userDataRepository.save(data);
    }

     public void deleteFirstItem(Long userId){
        userDataRepository.delete(userDataRepository.findFirstByUserId(userId));
    }

    public List<UserData> getAllDataByUserId(Long id){
        return userDataRepository.findAllByUserId(id);
    }

    public List<ExportedMessages> getExportedMessagesByUserId(Long id){
        return exportedMessagesRepository.findAllByUserId(id);
    }

    @Transactional
    public ExportedMessages addExportedMessage(String message, String imageName, Long id){
        ExportedMessages exportedMessage = new ExportedMessages();
        exportedMessage.setMessage(message);
        exportedMessage.setUserId(id);
        exportedMessage.setImageId(userDataRepository.findByImagePath(imageName).getId());
        return exportedMessagesRepository.save(exportedMessage);
    }

    public void deleteExportedMessageById(Long id){
        exportedMessagesRepository.deleteById(id);
    }
    public List<InsertedMessages> getInsertedMessagesByUserId(Long id){
        return insertedMessagesRepository.findAllByUserId(id);
    }

    public void deleteByImagePath(String path){
        userDataRepository.deleteByImagePath(path);
    }


    public InsertedMessages insertMessage(String message, String imageName, Long id){
        InsertedMessages insertedMessage = new InsertedMessages();
        insertedMessage.setMessage(message);
        insertedMessage.setUserId(id);
        insertedMessage.setImageId(userDataRepository.findByImagePath(imageName).getId());
        return insertedMessagesRepository.save(insertedMessage);
    }
    public void deleteInsertedMessageById(Long id){
        insertedMessagesRepository.deleteById(id);
    }

}
