/**
 * Created by xilan on 2014/9/12.
 */
    //date
date='2014-08-01';
time='13;'
Calendar.setup({
    cont: "datetime",
    selectionType:Calendar.SEL_SINGLE,
    onSelect:function(date1){
        var date_time=date1.date;
        //  console.log(date_time);
        date = Calendar.printDate(date_time, "%Y-%m-%d");//UTC timeformat
        console.log(date)
        datetime=date+"-"+time;

        map(datetime);
    }
});
/// slider
var width=300;
var x=d3.scale.linear().domain([0,23])
    .range([0,width]).clamp(true);
var axis=d3.svg.axis().scale(x).tickFormat(function(d){
    if(d<10)return "0"+d+":00";
    else return d+':00';
})

d3.select('.slider').call(d3.slider().axis(axis).min(0).max(23).step(1).on("slide",function(evt,value){
    time=value;
    if(value<10){
        time="0"+value.toString();
    }
    datetime=date+"-"+time;
    map(datetime);
    console.log(datetime);
}));
///

////map


//preprocess data //加载csv文件数据
country_data=[];
state_data=[];
city_data=[];
d3.csv("transation.csv", function (csv_data) {
    // country(datetime, csv_data);
    country_data = d3.nest() .key(function (d) {
        //var format=d3.format("%Y-%m-%d");
        var time = d. purchaseTime.substring(0, 13 );
        return time;})
        .key(function (d) {
            return d.country;
        })
        .rollup(function (leaves) {
            return  leaves.length;
        })
        .entries(csv_data);
    // $("#ex1").html(JSON.stringify(country_data, null, 3));
    // var data=country_data[0].values;


    //  state(datetime, csv_data);
    state_data = d3.nest() .key( function (d) {
        //var format=d3.format("%Y-%m-%d");
        var time = d. purchaseTime.substring(0, 13);
        return time; })
        .key( function (d) {
            return d.state;
        })
        .rollup(function (leaves) {
            return leaves.length;
        })
        .entries(csv_data);

    // $("#ex2").html(JSON.stringify(state_data, null, 3));


    // city( datetime, csv_data);
    city_data = d3.nest() .key(function (d) {
        //var format=d3.format("%Y-%m-%d");
        var time = d.purchaseTime.substring(0, 13);
        return time; })
        .key(function (d) {
            return d. city; } )
        .rollup( function (leaves) {
            return leaves.length;
        })
        .entries(csv_data);
    // $("#ex3").html(JSON.stringify(city_data, null, 3));

});
///load data
function load_data(datetime){

    //COUNTRY
    data_country =d3.map();
    for (var i = 0; i < country_data.length; i++) {
        if (country_data[i].key == datetime) {
            var d = country_data[i].values;
            for (var j = 0; j < d.length; j++) {
                data_country.set(d[j].key, d[j].values);
            }
        }
    }
    //STATE
    data_state = d3.map();
    for (var i = 0 ; i < state_data.length ; i++) {
        if ( state_data[i].key == datetime) {
            var d = state_data[i].values;
            for (var j = 0; j < d.length; j++) {
                data_state.set(d[j]. key  , d[j].values);
            }
        }
    }
    //CITY
    data_city = d3. map();
    for (var i = 0; i < city_data.length; i++ ) {
        if (city_data[i].key ==datetime) {

            var d = city_data[i].values;
            for (var j = 0; j < d.length; j++) {
                data_city.set(d[j].key, d[j].values);
            }
        }
    }

}
//Create map
var m_width = $(".map").width(),
    width = 1000,
    height = 500,
    country,
    state;
count = 0;
var color = d3.scale.category20()
/*   var color = d3.scale.ordinal()
 .domain(d3.range(9).reverse())
 //.range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);
 .range(["rgba(255, 255, 255, 0.8)","rgba(14, 241, 242, 0.8)","rgba(37, 140, 249, 0.8)"]);
 */
