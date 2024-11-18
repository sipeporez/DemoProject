package com.example.demo.controller.todo;


import com.example.demo.domain.dto.todo.ToDoDTO;
import com.example.demo.service.todo.ToDoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ToDoController {
    private final ToDoService ts;

    // ToDo 리스트 호출 컨트롤러
    @GetMapping("/todo/get")
    public ResponseEntity<?> getToDoList() {
        return ResponseEntity.ok(ts.getToDoList());
    }

    // ToDo 저장 컨트롤러
    @PostMapping("/todo/post")
    public ResponseEntity<?> saveToDoList(@RequestBody ToDoDTO dto) {
        return ResponseEntity.ok(ts.saveToDoList(dto));
    }
    // ToDo 내용 수정 컨트롤러
    @PutMapping("/todo/edit")
    public ResponseEntity<?> updateToDoList(@RequestBody ToDoDTO dto) {
        ts.updateToDoList(dto);
        return ResponseEntity.ok("수정 완료");
    }

    // ToDo 체크 수정 컨트롤러
    @PutMapping("/todo/check")
    public ResponseEntity<?> changeCompleteToDoList(@RequestBody ToDoDTO dto) {
        ts.changeCompleteToDoList(dto.idx);
        return ResponseEntity.ok("체크 완료");
    }

    // ToDo 삭제 컨트롤러
    @DeleteMapping("/todo/delete/{idx}")
    public ResponseEntity<?> deleteToDoList(@PathVariable("idx") Long idx) {
        ts.deleteToDoLis(idx);
        return ResponseEntity.ok("삭제 완료");
    }
}
