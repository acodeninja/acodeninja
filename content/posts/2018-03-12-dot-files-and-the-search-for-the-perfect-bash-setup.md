---
title: "dot files and the search for the perfect bash setup"
date: 2018-03-12
draft: false
toc: true
keywords:
    - bash profile
    - ps1
    - shell 
summary: >-
    Discussion about what makes a good bash prompt. Including examples.
---

## the prompt
What makes a good bash prompt?

Ubuntu 17.10 has a nice easy to look at prompt, but it doesn't give you a lot of
information.

```shell script
acodeninja@laptop:~$ _
```

It's nice to have some information relevant to your current task.

```shell script
[acodeninja@laptop] [master !? - me@acode.ninja] 
~/code/dotty > _
```

Or tasks you have running in the background

```shell script
[acodeninja@laptop] [jobs: 1 running 2 stopped] 
~/code/dotty > _
```

Or the exit code of your last command

```shell script
[acodeninja@laptop] [130] 
~/code/dotty > _
```

The following functions give us all we need to put the information above into
our terminal prompt. 

```shell script
#!/bin/sh

# get last command return value
function nonzero_return() {
	RETVAL=$?
	[ $RETVAL -ne 0 ] && echo " [$RETVAL]"
}

# get the current git repo author email
function get_git_author() {
	BRANCH=`git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`
	if [ ! "${BRANCH}" == "" ]
	then
		echo " [$(git config user.email)]"
	else
		echo ""
	fi
}

# get current branch in git repo
function get_git_branch() {
	BRANCH=`git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`
	if [ ! "${BRANCH}" == "" ]
	then
		STAT=`get_git_dirty`
		echo " [${BRANCH}${STAT}]"
	else
		echo ""
	fi
}

# get current status of git repo
function get_git_dirty {
	status=`git status 2>&1 | tee`
	dirty=`echo -n "${status}" 2> /dev/null | grep "modified:" &> /dev/null; echo "$?"`
	untracked=`echo -n "${status}" 2> /dev/null | grep "Untracked files" &> /dev/null; echo "$?"`
	ahead=`echo -n "${status}" 2> /dev/null | grep "Your branch is ahead of" &> /dev/null; echo "$?"`
	newfile=`echo -n "${status}" 2> /dev/null | grep "new file:" &> /dev/null; echo "$?"`
	renamed=`echo -n "${status}" 2> /dev/null | grep "renamed:" &> /dev/null; echo "$?"`
	deleted=`echo -n "${status}" 2> /dev/null | grep "deleted:" &> /dev/null; echo "$?"`
	bits=''
	if [ "${renamed}" == "0" ]; then
		bits=">${bits}"
	fi
	if [ "${ahead}" == "0" ]; then
		bits="*${bits}"
	fi
	if [ "${newfile}" == "0" ]; then
		bits="+${bits}"
	fi
	if [ "${untracked}" == "0" ]; then
		bits="?${bits}"
	fi
	if [ "${deleted}" == "0" ]; then
		bits="x${bits}"
	fi
	if [ "${dirty}" == "0" ]; then
		bits="!${bits}"
	fi
	if [ ! "${bits}" == "" ]; then
		echo " ${bits}"
	else
		echo ""
	fi
}

# Get count of background processes
function get_background_job_count {
	STOPPED_FILE=/tmp/$$-stopped
	RUNNING_FILE=/tmp/$$-running
	echo 0 > $STOPPED_FILE
	echo 0 > $RUNNING_FILE

	jobs | while read line ; do
		if [[ $line =~ "Stopped" ]]; then
			STOPPED=$(($(cat $STOPPED_FILE) + 1))
			echo $STOPPED > $STOPPED_FILE;
		fi
		if [[ $line =~ "Running" ]]; then
			RUNNING=$(($(cat $RUNNING_FILE) + 1))
			echo $RUNNING > $RUNNING_FILE;
		fi
	done

	STOPPED=$(cat $STOPPED_FILE)
	RUNNING=$(cat $RUNNING_FILE)

	if [ "$STOPPED" != "0" ] || [ "$RUNNING" != "0" ]; then
		echo " [$RUNNING running $STOPPED stopped]";
 	fi
}

function get_load_average {
	echo " [load: $(cat /proc/loadavg)]"
}

function get_current_versions {
	BITS=""

	if [ "$(which php)" != "" ]; then
		if [ "$BITS" != "" ]; then
			BITS="$BITS ";
		fi
		BITS="${BITS}php: v$(echo "<?php \$matches = []; preg_match('/([0-9\.]+)/', PHP_VERSION, \$matches); echo \$matches[0];" | php)"
	fi

	if [ "$(which node)" != "" ]; then
		if [ "$BITS" != "" ]; then
			BITS="$BITS ";
		fi
		BITS="${BITS}node: $(node -v)"
	fi

	if [ "$BITS" != "" ]; then
		echo " [$BITS]"
	fi
}
```


