#!/bin/bash

java21Location=$("ls -d /usr/lib/jvm/temurin-21-jdk-*")
export JAVA_HOME=$java21Location
export PATH=$JAVA_HOME/bin:$PATH

./gradlew highLevelDataSetup --args=$1
./after-data-setup-step.sh