// var datetime=date+"-"+time;
//    console.log(date);
//    console.log(time);
//create a map like map function in java
var rateById = d3 . map( );
var rateById1 = d3 . map( );
// create a scale called quantize  a linear scale with a discrete range
var quantize = d3.scale.
    quantize()
    .domain([0,1])
    .range(d3.range(5).map( function (i) {return "q" + i%5 + "-9";}));

var quantize1 = d3.scale.
    quantize()
    .domain([0,1])
    .range(d3.range(5).map( function (i) {return "p" + i%5 + "-9";}));

var projection = d3.geo .mercator(). scale(150) . translate([width / 2, height / 1.5]);

var path = d3.geo.path() .projection(projection);
var svg = d3.select(".map").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox" , "0 0 " + width + " " +height)
    .attr ("width", m_width)
    .attr("height", m_width * height / width);


svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    . attr("height", height)
    .on("click", country_clicked);
var g = svg.append("g");

d3.json("nations_geo.json", function(data) {


});
///
d3.json("countries.topo.json", function (error, us) {

    svg_circle= g.selectAll("circle")
        .data(topojson.feature(us, us.objects.countries) .features);


    svg_circle .enter()
        .append("circle")
        .attr("transform",function(d){
            return"translate("+path.centroid(d)+")";
        })
        .attr("r", 2)
        .style("fill", "greenyellow")
        .style("opacity", 0.75);

    setInterval(function() {
        svg_circle .enter()
            .append("circle")
            .attr("class", "ring")
            .attr("transform",function(d){
                return"translate("+path.centroid(d)+")";
            })
            .attr("r",0)
            .style("fill",'greenyellow')
            .style("stroke-width",2)
            .style("stroke",'lime')
            .transition()
            .ease("bound")
            .duration(6000)
            .style("stroke-opacity",0)
            .style("stroke-width",0 )
            // .style("stroke", "gold")
            .attr("r", function(){
                return Math.random()*13;
            }).remove();
    }, 1000);




    countrys_path=  g.append("g")
        .attr("id",  "countries")
        .selectAll( "path")
        .data(topojson.feature(us, us.objects.countries) .features)
    countrys_path.exit().remove();
    countrys_path .enter()
        .append("path")
        .attr("id", function (d) {
            rateById.set(d.id, Math.random());
            //此处放置的国家的id和对应的购买量
            return d.id;
        })
        .attr("centroid", function(d) {
            return path.centroid(d);
        })
        .attr("name", function (d) {
            return d.properties.name;
        })
        .attr("class", function(d,i) {
            //return color(Math.min(9, Math.floor(Math.random()*10)));
            return quantize(rateById.get(d.id));
            //  return color(i);
            //   return quantize1(rateById.get(d.id));

        })
        .  style("stroke-width", "1px")
        /*  . style("fill", function(d,i){
         return color(i);
         })*/
        . attr("d", path)
        .on("click", country_clicked)
        .on ("mouseover", country_mouseover)
        .on( "mouseout",country_mouseout);

    // console.log(countrys_path.attr(centroid));

});
///


///
function
    zoom(xyz) {
    g.transition()
        .duration(750 )
        .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[ 0] + ",-" + xyz[1] + ")")
        . selectAll(["#countries", "#states", "#cities"]) // .style("stroke-width", 0.1+ "px")
        . selectAll(".city")
        . attr("d", path.pointRadius(20.0 / xyz[2]));
}

function get_xyz(d) {
    var bounds = path.bounds(d) ;
    var w_scale = ( bounds[1][0] - bounds[0][0]) / width;
    var h_scale = (bounds[1][1] - bounds[0][1]) / height;
    var z = .96 / Math .max(w_scale,h_scale);
    var x = (bounds[1][0]+ bounds[0][0]) / 2;
    var y = (bounds[1][1] + bounds[0][1]) / 2 + ( height / z / 6);
    return [x, y, z];
}

