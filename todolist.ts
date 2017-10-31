
let typeList = ["Active", "Complete"];

let taskList = [];
let uniqueID = 0;

let temp_tid;
interface objInterface {
    t_id: number;
    t_name: string;
    t_status: string;

}


class todolist {

    addPageElement = <HTMLElement>document.querySelector('#addpage');
    updatePageElement = <HTMLElement>document.querySelector('#updatepage');
    homePageElement = <HTMLElement>document.querySelector('#homepage');

    onAddNewTask() {
        this.addPageElement.style.display = "block";
        this.homePageElement.style.display = "none";
        this.updatePageElement.style.display = "none";
        this.statusDropDown();
    }

    onCancel() {
        this.addPageElement.style.display = "none";
        this.updatePageElement.style.display = "none";
        this.homePageElement.style.display = "block";
        this.showList();
    }

    persistTask() {
        window.localStorage.setItem("taskData", JSON.stringify(taskList));

    }

    statusDropDown() {
        var start = 0;
        var end = typeList.length;
        var options = "";
        for (var i = start; i < end; i++) {
            options += "<option class='opID' value='" + typeList[i] + "'>" + typeList[i] + "</option>";
        }

        document.getElementById("tstatus").innerHTML = options;
        document.getElementById("t-status").innerHTML = options;

    }

    onAddTask() {

        let tname: string = (document.getElementById("tname") as HTMLInputElement).value;
        let tstatus: string = (document.getElementById("tstatus") as HTMLInputElement).value;

        if (tname != "" && tstatus != null) {

            var taskData = window.localStorage.getItem("taskData");
            if (taskData) {
                taskList = JSON.parse(taskData);
            }

            var obj: objInterface = { t_id: 0, t_name: "t_name", t_status: "t_status" };

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
    }

    onClear() {
        (document.getElementById("tname") as HTMLInputElement).value = "";
        (document.getElementById("tstatus") as HTMLInputElement).value = typeList[0];
        (document.getElementById("tname") as HTMLInputElement).placeholder = "Task Details";

    }

    showList() {

        var taskData = window.localStorage.getItem("taskData");
        if (taskData) {
            taskList = JSON.parse(taskData);
        }

        
        var list = "";
        var tableHead = "";
        var msg="";
        if(taskList.length!=0)
        {
            tableHead = "<tr>"+
            "<th style='text-align: center'>Tasks</th>"+
            "<th style='text-align: center;padding-left: 50px;padding-right: 50px;width: 250px;'>Status</th>"+
            "<th style='text-align: center;padding-left: 20px;padding-right: 20px;'>Action</th>"+
            "</tr>"

        }
        else{
            msg="List is empty.";
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


    }

    onDeleteBtn(deleteID) {
        var taskData = window.localStorage.getItem("taskData");

        if (taskData) {
            taskList = JSON.parse(taskData);
        }

        let tempArray = [];
        let j = 0;
        for (let i = 0; i < taskList.length; i++) {
            if (!(deleteID == taskList[i].t_id)) {
                tempArray[j] = taskList[i];
                j++;
            }
        }
        taskList = tempArray;
        this.persistTask();


        this.showList();



    }

    onUpdateBtn(updateID) {
        this.addPageElement.style.display = "none";
        this.homePageElement.style.display = "none";
        this.updatePageElement.style.display = "block";

        var taskData = window.localStorage.getItem("taskData");
        if (taskData) {
            taskList = JSON.parse(taskData);
        }

        var t_name, t_status;

        for (let i = 0; i < taskList.length; i++) {
            if (updateID == taskList[i].t_id) {
                t_name = taskList[i].t_name;
                t_status = taskList[i].t_status;
            }
        }
        this.statusDropDown();
        (document.getElementById("t-name") as HTMLInputElement).value = t_name;
        (document.getElementById("t-status") as HTMLInputElement).value = t_status;
        temp_tid = updateID;



    }

    onUpdateTask(tid) {

        let tname: string = (document.getElementById("t-name") as HTMLInputElement).value;
        let tstatus: string = (document.getElementById("t-status") as HTMLInputElement).value;

        if (tname != "" && tstatus != null) {


            var taskData = window.localStorage.getItem("taskData");
            if (taskData) {
                taskList = JSON.parse(taskData);
            }

            for (let i = 0; i < taskList.length; i++) {
                if (tid == taskList[i].t_id) {
                    taskList[i].t_name = tname;
                    taskList[i].t_status = tstatus;
                }
            }



            this.persistTask();

            this.onCancel();

        }

    }

}

window.onload = () => {

    var obj = new todolist();
    obj.showList();

    var addbtn = <HTMLButtonElement>document.getElementById("addbtn");
    addbtn.onclick = function () { obj.onAddNewTask(); }

    var cancelbtn = <HTMLButtonElement>document.getElementById("cancel");
    cancelbtn.onclick = function () { obj.onCancel(); }

    var btnSubmit = <HTMLButtonElement>document.getElementById("btnSubmit");
    btnSubmit.onclick = function () { obj.onAddTask(); }

    var cancelbtn2 = <HTMLButtonElement>document.getElementById("cancel2");
    cancelbtn2.onclick = function () { obj.onCancel(); }

    var btnSubmit2 = <HTMLButtonElement>document.getElementById("btnSubmit2");
    btnSubmit2.onclick = function () { obj.onUpdateTask(temp_tid); }



    window.onclick = function showOnhover(e) {

        let deleteID = e.srcElement.getAttribute("deleteID");

        let updateID = e.srcElement.getAttribute("updateID");

        if (deleteID != null && updateID == null) {
            obj.onDeleteBtn(deleteID);
        }
        if (deleteID == null && updateID != null) {
            obj.onUpdateBtn(updateID);
        }

    }
}