var typeList = ["Active", "Complete"];
var taskList = [];
var uniqueID = 0;
var temp_tid;
var todolist = /** @class */ (function () {
    function todolist() {
        this.addPageElement = document.querySelector('#addpage');
        this.updatePageElement = document.querySelector('#updatepage');
        this.homePageElement = document.querySelector('#homepage');
    }
    todolist.prototype.onAddNewTask = function () {
        this.addPageElement.style.display = "block";
        this.homePageElement.style.display = "none";
        this.updatePageElement.style.display = "none";
        this.statusDropDown();
    };
    todolist.prototype.onCancel = function () {
        this.addPageElement.style.display = "none";
        this.updatePageElement.style.display = "none";
        this.homePageElement.style.display = "block";
        this.showList();
    };
    todolist.prototype.persistTask = function () {
        window.localStorage.setItem("taskData", JSON.stringify(taskList));
    };
    todolist.prototype.statusDropDown = function () {
        var start = 0;
        var end = typeList.length;
        var options = "";
        for (var i = start; i < end; i++) {
            options += "<option class='opID' value='" + typeList[i] + "'>" + typeList[i] + "</option>";
        }
        document.getElementById("tstatus").innerHTML = options;
        document.getElementById("t-status").innerHTML = options;
    };
    todolist.prototype.onAddTask = function () {
        var tname = document.getElementById("tname").value;
        var tstatus = document.getElementById("tstatus").value;
        if (tname != "" && tstatus != null) {
            var taskData = window.localStorage.getItem("taskData");
            if (taskData) {
                taskList = JSON.parse(taskData);
            }
            var obj = { t_id: 0, t_name: "t_name", t_status: "t_status" };
            obj.t_name = tname;
            obj.t_status = tstatus;
            if (taskList.length > 0) {
                obj.t_id = taskList[taskList.length - 1].t_id + 1;
            }
            else {
                obj.t_id = 0;
            }
            taskList.push(obj);
            this.persistTask();
            this.onClear();
        }
    };
    todolist.prototype.onClear = function () {
        document.getElementById("tname").value = "";
        document.getElementById("tstatus").value = typeList[0];
        document.getElementById("tname").placeholder = "Task Details";
    };
    todolist.prototype.showList = function () {
        var taskData = window.localStorage.getItem("taskData");
        if (taskData) {
            taskList = JSON.parse(taskData);
        }
        var list = "";
        var tableHead = "";
        var msg = "";
        if (taskList.length != 0) {
            tableHead = "<tr>" +
                "<th style='text-align: center'>Tasks</th>" +
                "<th style='text-align: center;padding-left: 50px;padding-right: 50px;width: 250px;'>Status</th>" +
                "<th style='text-align: center;padding-left: 20px;padding-right: 20px;'>Action</th>" +
                "</tr>";
        }
        else {
            msg = "List is empty.";
        }
        for (var i = 0; i < taskList.length; i++) {
            list += "<tr id='editRow' tid=" + taskList[i].t_id + ">" +
                "<td>" + taskList[i].t_name + "</td>" +
                "<td>" + taskList[i].t_status + "</td>" +
                "<td>" +
                "<input class='btn btn-primary' updateID='" + taskList[i].t_id + "' id='edit' type='submit' value='Update' >" +
                "<input class='btn btn-primary' deleteID='" + taskList[i].t_id + "' id='delete' type='submit' value='Delete' >" +
                "</td></tr>";
        }
        document.getElementById("showTable").innerHTML = tableHead;
        document.getElementById("tableID").innerHTML = list;
        document.getElementById("pmsg").innerHTML = msg;
    };
    todolist.prototype.onDeleteBtn = function (deleteID) {
        var taskData = window.localStorage.getItem("taskData");
        if (taskData) {
            taskList = JSON.parse(taskData);
        }
        var tempArray = [];
        var j = 0;
        for (var i = 0; i < taskList.length; i++) {
            if (!(deleteID == taskList[i].t_id)) {
                tempArray[j] = taskList[i];
                j++;
            }
        }
        taskList = tempArray;
        this.persistTask();
        this.showList();
    };
    todolist.prototype.onUpdateBtn = function (updateID) {
        this.addPageElement.style.display = "none";
        this.homePageElement.style.display = "none";
        this.updatePageElement.style.display = "block";
        var taskData = window.localStorage.getItem("taskData");
        if (taskData) {
            taskList = JSON.parse(taskData);
        }
        var t_name, t_status;
        for (var i = 0; i < taskList.length; i++) {
            if (updateID == taskList[i].t_id) {
                t_name = taskList[i].t_name;
                t_status = taskList[i].t_status;
            }
        }
        this.statusDropDown();
        document.getElementById("t-name").value = t_name;
        document.getElementById("t-status").value = t_status;
        temp_tid = updateID;
    };
    todolist.prototype.onUpdateTask = function (tid) {
        var tname = document.getElementById("t-name").value;
        var tstatus = document.getElementById("t-status").value;
        if (tname != "" && tstatus != null) {
            var taskData = window.localStorage.getItem("taskData");
            if (taskData) {
                taskList = JSON.parse(taskData);
            }
            for (var i = 0; i < taskList.length; i++) {
                if (tid == taskList[i].t_id) {
                    taskList[i].t_name = tname;
                    taskList[i].t_status = tstatus;
                }
            }
            this.persistTask();
            this.onCancel();
        }
    };
    return todolist;
}());
window.onload = function () {
    var obj = new todolist();
    obj.showList();
    var addbtn = document.getElementById("addbtn");
    addbtn.onclick = function () { obj.onAddNewTask(); };
    var cancelbtn = document.getElementById("cancel");
    cancelbtn.onclick = function () { obj.onCancel(); };
    var btnSubmit = document.getElementById("btnSubmit");
    btnSubmit.onclick = function () { obj.onAddTask(); };
    var cancelbtn2 = document.getElementById("cancel2");
    cancelbtn2.onclick = function () { obj.onCancel(); };
    var btnSubmit2 = document.getElementById("btnSubmit2");
    btnSubmit2.onclick = function () { obj.onUpdateTask(temp_tid); };
    window.onclick = function showOnhover(e) {
        var deleteID = e.srcElement.getAttribute("deleteID");
        var updateID = e.srcElement.getAttribute("updateID");
        if (deleteID != null && updateID == null) {
            obj.onDeleteBtn(deleteID);
        }
        if (deleteID == null && updateID != null) {
            obj.onUpdateBtn(updateID);
        }
    };
};
