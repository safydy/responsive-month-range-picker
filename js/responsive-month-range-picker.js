
(function ( $ ) {

    $.fn.responsiveMonthRange = function( options ) {
        var settings = $.extend({}, $.fn.responsiveMonthRange.defaults, options);
        console.log(settings);

        if(settings.defaultDate.start.month < 10)
            settings.cStartDate = parseInt("" + settings.defaultDate.start.year + '0' + settings.defaultDate.start.month + "");
        else
            settings.cStartDate = parseInt("" + settings.defaultDate.start.year  + settings.defaultDate.start.month + "");
        if(settings.defaultDate.end.month < 10)
            settings.cEndDate = parseInt("" + settings.defaultDate.end.year + '0' + settings.defaultDate.end.month + "");
        else
            settings.cEndDate = parseInt("" + settings.defaultDate.end.year + settings.defaultDate.end.month + "");

        var container = this;
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
        var calendarCount = settings.defaultDate.end.year - settings.defaultDate.start.year;
        if(calendarCount == 0)
            calendarCount++;
        var d = new Date();
        for(y = 0; y < 2; y++){
            content += '<div class="col-xs-6" ><div class="mpr-calendar row mpr-calendar-' + (y+1) + '" >'//id="mpr-calendar-' + (y+1) + '">'
                + '<h5 class="col-xs-12"><i class="mpr-yeardown fa fa-chevron-circle-left"></i><span>' + (settings.defaultDate.start.year + y).toString() + '</span><i class="mpr-yearup fa fa-chevron-circle-right"></i></h5><div class="mpr-monthsContainer"><div class="mpr-MonthsWrapper">';
            for(m=0; m < 12; m++){
                var monthval;
                if((m+1) < 10)
                    monthval = "0" + (m+1);
                else
                    monthval = "" + (m+1);
                content += '<span data-month="' + monthval  + '" class="col-xs-3 mpr-month">' + settings.MONTHS[m] + '</span>';
            }
            content += '</div></div></div></div>';
        }
        content += '<div class="col-xs-1"> <h5 class="mpr-quickset">Quick Set</h5>';
        content += '<button class="btn btn-info mpr-fiscal-ytd">Fiscal YTD</button>';
        content += '<button class="btn btn-info mpr-ytd">Year to date</button>';
        content += '<button class="btn btn-info mpr-prev-fiscal">Previous FY</button>';
        content += '<button class="btn btn-info mpr-prev-year">Previous Year</button>';
        content += '</div>';
        content += '</div>';

        // this.append(content);//in popover
        console.log("init : "+container.attr('id'));
        var mprVisible = false;
        var mprpopover = container.find('.mrp-container').popover({
            container: container,//"body",
            placement: "bottom",
            html: true,
            content: content
        }).on('show.bs.popover', function () {
            console.log(container.attr("id") + " : " + ".mrp-container show.bs.popover");
            container.find('.popover').remove();
            var waiter = setInterval(function(){
                if(container.find('.popover').length > 0){
                    clearInterval(waiter);
                    container = setViewToCurrentYears(container);
                    container = paintMonths(container);
                }
            },50);
        }).on('shown.bs.popover', function(){
            console.log(container.attr("id") + " : " + ".mrp-container shown.bs.popover");
            mprVisible = true;
        }).on('hidden.bs.popover', function(){
            console.log(container.attr("id") + " : " + ".mrp-container hidden.bs.popover");
            mprVisible = false;
        });

        container.on('click','.mpr-month',function(e){
            e.stopPropagation();
            console.log(container.attr("id") + " : " + ".mpr-month");
            $month = $(this);
            var monthnum = $month.data('month');
            var year = $month.parents('.mpr-calendar').children('h5').children('span').html();
            console.log("clicked : " + year+"-"+monthnum);
            if($month.parents('.mpr-calendar-1').length > 0){
                //Start Date
                settings.cStartDate = parseInt("" + year + monthnum);
                if(settings.cStartDate > settings.cEndDate){

                    if(year != parseInt(settings.cEndDate/100))
                        container.find('.mpr-calendar:last h5 span').html(year);
                    settings.cEndDate = settings.cStartDate;
                }
            }else{
                //End Date
                settings.cEndDate = parseInt("" + year + monthnum);
                if(settings.cStartDate > settings.cEndDate){
                    if(year != parseInt(settings.cStartDate/100))
                        container.find('.mpr-calendar:first h5 span').html(year);
                    settings.cStartDate = settings.cEndDate;
                }
            }

            container = paintMonths(container);
        });

        container.on('click','.mpr-yearup',function(e){
            console.log(container.attr("id") + " : " + ".mpr-yearup");
            e.stopPropagation();
            var year = parseInt($(this).prev().html());
            year++;
            $(this).prev().html(""+year);
            $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                container = paintMonths(container);
                $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-yeardown',function(e){
            console.log(container.attr("id") + " : " + ".mpr-yeardown");
            e.stopPropagation();
            var year = parseInt($(this).next().html());
            year--;
            $(this).next().html(""+year);
            //container = paintMonths(container);
            $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                container = paintMonths(container);
                $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-ytd', function(e){
            console.log(container.attr("id") + " : " + ".mpr-ytd");
            e.stopPropagation();
            var d = new Date();
            settings.cStartDate = parseInt(d.getFullYear() + "01");
            var month = d.getMonth() + 1;
            if(month < 9)
                month = "0" + month;
            settings.cEndDate = parseInt("" + d.getFullYear() + month);
            container.find('.mpr-calendar').each(function(){
                var $cal = $(this);
                var year = $cal.find('h5 span').html(d.getFullYear());
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                container = paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-prev-year', function(e){
            console.log(container.attr("id") + " : " + ".mpr-prev-year");
            e.stopPropagation();
            var d = new Date();
            var year = d.getFullYear()-1;
            settings.cStartDate = parseInt(year + "01");
            settings.cEndDate = parseInt(year + "12");
            container.find('.mpr-calendar').each(function(){
                var $cal = $(this);
                $cal.find('h5 span').html(year);
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                container = paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-fiscal-ytd', function(e){
            console.log(container.attr("id") + " : " + ".mpr-fiscal-ytd");
            e.stopPropagation();
            var d = new Date();
            var year;
            if((d.getMonth()+1) < settings.fiscalDate.month)
                year = d.getFullYear() - 1;
            else
                year = d.getFullYear();
            if(settings.fiscalDate.month < 10)
                fm = "0" + settings.fiscalDate.month;
            else
                fm = settings.fiscalDate.month;
            if(d.getMonth()+1 < 10)
                cm = "0" + (d.getMonth()+1);
            else
                cm = (d.getMonth()+1);
            settings.cStartDate = parseInt("" + year + fm);
            settings.cEndDate = parseInt("" + d.getFullYear() + cm);
            container.find('.mpr-calendar').each(function(i){
                var $cal = $(this);
                if(i == 0)
                    $cal.find('h5 span').html(year);
                else
                    $cal.find('h5 span').html(d.getFullYear());
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                container = paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-prev-fiscal', function(){
            console.log(container.attr("id") + " : " + ".mpr-prev-ytd");
            var d = new Date();
            var year;
            if((d.getMonth()+1) < settings.fiscalDate.month)
                year = d.getFullYear() - 2;
            else
                year = d.getFullYear() - 1;
            if(settings.fiscalDate.month < 10)
                fm = "0" + settings.fiscalDate.month;
            else
                fm = settings.fiscalDate.month;
            if(settings.fiscalDate.month -1 < 10)
                efm = "0" + (settings.fiscalDate.month-1);
            else
                efm = (settings.fiscalDate.month-1);
            settings.cStartDate = parseInt("" + year + fm);
            settings.cEndDate = parseInt("" + (d.getFullYear() - 1) + efm);
            container.find('.mpr-calendar').each(function(i){
                var $cal = $(this);
                if(i == 0)
                    $cal.find('h5 span').html(year);
                else
                    $cal.find('h5 span').html(d.getFullYear()-1);
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                container = paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-calendarholder',function(e){
            console.log(container.attr("id") + " : " + ".mpr-calendarholder");
            e.preventDefault();
            e.stopPropagation();
        });
        container.on("click",".mrp-container",function(e){
            console.log(container.attr("id") + " : " + ".mpr-container");
            if(mprVisible){
                e.preventDefault();
                e.stopPropagation();
                mprVisible = false;
            }
        });
        container.on("click",function(e){
            if(mprVisible){
                container.find('.mpr-calendarholder').parents('.popover').fadeOut(200,function(){
                    container.find('.mpr-calendarholder').parents('.popover').remove();
                    container.find('.mrp-container').trigger('click');
                });
                mprVisible = false;
            }
        });

        paintMonths = function(_this) {
            console.log(_this.attr("id") + " : " + "paint months");
            console.log(settings);
            _this.find('.mpr-calendar').each(function(){
                var $cal = $(this);
                var year = $cal.find('h5 span').html();
                $cal.find('.mpr-month').each(function(i){
                    if((i+1) > 9)
                        cDate = parseInt("" + year + (i+1));
                    else
                        cDate = parseInt("" + year+ '0' + (i+1));
                    if(cDate >= settings.cStartDate && cDate <= settings.cEndDate){
                        $(this).addClass('mpr-selected');
                    }else{
                        $(this).removeClass('mpr-selected');
                    }
                });
            });
            _this.find('.mpr-calendar .mpr-month').css("background","");
            //Write Text
            var startyear = parseInt(settings.cStartDate / 100);
            var startmonth = parseInt(safeRound((settings.cStartDate / 100 - startyear)) * 100);
            var endyear = parseInt(settings.cEndDate / 100);
            var endmonth = parseInt(safeRound((settings.cEndDate / 100 - endyear)) * 100);
            console.log(startyear + "-" + startmonth + "| " + endyear+"-"+endmonth);
            //edit container values
            _this.find('.mrp-monthdisplay .mrp-lowerMonth').html(settings.MONTHS[startmonth - 1] + " " + startyear);
            _this.find('.mrp-monthdisplay .mrp-upperMonth').html(settings.MONTHS[endmonth - 1] + " " + endyear);
            _this.find('.mrp-lowerDate').val(settings.cStartDate);
            _this.find('.mrp-upperDate').val(settings.cEndDate);
            //paint months
            if(startyear == parseInt(_this.find('.mpr-calendar:first h5 span').html()))
                _this.find('.mpr-calendar:first .mpr-selected:first').css("background","#40667A");
            if(endyear == parseInt(_this.find('.mpr-calendar:last h5 span').html()))
                _this.find('.mpr-calendar:last .mpr-selected:last').css("background","#40667A");

            return _this;
        };

        setViewToCurrentYears = function(_this) {
            var startyear = parseInt(settings.cStartDate / 100);
            var endyear = parseInt(settings.cEndDate / 100);
            _this.find('.mpr-calendar h5 span').eq(0).html(startyear);
            _this.find('.mpr-calendar h5 span').eq(1).html(endyear);

            return _this;
        }

        safeRound = function(val) {
            return Math.round(((val)+ 0.00001) * 100) / 100;
        }
        
        return container;
    };
    

    // Plugin defaults – added as a property on our plugin function.
    $.fn.responsiveMonthRange.defaults = {
        MONTHS: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        defaultDate : {
            start : {
                year: 2014,
                month: 3
            },
            end : {
                year: 2015,
                month: 10
            }
        },
        fiscalDate: {
            month: 7
        }
    };

}( jQuery ));
