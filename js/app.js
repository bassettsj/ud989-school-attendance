/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col')
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/**
 * Sudent Attendance Application
 */
$(function(global) {
    AttendanceCtrl = function AttendanceCtrl () {
        this.model = JSON.parse(localStorage.attendance);
    };

    AttendanceCtrl.prototype = {
        getAllNames: function getAllNames () {
            return Object.getOwnPropertyNames(this.model);
        },
        getName: function getName(index) {
            var names = this.getAllNames();
            return names[index];
        },
        getAll: function getAll () {
            return this.model;
        },
        get: function get (name) {
            return this.model[name];
        },
        set: function set (name, attendance) {
            this.model[name] = attendance;
            this.save();
        },
        save: function save () {
            localStorage.attendance = JSON.stringify(this.model);
        },
        countMissing: function countMissing (student) {
            var total = 0;
            var days = this.model[student];
            days.forEach(function (day) {
                if (!day) {
                    total++;
                }
            });
            return total;
        }
    };

    function AttendanceView (ctrl, el) {
        this.ctrl = ctrl;
        this.el = el;
        this.init();
        this.render();
    }

    AttendanceView.prototype = {
        init: function init () {
            var _this = this;
            _this.rows = this.el.find('tr.student');
            _this.inputs = [];
            _this.missed = [];
            this.rows.each(function (i, row) {
                var name = _this.ctrl.getName(i);
                var currentAttendance = _this.ctrl.get(name);
                _this.inputs[i] = $(row).find('input');
                _this.missed[i] = $(row).find('td.missed-col');
                _this.inputs[i].each(function (inputIndex, input) {
                    $(input).on('click', function () {
                        currentAttendance[inputIndex] = $(input).prop('checked');
                        _this.ctrl.set(name, currentAttendance);
                        _this.render();
                    });
                });
            });
        },
        render: function render () {
            var inputs, studentAttendance, name;
            for (var i = 0; i < this.rows.length; i++) {
                name = this.ctrl.getName(i);
                studentAttendance = this.ctrl.get(name);
                inputs = this.inputs[i];
                for (var j = 0; j < inputs.length; j++) {
                    $(inputs[j]).prop('checked', studentAttendance[j]);
                }

                this.missed[i].text(this.ctrl.countMissing(name));
            }
        }
    };


    var app = global.app ? global.app : {};
    global.app = app;
    var ctrl = app.ctrl = new AttendanceCtrl();

    var view = app.view =  new AttendanceView(ctrl, $('table'));



}(window));
