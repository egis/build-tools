#!/usr/bin/env python2

import os, sys
import glob
import xml.etree.ElementTree

DIR = os.getenv('DIR', 'test-output')
REPORTS='./' + DIR + '/junit'
MIN_TESTS=int(sys.argv[1])
MAX_FAIL=int(sys.argv[2])
MAX_ERRORS=int(sys.argv[3])
failures = 0
errors = 0
tests = 0
print "MIN_TESTS=%s MAX_FAIL=%s MAX_ERRORS=%s" % (MIN_TESTS, MAX_FAIL, MAX_ERRORS)
for file in glob.glob('%s/*.xml' % REPORTS):
	try:
		e = xml.etree.ElementTree.parse(file).getroot()
		error= int(e.get('errors'))
		if error > 0:
			print file + " errors "
		failures += int(e.get('failures'))
		errors += int(e.get('errors'))
		tests += int(e.get('tests'))
		for tc in e.iter('testcase'):
			tests -= len(tc.findall('skipped'))
	except Exception,e:
		errors += 1
		print "Failed to parse " + file

print "tests=%s failures=%s errors=%s" % (tests, failures, errors)


if (errors > MAX_ERRORS):
	print "too many errors"

if (tests < MIN_TESTS):
	print "too few tests run %s < %s " % (tests, MIN_TESTS)
	sys.exit(1)


if (failures > MAX_FAIL):
	print "too many failures"
	sys.exit(1)

sys.exit(0)
