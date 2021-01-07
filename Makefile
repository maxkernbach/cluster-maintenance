.PHONY: help readme version dist targz

help:
	@echo "ArangoDB Maintenance Tools"
	@echo
	@echo "make help"
	@echo "  show this help"
	@echo
	@echo "make readme"
	@echo "  show the readme"
	@echo
	@echo "make version"
	@echo "  show the version"
	@echo
	@echo "make dist"
	@echo "  create a distribution tar"

readme:
	@less README.md

version:
	@cat VERSION

dist:
	@mkdir -p work
	$(MAKE) targz V=`git describe --all --tags --long --dirty=-dirty | sed -e 's:tags/::' | sed -e 's:/:_:g'`

targz:
	@echo "generating archive for $V"
	@rm -rf work/maintenance-$V
	@mkdir -p work/maintenance-$V
	@tar -c -f - \
		CHANGELOG LICENSE Makefile README.md VERSION maintenance.sh maintenance.ps1 \
		`find lib -name "*.js"` \
		 | tar -C work/maintenance-$V -x -f -
	@tar -c -z -f work/maintenance-$V.tar.gz -C work maintenance-$V
	@mv work/maintenance-$V work/maintenance
	@tar -c -z -f work/maintenance.tar.gz -C work maintenance
	@rm -rf work/maintenance
