#!/bin/bash

java21Location=$("ls -d /usr/lib/jvm/*21*")
echo "$java21Location"
export JAVA_HOME=$java21Location
export PATH=$JAVA_HOME/bin:$PATH

gradle highLevelDataSetup --args=$1
