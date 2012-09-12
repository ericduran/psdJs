
all: update_submodules

update_submodules:
	@@if [ -d .git ]; then \
		if git submodule status; then \
			git submodule update --init --recursive; \
		fi; \
	fi;
