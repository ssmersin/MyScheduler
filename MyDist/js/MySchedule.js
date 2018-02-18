
/********* BEGİN Of Locale Part *********/
var i18n = {
    allowed: ['en','tr']
    };

/**------ END Of Locale Part -----**/

    $(document).ready(function () {
        
        $.fn.MySchedule = function (options) {

            var $scheduler = $(this);
            /********* Settings initialization *********/
            options = options || {};

            var settings = $.extend({
                date: {
                    current: moment(),
                    selected: (options.defaultDate && moment(options.defaultDate).isValid() ? moment(options.defaultDate) : moment())
                },
                imagefoldername: options.imagefoldername,
                UserGroups: UserGroups() || [],
                WorkGroups: WorkGroups() || [],
                WeekendColor: options.WeekendColor,
                NowColor: options.NowColor,
                ShowGroups: options.ShowGroups,
                FirstColumnWidth: options.FirstColumnWidth,
                DefaultTType: '',
                showInfoBox: options.showInfoBox,
                SelectedColor: options.SelectedColor,
                currentDisplay: (options.defaultDisplay && 'days;weeks;months;years'.indexOf(options.defaultDisplay) != -1 ? options.defaultDisplay : 'months'),
                currentCalType: (options.defaultCalType && 'person;task'.indexOf(options.defaultCalType) != -1 ? options.defaultCalType : 'person'),
                locale: (options.locale && i18n.allowed.indexOf(options.locale) != -1 ? options.locale : i18n.allowed[0]) //if no locale is defined, it takes the first allowed one
            }, options);
            moment.locale(settings.locale, {
                week: { dow: 1} // Monday is the first day of the week
            });
            settings.i18n = (i18n.allowed.indexOf(settings.locale) == -1 ? i18n.en : i18n[settings.locale]);
            /**------ END Of Settings initialization -----**/


            /********* Begin CODE PART *********/



            /********* Create All MENU Items - Only For Localize *********/
            function CreateMenu() {
                /********* DivUpperContainor DIV *********/
                var DivUpperContainor = document.createElement('div');
                DivUpperContainor.id = 'DivUpperContainor';
                $(DivUpperContainor).addClass('DivParts')
                .prependTo($scheduler);
                /**------ DivUpperContainor DIV -----**/

                /********* DivMenuContainer DIV *********/
                var DivSelectLocaleView = document.createElement('div');
                $(DivSelectLocaleView).addClass('DivMenuItemGroup')
                .appendTo(DivUpperContainor);

                var BtnSetting = document.createElement('button');
                BtnSetting.id = 'BtnSetting';
                $(BtnSetting).addClass('btn btn-info glyphicon glyphicon-menu-hamburger')
                             .attr("data-toggle", "modal")
                             .attr("data-target", "#RightPanelDiv")
                            .appendTo(DivSelectLocaleView);

                var BtnFilters = document.createElement('button');
                BtnFilters.id = 'BtnFilters';
                $(BtnFilters).addClass('btn btn-info glyphicon glyphicon-filter')
                             .attr("data-toggle", "modal")
                             .attr("data-target", "#FilterPanelDiv")
                            .appendTo(DivSelectLocaleView);

                var DivMenuContainer = document.createElement('div');
                DivMenuContainer.id = 'DivMenuContainer';
                $(DivMenuContainer).addClass('DivMenuContainer')
                .html('')
                .appendTo(DivUpperContainor);

                /********* DivDatePickerandTitle DIV *********/

                var NewTimesDiv = document.createElement('div');
                DivMenuContainer.appendChild(NewTimesDiv);
                /////////// TaskSub Begin ////////////////
                var NewTimesBeginDiv = document.createElement('div');
                NewTimesBeginDiv.id = "NewTimesBeginDiv";
                $(NewTimesBeginDiv).addClass('input-group date col-md-2');
                NewTimesDiv.appendChild(NewTimesBeginDiv);

                var NewHiddenTBegin = document.createElement('input');
                NewHiddenTBegin.id = "NewHiddenTBegin";
                NewHiddenTBegin.classList.add('form-control');
                $(NewHiddenTBegin).attr('type', 'text');
                NewTimesBeginDiv.appendChild(NewHiddenTBegin);

                var NewSpanTBegin = document.createElement('span');
                NewSpanTBegin.classList.add('input-group-addon');
                $(NewSpanTBegin).html('<span class="glyphicon glyphicon-calendar"></span>');
                NewTimesBeginDiv.appendChild(NewSpanTBegin);


                //////// TIME PİCKER SETTINGS //////////////
                $(NewTimesBeginDiv).datetimepicker({
                    locale: settings.locale,
                    format: 'DD.MM.YYYY HH:mm',
                    showTodayButton: true,
                    toolbarPlacement: "bottom",
                    collapse: true,
                    showClose: true,
                    keepOpen: false,
                    allowInputToggle: true,
                    date: Date(),
                    defaultDate: moment(Date()).hours(0).minutes(0).seconds(0).milliseconds(0)
                });

                $(NewTimesBeginDiv).on("dp.change", function (e) {
                    settings.date.selected = e.date.valueOf()
                    settings.date.current = e.date.valueOf()
                    $(DivCalendar).remove();
                    CreateCalendar(settings.date.current);
                });
                /**------ DivDatePickerandTitle DIV -----**/
                /********* DivDATEPICKER NAV GROUP DIV *********/
                var DivCalViewGroup = document.createElement('div');
                $(DivCalViewGroup).addClass('DivMenuItemGroup')
                .appendTo(DivMenuContainer);

                var DivPrev = document.createElement('div');
                $(DivPrev).addClass('DivMenuItem')
                .appendTo(DivCalViewGroup);

                var BtnPrew = document.createElement('button');
                BtnPrew.id = 'BtnPrew';
                $(BtnPrew).addClass('btn glyphicon glyphicon-backward')
                            .on('click', function () {
                                settings.date.current = moment(settings.date.current).add(-1, settings.currentDisplay);
                                $(DivCalendar).remove();
                                CreateCalendar(settings.date.current);
                            })
                            .appendTo(DivPrev);



                var DivSelectView = document.createElement('div');
                $(DivSelectView).addClass('DivMenuItem')
                .appendTo(DivCalViewGroup);

                var selectList = document.createElement("select");
                selectList.setAttribute("id", "mySelect");
                //Create and append the options
                $(selectList).append('<option value="days">' + settings.i18n.DateCalendarView + '</option>');
                $(selectList).append('<option value="weeks">' + settings.i18n.WeekCalendarView + '</option>');
                $(selectList).append('<option value="months">' + settings.i18n.MonthCalendarView + '</option>');
                $(selectList).append('<option value="years">' + settings.i18n.YearCalendarView + '</option>');
                $(selectList).addClass('form-control')

                DivSelectView.appendChild(selectList);

                $(selectList).selectpicker('val', settings.defaultDisplay)
                .on('change', function () {
                    settings.currentDisplay = this.value;
                    $(DivCalendar).remove();
                    CreateCalendar(settings.date.current);
                    
                });


                var DivNext = document.createElement('div');
                $(DivNext).addClass('DivMenuItem')
                .appendTo(DivCalViewGroup);

                var BtnNext = document.createElement('button');
                BtnNext.id = 'BtnNext';
                $(BtnNext).addClass('btn glyphicon glyphicon-forward')
                            .on('click', function () {
                                settings.date.current = moment(settings.date.current).add(1, settings.currentDisplay);
                                $(DivCalendar).remove();
                                CreateCalendar(settings.date.current);
                            })
                            .appendTo(DivNext);

                /**------ DivDATEPICKER NAV GROUP DIV -----**/

                /********* DivCALENDARTYPE DIV *********/


                var DivSelectCalTypeView = document.createElement('div');
                $(DivSelectCalTypeView).addClass('DivMenuItem')
                .appendTo(DivMenuContainer);

                var selectCalTypeList = document.createElement("select");
                selectCalTypeList.setAttribute("id", "myCalTypeSelect");
                //Create and append the options
                $(selectCalTypeList).append('<option value="person">' + settings.i18n.CalTypePerson + '</option>');
                $(selectCalTypeList).append('<option value="task">' + settings.i18n.CalTypeTask + '</option>');
                $(selectCalTypeList).addClass('form-control');
                DivSelectCalTypeView.appendChild(selectCalTypeList);
                $(selectCalTypeList).selectpicker('val', settings.currentCalType)
                                                .on('change', function () {
                                                    settings.currentCalType = this.value;
                                                    $(DivCalendar).remove();
                                                    CreateCalendar(settings.date.current);
                                                })
                /**------ DivCALENDARTYPE DIV -----**/


                /**------ DivMenuContainer DIV -----**/

            }
            /**------ End Of Function Create All MENU Items - Only For Localize -----**/

            CreateMenu();

            /********* DivCalendarContainor DIV *********/
            var DivCalendarContainor = document.createElement('div');
            DivCalendarContainor.id = 'DivCalendarContainor';
            $(DivCalendarContainor).addClass('DivParts')
                .appendTo($scheduler);
            /**------ DivCalendarContainor DIV -----**/

            /********* DivCalendarTable Containor *********/


            var DivCalendarTableContainor = document.createElement('div');
            DivCalendarTableContainor.id = 'DivCalendarTableContainor';
            $(DivCalendarTableContainor).addClass('DivMenuContainer table-responsive')
                .appendTo(DivCalendarContainor);

            var DivDateTitle = document.createElement('div');
            DivDateTitle.id = 'calendar-title';
            $(DivDateTitle).addClass('DivDateTitle')
                .html(moment(settings.date.selected).locale(settings.locale).format('MMMM YYYY')) /////////////////////////
                .appendTo(DivCalendarTableContainor);
            /**------ DivCalendarTable Containor -----**/

            function CreateCalendar(CalendarDay) {
                $('.DivLine').remove(); // REMOVES ALL TASK LINES CREATED BEFORE
                CalendarDay = moment(CalendarDay).locale(settings.locale);
                
                // Table Structure Info
                var ColumnsNumber = 0;
                var ColumnsTitleFormat = '';
                var ColumnsInterval = '';
                var FirstColumnValue = '';
                var CalendarTitleFormat = '';
                var WeekendColor = false;
                var NowColor = false;
                var SelectedColor = false;
                var SpecialDayColor = false;
                var NowColumnNumber = 1000;
                var SelectedColumnNumber = 1000;
                var WeekendColumnNumber = [];
                var ColumnClassArray = [];
                var SelectedDay = settings.date.selected;
                CreateClass();
                switch (settings.currentDisplay) {
                    case 'days':
                        ColumnsNumber = 24;
                        ColumnsTitleFormat = 'HH:mm';
                        ColumnsInterval = 'hours';
                        FirstColumnValue = moment(CalendarDay).startOf('date');
                        CalendarTitleFormat = 'DD MMMM YYYY dddd';
                        WeekendColor = false;
                        NowColor = settings.NowColor;
                        SelectedColor = true;
                        SpecialDayColor = false;
                        break;

                    case 'weeks':
                        ColumnsNumber = 7;
                        ColumnsTitleFormat = 'DD dddd';
                        ColumnsInterval = 'days';
                        FirstColumnValue = moment(CalendarDay).isoWeekday(1).startOf('date');
                        CalendarTitleFormat = 'MMMM YYYY';
                        WeekendColor = settings.WeekendColor;
                        NowColor = settings.NowColor;
                        SelectedColor = settings.SelectedColor;
                        SpecialDayColor = settings.SpecialDayColor;
                        break;

                    case 'months':
                        ColumnsNumber = moment(CalendarDay).daysInMonth();
                        ColumnsTitleFormat = 'DD';
                        ColumnsInterval = 'days';
                        FirstColumnValue = moment(CalendarDay).startOf('month').startOf('date');
                        CalendarTitleFormat = 'MMMM YYYY';
                        WeekendColor = settings.WeekendColor;
                        NowColor = settings.NowColor;
                        SelectedColor = settings.SelectedColor;
                        SpecialDayColor = settings.SpecialDayColor;
                        break;
                    case 'years':
                        ColumnsNumber = 12;
                        ColumnsTitleFormat = 'MMMM';
                        ColumnsInterval = 'months';
                        FirstColumnValue = moment(CalendarDay).startOf('year').startOf('date');
                        CalendarTitleFormat = 'YYYY';
                        WeekendColor = false;
                        NowColor = false;
                        SelectedColor = settings.SelectedColor;
                        SpecialDayColor = false;
                        break;
                }

                $(DivDateTitle).html(moment(FirstColumnValue).locale(settings.locale).format(CalendarTitleFormat))
                var DivCalendar = document.createElement('div');
                DivCalendar.id = 'DivCalendar';
                $(DivCalendar).addClass('DivCalendar input-group date')
                .appendTo(DivCalendarTableContainor);

                // creates a <table> element
                var CalendarTable = document.createElement("table");
                CalendarTable.id = 'CalendarTable';

                // creates TABLE Header
                var tblHead = document.createElement("thead");
                var hrow = document.createElement("tr");

                var hcell1 = document.createElement("th");
                if (settings.currentCalType == 'task') { var hcell1Text = document.createTextNode(settings.i18n.CalFirstColHeader[0].task); }
                if (settings.currentCalType == 'person') { var hcell1Text = document.createTextNode(settings.i18n.CalFirstColHeader[0].person); }
                hcell1.width = settings.FirstColumnWidth + "px";
                hcell1.appendChild(hcell1Text);
                hrow.appendChild(hcell1);
                $(hcell1).addClass("defaultHeader");
                $(hcell1).addClass("Calendartd");
                ColumnClassArray[0] = "default";

                if (settings.currentCalType == 'person') {
                    var hcell2 = document.createElement("th");
                    var hcell2Text = document.createTextNode(settings.i18n.personJobTitle);
                    hcell2.appendChild(hcell2Text);
                    hrow.appendChild(hcell2);
                    $(hcell2).addClass("defaultHeader");
                    $(hcell2).addClass("Calendartd");
                    ColumnClassArray[1] = "default";
                }

                for (var j = 0; j < ColumnsNumber; j++) {
                    // Create a <td> element and a text node, make the text
                    // node the contents of the <td>, and put the <td> at
                    // the end of the table row
                    var hcell = document.createElement("th");
                    hcell.id = 'Header' + j;
                    $(hcell).addClass("Month");
                    var xday = moment(FirstColumnValue).add(j, ColumnsInterval);

                    var hcellText = document.createTextNode(moment(xday).locale(settings.locale).format(ColumnsTitleFormat));

                    if (SelectedColor && moment(xday).isSame(SelectedDay, ColumnsInterval)) {
                        $(hcell).addClass("selectedHeader");
                        ColumnClassArray[j + 2] = "selected";
                        SelectedColumnNumber = j + 2;
                    }
                    else {
                        if (NowColor && moment(xday).isSame(Date.now(), ColumnsInterval)) {
                            $(hcell).addClass("nowHeader");
                            ColumnClassArray[j + 2] = "now";
                            NowColumnNumber = j + 2
                        }
                        else {

                            if (SpecialDayColor && GetSpecialDateClass(xday).length > 0) {
                                classname = GetSpecialDateClass(xday)[0]['Class'];
                                $(hcell).addClass(classname + "Header");
                                ColumnClassArray[j + 2] = classname;

                            }
                            else {
                                if (WeekendColor && (moment(xday).isoWeekday() == 6 || moment(xday).isoWeekday() == 7)) {
                                    $(hcell).addClass("weekendHeader");
                                    ColumnClassArray[j + 2] = "weekend";
                                    WeekendColumnNumber.push(j + 2);
                                }
                                else {
                                    $(hcell).addClass("defaultHeader");
                                    ColumnClassArray[j + 2] = "default";
                                }
                            }
                        }
                    }
                    hcell.appendChild(hcellText);
                    hrow.appendChild(hcell);
                }
                //*---- End Of Week Calendar Header----*//


                tblHead.appendChild(hrow);
                CalendarTable.appendChild(tblHead);
 
                DivCalendar.appendChild(CalendarTable);

                // sets the border attribute of tbl to 2;
                CalendarTable.setAttribute("border", "2");
                CalendarTable.setAttribute("class", "table TableCalendarTable");

                //Find ans set column width for columns after first

                var eqwidth = ($(CalendarTable).width() - ($(CalendarTable).find("th:first").outerWidth() + $(CalendarTable).find("th:nth-child(2)").outerWidth())) / ColumnsNumber;

                $('th.Month').each(function (index) {
                    $($(this)).css("width", eqwidth + "px");
                });

                function daysInMonth(month, year) {
                    return new Date(year, month, 0).getDate();
                }

                if (settings.currentDisplay == "years") {
                    var lastday = moment(FirstColumnValue).add(1, 'years');
                    var xdiff = lastday.diff(FirstColumnValue, 'days')
                    var basewidth = ($(CalendarTable).width() - ($(CalendarTable).find("th:first").outerWidth() + $(CalendarTable).find("th:nth-child(2)").outerWidth())) / xdiff;
                    $('th.Month').each(function (index) {
                        var newwidth = Math.round(basewidth * daysInMonth(index + 1, FirstColumnValue.get('year')));
                        $($(this)).css("width", newwidth + "px");
                    });
                }
                
                if (settings.currentCalType == 'person') {
                    CreateCalendarPersonLines(ColumnsNumber, CalendarTable, ColumnClassArray);
                    CreatePersonLines(CalendarTable, ColumnsNumber, eqwidth, FirstColumnValue, ColumnsInterval);
                }
                if (settings.currentCalType == 'task') {

                    CreateCalendarTaskLines(ColumnsNumber, CalendarTable, ColumnClassArray);
                    CreateTaskLines(CalendarTable, ColumnsNumber, eqwidth, FirstColumnValue, ColumnsInterval);
                }

            }
            CreateCalendar(settings.date.selected);



            function CreateCalendarPersonLines(ColumnsNumber, CalendarTable, ColumnClassArray) {

                

                if (settings.ShowGroups) {
                    //CREATE LINES WITH GROUPS
                    
                    var grouplist;
                    var values = $("input[name='type']:checked").map(function () {
                            return $(this).val();
                    }).get();
                    if (values.length > 0) {
                            grouplist = settings.UserGroups.filter(function (item) {
                                index = $.inArray(item.ID.toString(), values);
                            return index >= 0
                        });
                    }
                    else { grouplist = settings.UserGroups; }
                    

                    grouplist.forEach(function (group) {
                        // GROUP HEADER LINE
                        var tblBodyGr = document.createElement("tbody");
                        tblBodyGr.id = 'tblBodyGr-' + group.Name;
                        var rowGr = document.createElement("tr");
                        rowGr.setAttribute("class", "GroupHeaderLine");
                        rowGr.setAttribute("style", "line-height: 5px;");
                        rowGr.setAttribute("data-toggle", "collapse");
                        rowGr.setAttribute("data-target", "#group-" + group.Name);
                        rowGr.setAttribute("aria-expanded", "false");
                        rowGr.setAttribute("aria-controls", "group-" + group.Name);

                        var cellGr = document.createElement("td");
                        cellGr.setAttribute("colspan", ColumnsNumber + 2);
                        var cellGrText = document.createTextNode(group.LName);
                        cellGr.appendChild(cellGrText);
                        rowGr.appendChild(cellGr);

                        tblBodyGr.appendChild(rowGr);
                        $(rowGr).click(function () {
                            $('.Group' + group.ID).slideToggle(500, "linear",
                            function () {
                                var usergroups = UserGroups();
                                usergroups.forEach(function (groupx) {
                                    var usersx = UsersInGroup(groupx.ID)
                                    usersx.forEach(function (userx) {
                                        var TopStartPos = $("td[data-personID='" + userx.ID + "']").offset().top;
                                        if (TopStartPos != 0) {
                                            $("div[data-personID='" + userx.ID + "']").each(function (i, obj) {
                                                var xdiff = Number($(obj).attr("data-DivTopDiff"));
                                                $(obj).offset({ top: TopStartPos + xdiff });
                                            });
                                        }
                                    })
                                });
                            }
                            )
                        });


                        CalendarTable.appendChild(tblBodyGr);
                        // ---- END OF GROUP HEADER LINE

                        // GROUP USERS LINE
                        var tblBody = document.createElement("tbody");
                        tblBody.id = "group-" + group.Name;
                        tblBody.setAttribute('class', 'collapse in');

                        var Users = UsersInGroup(group.ID);
                        var i = 0;
                        Users.forEach(function (user) {

                            var row = document.createElement("tr");
                            for (var j = 0; j < ColumnsNumber + 2; j++) {

                                //Get cell position
                                var cell = document.createElement("td");

                                cellText = document.createTextNode('');
                                if (j == 0) {
                                    $(cell).attr("data-personID", user.ID);
                                    cellText = document.createTextNode(user.Name.substring(0, 1) + "." + user.SurName);
                                    cell.setAttribute("style", "cursor: pointer;");
                                    $(cell).attr("data-toggle", "modal")
                                    .attr("data-target", "#RightPersonInfoPanelDiv");
                                    cell.onclick = function () { CreateRightMenuPersonInfo(user.ID) }; //ONCLICK PERSON NAME PERSON INFO PANEL WILL BE VISIBLE
                                }

                                if (j == 1) {
                                    $(cell).attr("data-personID", user.ID);
                                    cellText = document.createTextNode(group.Name);
                                    cell.setAttribute("style", "cursor: pointer;");
                                    $(cell).attr("data-toggle", "modal")
                                    .attr("data-target", "#RightPersonInfoPanelDiv");
                                    cell.onclick = function () { CreateRightMenuPersonInfo(user.ID) }; //ONCLICK PERSON NAME PERSON INFO PANEL WILL BE VISIBLE
                                }

                                cell.appendChild(cellText);
                                row.appendChild(cell)
                                if (i % 2 == 0) {
                                    cell.setAttribute("class", ColumnClassArray[j]);
                                }
                                else {
                                    cell.setAttribute("class", ColumnClassArray[j] + "ODD");
                                }
                            }
                            tblBody.appendChild(row);



                            i++;

                            CalendarTable.appendChild(tblBody);
                        });
                        // ---- END OF GROUP USERS LINE

                    });
                    //-----CREATE LINES WITHOUT GROUPS
                }
                else {
                    // ALL USERS LINE
                    var tblBody = document.createElement("tbody");
                    tblBody.id = "All";

                    var Users = AllUsers();

                    var grouplist;
                    var values = $("input[name='type']:checked").map(function () {
                        return $(this).val();
                    }).get();
                    if (values.length > 0) {
                        grouplist = Users.filter(function (item) {
                            index = $.inArray(item.GroupID.toString(), values);
                            return index >= 0
                        });
                    }
                    else { grouplist = Users; }

                    var i = 0;
                    grouplist.forEach(function (user) {

                        var row = document.createElement("tr");
                        for (var j = 0; j < ColumnsNumber + 2; j++) {

                            //Get cell position
                            var cell = document.createElement("td");
                            cellText = document.createTextNode('');
                            if (j == 0) {
                                $(cell).attr("data-personID", user.ID);
                                $(cell).addClass("Calendartd");
                                cellText = document.createTextNode(user.Name.substring(0, 1) + "." + user.SurName);
                                cell.setAttribute("style", "cursor: pointer;");
                                $(cell).attr("data-toggle", "modal")
                                    .attr("data-target", "#RightPersonInfoPanelDiv");
                                cell.onclick = function () { CreateRightMenuPersonInfo(user.ID) }; //ONCLICK PERSON NAME PERSON INFO PANEL WILL BE VISIBLE
                            }

                            if (j == 1) {
                                $(cell).attr("data-personID", user.ID);
                                $(cell).addClass("Calendartd");
                                var usergroup = PersonGroupInfo(user.GroupID);

                                cellText = document.createTextNode(usergroup[0].Group);
                                cell.setAttribute("style", "cursor: pointer;");
                                $(cell).attr("data-toggle", "modal")
                                    .attr("data-target", "#RightPersonInfoPanelDiv");
                                cell.onclick = function () { CreateRightMenuPersonInfo(user.ID) }; //ONCLICK PERSON NAME PERSON INFO PANEL WILL BE VISIBLE
                            }

                            cell.appendChild(cellText);

                            row.appendChild(cell)

                            if (i % 2 == 0) {
                                $(cell).addClass(ColumnClassArray[j]);
                            }
                            else {
                                $(cell).addClass(ColumnClassArray[j] + "ODD");
                            }

                        }

                        i++;
                        tblBody.appendChild(row);
                        CalendarTable.appendChild(tblBody);
                    });
                    // ---- END OF ALL USERS LINE
                }

            }

            //////////////////////////////////////////////TASK LINES///////////////////////////////////////////////////
            function CreateCalendarTaskLines(ColumnsNumber, CalendarTable, ColumnClassArray) {

                // TASK LINEs
                var tblBody = document.createElement("tbody");
                tblBody.id = "All";

                var WorkGroups = settings.WorkGroups;
                var i = 0;
                WorkGroups.forEach(function (workgr) {

                    var row = document.createElement("tr");
                    for (var j = 0; j < ColumnsNumber+1; j++) {

                        //Get cell position
                        var cell = document.createElement("td");
                        cellText = document.createTextNode('');
                        if (j == 0) {

                            $(cell).attr("data-WorkgroupID", workgr.ID);
                            $(cell).addClass("Calendartd");
                            cellText = document.createTextNode(workgr.Name);
                            cell.setAttribute("style", "cursor: pointer;");
                            $(cell).attr("data-toggle", "modal")
                                    .attr("data-target", "#RightWorkInfoPanelDiv");
                            cell.onclick = function () { CreateRightMenuWorkgroupInfo(workgr.ID) }; //ONCLICK WORKGROUP NAME WORKGROUP INFO PANEL WILL BE VISIBLE
                        }

                        cell.appendChild(cellText);

                        row.appendChild(cell)

                        if (i % 2 == 0) {
                            $(cell).addClass(ColumnClassArray[j+1]);
                        }
                        else {
                            $(cell).addClass(ColumnClassArray[j+1] + "ODD");
                        }

                    }

                    i++;
                    tblBody.appendChild(row);
                    CalendarTable.appendChild(tblBody);
                });
                // ---- END OF ALL TASKS LINE
            }

            ////////////////////////////////////////////TASK LINES END ///////////////////////////////////////////////
            ///CREATE RIGHTMENU - SETTINGS
            function CreateRightMenu() {
                var PanelDiv = document.createElement('div');
                PanelDiv.id = 'RightPanelDiv';
                $(PanelDiv).addClass('modal fade right')
                            .attr("tabindex", "-1")
                            .attr("role", "dialog")
                            .appendTo($('body'));

                var PanelDocument = document.createElement('div');
                PanelDocument.id = 'PanelDocument';
                $(PanelDocument).addClass('modal-dialog modal-sm')
                                .attr("role", "document")
                                .appendTo(PanelDiv);

                var modalcontent = document.createElement('div');
                modalcontent.id = 'PanelDocument';
                $(modalcontent).addClass('modal-content')
                                .appendTo(PanelDocument);

                var modalHeader = document.createElement('div');
                modalHeader.id = 'PanelDocument';
                $(modalHeader).addClass('modal-header')
                                .appendTo(modalcontent);

                var BtnClose = document.createElement('button');
                BtnClose.id = 'BtnClose';
                $(BtnClose).addClass('glyphicon glyphicon-remove close')
                    .html('')
                    .attr("style", "opacity:1!important")
                    .attr("style", "color:red!important")
                    .attr("data-dismiss", "modal")
                    .attr("data-target", PanelDocument)
                    .appendTo(modalHeader);

                var HeaderH4 = document.createElement('h3');
                $(HeaderH4).addClass('modal-title text-primary')
                    .html(settings.i18n.settingsTitle)
                    .appendTo(modalHeader);

                var modalBody = document.createElement('div');
                modalBody.id = 'PanelBody';
                $(modalBody).addClass('modal-body')
                            .appendTo(modalcontent);
                /***************** SELECT LANGUAGE *****************/

                var LocaleDiv = document.createElement('div');
                $(LocaleDiv).addClass('form-group')
                            .appendTo(modalBody);

                var TitleLocaleList = document.createElement('h5');
                $(TitleLocaleList).html(settings.i18n.SelectLanguageTitle + " : ")
                                    .attr("style", "text-align: right;")
                                  .appendTo(LocaleDiv);

                var selectLocaleList = document.createElement("select");
                selectLocaleList.setAttribute("id", "myLocaleSelect");
                selectLocaleList.setAttribute("class", "form-control ");
                //Create and append the options
                $(selectLocaleList).append('<option value="tr">Türkçe</option>');
                $(selectLocaleList).append('<option value="en">English</option>');
                TitleLocaleList.appendChild(selectLocaleList);
                $(selectLocaleList).attr("data-width", "50%")
                                   .selectpicker('val', settings.locale)
                                   .on('change', function () {
                                       $(DivUpperContainor).remove();
                                       settings.locale = this.value;
                                       settings.i18n = (i18n.allowed.indexOf(settings.locale) == -1 ? i18n.en : i18n[settings.locale]);
                                       CreateMenu();
                                       $(DivDateTitle).html(moment(settings.date.selected).locale(settings.locale).format('MMMM YYYY'));
                                       $(DivCalendar).remove();
                                       CreateCalendar(settings.date.current);
                                   });
                /**--------------- SELECT LANGUAGE -------------**/
                /************ CHECKBOX SHOW GROUPS ***************/
                var DivCheckShowGroups = document.createElement('div');
                $(DivCheckShowGroups).addClass('form-group')
                .appendTo(modalBody);

                var TitleShowGroups = document.createElement('h5');
                $(TitleShowGroups).html(settings.i18n.showGroupsTitle + " : ")
                                  .attr("style", "text-align: right;")
                                  .appendTo(DivCheckShowGroups);

                var input = document.createElement('input');
                $(input).attr("type", "checkbox").appendTo(TitleShowGroups);
                $(input).attr("data-toggle", "toggle")
                $(input).attr("data-width", "50%")
                $(input).attr("checked", settings.ShowGroups)
                .bootstrapToggle({
                    on: settings.i18n.on,
                    off: settings.i18n.off
                })
                .change(function () {
                    if ($(this).prop('checked'))
                    { settings.ShowGroups = true; } else { settings.ShowGroups = false; }
                    $(DivCalendar).remove();
                    CreateCalendar(settings.date.current);
                });
                /**------ CHECKBOX SHOW GROUPS -----**/

                /************ CHECKBOX SHOW INFOBOX ***************/
                var DivCheckShowLineInfo = document.createElement('div');
                $(DivCheckShowLineInfo).addClass('form-group')
                .appendTo(modalBody);

                var TitleShowLineInfo = document.createElement('h5');
                $(TitleShowLineInfo).html(settings.i18n.showInfoBoxTitle + " : ")
                                    .attr("style", "text-align: right;")
                                  .appendTo(DivCheckShowLineInfo);

                var inputShowInfo = document.createElement('input');
                $(inputShowInfo).attr("type", "checkbox").appendTo(TitleShowLineInfo);
                $(inputShowInfo).attr("data-toggle", "toggle")
                $(inputShowInfo).attr("data-width", "35%")
                $(inputShowInfo).attr("checked", settings.showInfoBox)
                .bootstrapToggle({
                    on: settings.i18n.on,
                    off: settings.i18n.off
                })
                .change(function () {
                    if ($(this).prop('checked'))
                    { settings.showInfoBox = true; } else { settings.showInfoBox = false; }
                    $(DivCalendar).remove();
                    CreateCalendar(settings.date.current);
                });
                /**------ CHECKBOX SHOW INFOBOX -----**/
                var DivDefaultTTypeT = document.createElement('div');
                $(DivDefaultTTypeT).addClass('form-group')
                .appendTo(modalBody);

                var TitleDefaultTTypeT = document.createElement('h5');
                $(TitleDefaultTTypeT).html(settings.i18n.DefaultTaskType + " : ")
                                    .attr("style", "text-align: right;")
                                  .appendTo(DivDefaultTTypeT);

                var InputDefaultTTypeT = document.createElement("select");
                InputDefaultTTypeT.setAttribute("id", "InputDefaultTTypeT");
                InputDefaultTTypeT.setAttribute("class", "form-control ");
                InputDefaultTTypeT.setAttribute("title", settings.i18n.SelectTypeForTask);
                InputDefaultTTypeT.setAttribute("data-header", settings.i18n.SelectTypeForTask);
                CreateSelectOptions(InputDefaultTTypeT, "[Task-Properties]", "ID", "Task_Name", "Task_Class", true);
                TitleDefaultTTypeT.appendChild(InputDefaultTTypeT);
                $(InputDefaultTTypeT).attr("data-width", "50%")
                                   .selectpicker()
                                   .on('change', function () {
                                       settings.DefaultTType = this.value;
                                       $(InputDefaultTTypeT).selectpicker('setStyle', $(InputDefaultTTypeT).find(':selected').attr('Class'));
                                   });
                $(InputDefaultTTypeT).selectpicker('setStyle', $(InputDefaultTTypeT).find(':selected').attr('Class'));
                settings.DefaultTType = $(InputDefaultTTypeT).val();


                /***************** ACTİVATE COLORS *****************/
                var ColorDiv = document.createElement('div');
                $(ColorDiv).addClass('form-group')
                            .appendTo(modalBody);

                var TitleNowColor = document.createElement('h5');
                $(TitleNowColor).html(settings.i18n.NowColor + " : ")
                                .attr("style", "text-align: right;")
                                  .appendTo(ColorDiv);

                var inputNow = document.createElement('input');
                $(inputNow).attr("type", "checkbox").appendTo(TitleNowColor);
                $(inputNow).attr("data-toggle", "toggle")
                $(inputNow).attr("data-width", "50%")
                $(inputNow).attr("checked", settings.NowColor)
                .bootstrapToggle({
                    on: settings.i18n.on,
                    off: settings.i18n.off
                })
                .change(function () {
                    if ($(this).prop('checked'))
                    { settings.NowColor = true; } else { settings.NowColor = false; }
                    $(DivCalendar).remove();
                    CreateCalendar(settings.date.current);
                });

                var TitleSelectedColor = document.createElement('h5');
                $(TitleSelectedColor).html(settings.i18n.SelectedColor + " : ")
                                    .attr("style", "text-align: right;")
                                  .appendTo(ColorDiv);

                var inputSelected = document.createElement('input');
                $(inputSelected).attr("type", "checkbox").appendTo(TitleSelectedColor);
                $(inputSelected).attr("data-toggle", "toggle")
                $(inputSelected).attr("data-width", "50%")
                $(inputSelected).attr("checked", settings.SelectedColor)
                .bootstrapToggle({
                    on: settings.i18n.on,
                    off: settings.i18n.off
                })
                .change(function () {
                    if ($(this).prop('checked'))
                    { settings.SelectedColor = true; } else { settings.SelectedColor = false; }
                    $(DivCalendar).remove();
                    CreateCalendar(settings.date.current);
                });

                var TitleWeekendColor = document.createElement('h5');
                $(TitleWeekendColor).html(settings.i18n.WeekendColor + " : ")
                                    .attr("style", "text-align: right;")
                                  .appendTo(ColorDiv);

                var inputWeekend = document.createElement('input');
                $(inputWeekend).attr("type", "checkbox").appendTo(TitleWeekendColor);
                $(inputWeekend).attr("data-toggle", "toggle")
                $(inputWeekend).attr("data-width", "50%")
                $(inputWeekend).attr("checked", settings.WeekendColor)
                .bootstrapToggle({
                    on: settings.i18n.on,
                    off: settings.i18n.off
                })
                .change(function () {
                    if ($(this).prop('checked'))
                    { settings.WeekendColor = true; } else { settings.WeekendColor = false; }
                    $(DivCalendar).remove();
                    CreateCalendar(settings.date.current);
                });

                var TitleSpecialColor = document.createElement('h5');
                $(TitleSpecialColor).html(settings.i18n.SpecialDayColor + " : ")
                                    .attr("style", "text-align: right;")
                                    .appendTo(ColorDiv);

                var inputSpecial = document.createElement('input');
                $(inputSpecial).attr("type", "checkbox").appendTo(TitleSpecialColor);
                $(inputSpecial).attr("data-toggle", "toggle")
                $(inputSpecial).attr("data-width", "50%")
                $(inputSpecial).attr("checked", settings.SpecialDayColor)
                .bootstrapToggle({
                    on: settings.i18n.on,
                    off: settings.i18n.off
                })
                .change(function () {
                    if ($(this).prop('checked'))
                    { settings.SpecialDayColor = true; } else { settings.SpecialDayColor = false; }
                    $(DivCalendar).remove();
                    CreateCalendar(settings.date.current);
                });
                /**--------------- ACTİVATE COLORS -------------**/
            }
            CreateRightMenu();

            //-----END OF RIGHT MENU-SETTINGS ----//

            ///CREATE RIGHTMENU - SETTINGS
            function CreateFilterMenu() {
                var FilterPanelDiv = document.createElement('div');
                FilterPanelDiv.id = 'FilterPanelDiv';
                $(FilterPanelDiv).addClass('modal fade right')
                            .attr("tabindex", "-1")
                            .attr("role", "dialog")
                            .appendTo($('body'));

                var FilterPanelDocument = document.createElement('div');
                FilterPanelDocument.id = 'FilterPanelDocument';
                $(FilterPanelDocument).addClass('modal-dialog modal-sm')
                                .attr("role", "document")
                                .appendTo(FilterPanelDiv);

                var Filtermodalcontent = document.createElement('div');
                Filtermodalcontent.id = 'FilterPanelDocument';
                $(Filtermodalcontent).addClass('modal-content')
                                .appendTo(FilterPanelDocument);

                var FiltermodalHeader = document.createElement('div');
                FiltermodalHeader.id = 'FilterPanelDocument';
                $(FiltermodalHeader).addClass('modal-header')
                                .appendTo(Filtermodalcontent);

                var FilterBtnClose = document.createElement('button');
                FilterBtnClose.id = 'FilterBtnClose';
                $(FilterBtnClose).addClass('glyphicon glyphicon-remove close')
                    .html('')
                    .attr("style", "opacity:1!important")
                    .attr("style", "color:red!important")
                    .attr("data-dismiss", "modal")
                    .attr("data-target", FilterPanelDocument)
                    .appendTo(FiltermodalHeader);

                var FilterHeaderH4 = document.createElement('h3');
                $(FilterHeaderH4).addClass('modal-title text-primary')
                    .html(settings.i18n.FilterTitle)
                    .appendTo(FiltermodalHeader);

                var FiltermodalBody = document.createElement('div');
                FiltermodalBody.id = 'FilterPanelBody';
                $(FiltermodalBody).addClass('modal-body')
                            .appendTo(Filtermodalcontent);

                var TitleJobFilter = document.createElement('h5');
                $(TitleJobFilter).html(settings.i18n.JobFilterTitle)
                                    .attr("style", "text-align: left;")
                                    .appendTo(Filtermodalcontent);

                var filtergroups = UserGroups();
                $.each(filtergroups, function (index, XGroup) {
                    var TitleFilterInput = document.createElement('h5');
                    $(TitleFilterInput).html(XGroup.Name + " : ")
                                    .attr("style", "text-align: right;")
                                    .appendTo(Filtermodalcontent);

                    var input = document.createElement('input');
                    $(input).attr("type", "checkbox").appendTo(TitleFilterInput);
                    $(input).attr("data-toggle", "toggle");
                    $(input).attr("name", "type");
                    $(input).attr("value", XGroup.ID);
                    $(input).attr("data-width", "50%");
                    $(input).attr("checked", true)
                    .bootstrapToggle({
                        on: settings.i18n.on,
                        off: settings.i18n.off
                    })
                    .on("change", function () {
                        $(DivCalendar).remove();
                        CreateCalendar(settings.date.current);
                    });



                });


            }


            CreateFilterMenu();

            //-----END OF Filter MENU-SETTINGS ----//

            ///CREATE RIGHTMENU - WORK GROUP INFO

            var PanelWorkInfoDiv = document.createElement('div');
            PanelWorkInfoDiv.id = 'RightWorkInfoPanelDiv';
            $(PanelWorkInfoDiv).addClass('modal fade right')
                            .attr("style", "text-align: center")
                    .html('YAN MENU')
                    .attr("tabindex", "-1")
                    .attr("role", "dialog")
                    .appendTo($('body'));

            var PanelWorkInfoDocument = document.createElement('div');
            PanelWorkInfoDocument.id = 'PanelWorkInfoDocument';
            $(PanelWorkInfoDocument).addClass('modal-dialog modal-sm')
                        .attr("role", "document")
                        .appendTo(PanelWorkInfoDiv);

            var modalWorkInfocontent = document.createElement('div');
            modalWorkInfocontent.id = 'PanelContent';
            $(modalWorkInfocontent).addClass('modal-content')
                     .appendTo(PanelWorkInfoDocument);

            var modalHeader = document.createElement('div');
            modalHeader.id = 'PanelHeader';
            $(modalHeader).addClass('modal-header')
                          .appendTo(modalWorkInfocontent);

            var BtnWorkInfoClose = document.createElement('button');
            BtnWorkInfoClose.id = 'BtnClose';
            $(BtnWorkInfoClose).addClass('glyphicon glyphicon-remove close')
                    .html('')
                    .attr("style", "opacity:1!important")
                    .attr("style", "color:red!important")
                    .attr("data-dismiss", "modal")
                    .attr("data-target", PanelWorkInfoDocument)
                    .appendTo(modalHeader);


            var modalWorkInfoBody = document.createElement('div');
            modalWorkInfoBody.id = 'PanelDocument';
            $(modalWorkInfoBody).addClass('modal-body')
                            .appendTo(modalWorkInfocontent);



            var WorkFirstGr = document.createElement('div');
            WorkFirstGr.id = 'PanelDocument';
            $(WorkFirstGr).addClass('modal-body')
                            .appendTo(modalWorkInfoBody);

            var HeaderWorkNameH4 = document.createElement('h3');
            $(HeaderWorkNameH4).addClass('modal-title text-primary')
                            .html('Workgroup Name')
                            .appendTo(WorkFirstGr);

            var WorkCreateTaskDiv = document.createElement('div');
            WorkCreateTaskDiv.id = 'WorkCreateTaskDiv';
            $(WorkCreateTaskDiv).appendTo(modalWorkInfoBody);


            var WorkCreateTaskInput = document.createElement('input');
            WorkCreateTaskInput.id = 'WorkCreateTaskDiv';
            $(WorkCreateTaskInput).addClass('form-control')
                               .attr("type", "text")
                               .attr("placeholder", settings.i18n.TaskID);
            $(WorkCreateTaskInput).appendTo(WorkCreateTaskDiv);

            var BtnTaskCreate = document.createElement('button');
            BtnTaskCreate.id = 'BtnTaskCreate';
            $(BtnTaskCreate).addClass('btn btn-block btn-info glyphicon glyphicon-floppy-save')
                .attr("data-WorkgroupID", "")
                .html(" " + settings.i18n.CreateTask)
                .on('click', function () {
                    var TaskID = $(WorkCreateTaskInput).val();
                    if (TaskID != "") {
                        bootbox.dialog({
                            title: settings.i18n.CreateTask,
                            message: settings.i18n.CreateTaskMessage,
                            buttons: {
                                cancel: {
                                    label: settings.i18n.Close,
                                    className: 'btn-danger',
                                    callback: function () { }
                                },
                                save: {
                                    label: settings.i18n.Save,
                                    className: 'btn-info',
                                    callback: function () {
                                        var WorkgroupID = $(BtnTaskCreate).attr("data-WorkgroupID");
                                        AddTask($(WorkCreateTaskInput).val(), WorkgroupID, settings.i18n.DefaultTaskDesc);
                                        var start = moment(Date()).hours(0).minutes(0).seconds(0).milliseconds(0).format("DD.MM.YYYY HH:mm");
                                        var end = moment(Date()).hours(23).minutes(59).seconds(59).milliseconds(0).format("DD.MM.YYYY HH:mm");
                        
                                        AddSubToTask(TaskID, settings.DefaultTType, start, end, settings.i18n.DefaultSubTaskDesc);
                                        var NewSubID = ""
                                        var FindNewSub = TaskAllSubPeriods(TaskID);
                                        $.each(FindNewSub, function (index, XSub) {
                                            NewSubID = XSub.ID;
                                        });
                                        $(DivCalendar).remove();
                                        CreateCalendar(settings.date.current);
                                        CreateRightMenuTaskInfoEdit(TaskID, "", NewSubID);
                                        $(PanelWorkInfoDiv).modal('hide');
                                        $(EditPanelTaskInfoDiv).modal('show');

                                    }
                                }

                            }
                        });
                    }
                })
                .appendTo(WorkCreateTaskDiv);

            function CreateRightMenuWorkgroupInfo(WorkgroupID) {
                $(BtnTaskCreate).attr("data-WorkgroupID", WorkgroupID);
                var workgroupinfo = WorkgroupInfo(WorkgroupID);
                $(HeaderWorkNameH4).html(workgroupinfo[0].Group_Long)
            }

            //-----END OF RIGHT MENU-WORK GROUP INFO ----//
            ///CREATE RIGHTMENU - PERSON INFO

            var PanelPerInfoDiv = document.createElement('div');
            PanelPerInfoDiv.id = 'RightPersonInfoPanelDiv';
            $(PanelPerInfoDiv).addClass('modal fade right')
                            .attr("style", "text-align: center")
                    .attr("tabindex", "-1")
                    .attr("role", "dialog")
                    .appendTo($('body'));

            var PanelPerInfoDocument = document.createElement('div');
            PanelPerInfoDocument.id = 'PanelPerInfoDocument';
            $(PanelPerInfoDocument).addClass('modal-dialog modal-sm')
                        .attr("role", "document")
                        .appendTo(PanelPerInfoDiv);

            var modalPerInfocontent = document.createElement('div');
            modalPerInfocontent.id = 'PanelContent';
            $(modalPerInfocontent).addClass('modal-content')
                     .appendTo(PanelPerInfoDocument);

            var modalHeader = document.createElement('div');
            modalHeader.id = 'PanelHeader';
            $(modalHeader).addClass('modal-header')
                          .appendTo(modalPerInfocontent);

            var BtnPerInfoClose = document.createElement('button');
            BtnPerInfoClose.id = 'BtnClose';
            $(BtnPerInfoClose).addClass('glyphicon glyphicon-remove close')
                    .html('')
                    .attr("style", "opacity:1!important")
                    .attr("style", "color:red!important")
                    .attr("data-dismiss", "modal")
                    .attr("data-target", PanelPerInfoDocument)
                    .appendTo(modalHeader);


            var modalPerInfoBody = document.createElement('div');
            modalPerInfoBody.id = 'PanelDocument';
            $(modalPerInfoBody).addClass('modal-body')
                            .appendTo(modalPerInfocontent);



            var PerFirstGr = document.createElement('div');
            PerFirstGr.id = 'PanelDocument';
            $(PerFirstGr).addClass('modal-body')
                            .appendTo(modalPerInfoBody);


            var PerInfoImage = document.createElement('img');
            $(PerInfoImage).addClass('img-responsive  center-block')
                          .appendTo(PerFirstGr);

            var HeaderPerNameH4 = document.createElement('h3');
            $(HeaderPerNameH4).addClass('modal-title text-primary')
                            .html('Person Name')
                            .appendTo(PerFirstGr);

            var PerCreateTaskDiv = document.createElement('div');
            PerCreateTaskDiv.id = 'PerCreateTaskDiv';
            $(PerCreateTaskDiv).appendTo(modalPerInfoBody);


            var PerCreateTaskInput = document.createElement('input');
            PerCreateTaskInput.id = 'PerCreateTaskDiv';
            $(PerCreateTaskInput).addClass('form-control')
                               .attr("type", "text")
                               .attr("placeholder", settings.i18n.TaskID);
            $(PerCreateTaskInput).appendTo(PerCreateTaskDiv);

            var BtnTaskCreate = document.createElement('button');
            BtnTaskCreate.id = 'BtnTaskCreate';
            $(BtnTaskCreate).addClass('btn btn-block btn-info glyphicon glyphicon-floppy-save')
                .attr("data-PersonID", "")
                .html(" " + settings.i18n.CreateTask)
                .on('click', function () {
                    var TaskID = $(PerCreateTaskInput).val();
                    if (TaskID != "") {
                        bootbox.dialog({
                            title: settings.i18n.CreateTask,
                            message: settings.i18n.CreateTaskMessage,
                            buttons: {
                                cancel: {
                                    label: settings.i18n.Close,
                                    className: 'btn-danger',
                                    callback: function () { }
                                },
                                save: {
                                    label: settings.i18n.Save,
                                    className: 'btn-info',
                                    callback: function () {
                                        var UserID = $(BtnTaskCreate).attr("data-PersonID");
                                        AddTask($(PerCreateTaskInput).val(), null, settings.i18n.DefaultTaskDesc);
                                        var start = moment(Date()).hours(0).minutes(0).seconds(0).milliseconds(0).format("DD.MM.YYYY HH:mm");
                                        var end = moment(Date()).hours(23).minutes(59).seconds(59).milliseconds(0).format("DD.MM.YYYY HH:mm");
                     
                                        AddSubToTask(TaskID, settings.DefaultTType, start, end, settings.i18n.DefaultSubTaskDesc);
                                        var NewSubID = ""
                                        var FindNewSub = TaskAllSubPeriods(TaskID);
                                        $.each(FindNewSub, function (index, XSub) {
                                            NewSubID = XSub.ID;
                                        });

                                        AddPersonToTask(TaskID, NewSubID, UserID);
                                        $(DivCalendar).remove();
                                        CreateCalendar(settings.date.current);
                                        CreateRightMenuTaskInfoEdit(TaskID, UserID, NewSubID);
                                        $(PanelPerInfoDiv).modal('hide');
                                        $(EditPanelTaskInfoDiv).modal('show');

                                    }
                                }

                            }
                        });
                    }
                })
                .appendTo(PerCreateTaskDiv);

            function CreateRightMenuPersonInfo(PersonID) {
                $(BtnTaskCreate).attr("data-PersonID", PersonID);
                var personinfo = PersonInfo(PersonID);
                $(PerInfoImage).attr("src", personinfo[0].Picture);
                $(HeaderPerNameH4).html(personinfo[0].Name + " " + personinfo[0].SurName)
            }

            //-----END OF RIGHT MENU-PERSON INFO ----//


            ///CREATE RIGHTMENU - TASK INFO

            var PanelTaskInfoDiv = document.createElement('div');
            PanelTaskInfoDiv.id = 'RightTaskInfoPanelDiv';
            $(PanelTaskInfoDiv).addClass('modal fade right')
                            .attr("style", "text-align: center")
                    .attr("tabindex", "-1")
                    .attr("role", "dialog")
                    .appendTo($('body'));

            var PanelTaskInfoDocument = document.createElement('div');
            PanelTaskInfoDocument.id = 'PanelTaskInfoDocument';
            $(PanelTaskInfoDocument).addClass('modal-dialog modalExtWide modal-sm')
                        .attr("role", "document")
                        .appendTo(PanelTaskInfoDiv);

            var modalTaskInfocontent = document.createElement('div');
            modalTaskInfocontent.id = 'PanelTaskDocument';
            $(modalTaskInfocontent).addClass('modal-content')
                     .appendTo(PanelTaskInfoDocument);

            var modalTaskHeader = document.createElement('div');
            modalTaskHeader.id = 'PanelTaskDocument';
            $(modalTaskHeader).addClass('modal-header')
                          .appendTo(modalTaskInfocontent);



            var BtnTaskInfoClose = document.createElement('button');
            BtnTaskInfoClose.id = 'BtnTaskClose';
            $(BtnTaskInfoClose).addClass('glyphicon glyphicon-remove close')
                    .html('')
                    .attr("style", "opacity:1!important")
                    .attr("style", "color:red!important")
                    .attr("data-dismiss", "modal")
                    .attr("data-target", PanelTaskInfoDocument)
                    .appendTo(modalTaskHeader);

            var HeaderTaskNameH3 = document.createElement('h3');
            $(HeaderTaskNameH3).addClass('modal-title')
                            .html('Task Name')
                            .appendTo(modalTaskHeader);
            var modalTaskInfoBody = document.createElement('div');
            modalTaskInfoBody.id = 'PanelTaskDocument';
            $(modalTaskInfoBody).addClass('modal-body')
                            .appendTo(modalTaskInfocontent);

            var table = document.createElement('TABLE');
            table.classList.add('table');
            table.classList.add('table-hover');

            var tableBody = document.createElement('TBODY');
            table.appendChild(tableBody);

            ////////TASK TYPE ///////////////
            var tr = document.createElement('TR');
            tableBody.appendChild(tr);



            ////////TASK GROUP ///////////////
            var tr = document.createElement('TR');
            tableBody.appendChild(tr);

            var tdTGroupT = document.createElement('TH');
            tdTGroupT.appendChild(document.createTextNode(settings.i18n.TaskGroup + " : "));
            tr.appendChild(tdTGroupT);

            var tdTGroup = document.createElement('TD');
            tdTGroup.appendChild(document.createTextNode("Cell Value"));
            $(tdTGroup).attr("align", "left");
            $(tdTGroup).attr("colspan", 2);
            tr.appendChild(tdTGroup);

            ////////TASK DESC ///////////////
            var tr = document.createElement('TR');
            tableBody.appendChild(tr);

            var tdTDescT = document.createElement('TH');
            tdTDescT.appendChild(document.createTextNode(settings.i18n.TaskDescription + " : "));
            tr.appendChild(tdTDescT);

            var tdTDesc = document.createElement('TD');
            tdTDesc.appendChild(document.createTextNode("Cell Value"));
            $(tdTDesc).attr("align", "left");
            tr.appendChild(tdTDesc);

            ////////TASK SUBS TITLE ///////////////
            var tr = document.createElement('TR');
            tableBody.appendChild(tr);

            var tdTSubT = document.createElement('TD');
            tdTSubT.id = "tdTSubT";
            $(tdTSubT).append("<b>" + settings.i18n.TaskTimes + " : </b>");
            $(tdTSubT).css({ "text-align": "left" });
            $(tdTSubT).attr("colspan", 2);
            tr.appendChild(tdTSubT);


            modalTaskInfoBody.appendChild(table);


            var BtnTaskEdit = document.createElement('button');
            BtnTaskEdit.id = 'BtnEdit';
            $(BtnTaskEdit).addClass('btn btn-block btn-warning glyphicon glyphicon-edit')
                .html(' Edit')
                .attr("data-toggle", "modal")
                .attr("data-target", "#EditPanelTaskInfoDiv")
                .attr("data-dismiss", "modal")

                .appendTo(modalTaskInfoBody);

            var space = document.createTextNode(' ');
            $(space).appendTo(modalTaskInfoBody);

            var BtnTaskDelete = document.createElement('button');
            BtnTaskDelete.id = 'BtnTaskDelete';
            BtnTaskDelete.setAttribute("data-TaskID", "");
            $(BtnTaskDelete).addClass('btn btn-block btn-danger glyphicon glyphicon-trash')
                .html(' Delete')
                .on('click', function () {
                    bootbox.dialog({
                        title: settings.i18n.DeleteTaskSubTitle,
                        message: settings.i18n.DeleteTaskMessage.replace(/YYY/g, $(BtnTaskDelete).attr("data-TaskID")),
                        buttons: {
                            cancel: {
                                label: settings.i18n.keep,
                                className: 'btn-success',
                                callback: function () {

                                }
                            },
                            deleteall: {
                                label: settings.i18n.erase,
                                className: 'btn-danger',
                                callback: function () {
                                    RemoveAllPersonFrTask($(BtnTaskDelete).attr("data-TaskID"));
                                    RemoveAllSubFrTask($(BtnTaskDelete).attr("data-TaskID"))
                                    RemoveTask($(BtnTaskDelete).attr("data-TaskID"))
                                    location.reload(true);
                                    return;
                                }
                            }
                        }
                    });
                })
                .appendTo(modalTaskInfoBody);

            function CreateRightMenuTaskInfo(TaskID, UserID, SubID) {

                $(BtnTaskDelete).attr("data-TaskID", TaskID);
                $(BtnTaskEdit).on('click', function () {
                    CreateRightMenuTaskInfoEdit(TaskID, UserID, SubID);
                });
                var taskinfo = TaskInfo(TaskID);
                $(HeaderTaskNameH3).html(taskinfo[0].ID);
                $(modalTaskHeader).removeClass()
                                  .addClass('modal-header')
                                  .addClass('default');

                if (taskinfo[0].Group != null) {
                    var taskgroup = TaskGroup(taskinfo[0].Group);
                    $(tdTGroup).html(taskgroup[0].Group_Long);
                }
                else {
                    $(tdTGroup).html(settings.i18n.Private);
                }
                $(tdTDesc).html(taskinfo[0].Desc);

                //////// SUB TASK TABLES ///////////
                $("#Subtable").remove();
                var Subtable = document.createElement('TABLE');
                Subtable.id = "Subtable";
                Subtable.classList.add('table');
                Subtable.classList.add('table-sm');
                Subtable.border = '1';

                var tableBody = document.createElement('thead');
                Subtable.appendChild(tableBody);

                ////////TASK TYPE ///////////////
                var tr = document.createElement('TR');
                tableBody.appendChild(tr);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode("#"));
                $(tdTTypeT).css({ "vertical-align": "middle" });
                $(tdTTypeT).attr("rowspan", 2);
                tdTTypeT.width = "1%";
                tr.appendChild(tdTTypeT);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode(settings.i18n.TaskType));
                $(tdTTypeT).css({ "vertical-align": "middle" });
                tdTTypeT.classList.add('text-center');
                $(tdTTypeT).attr("rowspan", 2);
                tdTTypeT.width = "10%";
                tr.appendChild(tdTTypeT);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode(settings.i18n.TaskBegin));
                tdTTypeT.classList.add('text-center');
                tdTTypeT.width = "19%";
                tr.appendChild(tdTTypeT);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode(settings.i18n.TaskSubDesc));
                $(tdTTypeT).attr("rowspan", 2);
                $(tdTTypeT).css({ "vertical-align": "middle" });
                tdTTypeT.classList.add('text-center');
                tdTTypeT.width = "40%";
                tr.appendChild(tdTTypeT);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode(settings.i18n.TaskPersons));
                $(tdTTypeT).attr("rowspan", 2);
                $(tdTTypeT).css({ "vertical-align": "middle" });
                tdTTypeT.classList.add('text-center');
                tdTTypeT.width = "30%";
                tr.appendChild(tdTTypeT);

                var tr = document.createElement('TR');
                tableBody.appendChild(tr);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode(settings.i18n.TaskEnd));
                tdTTypeT.classList.add('text-center');
                tr.appendChild(tdTTypeT);

                var tableBody = document.createElement('TBODY');
                Subtable.appendChild(tableBody);

                ////TASK SUB LINES////

                var taskSubs = TaskAllSubPeriods(TaskID);
                $.each(taskSubs, function (index, TSub) {
                    var SClass = "active";
                    if (index % 2 == 0) { SClass = "info"; }

                    var tr = document.createElement('TR');
                    if (SubID == TSub.ID) {
                        $(tr).css({ "outline": "thick dashed green" });
                    }

                    tableBody.appendChild(tr);

                    var td = document.createElement('TD');
                    td.appendChild(document.createTextNode(index + 1));
                    $(td).css({ "vertical-align": "middle" });
                    td.classList.add('text-center');
                    td.classList.add(SClass);
                    tr.appendChild(td)

                    var tdTType = document.createElement('TD');
                    tdTType.appendChild(document.createTextNode("Cell Value"));
                    $(tdTType).html(TSub.TaskName)
                    $(tdTType).attr("align", "left");
                    tdTType.classList.add(TSub.Class);
                    tr.appendChild(tdTType);

                    var td = document.createElement('TD');
                    $(td).html(moment(TSub.Begin).format('DD.MM.YYYY HH:mm') + "<BR/>" + moment(TSub.End).format('DD.MM.YYYY HH:mm'));
                    $(td).css({ "vertical-align": "middle" });
                    td.classList.add('text-center');
                    td.classList.add(SClass);
                    tr.appendChild(td)

                    var td = document.createElement('TD');
                    td.appendChild(document.createTextNode(TSub.SubDesc));
                    td.classList.add('text-left');
                    td.classList.add(SClass);
                    tr.appendChild(td)


                    var personlist = "";
                    var personsinTask = TaskPersons(TSub.ID);
                    $.each(personsinTask, function (i, person) {

                        personlist = personlist + (i + 1) + ". " + person.Name + " " + person.SurName + "<BR/>";
                    });



                    var td = document.createElement('TD');
                    $(td).html(personlist);
                    td.classList.add('text-left');
                    td.classList.add(SClass);
                    tr.appendChild(td)

                });

                tdTSubT.appendChild(Subtable);

            }

            //-----END OF RIGHT MENU-TASK INFO ----//



            ////////////////////////////////////////////////////////////////////////////////////////////////


            ///CREATE RIGHTMENU - EDİT TASK INFO

            var EditPanelTaskInfoDiv = document.createElement('div');
            EditPanelTaskInfoDiv.id = 'EditPanelTaskInfoDiv';
            $(EditPanelTaskInfoDiv).addClass('modal fade right')
                            .attr("style", "text-align: center")
                    .attr("tabindex", "-1")
                    .attr("role", "dialog")
                    .appendTo($('body'));

            var EditPanelTaskInfoDocument = document.createElement('div');
            EditPanelTaskInfoDocument.id = 'EditPanelTaskInfoDocument';
            $(EditPanelTaskInfoDocument).addClass('modal-dialog modalExtWideEdit modal-sm')
                        .attr("role", "document")
                        .appendTo(EditPanelTaskInfoDiv);

            var EditmodalTaskInfocontent = document.createElement('div');
            EditmodalTaskInfocontent.id = 'EditPanelTaskDocument';
            $(EditmodalTaskInfocontent).addClass('modal-content')
                     .appendTo(EditPanelTaskInfoDocument);

            var EditmodalTaskHeader = document.createElement('div');
            EditmodalTaskHeader.id = 'EditPanelTaskDocument';
            $(EditmodalTaskHeader).addClass('modal-header')
                          .appendTo(EditmodalTaskInfocontent);



            var EditBtnTaskInfoClose = document.createElement('button');
            EditBtnTaskInfoClose.id = 'BtnTaskClose';
            $(EditBtnTaskInfoClose).addClass('glyphicon glyphicon-remove close')
                    .html('')
                    .attr("style", "opacity:1!important")
                    .attr("style", "color:red!important")
                    .attr("data-dismiss", "modal")
                    .attr("data-target", EditPanelTaskInfoDocument)
                    .appendTo(EditmodalTaskHeader);

            var EditHeaderTaskNameH3 = document.createElement('h3');
            $(EditHeaderTaskNameH3).addClass('modal-title')
                            .html('Task Name')
                            .appendTo(EditmodalTaskHeader);
            var EditmodalTaskInfoBody = document.createElement('div');
            EditmodalTaskInfoBody.id = 'EditPanelTaskDocument';
            $(EditmodalTaskInfoBody).addClass('modal-body')
                            .appendTo(EditmodalTaskInfocontent);

            var Edittable = document.createElement('TABLE');
            Edittable.classList.add('table');
            Edittable.classList.add('table-hover');

            var EdittableBody = document.createElement('TBODY');
            Edittable.appendChild(EdittableBody);

            ////////TASK GROUP ///////////////
            var tr = document.createElement('TR');
            EdittableBody.appendChild(tr);

            var EdittdTGroupT = document.createElement('TH');
            EdittdTGroupT.appendChild(document.createTextNode(settings.i18n.TaskGroup + " : "));
            tr.appendChild(EdittdTGroupT);

            var EdittdTGroup = document.createElement('TD');
            $(EdittdTGroup).attr("align", "left");
            $(EdittdTGroup).attr("colspan", 2);
            tr.appendChild(EdittdTGroup);

            var InputTGroup = document.createElement("select");
            InputTGroup.setAttribute("id", "InputTGroup");
            InputTGroup.setAttribute("class", "form-control");
            InputTGroup.setAttribute("title", settings.i18n.SelectGroupForTask);
            InputTGroup.setAttribute("data-header", settings.i18n.SelectGroupForTask);
            $(InputTGroup).append('<option value=null>' + settings.i18n.Private + '</option>');

            CreateSelectOptions(InputTGroup, "[Task-Groups]", "Group_ID", "Group_Long", "");
            EdittdTGroup.appendChild(InputTGroup);
            $(InputTGroup).attr("data-width", "100%").selectpicker();

            ////////TASK DESC ///////////////
            var tr = document.createElement('TR');
            EdittableBody.appendChild(tr);

            var EdittdTDescT = document.createElement('TH');
            EdittdTDescT.appendChild(document.createTextNode(settings.i18n.TaskDescription + " : "));
            tr.appendChild(EdittdTDescT);

            var EdittdTDesc = document.createElement('TD');
            $(EdittdTDesc).attr("align", "left");
            tr.appendChild(EdittdTDesc);

            var InputTDesc = document.createElement('textarea');
            InputTDesc.id = "InputTDesc";
            InputTDesc.maxLength = "5000";
            InputTDesc.cols = "80";
            InputTDesc.rows = "7";
            EdittdTDesc.appendChild(InputTDesc);
            ////////TASK COMMANDS  ///////////////
            var tr = document.createElement('TR');
            EdittableBody.appendChild(tr);

            var EdittdTComm = document.createElement('TH');
            $(EdittdTComm).attr("colspan", 2);
            tr.appendChild(EdittdTComm);

            var EditBtnTaskSave = document.createElement('button');
            EditBtnTaskSave.setAttribute("data-TaskID", "");
            EditBtnTaskSave.id = 'EditBtnTaskSave';
            $(EditBtnTaskSave).addClass('btn btn-block btn-info glyphicon glyphicon-floppy-save')
                .html(' Save')
                .on('click', function () {
                    if ($(EditBtnTaskSave).attr("data-TaskID") != "") {

                        UpdateTask($(EditBtnTaskSave).attr("data-TaskID"), $(InputTDesc).val(), $(InputTGroup).val());
                        $(DivCalendar).remove();
                        CreateCalendar(settings.date.current);
                        CreateRightMenuTaskInfoEdit($(EditBtnTaskSave).attr("data-TaskID"), "", "");
                        $(EditPanelTaskInfoDiv).modal('show');
                    }
                })
                .appendTo(EdittdTComm);

            var EditBtnTaskDelete = document.createElement('button');
            EditBtnTaskDelete.id = 'EditBtnDelete';
            EditBtnTaskDelete.setAttribute("data-TaskID", "");
            $(EditBtnTaskDelete).addClass('btn btn-block btn-danger glyphicon glyphicon-trash')
                .html(' Delete')
                .on('click', function () {
                    bootbox.dialog({
                        title: settings.i18n.DeleteTaskSubTitle,
                        message: settings.i18n.DeleteTaskMessage.replace(/YYY/g, $(EditBtnTaskDelete).attr("data-TaskID")),
                        buttons: {
                            cancel: {
                                label: settings.i18n.keep,
                                className: 'btn-success',
                                callback: function () {

                                }
                            },
                            deleteall: {
                                label: settings.i18n.erase,
                                className: 'btn-danger',
                                callback: function () {
                                    RemoveAllPersonFrTask($(EditBtnTaskDelete).attr("data-TaskID"));
                                    RemoveAllSubFrTask($(EditBtnTaskDelete).attr("data-TaskID"))
                                    RemoveTask($(EditBtnTaskDelete).attr("data-TaskID"))
                                    location.reload(true);
                                    return;
                                }
                            }
                        }
                    });
                })
                .appendTo(EdittdTComm)

            ////////TASK SUBS TITLE ///////////////
            var tr = document.createElement('TR');
            EdittableBody.appendChild(tr);

            var EdittdTSubT = document.createElement('TD');
            EdittdTSubT.id = "EdittdTSubT";
            $(EdittdTSubT).append("<b>" + settings.i18n.TaskTimes + " : </b>");
            $(EdittdTSubT).css({ "text-align": "left" });
            $(EdittdTSubT).attr("colspan", 2);
            tr.appendChild(EdittdTSubT);


            EditmodalTaskInfoBody.appendChild(Edittable);

            function CreateRightMenuTaskInfoEdit(TaskID, UserID, SubID) {

                var taskinfo = TaskInfo(TaskID);
                $(EditHeaderTaskNameH3).html(taskinfo[0].ID);
                $(EditmodalTaskHeader).removeClass()
                                  .addClass('modal-header')
                                  .addClass('default');

                $(EditBtnTaskSave).attr("data-TaskID", TaskID);
                $(EditBtnTaskDelete).attr("data-TaskID", TaskID);


                if (taskinfo[0].Group != null) {
                    var taskgroup = TaskGroup(taskinfo[0].Group);
                    $(InputTGroup).val(taskgroup[0].ID).change();
                }
                else {
                    $(InputTGroup).val(0).change();
                }
                $(InputTDesc).val(taskinfo[0].Desc);

                //////// SUB TASK TABLES ///////////
                $("#EditSubtable").remove();
                var EditSubtable = document.createElement('TABLE');
                EditSubtable.id = "EditSubtable";
                EditSubtable.classList.add('table');
                EditSubtable.classList.add('table-sm');
                EditSubtable.border = '1';

                var tableBody = document.createElement('thead');
                EditSubtable.appendChild(tableBody);

                ////////TASK TYPE ///////////////
                var tr = document.createElement('TR');
                tableBody.appendChild(tr);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode("Command"));
                $(tdTTypeT).css({ "vertical-align": "middle" });
                $(tdTTypeT).attr("rowspan", 2);
                tdTTypeT.width = "10%";
                tr.appendChild(tdTTypeT);


                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode(settings.i18n.TaskType));
                $(tdTTypeT).css({ "vertical-align": "middle" });
                tdTTypeT.classList.add('text-center');
                $(tdTTypeT).attr("rowspan", 2);
                tr.appendChild(tdTTypeT);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode(settings.i18n.TaskBegin));
                tdTTypeT.classList.add('text-center');
                tdTTypeT.width = "21%";
                tr.appendChild(tdTTypeT);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode(settings.i18n.TaskSubDesc));
                $(tdTTypeT).attr("rowspan", 2);
                $(tdTTypeT).css({ "vertical-align": "middle" });
                tdTTypeT.classList.add('text-center');
                tdTTypeT.width = "29%";
                tr.appendChild(tdTTypeT);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode(settings.i18n.TaskPersons));
                $(tdTTypeT).attr("rowspan", 2);
                $(tdTTypeT).css({ "vertical-align": "middle" });
                tdTTypeT.classList.add('text-center');
                tdTTypeT.width = "30%";
                tr.appendChild(tdTTypeT);

                var tr = document.createElement('TR');
                tableBody.appendChild(tr);

                var tdTTypeT = document.createElement('TH');
                tdTTypeT.appendChild(document.createTextNode(settings.i18n.TaskEnd));
                tdTTypeT.classList.add('text-center');
                tr.appendChild(tdTTypeT);

                var tableBody = document.createElement('TBODY');
                EditSubtable.appendChild(tableBody);

                ////TASK SUB LINES////

                var taskSubs = TaskAllSubPeriods(TaskID);
                $.each(taskSubs, function (index, TSub) {
                    var SClass = "active";
                    if (index % 2 == 0) { SClass = "info"; }

                    var tr = document.createElement('TR');
                    if (SubID == TSub.ID) {
                        $(tr).css({ "outline": "thick dashed green" });
                    }

                    tableBody.appendChild(tr);
                    /////// Command Line ///////////
                    var td = document.createElement('TD');
                    $(td).css({ "vertical-align": "middle" });
                    td.classList.add('text-center');
                    td.classList.add(SClass);
                    tr.appendChild(td)

                    var BtnSubSave = document.createElement('button');
                    BtnSubSave.id = 'BtnSubSave' + TSub.ID;
                    BtnSubSave.setAttribute("data-SubID", TSub.ID);
                    $(BtnSubSave).addClass('btn btn-block btn-info glyphicon glyphicon-floppy-save')
                        .html(" " + settings.i18n.Save)
                        .on('click', function () {
                            if ($(InputTBegin).val() != "" && $(InputTEnd).val() != "") {
                                UpdateSubToTask($(BtnSubSave).attr("data-SubID"), TaskID, $(InputTTypeT).val(), $(InputTBegin).val(), $(InputTEnd).val(), $(InputSubDesc).val());
                                $(DivCalendar).remove();
                                CreateCalendar(settings.date.current);
                                CreateRightMenuTaskInfoEdit(TaskID, "", $(BtnSubSave).attr("data-SubID"));
                                $(EditPanelTaskInfoDiv).modal('show');
                            }
                            else {
                                bootbox.dialog({
                                    title: settings.i18n.InsufficientInfoTitle,
                                    message: settings.i18n.InsufficientInfoSUB,
                                    buttons: {
                                        cancel: {
                                            label: settings.i18n.Close,
                                            className: 'btn-warning',
                                            callback: function () {

                                            }
                                        }

                                    }
                                });
                            }
                        })
                .appendTo(td);

                    var BtnSubDelete = document.createElement('button');
                    BtnSubDelete.id = 'BtnSubDelete' + TSub.ID;
                    BtnSubDelete.setAttribute("data-SubID", TSub.ID);
                    $(BtnSubDelete).addClass('btn btn-block btn-danger glyphicon glyphicon-trash')
                        .html(" " + settings.i18n.erase)
                        .on('click', function () {
                            if (taskSubs.length > 1) {
                                bootbox.dialog({
                                    title: settings.i18n.DeleteTaskSubTitle,
                                    message: settings.i18n.DeleteTaskSubMessage,
                                    buttons: {
                                        cancel: {
                                            label: settings.i18n.keep,
                                            className: 'btn-success',
                                            callback: function () {

                                            }
                                        },
                                        deleteall: {
                                            label: settings.i18n.erase,
                                            className: 'btn-danger',
                                            callback: function () {
                                                RemoveAllPersonFrSubTask(TSub.ID);
                                                RemoveSubFrTask(TSub.ID)
                                                $(DivCalendar).remove();
                                                CreateCalendar(settings.date.current);
                                                CreateRightMenuTaskInfoEdit(TaskID, "", "");
                                            }
                                        }
                                    }
                                });
                            }
                            else {

                                bootbox.dialog({
                                    title: settings.i18n.DeleteTaskSubTitle,
                                    message: settings.i18n.DeleteLastTaskSubMessage.replace(/YYY/g, TaskID),
                                    buttons: {
                                        cancel: {
                                            label: settings.i18n.keep,
                                            className: 'btn-success',
                                            callback: function () {

                                            }
                                        },
                                        deleteall: {
                                            label: settings.i18n.erase,
                                            className: 'btn-danger',
                                            callback: function () {
                                                RemoveAllPersonFrSubTask(TSub.ID);
                                                RemoveSubFrTask(TSub.ID)
                                                RemoveTask(TaskID)
                                                location.reload(true);
                                                return;
                                            }
                                        }
                                    }
                                });

                            }
                        })
                .appendTo(td);

                    var td = document.createElement('TD');
                    td.setAttribute("id", "tdType" + TSub.ID);
                    $(td).css({ "vertical-align": "middle" });
                    td.classList.add('text-center');
                    td.classList.add(SClass);
                    tr.appendChild(td)

                    var InputTTypeT = document.createElement("select");
                    InputTTypeT.setAttribute("id", "InputTTypeT" + TSub.ID);
                    InputTTypeT.setAttribute("class", "form-control");
                    InputTTypeT.setAttribute("title", settings.i18n.SelectTypeForTask);
                    InputTTypeT.setAttribute("data-header", settings.i18n.SelectTypeForTask);
                    CreateSelectOptions(InputTTypeT, "[Task-Properties]", "ID", "Task_Name", "Task_Class");
                    td.appendChild(InputTTypeT);
                    $(InputTTypeT).selectpicker().val(TSub.TypeID).change()
                                .on('change', function () {
                                    $("#tdType" + TSub.ID).attr("class", $("#InputTTypeT" + TSub.ID).find(':selected').attr('Class'));
                                });
                    $(td).attr("class", TSub.Class);


                    var td = document.createElement('TD');
                    $(td).css({ "vertical-align": "middle" });
                    td.classList.add('text-center');
                    td.classList.add(SClass);
                    tr.appendChild(td)

                    var TimesDiv = document.createElement('div');
                    td.appendChild(TimesDiv);
                    /////////// TaskSub Begin ////////////////
                    var TimesBeginDiv = document.createElement('div');
                    TimesBeginDiv.id = "TimesBeginDiv" + TSub.ID;
                    $(TimesBeginDiv).addClass('input-group date');
                    TimesDiv.appendChild(TimesBeginDiv);

                    var InputTBegin = document.createElement('input');
                    InputTBegin.id = "InputTBegin" + TSub.ID;
                    InputTBegin.classList.add('form-control');
                    $(InputTBegin).attr('type', 'text');
                    $(InputTBegin).attr('disabled', 'true');
                    TimesBeginDiv.appendChild(InputTBegin);

                    var HiddenTBegin = document.createElement('input');
                    HiddenTBegin.id = "HiddenTBegin" + TSub.ID;
                    HiddenTBegin.classList.add('datepickerinput');
                    $(HiddenTBegin).attr('type', 'hidden');
                    TimesBeginDiv.appendChild(HiddenTBegin);

                    var SpanTBegin = document.createElement('span');
                    SpanTBegin.classList.add('input-group-addon');
                    $(SpanTBegin).html('<span class="glyphicon glyphicon-calendar"></span>');
                    TimesBeginDiv.appendChild(SpanTBegin);

                    /////////// TaskSub End ////////////////
                    var TimesEndDiv = document.createElement('div');
                    TimesEndDiv.id = "NewTimesEndDiv" + TSub.ID;
                    $(TimesEndDiv).addClass('input-group date');
                    TimesDiv.appendChild(TimesEndDiv);

                    var InputTEnd = document.createElement('input');
                    InputTEnd.id = "InputTEnd" + TSub.ID;
                    InputTEnd.classList.add('form-control');
                    $(InputTEnd).attr('disabled', 'true');
                    $(InputTEnd).attr('type', 'text');
                    TimesEndDiv.appendChild(InputTEnd);

                    var HiddenTEnd = document.createElement('input');
                    HiddenTEnd.id = "HiddenTEnd" + TSub.ID;
                    HiddenTEnd.classList.add('datepickerinput');
                    $(HiddenTEnd).attr('type', 'hidden');
                    TimesEndDiv.appendChild(HiddenTEnd);

                    var SpanTEnd = document.createElement('span');
                    SpanTEnd.classList.add('input-group-addon');
                    $(SpanTEnd).html('<span class="glyphicon glyphicon-calendar"></span>');
                    TimesEndDiv.appendChild(SpanTEnd);
                    //////// TIME PİCKER SETTINGS //////////////
                    $(TimesBeginDiv).datetimepicker({
                        locale: settings.locale,
                        format: 'DD-MM-YYYY HH:mm',
                        sideBySide: true,
                        showTodayButton: true,
                        toolbarPlacement: "bottom",
                        showClose: true,
                        allowInputToggle: true,
                        date: TSub.Begin
                    }).data("DateTimePicker").maxDate(TSub.End);
                    $(TimesEndDiv).datetimepicker({
                        locale: settings.locale,
                        format: 'DD-MM-YYYY HH:mm',
                        sideBySide: true,
                        useCurrent: false, //Important! See issue #1075
                        showTodayButton: true,
                        toolbarPlacement: "bottom",
                        showClose: true,
                        allowInputToggle: true,
                        date: TSub.End
                    }).data("DateTimePicker").minDate(TSub.Begin);
                    $(TimesBeginDiv).on("dp.change", function (e) {
                        $(InputTBegin).val($(HiddenTBegin).val());
                        $(TimesEndDiv).data("DateTimePicker").minDate(e.date);
                    });
                    $(TimesEndDiv).on("dp.change", function (e) {
                        $(InputTEnd).val($(HiddenTEnd).val());
                        $(TimesBeginDiv).data("DateTimePicker").maxDate(e.date);
                    });
                    $(InputTEnd).val($(HiddenTEnd).val());
                    $(InputTBegin).val($(HiddenTBegin).val());

                    var td = document.createElement('TD');
                    td.classList.add('text-left');
                    td.classList.add(SClass);
                    tr.appendChild(td)

                    var InputSubDesc = document.createElement('textarea');
                    InputSubDesc.id = "InputSubDesc" + TSub.ID;
                    InputSubDesc.maxLength = "5000";
                    InputSubDesc.cols = "50";
                    InputSubDesc.rows = "7";
                    $(InputSubDesc).val(TSub.SubDesc);
                    td.appendChild(InputSubDesc);

                    var td = document.createElement('TD');
                    td.classList.add('text-left');
                    td.classList.add(SClass);
                    tr.appendChild(td)

                    var selectAddPerson = document.createElement("select");
                    selectAddPerson.setAttribute("id", "selectAddPerson" + TSub.ID);
                    selectAddPerson.setAttribute("class", "form-control");
                    selectAddPerson.setAttribute("title", settings.i18n.SelectPerson);
                    selectAddPerson.setAttribute("data-header", settings.i18n.SelectPerson);
                    $(selectAddPerson).attr("data-TaskID", TaskID);
                    $(selectAddPerson).attr("data-SubID", TSub.ID);
                    $(selectAddPerson).attr("data-UserID", UserID)
                        .on('change', function () {
                            if (this.value != null && this.getAttribute('data-TaskID') != null && this.getAttribute('data-SubID') != null) {
                                AddPersonToTask(this.getAttribute('data-TaskID'), this.getAttribute('data-SubID'), this.value);
                                $(DivCalendar).remove();
                                CreateRightMenuTaskInfoEdit(this.getAttribute('data-TaskID'), "", "");
                                CreateCalendar(settings.date.current);
                            }
                        });
                    td.appendChild(selectAddPerson);

                    //Create and append the options

                    var grouplist = UserGroups();
                    if (grouplist.length > 0) { $(selectAddPerson).empty(); }
                    grouplist.forEach(function (group) {
                        var OptionGroup = document.createElement("optgroup");
                        $(OptionGroup).attr("label", group.Name);
                        var GroupUsers = UsersInGroup(group.ID);
                        GroupUsers.forEach(function (personx) {
                            var OptionPerson = document.createElement("option");
                            $(OptionPerson).attr("value", personx.ID)
                            .html(personx.Name + ' ' + personx.SurName)
                            .appendTo(OptionGroup);
                        })

                        selectAddPerson.appendChild(OptionGroup);
                        $(selectAddPerson).selectpicker("refresh");
                    })
                    //And of options
                    var i = 1;
                    var personlist = "";
                    var personsinTask = TaskPersons(TSub.ID);
                    $.each(personsinTask, function (i, person) {
                        var aline = document.createElement("a");
                        $(aline).attr('href', '#')
                            .html('<span style="font-size:20px;color:red!important" class="glyphicon glyphicon-trash"></span>')
                            .on('click', function () {
                                if (personsinTask.length > 1) {
                                    bootbox.dialog({
                                        title: settings.i18n.removePersonFRTaskTitle,
                                        message: settings.i18n.removepersondescription.replace(/YYY/g, person.Name + " " + person.SurName),
                                        buttons: {
                                            cancel: {
                                                label: settings.i18n.keep,
                                                className: 'btn-success',
                                                callback: function () {

                                                }
                                            },
                                            deletepersononly: {
                                                label: settings.i18n.remove,
                                                className: 'btn-warning',
                                                callback: function () {

                                                    RemovePersonFrTask(person.TTPID);
                                                    $(DivCalendar).remove();
                                                    CreateCalendar(settings.date.current);
                                                    CreateRightMenuTaskInfoEdit(TaskID, UserID, SubID);
                                                }
                                            }

                                        }
                                    });
                                }
                                else {
                                    bootbox.dialog({
                                        title: settings.i18n.removePersonFRTaskTitle,
                                        message: settings.i18n.removelastpersondescription.replace(/YYY/g, person.Name + " " + person.SurName),
                                        buttons: {
                                            cancel: {
                                                label: settings.i18n.keep,
                                                className: 'btn-success',
                                                callback: function () {

                                                }
                                            },
                                            deletepersononly: {
                                                label: settings.i18n.removepersononly,
                                                className: 'btn-warning',
                                                callback: function () {
                                                    RemovePersonFrTask(person.TTPID);
                                                    $(DivCalendar).remove();
                                                    CreateCalendar(settings.date.current);
                                                    CreateRightMenuTaskInfoEdit(TaskID, "", "");
                                                }
                                            },
                                            deletetaskandperson: {
                                                label: settings.i18n.removepersonanddeletetask,
                                                className: 'btn-danger',
                                                callback: function () {
                                                    RemovePersonFrTask(person.TTPID);
                                                    RemoveTask(TaskID);
                                                    $(DivCalendar).remove();
                                                    CreateCalendar(settings.date.current);
                                                    CreateRightMenuTaskInfoEdit(TaskID, "", "");
                                                }
                                            }
                                        }
                                    });
                                }

                            })
                            .appendTo(td);
                        var listspan = document.createElement("span");
                        $(listspan).attr('style', 'color: black');
                        if (person.PersonID == UserID) {
                            $(listspan).attr('style', 'color: blue');
                        }
                        var ListP = document.createTextNode(person.Name + " " + person.SurName);

                        $(ListP).appendTo(listspan);
                        $(listspan).appendTo(td);

                        $(selectAddPerson).find('[value="' + person.PersonID + '"]').remove();
                        $(selectAddPerson).selectpicker("refresh");

                        var brline = document.createElement("br");
                        $(brline).appendTo(td);
                        i++;
                    });

                });

                ////////NEW LINE CELLS ///////////////
                var tr = document.createElement('TR');
                tableBody.appendChild(tr);

                var td = document.createElement('TD');
                td.classList.add('text-left');
                tr.appendChild(td);

                var BtnSubSave = document.createElement('button');
                BtnSubSave.id = 'BtnSubSave';
                $(BtnSubSave).addClass('btn btn-block btn-info glyphicon glyphicon-floppy-save')
                        .html(" " + settings.i18n.Save)
                        .on('click', function () {
                            if ($(NewInputTBegin).val() != "" && $(NewInputTEnd).val() != "") {
                                AddSubToTask(TaskID, $(NewInputTTypeT).val(), $(NewInputTBegin).val(), $(NewInputTEnd).val(), $(NewInputSubDesc).val());
                                $(DivCalendar).remove();
                                CreateCalendar(settings.date.current);
                                CreateRightMenuTaskInfoEdit(TaskID, "", "");
                                $(EditPanelTaskInfoDiv).modal('show');
                            }
                            else {
                                bootbox.dialog({
                                    title: settings.i18n.InsufficientInfoTitle,
                                    message: settings.i18n.InsufficientInfoSUB,
                                    buttons: {
                                        cancel: {
                                            label: settings.i18n.Close,
                                            className: 'btn-warning',
                                            callback: function () {

                                            }
                                        }

                                    }
                                });
                            }
                        })
                        .appendTo(td);

                var td = document.createElement('TD');
                td.classList.add('text-left');
                td.setAttribute("id", "NewtdTTypeT");
                tr.appendChild(td);

                var NewInputTTypeT = document.createElement("select");
                NewInputTTypeT.setAttribute("id", "NewInputTTypeT");
                NewInputTTypeT.classList.add('form-control');
                NewInputTTypeT.setAttribute("title", settings.i18n.SelectTypeForTask);
                NewInputTTypeT.setAttribute("data-header", settings.i18n.SelectTypeForTask);
                CreateSelectOptions(NewInputTTypeT, "[Task-Properties]", "ID", "Task_Name", "Task_Class");
                td.appendChild(NewInputTTypeT);
                $(NewInputTTypeT).selectpicker()
                                    .on('change', function () {
                                        $("#NewtdTTypeT").attr('class', $(NewInputTTypeT).find(':selected').attr('Class'));
                                    });

                var td = document.createElement('TD');
                td.classList.add('text-left');
                tr.appendChild(td);

                var NewTimesDiv = document.createElement('div');
                td.appendChild(NewTimesDiv);
                /////////// TaskSub Begin ////////////////
                var NewTimesBeginDiv = document.createElement('div');
                NewTimesBeginDiv.id = "NewTimesBeginDiv";
                $(NewTimesBeginDiv).addClass('input-group date');
                NewTimesDiv.appendChild(NewTimesBeginDiv);

                var NewInputTBegin = document.createElement('input');
                NewInputTBegin.id = "NewInputTBegin";
                NewInputTBegin.classList.add('form-control');
                $(NewInputTBegin).attr('type', 'text');
                $(NewInputTBegin).attr('disabled', 'true');
                NewTimesBeginDiv.appendChild(NewInputTBegin);

                var NewHiddenTBegin = document.createElement('input');
                NewHiddenTBegin.id = "NewHiddenTBegin";
                NewHiddenTBegin.classList.add('datepickerinput');
                $(NewHiddenTBegin).attr('type', 'hidden');
                NewTimesBeginDiv.appendChild(NewHiddenTBegin);

                var NewSpanTBegin = document.createElement('span');
                NewSpanTBegin.classList.add('input-group-addon');
                $(NewSpanTBegin).html('<span class="glyphicon glyphicon-calendar"></span>');
                NewTimesBeginDiv.appendChild(NewSpanTBegin);

                /////////// TaskSub End ////////////////
                var NewTimesEndDiv = document.createElement('div');
                NewTimesEndDiv.id = "NewTimesEndDiv";
                $(NewTimesEndDiv).addClass('input-group date');
                NewTimesDiv.appendChild(NewTimesEndDiv);

                var NewInputTEnd = document.createElement('input');
                NewInputTEnd.id = "NewInputTEnd";
                NewInputTEnd.width = "200px";
                NewInputTEnd.classList.add('form-control');
                $(NewInputTEnd).attr('disabled', 'true');
                $(NewInputTEnd).attr('type', 'text');
                NewTimesEndDiv.appendChild(NewInputTEnd);

                var NewHiddenTEnd = document.createElement('input');
                NewHiddenTEnd.id = "NewHiddenTEnd";
                NewHiddenTEnd.classList.add('datepickerinput');
                $(NewHiddenTEnd).attr('type', 'hidden');
                NewTimesEndDiv.appendChild(NewHiddenTEnd);

                var NewSpanTEnd = document.createElement('span');
                NewSpanTEnd.classList.add('input-group-addon');
                $(NewSpanTEnd).html('<span class="glyphicon glyphicon-calendar"></span>');
                NewTimesEndDiv.appendChild(NewSpanTEnd);
                //////// TIME PİCKER SETTINGS //////////////
                $(NewTimesBeginDiv).datetimepicker({
                    locale: settings.locale,
                    format: 'DD.MM.YYYY HH:mm',
                    sideBySide: true,
                    showTodayButton: true,
                    toolbarPlacement: "bottom",
                    showClose: true,
                    allowInputToggle: true,
                    defaultDate: moment(Date()).hours(0).minutes(0).seconds(0).milliseconds(0)
                });
                $(NewTimesEndDiv).datetimepicker({
                    locale: settings.locale,
                    format: 'DD.MM.YYYY HH:mm',
                    sideBySide: true,
                    useCurrent: false, //Important! See issue #1075
                    showTodayButton: true,
                    toolbarPlacement: "bottom",
                    showClose: true,
                    allowInputToggle: true,
                    defaultDate: moment(Date()).hours(23).minutes(59).seconds(59).milliseconds(0)
                });
                $(NewTimesBeginDiv).on("dp.change", function (e) {
                    $(NewInputTBegin).val($(NewHiddenTBegin).val());
                    $(NewTimesEndDiv).data("DateTimePicker").minDate(e.date);
                });
                $(NewTimesEndDiv).on("dp.change", function (e) {
                    $(NewInputTEnd).val($(NewHiddenTEnd).val());
                    $(NewTimesBeginDiv).data("DateTimePicker").maxDate(e.date);
                });
                $(NewInputTBegin).val(moment(Date()).hours(0).minutes(0).seconds(0).milliseconds(0).format("DD.MM.YYYY HH:mm"));
                $(NewTimesBeginDiv).data("DateTimePicker").maxDate(moment(Date()).hours(23).minutes(59).seconds(59).milliseconds(0).format("DD.MM.YYYY HH:mm"));
                $(NewInputTEnd).val(moment(Date()).hours(23).minutes(59).seconds(59).milliseconds(0).format("DD.MM.YYYY HH:mm"));
                $(NewTimesEndDiv).data("DateTimePicker").minDate(moment(Date()).hours(0).minutes(0).seconds(0).milliseconds(0).format("DD.MM.YYYY HH:mm"));

                var td = document.createElement('TD');
                td.classList.add('text-left');
                tr.appendChild(td);

                var NewInputSubDesc = document.createElement('textarea');
                NewInputSubDesc.id = "NewInputSubDesc";
                NewInputSubDesc.maxLength = "5000";
                NewInputSubDesc.cols = "50";
                NewInputSubDesc.rows = "7";
                td.appendChild(NewInputSubDesc);

                var td = document.createElement('TD');
                td.classList.add('text-left');
                $(td).html(settings.i18n.PersonsCanbeAddLater);
                tr.appendChild(td);

                EdittdTSubT.appendChild(EditSubtable);




            }

            //-----END OF RIGHT MENU-TASK INFO EDİT----//



            ///////////////////////////////////PERSON LINES//////////////////////////////////////////////




            function CreatePersonLines(calendarTable, ColumnsNumber, cellWidth, FirstColumnDate, Interval) {
                var TableWidth = Math.floor($(calendarTable).outerWidth());
                var Users = AllUsers();
                var i = 0;
                $("#CalendarTable > tbody > tr").each(function (index, row) {
                    if ($(row.cells[0]).attr("data-personID") != null) {
                        var xcollusicon = 0;
                        var user = PersonInfo($(row.cells[0]).attr("data-personID"))[0];
                        var FirstWidth = $("td[data-personID='" + user.ID + "']").outerWidth();
                        var SecondWidth = $(CalendarTable).find("th:nth-child(2)").outerWidth();
                        var FirstRowHeight = $("td[data-personID='" + user.ID + "']").outerHeight();
                        var LeftStartPos = $("td[data-personID='" + user.ID + "']").offset().left + FirstWidth + SecondWidth;
                        var TopStartPos = $("td[data-personID='" + user.ID + "']").offset().top;
                        var UsableWidth = TableWidth - (FirstWidth+SecondWidth);
                        var userTasks = PersonTasks(user.ID);

                        userTasks.forEach(function (task) {
                            var personsinTask = TaskPersons(task.SubID);
                            var popovertaskusersP = "<p><b>" + settings.i18n.AssignedPersonToTask + " (" + personsinTask.length + ")</b>";
                            var i = 1;
                            personsinTask.forEach(function (person) {
                                popovertaskusersP = popovertaskusersP + "<br/><b>" + i + ".</b> " + person.Name + " " + person.SurName;
                                i++;
                            });
                            popovertaskusersP = popovertaskusersP + "</p>";

                            var checkLineToShow = false;
                            var taskDivLine = document.createElement('div');
                            $(taskDivLine).addClass('DivLine').addClass('Group' + user.GroupID);
                            $(taskDivLine).attr("data-personID", user.ID);
                            if (settings.showInfoBox == true) {
                                var subinfotext = "<p><b>" + settings.i18n.TaskTimes + "</b>";
                                var TaskSubInfo = TaskSubPeriod(task.SubID);
                                $.each(TaskSubInfo, function (index, TaskSub) {
                                    subinfotext = subinfotext + "<br/>" + moment(TaskSub.Begin).format('DD MMMM YYYY HH:mm') + "<br/>" + moment(TaskSub.End).format('DD MMMM YYYY HH:mm');
                                });
                                subinfotext = subinfotext + "<p/>"
                                $(taskDivLine).popover({
                                    title: '<h3><span class="glyphicon glyphicon-info-sign"></span>' + task.TaskID + '/' + task.SubID + '</h3><br/>' + task.TaskName,
                                    content: '<p><b>' + settings.i18n.TaskDescription + '</b><br/>' + task.TaskDesc + '</p><p><b>' + settings.i18n.TaskSubDesc + '</b><br/>' + task.TaskSubDesc + '</p><p>' + subinfotext + '</p><p>' + popovertaskusersP + '</p>',
                                    placement: "bottom",
                                    html: true,
                                    trigger: "hover",
                                    template: '<div class="popover popover-medium"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title ' + task.TaskClass + '"></h3><div class="popover-content"><p></p></div></div></div>'
                                });
                            }

                            var taskTitle = document.createElement('p');
                            $(taskTitle).addClass('DivLine-label')
                                    .html(task.TaskID)
                                    .appendTo(taskDivLine);

                            var TaskFr = moment(task.TaskBegin);
                            var TaskTo = moment(task.TaskEnd);
                            var CalFr = moment(FirstColumnDate);
                            var CalTo = moment(FirstColumnDate).add(ColumnsNumber, Interval);

                            var xUsableWidth = CalTo.diff(CalFr, 'miliseconds');
                            var xInterval = UsableWidth / xUsableWidth; // Finds the pixel with for 1 miliseconds

                            if ((TaskFr.diff(CalFr) < 0 && TaskTo.diff(CalFr) < 0) || (TaskFr.diff(CalTo) > 0 && TaskTo.diff(CalTo) > 0)) {
                                checkLineToShow = false;
                            }
                            else {
                                if ((TaskFr.diff(CalFr) >= 0 && TaskTo.diff(CalTo) <= 0)) {
                                    TaskLeftStartPos = (LeftStartPos + TaskFr.diff(CalFr, 'miliseconds') * xInterval);
                                    TaskWidth = (TaskTo.diff(TaskFr, 'miliseconds') * xInterval);
                                    checkLineToShow = true;
                                    $(taskDivLine).addClass('complete').addClass(task.TaskClass)
                                }
                                else {
                                    if ((TaskFr.diff(CalFr) < 0 && TaskTo.diff(CalTo) <= 0)) {
                                        TaskLeftStartPos = LeftStartPos;
                                        TaskWidth = (TaskTo.diff(CalFr, 'miliseconds') * xInterval);
                                        checkLineToShow = true;
                                        $(taskDivLine).addClass('end').addClass(task.TaskClass)
                                    }

                                    if ((TaskFr.diff(CalFr) >= 0 && TaskTo.diff(CalTo) > 0)) {
                                        TaskLeftStartPos = (LeftStartPos + TaskFr.diff(CalFr, 'miliseconds') * xInterval);
                                        TaskWidth = (CalTo.diff(TaskFr, 'miliseconds') * xInterval);
                                        checkLineToShow = true;
                                        $(taskDivLine).addClass('start').addClass(task.TaskClass)
                                    }

                                    if ((TaskFr.diff(CalFr) < 0 && TaskTo.diff(CalTo) > 0)) {

                                        TaskLeftStartPos = LeftStartPos;
                                        TaskWidth = (CalTo.diff(CalFr, 'miliseconds') * xInterval);
                                        checkLineToShow = true;
                                        $(taskDivLine).addClass('middle').addClass(task.TaskClass)
                                    }
                                }

                            }


                            if (checkLineToShow) {

                                $(taskDivLine)
                                  .css({ top: TopStartPos, left: TaskLeftStartPos, width: TaskWidth, height: FirstRowHeight })
                                  .attr("data-toggle", "modal")
                                  .attr("data-target", "#RightTaskInfoPanelDiv")
                                  .attr("data-DivTopDiff", 0)
                                  .on('click', function () {
                                      CreateRightMenuTaskInfo(task.TaskID, user.ID, task.SubID);
                                  })
                                  .appendTo('body');

                                var hit_list = $(taskDivLine).collision(".DivLine");
                                if (hit_list.length > 1) {
                                    xcollusicon = xcollusicon + 1;
                                    for (i = 1; i < xcollusicon + 1; i++) {
                                        $("td[data-personID='" + user.ID + "']").outerHeight(FirstRowHeight * (i + 1));
                                        $(taskDivLine).css({ top: TopStartPos + FirstRowHeight * i, left: TaskLeftStartPos, width: TaskWidth, height: FirstRowHeight });
                                        $(taskDivLine).attr("data-DivTopDiff", FirstRowHeight * i);
                                        var hit_list2 = $(taskDivLine).collision(".DivLine");
                                        if (hit_list2.length == 1) { break; }
                                    }

                                }
                                if (checkOverflow(taskDivLine) == true) {
                                    $(taskDivLine).html('');
                                }

                            }
                        })
                    }
                });
            }

            ////////////////////////////////////////TASKLINES///////////////////////////////////
            function CreateTaskLines(calendarTable, ColumnsNumber, cellWidth, FirstColumnDate, Interval) {

                var TableWidth = Math.floor($(calendarTable).outerWidth());
                var i = 0;
                $("#CalendarTable > tbody > tr").each(function (index, row) {
                    if ($(row.cells[0]).attr("data-WorkgroupID") != null) {
                        var xcollusicon = 0;
                        var workgr = $(row.cells[0]).attr("data-WorkgroupID");

                        var FirstWidth = $("td[data-WorkgroupID='" + workgr + "']").outerWidth();
                        var FirstRowHeight = $("td[data-WorkgroupID='" + workgr + "']").outerHeight();
                        var LeftStartPos = $("td[data-WorkgroupID='" + workgr + "']").offset().left + FirstWidth;
                        var TopStartPos = $("td[data-WorkgroupID='" + workgr + "']").offset().top;
                        var UsableWidth = TableWidth - FirstWidth;
                        var workGrTasks = WorkGrTasks(workgr);

                        workGrTasks.forEach(function (task) {
                            var personsinTask = TaskPersons(task.SubID);
                            var popovertaskusersP = "<p><b>" + settings.i18n.AssignedPersonToTask + " (" + personsinTask.length + ")</b>";
                            var i = 1;
                            personsinTask.forEach(function (person) {
                                popovertaskusersP = popovertaskusersP + "<br/><b>" + i + ".</b> " + person.Name + " " + person.SurName;
                                i++;
                            });
                            popovertaskusersP = popovertaskusersP + "</p>";

                            var checkLineToShow = false;
                            var taskDivLine = document.createElement('div');
                            $(taskDivLine).addClass('DivLine');
                            if (settings.showInfoBox == true) {
                                var subinfotext = "<p><b>" + settings.i18n.TaskTimes + "</b>";
                                var TaskSubInfo = TaskSubPeriod(task.SubID);
                                $.each(TaskSubInfo, function (index, TaskSub) {
                                    subinfotext = subinfotext + "<br/>" + moment(TaskSub.Begin).format('DD MMMM YYYY HH:mm') + "<br/>" + moment(TaskSub.End).format('DD MMMM YYYY HH:mm');
                                });
                                subinfotext = subinfotext + "<p/>";

                                $(taskDivLine).popover({
                                    title: '<h3><span class="glyphicon glyphicon-info-sign"></span>' + task.TaskID + '/' + task.SubID + '</h3><br/>' + task.TaskName,
                                    content: '<p><b>' + settings.i18n.TaskDescription + '</b><br/>' + task.TaskDesc + '</p><p><b>' + settings.i18n.TaskSubDesc + '</b><br/>' + task.TaskSubDesc + '</p><p>' + subinfotext + '</p><p>' + popovertaskusersP + '</p>',
                                    placement: "bottom",
                                    html: true,
                                    trigger: "hover",
                                    template: '<div class="popover popover-medium"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title ' + task.TaskClass + '"></h3><div class="popover-content"><p></p></div></div></div>'
                                });
                            }

                            var taskTitle = document.createElement('p');
                            $(taskTitle).addClass('DivLine-label')
                                    .html(task.TaskID)
                                    .appendTo(taskDivLine);

                            var TaskFr = moment(task.TaskBegin);
                            var TaskTo = moment(task.TaskEnd);
                            var CalFr = moment(FirstColumnDate);
                            var CalTo = moment(FirstColumnDate).add(ColumnsNumber, Interval);

                            var xUsableWidth = CalTo.diff(CalFr, 'miliseconds');
                            var xInterval = UsableWidth / xUsableWidth; // Finds the pixel with for 1 miliseconds

                            if ((TaskFr.diff(CalFr) < 0 && TaskTo.diff(CalFr) < 0) || (TaskFr.diff(CalTo) > 0 && TaskTo.diff(CalTo) > 0)) {
                                checkLineToShow = false;
                            }
                            else {
                                if ((TaskFr.diff(CalFr) >= 0 && TaskTo.diff(CalTo) <= 0)) {
                                    TaskLeftStartPos = (LeftStartPos + TaskFr.diff(CalFr, 'miliseconds') * xInterval);
                                    TaskWidth = (TaskTo.diff(TaskFr, 'miliseconds') * xInterval);
                                    checkLineToShow = true;
                                    $(taskDivLine).addClass('complete').addClass(task.TaskClass)
                                }
                                else {
                                    if ((TaskFr.diff(CalFr) < 0 && TaskTo.diff(CalTo) <= 0)) {
                                        TaskLeftStartPos = LeftStartPos;
                                        TaskWidth = (TaskTo.diff(CalFr, 'miliseconds') * xInterval);
                                        checkLineToShow = true;
                                        $(taskDivLine).addClass('end').addClass(task.TaskClass)
                                    }

                                    if ((TaskFr.diff(CalFr) >= 0 && TaskTo.diff(CalTo) > 0)) {
                                        TaskLeftStartPos = (LeftStartPos + TaskFr.diff(CalFr, 'miliseconds') * xInterval);
                                        TaskWidth = (CalTo.diff(TaskFr, 'miliseconds') * xInterval);
                                        checkLineToShow = true;
                                        $(taskDivLine).addClass('start').addClass(task.TaskClass)
                                    }

                                    if ((TaskFr.diff(CalFr) < 0 && TaskTo.diff(CalTo) > 0)) {

                                        TaskLeftStartPos = LeftStartPos;
                                        TaskWidth = (CalTo.diff(CalFr, 'miliseconds') * xInterval);
                                        checkLineToShow = true;
                                        $(taskDivLine).addClass('middle').addClass(task.TaskClass)
                                    }
                                }

                            }


                            if (checkLineToShow) {

                                $(taskDivLine)
                                  .css({ top: TopStartPos, left: TaskLeftStartPos, width: TaskWidth, height: FirstRowHeight })
                                  .attr("data-toggle", "modal")
                                  .attr("data-target", "#RightTaskInfoPanelDiv")
                                  .on('click', function () {
                                      CreateRightMenuTaskInfo(task.TaskID, "", task.SubID);
                                  }).hover(function () { $(".DivLine").hover(); })
                                  .appendTo('body');

                                var hit_list = $(taskDivLine).collision(".DivLine");
                                if (hit_list.length > 1) {
                                    xcollusicon = xcollusicon + 1;
                                    for (i = 1; i < xcollusicon + 1; i++) {
                                        $("td[data-WorkgroupID='" + workgr + "']").outerHeight(FirstRowHeight * (i + 1));
                                        $(taskDivLine).css({ top: TopStartPos + FirstRowHeight * i, left: TaskLeftStartPos, width: TaskWidth, height: FirstRowHeight });
                                        var hit_list2 = $(taskDivLine).collision(".DivLine");
                                        if (hit_list2.length == 1) { break; }
                                    }

                                }
                                if (checkOverflow(taskDivLine) == true) {
                                    $(taskDivLine).html('');
                                }

                            }
                        })
                    }
                });
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            function checkOverflow(element) {
                if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
                    return true;
                } else {
                    return false;
                }
            };
        };
        return $scheduler;
    });

    