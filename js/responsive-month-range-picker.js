(function ($) {

    $.fn.responsiveMonthRange = function (options) {
        var Self = this;
        Self.settings = $.extend(true, {}, $.fn.responsiveMonthRange.defaults, options);//{} is important to make event caller OK
        var _settings = Self.settings;
        _settings.currentDate = $.extend(true, {}, _settings.defaultDate);
        // console.log(_settings);

        Self.append('<div class="rmrp-container nav navbar-nav">' +
            '<span class="rmrp-icon"><i class="fa fa-calendar"></i></span>' +
            '<div class="rmrp-monthdisplay">' +
            '<span class="rmrp-lowerMonth">' + _settings.MONTHS[_settings.currentDate.start.month - 1] + " " + _settings.currentDate.start.year + '</span>' +
            '<span class="rmrp-to"> ' + _settings.label.to + ' </span>' +
            '<span class="rmrp-upperMonth">' + _settings.MONTHS[_settings.currentDate.end.month - 1] + " " + _settings.currentDate.end.year + '</span>' +
            '</div>' +
            '</div>');
        var popContainerId = "popover-container-"+Self.attr("id");
        $(document.body).append("<div id='"+popContainerId+"'></div>");
        var popContainer = $("#"+popContainerId);
        var content = '<div class="row rmrp-calendarholder">';
        for (y = 0; y < 2; y++) {
            content += '<div class="calendar-column col-xs-5" >' +
                '<div class="rmrp-calendar row rmrp-calendar-' + (y + 1) + '" data-value="' + (y + 1) + '">'
                + '<h5 class="col-xs-12">' +
                '<i class="rmrp-yeardown fa fa-arrow-left" data-value="' + (y + 1) + '"></i>' + '<span class="year-label-' + (y + 1) + '">';
            if (y == 0) {
                content += _settings.currentDate.start.year;
            } else {
                content += _settings.currentDate.end.year;
            }
            content += '</span>' + '<i class="rmrp-yearup fa fa-arrow-right" data-value="' + (y + 1) + '"></i>' +
                '</h5>' +
                '<div class="rmrp-monthsContainer">' +
                '<div class="rmrp-MonthsWrapper">';
            for (m = 0; m < 12; m++) {
                content += '<span data-month="' + (m + 1) + '" class="col-xs-4 rmrp-month">' + _settings.MONTHS[m] + '</span>';
            }
            content += '</div></div></div></div>';
        }
        content += '<div class="button-column col-xs-2">';
        // content += '<h5 class="rmrp-quickset">Quick Set</h5>';
        if (_settings.button.fiscalYtd.show) {
            content += '<button class="btn btn-info rmrp-fiscal-ytd">'+_settings.button.fiscalYtd.label+'</button>';
        }
        if (_settings.button.ytd.show) {
            content += '<button class="btn btn-info rmrp-ytd">'+_settings.button.ytd.label+'</button>';
        }
        if (_settings.button.previousFY.show) {
            content += '<button class="btn btn-info rmrp-prev-fiscal">'+_settings.button.previousFY.label+'</button>';
        }
        if (_settings.button.previousYear.show) {
            content += '<button class="btn btn-info rmrp-prev-year">'+_settings.button.previousYear.label+'</button>';
        }
        content += '<button class="btn btn-primary btn-apply">'+_settings.button.apply.label+'</button>';
        content += '</div>';
        content += '</div>';

        var rmrpVisible = false;
        // popContainer = 'body';//Self
        var rmrppopover = Self.find('.rmrp-container').popover({
            container: popContainer,
            placement: "bottom",
            html: true,
            content: content
        }).on('show.bs.popover', function () {
            console.log(Self.attr("id") + " : " + ".rmrp-container show.bs.popover");
            popContainer.find('.popover').remove();
            var waiter = setInterval(function () {
                if (popContainer.find('.popover').length > 0) {
                    clearInterval(waiter);
                    popContainer.setCalendarUI();
                }
            }, 50);
        }).on('shown.bs.popover', function () {
            console.log(Self.attr("id") + " : " + ".rmrp-container shown.bs.popover");
            rmrpVisible = true;
        }).on('hidden.bs.popover', function () {
            console.log(Self.attr("id") + " : " + ".rmrp-container hidden.bs.popover");
            rmrpVisible = false;
        });

        Self.on('click', '.rmrp-calendarholder', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        Self.on("click", ".rmrp-container", function (e) {
            if (rmrpVisible) {
                e.preventDefault();
                e.stopPropagation();
                rmrpVisible = false;
            }
        });

        Self.setContainerUI = function () {
            //edit container values
            Self.find('.rmrp-monthdisplay .rmrp-lowerMonth').html(_settings.MONTHS[_settings.currentDate.start.month - 1] + " " + _settings.currentDate.start.year);
            Self.find('.rmrp-monthdisplay .rmrp-upperMonth').html(_settings.MONTHS[_settings.currentDate.end.month - 1] + " " + _settings.currentDate.end.year);
        }

        Self.on("click", function (e) {
            e.stopPropagation();
            if (rmrpVisible) {
                popContainer.find('.rmrp-calendarholder').parents('.popover').fadeOut(200, function () {
                    popContainer.find('.rmrp-calendarholder').parents('.popover').remove();
                    popContainer.find('.rmrp-container').trigger('click');
                });
                rmrpVisible = false;
            }
        });

        popContainer.on('click', '.rmrp-month', function (e) {
            e.stopPropagation();
            $month = $(this);
            var monthnum = $(this).data('month') * 1;
            if ($month.parents('.rmrp-calendar-1').length > 0) {//Start Date
                _settings.currentDate.start.month = monthnum;
            } else {//End Date
                _settings.currentDate.end.month = monthnum;
            }
            popContainer.setCalendarUI();
        });

        popContainer.on('click', '.rmrp-yearup', function (e) {
            e.stopPropagation();
            var calId = $(this).data("value");
            var bringChange = true;
            if (calId == 1) {//start date
                if (_settings.currentDate.start.year >= _settings.currentDate.end.year - 1) {
                    bringChange = false;
                } else {
                    _settings.currentDate.start.year++;
                    _settings.currentDate.start.month = 1;
                    var year = _settings.currentDate.start.year;
                }
            } else {//end date
                _settings.currentDate.end.year++;
                _settings.currentDate.end.month = 1;
                var year = _settings.currentDate.end.year;
            }
            if (bringChange) {
                popContainer.find(".year-label-" + calId).html("" + year);
                popContainer.setCalendarUI();
            }
        });

        popContainer.on('click', '.rmrp-yeardown', function (e) {
            e.stopPropagation();
            var calId = $(this).data("value");
            var bringChange = true;
            if (calId == 1) {//start date
                _settings.currentDate.start.year--;
                _settings.currentDate.start.month = 12;
                var year = _settings.currentDate.start.year;
            } else {//end date
                if (_settings.currentDate.start.year >= _settings.currentDate.end.year - 1) {
                    bringChange = false;
                } else {
                    _settings.currentDate.end.year--;
                    _settings.currentDate.end.month = 12;
                    var year = _settings.currentDate.end.year;
                }
            }
            if (bringChange) {
                popContainer.find(".year-label-" + calId).html("" + year);
                popContainer.setCalendarUI();
            }
        });

        popContainer.on('click', '.rmrp-ytd', function (e) {
            e.stopPropagation();
            var d = new Date();
            var year = d.getFullYear();
            _settings.currentDate.start.year = year;
            _settings.currentDate.end.year = year;
            _settings.currentDate.start.month = 1;
            _settings.currentDate.end.month = d.getMonth() + 1;
            popContainer.find('.rmrp-calendar').each(function () {
                $(this).find('h5 span').html(year);
            });
            popContainer.setCalendarUI();
        });

        popContainer.on('click', '.rmrp-prev-year', function (e) {
            e.stopPropagation();
            var d = new Date();
            var year = d.getFullYear() - 1;
            _settings.currentDate.start.year = year;
            _settings.currentDate.end.year = year;
            _settings.currentDate.start.month = 1;
            _settings.currentDate.end.month = 12;

            popContainer.find('.rmrp-calendar').each(function () {
                $(this).find('h5 span').html(year);
            });
            popContainer.setCalendarUI();
        });

        popContainer.on('click', '.rmrp-fiscal-ytd', function (e) {
            e.stopPropagation();
            var d = new Date();
            var month = d.getMonth() + 1;
            var startyear;
            var endyear = d.getFullYear();
            if (month < _settings.fiscalDate.month)
                startyear = d.getFullYear() - 1;
            else
                startyear = d.getFullYear();

            _settings.currentDate.start.year = startyear;
            _settings.currentDate.start.month = _settings.fiscalDate.month;
            _settings.currentDate.end.year = endyear;
            _settings.currentDate.end.month = month;
            popContainer.find('.rmrp-calendar').each(function (i) {
                var $cal = $(this);
                if (i == 0)
                    $cal.find('h5 span').html(startyear);
                else
                    $cal.find('h5 span').html(endyear);
            });
            popContainer.setCalendarUI();
        });

        popContainer.on('click', '.rmrp-prev-fiscal', function () {
            var d = new Date();
            var month = d.getMonth() + 1;
            var startyear;
            var endyear = d.getFullYear() - 1;
            if (month < _settings.fiscalDate.month)
                startyear = d.getFullYear() - 2;
            else
                startyear = d.getFullYear() - 1;

            _settings.currentDate.start.year = startyear;
            _settings.currentDate.start.month = _settings.fiscalDate.month;
            _settings.currentDate.end.year = endyear;
            _settings.currentDate.end.month = _settings.fiscalDate.month - 1;

            popContainer.find('.rmrp-calendar').each(function (i) {
                var $cal = $(this);
                if (i == 0)
                    $cal.find('h5 span').html(startyear);
                else
                    $cal.find('h5 span').html(endyear);
            });
            popContainer.setCalendarUI();
        });

        popContainer.on("click", ".btn-apply", function (e) {
            e.stopPropagation();
            Self.setContainerUI();
            _settings.onApply(_settings.currentDate);//Event listener
        });


        popContainer.setCalendarUI = function () {
            // console.log("Current Date " + JSON.stringify(_settings.currentDate));
            console.log(_settings);
            //Add classes for selected
            popContainer.find('.rmrp-calendar').each(function () {
                var calId = $(this).data("value");
                // var year = $(this).find(".rmrp-calendar-"+$(this).data("value")).html();
                var year;
                if (calId == 1)
                    year = _settings.currentDate.start.year;
                else
                    year = _settings.currentDate.end.year;
                $(this).find('.rmrp-month').each(function (i) {
                    cDate = new Date(year, (i + 1));
                    cStartDate = new Date(_settings.currentDate.start.year, _settings.currentDate.start.month);
                    cEndDate = new Date(_settings.currentDate.end.year, _settings.currentDate.end.month);
                    if (cDate >= cStartDate && cDate <= cEndDate) {
                        $(this).addClass('rmrp-selected');
                    } else {
                        $(this).removeClass('rmrp-selected');
                    }
                });
            });
            popContainer.find('.rmrp-calendar .rmrp-month').css("background", "");
            popContainer.find('.rmrp-calendar .rmrp-month').removeClass("rmrp-extremity");
            popContainer.find('.rmrp-calendar:first .rmrp-selected:first').addClass("rmrp-extremity");
            popContainer.find('.rmrp-calendar:last .rmrp-selected:last').addClass("rmrp-extremity");

            popContainer.find('.rmrp-calendar h5 span').eq(0).html(_settings.currentDate.start.year);
            popContainer.find('.rmrp-calendar h5 span').eq(1).html(_settings.currentDate.end.year);

        };

        return this;
    };

    // Plugin defaults – added as a property on our plugin function.
    $.fn.responsiveMonthRange.defaults = {
        MONTHS: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        defaultDate: {
            start: {
                year: 2014,
                month: 3
            },
            end: {
                year: 2016,
                month: 10
            }
        },
        fiscalDate: {
            month: 7
        },
        label: {
            to: "to"
        },
        button: {
            previousYear: {show: true, label:"Previous Year"},
            ytd: {show: true, label:"Year To Date"},
            previousFY: {show: true, label:"Previous FY"},
            fiscalYtd: {show: true, label:"Fiscal YTD"},
            apply: {label:"Apply"}
        },
        onApply: function (e) {
            console.log("apply");
        }
    };

}(jQuery));

