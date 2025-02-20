package com.backend.service;

import com.backend.mapper.FlowerMapper;
import com.backend.pojo.Flower;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlowerService {
    @Autowired
    private FlowerMapper flowerMapper;

    public void addFlower(Flower flower) {
        flowerMapper.insertFlower(flower);
    }

    public void deleteFlower(Integer id) {
        flowerMapper.deleteFlowerById(id);
    }

    public void updateFlower(Flower flower) {
        flowerMapper.updateFlower(flower);
    }

    public Flower getFlowerById(Integer id) {
        return flowerMapper.getFlowerById(id);
    }

    public List<Flower> getAllFlowers() {
        return flowerMapper.getAllFlowers();
    }
}