We can then inject the information into our prompt with the following:

```shell script
!/usr/bin/env bash
THIS_DIR=$( cd $( dirname ${BASH_SOURCE[0]} ) >/dev/null 2>&1 && pwd )

source $THIS_DIR/functions.sh

function generateps1 { 
    local CURRENTTERM_WIDTH="$(tput cols)"
    
    local COLOUR_GRAY="\033[1;30m"
    local COLOUR_LIGHT_GRAY="\033[0;37m"
    local COLOUR_CYAN="\033[0;36m"
    local COLOUR_RED="\033[0;31m"
    local COLOUR_YELLOW="\033[0;33m"
    local COLOUR_ORANGE="\033[1;31m"
    local COLOUR_NONE="\033[0m"
    
    local LAST_EXIT_CODE=$(nonzero_return)
    
    local USERNAME=$(whoami)
    local HOSTNAME=$(hostname)
    local GIT_CURRENT_BRANCH=$(get_git_branch)
    local GIT_CURRENT_AUTHOR=$(get_git_author)
    local BACKGROUND_JOBS=$(get_background_job_count)
    local GET_CLI_VERSIONS=$(get_current_versions)
    
    local TOP_LINE="\n$COLOUR_LIGHT_GRAY[$USERNAME@$HOSTNAME]$COLOUR_NONE"
          TOP_LINE="$TOP_LINE$COLOUR_CYAN$GIT_CURRENT_AUTHOR$COLOUR_NONE"
          TOP_LINE="$TOP_LINE$COLOUR_RED$BACKGROUND_JOBS$COLOUR_NONE"
    
    if [ "$(tput cols)" -gt "100" ]; then
        TOP_LINE="$TOP_LINE$GET_CLI_VERSIONS"
    fi
    
    local PROMPT="$(dirs)$COLOUR_YELLOW$GIT_CURRENT_BRANCH$COLOUR_NONE > "
    
    echo -e "$TOP_LINE\n$PROMPT"
}

export PS1="`generate_ps1`"
```

Using the above we get a really nice looking prompt with all the information you
could want at your fingertips.

![Nice looking prompt you have there]({{ "/assets/images/posts/2018-03-12/ps1-prompt.png" | absolute_url }})

## the aliases
Ubuntu includes some nice default aliases `ll` is an alias of `ls -al` and can
have more arguments added to it `ll -h`  works perfectly well.

Here are some I use.

### colour grep output for ease of use

```shell script
alias grep='grep --color=auto' 
alias egrep='egrep --color=auto' 
alias fgrep='fgrep --color=auto'
```

### confirm file operations

```shell script
alias mv='mv -i' 
alias cp='cp -i' 
alias ln='ln -i'
alias rm='rm -i'
```

### handy ls aliases

```shell script
alias ll='ls -al' 
alias l='ls -l' 
alias la='ls -a'
```

### handy php version switcher
```shell script
function phpswitch { 
  if [ "$(which php$1)" != "" ]; then
    alias php="php$1"
    echo "Switched to php$1 successfully"
  else
    echo "Could not find php$1"
  fi 
}
```

All of this and more is at [@acodeninja/.dotty](https://github.com/acodeninja/.dotty), 
my collection of bash terminal customisations geared toward developers working 
with linux.
