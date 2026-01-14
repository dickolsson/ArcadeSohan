# Arduino CLI Makefile
# =============================================
# This Makefile provides simple phony targets for building and uploading
# Arduino sketches without depending on the Arduino IDE.

# Board configuration (default: Arduino Uno)
BOARD_FQBN ?= arduino:avr:uno

# Serial port for upload (auto-detect if not set)
PORT ?= $(shell arduino-cli board list | grep -E 'arduino:avr' | head -1 | awk '{print $$1}')

# Sketch directory
SKETCH_DIR := Game

# Build output directory
BUILD_DIR := build

# Libraries file (one library per line)
LIBRARIES_FILE := libraries.txt

# Arduino CLI command
ARDUINO_CLI := arduino-cli

# Targets
.PHONY: all build upload clean monitor install-libs install-core install list-boards list-ports serve-website help

# Default target
all: build

# -----------------------------------------------------------------------------
# Build Targets
# -----------------------------------------------------------------------------

## build: Compile the sketch
build:
	@echo "==> Building sketch..."
	$(ARDUINO_CLI) compile \
		--fqbn $(BOARD_FQBN) \
		--output-dir $(BUILD_DIR) \
		$(SKETCH_DIR)
	@echo "==> Build complete. Output in $(BUILD_DIR)/"

## upload: Upload the compiled sketch to the board
upload: build
	@if [ -z "$(PORT)" ]; then \
		echo "Error: No port detected. Connect your Arduino or set PORT manually."; \
		exit 1; \
	fi
	@echo "==> Uploading to $(PORT)..."
	$(ARDUINO_CLI) upload \
		--fqbn $(BOARD_FQBN) \
		--port $(PORT) \
		--input-dir $(BUILD_DIR)
	@echo "==> Upload complete!"

# -----------------------------------------------------------------------------
# Serial Monitor
# -----------------------------------------------------------------------------

## monitor: Open the serial monitor (default: 9600 baud)
monitor:
	@if [ -z "$(PORT)" ]; then \
		echo "Error: No port detected. Connect your Arduino or set PORT manually."; \
		exit 1; \
	fi
	@echo "==> Opening serial monitor on $(PORT)..."
	$(ARDUINO_CLI) monitor --port $(PORT) --config baudrate=9600

# -----------------------------------------------------------------------------
# Installation
# -----------------------------------------------------------------------------

## install-core: Install the Arduino AVR core (required for Uno, Nano, Mega)
install-core:
	@echo "==> Installing Arduino AVR core..."
	$(ARDUINO_CLI) core update-index
	$(ARDUINO_CLI) core install arduino:avr
	@echo "==> Core installation complete!"

## install-libs: Install required libraries from libraries.txt
install-libs:
	@echo "==> Installing required libraries from $(LIBRARIES_FILE)..."
	@while IFS= read -r lib || [ -n "$$lib" ]; do \
		if [ -n "$$lib" ]; then \
			echo "    Installing $$lib..."; \
			$(ARDUINO_CLI) lib install "$$lib"; \
		fi; \
	done < $(LIBRARIES_FILE)
	@echo "==> Libraries installed!"

## install: Full install - install core and libraries
install: install-core install-libs
	@echo "==> Install complete! You can now run 'make build'"

# -----------------------------------------------------------------------------
# Information
# -----------------------------------------------------------------------------

## list-boards: List all connected boards
list-boards:
	@echo "==> Connected boards:"
	$(ARDUINO_CLI) board list

## list-ports: List available serial ports
list-ports:
	@echo "==> Available ports:"
	$(ARDUINO_CLI) board list | awk 'NR>1 {print $$1}'

## list-libs: List installed libraries
list-libs:
	@echo "==> Installed libraries:"
	$(ARDUINO_CLI) lib list

## info: Show current configuration
info:
	@echo "==> Current Configuration:"
	@echo "    Board FQBN:  $(BOARD_FQBN)"
	@echo "    Port:        $(PORT)"
	@echo "    Sketch:      $(SKETCH_DIR)"
	@echo "    Build dir:   $(BUILD_DIR)"

# -----------------------------------------------------------------------------
# Website Development
# -----------------------------------------------------------------------------

## serve-website: Start local web server for the documentation website
serve-website:
	@echo "==> Starting web server for documentation website..."
	@echo "==> Open http://localhost:8080/index.html in your browser"
	@cd website && python3 -m http.server 8080

# -----------------------------------------------------------------------------
# Cleanup
# -----------------------------------------------------------------------------

## clean: Remove build artifacts
clean:
	@echo "==> Cleaning build directory..."
	rm -rf $(BUILD_DIR)
	@echo "==> Clean complete!"

# -----------------------------------------------------------------------------
# Help
# -----------------------------------------------------------------------------

## help: Show this help message
help:
	@echo "Arduino CLI Makefile - Monster Hunter Game"
	@echo "==========================================="
	@echo ""
	@echo "Usage: make [target] [VARIABLE=value]"
	@echo ""
	@echo "Variables:"
	@echo "  BOARD_FQBN  Board identifier (default: arduino:avr:uno)"
	@echo "  PORT        Serial port (auto-detected if not set)"
	@echo ""
	@echo "Common board FQBNs:"
	@echo "  arduino:avr:uno      Arduino Uno"
	@echo "  arduino:avr:nano     Arduino Nano"
	@echo "  arduino:avr:mega     Arduino Mega 2560"
	@echo ""
	@echo "Targets:"
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/## /  /'
	@echo ""
	@echo "Examples:"
	@echo "  make install         # First time setup"
	@echo "  make build           # Compile the sketch"
	@echo "  make upload          # Compile and upload"
	@echo "  make monitor         # Open serial monitor"
	@echo "  make upload PORT=/dev/cu.usbmodem14101"
	@echo "  make build BOARD_FQBN=arduino:avr:nano"
