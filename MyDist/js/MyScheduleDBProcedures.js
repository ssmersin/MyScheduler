var adoRS = new ActiveXObject("ADODB.Recordset");
var adoConn = new ActiveXObject("ADODB.Connection");
var currentPath = ((location + "").replace(/%20/g, " ").replace("file:///", "").replace("/", "\\").replace("Scheduler.htm", ""));
var strConn = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source='"+currentPath+"\\Database\\dbMyScheduler.mdb';Persist Security Info=True";
adoConn.Open(strConn);

var GetSpecialDateClass = function (xdate) {
    var sonuc = [];
    adoRS.Open("SELECT * FROM SpecialDays WHERE #" + moment(xdate).format("YYYY-MM-DD HH:mm:ss").toString() + "# BETWEEN SpecialDay_Begin and SpecialDay_End", adoConn, 1, 3);

    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                var startdate = new Date(adoRS.fields('SpecialDay_Begin').value);
                var enddate = new Date(adoRS.fields('SpecialDay_End').value);
                sonuc.push({ "ID": adoRS.fields('SpecialDay_ID').value, "Name": adoRS.fields('SpecialDay').value, "Class": adoRS.fields('SpecialDay_Class').value, "Begin": startdate, "End": enddate });
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var UserGroups = function () {
    var sonuc = [];

    adoRS.Open("SELECT Person.Person_GroupID, [Person-Groups].Group, [Person-Groups].Group_Long FROM Person INNER JOIN [Person-Groups] ON Person.Person_GroupID = [Person-Groups].Group_ID GROUP BY Person.Person_GroupID, [Person-Groups].Group, [Person-Groups].Group_Long", adoConn, 1, 3);

    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                sonuc.push({ "ID": adoRS.fields('Person_GroupID').value, "Name": adoRS.fields('Group').value, "LName": adoRS.fields('Group_Long').value });
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var WorkGroups = function () {
    var sonuc = [];
    
    adoRS.Open("SELECT * FROM [Task-Groups]", adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                sonuc.push({ "ID": adoRS.fields('Group_ID').value, "Name": adoRS.fields('Group').value, "LName": adoRS.fields('Group_Long').value });
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var PersonInfo = function (PersonID) {
    
    var sonuc = [];
    
    adoRS.Open("SELECT * FROM Person WHERE Person_ID='" + PersonID+"'", adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                sonuc.push({ "ID": adoRS.fields('Person_ID').value, "Name": adoRS.fields('Person_Name').value, "SurName": adoRS.fields('Person_SurName').value, "GroupID": adoRS.fields('Person_GroupID').value, "Picture": adoRS.fields('Person_Pic').value });
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var WorkgroupInfo = function (WorkgroupID) {

    var sonuc = [];

    adoRS.Open("SELECT * FROM [Task-Groups] WHERE Group_ID=" + WorkgroupID, adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                sonuc.push({ "ID": adoRS.fields('Group_ID').value, "Group": adoRS.fields('Group').value, "Group_Long": adoRS.fields('Group_Long').value });
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var TaskInfo = function (TaskID) {
    var sonuc = [];

    adoRS.Open("SELECT Tasks.Task_ID, Tasks.Task_Desc, Tasks.Task_Group FROM Tasks WHERE (((Tasks.Task_ID)='" + TaskID + "'))", adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                sonuc.push({ "ID": adoRS.fields('Task_ID').value, "Desc": adoRS.fields('Task_Desc').value, "Group": adoRS.fields('Task_Group').value });
                adoRS.MoveNext; 
            }

        }

    }
    catch (err) {
        sonuc = [];
    }
    adoRS.close();
    return sonuc;
}

var PersonGroupInfo = function (GroupID) {
    var sonuc = [];
    adoRS.Open("SELECT Group_ID,Group,Group_Long,Updated_When FROM [Person-Groups] WHERE (((Group_ID)=" + GroupID + "))", adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                sonuc.push({ "ID": adoRS.fields('Group_ID').value, "Group": adoRS.fields('Group').value, "Group_Long": adoRS.fields('Group_Long').value });
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }
    adoRS.close();
    return sonuc;
}

var TaskSubPeriod = function (SubID) {
    var sonuc = [];
    adoRS.Open("SELECT TaskSubPeriods.*, [Task-Properties].Task_Class FROM TaskSubPeriods LEFT JOIN [Task-Properties] ON TaskSubPeriods.TaskType_ID = [Task-Properties].ID WHERE (((TaskSubPeriods.[ID])=" + SubID + "))", adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                var startdate = new Date(adoRS.fields('TBegin').value);
                var enddate = new Date(adoRS.fields('TEnd').value);
                sonuc.push({ "ID": adoRS.fields('ID').value, "TypeID": adoRS.fields('TaskType_ID').value, "Begin": startdate, "End": enddate, "SubDesc": adoRS.fields('SubDesc').value, "Class": adoRS.fields('Task_Class').value });
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }
    
    adoRS.close();
    return sonuc;
}

var TaskAllSubPeriods = function (TaskID) {
    
    var sonuc = [];
    adoRS.Open("SELECT TaskSubPeriods.*, ([Task-Properties].ID) AS TypeID, [Task-Properties].Task_Name, [Task-Properties].Task_Class FROM TaskSubPeriods LEFT JOIN [Task-Properties] ON TaskSubPeriods.TaskType_ID = [Task-Properties].ID WHERE (((TaskSubPeriods.[Task_ID])='" + TaskID + "')) ORDER BY TaskSubPeriods.TBegin", adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                var startdate = new Date(adoRS.fields('TBegin').value);
                var enddate = new Date(adoRS.fields('TEnd').value);
                sonuc.push({ "ID": adoRS.fields('ID').value, "Begin": startdate, "End": enddate, "SubDesc": adoRS.fields('SubDesc').value, "TypeID": adoRS.fields('TypeID').value, "TaskName": adoRS.fields('Task_Name').value, "Class": adoRS.fields('Task_Class').value });
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var UsersInGroup = function (Group) {
    
    var sonuc = [];

    adoRS.Open("SELECT * FROM Person WHERE Person_Active AND Person_GroupID=" + Group, adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                sonuc.push({ "ID": adoRS.fields('Person_ID').value, "Name": adoRS.fields('Person_Name').value, "SurName": adoRS.fields('Person_SurName').value, "Picture": adoRS.fields('Person_Pic').value });
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var AllUsers = function () {

    var sonuc = [];

    adoRS.Open("SELECT * FROM Person ORDER BY Person_ID", adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {
                sonuc.push({ "ID": adoRS.fields('Person_ID').value, "Name": adoRS.fields('Person_Name').value, "SurName": adoRS.fields('Person_SurName').value, "GroupID": adoRS.fields('Person_GroupID').value, "Picture": adoRS.fields('Person_Pic').value });
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var WorkGrTasks = function (workgrid) {
    var sonuc = [];

    adoRS.Open("SELECT Tasks.Task_ID, [Task-Properties].Task_Name, [Task-Properties].Task_Class, Tasks.Task_Desc, Tasks.Task_Group, TaskSubPeriods.ID, TaskSubPeriods.TBegin, TaskSubPeriods.TEnd,TaskSubPeriods.SubDesc FROM (TaskSubPeriods INNER JOIN Tasks ON TaskSubPeriods.Task_ID = Tasks.Task_ID) LEFT JOIN [Task-Properties] ON TaskSubPeriods.TaskType_ID = [Task-Properties].ID WHERE (((Tasks.Task_Group)="+workgrid+"))", adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {

                var startdate = new Date(adoRS.fields('TBegin').value);
                var enddate = new Date(adoRS.fields('TEnd').value);
                sonuc.push({ "SubID": adoRS.fields('ID').value, "TaskID": adoRS.fields('Task_ID').value, "TaskName": adoRS.fields('Task_Name').value, "TaskClass": adoRS.fields('Task_Class').value, "TaskDesc": adoRS.fields('Task_Desc').value, "TaskBegin": startdate, "TaskEnd": enddate, "TaskSubDesc": adoRS.fields('SubDesc').value });

                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var PersonTasks = function (personid) {
    var sonuc = [];

    adoRS.Open("SELECT TaskToPerson.PersonID, TaskToPerson.TaskSubID, Tasks.Task_ID, [Task-Properties].Task_Name, [Task-Properties].Task_Class, Tasks.Task_Desc, Tasks.Task_Group, TaskSubPeriods.TBegin,TaskSubPeriods.TEnd, TaskSubPeriods.SubDesc FROM ((TaskToPerson LEFT JOIN Tasks ON TaskToPerson.TaskID = Tasks.Task_ID) LEFT JOIN TaskSubPeriods ON TaskToPerson.TaskSubID = TaskSubPeriods.ID) LEFT JOIN [Task-Properties] ON TaskSubPeriods.TaskType_ID = [Task-Properties].ID WHERE (((TaskToPerson.PersonID)='"+personid+"'))", adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {

                var startdate = new Date(adoRS.fields('TBegin').value);
                var enddate = new Date(adoRS.fields('TEnd').value);
                sonuc.push({ "PersonID": adoRS.fields('PersonID').value, "SubID": adoRS.fields('TaskSubID').value, "TaskID": adoRS.fields('Task_ID').value, "TaskName": adoRS.fields('Task_Name').value, "TaskClass": adoRS.fields('Task_Class').value, "TaskDesc": adoRS.fields('Task_Desc').value, "TaskBegin": startdate, "TaskEnd": enddate, "TaskSubDesc": adoRS.fields('SubDesc').value });

                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var TaskPersons = function (tasksubid) {

    var sonuc = [];

    adoRS.Open("SELECT TaskToPerson.ID, TaskToPerson.TaskSubID, TaskToPerson.TaskID, Person.Person_ID, Person.Person_Name, Person.Person_SurName FROM TaskToPerson LEFT JOIN Person ON TaskToPerson.PersonID = Person.Person_ID WHERE (((TaskToPerson.TaskSubID)=" + tasksubid + "))", adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {

                sonuc.push({ "TTPID": adoRS.fields('ID').value, "PersonID": adoRS.fields('Person_ID').value, "Name": adoRS.fields('Person_Name').value, "SurName": adoRS.fields('Person_SurName').value });

                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }

    adoRS.close();
    return sonuc;
}

var TaskGroup = function (ID) {

    var sonuc = [];

    adoRS.Open("SELECT * FROM [Task-Groups] WHERE Group_ID=" + ID, adoConn, 1, 3);
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            while (!adoRS.eof) {

                sonuc.push({ "ID": adoRS.fields('Group_ID').value, "Group": adoRS.fields('Group').value, "Group_Long": adoRS.fields('Group_Long').value });
                
                adoRS.MoveNext;
            }

        }

    }
    catch (err) {
        sonuc = [];
    }
    adoRS.close();
    return sonuc;
}

function UpdateTask(TaskID, TDesc, Task_Group) {
    adoRS.Open("UPDATE Tasks SET Tasks.Task_Desc = '" + TDesc + "', Tasks.Task_Group = " + Task_Group + ", Tasks.Updated_When = Now() WHERE (((Tasks.Task_ID)='" + TaskID + "'))", adoConn);
}

function AddSubToTask(TaskID,TType,TBegin,TEnd,SubDesc) {
    adoRS.Open("INSERT INTO [TaskSubPeriods] (Task_ID,TaskType_ID,TBegin,TEnd,SubDesc,Updated_When) VALUES ('" + TaskID + "','" + TType + "','" + TBegin + "', '" + TEnd + "', '" + SubDesc + "', NOW())", adoConn);
}

function UpdateSubToTask(SubID,TaskID,TType, TBegin, TEnd, SubDesc) {
    adoRS.Open("UPDATE TaskSubPeriods SET TaskSubPeriods.Task_ID = '" + TaskID + "',TaskSubPeriods.TaskType_ID = '" + TType + "', TaskSubPeriods.TBegin = '" + TBegin + "', TaskSubPeriods.TEnd = '" + TEnd + "', TaskSubPeriods.SubDesc = '" + SubDesc + "',Updated_When=NOW() WHERE (((TaskSubPeriods.ID)=" + SubID + "))", adoConn);
}

function AddTask(TaskID,WorkgroupID,TaskDesc) {

    adoRS.Open("INSERT INTO Tasks (Task_ID,Task_Desc,Task_Group,Updated_When) VALUES ('" + TaskID + "','" + TaskDesc + "'," + WorkgroupID + ",NOW())", adoConn);
}

function AddPersonToTask(TaskID,SubID,PersonID) {

    adoRS.Open("INSERT INTO TaskToPerson (TaskID,TaskSubID,PersonID,Updated_When) VALUES ('" + TaskID + "'," + SubID + ", '" + PersonID + "',NOW())", adoConn);
}

function RemoveAllPersonFrSubTask(SubID) {
    adoRS.Open("DELETE * FROM TaskToPerson WHERE TaskSubID=" + SubID, adoConn);
}

function RemoveAllPersonFrTask(TaskID) {
    adoRS.Open("DELETE * FROM TaskToPerson WHERE TaskID='" + TaskID + "'", adoConn);
}

function RemovePersonFrTask(ID) {
    adoRS.Open("DELETE * FROM TaskToPerson WHERE ID=" + ID, adoConn);
}

function RemoveAllSubFrTask(TaskID) {
    adoRS.Open("DELETE * FROM TaskSubPeriods WHERE Task_ID='" + TaskID + "'", adoConn);
}

function RemoveSubFrTask(SubID) {
    adoRS.Open("DELETE * FROM TaskSubPeriods WHERE ID=" + SubID, adoConn);
}

function RemoveTask(ID) {
    adoRS.Open("DELETE * FROM Tasks WHERE Task_ID='" + ID + "'", adoConn);
}

function CreateClass() {
    adoRS.Open("SELECT * FROM CalendarClass", adoConn, 1, 3);
    
    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            
            var style = '<style>';
            while (!adoRS.eof) {


                style = style + "." + adoRS.fields('ClassName').value + "Header {background-color:" + adoRS.fields('bgHeader').value + ";color:" + adoRS.fields('colorText').value + ";font-weight:" + adoRS.fields('fontWeight').value + "} ";
                style = style + "." + adoRS.fields('ClassName').value + " {background-color:" + adoRS.fields('bg').value + ";color:" + adoRS.fields('colorText').value + ";font-weight:" + adoRS.fields('fontWeight').value + "} ";
                style = style + "." + adoRS.fields('ClassName').value + "ODD {background-color:" + adoRS.fields('bgODD').value + ";color:" + adoRS.fields('colorText').value + ";font-weight:" + adoRS.fields('fontWeight').value + "} ";
                style = style + "." + adoRS.fields('ClassName').value + ":Hover,." + adoRS.fields('ClassName').value + "ODD:Hover {background-color:" + adoRS.fields('bgHover').value + "} ";
                adoRS.MoveNext;
            }
            style = style + '</style>';
            $('html > head').append(style);
        }

    }
    catch (err) {
    }

    adoRS.close();

}

function CreateSelectOptions(AppendItem, Table, ValCol, TextCol,ClassCol,selectone) {
    
    adoRS.Open("SELECT * FROM "+Table, adoConn, 1, 3);

    try {
        adoRS.MoveFirst();
        RowCount = adoRS.RecordCount;
        if (!adoRS.BOF || !adoRS.EOF) {
            var i = 0;
            while (!adoRS.eof) {
                var myOption = document.createElement("option");
                myOption.text = adoRS.fields(TextCol).value;
                myOption.value = adoRS.fields(ValCol).value;
                if (ClassCol != "") {
                    myOption.setAttribute("class", adoRS.fields(ClassCol).value);
                }
                if (i == 0 && selectone) {
                    myOption.setAttribute("selected", true);
                }
                AppendItem.add(myOption);
                adoRS.MoveNext;
                i++;
            }
        }

    }
    catch (err) {
    }
    adoRS.close();     
}
