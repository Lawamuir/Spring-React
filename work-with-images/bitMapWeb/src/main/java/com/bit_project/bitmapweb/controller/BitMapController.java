package com.bit_project.bitmapweb.controller;

import com.bit_project.bitmapweb.entity.*;
import com.bit_project.bitmapweb.service.UserServiceImplementation;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.FilenameUtils;
import javax.imageio.ImageIO;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;


//@AllArgsConstructor
@CrossOrigin("*")
@RestController
public class BitMapController {
    private final UserServiceImplementation userService;
    public BitMapController(UserServiceImplementation userServiceImplementation){
        userService = userServiceImplementation;
    }
    private String path;
    private String updatedImagePath;
    private String fileName;
    private final Queue<String> results = new ArrayDeque<>(3);
    private final Queue<InsertedMessages> insertedTexts = new ArrayDeque<>(3);
    private final Queue<ExportedMessages> exportedTexts = new ArrayDeque<>(3);

    private Long id = -1L;
    private String[] imagePath;
    private int[] mode;
    private History userHistory;
    private final String[] bitBuildingWays = {"Цифрова мапа", "QR-подібна структура з модифікованим шумом", " Фрактальний/шумовий візерунок"};
    @GetMapping("/log/{login}/{pass}")
    public ResponseEntity<Boolean> infoOfUser(@PathVariable("login") String login,
                                              @PathVariable("pass") String password){
        User user = userService.findUser(login, password);
        if(user == null){
            return ResponseEntity.ok(false);
        }
        id = user.getId();
        path = user.getPath();
        java.util.List<UserData> userData = userService.getAllDataByUserId(id);
        java.util.List<InsertedMessages> insertedMessages = userService.getInsertedMessagesByUserId(id);
        java.util.List<ExportedMessages> exportedMessages = userService.getExportedMessagesByUserId(id);
        results.clear();
        for (UserData userDatum : userData) {
            results.add(userDatum.getImagePath());
        }
        insertedTexts.clear();
        exportedTexts.clear();
        insertedTexts.addAll(insertedMessages);
        exportedTexts.addAll(exportedMessages);
        return ResponseEntity.ok(true);
    }

    @GetMapping("/sign-in/{login}/{pass}")
    public ResponseEntity<String> newUserInfo(@PathVariable("login") String login,
                                              @PathVariable("pass") String password){
        User user = new User();
        user.setLogin(login);
        user.setPass(password);
        userService.CreteNewUser(user);
        return ResponseEntity.ok("");
    }

