
(function ( $ ) {

    $.fn.responsiveMonthRange = function( options ) {
        var settings = $.extend({}, $.fn.responsiveMonthRange.defaults, options);
        console.log(settings);

        if(settings.startMonth < 10)
            settings.startDate = parseInt("" + settings.startYear + '0' + settings.startMonth + "");
        else
            settings.startDate = parseInt("" + settings.startYear  + settings.startMonth + "");
        if(settings.endMonth < 10)
            settings.endDate = parseInt("" + settings.endYear + '0' + settings.endMonth + "");
        else
            settings.endDate = parseInt("" + settings.endYear + settings.endMonth + "");
        
        // container.addClass('mrp-container nav navbar-nav');
        var container = this;
        this.append('<div class="mrp-container nav navbar-nav">' +
            '<span class="mrp-icon"><i class="fa fa-calendar"></i></span>' +
            '<div class="mrp-monthdisplay">' +
            '<span class="mrp-lowerMonth">Jul 2014</span>' +
            '<span class="mrp-to"> to </span>' +
            '<span class="mrp-upperMonth">Aug 2014</span>' +
            '</div>' +
            '<input type="hidden" value="201407" id="mrp-lowerDate" />' +
            '<input type="hidden" value="201408" id="mrp-upperDate" />' +
        '</div>');
        var content = '<div class="row mpr-calendarholder">';
        var calendarCount = settings.endYear - settings.startYear;
        if(calendarCount == 0)
            calendarCount++;
        var d = new Date();
        for(y = 0; y < 2; y++){
            content += '<div class="col-xs-6" ><div class="mpr-calendar row" id="mpr-calendar-' + (y+1) + '">'
                + '<h5 class="col-xs-12"><i class="mpr-yeardown fa fa-chevron-circle-left"></i><span>' + (settings.startYear + y).toString() + '</span><i class="mpr-yearup fa fa-chevron-circle-right"></i></h5><div class="mpr-monthsContainer"><div class="mpr-MonthsWrapper">';
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
        content += '<button class="btn btn-info mpr-ytd">YTD</button>';
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
                    setViewToCurrentYears(container);
                    paintMonths(container);
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
            if($month.parents('#mpr-calendar-1').length > 0){
                //Start Date
                settings.startDate = parseInt("" + year + monthnum);
                if(settings.startDate > settings.endDate){

                    if(year != parseInt(settings.endDate/100))
                        container.find('.mpr-calendar:last h5 span').html(year);
                    settings.endDate = settings.startDate;
                }
            }else{
                //End Date
                settings.endDate = parseInt("" + year + monthnum);
                if(settings.startDate > settings.endDate){
                    if(year != parseInt(settings.startDate/100))
                        container.find('.mpr-calendar:first h5 span').html(year);
                    settings.startDate = settings.endDate;
                }
            }

            paintMonths(container);
        });

        container.on('click','.mpr-yearup',function(e){
            console.log(container.attr("id") + " : " + ".mpr-yearup");
            e.stopPropagation();
            var year = parseInt($(this).prev().html());
            year++;
            $(this).prev().html(""+year);
            $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                paintMonths(container);
                $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-yeardown',function(e){
            console.log(container.attr("id") + " : " + ".mpr-yeardown");
            e.stopPropagation();
            var year = parseInt($(this).next().html());
            year--;
            $(this).next().html(""+year);
            //paintMonths(container);
            $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                paintMonths(container);
                $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-ytd', function(e){
            console.log(container.attr("id") + " : " + ".mpr-ytd");
            e.stopPropagation();
            var d = new Date();
            settings.startDate = parseInt(d.getFullYear() + "01");
            var month = d.getMonth() + 1;
            if(month < 9)
                month = "0" + month;
            settings.endDate = parseInt("" + d.getFullYear() + month);
            container.find('.mpr-calendar').each(function(){
                var $cal = $(this);
                var year = container.find('h5 span',$cal).html(d.getFullYear());
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-prev-year', function(e){
            console.log(container.attr("id") + " : " + ".mpr-prev-year");
            e.stopPropagation();
            var d = new Date();
            var year = d.getFullYear()-1;
            settings.startDate = parseInt(year + "01");
            settings.endDate = parseInt(year + "12");
            container.find('.mpr-calendar').each(function(){
                var $cal = $(this);
                container.find('h5 span',$cal).html(year);
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-fiscal-ytd', function(e){
            console.log(container.attr("id") + " : " + ".mpr-fiscal-ytd");
            e.stopPropagation();
            var d = new Date();
            var year;
            if((d.getMonth()+1) < settings.fiscalMonth)
                year = d.getFullYear() - 1;
            else
                year = d.getFullYear();
            if(settings.fiscalMonth < 10)
                fm = "0" + settings.fiscalMonth;
            else
                fm = settings.fiscalMonth;
            if(d.getMonth()+1 < 10)
                cm = "0" + (d.getMonth()+1);
            else
                cm = (d.getMonth()+1);
            settings.startDate = parseInt("" + year + fm);
            settings.endDate = parseInt("" + d.getFullYear() + cm);
            container.find('.mpr-calendar').each(function(i){
                var $cal = $(this);
                if(i == 0)
                    container.find('h5 span',$cal).html(year);
                else
                    container.find('h5 span',$cal).html(d.getFullYear());
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                paintMonths(container);
                container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        container.on('click','.mpr-prev-fiscal', function(){
            console.log(container.attr("id") + " : " + ".mpr-prev-ytd");
            var d = new Date();
            var year;
            if((d.getMonth()+1) < settings.fiscalMonth)
                year = d.getFullYear() - 2;
            else
                year = d.getFullYear() - 1;
            if(settings.fiscalMonth < 10)
                fm = "0" + settings.fiscalMonth;
            else
                fm = settings.fiscalMonth;
            if(settings.fiscalMonth -1 < 10)
                efm = "0" + (settings.fiscalMonth-1);
            else
                efm = (settings.fiscalMonth-1);
            settings.startDate = parseInt("" + year + fm);
            settings.endDate = parseInt("" + (d.getFullYear() - 1) + efm);
            container.find('.mpr-calendar').each(function(i){
                var $cal = $(this);
                if(i == 0)
                    container.find('h5 span',$cal).html(year);
                else
                    container.find('h5 span',$cal).html(d.getFullYear()-1);
            });
            container.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                paintMonths(container);
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
            _this.find('.mpr-calendar').each(function(){
                var $cal = $(this);
                var year = _this.find('h5 span',$cal).html();
                _this.find('.mpr-month',$cal).each(function(i){
                    if((i+1) > 9)
                        cDate = parseInt("" + year + (i+1));
                    else
                        cDate = parseInt("" + year+ '0' + (i+1));
                    if(cDate >= settings.startDate && cDate <= settings.endDate){
                        $(this).addClass('mpr-selected');
                    }else{
                        $(this).removeClass('mpr-selected');
                    }
                });
            });
            _this.find('.mpr-calendar .mpr-month').css("background","");
            //Write Text
            var startyear = parseInt(settings.startDate / 100);
            var startmonth = parseInt(safeRound((settings.startDate / 100 - startyear)) * 100);
            var endyear = parseInt(settings.endDate / 100);
            var endmonth = parseInt(safeRound((settings.endDate / 100 - endyear)) * 100);
            _this.find('.mrp-monthdisplay .mrp-lowerMonth').html(settings.MONTHS[startmonth - 1] + " " + startyear);
            _this.find('.mrp-monthdisplay .mrp-upperMonth').html(settings.MONTHS[endmonth - 1] + " " + endyear);
            _this.find('.mpr-lowerDate').val(settings.startDate);
            _this.find('.mpr-upperDate').val(settings.endDate);
            if(startyear == parseInt(_this.find('.mpr-calendar:first h5 span').html()))
                _this.find('.mpr-calendar:first .mpr-selected:first').css("background","#40667A");
            if(endyear == parseInt(_this.find('.mpr-calendar:last h5 span').html()))
                _this.find('.mpr-calendar:last .mpr-selected:last').css("background","#40667A");

            return _this;
        };

        setViewToCurrentYears = function(_this) {
            var startyear = parseInt(settings.startDate / 100);
            var endyear = parseInt(settings.endDate / 100);
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
        startMonth: 7,
        startYear: 2014,
        endMonth: 8,
        endYear: 2015,
        fiscalMonth: 7
    };

}( jQuery ));
