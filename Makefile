.PHONY: dev dev-frontend dev-hugo install

build: install
	@cd themes/acodeninja && yarn build
	@.bin/hugo

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
	@cd .bin && curl -L "https://github.com/gohugoio/hugo/releases/download/v0.76.5/hugo_0.76.5_Linux-64bit.tar.gz" -o hugo.tar.gz
	@cd .bin && tar -zxf hugo.tar.gz
	@chmod +x .bin/hugo

themes/acodeninja/node_modules:
	@echo "📥 Downloading node_modules"
	@cd themes/acodeninja && yarn install