function country_clicked(d) {

    g. selectAll([ "#states", "#cities"]). remove();
    state = null;

    if (country) {
        g.selectAll("#" + country.id).style('display', null);
    }

    if (d && country !== d) {
        var xyz = get_xyz(d);

        country = d;

        if (d.id  == 'USA' || d.id == 'JPN') {
            d3.json("states_" + d.id.toLowerCase() + ".topo.json", function(error, us) {
                country_path= g.append("g")
                    .attr("id", "states").selectAll("path")
                    .data(topojson.feature(us, us.objects.states).features)
                country_path.exit().remove();
                country_path .enter()
                    .append("path")
                    .attr("id", function (d) {

                        rateById1.set(d.id, Math.random());
                        //此处放置的国家的id和对应的购买量
                        return d.id;
                    })
                    // .attr("class", "active")
                    . attr("d", path)
                    . attr("class",function(d,i) {   return quantize1(rateById1.get(d.id));})
                    .on("click", state_clicked)
                    .on( "mouseover", state_mouseover)
                    .on("mouseout", state_mouseout);

                zoom(xyz );
                g.selectAll( "#" + d.id)
                    .style('display',  'none');

            });
        } else {
            zoom(xyz);
        }
    } else {
        var xyz = [ width / 2, height / 1.5, 1];
        country = null;
        zoom(xyz);
    }
}

function country_mouseover(d){
    var X=d3.event. pageX;
    var Y=d3.event.pageY; // var  count=0;
    count=data_country.get(d.properties.name);
    console.log("country mouseover"+ data_country.get(d.properties.name));
    var name=d.properties. name;
    tooltip(X,Y,name,count,0);


}

function state_clicked(d) {
    g.selectAll("#cities").remove();

    if (d && state !== d) {
        var xyz = get_xyz(d);
        state = d;
        country_code = state.id.substring(0, 3). toLowerCase();
        state_name = state.properties.name;

        d3.json( "cities_" + country_code + ".topo.json", function(error, us) {
            state_path= g.append("g")
                .attr("id", "cities")
                . selectAll("path")
                .data(topojson.feature(us, us. objects. cities). features.filter(function(d) {
                    return state_name == d.properties.state; }))
            state_path.exit().remove();
            state_path .enter()
                .append("path")
                .attr("id", function(d) {
                    return d .properties.name; })
                .attr("class", "city")
                .style("fill","gold")
                .attr("d", path.pointRadius( 5/ xyz[2]))
                .on("mouseover" ,city_mouseover)
                .on("mouseout",city_mouseout);


            zoom(xyz)
            ;
        });
    } else {
        state =null;

        country_clicked(country );
    }
}

function state_mouseover(d){

    var X=d3.event.pageX;
    var Y=d3.event.pageY;
    // var  count=0;
    count=data_state.get(d.properties.name);
    var name=d.properties. name;
    tooltip(X,Y,name,count,1);

}
function city_mouseover(d){

    var X=d3.event.pageX;
    var Y=d3.event.pageY; //  var  count=0;
    count= data_city.get(d.properties. name);
    console.log("city;"+d. properties.name+ count)
    var name=d.properties. name;
    tooltip(X,Y,name,count,2);


}
function  country_mouseout(){
    d3.select("#tooltip").classed("hidden",true);
}
function  state_mouseout(){
    d3.select("#tooltip").classed("hidden",true);
}
function  city_mouseout(){
    d3.select("#tooltip").classed("hidden",true);
}
function tooltip(X,Y,name,count,i){
    var color=['green','orange','red'];
    var tooltip=d3.select("#tooltip")
        .style("left" , X+"px")
        .style( "top",  Y+"px")
        .style("background-color","#1b1b1b");

    tooltip.
        select("#value")
        .text(name)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("font-weight", "bold");

    tooltip.select("#number")
        .text(count)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("font-weight", "bold")
        .style("font-color",function(){
            return color[i];
        });

    d3.select("#tooltip").classed("hidden",false);
}
$(window).resize(function() {
    var w = $("#map").width();
    svg.attr("width", w);
    svg.attr("height", w * height / width);
});
///

function map(datetime) {
    load_data(datetime);

}

// datetime="2014-08-01-13";
map(datetime);
