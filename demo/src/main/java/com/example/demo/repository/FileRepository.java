package com.example.demo.repository;

import com.example.demo.domain.dao.FileDAO;
import com.example.demo.domain.dto.board.FileListDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileRepository extends JpaRepository<FileDAO, Integer> {
    
    @Query("SELECT new com.example.demo.domain.dto.board.FileListDTO " +
            "(f.originalName, f.storedName, f.fileSize, f.fileExtension, f.fileStatus) " +
            "FROM FileDAO f " +
            "WHERE f.boardIdx = :boardIdx")
    List<FileListDTO> getFileListByBoardIdx(@Param("boardIdx") Integer boardIdx);

    @Query("SELECT new com.example.demo.domain.dto.board.FileListDTO (f.originalName, f.fileExtension) " +
            "FROM FileDAO f " +
            "WHERE f.storedName = :storedName")
    FileListDTO getOriginalNameWithExtensionByStoredName(@Param("storedName") String storedName);

    @Modifying
    @Query("UPDATE FileDAO f " +
            "SET f.boardIdx = :boardIdx " +
            "WHERE f.storedName = :storedName")
    int updateBoardIdxByStoredName(@Param("boardIdx") Integer boardIdx, @Param("storedName") String storedName);

    // 하드 딜리트를 위한 파일 리스트 가져오기
    @Query(value = "SELECT stored_name FROM file_db " +
            "WHERE board_idx IS NULL " +
            "AND upload_date < NOW() - INTERVAL 1 DAY;", nativeQuery = true)
    List<String> getTempFileStoredName();

    // DB에서 boardIdx가 null인 값들 삭제
    @Modifying
    @Query(value = "DELETE FROM file_db " +
            "WHERE board_idx IS NULL " +
            "AND upload_date < NOW() - INTERVAL 1 DAY;", nativeQuery = true)
    void removeTempFileList();



}
