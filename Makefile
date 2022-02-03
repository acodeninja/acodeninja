.PHONY: build clean dev dev-frontend dev-hugo install

HUGO_VERSION := "0.92.1"
CPU_ARCHITECTURE := UNKNOWN

ifeq ($(OS),Windows_NT)
    OPERATING_SYSTEM := Windows
else
	ifeq ($(shell uname -s),Darwin)
		OPERATING_SYSTEM := "macOS"
	else
		OPERATING_SYSTEM := $(shell uname -s)
	endif
endif

ifeq ($(shell uname -m),x86_64)
    CPU_ARCHITECTURE := 64bit
endif

ifeq ($(CPU_ARCHITECTURE),UNKNOWN)
	shell echo "Cannot detect CPU Architecture"
	exit
endif

build: install
	@cd themes/acodeninja && yarn build
	@.bin/hugo

clean:
	@rm -rf .bin
	@rm -rf themes/acodeninja/node_modules

dev: install
	@$(MAKE) -j dev-frontend dev-hugo

dev-frontend:
	@cd themes/acodeninja && yarn dev

dev-hugo:
	@.bin/hugo serve

install: .bin/hugo themes/acodeninja/node_modules

.bin/hugo:
	@echo "📥 Downloading .bin/hugo"
	@mkdir -p .bin
	@curl -s -L "https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_$(HUGO_VERSION)_$(OPERATING_SYSTEM)-$(CPU_ARCHITECTURE).tar.gz" -o .bin/hugo.tar.gz
	@cd .bin && tar -zxf hugo.tar.gz
	@chmod +x .bin/hugo

themes/acodeninja/node_modules:
	@echo "📥 Downloading node_modules"
	@cd themes/acodeninja && yarn install
