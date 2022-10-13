---
layout: post
title: 'MacOS 셋팅을 다시 해보자!'
description: 'MacOS 셋팅 (feat. M1 MacBook Air)'
date: 2022-01-08 01:28:00
category: macos
tags: [config, macos]
comments: true
draft: false
---

## Macos 셋팅

Update: 2022-01-14

M1 맥북 에어를 구매하면서, 다시 새로 셋팅을 해야 하는 일이 생겼다.

주로 기본 설정은 [subicura님의 macos 셋팅](https://subicura.com/2017/11/22/mac-os-development-environment-setup.html)을 이용 한다.

### homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

ref. https://brew.sh/index_ko

### iTerm2

```bash
brew install iterm2
```

```bash
brew install wget
```

theme는 subicura님이 쓰시는 Snazzy를 사용한다.

```bash
wget https://raw.githubusercontent.com/sindresorhus/iterm2-snazzy/main/Snazzy.itermcolors .
```

### zsh / oh-my-zsh

```bash
brew install zsh zsh-completions
```

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

```bash
# zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting

# zsh-autosuggestions
git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
```

`vi ~/.zshrc`를 통해 zsh에 플러그인을 설정 한다.

```
plugins=(
  git
  zsh-syntax-highlighting
  zsh-autosuggestions
)
```

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k
```

`vi ~/.zshrc`를 통해 테마를 변경한다.

```
ZSH_THEME="powerlevel10k/powerlevel10k"
```

### command line tool

#### neovim/spacevim

```bash
brew install neovim
brew tap homebrew/cask-fonts
brew install font-meslo-lg-nerd-font
```

`vi ~/.zshrc`입력후 neovim을 사용하도록 별칭을 지정한다.

```bash
which nvim
> /opt/homebrew/bin/nvim
```

```
alias vim="nvim"
alias vi="nvim"
alias vimdiff="nvim -d"
export EDITOR=/opt/homebrew/bin/nvim
```

### spacevim 에서 jj to esc 설정하기

https://stackoverflow.com/questions/66654579/how-to-map-esc-key-to-jk-in-spacevim

[Documentation | SpaceVim](https://spacevim.org/documentation/#concepts)

`~/.SpaceVim.d/init.toml` 에서 아래의 설정 추가

```jsx
;[options]
bootstrap_before = 'myspacevim#before'
bootstrap_after = 'myspacevim#after'
```

`~/.SpaceVim.d/autoload/myspacevim.vim` 에서 아래의 설정 추가

```jsx
function! myspacevim#before() abort
endfunction

function! myspacevim#after() abort
    inoremap jj  <Esc>
endfunction
```

#### fzf

```bash
brew install fzf
```

#### fasd

```bash
brew install fasd
```

#### asdf

그런데, 잘 안 쓴다. (rbenv/volta를 주로 사용)

```bash
brew install asdf
```

#### tmux

```bash
brew install tmux
```

#### jq

```bash
brew install jq
```

#### bat

```bash
brew install bat
```

`vi ~/.zshrc` 후 `alias cat="bat"` 추가

그런데, 위처럼 설정 하니, 가끔 `cat`으로 그냥 보고 싶을 때가 있어서 그냥 명령어를 입력해서 사용 중

#### ngrok

```bash
brew install ngrok
```

#### docker

```bash
brew install docker
```

docker desktop: https://www.docker.com/products/docker-desktop

#### hammerspoon

```bash
brew install hammerspoon
```

만약, 한영 전환시 표시를 하고 싶다면, 기계인간님께서 만드신 인풋소스 오로라를 사용하면 된다.

ref. https://johngrib.github.io/wiki/hammerspoon-inputsource-aurora/

### peco + zsh

https://www.44bits.io/ko/post/incremental-search-tool-peco 를 통해 커맨드 라인에서 증분 검색기를 이용 할 수 있는 peco를 소개 하고, 사용법과 zsh와 같이 사용하는 것을 소개 하고 있다.

```bash
# from http://qiita.com/uchiko/items/f6b1528d7362c9310da0 by uchiko

function peco-select-history() {
    local tac
    if which tac > /dev/null; then
        tac="tac"
    else
        tac="tail -r"
    fi
    BUFFER=$(\history -n 1 | \
        eval $tac | \
        peco --query "$LBUFFER")
    CURSOR=$#BUFFER
    zle clear-screen
}
zle -N peco-select-history
bindkey '^r' peco-select-history
```

위 내용을 `~/.zsh/peco-history/peco-history.zsh` 경로에 저장 한다.

그리고, zshrc 파일에 아래 내용을 추가해주면 된다.

```
source ~/.zsh/peco-history/peco-history.zsh
```

### rbenv

asdf에서 ruby/nodejs가 지원이 되지만, asdf를 쓰진 않는다. (설치만 해놓고 잘 안씀..)

```bash
brew install rbenv
```

`vi ~/.zshrc`열어서 다음과 같이 수정 한다.

```
[[ -d ~/.rbenv  ]] && \
export PATH=${HOME}/.rbenv/bin:${PATH} && \
eval "$(rbenv init -)"
```

그리고, 루비를 설치 해주자.

```bash
rbenv install 3.1.0
rbenv global 3.1.0
rebenv rehash
```

3.1.0 버전을 설치하고, 전역으로 설정 한다.

### volta

```bash
brew install volta
```

node version manager로 rust로 만들어져서 빠르다. nvm은 생각보다 좀 느린 편이라, nvm에서 넘어왔다.

```bash
volta install node
```

최신 노드 버전을 설치 할 수 있다.

#### tig

```bash
brew install tig
```

#### [gitui ](https://github.com/extrawurst/gitui)

```bash
brew install gitui
```

tig/lazygit과 비슷하나, 좀 더 빠르다. Rust로 작성 되었다.

#### [lazygit](https://github.com/jesseduffield/lazygit)

```bash
brew install lazygit
```

github star로만 보면, lazygit이 제일 높다. go로 작성 되었다.

#### emacs + spacemacs

```bash
brew install emacs
```

https://www.spacemacs.org

```bash
$ git clone https://github.com/syl20bnr/spacemacs ~/.emacs.d
```

```bash
$ emacs # 실행시 spacemacs 설정 시작 및 설치
```

https://www.youtube.com/playlist?list=PLPNohcoOBa5GejCpa5-Mw79bXnyynM1Nn

Spacemacs 사용법에 관한 최고의 영상들이다.

##### spacemacs jj - escaping

```bash
emacs ~/.spacemacs
```

```lisp
(defun dotspacemacs/user-config ()
  (setq-default evil-escape-key-sequence "jj"))
```

Ref. https://github.com/syl20bnr/spacemacs/blob/master/doc/DOCUMENTATION.org#escaping

---

## IDE

### IntelliJ 설정

Vs code와 마찬가지로 플러그인을 좀 번잡하게 사용하는데, 정리를 한 번 하고 주로 쓰는 플러그인을 정리 할까 한다.

#### ideavimrc

사실 vi editor를 잘 쓰는 것은 아니지만, 무조건 쓰려고 하고 있다. 그래서 대다수 툴에 설정을 하는 편이다.

```bash
vi ~/.ideavimrc
```

```bash
set NERDTree

'clipboard'      'cb'    clipboard options
'digraph'        'dg'    enable the entering of digraphs in Insert mode
'gdefault'       'gd'    the ":substitute" flag 'g' is default on
'history'        'hi'    number of command-lines that are remembered
'hlsearch'       'hls'   highlight matches with last search pattern
'ignorecase'     'ic'    ignore case in search patterns
'iskeyword'      'isk'   defines keywords for commands like 'w', '*', etc.
'incsearch'      'is'    show where search pattern typed so far matches
'matchpairs'     'mps'   pairs of characters that "%" can match
'nrformats'      'nf'    number formats recognized for CTRL-A command
'number'         'nu'    print the line number in front of each line
'relativenumber' 'rnu'   show the line number relative to the line with
                         the cursor
'scroll'         'scr'   lines to scroll with CTRL-U and CTRL-D
'scrolljump'     'sj'    minimum number of lines to scroll
'scrolloff'      'so'    minimum nr. of lines above and below cursor
'selection'      'sel'   what type of selection to use
'showmode'       'smd'   message on status line to show current mode
'sidescroll'     'ss'    minimum number of columns to scroll horizontal
'sidescrolloff'  'siso'  min. nr. of columns to left and right of cursor
'smartcase'      'scs'   no ignore case when pattern has uppercase
'timeout'        'to'    use timeout for mapped key sequences
'timeoutlen'     'tm'    time that is waited for a mapped key sequence
'undolevels'     'ul'    maximum number of changes that can be undone
'viminfo'        'vi'    information to remember after restart
'visualbell'     'vb'    use visual bell instead of beeping
'wrapscan'       'ws'    searches wrap around the end of the file

imap jj <Esc>

let mapleader = " "
map <leader>a :action $SelectAll<CR>
map <leader>b :action GotoDeclaration<CR>
map <leader>c :action $Copy<CR>
map <leader>d :action EditorDuplicate<CR>
map <leader>e :action RecentFiles<CR>
map <leader>f :action Find<CR>
map <leader>g :action GotoLine<CR>
map <leader>h :action TypeHierarchy<CR>
map <leader>i :action ImplementMethods<CR>
map <leader>m :action EditorScrollToCenter<CR>
map <leader>n :action FileChooser.NewFolder<CR>
map <leader>o :action OverrideMethods<CR>
map <leader>p :action ParameterInfo<CR>
map <leader>q :action GuiDesigner.QuickJavadoc<CR>
map <leader>r :action Replace<CR>
map <leader>s :action SaveAll<CR>
map <leader>t :action Vcs.UpdateProject<CR>
map <leader>u :action GotoSuperMethod<CR>
map <leader>v :action $Paste<CR>
map <leader>w :action EditorSelectWord<CR>
map <leader>x :action $Cut<CR>
map <leader>y :action EditorDeleteLine<CR>
map <leader>[ :action EditorCodeBlockStart<CR>
map <leader>] :action EditorCodeBlockEnd<CR>
map <c-w><c-c> :action VimWindowClose<cr>
map [c :action VcsShowPrevChangeMarker<cr>
map ]c :action VcsShowNextChangeMarker<cr>
map [d :action QuickImplementations<cr>
map ]d :action QuickImplementations<cr>
map gcc :action CommentByLineComment<cr>
map <leader>ff :action FindInPath<cr>
map <leader>fu :action FindUsages<cr>
map <leader>su :action ShowUsages<cr>
map <leader>cv :action ChangeView<cr>
map <leader>bb :action ToggleLineBreakpoint<cr>
map <leader>br :action ViewBreakpoints<cr>
map <leader>ic :action InspectCode<cr>
map <leader>oi :action OptimizeImports<cr>
map <leader>re :action RenameElement<cr>
map <leader>rf :action RenameFile<cr>
map <leader>gq :action ReformatCode<cr>
map <leader>mv :action ActivateMavenProjectsToolWindow<cr>
map <leader>dd :action Debug<cr>
map <leader>dc :action ChooseDebugConfiguration<cr>
map <leader>rr :action Run<cr>
map <leader>rc :action ChooseRunConfiguration<cr>
map <leader>q  :action CloseActiveTab<cr>
map <leader>ga :action GotoAction<cr>
map <leader>gi :action GotoImplementation<cr>
map <leader>gs :action GotoSuperMethod<cr>
map <leader>gd :action GotoDeclaration<cr>
map <leader>gt :action GotoTest<cr>
map <leader>gr :action GotoRelated<cr>
map <leader>gb :action Annotate<cr>
map <leader>tl Vy<cr>:action ActivateTerminalToolWindow<cr>
map <leader>tl y<cr>:action ActivateTerminalToolWindow<cr>
map ]e :action GotoNextError<cr>
map [e :action GotoPreviousError<cr>
```

### vs code

plugin들을 소개 하기에는 사용 하지 않는 플러그인들은 정리를 하고 해당 내용을 업데이트 하는게 좋겠다.

현재 맥북에어 설정에는 아래 설정만 되어 있고, 실제 다른 컴퓨터에는 엄청 많은 설정이 있는데, 정리가 필요하다.

#### settings.json

```json
{
  "workbench.colorTheme": "Material Theme Darker",
  "vim.insertModeKeyBindings": [
    {
      "before": ["j", "j"],
      "after": ["<Esc>"]
    }
  ]
}
```

#### keybindings.json

```json
// Place your key bindings in this file to override the defaultsauto[]
[
  {
    "key": "ctrl+shift+n",
    "command": "explorer.newFile"
  },
  {
    "key": "ctrl+shift+d",
    "command": "explorer.newFolder"
  }
]
```

---

## 그 밖에

- [evernote](https://apps.apple.com/kr/app/evernote/id281796108)
  _ 무료 | 유료
  _ 유료 사용중
  _ …더 빡세게 써야겠다.
  _ 온갖 메모
  _ 독서 후 독후감 정리
  _ 재테크
  _ 매매일지
  _ 강의 메모
- [notion](https://www.notion.so/ko-kr/desktop)
  _ 무료 | 유료
  _ 무료 사용중
  _ 주로 드라마, 영화 감상 정리
  _ 코드 블럭이 필요한 개발 관련 내용
  _ 하루 일지
  _ 일일 일지를 주간으로 관리 한지 얼마 안됐다. (진작 쓸걸..)
- [dynalist](https://dynalist.io/download)
  _ 무료 | 유료
  _ 보통 1년 단위의 목표를 적어둠 \* 앞으로는 좀 쪼개서 써볼까 한다.
- [things 3](https://apps.apple.com/kr/app/things-3/id904237743)
  _ 유료
  _ 기기 수 제한 없음.
  _ 하루 하루의 해야 할 일들
  _ 동기화 기능은 좋은데, 아이폰, 아이패드, PC 모두 따로 사야 함. \* 아이폰/PC만 사서 사용
- [obsidian](https://obsidian.md/)
  _ 무료 | 유료
  _ 사실 예전에 쓰다가, 말았는데 요새 공부한걸 정리용으로 쓰려고 한다. (계획중)
- [itsycal](https://www.mowglii.com/itsycal/) \* 메뉴바에 달력을 볼 수 있게 해준다.
- [translate tab](https://apps.apple.com/kr/app/translate-tab/id458887729?mt=12) \* 유료 (단축키 지정시 바로 문장 번역)
- [SnippetsLab](https://apps.apple.com/us/app/snippetslab/id1006087419?mt=12)
  _ 유료 (각종 스니펫 저장)
  _ Alfred workflow를 지원 해줌. \* 단축키로도 검색 가능
- [Alfred](https://www.alfredapp.com/)
  _ 유료
  _ 기기 수 제한 없음. \* 무조건 써야 하는 툴
- [popclip](https://apps.apple.com/kr/app/popclip/id445189367?mt=12)
  _ 유료
  _ 기기 수 제한 없음.
  _ PC MacOS에서 아이폰스럽게 쓸 수 있도록 해주는 툴
  _ 사실 굳이 필요할까? (잘 안쓰게 된다)
- [Bartender 4](https://www.macbartender.com/)
  _ 유료
  _ 기기 수 제한 없음.
  _ 버전 업데이트 마다 구매 해야 하는 단점
  _ 그치만, 사야 한다.
- [Allkdick](https://apps.apple.com/kr/app/allkdic-handy-dictionary-in-status-bar/id1033453958?l=en&mt=12)
  _ 무료
  _ 네이버 사전을 메뉴바에서 사용 가능 \* 만든 개발자분 정말 감사합니다.
- [shifty](https://shifty.natethompson.io/en/)
  _ 무료
  _ > A macOS menu bar app that gives you more control over Night Shift. \* 딱히 설명하기 애매했으나, 페이지에서 한 문장으로 설명한 것을 가져옴.
- [Dropover](https://apps.apple.com/kr/app/dropover-easier-drag-drop/id1355679052?mt=12)
  _ 유료
  _ 기기 수 제한 없음. \* 특정 파일을 클릭하고 흔들면, 임시?! 공간이 뜨는데, 굉장히 편리하다.
- [BetterTouchTool](https://folivora.ai/)
  _ 유료
  _ 기기 수 제한 없음.
  _ 터치바든, 온갖 키보드, 액션들을. 설정 할 수 있다.
  _ 주로 창을 이전/다음 데스크톱 이동시키는 Action을 설정 해두고 쓴다.
  _ 이거 하나만 해도 돈 값한다고 생각중..
  _ 다만, 키보드 키 바인딩 변경도 커버 되지만, 이 부분은 karabiner 쓴다. 그외는 모든 영역을 해당 툴로 씀
- [Karabiner-Elements](https://karabiner-elements.pqrs.org/)
  _ 무료
  _ 키보드 키 바인딩 변경 최강앱
- [monosnap](https://apps.apple.com/kr/app/monosnap-screenshot-editor/id540348655?mt=12)
  _ 무료
  _ 스크린샷계 최강자 (window 유저는 pickpick인가? 쓰는게 최고)
- [Irvue](https://apps.apple.com/kr/app/irvue/id1039633667?mt=12)
  _ 무료
  _ 배경화면 자동으로 교체
- [DaisyDisk](https://daisydiskapp.com/)
  _ 유료
  _ 기기 수 제한 없음. \* DiskSpace 관리 앱

- GoodNote5
  _ 유료
  _ 아이패드/PC 동기화 되면서 최고
  _ 두쪽 보기 지원이 안되서, 아쉽다.
  _ 노트 앱(PDF 파일 주로 보는 용도) \* Ebook을 주로 본다.
- [panda](https://bear.app/panda/)
  _ 무료
  _ typora가 유료화 되면서 옮겨 왔다.
  _ macdown 쓰다가 bear에서 만든 거라 쓰는 중인데, 만족함
  _ markdown editor
- [Contexts](https://contexts.co/)
  _ 유료
  _ 기기 수 제한 없음.
  _ Radically simpler & faster window switcher
  _ 말그대로 윈도우 앱들 검색 하거나, 축약어로 전환 할 수 있도록 해줌
