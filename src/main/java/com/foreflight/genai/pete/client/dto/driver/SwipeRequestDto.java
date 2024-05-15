package com.foreflight.genai.pete.client.dto.driver;

import lombok.Data;

import java.util.List;

@Data
public class SwipeRequestDto {
    private List<Point> points;
    private int duration = 3;

    @Data
    public static class Point {
        private int x;
        private int y;
    }
}