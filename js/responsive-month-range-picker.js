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
                    container.paintMonths();
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

           container.paintMonths();;
        });

        container.on('click', '.mpr-yearup', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-yearup");
            var _settings = container.settings;
            e.stopPropagation();
            var calId = $(this).data("value");
            var bringChange = true;
            if(calId == 1){//start date
                if(_settings.currentDate.start.year == _settings.currentDate.end.year - 1){
                    bringChange = false;
                }else{
                    _settings.currentDate.start.year++;
                    _settings.currentDate.start.month = 1;
                    var year = _settings.currentDate.start.year;
                }
            }else{//end date
                _settings.currentDate.end.year++;
                _settings.currentDate.end.month = 1;
                var year = _settings.currentDate.end.year;
            }
            if(bringChange){
                container.find(".year-label-"+calId).html("" + year);
                $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
                   container.paintMonths();;
                    $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
                });
            }
        });

        container.on('click', '.mpr-yeardown', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-yeardown");
            var _settings = container.settings;
            e.stopPropagation();
            var calId = $(this).data("value");
            var bringChange = true;
            if(calId == 1){//start date
                _settings.currentDate.start.year--;
                _settings.currentDate.start.month = 12;
                var year = _settings.currentDate.start.year;
            }else{//end date
                if(_settings.currentDate.start.year == _settings.currentDate.end.year - 1){
                    bringChange = false;
                }else{
                    _settings.currentDate.end.year--;
                    _settings.currentDate.end.month = 12;
                    var year = _settings.currentDate.end.year;
                }
            }
            if(bringChange){
                container.find(".year-label-"+calId).html("" + year);
                $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
                   container.paintMonths();;
                    $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
                });
            }
        });

        container.on('click', '.mpr-ytd', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-ytd");
            var _settings = container.settings;
            e.stopPropagation();
            var d = new Date();
            _settings.currentDate.start.year = d.getFullYear();
            _settings.currentDate.end.year = d.getFullYear();
            _settings.currentDate.start.month = 1;
            _settings.currentDate.end.month = d.getMonth() + 1;
            container.find('.mpr-calendar').each(function () {
                $(this).find('h5 span').html(d.getFullYear());
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
               container.paintMonths();;
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click', '.mpr-prev-year', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-prev-year");
            var _settings = container.settings;
            e.stopPropagation();
            var d = new Date();
            _settings.currentDate.start.year = d.getFullYear() - 1;
            _settings.currentDate.end.year = d.getFullYear() - 1;
            _settings.currentDate.start.month = 1;
            _settings.currentDate.end.month = 12;

            container.find('.mpr-calendar').each(function () {
                $(this).find('h5 span').html(d.getFullYear() - 1);
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
               container.paintMonths();;
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click', '.mpr-fiscal-ytd', function (e) {
            console.log(container.attr("id") + " : " + ".mpr-fiscal-ytd");
            e.stopPropagation();
            var d = new Date();
            var month = d.getMonth() + 1;
            var _settings = container.settings;
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
            container.find('.mpr-calendar').each(function (i) {
                var $cal = $(this);
                if (i == 0)
                    $cal.find('h5 span').html(startyear);
                else
                    $cal.find('h5 span').html(endyear);
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
               container.paintMonths();;
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click', '.mpr-prev-fiscal', function () {
            console.log(container.attr("id") + " : " + ".mpr-prev-ytd");
            var d = new Date();
            var month = d.getMonth() + 1;
            var _settings = container.settings;
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

            container.find('.mpr-calendar').each(function (i) {
                var $cal = $(this);
                if (i == 0)
                    $cal.find('h5 span').html(startyear);
                else
                    $cal.find('h5 span').html(endyear);
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175, function () {
               container.paintMonths();;
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
            container.setContainerStatus();
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

        container.paintMonths = function () {
            var _settings = container.settings;
            console.log(container.attr("id") + " : " + "paint months");
            console.log("Current Date "+ JSON.stringify(_settings.currentDate));
            console.log(_settings);

            container.find('.mpr-calendar').each(function () {
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
            container.find('.mpr-calendar .mpr-month').css("background", "");
            //paint months
            if (_settings.currentDate.start.year == parseInt(container.find('.mpr-calendar:first h5 span').html()))
                container.find('.mpr-calendar:first .mpr-selected:first').css("background", "#337ab7");
            if (_settings.currentDate.end.year == parseInt(container.find('.mpr-calendar:last h5 span').html()))
                container.find('.mpr-calendar:last .mpr-selected:last').css("background", "#337ab7");

            container.find('.mpr-calendar h5 span').eq(0).html(_settings.currentDate.start.year);
            container.find('.mpr-calendar h5 span').eq(1).html(_settings.currentDate.end.year);
        };

        container.setContainerStatus = function () {
            var _settings = container.settings;
            //edit container values
            cStartDate = new Date(_settings.currentDate.start.year, _settings.currentDate.start.month);
            cEndDate = new Date(_settings.currentDate.end.year, _settings.currentDate.end.month);
            container.find('.mrp-monthdisplay .mrp-lowerMonth').html(_settings.MONTHS[_settings.currentDate.start.month - 1] + " " + _settings.currentDate.start.year);
            container.find('.mrp-monthdisplay .mrp-upperMonth').html(_settings.MONTHS[_settings.currentDate.end.month - 1] + " " + _settings.currentDate.end.year);
            container.find('.mrp-lowerDate').val(cStartDate);
            container.find('.mrp-upperDate').val(cEndDate);
        }

        return this;
    };

    safeRound = function (val) {
        return Math.round(((val) + 0.00001) * 100) / 100;
    }

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
