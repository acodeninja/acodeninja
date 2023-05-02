.PHONY: build clean dev dev-frontend dev-hugo install

SHELL := /usr/bin/env bash
HUGO_VERSION := "0.111.3"
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
	@cd themes/acodeninja && rm -rf static/* && yarn build
	@.bin/hugo

clean:
	@rm -rf .bin
	@rm -rf themes/acodeninja/node_modules

dev: install
	@$(MAKE) -j dev-frontend dev-hugo

dev-frontend:
	@cd themes/acodeninja && yarn dev

dev-hugo:
	@.bin/hugo serve --disableFastRender

install: .bin/hugo themes/acodeninja/node_modules

.bin/hugo:
	@echo "📥 Downloading .bin/hugo"
	@mkdir -p .bin
	@curl -s -L "https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_$(HUGO_VERSION)_checksums.txt" -o .bin/hugo_checksums.txt
	@curl -s -L "https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_$(HUGO_VERSION)_$(OPERATING_SYSTEM)-$(CPU_ARCHITECTURE).tar.gz" -o .bin/hugo.tar.gz
	@IFS=' ' read -ra CHECKSUM <<< `shasum -a 256 .bin/hugo.tar.gz`; \
		if grep "$$CHECKSUM" .bin/hugo_checksums.txt >> /dev/null; \
			then echo "✅  Verified download"; \
			else echo "❌  Could not verify download ($$CHECKSUM)"; exit 127; \
	    fi
	@cd .bin && tar -zxf hugo.tar.gz
	@chmod +x .bin/hugo

themes/acodeninja/node_modules:
	@npm i -g yarn
	@echo "📥 Downloading node_modules"
	@cd themes/acodeninja && yarn install
