package com.bit_project.bitmapweb.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class History {
    String[] imagePaths;
    int[] mode;
    String[] insertedMessage;
    String[] exportedMessages;
}