    @GetMapping("/get-latest-workspace")
    public ResponseEntity<Optional<User>> getLatestWorkspace(){
        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping("/bit-map-ways")
    public ResponseEntity<String[]> bitMapWays(){
        return ResponseEntity.ok(bitBuildingWays);
    }

    @PutMapping("/update-mode/{mode}")
    public void saveMode(@PathVariable("mode")Integer mode){
        userService.updateMode(mode, id);
    }

    @GetMapping("/choosen-way/{index}")
    public ResponseEntity<String> chooseWay(@PathVariable("index")Integer index){
        try{
            File file = new File(path);
            BufferedImage image = ImageIO.read(file);

            int width = image.getWidth();
            int height = image.getHeight();
            BufferedImage imageToChange = new BufferedImage(
                    image.getWidth(),
                    image.getHeight(),
                    image.getType()
            );
            Graphics2D g2d = imageToChange.createGraphics();
            g2d.drawImage(image, 0, 0, null);
            g2d.dispose();

            int pixel, red, green, blue;
            if(index == 0){
                for(int i = 0;i < height;i++){
                    for(int j = 0;j < width;j++){
                        pixel = imageToChange.getRGB(j,i);
                        red = (pixel >> 16)&0xff;
                        green = (pixel >> 8)&0xff;
                        blue = (pixel)&0xff;
                        if(red != 0)
                            red = (j^i)%red;
                        if(green != 0){
                            green = (j&i)%green;
                        }
                        if(blue != 0)
                            blue = (j|i)%blue;
                        pixel = (red << 16)|(green << 8)|(blue);
                        imageToChange.setRGB(j,i, pixel);
                    }
                }
            }
            else if(index == 1){
                int block = 10, checker, offset, r, g, b;
                for(int i = 0;i < height;i++){
                    for(int j = 0;j < width;j++){
                        pixel = imageToChange.getRGB(j,i);
                        checker = ((j / block) + (i / block)) % 2;
                        offset = (j * i) % 256;
                        r = (pixel>>16)&0xff;
                        g = (pixel>>8)&0xff;
                        b = pixel & 0xff;
                        red = checker == 0 ? (r + offset) % 256 : Math.abs(r - offset)%256;
                        green = (g + i + j + offset) % 256;
                        blue = Math.abs (b+j*2 -i) % 256;
                        pixel = (red << 16)|(green << 8)|(blue);
                        imageToChange.setRGB(j,i, pixel);
                    }
                }
            }
            else if(index == 2){
                for(int i = 0;i < height;i++){
                    for(int j = 0;j < width;j++){
                        pixel = imageToChange.getRGB(j,i);
                        red = (pixel >> 16)&0xff;
                        green = (pixel >> 8)&0xff;
                        blue = (pixel)&0xff;
                        int noise = (j * 31 + i * 17) % 256;

                        red ^= noise;
                        green ^= (noise * 2) % 256;
                        blue ^= (noise * 3) % 256;
                        pixel = (red << 16)|(green << 8)|(blue);
                        imageToChange.setRGB(j,i, pixel);
                    }
                }
            }
            updatedImagePath = path;
            Path staticPath = Paths.get(updatedImagePath);
            while (Files.exists(staticPath)){
                fileName = UUID.randomUUID() + ".bmp";
                updatedImagePath = "images/" + fileName;
                staticPath = Paths.get(updatedImagePath);
            }
            FileOutputStream output = new FileOutputStream(staticPath.toFile());
            ImageIO.write(imageToChange, "bmp",output);
        }
        catch (Exception exception){
            System.out.println(exception.getMessage());
        }
        if (results.size() == 3){
            File file = new File(results.poll());
            userService.deleteFirstItem(id);
            if(file.exists()){
                file.delete();
            }
        }
        results.add(updatedImagePath);
        UserData userData = new UserData();
        userData.setUserId(id);
        userData.setImagePath(updatedImagePath);
        userData.setMode(index);
        userService.addNewImageInfo(userData);
        userService.updateUserWorkPath(index, updatedImagePath, id);
        return ResponseEntity.ok(updatedImagePath);
    }

    @ResponseBody
    @GetMapping("/history")
    public History getHistory(){
        java.util.List<UserData> userData = userService.getAllDataByUserId(id);
        String[] imagePaths = new String[userData.size()];
        int[] mode = new int[userData.size()];
        String[] insertedMessageArray = new String[insertedTexts.size()];
        String[] exportedMessageArray = new String[exportedTexts.size()];

        for(int i = 0;i < userData.size();i++){
            imagePaths[i] = userData.get(i).getImagePath();
            mode[i] = userData.get(i).getMode();
        }
        int i = 0;
        for(InsertedMessages mes: insertedTexts){
            insertedMessageArray[i++] = mes.getMessage();
        }
        i = 0;
        for(ExportedMessages mes:exportedTexts){
            exportedMessageArray[i++] = mes.getMessage();
        }
        History history = new History();
        history.setImagePaths(imagePaths);
        history.setMode(mode);
        history.setInsertedMessage(insertedMessageArray);
        history.setExportedMessages(exportedMessageArray);
        return history;
    }



    @GetMapping("/is-authorised")
    public ResponseEntity<Boolean> isAuthorised(){
        if(id == -1)
            return ResponseEntity.ok(false);
        return ResponseEntity.ok(true);
    }

    @PostMapping("/download-image")
    public ResponseEntity<String> downloadImage(@RequestParam("image") MultipartFile image){
        if(image.isEmpty()){
            return ResponseEntity.badRequest().body("File is empty");
        }
        try{
            fileName = image.getOriginalFilename();
            String extension = FilenameUtils.getExtension(fileName);
            if(extension.equals("bmp")){
                byte[] fileContent = image.getBytes();
                path = "images/" + fileName;
                Path staticPath = Paths.get(path);
                while (Files.exists(staticPath)){
                    fileName = UUID.randomUUID() + ".bmp";
                    path = "images/" + fileName;
                    staticPath = Paths.get(path);
                }
                userService.updateUserPath(path, id);
                FileOutputStream output = new FileOutputStream(staticPath.toFile());
                output.write(fileContent);
                output.close();
            }
            else {
                return ResponseEntity.badRequest().body("You try to send a file with a wrong extension");
            }
        }
        catch (IOException exception){
            return ResponseEntity.badRequest().body(
                    "Something went wrong in /download-image request");
        }
        return ResponseEntity.ok(path);
    }

    @PutMapping("/set-latest-workspace")
    public void setLatestWorkspace(@RequestBody User user){
//        user.setId(id);
//        userServece.updateUserData(user);
    }

    @DeleteMapping("/delete-latest-original")
    public void deleteLatestOriginal(){
            File file = new File(path);
            if(file.exists()){
                file.delete();
            }
    }

    @GetMapping(value = "/images/{fileName}", produces = "image/bmp")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) throws IOException {
        Path imagePath = Paths.get("images/" + fileName);
        Resource resource = new UrlResource(imagePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/hide-message")
    public ResponseEntity<String> hideMessage(@RequestParam("message") String message, @RequestParam("path")String path) {
        if (message.isEmpty()) {
            return ResponseEntity.badRequest().body("Message is empty");
        }
        try {
            File imageFile = new File(path);
            BufferedImage bmp = ImageIO.read(imageFile);
            int width = bmp.getWidth();
            int height = bmp.getHeight();

            int pixel, currentBit = 0, byteIndex = 0;
            int[] rgb;
            byte[] encryptedMessage=message.getBytes(StandardCharsets.UTF_8);
            byte length = (byte)encryptedMessage.length;
            if ((length + 1) * 8 > width * height * 3) {
                return ResponseEntity.badRequest().body("Image is too small for the message");
            }
            System.out.println(length);
            System.out.println(Integer.toBinaryString(length));

            for(int i = 0, counter = 0;i < height;i++){
                for(int j = 0;j < width;j++){
                    pixel = bmp.getRGB(j, i);
                    rgb = new int[]{(pixel >> 16) & 0xff, (pixel >> 8) & 0xff, pixel & 0xff};
                    for(int color = 0;color < 3 && counter < 8;color++, counter++){
                        rgb[color] = (rgb[color] & 0xFE) | (((1 << counter) & length)>>counter);
                        System.out.println(Integer.toBinaryString(rgb[i]));
                    }

                    int newPixel = (rgb[0] << 16) | (rgb[1] << 8)|rgb[2];
                    System.out.println(Integer.toBinaryString(newPixel));
                    bmp.setRGB(j, i, newPixel);
                    if(counter == 8){
                        i = height;
                        break;
                    }

                }
            }
            out:
            for(int i = 0;i < height;i++){
                for(int j = 3;j < width;j++){
                    pixel = bmp.getRGB(j, i);
                    rgb = new int[]{(pixel >> 16) & 0xff, (pixel >> 8) & 0xff, pixel & 0xff};
                    for(int color = 0;color < 3;color++){
                        rgb[color] = (rgb[color] & 0xFE) | (((1 << currentBit) & encryptedMessage[byteIndex])>>currentBit);
                        currentBit++;
                        if(currentBit >  7){
                            currentBit = 0;
                            byteIndex++;
                            if(byteIndex == encryptedMessage.length){
                                int newPixel = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
                                bmp.setRGB(j, i, newPixel);
                                break out;
                            }
                        }
                    }
                    int newPixel = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
                    bmp.setRGB(j, i, newPixel);
                }
            }
            Path staticPath = Paths.get(path);
            FileOutputStream output = new FileOutputStream(staticPath.toFile());
            ImageIO.write(bmp, "bmp",output);
            output.close();
            userService.insertMessage(message, path, id);
            if (insertedTexts.size() == 3) {
                userService.deleteInsertedMessageById(insertedTexts.poll().getId());
            }
            insertedTexts.add(userService.insertMessage(message, path, id));
            return ResponseEntity.ok(path);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error processing image: " + e.getMessage());
        }
    }




    @GetMapping("/extract-message")
    public ResponseEntity<String> extractMessage(@RequestParam String imagePath) {
        try {
            File imageFile = new File(imagePath);
            BufferedImage bmp = ImageIO.read(imageFile);
            int width = bmp.getWidth(), height = bmp.getHeight();

            int pixel, currentBit = 0, byteIndex = 0;
            int[] rgb;
            int length = 0;
            for(int i = 0, counter = 0;i < height;i++){
                for(int j = 0;j < width;j++){
                    pixel = bmp.getRGB(j, i);
                    rgb = new int[]{(pixel >> 16) & 0xff, (pixel >> 8) & 0xff, pixel & 0xff};
                    for(int color = 0;color < 3 && counter < 8;color++, counter++){
                        length |= (rgb[color] & 0x1) << counter;
                    }
                    if(counter == 8){
                        i = height;
                        break;
                    }
                }
            }

            byte[] message = new byte[length];

            for(int i = 0;i < height;i ++){
                for(int j = 3; j < width;j++){
                    pixel = bmp.getRGB(j, i);
                    rgb = new int[]{(pixel >> 16) & 0xff, (pixel >> 8) & 0xff, pixel & 0xff};
                    for(int color = 0;color < 3;color++){
                        message[byteIndex] |= (byte) ((rgb[color] & 0x1) <<currentBit);
                        currentBit++;
                        if(currentBit >  7){
                            currentBit = 0;
                            byteIndex++;
                            if(byteIndex == length){
                                j = width;
                                i = height;
                                break;                        }
                        }
                    }
                }
            }
            String extractedMessage = new String(message, StandardCharsets.UTF_8);
            if (exportedTexts.size() == 3) {
                userService.deleteExportedMessageById(exportedTexts.poll().getId());
            }
            exportedTexts.add(userService.addExportedMessage(extractedMessage, imagePath, id));
            return ResponseEntity.ok(extractedMessage);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error processing image: " + e.getMessage());
        }
    }
}
