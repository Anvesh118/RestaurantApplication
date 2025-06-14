package com.ptt.mini_project.backend.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@Aspect
public class LoggingAspect {

    @AfterReturning(value = "execution (* com.ptt.mini_project.backend.controllers.*.*(..))", returning = "returnedObj")
    public void afterEachRequest(Object returnedObj) {
        log.info("Returned obj, {}", returnedObj);
        log.info("");
    }
}
