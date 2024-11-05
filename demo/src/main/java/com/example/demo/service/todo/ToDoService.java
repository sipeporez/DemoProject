package com.example.demo.service.todo;


import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.domain.dao.todo.ToDoDAO;
import com.example.demo.domain.dto.todo.ToDoDTO;
import com.example.demo.exception.ToDoNotFoundException;
import com.example.demo.exception.WrongInputException;
import com.example.demo.repository.ToDoRepository;
import com.example.demo.service.validator.member.MemberValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ToDoService {
    private final ToDoRepository tr;
    private final MemberValidator memVal;

    // ToDoList 가져오는 메서드
    public List<ToDoDTO> getToDoList() {
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        return tr.findByUserid(mem.getUserid());
    }

    // 새항목 추가 버튼 누를 시 저장 -> enabled가 false
    public Integer saveToDoList(ToDoDTO dto) {
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 입력값 검증
        if (dto.getContent() != null && dto.getContent().length() <= 100) {
            ToDoDAO dao = tr.save(ToDoDAO.builder()
                    .member(mem)
                    .content(dto.getContent())
                    .completed(false)
                    .build());
            return dao.getIdx();
        } else throw new WrongInputException("Content");
    }

    // 체크 누를 시 Boolean만 변경
    @Transactional
    public void changeCompleteToDoList(Integer idx) {
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 프론트로부터 index값 받아서 해당 항목 찾기
        ToDoDAO dao = tr.findById(idx)
                .orElseThrow(() -> new ToDoNotFoundException("상태 오류 : ToDo List를 찾을 수 없습니다."));
        // 상태 변경 후 저장
        if (dao.getMember().equals(mem)) {
            dao.setCompleted(!dao.getCompleted());
            tr.save(dao);
        }
    }

    // ToDoList 내용 수정 메서드
    @Transactional
    public void updateToDoList(ToDoDTO dto) {
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 프론트로부터 index값 받아서 해당 항목 찾기
        ToDoDAO dao = tr.findById(dto.getIdx())
                .orElseThrow(() -> new ToDoNotFoundException("수정 오류 : ToDo List를 찾을 수 없습니다."));
        // 내용 변경 후 저장
        if (dao.getMember().equals(mem)) {
            dao.setContent(dto.getContent());
            tr.save(dao);
        }
    }

    // ToDoList 삭제 메서드
    @Transactional
    public void deleteToDoLis(Integer idx) {
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 프론트로부터 index값 받아서 해당 항목 찾기
        ToDoDAO dao = tr.findById(idx)
                .orElseThrow(() -> new ToDoNotFoundException("삭제 오류 : ToDo List를 찾을 수 없습니다."));
        // 사용자 검증 후 해당 항목 삭제
        if (dao.getMember().equals(mem)) {
            tr.delete(dao);
        }
    }
}
