(function ($) {

    $.fn.responsiveMonthRange = function (options) {
        var Self = this;
        Self.settings = $.extend({}, $.fn.responsiveMonthRange.defaults, options);//{} is important to make event caller OK
        var _settings = Self.settings;
        _settings.currentDate = $.extend(true, {}, _settings.defaultDate);
        // console.log(_settings);

        Self.append('<div class="mrp-container nav navbar-nav">' +
            '<span class="mrp-icon"><i class="fa fa-calendar"></i></span>' +
            '<div class="mrp-monthdisplay">' +
            '<span class="mrp-lowerMonth">' + _settings.MONTHS[_settings.currentDate.start.month - 1] + " " + _settings.currentDate.start.year + '</span>' +
            '<span class="mrp-to"> ' + _settings.label.to + ' </span>' +
            '<span class="mrp-upperMonth">' + _settings.MONTHS[_settings.currentDate.end.month - 1] + " " + _settings.currentDate.end.year + '</span>' +
            '</div>' +
            '</div>');
        var content = '<div class="row mpr-calendarholder">';
        for (y = 0; y < 2; y++) {
            content += '<div class="calendar-column col-xs-5" >' +
                '<div class="mpr-calendar row mpr-calendar-' + (y + 1) + '" data-value="' + (y + 1) + '">'
                + '<h5 class="col-xs-12">' +
                '<i class="mpr-yeardown fa fa-arrow-left" data-value="' + (y + 1) + '"></i>' + '<span class="year-label-' + (y + 1) + '">';
            if (y == 0) {
                content += _settings.currentDate.start.year;
            } else {
                content += _settings.currentDate.end.year;
            }
            content += '</span>' + '<i class="mpr-yearup fa fa-arrow-right" data-value="' + (y + 1) + '"></i>' +
                '</h5>' +
                '<div class="mpr-monthsContainer">' +
                '<div class="mpr-MonthsWrapper">';
            for (m = 0; m < 12; m++) {
                content += '<span data-month="' + (m + 1) + '" class="col-xs-4 mpr-month">' + _settings.MONTHS[m] + '</span>';
            }
            content += '</div></div></div></div>';
        }
        content += '<div class="button-column col-xs-2">';
        // content += '<h5 class="mpr-quickset">Quick Set</h5>';
        if (_settings.button.fiscalYtd) {
            content += '<button class="btn btn-info mpr-fiscal-ytd">Fiscal YTD</button>';
        }
        if (_settings.button.ytd) {
            content += '<button class="btn btn-info mpr-ytd">Year to date</button>';
        }
        if (_settings.button.previousFY) {
            content += '<button class="btn btn-info mpr-prev-fiscal">Previous FY</button>';
        }
        if (_settings.button.previousYear) {
            content += '<button class="btn btn-info mpr-prev-year">Previous Year</button>';
        }
        content += '<button class="btn btn-primary btn-apply">Apply</button>';
        content += '</div>';
        content += '</div>';

        var mprVisible = false;
        var mprpopover = Self.find('.mrp-container').popover({
            container: Self,//"body",
            placement: "bottom",
            html: true,
            content: content
        }).on('show.bs.popover', function () {
            console.log(Self.attr("id") + " : " + ".mrp-container show.bs.popover");
            Self.find('.popover').remove();
            var waiter = setInterval(function () {
                if (Self.find('.popover').length > 0) {
                    clearInterval(waiter);
                    Self.setCalendarUI();
                }
            }, 50);
        }).on('shown.bs.popover', function () {
            console.log(Self.attr("id") + " : " + ".mrp-container shown.bs.popover");
            mprVisible = true;
        }).on('hidden.bs.popover', function () {
            console.log(Self.attr("id") + " : " + ".mrp-container hidden.bs.popover");
            mprVisible = false;
        });

        Self.on('click', '.mpr-month', function (e) {
            e.stopPropagation();
            $month = $(this);
            var monthnum = $(this).data('month') * 1;
            if ($month.parents('.mpr-calendar-1').length > 0) {//Start Date
                _settings.currentDate.start.month = monthnum;
            } else {//End Date
                _settings.currentDate.end.month = monthnum;
            }
            Self.setCalendarUI();
        });


        Self.on('click', '.mpr-calendarholder', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        Self.on("click", ".mrp-container", function (e) {
            if (mprVisible) {
                e.preventDefault();
                e.stopPropagation();
                mprVisible = false;
            }
        });

        Self.on('click', '.mpr-yearup', function (e) {
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
                Self.find(".year-label-" + calId).html("" + year);
                Self.setCalendarUI();
            }
        });

        Self.on('click', '.mpr-yeardown', function (e) {
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
                Self.find(".year-label-" + calId).html("" + year);
                Self.setCalendarUI();
            }
        });

        Self.on('click', '.mpr-ytd', function (e) {
            e.stopPropagation();
            var d = new Date();
            var year = d.getFullYear();
            _settings.currentDate.start.year = year;
            _settings.currentDate.end.year = year;
            _settings.currentDate.start.month = 1;
            _settings.currentDate.end.month = d.getMonth() + 1;
            Self.find('.mpr-calendar').each(function () {
                $(this).find('h5 span').html(year);
            });
            Self.setCalendarUI();
        });

        Self.on('click', '.mpr-prev-year', function (e) {
            e.stopPropagation();
            var d = new Date();
            var year = d.getFullYear() - 1;
            _settings.currentDate.start.year = year;
            _settings.currentDate.end.year = year;
            _settings.currentDate.start.month = 1;
            _settings.currentDate.end.month = 12;

            Self.find('.mpr-calendar').each(function () {
                $(this).find('h5 span').html(year);
            });
            Self.setCalendarUI();
        });

        Self.on('click', '.mpr-fiscal-ytd', function (e) {
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
            Self.find('.mpr-calendar').each(function (i) {
                var $cal = $(this);
                if (i == 0)
                    $cal.find('h5 span').html(startyear);
                else
                    $cal.find('h5 span').html(endyear);
            });
            Self.setCalendarUI();
        });

        Self.on('click', '.mpr-prev-fiscal', function () {
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

            Self.find('.mpr-calendar').each(function (i) {
                var $cal = $(this);
                if (i == 0)
                    $cal.find('h5 span').html(startyear);
                else
                    $cal.find('h5 span').html(endyear);
            });
            Self.setCalendarUI();
        });
        Self.on("click", ".btn-apply", function (e) {
            Self.setContainerUI();
            _settings.onApply(_settings.currentDate);//Event listener
        });
        Self.on("click", function (e) {
            if (mprVisible) {
                Self.find('.mpr-calendarholder').parents('.popover').fadeOut(200, function () {
                    Self.find('.mpr-calendarholder').parents('.popover').remove();
                    Self.find('.mrp-container').trigger('click');
                });
                mprVisible = false;
            }
        });


        Self.setCalendarUI = function () {
            // console.log("Current Date " + JSON.stringify(_settings.currentDate));
            console.log(_settings);
            //Add classes for selected
            Self.find('.mpr-calendar').each(function () {
                var calId = $(this).data("value");
                // var year = $(this).find(".mpr-calendar-"+$(this).data("value")).html();
                var year;
                if (calId == 1)
                    year = _settings.currentDate.start.year;
                else
                    year = _settings.currentDate.end.year;
                $(this).find('.mpr-month').each(function (i) {
                    cDate = new Date(year, (i + 1));
                    cStartDate = new Date(_settings.currentDate.start.year, _settings.currentDate.start.month);
                    cEndDate = new Date(_settings.currentDate.end.year, _settings.currentDate.end.month);
                    if (cDate >= cStartDate && cDate <= cEndDate) {
                        $(this).addClass('mpr-selected');
                    } else {
                        $(this).removeClass('mpr-selected');
                    }
                });
            });
            Self.find('.mpr-calendar .mpr-month').css("background", "");
            Self.find('.mpr-calendar .mpr-month').removeClass("mpr-extremity");

            if (_settings.currentDate.start.year == parseInt(Self.find('.mpr-calendar:first h5 span').html()))
                Self.find('.mpr-calendar:first .mpr-selected:first').addClass("mpr-extremity");
            if (_settings.currentDate.end.year == parseInt(Self.find('.mpr-calendar:last h5 span').html()))
                Self.find('.mpr-calendar:last .mpr-selected:last').addClass("mpr-extremity");

            Self.find('.mpr-calendar h5 span').eq(0).html(_settings.currentDate.start.year);
            Self.find('.mpr-calendar h5 span').eq(1).html(_settings.currentDate.end.year);

        };

        Self.setContainerUI = function () {
            //edit container values
            Self.find('.mrp-monthdisplay .mrp-lowerMonth').html(_settings.MONTHS[_settings.currentDate.start.month - 1] + " " + _settings.currentDate.start.year);
            Self.find('.mrp-monthdisplay .mrp-upperMonth').html(_settings.MONTHS[_settings.currentDate.end.month - 1] + " " + _settings.currentDate.end.year);
        }

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
            previousYear: true,
            ytd: true,
            previousFY: true,
            fiscalYtd: true
        },
        onApply: function (e) {
            console.log("apply");
        }
    };

}(jQuery));

