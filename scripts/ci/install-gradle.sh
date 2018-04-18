#!/bin/bash

if [ ! -e "~/gradle.zip" ]; then wget -O ~/gradle.zip https://services.gradle.org/distributions/gradle-2.7-all.zip; fi
if [ ! -e "gradle-2.7" ] ; then unzip ~/gradle.zip; fi
