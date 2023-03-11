// 시간
const curTime = document.querySelector(".curtime");
const timeOptions = {
  hour12: false,
  timeStyle: "short",
};
curTime.textContent = new Intl.DateTimeFormat("ko-KR", timeOptions).format(new Date());
setInterval(function () {
  curTime.textContent = new Intl.DateTimeFormat("ko-KR", timeOptions).format(new Date());
}, 1000);

// 북마크
const bookmarkSection = document.querySelector(".bookmarks");
const bookmarkAddbtn = document.querySelector(".bookmark__addbtn");
const bookmarkDialog = document.querySelector(".bookmark__dialog");
const dialogInputName = document.getElementById("site-name");
const dialogInputURL = document.getElementById("site-url");
const dialogSaveBtn = document.querySelector(".dialog__btn_save");
let bookmarks = (localStorage.getItem("bookmarks") && JSON.parse(localStorage.getItem("bookmarks"))) ?? [];

initialBookmarkPaint(bookmarks);
bookmarkAddbtn.addEventListener("click", addBookmarkHandler);
dialogInputName.addEventListener("input", toggleDisabledBtn);
dialogInputURL.addEventListener("input", toggleDisabledBtn);
bookmarkDialog.addEventListener("close", closeHandler);

function initialBookmarkPaint(bookmarks) {
  bookmarks.forEach((bookmark) => createBookmark(bookmark));
}
function addBookmarkHandler(event) {
  bookmarkDialog.showModal();
  dialogInputName.focus();
}
function toggleDisabledBtn(e) {
  if (dialogInputName.value.trim() && dialogInputURL.value.trim()) {
    dialogSaveBtn.disabled = false;
  } else {
    dialogSaveBtn.disabled = true;
  }
}
function closeHandler(event) {
  if (bookmarkDialog.returnValue === "save") {
    //데이터 추가
    const name = dialogInputName.value;
    let url = dialogInputURL.value;
    if (!/^https?:\/\//i.test(url)) {
      // URL이 http 또는 https로 시작하지 않으면
      url = "https://" + url; // https를 앞에 붙여준다
    }
    const id = Date.now();
    const bookmark = { id, name, url };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    // UI 추가
    createBookmark(bookmark);
  }
  dialogInputName.value = "";
  dialogInputURL.value = "";
}
function createBookmark({ id, name, url }) {
  // <a class="bookmark" href="https://www.example.com/" target="_blank"></a> 생성
  const bookmark = document.createElement("a");
  bookmark.href = url;
  bookmark.target = "_blank";
  bookmark.classList.add("bookmark");
  // bookmark 삭제 버튼 생성
  const bookmarkRmbtn = document.createElement("button");
  bookmarkRmbtn.classList.add("bookmark__rmbtn");
  bookmarkRmbtn.textContent = "X";
  bookmark.appendChild(bookmarkRmbtn);
  bookmark.insertAdjacentHTML("afterbegin", `<div class="bookmark__thumbnail"><img src="${url}/favicon.ico" /></div><div class="bookmark__name">${name}</div>`);
  bookmarkSection.appendChild(bookmark);

  // 삭제 버튼 이벤트 등록
  bookmarkRmbtn.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    //데이터 삭제
    bookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    // UI 삭제
    event.currentTarget.closest(".bookmark").remove();
  });
}

// todo
const todoForm = document.querySelector(".todo__form");
const todoInput = document.querySelector(".todo__input");
const todoAddBtn = document.querySelector(".todo__add-btn");
const todoList = document.querySelector(".todo__list");
let todos = (localStorage.getItem("todos") && JSON.parse(localStorage.getItem("todos"))) ?? [];

initialTodoPaint(todos);
todoForm.addEventListener("submit", submitHandler);

function initialTodoPaint(todos) {
  todos.forEach((todo) => createTodoListItem(todo));
}

function submitHandler(event) {
  event.preventDefault();
  if (todoInput.value.trim()) {
    const id = Date.now();
    const content = todoInput.value.trim();
    const isFinished = false;
    const todo = { id, content, isFinished };
    // todo 데이터를 todos에 추가
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    // 추가된 todo를 UI에 추가
    createTodoListItem(todo);
    todoInput.value = "";
  }
  todoInput.focus();
}

function createTodoListItem({ id, content, isFinished }) {
  // <li class="todo__list-item"></li> 생성
  const todoListItem = document.createElement("li");
  todoListItem.classList.add("todo__list-item");
  todoListItem.id = id;

  // <span class="todo__content"></span> 생성
  const todoContent = document.createElement("span");
  todoContent.classList.add("todo__content");
  todoContent.tabIndex = 0;
  todoContent.textContent = content;
  if (isFinished) {
    todoContent.classList.add("todo__content_checked");
  }
  todoListItem.appendChild(todoContent);

  // <button class="todo__rm-btn"><i class="bx bxs-trash"></i></button> 생성
  const todoRmBtn = document.createElement("button");
  todoRmBtn.classList.add("todo__rm-btn");
  todoRmBtn.insertAdjacentHTML("afterbegin", `<i class="bx bxs-trash"></i>`);
  todoListItem.appendChild(todoRmBtn);

  // ul 엘리먼트에 li 추가
  todoList.appendChild(todoListItem);

  // 내용 클릭 이벤트 핸들러
  todoContent.addEventListener("click", function (event) {
    const id = event.target.parentNode.getAttribute("id");
    todos.forEach((todo) => {
      if (String(todo.id) == String(id)) {
        todo.isFinished = !todo.isFinished;
      }
    });
    // 데이터 수정
    localStorage.setItem("todos", JSON.stringify(todos));
    // UI 수정
    event.target.classList.toggle("todo__content_checked");
  });

  // 삭제 버튼 클릭 이벤트 핸들러
  todoRmBtn.addEventListener("click", function (event) {
    const id = event.currentTarget.parentNode.getAttribute("id");
    todos = todos.filter((todo) => String(todo.id) !== String(id));
    // 데이터 수정
    localStorage.setItem("todos", JSON.stringify(todos));
    // UI 수정
    event.currentTarget.parentNode.remove();
  });
}
