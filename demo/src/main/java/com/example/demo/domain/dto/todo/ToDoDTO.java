package com.example.demo.domain.dto.todo;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ToDoDTO {

    public Integer idx;
    public String userid;
    public String content;
    public LocalDateTime createdDate;
    public Boolean completed;

}
