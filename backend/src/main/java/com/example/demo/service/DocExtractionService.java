package com.example.demo.service;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class DocExtractionService {
    public String extractText(byte[] docxBytes) throws IOException {
        try (InputStream inputStream = new ByteArrayInputStream(docxBytes);
             XWPFDocument document = new XWPFDocument(inputStream)) {

            try (XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
                return extractor.getText();
            }
        }
    }
}
