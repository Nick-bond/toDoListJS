(function () {

    var taskItem = $('.form-control');
    var todoItemList = $('.table');
    var itemList = document.createDocumentFragment();
    var itemId = Math.floor((Math.random() * 100) + 1);
    var checkbox = $('.table .checkbox');
    var position = 0;
    var wrapBlock = document.createDocumentFragment();

    document.addEventListener("DOMContentLoaded", onClickRemove);
    document.addEventListener("DOMContentLoaded", onChecked);
    document.addEventListener("DOMContentLoaded", dragAndDrop);

    function onClickRemove() {
        var removeBtn = document.querySelectorAll('.glyphicon-remove');
        for (var i = 0; i < removeBtn.length; i++) {
            removeBtn[i].addEventListener('click', function (event) {
                var id = event.currentTarget.getAttribute('ids');
                var parentBlock = event.currentTarget.parentNode.parentNode.parentNode.remove();
                localStorage.removeItem(id);
            });
        }
    };

    function onChecked() {
        var checkbox = document.querySelectorAll('.checkbox');

        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].addEventListener("change", function (e) {
                var id = event.currentTarget.parentNode.parentNode.querySelector('.glyphicon-remove').getAttribute('ids');
                var data = {
                    text: event.currentTarget.parentNode.lastChild.textContent,
                    status: e.currentTarget.checked,
                    position: position
                };
                localStorage.setItem(id, JSON.stringify(data));
            });
        }
    };

    function $ (domElement) {
        return document.querySelector(domElement);
    };

    $('.btn-default').addEventListener('click', addNew);

    function getTodoLocalStorage() {
        for (var i = 0; i < localStorage.length; i++) {
            if (!localStorage.key([i]).indexOf('todo_')) {
                var key = localStorage.key([i]);
                showItems(localStorage.getItem(key), key);
            }
        }
        todoItemList.appendChild(wrapBlock);
    };

    getTodoLocalStorage();

    function addNew() {
        var position = position + 1;
        var data = {
            text: taskItem.value,
            status: false,
            position: position
        };

        var addedItems = taskItem.value;
        localStorage.setItem('todo_' + itemId, JSON.stringify(data));

        return false;
    };

    function showItems(data, key) {
        var toDo = JSON.parse(data);
        var checked;
        if (toDo.status) {
            checked = 'checked';
        }
        var wrap = document.createElement('tbody');
        var trWrap = document.createElement('tr');
        var tdEl = document.createElement('td');
        var tdSecond = document.createElement('td');
        var checkBox = document.createElement('input');
        var spanTitle = document.createElement('textarea');
        var spanRemove = document.createElement('span');

        var changeIcon = document.createElement('span');
        var changeIconBtn = document.createElement('span');
        checkBox.classList.add('checkbox');
        changeIconBtn.classList.add('glyphicon');
        changeIconBtn.classList.add('glyphicon-pencil');
        trWrap.setAttribute('draggable', 'true');
        checkBox.setAttribute('type', 'checkbox');

        spanTitle.classList.add('title');
        spanTitle.setAttribute('readonly', '');
        spanTitle.setAttribute('value', toDo.text);
        spanTitle.innerText=toDo.text;

        if (toDo.status) {
            checkBox.setAttribute('checked', '');
        }
        tdEl.appendChild(checkBox);
        tdEl.appendChild(spanTitle);
        trWrap.appendChild(tdEl);

        tdSecond.classList.add('remove');
        tdSecond.classList.add('text-right');
        spanRemove.classList.add('glyphicon');
        spanRemove.classList.add('glyphicon-remove');
        spanRemove.setAttribute('ids', key);
        tdSecond.appendChild(changeIconBtn);
        tdSecond.appendChild(spanRemove);
        trWrap.appendChild(tdSecond);

        wrap.appendChild(trWrap);
        wrapBlock.appendChild(wrap);

    };

    // drag and drop

    function dragAndDrop () {
        var trElem = document.querySelectorAll('tr');
        for (var i = 0; i < trElem.length; i++) {
            trElem[i].addEventListener('dragstart', dragStart, false);
            trElem[i].addEventListener('dragover', dragOver, false);
            trElem[i].addEventListener('drop', dropDown, false);
            trElem[i].addEventListener('dragend', dragendEnd, false);
        }
    };
    var dragSrcEl = null;
    function dragStart(e) {
        this.style.opacity = '0.4';
        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    };

    function dragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        return false;
    };

    function dropDown(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }

        return false;
    };

    function dragendEnd(e) {
        this.style.opacity = '1';
        var positionEl = e.currentTarget.getBoundingClientRect();
        var id = event.currentTarget.querySelector('.glyphicon-remove').getAttribute('ids');
        var txt = event.currentTarget.querySelector('.title').textContent;

        var data = {
            text: txt,
            status: e.currentTarget.checked,
            positionY: positionEl.top
        };
        localStorage.setItem(id, JSON.stringify(data));
    };
    
})();