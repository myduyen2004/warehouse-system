package com.warehousebackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Lưu ảnh từ base64 string
     */
    public String saveBase64Image(String base64Image, String subPath) {
        try {
            // Remove data:image/jpeg;base64, prefix if exists
            String base64Data = base64Image;
            if (base64Image.contains(",")) {
                base64Data = base64Image.split(",")[1];
            }

            // Decode base64
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            // Parse subPath to get directory and filename
            // subPath format: "attendance/checkin/2_1234567890"
            String[] parts = subPath.split("/");
            String fileName = parts[parts.length - 1];

            // Build directory path (everything except filename)
            StringBuilder dirPathBuilder = new StringBuilder(uploadDir);
            for (int i = 0; i < parts.length - 1; i++) {
                dirPathBuilder.append(File.separator).append(parts[i]);
            }

            // Create directory if not exists
            Path uploadPath = Paths.get(dirPathBuilder.toString());
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("📁 Created directory: " + uploadPath);
            }

            // Generate full file path
            String extension = ".jpg";
            String fullFileName = fileName + extension;
            Path filePath = uploadPath.resolve(fullFileName);

            System.out.println("💾 Saving image to: " + filePath);

            // Write file
            Files.write(filePath, imageBytes);

            System.out.println("✅ Image saved successfully");

            // Return relative path with forward slashes
            String relativePath = subPath + extension;
            return "/uploads/" + relativePath.replace("\\", "/");

        } catch (IOException e) {
            System.err.println("❌ Error saving image: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }

    /**
     * Lưu MultipartFile
     */
    public String saveFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            // Create directory
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String fileName = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(fileName);

            // Save file
            Files.copy(file.getInputStream(), filePath);

            return "/uploads/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
    }

    /**
     * Xóa file
     */
    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isEmpty()) {
                return;
            }

            // Remove /uploads/ prefix
            String relativePath = fileUrl.replace("/uploads/", "");
            Path filePath = Paths.get(uploadDir, relativePath);

            // Delete file
            Files.deleteIfExists(filePath);

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }

    /**
     * Đọc file thành byte array
     */
    public byte[] readFile(String fileUrl) {
        try {
            String relativePath = fileUrl.replace("/uploads/", "");
            Path filePath = Paths.get(uploadDir, relativePath);
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file: " + e.getMessage());
        }
    }
}