(function ($) {

    $.fn.responsiveMonthRange = function (options) {
        var container = this;
        container.settings = $.extend({}, $.fn.responsiveMonthRange.defaults, options);
        container.settings.currentDate = container.settings.defaultDate;
        console.log(container.settings);

        // if (container.settings.defaultDate.start.month < 10)
        //     container.settings.cStartDate = parseInt("" + container.settings.defaultDate.start.year + '0' + container.settings.defaultDate.start.month + "");
        // else
        //     container.settings.cStartDate = parseInt("" + container.settings.defaultDate.start.year + container.settings.defaultDate.start.month + "");
        // if (container.settings.defaultDate.end.month < 10)
        //     container.settings.cEndDate = parseInt("" + container.settings.defaultDate.end.year + '0' + container.settings.defaultDate.end.month + "");
        // else
        //     container.settings.cEndDate = parseInt("" + container.settings.defaultDate.end.year + container.settings.defaultDate.end.month + "");


        this.append('<div class="mrp-container nav navbar-nav">' +
            '<span class="mrp-icon"><i class="fa fa-calendar"></i></span>' +
            '<div class="mrp-monthdisplay">' +
            '<span class="mrp-lowerMonth">Jul 2014</span>' +
            '<span class="mrp-to"> to </span>' +
            '<span class="mrp-upperMonth">Aug 2014</span>' +
            '</div>' +
            '<input type="hidden" value="201407" class="mrp-lowerDate" />' +
            '<input type="hidden" value="201408" class="mrp-upperDate" />' +
            '</div>');
        var content = '<div class="row mpr-calendarholder">';
        var calendarCount = container.settings.defaultDate.end.year - container.settings.defaultDate.start.year;
        if (calendarCount == 0)
            calendarCount++;
        var d = new Date();
        for (y = 0; y < 2; y++) {
            content += '<div class="calendar-column col-xs-5" >' +
                '<div class="mpr-calendar row mpr-calendar-' + (y + 1) + '" >'//id="mpr-calendar-' + (y+1) + '">'
                + '<h5 class="col-xs-12">' +
                '<i class="mpr-yeardown fa fa-arrow-left" data-value="'+(y+1)+'"></i>' + '<span class="year-label-'+(y+1)+'">' + (container.settings.defaultDate.start.year + y).toString() + '</span>' + '<i class="mpr-yearup fa fa-arrow-right" data-value="'+(y+1)+'"></i>' +
                '</h5>' +
                '<div class="mpr-monthsContainer">' +
                '<div class="mpr-MonthsWrapper">';
            for (m = 0; m < 12; m++) {
                var monthval;
                if ((m + 1) < 10)
                    monthval = "0" + (m + 1);
                else
                    monthval = "" + (m + 1);
                content += '<span data-month="' + monthval + '" class="col-xs-4 mpr-month">' + container.settings.MONTHS[m] + '</span>';
            }
            content += '</div></div></div></div>';
        }
        content += '<div class="button-column col-xs-2">';
        // content += '<h5 class="mpr-quickset">Quick Set</h5>';
        content += '<button class="btn btn-info mpr-fiscal-ytd">Fiscal YTD</button>';
        content += '<button class="btn btn-info mpr-ytd">Year to date</button>';
        content += '<button class="btn btn-info mpr-prev-fiscal">Previous FY</button>';
        content += '<button class="btn btn-info mpr-prev-year">Previous Year</button>';
        content += '<button class="btn btn-primary btn-apply">Apply</button>';
        content += '</div>';
        content += '</div>';

        // this.append(content);//in popover
        console.log("init : " + container.attr('id'));
        var mprVisible = false;
        var mprpopover = container.find('.mrp-container').popover({
            container: container,//"body",
            placement: "bottom",
            html: true,
            content: content
        }).on('show.bs.popover', function () {
            console.log(container.attr("id") + " : " + ".mrp-container show.bs.popover");
            container.find('.popover').remove();
            var waiter = setInterval(function () {
                if (container.find('.popover').length > 0) {
                    clearInterval(waiter);
                    setViewToCurrentYears(container);
                    paintMonths(container);
                }
            }, 50);
        }).on('shown.bs.popover', function () {
            console.log(container.attr("id") + " : " + ".mrp-container shown.bs.popover");
            mprVisible = true;
        }).on('hidden.bs.popover', function () {
            console.log(container.attr("id") + " : " + ".mrp-container hidden.bs.popover");
            mprVisible = false;
        });

        container.on('click', '.mpr-month', function (e) {
            e.stopPropagation();
            var _settings = container.settings;
            console.log(container.attr("id") + " : " + ".mpr-month");
            $month = $(this);
            var monthnum = $month.data('month');
            // var year = $month.parents('.mpr-calendar').children('h5').children('span').html();
            // console.log("clicked : " + year + "-" + monthnum);

            cStartDate = new Date(_settings.currentDate.start.year, _settings.currentDate.start.month);
            cEndDate = new Date(_settings.currentDate.end.year, _settings.currentDate.end.month);
            if ($month.parents('.mpr-calendar-1').length > 0) {
                //Start Date
                // container.settings.cStartDate = parseInt("" + year + monthnum);
                _settings.currentDate.start.month = monthnum * 1;
                if (cStartDate > cEndDate) {
                    if (_settings.currentDate.start.year != _settings.currentDate.end.year){
                        container.find('.mpr-calendar:last h5 span').html(_settings.currentDate.start.year);
                    }
                    _settings.currentDate.end.year = _settings.currentDate.start.year;
                }
            } else {
                //End Date
                _settings.currentDate.end.month = monthnum * 1;
                if (cStartDate > cEndDate) {
                    if (_settings.currentDate.start.year != _settings.currentDate.end.year)
                        container.find('.mpr-calendar:first h5 span').html(_settings.currentDate.end.year);
                    _settings.currentDate.start.year = _settings.currentDate.end.year
                }
            }

            paintMonths(container);
        });

        container.on('click', '.mpr-yearup', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-yearup");
            var _settings = container.settings;
            e.stopPropagation();
            var calId = $(this).data("value");
            if(calId == 1){//start date
                _settings.currentDate.start.year++;
                _settings.currentDate.start.month = 1;
                var year = _settings.currentDate.start.year;
            }else{//end date
                _settings.currentDate.end.year++;
                _settings.currentDate.end.month = 1;
                var year = _settings.currentDate.end.year;
            }
            container.find(".year-label-"+calId).html("" + year);
            $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
                paintMonths(container);
                $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click', '.mpr-yeardown', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-yeardown");
            var _settings = container.settings;
            e.stopPropagation();
            var calId = $(this).data("value");
            if(calId == 1){//start date
                _settings.currentDate.start.year--;
                _settings.currentDate.start.month = 12;
                var year = _settings.currentDate.start.year;
            }else{//end date
                _settings.currentDate.end.year--;
                _settings.currentDate.end.month = 12;
                var year = _settings.currentDate.end.year;
            }
            container.find(".year-label-"+calId).html("" + year);
            $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
                paintMonths(container);
                $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click', '.mpr-ytd', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-ytd");
            e.stopPropagation();
            var d = new Date();
            container.settings.cStartDate = parseInt(d.getFullYear() + "01");
            var month = d.getMonth() + 1;
            if (month < 9)
                month = "0" + month;
            container.settings.cEndDate = parseInt("" + d.getFullYear() + month);
            container.find('.mpr-calendar').each(function () {
                var $cal = $(this);
                var year = $cal.find('h5 span').html(d.getFullYear());
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
                paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click', '.mpr-prev-year', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-prev-year");
            e.stopPropagation();
            var d = new Date();
            var year = d.getFullYear() - 1;
            container.settings.cStartDate = parseInt(year + "01");
            container.settings.cEndDate = parseInt(year + "12");
            container.find('.mpr-calendar').each(function () {
                var $cal = $(this);
                $cal.find('h5 span').html(year);
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
                paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click', '.mpr-fiscal-ytd', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-fiscal-ytd");
            e.stopPropagation();
            var d = new Date();
            var year;
            if ((d.getMonth() + 1) < container.settings.fiscalDate.month)
                year = d.getFullYear() - 1;
            else
                year = d.getFullYear();
            if (container.settings.fiscalDate.month < 10)
                fm = "0" + container.settings.fiscalDate.month;
            else
                fm = container.settings.fiscalDate.month;
            if (d.getMonth() + 1 < 10)
                cm = "0" + (d.getMonth() + 1);
            else
                cm = (d.getMonth() + 1);
            container.settings.cStartDate = parseInt("" + year + fm);
            container.settings.cEndDate = parseInt("" + d.getFullYear() + cm);
            container.find('.mpr-calendar').each(function (i) {
                var $cal = $(this);
                if (i == 0)
                    $cal.find('h5 span').html(year);
                else
                    $cal.find('h5 span').html(d.getFullYear());
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
                paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click', '.mpr-prev-fiscal', function () {
            console.log(container.attr("id") + " : " + ".mpr-prev-ytd");
            var d = new Date();
            var year;
            if ((d.getMonth() + 1) < container.settings.fiscalDate.month)
                year = d.getFullYear() - 2;
            else
                year = d.getFullYear() - 1;
            if (container.settings.fiscalDate.month < 10)
                fm = "0" + container.settings.fiscalDate.month;
            else
                fm = container.settings.fiscalDate.month;
            if (container.settings.fiscalDate.month - 1 < 10)
                efm = "0" + (container.settings.fiscalDate.month - 1);
            else
                efm = (container.settings.fiscalDate.month - 1);
            container.settings.cStartDate = parseInt("" + year + fm);
            container.settings.cEndDate = parseInt("" + (d.getFullYear() - 1) + efm);
            container.find('.mpr-calendar').each(function (i) {
                var $cal = $(this);
                if (i == 0)
                    $cal.find('h5 span').html(year);
                else
                    $cal.find('h5 span').html(d.getFullYear() - 1);
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
                paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click', '.mpr-calendarholder', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-calendarholder");
            e.preventDefault();
            e.stopPropagation();
        });
        container.on("click", ".mrp-container", function (e) {
            console.log(container.attr("id") + " : " + ".mpr-container");
            if (mprVisible) {
                e.preventDefault();
                e.stopPropagation();
                mprVisible = false;
            }
        });
        container.on("click", ".btn-apply", function (e) {
            setContainerStatus(container);
            container.settings.onApply();
        });
        container.on("click", function (e) {
            if (mprVisible) {
                container.find('.mpr-calendarholder').parents('.popover').fadeOut(200, function () {
                    container.find('.mpr-calendarholder').parents('.popover').remove();
                    container.find('.mrp-container').trigger('click');
                });
                mprVisible = false;
            }
        });

        paintMonths = function (_this) {
            var _settings = _this.settings;
            console.log(_this.attr("id") + " : " + "paint months");
            console.log("Current Date "+ JSON.stringify(_settings.currentDate));
            console.log(_settings);

            _this.find('.mpr-calendar').each(function () {
                var $cal = $(this);
                var year = $cal.find('h5 span').html();
                $cal.find('.mpr-month').each(function (i) {
                    cDate = new Date(year, (i + 1));
                    // if ((i + 1) > 9)
                    //     cDate = parseInt("" + year + (i + 1));
                    // else
                    //     cDate = parseInt("" + year + '0' + (i + 1));
                    cStartDate = new Date(_settings.currentDate.start.year, _settings.currentDate.start.month);
                    cEndDate = new Date(_settings.currentDate.end.year, _settings.currentDate.end.month);
                    if (cDate >= cStartDate && cDate <= cEndDate) {
                        $(this).addClass('mpr-selected');
                    } else {
                        $(this).removeClass('mpr-selected');
                    }
                });
            });
            _this.find('.mpr-calendar .mpr-month').css("background", "");
            //Write Text
            setCurrentYearMonth(_settings);
            //paint months
            if (_settings.currentDate.start.year == parseInt(_this.find('.mpr-calendar:first h5 span').html()))
                _this.find('.mpr-calendar:first .mpr-selected:first').css("background", "#337ab7");
            if (_settings.currentDate.end.year == parseInt(_this.find('.mpr-calendar:last h5 span').html()))
                _this.find('.mpr-calendar:last .mpr-selected:last').css("background", "#337ab7");
        };

        setContainerStatus = function (_this) {
            var _settings = _this.settings;
            setCurrentYearMonth(_settings);
            //edit container values
            cStartDate = new Date(_settings.currentDate.start.year, _settings.currentDate.start.month);
            cEndDate = new Date(_settings.currentDate.end.year, _settings.currentDate.end.month);
            _this.find('.mrp-monthdisplay .mrp-lowerMonth').html(_settings.MONTHS[_settings.currentDate.start.month - 1] + " " + _settings.currentDate.start.year);
            _this.find('.mrp-monthdisplay .mrp-upperMonth').html(_settings.MONTHS[_settings.currentDate.end.month - 1] + " " + _settings.currentDate.end.year);
            _this.find('.mrp-lowerDate').val(cStartDate);
            _this.find('.mrp-upperDate').val(cEndDate);
        }

        setCurrentYearMonth = function (_settings) {
            // var startyear = parseInt(_settings.cStartDate / 100);
            // var startmonth = parseInt(safeRound((_settings.cStartDate / 100 - startyear)) * 100);
            // var endyear = parseInt(_settings.cEndDate / 100);
            // var endmonth = parseInt(safeRound((_settings.cEndDate / 100 - endyear)) * 100);

            // _settings.currentDate.start.year = startyear;
            // _settings.currentDate.start.month = startmonth;
            // _settings.currentDate.end.year = endyear;
            // _settings.currentDate.end.month = endmonth;
        }

        setViewToCurrentYears = function (_this) {
            var _settings = _this.settings;
            // var startyear = parseInt(_this.settings.cStartDate / 100);
            // var endyear = parseInt(_this.settings.cEndDate / 100);
            console.log("Current Date "+ JSON.stringify(_settings.currentDate));
            _this.find('.mpr-calendar h5 span').eq(0).html(_settings.currentDate.start.year);
            _this.find('.mpr-calendar h5 span').eq(1).html(_settings.currentDate.end.year);
        }

        safeRound = function (val) {
            return Math.round(((val) + 0.00001) * 100) / 100;
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
                year: 2015,
                month: 10
            }
        },
        fiscalDate: {
            month: 7
        },
        onApply: function () {
            console.log("apply");
        },
    };

}(jQuery));
