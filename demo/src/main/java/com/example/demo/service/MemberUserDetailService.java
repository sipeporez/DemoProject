package com.example.demo.service;

import com.example.demo.domain.MemberDAO;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberUserDetailService implements UserDetailsService {
    private final MemberRepository mr;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MemberDAO member = mr.findById(username).orElseThrow(()->new UsernameNotFoundException("User Not Found"));

        return new User(member.getUserid(), member.getUserpw(), AuthorityUtils.createAuthorityList());
    }
}
