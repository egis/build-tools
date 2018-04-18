#!/bin/bash

if [ ! -e "/home/ubuntu/gradle.zip" ]; then  wget -O /home/ubuntu/gradle.zip https://services.gradle.org/distributions/gradle-2.7-all.zip; fi
if [ ! -e "gradle-2.7" ] ; then unzip /home/ubuntu/gradle.zip; fi
