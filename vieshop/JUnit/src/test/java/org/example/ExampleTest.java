package org.example;

import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;

import static org.junit.jupiter.api.Assertions.*;

public class ExampleTest {

    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    public void test() {
        Main main = new Main();
        int ketQua = main.tinhTong(10,20);
        Assertions.assertEquals(40, ketQua);
    }

    @Test
    public void test2() {
        Main main = new Main();
        int ketQua = main.tinhTong(20,20);
        Assertions.assertEquals(40, ketQua);
    }
}