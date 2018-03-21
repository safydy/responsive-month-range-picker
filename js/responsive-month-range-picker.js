
(function ( $ ) {

    $.fn.responsiveMonthRange = function( options ) {
        // Plugin defaults – added as a property on our plugin function.
        var defaults = {
            MONTHS: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            startMonth: 7,
            startYear: 2014,
            endMonth: 8,
            endYear: 2015,
            fiscalMonth: 7
        };
        // This is the easiest way to have default options.
        var settings = $.extend({}, defaults, options);
        console.log(settings);

        if(settings.startMonth < 10)
            settings.startDate = parseInt("" + settings.startYear + '0' + settings.startMonth + "");
        else
            settings.startDate = parseInt("" + settings.startYear  + settings.startMonth + "");
        if(settings.endMonth < 10)
            settings.endDate = parseInt("" + settings.endYear + '0' + settings.endMonth + "");
        else
            settings.endDate = parseInt("" + settings.endYear + settings.endMonth + "");


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
        
        this.on('click','.mpr-month',function(e){
            e.stopPropagation();
            $month = $(this);
            var monthnum = $month.data('month');
            var year = $month.parents('.mpr-calendar').children('h5').children('span').html();
            if($month.parents('#mpr-calendar-1').length > 0){
                //Start Date
                settings.startDate = parseInt("" + year + monthnum);
                if(settings.startDate > settings.endDate){

                    if(year != parseInt(settings.endDate/100))
                        this.find('.mpr-calendar:last h5 span').html(year);
                    settings.endDate = settings.startDate;
                }
            }else{
                //End Date
                settings.endDate = parseInt("" + year + monthnum);
                if(settings.startDate > settings.endDate){
                    if(year != parseInt(settings.startDate/100))
                        this.find('.mpr-calendar:first h5 span').html(year);
                    settings.startDate = settings.endDate;
                }
            }

            $.fn.paintMonths();
        });
        
        this.on('click','.mpr-yearup',function(e){
            e.stopPropagation();
            var year = parseInt($(this).prev().html());
            year++;
            $(this).prev().html(""+year);
            $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                $.fn.paintMonths();
                $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        this.on('click','.mpr-yeardown',function(e){
            e.stopPropagation();
            var year = parseInt($(this).next().html());
            year--;
            $(this).next().html(""+year);
            //paintMonths();
            $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                $.fn.paintMonths();
                $(this).parents('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        this.on('click','.mpr-ytd', function(e){
            e.stopPropagation();
            var d = new Date();
            settings.startDate = parseInt(d.getFullYear() + "01");
            var month = d.getMonth() + 1;
            if(month < 9)
                month = "0" + month;
            settings.endDate = parseInt("" + d.getFullYear() + month);
            this.find('.mpr-calendar').each(function(){
                var $cal = $(this);
                var year = this.find('h5 span',$cal).html(d.getFullYear());
            });
            this.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                $.fn.paintMonths();
                this.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        this.on('click','.mpr-prev-year', function(e){
            e.stopPropagation();
            var d = new Date();
            var year = d.getFullYear()-1;
            settings.startDate = parseInt(year + "01");
            settings.endDate = parseInt(year + "12");
            this.find('.mpr-calendar').each(function(){
                var $cal = $(this);
                this.find('h5 span',$cal).html(year);
            });
            this.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                $.fn.paintMonths();
                this.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        this.on('click','.mpr-fiscal-ytd', function(e){
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
                fm = fiscalMonth;
            if(d.getMonth()+1 < 10)
                cm = "0" + (d.getMonth()+1);
            else
                cm = (d.getMonth()+1);
            settings.startDate = parseInt("" + year + fm);
            settings.endDate = parseInt("" + d.getFullYear() + cm);
            this.find('.mpr-calendar').each(function(i){
                var $cal = $(this);
                if(i == 0)
                    this.find('h5 span',$cal).html(year);
                else
                    this.find('h5 span',$cal).html(d.getFullYear());
            });
            this.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                $.fn.paintMonths();
                this.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        this.on('click','.mpr-prev-fiscal', function(){
            var d = new Date();
            var year;
            if((d.getMonth()+1) < settings.fiscalMonth)
                year = d.getFullYear() - 2;
            else
                year = d.getFullYear() - 1;
            if(settings.fiscalMonth < 10)
                fm = "0" + fiscalMonth;
            else
                fm = settings.fiscalMonth;
            if(settings.fiscalMonth -1 < 10)
                efm = "0" + (settings.fiscalMonth-1);
            else
                efm = (settings.fiscalMonth-1);
            settings.startDate = parseInt("" + year + fm);
            settings.endDate = parseInt("" + (d.getFullYear() - 1) + efm);
            this.find('.mpr-calendar').each(function(i){
                var $cal = $(this);
                if(i == 0)
                    this.find('h5 span',$cal).html(year);
                else
                    this.find('h5 span',$cal).html(d.getFullYear()-1);
            });
            this.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeOut(175,function(){
                $.fn.paintMonths();
                this.find('.mpr-calendar').find('.mpr-MonthsWrapper').fadeIn(175);
            });
        });

        var mprVisible = false;
        var mprpopover = this.find('.mrp-container').popover({
            container: "body",
            placement: "bottom",
            html: true,
            content: content
        }).on('show.bs.popover', function () {
            this.find('.popover').remove();
            var waiter = setInterval(function(){
                if(this.find('.popover').length > 0){
                    clearInterval(waiter);
                    this.setViewToCurrentYears();
                    $.fn.paintMonths();
                }
            },50);
        }).on('shown.bs.popover', function(){
            mprVisible = true;
        }).on('hidden.bs.popover', function(){
            mprVisible = false;
        });

        this.on('click','.mpr-calendarholder',function(e){
            e.preventDefault();
            e.stopPropagation();
        });
        this.on("click",".mrp-container",function(e){
            if(mprVisible){
                e.preventDefault();
                e.stopPropagation();
                mprVisible = false;
            }
        });
        this.on("click",function(e){
            if(mprVisible){
                this.find('.mpr-calendarholder').parents('.popover').fadeOut(200,function(){
                    this.find('.mpr-calendarholder').parents('.popover').remove();
                    this.find('.mrp-container').trigger('click');
                });
                mprVisible = false;
            }
        });

        this.append(content);
        return this;
    };

    $.fn.paintMonths = function(_this) {

        console.log(_this.settings);
        _this.find('.mpr-calendar').each(function(){
            var $cal = $(this);
            var year = this.find('h5 span',$cal).html();
            _this.find('.mpr-month',$cal).each(function(i){
                if((i+1) > 9)
                    cDate = parseInt("" + year + (i+1));
                else
                    cDate = parseInt("" + year+ '0' + (i+1));
                if(cDate >= _this.settings.startDate && cDate <= _this.settings.endDate){
                    $(this).addClass('mpr-selected');
                }else{
                    $(this).removeClass('mpr-selected');
                }
            });
        });
        _this.find('.mpr-calendar .mpr-month').css("background","");
        //Write Text
        var startyear = parseInt(this.settings.startDate / 100);
        var startmonth = parseInt(this.safeRound((this.settings.startDate / 100 - startyear)) * 100);
        var endyear = parseInt(this.settings.endDate / 100);
        var endmonth = parseInt(this.safeRound((this.settings.endDate / 100 - endyear)) * 100);
        this.find('.mrp-monthdisplay .mrp-lowerMonth').html(this.settings.MONTHS[startmonth - 1] + " " + startyear);
        this.find('.mrp-monthdisplay .mrp-upperMonth').html(this.settings.MONTHS[endmonth - 1] + " " + endyear);
        this.find('.mpr-lowerDate').val(this.settings.startDate);
        this.find('.mpr-upperDate').val(this.settings.endDate);
        if(startyear == parseInt(this.find('.mpr-calendar:first h5 span').html()))
            this.find('.mpr-calendar:first .mpr-selected:first').css("background","#40667A");
        if(endyear == parseInt(this.find('.mpr-calendar:last h5 span').html()))
            this.find('.mpr-calendar:last .mpr-selected:last').css("background","#40667A");

        return this;
    };

    $.fn.setViewToCurrentYears = function() {
        var startyear = parseInt(this.settings.startDate / 100);
        var endyear = parseInt(this.settings.endDate / 100);
        this.find('.mpr-calendar h5 span').eq(0).html(startyear);
        this.find('.mpr-calendar h5 span').eq(1).html(endyear);

        return this;
    }

    $.fn.safeRound = function(val) {
        return Math.round(((val)+ 0.00001) * 100) / 100;
    }

}( jQuery ));
